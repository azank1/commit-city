// What a city's owner has done on GitHub since the city was built: the target's recent public events (a person's,
// an org's or one repo's), compacted like /api/live. The city page polls this to fly new pushes in as they happen.
import { handle, HttpError, json } from '../http.js';
import { parseTarget } from '../target.js';
import { compactEvent, type LiveEvent } from './live.js';

const memo = new Map<string, { at: number; events: LiveEvent[] }>();
const MEMO_MS = 30_000;

export const GET = handle(async req => {
  const u = new URL(req.url);
  const target = parseTarget(u.searchParams.get('t'));
  const kind = u.searchParams.get('kind');
  const path = target.kind === 'repo' ? `repos/${target.owner}/${target.name}/events` : kind === 'org' ? `orgs/${target.login}/events` : `users/${target.login}/events/public`;
  const key = path.toLowerCase();
  let hit = memo.get(key);
  if (!hit || Date.now() - hit.at > MEMO_MS) {
    const token = process.env.GITHUB_TOKEN;
    const r = await fetch(`https://api.github.com/${path}?per_page=100`, {
      headers: { Accept: 'application/vnd.github+json', 'User-Agent': 'commit.city', 'X-GitHub-Api-Version': '2022-11-28', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
      signal: AbortSignal.timeout(6000),
    }).catch(() => null);
    if (!r || !r.ok) {
      if (r && r.status === 404) throw new HttpError(404, 'not found');
      if (hit) return ok(hit.events);
      throw new HttpError(503, 'GitHub did not answer');
    }
    const events = ((await r.json()) as Parameters<typeof compactEvent>[0][]).map(compactEvent).filter((e): e is LiveEvent => !!e).sort((a, b) => a.t - b.t);
    hit = { at: Date.now(), events };
    memo.set(key, hit);
    if (memo.size > 500) memo.delete(memo.keys().next().value!);
  }
  return ok(hit.events);
});

const ok = (events: LiveEvent[]) => json({ at: Math.floor(Date.now() / 1000), events }, 200, { 'Cache-Control': 'public, max-age=20, s-maxage=45, stale-while-revalidate=60' });
