// Discovery against a stubbed GitHub GraphQL: which repo a shared commit is drawn in, and GitHub's own count.
import assert from 'node:assert/strict';
import { test } from 'node:test';
import { discover } from '../lib/engine/discover';

const DAY = 86400;
const NOW = 1_790_000_000;
const iso = (s: number) => new Date(s * 1000).toISOString();

// me/lib is the person's fork of up/lib: the two commits merged upstream live in both, a third only in the fork
const HISTORY: Record<string, { fork: boolean; shas: string[] }> = {
  'up/lib': { fork: false, shas: ['a'.repeat(40), 'b'.repeat(40)] },
  'me/lib': { fork: true, shas: ['a'.repeat(40), 'b'.repeat(40), 'c'.repeat(40)] },
};

function stub(capped: boolean): typeof fetch {
  return (async (_url: string, init: { body: string }) => {
    const { query } = JSON.parse(init.body) as { query: string };
    const rateLimit = { cost: 1, remaining: 4999, resetAt: '' };
    if (query.includes('repositoryOwner')) {
      const listed = [{ repository: { nameWithOwner: 'up/lib', isPrivate: false, isFork: false } }];
      while (capped && listed.length < 100) listed.push({ repository: { nameWithOwner: `up/x${listed.length}`, isPrivate: true, isFork: false } });
      return Response.json({ data: { rateLimit, repositoryOwner: {
        __typename: 'User', login: 'me', avatarUrl: '', url: '', id: 'U1', name: 'Me', createdAt: iso(NOW - 3000 * DAY),
        contributionsCollection: { restrictedContributionsCount: 2, totalCommitContributions: 9, contributionCalendar: { totalContributions: 15 },
          commitContributionsByRepository: listed },
        repositories: { nodes: [{ nameWithOwner: 'me/lib', isFork: true, pushedAt: iso(NOW - 5 * DAY) }] },
      } } });
    }
    const data: Record<string, unknown> = { rateLimit };
    for (const [, k, owner, name] of query.matchAll(/r(\d+): repository\(owner: "([^"]+)", name: "([^"]+)"\)/g)) {
      const h = HISTORY[`${owner}/${name}`];
      data[`r${k}`] = h ? { nameWithOwner: `${owner}/${name}`, isPrivate: false, isFork: h.fork, diskUsage: 100,
        defaultBranchRef: { target: { oid: 'f'.repeat(40), committedDate: iso(NOW - DAY),
          history: { totalCount: h.shas.length, pageInfo: { hasNextPage: false, endCursor: null }, nodes: h.shas.map(oid => ({ oid })) } } } } : null;
    }
    return Response.json({ data });
  }) as unknown as typeof fetch;
}

test('a commit in both a fork and its source is drawn in the source, as GitHub counts it', async () => {
  const d = await discover({ kind: 'owner', login: 'me' }, { token: 't', now: NOW, fetchImpl: stub(false) });
  assert.deepEqual(d.repos.map(r => [r.name, r.commits]), [['up/lib', 2], ['me/lib', 1]]);
  assert.deepEqual(d.repos[1].shas, ['c'.repeat(12)]);
  assert.deepEqual([d.contributions, d.restricted, d.github], [15, 2, { commits: 9, capped: false }]);
});

test("GitHub's repo list at its cap of 100 is flagged, so the city can say some repos were never seen", async () => {
  const d = await discover({ kind: 'owner', login: 'me' }, { token: 't', now: NOW, fetchImpl: stub(true) });
  assert.deepEqual(d.github, { commits: 9, capped: true });
});
