// The Blob store through the real @vercel/blob SDK, with only its HTTP mocked. The SDK checks option combinations
// itself, which the stand-in stores of the other tests cannot: a conditional gallery write that passed every test
// failed in production on one of those checks (ifMatch beside allowOverwrite: false).
import assert from 'node:assert/strict';
import { after, test } from 'node:test';
import { getGlobalDispatcher, MockAgent, setGlobalDispatcher } from 'undici';

process.env.BLOB_READ_WRITE_TOKEN = 'vercel_blob_rw_TestStore123_secret';
process.env.VERCEL_BLOB_API_URL = 'https://blob.test/api/blob';
process.env.VERCEL_BLOB_RETRIES = '0';
delete process.env.BLOB_STORE_ID;
const { getStore, putJSON, StoreConflict } = await import('../lib/store');

const agent = new MockAgent();
agent.disableNetConnect();
const before = getGlobalDispatcher();
setGlobalDispatcher(agent);
after(() => setGlobalDispatcher(before));
const api = agent.get('https://blob.test');

// request headers as the store received them, lower-cased; undici hands them over as an object or as name, value pairs
function headerMap(h: unknown): Record<string, string> {
  const pairs: [string, string][] = [];
  if (Array.isArray(h)) for (let i = 0; i < h.length; i += 2) pairs.push([String(h[i]), String(h[i + 1])]);
  else for (const [k, v] of Object.entries((h ?? {}) as Record<string, unknown>)) pairs.push([k, String(v)]);
  return Object.fromEntries(pairs.map(([k, v]) => [k.toLowerCase(), v]));
}

function expectPut(pathname: string, status = 200, body: object = {}) {
  const seen: { headers?: Record<string, string> } = {};
  api.intercept({ path: p => p === `/api/blob/?pathname=${encodeURIComponent(pathname)}`, method: 'PUT' })
    .reply(status, opts => {
      seen.headers = headerMap(opts.headers);
      return status === 200 ? { url: `https://teststore123.public.blob.vercel-storage.com/${pathname}`, pathname, etag: '"after"', ...body } : body;
    });
  return seen;
}

test('a conditional write reaches the store as a conditional overwrite', async () => {
  const seen = expectPut('gallery/recent.json');
  await putJSON('gallery/recent.json', [], { maxAge: 60, type: 'application/json; version=v1', ifMatch: '"before"' });
  assert.equal(seen.headers?.['x-if-match'], '"before"');
  assert.equal(seen.headers?.['x-allow-overwrite'], '1');
  assert.equal(seen.headers?.['x-content-type'], 'application/json; version=v1');
  assert.equal(seen.headers?.['x-cache-control-max-age'], '60');
});

test('a conditional write that lost the race is a StoreConflict, not an error to give up on', async () => {
  expectPut('gallery/recent.json', 412, { error: { code: 'precondition_failed', message: 'The blob was modified' } });
  await assert.rejects(putJSON('gallery/recent.json', [], { ifMatch: '"stale"' }), StoreConflict);
});

test('a plain write overwrites only when asked to', async () => {
  const plain = expectPut('cities/someone/1.json');
  await putJSON('cities/someone/1.json', {});
  assert.equal(plain.headers?.['x-allow-overwrite'], '0');
  assert.equal(plain.headers?.['x-if-match'], undefined);
  const over = expectPut('meta/someone.json');
  await putJSON('meta/someone.json', {}, { overwrite: true, maxAge: 60 });
  assert.equal(over.headers?.['x-allow-overwrite'], '1');
});

test('stat is the store\'s own content type and etag', async () => {
  api.intercept({ path: p => p === `/api/blob?url=${encodeURIComponent('gallery/recent.json')}`, method: 'GET' }).reply(200, {
    url: 'https://teststore123.public.blob.vercel-storage.com/gallery/recent.json', pathname: 'gallery/recent.json',
    contentType: 'application/json; version=v1', etag: '"after"', size: 2, uploadedAt: new Date().toISOString(),
    cacheControl: 'public, max-age=60', contentDisposition: 'inline; filename="recent.json"',
  });
  assert.deepEqual(await getStore().stat('gallery/recent.json'), { type: 'application/json; version=v1', etag: '"after"' });
  api.intercept({ path: p => p.startsWith('/api/blob?url='), method: 'GET' }).reply(404, { error: { code: 'not_found', message: 'not found' } });
  assert.equal(await getStore().stat('gallery/none.json'), null);
});
