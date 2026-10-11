// startBuild's answers before any git work: what a visitor is told when there is nothing the hosted builder can replay.
import assert from 'node:assert/strict';
import { after, test } from 'node:test';
import { tmpdir } from './helpers';

process.env.LOCAL_STORE_DIR = tmpdir('cc-city-');
const { addToGallery, readGallery, readSettings, startBuild, writeSettings } = await import('../lib/city');
const { listVersions, putJSON } = await import('../lib/store');
type CityMeta = import('../lib/city').CityMeta;
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

/** The meta of a built city, as much of it as the gallery reads. */
function meta(key: string, v: number): CityMeta {
  return {
    v, key, target: key, kind: key.includes('/') ? 'repo' : 'user', url: `https://blob.example/${key}/${v}.json.gz`, generated: '', login: key.split('/')[0],
    name: key, avatar: '', repos: 1, commits: 10, files: 1, lines: 100, window_start: '', top: [], langs: [], who: { human: 10, bot: 0, agent: 0, agents: [] },
  };
}

test('the list written before versions is read, and carried into the first version', async () => {
  await putJSON('gallery/recent.json', [{ ...meta('old', 1), agent: 0, bot: 0 }].map(({ key, target, kind, avatar, commits, repos, lines, v }) =>
    ({ key, target, kind, avatar, commits, repos, lines, v, agent: 0, bot: 0 })), { overwrite: true });
  assert.deepEqual((await readGallery()).map(e => e.key), ['old']);
  await addToGallery(meta('first', 500));
  assert.deepEqual((await readGallery()).map(e => e.key), ['first', 'old']);
  assert.equal((await listVersions('gallery/recent/')).length, 1);
});

test('cities built at the same moment all reach the gallery', async () => {
  await Promise.all(['ada', 'grace', 'linus', 'ken/unix'].map((k, i) => addToGallery(meta(k, 1000 + i))));
  assert.deepEqual((await readGallery()).map(e => e.key).slice(0, 4), ['ken/unix', 'linus', 'grace', 'ada']);
});

test('a rebuilt city moves to the front once, and old versions are pruned', async () => {
  for (let i = 0; i < 12; i++) await addToGallery(meta(`user${i}`, 2000 + i));
  await addToGallery(meta('ada', 3000));
  const keys = (await readGallery()).map(e => e.key);
  assert.equal(keys[0], 'ada');
  assert.equal(keys.filter(k => k === 'ada').length, 1);
  assert.ok(keys.includes('ken/unix') && keys.includes('user0'));
  assert.ok((await listVersions('gallery/recent/')).length <= 8);
});

test('a hidden owner leaves the gallery, repo cities too, and stays out', async () => {
  await writeSettings('ken', { hidden: true });
  const keys = (await readGallery()).map(e => e.key);
  assert.ok(!keys.includes('ken/unix'));
  assert.ok(keys.includes('ada') && keys.includes('linus'));
  await addToGallery(meta('grace', 4000));
  assert.ok(!(await readGallery()).some(e => e.key.startsWith('ken')));
});

test('a fresh settings read sees the latest write; a plain one reads the CDN copy', async () => {
  await writeSettings('ada', { exclude: ['ada/old'] });
  await writeSettings('ada', { exclude: ['ada/new'] });
  assert.deepEqual((await readSettings('ada', true)).exclude, ['ada/new']);
  await putJSON('settings/ada.json', { exclude: ['ada/cdn'] }, { overwrite: true });   // what a stale edge would serve
  assert.deepEqual((await readSettings('ada')).exclude, ['ada/cdn']);
  assert.deepEqual((await readSettings('ada', true)).exclude, ['ada/new']);
  assert.equal((await listVersions('settings/ada/')).length, 2);
});

test('a hidden owner cannot be rebuilt, however stale the CDN copy', async () => {
  await putJSON('settings/ken.json', {}, { overwrite: true });
  await assert.rejects(startBuild({ kind: 'owner', login: 'ken' }, 'token'), (e: unknown) => e instanceof HttpError && e.status === 403);
});
