// Fetch + replay one repository. Fetches are shallow and incremental: the window's commits first, then
// whatever the shallow edge cut off that the replay still needs (the commit the window starts from, the
// rest of a first-parent chain cut at a merge of an old branch, the parents of side-branch commits).
import { type FetchOptions, type FetchResult, fetchPack, GitError, httpTransport, type Transport } from './git.js';
import { makeKeep } from './langs.js';
import { ObjectDB } from './pack.js';
import { MissingObject, type RepoRecord, Replayer } from './replay.js';

export interface ReplayOptions {
  repo: string;                 // owner/name
  head: string;                 // default-branch tip to replay up to
  headTime?: number;            // its committer time, if known (skips the deepen-since probe when older than start)
  start: number;                // window start, unix seconds (0 = whole history)
  token?: string;
  transport?: Transport;        // tests inject a local upload-pack
  maxPackBytes?: number;
  timeoutMs?: number;
  maxRssBytes?: number;         // stop with too_big past this resident size (the instance's memory is shared)
  blobLimit?: number;           // blobs at least this big are fetched only when the replay needs them (0 = all)
  log?: (msg: string) => void;
}

export interface ReplayStats { packBytes: number; objects: number; fetches: number; ms: number }

const MAX_CHAIN_ROUNDS = 40;
const MAX_SIDE_PARENTS = 400;
const BLOB_LIMIT = 128 * 1024;
const BLOBS_PER_FETCH = 4000;
const MAX_RSS = 1.5e9;          // functions get 2 GB, and concurrent builds on one instance share it

export async function replayRepo(o: ReplayOptions): Promise<{ record: RepoRecord; stats: ReplayStats }> {
  const t0 = Date.now();
  const tr = o.transport ?? httpTransport(`https://github.com/${o.repo}`, o.token);
  const maxBytes = o.maxPackBytes ?? 350e6;
  const deadline = t0 + (o.timeoutMs ?? 200_000);
  const db = new ObjectDB();
  // Indexing a pack and replaying it are synchronous and can run for minutes on a big repo, so the deadline
  // is checked inside them too, not only between fetches: past it, the platform kills the function at 300 s
  // (or the instance runs out of memory) and the visitor gets a bare 500 after a five-minute wait.
  const maxRss = o.maxRssBytes ?? MAX_RSS;
  const guard = () => {
    if (Date.now() > deadline) throw new GitError('replay ran out of time', 'timeout');
    if (process.memoryUsage.rss() > maxRss) throw new GitError('replay needs more memory than the hosted builder has', 'too_big');
  };
  db.guard = guard;
  const shallow = new Set<string>();
  const limit = o.blobLimit ?? BLOB_LIMIT;
  const filter = limit > 0 ? `blob:limit=${limit}` : undefined;
  let fetches = 0;

  const get = async (f: Omit<FetchOptions, 'maxBytes' | 'timeoutMs' | 'shallow' | 'filter'>, unfiltered = false): Promise<FetchResult> => {
    fetches++;
    const left = deadline - Date.now();
    if (left < 2000) throw new GitError('replay ran out of time', 'timeout');
    const budget = Math.max(1, maxBytes - db.packBytes);
    const t = Date.now();
    let r: FetchResult;
    try {
      r = await fetchPack(tr, { ...f, shallow: [...shallow], maxBytes: budget, timeoutMs: left, filter: unfiltered ? undefined : filter });
    } catch (e) {
      if (!f.haves?.length || !(e instanceof GitError) || e.code === 'empty' || e.code === 'too_big' || e.code === 'timeout') throw e;
      fetches++;                                    // negotiation trouble: ask again without haves
      r = await fetchPack(tr, { ...f, haves: [], shallow: [...shallow], maxBytes: budget, timeoutMs: deadline - Date.now(), filter: unfiltered ? undefined : filter });
    }
    db.addPack(r.pack);
    for (const s of r.shallow) shallow.add(s);
    for (const s of r.unshallow) shallow.delete(s);
    const wants = Array.isArray(f.want) ? f.want.length : 1;
    const how = f.deepenSince != null ? 'since' : f.deepen != null ? `depth ${f.deepen}` : 'full';
    o.log?.(`${o.repo}: fetch ${fetches} (${wants} want, ${how}, ${f.haves?.length ?? 0} have) ${(r.pack.length / 1e6).toFixed(1)} MB in ${Date.now() - t} ms`);
    return r;
  };

  // 1. the window: every commit landed since `start` (or the whole history, or just the tip if quiet)
  const whole = o.start <= 0;
  const quiet = o.headTime != null && o.headTime <= o.start;
  try {
    await get(whole ? { want: o.head } : quiet ? { want: o.head, deepen: 1 } : { want: o.head, deepenSince: o.start });
  } catch (e) {
    if (!(e instanceof GitError && e.code === 'empty') || quiet) throw e;
    await get({ want: o.head, deepen: 1 });          // every commit predates the window
  }

  // HEAD's .gitattributes are the only file contents the replay reads; after that the packs can go
  const rp = new Replayer(db, makeKeep());
  rp.guard = guard;
  const headCommit = db.commits.get(o.head);
  if (headCommit) {
    const held = rp.missingAttributes(headCommit.tree);
    if (held.length) await get({ want: held }, true);
    rp.loadAttributes(headCommit.tree);
  }
  db.releaseReads();

  // 2. follow the first-parent chain down to the window start. deepen-since cuts the chain at any merge
  //    of a branch older than the window, so this can take a few rounds on repos that merge stale branches
  let partial = false;
  for (let round = 0; !whole; round++) {
    const probe = rp.findBase(o.head, o.start);
    if (!probe.missing) break;
    if (round >= MAX_CHAIN_ROUNDS) { partial = true; break; }
    const child = probe.chain[probe.chain.length - 1];
    await get({ want: probe.missing, deepen: 1, haves: child ? [child.sha] : [] });
    const m = db.commits.get(probe.missing);
    if (!m) { partial = true; break; }
    if (m.ct <= o.start || !m.parents[0]) break;      // that was the commit the window starts from
    try {
      await get({ want: m.parents[0], deepenSince: o.start, haves: [m.sha] });
    } catch (e) {
      if (!(e instanceof GitError && e.code === 'empty')) throw e;   // the parent predates the window: next round
    }
  }

  // 3. parents of window commits the shallow edge cut off (side branches forked before the window),
  //    so every commit's touched files are known
  const lost = new Set<string>();
  for (const c of db.commits.values()) {
    if (c.ct > o.start && c.parents[0] && !db.commits.has(c.parents[0])) lost.add(c.parents[0]);
  }
  if (lost.size && lost.size <= MAX_SIDE_PARENTS && deadline - Date.now() > 20_000) {
    try {
      await get({ want: [...lost], deepen: 1, haves: [o.head] });
    } catch (e) {
      o.log?.(`${o.repo}: side-branch parents unavailable (${(e as Error).message})`);
    }
  }

  // 4. replay; big text blobs the filter held back come in one follow-up fetch (deltas against each other)
  const replay = async (): Promise<RepoRecord> => {
    rp.collect = new Set();
    let rec = rp.run(o.repo, o.head, Math.max(0, o.start));
    if (rp.collect.size) {
      const need = [...rp.collect];
      for (let i = 0; i < need.length; i += BLOBS_PER_FETCH) await get({ want: need.slice(i, i + BLOBS_PER_FETCH) }, true);
      rp.collect = null;
      rec = rp.run(o.repo, o.head, Math.max(0, o.start));
    }
    rp.collect = null;
    return rec;
  };
  let record: RepoRecord;
  try {
    record = await replay();
  } catch (e) {
    if (!(e instanceof MissingObject)) throw e;
    o.log?.(`${o.repo}: ${e.message}; fetching a full snapshot of the start commit`);
    const { base, missing } = rp.findBase(o.head, o.start);
    const want = base?.sha ?? missing;
    if (!want) throw e;
    await get({ want, deepen: 1 });
    record = await replay();
  }
  if (partial && !record.partial) record.partial = 'history before the window start was cut short';
  return { record, stats: { packBytes: db.packBytes, objects: db.objects, fetches, ms: Date.now() - t0 } };
}
