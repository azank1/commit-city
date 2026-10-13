// The build pipeline as three API steps (start -> repo x N -> finish), plus where everything is stored.
import { bundle, mineOf, type Payload } from './engine/bundle.js';
import { discover, type Discovery, NotFound, RateLimited, type Target } from './engine/discover.js';
import { GitError } from './engine/git.js';
import { RECORD_VERSION, type RepoRecord } from './engine/replay.js';
import { replayRepo } from './engine/repo.js';
import { HttpError } from './http.js';
import { sign, verify } from './secret.js';
import { type Sky, skyline } from './skyline.js';
import { getJSON, getStore, putJSON, StoreConflict } from './store.js';
import { cityKey } from './target.js';
import { Turns } from './turns.js';

// the record version is part of the key, so records of an older shape are cache misses and get replayed again.
// So is the replay generation: bump REPLAY_GEN when the hosted replay is fixed to fetch commits it used to miss.
// Generation 2 fetches branches merged into a main that was quiet before the window; that only ever adds commits
// behind a merge commit, so a generation-1 record without merge commits (or of the whole history, which was never
// cut) is still exact and stays in use, and one with merges is replayed again. See usableGen().
export const REPLAY_GEN = 2;
export const repoPath = (name: string, head: string, whole: boolean, gen = REPLAY_GEN) =>
  `repos/${name.toLowerCase()}/${head}${whole ? '.all' : ''}.v${RECORD_VERSION}${gen > 1 ? `.g${gen}` : ''}.json.gz`;
// heads committed after this have no generation-1 record worth looking for (at worst such a repo replays again)
const GEN2_SINCE = Date.parse('2026-10-13T12:00:00Z') / 1000;
export const metaPath = (key: string) => `meta/${key}.json`;
export const cityPath = (key: string, v: number) => `cities/${key}/${v}.json.gz`;
export const settingsPath = (login: string) => `settings/${login.toLowerCase()}.json`;
export const skyPath = (key: string, v: number) => `sky/${key}/${v}.json`;

export interface CityMeta {
  v: number;
  key: string;
  target: string;
  kind: Discovery['kind'];
  url: string;                    // the gzipped payload
  generated: string;
  login: string;
  name: string;
  avatar: string;
  repos: number;
  commits: number;
  files: number;
  lines: number;
  window_start: string;
  top: string[];                  // the biggest islands, for cards and the gallery
  langs: number[];                // lines per language class at the end of the window
  who: { human: number; bot: number; agent: number; agents: [string, number][] };   // commits by actor (agents by count)
}

/** The city in miniature (cards, link previews), stored beside each version. */
export async function readSky(m: Pick<CityMeta, 'key' | 'v'>): Promise<Sky | null> {
  return getJSON<Sky>(skyPath(m.key, m.v)).catch(() => null);
}

export interface GalleryEntry {
  key: string; target: string; kind: CityMeta['kind']; avatar: string; commits: number; repos: number; lines: number; v: number;
  agent: number; bot: number;     // shares of the commits, 0..1 to 3 decimals
}
export const GALLERY = 'gallery/recent.json';
const galleryAt = (id: string) => `gallery/recent/${id}.json`;
const GALLERY_MAX = 60;

export interface Settings { hidden?: boolean; exclude?: string[]; updated?: string }

interface Ticket { k: string; t: string; s: number; w: boolean; r: [string, string, number, number?][] }   // r: name, head, head time, disk KB
interface Plan {
  k: string; kind: Discovery['kind']; mode: Discovery['mode']; s: number; n: number;
  p: Discovery['profile']; c: number | null; x: number; o: [number, number];
  b?: [string, number][];       // the biggest repos skipped as too big to replay (counted in o), named on the city page
  g?: Discovery['github'];      // a person's public commits as GitHub counts them, for the city's reconciliation note
  a?: string;                   // the key this build was asked for, when GitHub has moved the repo since: its page redirects
  r: { n: string; f: boolean; c: number; h: string; sh?: string[]; gen?: number }[];   // gen: an older record still in use
}

const TTL = 3600;
const DAY = 86400;

// Repo records are shared between cities and keyed by head alone, so every rolling-window replay starts
// at the same UTC day. A record built for any city then covers the window of every later build that
// reuses it: a newer account's window starts later, and extra history before the window is harmless.
export const replayStart = (now: number) => Math.floor((now - 365 * DAY) / DAY) * DAY;

export async function readSettings(login: string, fresh = false): Promise<Settings> {
  return (await getJSON<Settings>(settingsPath(login), fresh)) ?? {};
}

export async function writeSettings(login: string, s: Settings): Promise<void> {
  await putJSON(settingsPath(login), { ...s, updated: new Date().toISOString() }, { overwrite: true, maxAge: 60 });
  if (s.hidden) await dropCities(login);
}

/** Delete an owner's city and repo cities (meta and every version). Shared repo records stay. */
async function dropCities(login: string) {
  const l = login.toLowerCase();
  const store = getStore();
  const [metas, cities, skies] = await Promise.all([store.list(`meta/${l}`), store.list(`cities/${l}/`), store.list(`sky/${l}/`)]);
  const doomed = [
    ...metas.map(b => b.pathname).filter(p => p === `meta/${l}.json` || p.startsWith(`meta/${l}/`)),
    ...cities.map(b => b.pathname), ...skies.map(b => b.pathname),
  ];
  for (let i = 0; i < doomed.length; i += 20) await Promise.all(doomed.slice(i, i + 20).map(p => store.del(p)));
  await removeFromGallery(l);
}

export async function readMeta(key: string, fresh = false): Promise<CityMeta | null> {
  return getJSON<CityMeta>(metaPath(key), fresh);
}

const exists = (path: string) => getStore().exists(path);

/** Which cached record of repo@head a build can use: REPLAY_GEN's, a generation-1 record the fix since cannot
 *  change (no merge commits, or the whole history), or none (0: replay it). */
export async function usableGen(name: string, head: string, headTime: number, whole: boolean): Promise<number> {
  if (await exists(repoPath(name, head, whole))) return REPLAY_GEN;
  if (headTime > GEN2_SINCE) return 0;
  const old = await getJSON<RepoRecord>(repoPath(name, head, whole, 1)).catch(() => null);
  return old?.v === RECORD_VERSION && (whole || !old.commits.some(c => c[3] === 1)) ? 1 : 0;
}

export async function startBuild(target: Target, token: string, opts: { whole?: boolean } = {}) {
  const whole = !!opts.whole && target.kind === 'repo';
  let key = cityKey(target, whole);
  const owner = target.kind === 'owner' ? target.login : target.owner;
  let settings = await readSettings(owner, true);
  if (settings.hidden) throw new HttpError(403, 'this city is hidden by its owner', { status: 'hidden' });
  let d: Discovery;
  try {
    d = await discover(target, { token, days: whole ? 0 : 365 });
  } catch (e) {
    if (e instanceof NotFound) throw new HttpError(404, e.message, { status: 'not_found' });
    if (e instanceof RateLimited) throw new HttpError(503, 'GitHub API quota is used up for now; sign in with GitHub to build with your own quota', { status: 'rate_limited', resetAt: e.resetAt });
    throw e;
  }
  // a repo GitHub moved (facebook/react is react/react now) is built under its current name, so there is one city
  // per repo; finish() leaves the old name a meta that redirects there. Whoever owns the repo now may hide it.
  let alias: string | undefined;
  if (target.kind === 'repo' && d.target.toLowerCase() !== cityKey(target)) {
    const [movedOwner, movedName] = d.target.split('/');
    alias = key;
    key = cityKey({ kind: 'repo', owner: movedOwner, name: movedName }, whole);
    settings = await readSettings(movedOwner, true);
    if (settings.hidden) throw new HttpError(403, 'this city is hidden by its owner', { status: 'hidden' });
  }
  const excluded = new Set((settings.exclude ?? []).map(s => s.toLowerCase()));
  const repos = d.repos.filter(r => !excluded.has(r.name.toLowerCase()));
  // nothing left to replay because it is all too big (torvalds/linux, vercel/next.js): say so now, instead of
  // letting finish() report "no commits in the last year" for a repo with tens of thousands of them
  const big = d.skipped.filter(s => /too big/.test(s.reason));
  if (!repos.length && big.length) {
    throw new HttpError(422, `${big[0].name} is too big for the hosted builder`, { status: 'too_big', skipped: big.slice(0, 5) });
  }
  const named = big.filter(s => !excluded.has(s.name.toLowerCase())).sort((a, b) => b.commits - a.commits).slice(0, 3);
  const gens = await Promise.all(repos.map(r => usableGen(r.name, r.head, r.headTime, whole)));
  const ticket: Ticket = { k: key, t: d.target, s: whole ? 0 : Math.min(d.start, replayStart(d.now)), w: whole, r: repos.map(r => [r.name, r.head, r.headTime, r.diskKB]) };
  const plan: Plan = {
    k: key, kind: d.kind, mode: d.mode, s: d.start, n: d.now, p: d.profile, c: d.contributions, x: d.restricted,
    o: [d.omittedRepos, d.omittedCommits], ...(named.length ? { b: named.map(s => [s.name, s.commits] as [string, number]) } : {}),
    ...(d.github ? { g: d.github } : {}), ...(alias ? { a: alias } : {}),
    r: repos.map((r, i) => ({ n: r.name, f: r.fork, c: r.commits, h: r.head, ...(r.shas ? { sh: r.shas } : {}),
      ...(gens[i] && gens[i] !== REPLAY_GEN ? { gen: gens[i] } : {}) })),
  };
  return {
    key, target: d.target, kind: d.kind, profile: d.profile, start: d.start, cost: d.cost,
    ticket: sign(ticket, TTL), plan: sign(plan, TTL),
    repos: repos.map((r, i) => ({ name: r.name, commits: r.commits, mb: Math.round(r.diskKB / 1024), cached: gens[i] > 0 })),
    skipped: d.skipped,
  };
}

// Fluid compute runs concurrent requests in one process, 2 GB between them. Big replays side by side can outgrow
// that together though each fits alone (every client sends a city's biggest repos first, four at a time), so
// they take turns; small repos, most of any city, never wait. A request that waits too long is told the builder
// is busy, and the page asks again.
const HEAVY_KB = 16 * 1024;
const TURN_WAIT_MS = 150_000;      // the function has 300 s: this leaves a replay that waited the whole time 130
const heavy = new Turns();

export async function buildRepo(ticketToken: string, name: string) {
  const t0 = Date.now();
  const t = verify<Ticket>(ticketToken);
  if (!t) throw new HttpError(401, 'build ticket expired; reload the page');
  const entry = t.r.find(r => r[0] === name);
  if (!entry) throw new HttpError(400, 'repository is not part of this build');
  const [repo, head, headTime, kb] = entry;
  const path = repoPath(repo, head, t.w);
  if (await exists(path)) return { cached: true };
  const big = kb === undefined || kb >= HEAVY_KB;      // a ticket from before sizes were kept counts every repo as big
  if (big && !(await heavy.take(TURN_WAIT_MS))) throw new HttpError(503, 'the builder is busy with other big repos', { status: 'busy' });
  try {
    if (big && Date.now() - t0 > 2000 && await exists(path)) return { cached: true };   // replayed for another build meanwhile
    const { record, stats } = await replayRepo({
      repo, head, headTime, start: t.s, timeoutMs: Math.min(240_000, 280_000 - (Date.now() - t0)), maxPackBytes: 400e6,
      token: process.env.GITHUB_TOKEN, log: m => console.log(m),
    });
    await putJSON(path, record, { overwrite: true });
    return { cached: false, files: record.files.length, commits: record.commits.length, ms: stats.ms, mb: Math.round(stats.packBytes / 1e5) / 10, partial: record.partial };
  } catch (e) {
    if (e instanceof GitError) {
      const m = process.memoryUsage();
      console.log(`${repo}: ${e.code}: ${e.message}; live ${((m.heapUsed + m.external) / 1e6).toFixed(0)} MB, rss ${(m.rss / 1e6).toFixed(0)} MB, ${heavy.waiting} waiting`);
      if (e.code === 'busy') throw new HttpError(503, 'the builder is short of memory right now', { status: 'busy' });
      const reason = e.code === 'too_big' ? 'too big for the hosted builder' : e.code === 'timeout' ? 'took too long to replay'
        : e.code === 'not_found' ? 'not readable' : `fetch failed (${e.message.slice(0, 120)})`;
      throw new HttpError(422, reason, { status: 'repo_failed' });
    }
    throw e;
  } finally {
    if (big) heavy.done();
  }
}

export async function finishBuild(ticketToken: string, planToken: string): Promise<CityMeta> {
  const t = verify<Ticket>(ticketToken), p = verify<Plan>(planToken);
  if (!t || !p || t.k !== p.k) throw new HttpError(401, 'build ticket expired; reload the page');
  const records = await Promise.all(p.r.map(r => getJSON<RepoRecord>(repoPath(r.n, r.h, t.w, r.gen))
    .then(rec => (rec?.v === RECORD_VERSION ? rec : null), () => null)));     // another record shape counts as missing
  const repos = p.r.map((r, i) => ({ r, rec: records[i] })).filter(x => x.rec).map(({ r, rec }) => ({
    name: r.n, fork: r.f, record: rec!,
    mine: p.mode === 'mine' ? mineOf(rec!, { shas: new Set(r.sh ?? []) }) : mineOf(rec!, { since: p.s }),
  }));
  const missing = p.r.filter((_, i) => !records[i]);
  let payload: Payload;
  try {
    payload = bundle({
      login: p.p.login, name: p.p.name, kind: p.kind, avatar: p.p.avatar, url: p.p.url,
      now: Math.floor(Date.now() / 1000), start: p.s, contributions: p.c, restricted: p.x, repos,
      omittedRepos: p.o[0] + missing.length, omittedCommits: p.o[1] + missing.reduce((a, r) => a + r.c, 0), tooBig: p.b, github: p.g,
      maxRepos: 60,
    });
  } catch {
    throw new HttpError(422, p.kind === 'user' ? 'no public commits on default branches in the last year' : 'no commits in the last year', { status: 'empty' });
  }
  const v = Date.now();
  const url = await putJSON(cityPath(p.k, v), payload);
  const meta = summarize(payload, { v, key: p.k, target: t.t, kind: p.kind, url });
  await putJSON(skyPath(p.k, v), skyline(payload)).catch(e => console.error('sky', e));
  await putJSON(metaPath(p.k), meta, { overwrite: true, maxAge: 60 });
  if (p.a) await putJSON(metaPath(p.a), meta, { overwrite: true, maxAge: 60 }).catch(e => console.error('moved', e));
  await addToGallery(meta).catch(e => console.error('gallery', e));
  return meta;
}

// gallery/recent.json is rewritten by every build, and the blob CDN serves an overwritten blob long past its
// max-age: in production a copy 30 minutes stale showed vercel's earlier numbers, and a build that read it and
// wrote it back undid the build before it (sindresorhus). So each version is also written where it is never
// overwritten, and the rewritten blob's content type, which a head request reads from the store itself, names
// the current one. Writes are conditional on its etag, so two builds finishing together both get in.
async function galleryNow(): Promise<{ list: GalleryEntry[]; etag: string | null }> {
  const st = await getStore().stat(GALLERY);
  if (!st) return { list: [], etag: null };
  const id = /;\s*version=([\w-]+)/.exec(st.type)?.[1];
  return { list: (await getJSON<GalleryEntry[]>(id ? galleryAt(id) : GALLERY)) ?? [], etag: st.etag };
}

export async function readGallery(): Promise<GalleryEntry[]> {
  return (await galleryNow()).list;
}

async function updateGallery(change: (list: GalleryEntry[]) => GalleryEntry[] | null) {
  for (let attempt = 1; ; attempt++) {
    const { list, etag } = await galleryNow();
    const next = change(list);
    if (!next) return;
    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    await putJSON(galleryAt(id), next);
    try {
      await putJSON(GALLERY, next, { maxAge: 60, type: `application/json; version=${id}`, ...(etag ? { ifMatch: etag } : { overwrite: false }) });
      return;
    } catch (e) {
      if (!(e instanceof StoreConflict) || attempt >= 8) throw e;    // another build wrote first: apply this change to theirs
      await new Promise(r => setTimeout(r, Math.random() * 100 * attempt));
    }
  }
}

export async function addToGallery(m: CityMeta) {
  await updateGallery(list => [galleryEntry(m), ...list.filter(e => e.key !== m.key)].slice(0, GALLERY_MAX));
}

const share = (n: number, total: number) => (total ? Math.round((1000 * n) / total) / 1000 : 0);

export function galleryEntry(m: CityMeta): GalleryEntry {
  return {
    key: m.key, target: m.target, kind: m.kind, avatar: m.avatar, commits: m.commits, repos: m.repos, lines: m.lines, v: m.v,
    agent: share(m.who.agent, m.commits), bot: share(m.who.bot, m.commits),
  };
}

export async function removeFromGallery(owner: string) {
  const o = owner.toLowerCase();
  await updateGallery(list => {
    const next = list.filter(e => e.key !== o && !e.key.startsWith(o + '/'));
    return next.length !== list.length ? next : null;
  });
}

export function summarize(payload: Payload, base: Pick<CityMeta, 'v' | 'key' | 'target' | 'kind' | 'url'>): CityMeta {
  let files = 0, lines = 0;
  const langs = new Array(payload.langs.length).fill(0);
  const sizes = payload.repos.map(r => {
    let s = 0;
    r.e.forEach((ev, i) => {
      const last = ev[ev.length - 1];
      if (last > 0) { files++; lines += last; langs[r.l[i]] += last; s += last; }
    });
    return [r.n, s] as const;
  });
  const byActor = new Array<number>(payload.who.length).fill(0);
  for (const r of payload.repos) for (const m of r.m) byActor[m[3] ?? 0]++;
  const agents = payload.who.map((id, i) => [id, byActor[i]] as [string, number]).filter(([id]) => id !== 'human' && id !== 'bot')
    .sort((a, b) => b[1] - a[1] || (a[0] < b[0] ? -1 : a[0] > b[0] ? 1 : 0));
  const bot = payload.who.indexOf('bot');
  return {
    ...base, generated: payload.generated, login: payload.user.login, name: payload.user.name, avatar: payload.user.avatar,
    repos: payload.repos.length, commits: payload.totals.commits, files, lines, window_start: payload.totals.window_start,
    top: [...sizes].sort((a, b) => b[1] - a[1]).slice(0, 5).map(x => x[0]), langs,
    who: { human: byActor[0], bot: bot > 0 ? byActor[bot] : 0, agent: agents.reduce((a, x) => a + x[1], 0), agents },
  };
}
