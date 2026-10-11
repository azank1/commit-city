// The Blob store's fresh reads: the read-modify-writes (recent cities, owner settings) depend on them.
import assert from 'node:assert/strict';
import { after, test } from 'node:test';

process.env.BLOB_STORE_ID = 'store_TestStore123';
delete process.env.BLOB_READ_WRITE_TOKEN;
const { getJSON } = await import('../lib/store');

const realFetch = globalThis.fetch;
after(() => { globalThis.fetch = realFetch; });

test('a fresh read of a public blob gets past the CDN cache, every time', async () => {
  const seen: string[] = [];
  globalThis.fetch = (async (url: string | URL, init?: RequestInit) => {
    seen.push(String(url));
    assert.equal(init?.cache, 'no-store');
    return Response.json([{ key: 'torvalds' }]);
  }) as typeof fetch;
  assert.deepEqual(await getJSON('gallery/recent.json', true), [{ key: 'torvalds' }]);
  await getJSON('gallery/recent.json', true);
  assert.equal(seen.length, 2);
  for (const u of seen) assert.match(u, /^https:\/\/teststore123\.public\.blob\.vercel-storage\.com\/gallery\/recent\.json\?fresh=\w+$/);
  assert.notEqual(seen[0], seen[1], 'each fresh read needs its own cache key');
});

test('a fresh read says missing only for a 404, and throws on anything else', async () => {
  globalThis.fetch = (async () => new Response('nope', { status: 404 })) as typeof fetch;
  assert.equal(await getJSON('settings/someone.json', true), null);
  globalThis.fetch = (async () => new Response('busy', { status: 503 })) as typeof fetch;
  await assert.rejects(getJSON('settings/someone.json', true), /HTTP 503/);
});
