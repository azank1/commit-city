// Discovery over the GitHub GraphQL API: who the target is, which repos make their city, and (for a person)
// which commits in each are theirs. A whole city costs a handful of GraphQL points; the replays that follow
// go over git, which does not touch the API rate limit at all.

export type Target = { kind: 'owner'; login: string } | { kind: 'repo'; owner: string; name: string };
export type Mode = 'mine' | 'all';

export interface DiscoveredRepo {
  name: string;                 // owner/name as GitHub spells it
  head: string;
  headTime: number;             // committer time of head, unix seconds
  fork: boolean;
  diskKB: number;
  commits: number;              // the target's commits in the window (all commits for orgs and repos)
  shas?: string[];              // the person's commits, sha12 (mode 'mine')
}

export interface Discovery {
  kind: 'user' | 'org' | 'repo';
  mode: Mode;
  target: string;               // canonical: 'torvalds' | 'facebook/react'
  profile: { login: string; name: string; avatar: string; url: string; createdAt: string };
  start: number;
  now: number;
  contributions: number | null;
  restricted: number;
  repos: DiscoveredRepo[];
  skipped: { name: string; reason: string; commits: number }[];
  omittedRepos: number;
  omittedCommits: number;
  cost: number;                 // GraphQL points spent
}

export class NotFound extends Error {}
export class RateLimited extends Error { constructor(msg: string, readonly resetAt: string) { super(msg); } }

export interface DiscoverOptions {
  token: string;
  now?: number;
  days?: number;                // window length; 0 = since the account/repo was created
  maxRepos?: number;
  maxDiskKB?: number;
  fetchImpl?: typeof fetch;
}

const DAY = 86400;
const q = (s: string) => JSON.stringify(s);

async function gql<T>(o: DiscoverOptions, query: string, variables: Record<string, unknown>, cost: { n: number }): Promise<T> {
  const f = o.fetchImpl ?? fetch;
  for (let attempt = 1; ; attempt++) {
    const res = await f('https://api.github.com/graphql', {
      method: 'POST',
      headers: { Authorization: `bearer ${o.token}`, 'Content-Type': 'application/json', 'User-Agent': 'commit.city' },
      body: JSON.stringify({ query, variables }),
      signal: AbortSignal.timeout(30_000),
    });
    if ((res.status === 502 || res.status === 503) && attempt < 3) { await new Promise(r => setTimeout(r, 800 * attempt)); continue; }
    const body = await res.json().catch(() => ({})) as { data?: T & { rateLimit?: { cost: number; remaining: number; resetAt: string } }; errors?: { type?: string; message: string }[]; message?: string };
    if (res.status === 401) throw new Error('GitHub token rejected (401)');
    if (res.status === 403 || res.status === 429 || body.errors?.some(e => e.type === 'RATE_LIMITED')) {
      throw new RateLimited(body.message || body.errors?.[0]?.message || 'GitHub rate limit', res.headers.get('x-ratelimit-reset') ?? '');
    }
    if (!res.ok) throw new Error(`GitHub GraphQL HTTP ${res.status}`);
    const rl = body.data?.rateLimit;
    if (rl) cost.n += rl.cost;
    if (body.errors?.length && !body.data) throw new Error(body.errors.map(e => e.message).join('; '));
    return body.data as T;
  }
}

const RATE = 'rateLimit { cost remaining resetAt }';

const OWNER_Q = `query($login: String!, $from: DateTime!, $to: DateTime!) {
  ${RATE}
  repositoryOwner(login: $login) {
    __typename login avatarUrl url
    ... on User {
      id name createdAt
      contributionsCollection(from: $from, to: $to) {
        restrictedContributionsCount
        contributionCalendar { totalContributions }
        commitContributionsByRepository(maxRepositories: 100) { repository { nameWithOwner isPrivate isFork } }
      }
      repositories(first: 100, ownerAffiliations: OWNER, privacy: PUBLIC, orderBy: {field: PUSHED_AT, direction: DESC}) {
        nodes { nameWithOwner isFork pushedAt }
      }
    }
    ... on Organization {
      id name createdAt
      repositories(first: 100, privacy: PUBLIC, orderBy: {field: PUSHED_AT, direction: DESC}) {
        nodes { nameWithOwner isFork isArchived pushedAt }
      }
    }
  }
}`;

interface RepoNode {
  nameWithOwner: string; isPrivate: boolean; isFork: boolean; diskUsage: number | null;
  defaultBranchRef: { target: { oid: string; committedDate: string; history: { totalCount: number; pageInfo: { hasNextPage: boolean; endCursor: string | null }; nodes?: { oid: string }[] } } | null } | null;
}

function repoFields(history: string) {
  return `nameWithOwner isPrivate isFork diskUsage
    defaultBranchRef { target { ... on Commit { oid committedDate ${history} } } }`;
}

function splitName(n: string): [string, string] { const i = n.indexOf('/'); return [n.slice(0, i), n.slice(i + 1)]; }

/** Run fn over items, at most n at a time. */
async function pmap<T, R>(items: T[], n: number, fn: (x: T) => Promise<R>): Promise<R[]> {
  const out = new Array<R>(items.length);
  let i = 0;
  await Promise.all(Array.from({ length: Math.min(n, items.length) }, async () => {
    while (i < items.length) { const k = i++; out[k] = await fn(items[k]); }
  }));
  return out;
}

const BATCH = 20;          // repositories per GraphQL call
const PARALLEL = 4;        // GraphQL calls in flight

/** Batched repository lookups: BATCH repos per GraphQL call, PARALLEL calls at a time. */
async function repoBatch(o: DiscoverOptions, names: string[], history: (alias: string) => string, vars: Record<string, unknown>, varDefs: string, cost: { n: number }) {
  const out = new Map<string, RepoNode | null>();
  const chunks: string[][] = [];
  for (let i = 0; i < names.length; i += BATCH) chunks.push(names.slice(i, i + BATCH));
  await pmap(chunks, PARALLEL, async chunk => {
    const body = chunk.map((n, k) => {
      const [owner, name] = splitName(n);
      return `r${k}: repository(owner: ${q(owner)}, name: ${q(name)}) { ${repoFields(history(`r${k}`))} }`;
    }).join('\n');
    const data = await gql<Record<string, RepoNode | null>>(o, `query(${varDefs}) { ${RATE}\n${body} }`, vars, cost);
    chunk.forEach((n, k) => out.set(n, data[`r${k}`] ?? null));
  });
  return new Map(names.map(n => [n, out.get(n) ?? null]));
}

export async function discover(target: Target, o: DiscoverOptions): Promise<Discovery> {
  const now = Math.floor(o.now ?? Date.now() / 1000);
  const days = o.days ?? 365;
  const maxRepos = o.maxRepos ?? 50;
  const maxDiskKB = o.maxDiskKB ?? 1_500_000;
  const cost = { n: 0 };
  const iso = (s: number) => new Date(s * 1000).toISOString().replace(/\.\d{3}Z$/, 'Z');
  const windowStart = (created: string) => {
    const c = Math.floor(Date.parse(created) / 1000);
    const s = days > 0 ? Math.floor((now - days * DAY) / DAY) * DAY : c;     // whole UTC days: replays get shared
    return Math.max(s, c - DAY);
  };

  if (target.kind === 'repo') return discoverRepo(target, o, windowStart, cost);

  const contribFrom = now - 365 * DAY + 60;                                  // the API allows a one-year span
  const own = await gql<{ repositoryOwner: null | {
    __typename: 'User' | 'Organization'; login: string; avatarUrl: string; url: string; id: string; name: string | null; createdAt: string;
    contributionsCollection?: { restrictedContributionsCount: number; contributionCalendar: { totalContributions: number };
      commitContributionsByRepository: { repository: { nameWithOwner: string; isPrivate: boolean; isFork: boolean } }[] };
    repositories: { nodes: { nameWithOwner: string; isFork: boolean; isArchived?: boolean; pushedAt: string | null }[] };
  } }>(o, OWNER_Q, { login: target.login, from: iso(contribFrom), to: iso(now) }, cost);
  const u = own.repositoryOwner;
  if (!u) throw new NotFound(`no GitHub user or organization named ${target.login}`);
  const start = windowStart(u.createdAt);
  const profile = { login: u.login, name: u.name ?? '', avatar: u.avatarUrl, url: u.url, createdAt: u.createdAt };
  const pushedInWindow = u.repositories.nodes.filter(r => r.pushedAt && Date.parse(r.pushedAt) / 1000 >= start);

  if (u.__typename === 'Organization') {
    const names = pushedInWindow.filter(r => !r.isArchived).map(r => r.nameWithOwner);
    const nodes = await repoBatch(o, names, () => 'history(first: 1, since: $since) { totalCount pageInfo { hasNextPage endCursor } }',
      { since: iso(start) }, '$since: GitTimestamp!', cost);
    const repos: DiscoveredRepo[] = [];
    const skipped: Discovery['skipped'] = [];
    for (const [n, node] of nodes) {
      const t = node?.defaultBranchRef?.target;
      if (!node || !t || node.isPrivate || !t.history.totalCount) continue;
      const r = { name: node.nameWithOwner, head: t.oid, headTime: Date.parse(t.committedDate) / 1000, fork: node.isFork, diskKB: node.diskUsage ?? 0, commits: t.history.totalCount };
      if (r.diskKB > maxDiskKB) skipped.push({ name: n, reason: `too big for the hosted builder (${Math.round(r.diskKB / 1024)} MB)`, commits: r.commits });
      else repos.push(r);
    }
    repos.sort((a, b) => b.commits - a.commits || a.name.localeCompare(b.name));
    const kept = repos.slice(0, Math.min(maxRepos, 24));            // an org's busiest repos
    const rest = repos.slice(kept.length);
    return {
      kind: 'org', mode: 'all', target: u.login, profile, start, now, contributions: null, restricted: 0, repos: kept, skipped,
      omittedRepos: rest.length + skipped.length, omittedCommits: [...rest, ...skipped].reduce((a, r) => a + r.commits, 0), cost: cost.n,
    };
  }

  // a person: repos with their commit contributions, plus public repos they own that were pushed in the window
  const cc = u.contributionsCollection!;
  const cands = new Map<string, boolean>();
  for (const row of cc.commitContributionsByRepository) if (!row.repository.isPrivate) cands.set(row.repository.nameWithOwner, row.repository.isFork);
  for (const r of pushedInWindow) if (!cands.has(r.nameWithOwner)) cands.set(r.nameWithOwner, r.isFork);
  const names = [...cands.keys()];
  const hist = (after?: string) => `history(first: 100, since: $since, author: {id: $uid}${after ? `, after: ${q(after)}` : ''}) { totalCount pageInfo { hasNextPage endCursor } nodes { oid } }`;
  const nodes = await repoBatch(o, names, () => hist(), { since: iso(start), uid: u.id }, '$since: GitTimestamp!, $uid: ID!', cost);
  const shas = new Map<string, string[]>();
  const skipped: Discovery['skipped'] = [];
  const big: [string, number][] = [];
  for (const [n, node] of nodes) {
    const h = node?.defaultBranchRef?.target?.history;
    if (!h || node!.isPrivate || !h.totalCount) continue;
    if ((node!.diskUsage ?? 0) > maxDiskKB) {                          // counted, not paged through, not drawn
      skipped.push({ name: node!.nameWithOwner, reason: `too big for the hosted builder (${Math.round((node!.diskUsage ?? 0) / 1024)} MB)`, commits: h.totalCount });
      continue;
    }
    shas.set(n, (h.nodes ?? []).map(x => x.oid));
    if (h.pageInfo.hasNextPage) big.push([n, h.totalCount]);
  }
  // more than a page of their commits in a repo: split the window into time slices and read the slices in
  // parallel, rather than walking one cursor 100 commits at a time
  type Slice = { n: string; since: string; until: string; after?: string };
  let slices: Slice[] = [];
  for (const [n, total] of big) {
    const k = Math.min(12, Math.ceil(total / 100));
    for (let j = 0; j < k; j++) slices.push({ n, since: iso(start + (j * (now - start)) / k), until: iso(start + ((j + 1) * (now - start)) / k) });
  }
  const found = new Map<string, Set<string>>(big.map(([n]) => [n, new Set(shas.get(n))]));
  const pageUntil = Date.now() + 45_000;
  for (let round = 0; slices.length && round < 30 && Date.now() < pageUntil; round++) {
    const chunks: Slice[][] = [];
    for (let i = 0; i < slices.length; i += BATCH) chunks.push(slices.slice(i, i + BATCH));
    const next = (await pmap(chunks, PARALLEL, async chunk => {
      const body = chunk.map((sl, k) => {
        const [owner, name] = splitName(sl.n);
        return `r${k}: repository(owner: ${q(owner)}, name: ${q(name)}) { defaultBranchRef { target { ... on Commit {
          history(first: 100, since: ${q(sl.since)}, until: ${q(sl.until)}, author: {id: $uid}${sl.after ? `, after: ${q(sl.after)}` : ''}) {
            pageInfo { hasNextPage endCursor } nodes { oid } } } } } }`;
      }).join('\n');
      const data = await gql<Record<string, RepoNode | null>>(o, `query($uid: ID!) { ${RATE}\n${body} }`, { uid: u.id }, cost);
      const more: Slice[] = [];
      chunk.forEach((sl, k) => {
        const h = data[`r${k}`]?.defaultBranchRef?.target?.history;
        if (!h) return;
        for (const x of h.nodes ?? []) found.get(sl.n)!.add(x.oid);
        if (h.pageInfo.hasNextPage && h.pageInfo.endCursor) more.push({ ...sl, after: h.pageInfo.endCursor });
      });
      return more;
    })).flat();
    slices = next;
  }
  for (const [n, set] of found) shas.set(n, [...set]);
  // a commit that also lives in a fork counts once, in the repo where most of yours are
  const seen = new Set<string>();
  const ranked = names.filter(n => shas.get(n)?.length).sort((a, b) => shas.get(b)!.length - shas.get(a)!.length || a.localeCompare(b));
  const repos: DiscoveredRepo[] = [];
  for (const n of ranked) {
    const mine = shas.get(n)!.filter(s => !seen.has(s));
    mine.forEach(s => seen.add(s));
    if (!mine.length) continue;
    const node = nodes.get(n)!, t = node.defaultBranchRef!.target!;
    repos.push({ name: node.nameWithOwner, head: t.oid, headTime: Date.parse(t.committedDate) / 1000, fork: node.isFork,
      diskKB: node.diskUsage ?? 0, commits: mine.length, shas: mine.map(s => s.slice(0, 12)) });
  }
  const kept = repos.slice(0, maxRepos), rest = repos.slice(maxRepos);
  return {
    kind: 'user', mode: 'mine', target: u.login, profile, start, now,
    contributions: cc.contributionCalendar.totalContributions, restricted: cc.restrictedContributionsCount,
    repos: kept, skipped, omittedRepos: rest.length + skipped.length,
    omittedCommits: [...rest, ...skipped].reduce((a, r) => a + r.commits, 0), cost: cost.n,
  };
}

async function discoverRepo(target: Extract<Target, { kind: 'repo' }>, o: DiscoverOptions,
  windowStart: (created: string) => number, cost: { n: number }): Promise<Discovery> {
  const now = Math.floor(o.now ?? Date.now() / 1000);
  const data = await gql<{ repository: null | (RepoNode & { createdAt: string; url: string; owner: { login: string; avatarUrl: string; url: string } }) }>(o,
    `query($owner: String!, $name: String!) { ${RATE}
      repository(owner: $owner, name: $name) { nameWithOwner isPrivate isFork diskUsage createdAt url
        owner { login avatarUrl url }
        defaultBranchRef { target { ... on Commit { oid committedDate } } } } }`,
    { owner: target.owner, name: target.name }, cost);
  const r = data.repository;
  if (!r || r.isPrivate || !r.defaultBranchRef?.target) throw new NotFound(`no public repository ${target.owner}/${target.name}`);
  const start = windowStart(r.createdAt);
  const t = r.defaultBranchRef.target;
  const counted = await gql<{ repository: RepoNode }>(o,
    `query($owner: String!, $name: String!, $since: GitTimestamp!) { ${RATE}
      repository(owner: $owner, name: $name) { defaultBranchRef { target { ... on Commit { history(first: 1, since: $since) { totalCount } } } } } }`,
    { owner: target.owner, name: target.name, since: new Date(start * 1000).toISOString() }, cost);
  const commits = counted.repository.defaultBranchRef?.target?.history.totalCount ?? 0;
  const repo: DiscoveredRepo = { name: r.nameWithOwner, head: t.oid, headTime: Date.parse(t.committedDate) / 1000, fork: r.isFork, diskKB: r.diskUsage ?? 0, commits };
  const tooBig = repo.diskKB > (o.maxDiskKB ?? 1_500_000);
  return {
    kind: 'repo', mode: 'all', target: r.nameWithOwner,
    profile: { login: r.nameWithOwner, name: r.nameWithOwner, avatar: r.owner.avatarUrl, url: r.url, createdAt: r.createdAt },
    start, now, contributions: null, restricted: 0,
    repos: tooBig ? [] : [repo],
    skipped: tooBig ? [{ name: repo.name, reason: `too big for the hosted builder (${Math.round(repo.diskKB / 1024)} MB)`, commits }] : [],
    omittedRepos: tooBig ? 1 : 0, omittedCommits: tooBig ? commits : 0, cost: cost.n,
  };
}
