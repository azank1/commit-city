// GitHub's public timeline for commit.city/events: the latest public events, compacted and sorted by who sent
// them (human, bot or AI agent). One upstream read serves every visitor: results are memoised per instance and
// cached at the edge, so the page's polling never reaches GitHub directly.
import { AGENTS, classifyActor } from '../engine/agents.js';
import { handle, json } from '../http.js';

export interface LiveEvent {
  id: string;
  t: number;              // created_at, unix seconds
  type: string;           // push | pr | merge | review | issue | comment | star | fork | release | create | delete | public
  act?: string;           // the payload's action, where it has one (opened, closed, ...)
  rt?: string;            // create/delete: repository | branch | tag
  actor: string;
  aid: number;
  repo: string;
  n?: number;             // PR or issue number
  tag?: string;           // release tag
  who: string;            // '' human, 'bot', or an agent id
}

type Raw = {
  id: string; type: string; created_at: string;
  actor?: { id?: number; login?: string }; repo?: { name?: string };
  payload?: {
    action?: string; ref?: string | null; ref_type?: string; number?: number;
    pull_request?: { number?: number; merged?: boolean; head?: { ref?: string } };
    issue?: { number?: number; pull_request?: unknown }; release?: { tag_name?: string };
  };
};

const TYPE: Record<string, string> = {
  PushEvent: 'push', PullRequestEvent: 'pr', PullRequestReviewEvent: 'review', PullRequestReviewCommentEvent: 'review',
  IssuesEvent: 'issue', IssueCommentEvent: 'comment', CommitCommentEvent: 'comment', WatchEvent: 'star', ForkEvent: 'fork',
  ReleaseEvent: 'release', CreateEvent: 'create', DeleteEvent: 'delete', PublicEvent: 'public',
};

/** One raw event -> the compact form, or null for types the city doesn't draw. */
export function compactEvent(e: Raw): LiveEvent | null {
  let type = TYPE[e.type];
  const repo = e.repo?.name, actor = e.actor?.login;
  if (!type || !repo || !actor) return null;
  const p = e.payload ?? {};
  const out: LiveEvent = { id: e.id, t: Math.floor(Date.parse(e.created_at) / 1000), type, actor, aid: e.actor?.id ?? 0, repo, who: '' };
  if (p.action) out.act = p.action;
  let ref: string | null | undefined = null;
  if (type === 'push') ref = p.ref;
  if (type === 'pr') {
    ref = p.pull_request?.head?.ref;
    out.n = p.pull_request?.number ?? p.number;
    if (p.action === 'merged' || (p.action === 'closed' && p.pull_request?.merged)) type = out.type = 'merge';
  }
  if (type === 'review') ref = p.pull_request?.head?.ref, out.n = p.pull_request?.number;
  if (type === 'issue' || type === 'comment') out.n = p.issue?.number;
  if (type === 'release' && p.release?.tag_name) out.tag = p.release.tag_name.slice(0, 40);
  if (type === 'create' || type === 'delete') { out.rt = p.ref_type; if (p.ref_type === 'branch') ref = p.ref; }
  out.who = classifyActor(actor, ref?.replace(/^refs\/heads\//, '') ?? null);
  return out;
}

const PAGES = 3, MEMO_MS = 15_000, WINDOW_S = 20 * 60;
let memo: { at: number; body: unknown } | null = null;
let inflight: Promise<unknown> | null = null;

async function readTimeline(): Promise<unknown> {
  const token = process.env.GITHUB_TOKEN;
  const headers: Record<string, string> = { Accept: 'application/vnd.github+json', 'User-Agent': 'commit.city', 'X-GitHub-Api-Version': '2022-11-28' };
  if (token) headers.Authorization = `Bearer ${token}`;
  // without a token GitHub allows 60 requests an hour per IP: one page, and the edge cache does the rest
  const pages = token ? PAGES : 1;
  const res = await Promise.all(Array.from({ length: pages }, (_, i) =>
    fetch(`https://api.github.com/events?per_page=100&page=${i + 1}`, { headers, signal: AbortSignal.timeout(6000) })
      .then(async r => (r.ok ? ((await r.json()) as Raw[]) : Promise.reject(new Error(`GitHub ${r.status}`))))));
  const seen = new Set<string>();
  const events: LiveEvent[] = [];
  for (const raw of res.flat()) {
    if (seen.has(raw.id)) continue;
    seen.add(raw.id);
    const e = compactEvent(raw);
    if (e) events.push(e);
  }
  const newest = events.reduce((m, e) => Math.max(m, e.t), 0);
  const recent = events.filter(e => e.t >= newest - WINDOW_S).sort((a, b) => a.t - b.t);   // later pages carry stragglers from months ago
  const agents = Object.fromEntries(AGENTS.map(a => [a.id, { label: a.label, color: a.color }]));
  return { at: Math.floor(Date.now() / 1000), newest, events: recent, agents };
}

export const GET = handle(async () => {
  if (memo && Date.now() - memo.at < MEMO_MS) return ok(memo.body);
  try {
    inflight ??= readTimeline().finally(() => { inflight = null; });
    const body = await inflight;
    memo = { at: Date.now(), body };
    return ok(body);
  } catch (e) {
    if (memo) return ok(memo.body);                     // stale beats nothing
    return json({ error: 'the public timeline is unavailable right now', detail: String((e as Error).message) }, 503,
      { 'Cache-Control': 'public, s-maxage=10' });
  }
});

const ok = (body: unknown) => json(body, 200, { 'Cache-Control': 'public, max-age=5, s-maxage=15, stale-while-revalidate=45' });
