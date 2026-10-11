// startBuild's answers before any git work: what a visitor is told when there is nothing the hosted builder can replay.
import assert from 'node:assert/strict';
import { after, test } from 'node:test';
import { tmpdir } from './helpers';

process.env.LOCAL_STORE_DIR = tmpdir('cc-city-');
const { startBuild } = await import('../lib/city');
const { HttpError } = await import('../lib/http');

const realFetch = globalThis.fetch;
after(() => { globalThis.fetch = realFetch; });

/** GitHub GraphQL answering every query about one repository of the given size (KB) and commit count. */
function fakeGitHub(diskUsage: number, totalCount: number) {
  globalThis.fetch = (async (url: string | URL) => {
    assert.match(String(url), /api\.github\.com\/graphql$/);
    return Response.json({ data: {
      rateLimit: { cost: 1, remaining: 4999, resetAt: '2026-10-11T13:00:00Z' },
      repository: {
        nameWithOwner: 'torvalds/linux', isPrivate: false, isFork: false, diskUsage, createdAt: '2011-09-04T22:48:12Z',
        url: 'https://github.com/torvalds/linux', owner: { login: 'torvalds', avatarUrl: 'https://avatars.example/u/1024025', url: 'https://github.com/torvalds' },
        defaultBranchRef: { target: { oid: 'a'.repeat(40), committedDate: '2026-10-10T12:00:00Z', history: { totalCount, pageInfo: { hasNextPage: false, endCursor: null } } } },
      },
    } });
  }) as typeof fetch;
}

test('a repo too big to replay is reported as too big, not as having no commits', async () => {
  fakeGitHub(6_402_000, 87_724);
  await assert.rejects(startBuild({ kind: 'repo', owner: 'torvalds', name: 'linux' }, 'token'), (e: unknown) => {
    assert.ok(e instanceof HttpError);
    assert.equal(e.status, 422);
    assert.equal(e.extra.status, 'too_big');
    assert.match(e.message, /torvalds\/linux is too big/);
    const [s] = e.extra.skipped as { name: string; reason: string; commits: number }[];
    assert.equal(s.commits, 87_724);
    assert.match(s.reason, /6252 MB/);
    return true;
  });
});

test('a repo within the limit starts a build', async () => {
  fakeGitHub(50_000, 1_200);
  const st = await startBuild({ kind: 'repo', owner: 'torvalds', name: 'linux' }, 'token');
  assert.equal(st.repos.length, 1);
  assert.equal(st.skipped.length, 0);
});
