// Replay one repo's default branch into per-file line-count timelines: the TypeScript twin of
// replay() in commit_city/extract.py, fed by a shallow pack instead of a full clone.
import { Attributes } from './attributes.js';
import type { Keep } from './langs.js';
import { binaryByName, langOf } from './langs.js';
import { type Commit, type ObjectDB, type TreeEntry, parseTree } from './pack.js';

export const BINARY_SIZE = 12;          // a binary file stands in as a 12-line file
export const RECORD_VERSION = 2;        // bump when records change shape: cached records of another version are misses
const MAX_COMMITS = 20000;              // per-repo cap on recorded commit touch lists
const MAX_TOUCH = 300;

/** [sha12, author minute, author UTC offset, is merge (0|1), files touched, first 300 file indexes, who] where who
 *  is '' (human), 'bot' or an agent id (agents.ts) */
export type CommitTouch = [string, number, number, number, number, number[], string];

export interface RepoRecord {
  v: typeof RECORD_VERSION;
  repo: string;
  head: string;
  start: number;          // window start, unix seconds
  base_t: number | null;  // landing minute of the state the window starts from
  fp_commits: number;
  files: [string, number, number[]][];     // [path, lang, [t, size, t, size, ...]] (absolute minutes)
  commits: CommitTouch[];                  // every commit in the window, any author
  partial?: string;                        // why the record is approximate, if it is
}

interface Change { path: string; del: boolean; sha: string; mode: string }

export class Replayer {
  private treeCache = new Map<string, TreeEntry[]>();
  private attrs = new Attributes();
  private attrsLoaded = false;
  /** While set, blobs a partial fetch left out are collected here instead of failing the replay. */
  collect: Set<string> | null = null;
  constructor(private db: ObjectDB, private keep: Keep) {}

  /** Read every .gitattributes in a tree (git applies HEAD's to all commits of a bare repo). */
  loadAttributes(tree: string, prefix = '') {
    if (!prefix) this.attrsLoaded = true;
    for (const e of this.entries(tree)) {
      if (e.mode === '40000') this.loadAttributes(e.sha, prefix + e.name + '/');
      else if (e.name === '.gitattributes' && e.mode !== '120000') {
        const data = this.db.read(e.sha);
        if (data) this.attrs.add(prefix.replace(/\/$/, ''), data.toString('utf8'));
      }
    }
  }

  /** .gitattributes blobs in a tree that the pack does not hold (a partial fetch can leave big ones out). */
  missingAttributes(tree: string, out: string[] = []): string[] {
    for (const e of this.entries(tree)) {
      if (e.mode === '40000') this.missingAttributes(e.sha, out);
      else if (e.name === '.gitattributes' && e.mode !== '120000' && !this.db.blobs.has(e.sha)) out.push(e.sha);
    }
    return out;
  }

  private entries(sha: string): TreeEntry[] {
    let e = this.treeCache.get(sha);
    if (!e) {
      const raw = this.db.trees.get(sha);
      if (!raw) throw new MissingObject(sha);
      e = parseTree(raw);
      if (this.treeCache.size > 4096) this.treeCache.clear();
      this.treeCache.set(sha, e);
    }
    return e;
  }

  /** Changed paths between two trees (either may be null = empty), like diff-tree -r --no-renames. */
  diff(a: string | null, b: string | null, prefix = '', out: Change[] = []): Change[] {
    if (a === b) return out;
    const A = a ? this.entries(a) : [], B = b ? this.entries(b) : [];
    const mb = new Map<string, TreeEntry>();
    for (const e of B) mb.set(e.name, e);
    const seen = new Set<string>();
    for (const ea of A) {
      seen.add(ea.name);
      this.pair(ea, mb.get(ea.name), prefix, out);
    }
    for (const eb of B) if (!seen.has(eb.name)) this.pair(undefined, eb, prefix, out);
    return out;
  }

  private pair(ea: TreeEntry | undefined, eb: TreeEntry | undefined, prefix: string, out: Change[]) {
    const name = (ea ?? eb)!.name;
    const path = prefix + name;
    const ta = ea?.mode === '40000', tb = eb?.mode === '40000';
    if (ta && tb) { this.diff(ea!.sha, eb!.sha, path + '/', out); return; }
    if (ta) this.diff(ea!.sha, null, path + '/', out);
    if (tb) this.diff(null, eb!.sha, path + '/', out);
    const fa = ea && !ta ? ea : undefined, fb = eb && !tb ? eb : undefined;
    if (fa && fb) {
      if (fa.sha !== fb.sha || fa.mode !== fb.mode) out.push({ path, del: false, sha: fb.sha, mode: fb.mode });
    } else if (fb) out.push({ path, del: false, sha: fb.sha, mode: fb.mode });
    else if (fa) out.push({ path, del: true, sha: fa.sha, mode: fa.mode });
  }

  /** The first first-parent commit at or before `start` (git rev-list --first-parent -1 --before). */
  findBase(head: string, start: number): { chain: Commit[]; base: Commit | null; missing: string | null } {
    const chain: Commit[] = [];
    let sha: string | undefined = head;
    while (sha) {
      const c = this.db.commits.get(sha);
      if (!c) return { chain, base: null, missing: sha };
      if (c.ct <= start) return { chain, base: c, missing: null };
      chain.push(c);
      sha = c.parents[0];
    }
    return { chain, base: null, missing: null };            // history begins inside the window
  }

  size(ch: Change): { lines: number; bin: boolean } {
    if (ch.mode === '160000') return { lines: 1, bin: false };      // submodule: "Subproject commit <sha>"
    const forced = this.attrs.empty ? null : this.attrs.binary(ch.path);
    const b = this.db.blobs.get(ch.sha);
    if (!b) {
      // left out by the partial fetch: binary either way, or needed in a follow-up fetch
      if (forced === true || (forced === null && binaryByName(ch.path))) return { lines: 0, bin: true };
      if (!this.collect) throw new MissingObject(ch.sha);
      this.collect.add(ch.sha);
      return { lines: 0, bin: false };
    }
    return forced === null ? b : { lines: b.lines, bin: forced };
  }

  run(repo: string, head: string, start: number): RepoRecord {
    const headCommit = this.db.commits.get(head);
    if (!headCommit) throw new MissingObject(head);
    if (!this.attrsLoaded) this.loadAttributes(headCommit.tree);
    const { chain, base, missing } = this.findBase(head, start);
    const events = new Map<string, number[]>();
    const exists = new Map<string, boolean>(), lines = new Map<string, number>(), binary = new Map<string, boolean>();
    const emit = (path: string, t: number) => {
      const size = !exists.get(path) ? 0 : binary.get(path) ? BINARY_SIZE : Math.max(1, lines.get(path) ?? 0);
      let ev = events.get(path);
      if (!ev) events.set(path, ev = []);
      if (ev.length >= 2 && ev[ev.length - 2] === t) ev[ev.length - 1] = size;
      else if (!ev.length || ev[ev.length - 1] !== size) ev.push(t, size);
    };
    const touches = new Map<string, Change[]>();
    let baseT: number | null = null;
    let partial: string | undefined;
    if (base) {
      baseT = Math.floor(base.ct / 60);
      for (const ch of this.diff(null, base.tree)) {
        if (!this.keep(ch.path)) continue;
        const s = this.size(ch);
        exists.set(ch.path, true); binary.set(ch.path, s.bin); lines.set(ch.path, s.bin ? 0 : s.lines);
        emit(ch.path, baseT);
      }
    } else if (missing) {
      partial = 'window start state unavailable; replay starts at the first commit in the window';
    }
    let lastT = baseT ?? -1e12;
    let prevTree: string | null = base ? base.tree : null;
    for (let i = chain.length - 1; i >= 0; i--) {
      const c = chain[i];
      const t = Math.max(Math.floor(c.ct / 60), lastT);       // monotonic landing clock
      lastT = t;
      const changes = this.diff(prevTree, c.tree);
      touches.set(c.sha, changes);
      prevTree = c.tree;
      for (const ch of changes) {
        if (!this.keep(ch.path)) continue;
        if (ch.del) { exists.set(ch.path, false); lines.set(ch.path, 0); }
        else {
          const s = this.size(ch);
          exists.set(ch.path, true); binary.set(ch.path, s.bin);
          if (!s.bin) lines.set(ch.path, s.lines);
        }
        emit(ch.path, t);
      }
    }
    const paths = [...events.keys()].filter(p => { const ev = events.get(p)!; for (let k = 1; k < ev.length; k += 2) if (ev[k] > 0) return true; return false; });
    paths.sort((a, b) => (a < b ? -1 : a > b ? 1 : 0));
    const index = new Map(paths.map((p, i) => [p, i]));

    // touch lists for every commit in the window, first-parent or not, any author
    const commits: CommitTouch[] = [];
    const inWindow = [...this.db.commits.values()].filter(c => c !== base && c.ct > start);
    inWindow.sort((a, b) => b.at - a.at);
    for (const c of inWindow.slice(0, MAX_COMMITS)) {
      let changes = touches.get(c.sha);
      if (!changes) {
        const p = c.parents[0];
        const pc = p ? this.db.commits.get(p) : undefined;
        if (p && !pc) changes = [];                           // parent beyond the shallow edge: files unknown
        else {
          try { changes = this.diff(pc ? pc.tree : null, c.tree); } catch (e) { if (e instanceof MissingObject) changes = []; else throw e; }
        }
      }
      const idx = new Set<number>();
      for (const ch of changes) { const k = index.get(ch.path); if (k !== undefined) idx.add(k); }
      const files = [...idx].sort((a, b) => a - b);
      commits.push([c.sha.slice(0, 12), Math.floor(c.at / 60), c.atOff, c.parents.length > 1 ? 1 : 0, files.length, files.slice(0, MAX_TOUCH), c.who]);
    }
    commits.sort((a, b) => a[1] - b[1] || (a[0] < b[0] ? -1 : 1));
    return {
      v: RECORD_VERSION, repo, head, start, base_t: baseT, fp_commits: chain.length,
      files: paths.map(p => [p, langOf(p), events.get(p)!]),
      commits,
      ...(partial ? { partial } : {}),
    };
  }
}

export class MissingObject extends Error {
  constructor(readonly sha: string) { super(`object ${sha} not in pack`); }
}
