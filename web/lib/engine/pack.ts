// Packfile indexing, the same job `git index-pack` does: inflate every object once, resolve deltas
// depth-first, hash, and keep only what the replay needs (commit headers, raw trees, blob line counts).
import { createHash } from 'node:crypto';
import { inflateSync } from 'node:zlib';
import { classify, identOf } from './agents.js';

export interface Commit {
  sha: string;
  tree: string;
  parents: string[];
  at: number;            // author time, unix seconds
  atOff: number;         // author UTC offset, minutes east
  ct: number;            // committer time, unix seconds
  who: string;           // '' human, 'bot', or an agent id (agents.ts); the identity and message are not kept
}

export interface BlobInfo { lines: number; bin: boolean }

interface Loc { pack: Buffer; start: number; type: number; base: string | null }

const TYPE_NAME = ['', 'commit', 'tree', 'blob', 'tag'];
const OFS_DELTA = 6, REF_DELTA = 7;
const BINARY_PROBE = 8000;    // git's buffer_is_binary(): a NUL in the first 8000 bytes

export class ObjectDB {
  commits = new Map<string, Commit>();
  trees = new Map<string, Buffer>();
  blobs = new Map<string, BlobInfo>();
  objects = 0;
  packBytes = 0;
  private locs = new Map<string, Loc>();      // where each object lives, to read one again later
  private keepLocs = true;

  /** Forget object locations (and with them the pack buffers) once nothing more needs reading. */
  releaseReads() { this.locs.clear(); this.keepLocs = false; }

  /** Index one packfile. Throws if a delta's base is neither in this pack nor already known. */
  addPack(pack: Buffer): void {
    if (pack.length < 32 || pack.toString('latin1', 0, 4) !== 'PACK') throw new Error('not a packfile');
    const version = pack.readUInt32BE(4);
    if (version !== 2 && version !== 3) throw new Error(`unsupported pack version ${version}`);
    const count = pack.readUInt32BE(8);
    this.packBytes += pack.length;

    // pass 1: walk the pack. Whole objects are processed on the spot; deltas are parked with their
    // (small) inflated instruction stream until their base is resolved.
    const whole: { off: number; type: number; start: number; sha: string }[] = [];
    const deltaStart = new Map<number, number>();
    const kids = new Map<number | string, number[]>();
    let pos = 12;
    for (let i = 0; i < count; i++) {
      const off = pos;
      let c = pack[pos++];
      const type = (c >> 4) & 7;
      let size = c & 15, shift = 4;
      while (c & 0x80) { c = pack[pos++]; size += (c & 0x7f) * 2 ** shift; shift += 7; }
      let base: number | string | null = null;
      if (type === OFS_DELTA) {
        c = pack[pos++];
        let o = c & 0x7f;
        while (c & 0x80) { c = pack[pos++]; o = (o + 1) * 128 + (c & 0x7f); }
        base = off - o;
      } else if (type === REF_DELTA) {
        base = pack.toString('hex', pos, pos + 20);
        pos += 20;
      }
      const start = pos;
      const r = inflateSync(pack.subarray(pos), { info: true }) as unknown as { buffer: Buffer; engine: { bytesWritten: number } };
      pos += r.engine.bytesWritten;
      if (r.buffer.length !== size) throw new Error(`object at ${off}: size ${r.buffer.length} != header ${size}`);
      if (base !== null) {
        deltaStart.set(off, start);           // re-inflated in pass 2: holding every delta costs too much memory
        const k = kids.get(base);
        if (k) k.push(off); else kids.set(base, [off]);
      } else {
        const sha = this.process(type, r.buffer);
        whole.push({ off, type, start, sha });
        if (this.keepLocs) this.locs.set(sha, { pack, start, type, base: null });
      }
    }

    // pass 2: depth-first from each whole object that has dependants; each object is built once
    const resolve = (type: number, data: Buffer, off: number, sha: string) => {
      const list = [...(kids.get(off) ?? []), ...(kids.get(sha) ?? [])];
      kids.delete(off); kids.delete(sha);
      for (const k of list) {
        const start = deltaStart.get(k)!;
        deltaStart.delete(k);
        const out = applyDelta(data, inflateSync(pack.subarray(start)));
        const ksha = this.process(type, out);
        if (this.keepLocs) this.locs.set(ksha, { pack, start, type, base: sha });
        resolve(type, out, k, ksha);
      }
    };
    for (const w of whole) {
      if (!kids.has(w.off) && !kids.has(w.sha)) continue;
      const data = inflateSync(pack.subarray(w.start));
      resolve(w.type, data, w.off, w.sha);
    }
    if (deltaStart.size) throw new Error(`${deltaStart.size} deltas with missing bases (thin pack?)`);
  }

  /** An object's full content, rebuilt from its pack (used for the few blobs whose text we need). */
  read(sha: string): Buffer | null {
    const loc = this.locs.get(sha);
    if (!loc) return null;
    const raw = inflateSync(loc.pack.subarray(loc.start));
    if (loc.base === null) return raw;
    const base = this.read(loc.base);
    return base ? applyDelta(base, raw) : null;
  }

  private process(type: number, data: Buffer): string {
    const h = createHash('sha1');
    h.update(`${TYPE_NAME[type]} ${data.length}\0`);
    h.update(data);
    const sha = h.digest('hex');
    this.objects++;
    if (type === 1) this.commits.set(sha, parseCommit(sha, data));
    else if (type === 2) this.trees.set(sha, data);
    else if (type === 3) this.blobs.set(sha, blobInfo(data));
    return sha;
  }
}

export function blobInfo(data: Buffer): BlobInfo {
  const bin = data.subarray(0, BINARY_PROBE).includes(0);
  let n = 0;
  for (let i = data.indexOf(10); i !== -1; i = data.indexOf(10, i + 1)) n++;
  if (data.length && data[data.length - 1] !== 10) n++;
  return { lines: n, bin };
}

const PERSON = /> (-?\d+) ([+-])(\d\d)(\d\d)\s*$/;

export function parseCommit(sha: string, data: Buffer): Commit {
  const end = data.indexOf('\n\n');
  const head = data.toString('utf8', 0, end < 0 ? data.length : end);
  const c: Commit = { sha, tree: '', parents: [], at: 0, atOff: 0, ct: 0, who: '' };
  let author = '';
  for (const line of head.split('\n')) {
    if (line.startsWith('tree ')) c.tree = line.slice(5, 45);
    else if (line.startsWith('parent ')) c.parents.push(line.slice(7, 47));
    else if (line.startsWith('author ')) {
      author = line.slice(7);
      const m = PERSON.exec(line);
      if (m) { c.at = Number(m[1]); c.atOff = (Number(m[3]) * 60 + Number(m[4])) * (m[2] === '-' ? -1 : 1); }
    } else if (line.startsWith('committer ')) {
      const m = PERSON.exec(line);
      if (m) c.ct = Number(m[1]);
    }
  }
  // the message is everything after the header, as git's %B prints it
  c.who = classify(identOf(author), end < 0 ? '' : data.toString('utf8', end + 2));
  return c;
}

function varint(buf: Buffer, pos: number): [number, number] {
  let v = 0, shift = 0, c: number;
  do { c = buf[pos++]; v += (c & 0x7f) * 2 ** shift; shift += 7; } while (c & 0x80);
  return [v, pos];
}

export function applyDelta(base: Buffer, delta: Buffer): Buffer {
  let [srcSize, p] = varint(delta, 0);
  if (srcSize !== base.length) throw new Error(`delta base size ${srcSize} != ${base.length}`);
  let dstSize: number;
  [dstSize, p] = varint(delta, p);
  const out = Buffer.allocUnsafe(dstSize);
  let o = 0;
  while (p < delta.length) {
    const op = delta[p++];
    if (op & 0x80) {
      let cpOff = 0, cpSize = 0;
      if (op & 0x01) cpOff = delta[p++];
      if (op & 0x02) cpOff |= delta[p++] << 8;
      if (op & 0x04) cpOff |= delta[p++] << 16;
      if (op & 0x08) cpOff = (cpOff + delta[p++] * 0x1000000) >>> 0;
      if (op & 0x10) cpSize = delta[p++];
      if (op & 0x20) cpSize |= delta[p++] << 8;
      if (op & 0x40) cpSize |= delta[p++] << 16;
      if (cpSize === 0) cpSize = 0x10000;
      base.copy(out, o, cpOff, cpOff + cpSize);
      o += cpSize;
    } else if (op) {
      delta.copy(out, o, p, p + op);
      o += op; p += op;
    } else {
      throw new Error('delta opcode 0');
    }
  }
  if (o !== dstSize) throw new Error(`delta produced ${o} bytes, expected ${dstSize}`);
  return out;
}

export interface TreeEntry { mode: string; name: string; sha: string }

export function parseTree(buf: Buffer): TreeEntry[] {
  const out: TreeEntry[] = [];
  let p = 0;
  while (p < buf.length) {
    const sp = buf.indexOf(32, p);
    const nul = buf.indexOf(0, sp);
    out.push({ mode: buf.toString('latin1', p, sp), name: buf.toString('utf8', sp + 1, nul), sha: buf.toString('hex', nul + 1, nul + 21) });
    p = nul + 21;
  }
  return out;
}
