// A minimal git smart-protocol (v2) client: just enough to fetch a shallow pack of one branch.
// No git binary needed, which is what lets the replay run inside a serverless function.

export interface Transport {
  /** POST one protocol-v2 request; resolves to the raw response body as a stream of chunks. */
  rpc(body: Buffer, signal?: AbortSignal): Promise<AsyncIterable<Uint8Array>>;
}

export class GitError extends Error {
  constructor(message: string, readonly code: 'not_found' | 'too_big' | 'timeout' | 'protocol' | 'empty' | 'http') {
    super(message);
  }
}

const enc = (s: string) => Buffer.from(s, 'utf8');

export function pkt(line: string): Buffer {
  const body = enc(line);
  return Buffer.concat([enc((body.length + 4).toString(16).padStart(4, '0')), body]);
}
export const FLUSH = enc('0000');
export const DELIM = enc('0001');

/** GitHub (or any smart-HTTP host) over fetch(). Auth is optional; public repos need none. */
export function httpTransport(repoUrl: string, token?: string): Transport {
  const url = repoUrl.replace(/\/+$/, '').replace(/(\.git)?$/, '.git') + '/git-upload-pack';
  return {
    async rpc(body, signal) {
      const headers: Record<string, string> = {
        'Content-Type': 'application/x-git-upload-pack-request',
        Accept: 'application/x-git-upload-pack-result',
        'Git-Protocol': 'version=2',
        'User-Agent': 'git/2.45.0 (commit-city)',
      };
      if (token) headers.Authorization = 'Basic ' + Buffer.from(`x-access-token:${token}`).toString('base64');
      let res: Response;
      try {
        res = await fetch(url, { method: 'POST', headers, body: new Uint8Array(body), signal });
      } catch (e) {
        if ((e as Error).name === 'TimeoutError' || (e as Error).name === 'AbortError') throw new GitError('fetch timed out', 'timeout');
        const cause = (e as { cause?: { code?: string; message?: string } }).cause;
        throw new GitError(`fetch failed: ${(e as Error).message}${cause ? ` (${cause.code ?? cause.message})` : ''}`, 'http');
      }
      if (res.status === 404 || res.status === 401 || res.status === 403) throw new GitError(`repository not readable (${res.status})`, 'not_found');
      if (!res.ok || !res.body) throw new GitError(`upload-pack HTTP ${res.status}`, 'http');
      return res.body as unknown as AsyncIterable<Uint8Array>;
    },
  };
}

export interface FetchOptions {
  want: string | string[];
  deepenSince?: number;          // unix seconds
  deepen?: number;
  shallow?: string[];            // commits we hold without their parents
  haves?: string[];
  filter?: string;               // partial-fetch filter, e.g. 'blob:limit=131072'
  maxBytes?: number;
  timeoutMs?: number;
  onProgress?: (bytes: number) => void;
}

export interface FetchResult {
  pack: Buffer;
  shallow: string[];
  unshallow: string[];
}

/** One `fetch` command: returns the packfile and the server's shallow boundary. */
export async function fetchPack(t: Transport, o: FetchOptions): Promise<FetchResult> {
  const lines = [pkt('command=fetch\n'), pkt('agent=commit-city/1\n'), pkt('object-format=sha1\n'), DELIM,
    pkt('ofs-delta\n'), pkt('no-progress\n')];
  if (o.deepenSince != null) lines.push(pkt(`deepen-since ${Math.floor(o.deepenSince)}\n`));
  if (o.deepen != null) lines.push(pkt(`deepen ${o.deepen}\n`));
  for (const s of o.shallow ?? []) lines.push(pkt(`shallow ${s}\n`));
  for (const w of Array.isArray(o.want) ? o.want : [o.want]) lines.push(pkt(`want ${w}\n`));
  for (const h of o.haves ?? []) lines.push(pkt(`have ${h}\n`));
  if (o.filter) lines.push(pkt(`filter ${o.filter}\n`));
  lines.push(pkt('done\n'), FLUSH);
  const req = Buffer.concat(lines);
  const deadline = Date.now() + (o.timeoutMs ?? 240_000);
  for (let attempt = 1; ; attempt++) {
    const ac = new AbortController();
    const timer = setTimeout(() => ac.abort(), Math.max(1000, deadline - Date.now()));
    try {
      const body = await t.rpc(req, ac.signal);
      return await readResponse(body, o, ac);
    } catch (e) {
      const err = ac.signal.aborted && !(e instanceof GitError && e.code === 'too_big') ? new GitError('fetch timed out', 'timeout')
        : e instanceof GitError ? e : new GitError(`fetch failed: ${(e as Error).message}`, 'http');
      // transient network trouble (connection resets, 5xx) gets two more tries while time remains
      if (err.code !== 'http' || attempt >= 3 || Date.now() > deadline - 5000) throw err;
      await new Promise(r => setTimeout(r, 400 * attempt));
    } finally {
      clearTimeout(timer);
    }
  }
}

async function readResponse(body: AsyncIterable<Uint8Array>, o: FetchOptions, ac: AbortController): Promise<FetchResult> {
  const shallow: string[] = [], unshallow: string[] = [];
  const packChunks: Buffer[] = [];
  let packBytes = 0;
  let section = '';
  let pending: Buffer = Buffer.alloc(0);
  let done = false;
  const maxBytes = o.maxBytes ?? Infinity;

  const handle = (payload: Buffer | null, special: number) => {
    if (payload === null) {                                  // 0000 flush, 0001 delim, 0002 response end
      if (special === 1) section = '';
      else done = true;
      return;
    }
    if (section === 'packfile') {
      const band = payload[0];
      if (band === 1) {
        packBytes += payload.length - 1;
        if (packBytes > maxBytes) {
          ac.abort();
          throw new GitError(`pack exceeds ${Math.round(maxBytes / 1e6)} MB`, 'too_big');
        }
        packChunks.push(payload.subarray(1));
        o.onProgress?.(packBytes);
      } else if (band === 3) {
        throw new GitError(`remote error: ${payload.subarray(1).toString('utf8').trim()}`, 'protocol');
      }
      return;
    }
    const line = payload.toString('utf8').replace(/\n$/, '');
    if (line.startsWith('ERR ')) {
      const msg = line.slice(4);
      throw new GitError(`remote error: ${msg}`, /no commits selected|not our ref|not found/i.test(msg) ? 'empty' : 'protocol');
    }
    if (!section) { section = line; return; }
    if (section === 'shallow-info') {
      if (line.startsWith('shallow ')) shallow.push(line.slice(8));
      else if (line.startsWith('unshallow ')) unshallow.push(line.slice(10));
    }
    // acknowledgments / wanted-refs / packfile-uris: nothing to do with `done` sent
  };

  for await (const chunk of body) {
    pending = pending.length ? Buffer.concat([pending, Buffer.from(chunk)]) : Buffer.from(chunk);
    let p = 0;
    while (!done && pending.length - p >= 4) {
      const len = parseInt(pending.toString('latin1', p, p + 4), 16);
      if (Number.isNaN(len)) throw new GitError('malformed pkt-line', 'protocol');
      if (len < 4) { handle(null, len); p += 4; continue; }
      if (pending.length - p < len) break;
      handle(pending.subarray(p + 4, p + len), -1);
      p += len;
    }
    pending = p < pending.length ? pending.subarray(p) : Buffer.alloc(0);
    if (done) break;
  }
  if (!packChunks.length && section !== 'packfile') {
    // git answers a deepen-since that selects no commits by ending the stream after shallow-info
    throw new GitError(`no packfile in response (last section: ${section || 'none'})`, o.deepenSince != null ? 'empty' : 'protocol');
  }
  return { pack: Buffer.concat(packChunks, packBytes), shallow, unshallow };
}
