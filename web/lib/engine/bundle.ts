// Turn replayed repo records into the viewer payload (schema 1). The TypeScript twin of
// commit_city/bundle.py: same ranking, aggregation, budgets, timezone and epoch rules.
import { LANG_CLASSES } from './langs.js';
import type { RepoRecord } from './replay.js';

export const SCHEMA_VERSION = 1;
export const GENERATOR = 'commit.city 0.2.0';

type File = [string, number, number[]];
type Mine = [number, number, number, number[], string];   // [author minute, offset, n files, file idx, sha12]

export interface BundleRepo { name: string; fork: boolean; record: RepoRecord; mine: Mine[] }

export interface BundleInput {
  login: string;                    // shown in the HUD: a user, an org, or owner/repo
  kind?: 'user' | 'org' | 'repo';   // whose commits these are; the viewer words things for a person by default
  name: string;
  avatar: string;
  url: string;
  title?: string;
  now: number;                      // unix seconds
  start: number;
  contributions: number | null;
  restricted: number;
  repos: BundleRepo[];
  omittedRepos?: number;
  omittedCommits?: number;
  maxRepos?: number;
  maxFilesPerRepo?: number;
  maxFilesTotal?: number;
  timezone?: { iana: string; offset: number; label: string };
}

export interface Payload {
  schema: number; generator: string; generated: string;
  kind?: 'user' | 'org' | 'repo';
  user: { login: string; name: string; avatar: string; url: string };
  title: string;
  tz: { iana: string; offset: number; label: string };
  epoch: number; t_end: number; langs: string[];
  totals: { commits: number; contributions: number | null; restricted: number; window_start: string; omitted_repos: number; omitted_commits: number };
  repos: { n: string; fork: boolean; anon: boolean; fp: number; agg: number; p: string[]; l: number[]; e: number[][]; m: [number, number, number[]][] }[];
}

/** Commit touches -> the Python `mine` rows, for one author's commits or for everyone's. */
export function mineOf(rec: RepoRecord, filter: { shas?: Set<string>; since?: number }): Mine[] {
  const out: Mine[] = [];
  for (const [sha, at, off, merge, n, files] of rec.commits) {
    if (filter.shas ? !filter.shas.has(sha) : merge === 1 || (filter.since != null && at * 60 < filter.since)) continue;
    out.push([at, off, n, files, sha]);
  }
  out.sort(pyListCmp);                                      // Python's list ordering, as in extract.replay
  return out;
}

function pyListCmp(a: Mine, b: Mine): number {
  if (a[0] !== b[0]) return a[0] - b[0];
  if (a[1] !== b[1]) return a[1] - b[1];
  if (a[2] !== b[2]) return a[2] - b[2];
  for (let i = 0; i < Math.min(a[3].length, b[3].length); i++) if (a[3][i] !== b[3][i]) return a[3][i] - b[3][i];
  if (a[3].length !== b[3].length) return a[3].length - b[3].length;
  return a[4] < b[4] ? -1 : a[4] > b[4] ? 1 : 0;
}

export function detectOffset(repos: BundleRepo[]): number {
  const counts = new Map<number, number>();
  for (const r of repos) for (const m of r.mine) counts.set(m[1], (counts.get(m[1]) ?? 0) + 1);
  let best = 0, bestN = 0;
  for (const [off, n] of counts) if (n > bestN) { best = off; bestN = n; }
  return best;
}

export function tzLabel(off: number) {
  const a = Math.abs(off);
  return `UTC${off >= 0 ? '+' : '-'}${String(Math.floor(a / 60)).padStart(2, '0')}:${String(a % 60).padStart(2, '0')}`;
}

export function mergeEvents(evs: number[][]): number[] {
  const times = [...new Set(evs.flatMap(ev => ev.filter((_, i) => i % 2 === 0)))].sort((a, b) => a - b);
  const cur = new Array(evs.length).fill(0), ptr = new Array(evs.length).fill(0);
  const out: number[] = [];
  for (const t of times) {
    evs.forEach((ev, k) => {
      while (ptr[k] < ev.length && ev[ptr[k]] <= t) { cur[k] = ev[ptr[k] + 1]; ptr[k] += 2; }
    });
    const s = cur.reduce((a, b) => a + b, 0);
    if (!out.length || out[out.length - 1] !== s) out.push(t, s);
  }
  return out;
}

export function groupKey(path: string, depth: number): string {
  const parts = path.split('/');
  return parts.length - 1 <= depth ? path : parts.slice(0, depth + 1).join('/') + '/…';
}

const maxSize = (ev: number[]) => { let m = -Infinity; for (let i = 1; i < ev.length; i += 2) if (ev[i] > m) m = ev[i]; return m; };
const pyCmp = (a: string, b: string) => (a < b ? -1 : a > b ? 1 : 0);

/** files -> [files', old index -> new index]. Collapses the deepest directories first. */
export function aggregate(files: File[], cap: number): [File[], number[]] {
  const n = files.length;
  if (n <= cap) return [files, files.map((_, i) => i)];
  const maxd = Math.max(...files.map(f => f[0].split('/').length - 1));
  let key: ((p: string) => string) | null = null;
  for (let d = maxd - 1; d >= 0; d--) {
    const keys = new Set(files.map(f => groupKey(f[0], d)));
    if (keys.size <= cap) { key = p => groupKey(p, d); break; }
  }
  if (!key) {                                             // too many top-level entries: bucket root files by extension
    key = p => {
      const k = groupKey(p, 0);
      return k !== p ? k : p.includes('.') ? '*.' + p.slice(p.lastIndexOf('.') + 1) : '*';
    };
  }
  let groups = new Map<string, number[]>();
  files.forEach((f, i) => { const k = key!(f[0]); const g = groups.get(k); if (g) g.push(i); else groups.set(k, [i]); });
  if (groups.size > cap) {                                // last resort: keep the biggest groups, fold the rest
    const size = new Map<string, number>();
    for (const [k, idx] of groups) size.set(k, idx.reduce((a, i) => a + maxSize(files[i][2]), 0));
    const ranked = [...groups.keys()].map((k, i) => [k, i] as const).sort((a, b) => size.get(b[0])! - size.get(a[0])! || a[1] - b[1]).map(x => x[0]);
    const rest = ranked.slice(cap - 1).flatMap(k => groups.get(k)!);
    const kept = new Map<string, number[]>();
    for (const k of ranked.slice(0, cap - 1)) kept.set(k, groups.get(k)!);
    kept.set('other…', rest);
    groups = kept;
  }
  const out: File[] = [], remap = new Array<number>(n).fill(0);
  for (const k of [...groups.keys()].sort(pyCmp)) {
    const idx = groups.get(k)!;
    for (const i of idx) remap[i] = out.length;
    if (idx.length === 1) { out.push(files[idx[0]]); continue; }
    const weight = new Map<number, number>();
    for (const i of idx) weight.set(files[i][1], (weight.get(files[i][1]) ?? 0) + maxSize(files[i][2]));
    let lang = 0, w = -Infinity;
    for (const [l, v] of weight) if (v > w) { lang = l; w = v; }
    out.push([k, lang, mergeEvents(idx.map(i => files[i][2]))]);
  }
  return [out, remap];
}

export function budgetCaps(counts: number[], perRepo: number, total: number): number[] {
  const caps = counts.map(c => Math.min(c, perRepo));
  if (caps.reduce((a, b) => a + b, 0) <= total) return caps;
  let lo = 1, hi = perRepo;
  while (lo < hi) {                                       // largest uniform cap that fits the total
    const mid = Math.floor((lo + hi + 1) / 2);
    if (counts.reduce((a, c) => a + Math.min(c, mid), 0) <= total) lo = mid; else hi = mid - 1;
  }
  return counts.map(c => Math.min(c, lo));
}

const isoDay = (s: number) => new Date(s * 1000).toISOString().slice(0, 10);

export function bundle(inp: BundleInput): Payload {
  let records = inp.repos.filter(r => r.mine.length && r.record.files.length);
  if (!records.length) throw new Error('no repos with commits in the window; nothing to draw');
  records.sort((a, b) => b.mine.length - a.mine.length || pyCmp(a.name.toLowerCase(), b.name.toLowerCase()));
  const maxRepos = inp.maxRepos ?? 60;
  const omitted = records.slice(maxRepos);
  records = records.slice(0, maxRepos);
  const tz = inp.timezone ?? (() => { const off = detectOffset(records); return { iana: '', offset: off, label: tzLabel(off) }; })();
  const off = tz.offset;
  let first = Infinity, last = -Infinity;
  for (const r of records) {
    for (const m of r.mine) { if (m[0] < first) first = m[0]; if (m[0] > last) last = m[0]; }
    for (const f of r.record.files) if (f[2][f[2].length - 2] > last) last = f[2][f[2].length - 2];
  }
  const localDay = Math.floor((first + off) / 1440);
  const epochMin = (localDay - 1) * 1440 - off;              // local midnight, the day before the first commit
  const tEnd = Math.max(last + 30, Math.floor(inp.now / 60)) - epochMin;
  const caps = budgetCaps(records.map(r => r.record.files.length), inp.maxFilesPerRepo ?? 2500, inp.maxFilesTotal ?? 60000);
  const repos = records.map((r, k) => {
    const [files, remap] = aggregate(r.record.files, caps[k]);
    const m = r.mine.map(([t, , , idx]) => {
      const nw = [...new Set(idx.map(i => remap[i]))].sort((a, b) => a - b);
      return [t - epochMin, nw.length, nw] as [number, number, number[]];
    });
    return {
      n: r.name, fork: r.fork, anon: false, fp: r.record.fp_commits, agg: r.record.files.length - files.length,
      p: files.map(f => f[0]), l: files.map(f => f[1]),
      e: files.map(f => f[2].map((v, i) => (i % 2 === 0 ? v - epochMin : v))),
      m,
    };
  });
  return {
    schema: SCHEMA_VERSION,
    generator: GENERATOR,
    generated: new Date(inp.now * 1000).toISOString().replace(/\.\d{3}Z$/, 'Z'),
    ...(inp.kind ? { kind: inp.kind } : {}),
    user: { login: inp.login, name: inp.name, avatar: inp.avatar, url: inp.url },
    title: inp.title || `${inp.login} · commit city`,
    tz,
    epoch: epochMin * 60,
    t_end: tEnd,
    langs: LANG_CLASSES,
    totals: {
      commits: repos.reduce((a, r) => a + r.m.length, 0),
      contributions: inp.contributions,
      restricted: inp.restricted,
      window_start: isoDay(inp.start),
      omitted_repos: omitted.length + (inp.omittedRepos ?? 0),
      omitted_commits: omitted.reduce((a, r) => a + r.mine.length, 0) + (inp.omittedCommits ?? 0),
    },
    repos,
  };
}
