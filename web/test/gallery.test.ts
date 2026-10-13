import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { test } from 'node:test';
import { addToGallery, type CityMeta, GALLERY, readGallery, removeFromGallery } from '../lib/city';
import { putJSON, setStore, type Store, StoreConflict } from '../lib/store';

// The blob store as production showed it: a read of an overwritten blob can return the first copy ever written
// (a stale CDN), while head requests (stat) and conditional writes see the store itself.
class StaleCdnStore implements Store {
  blobs = new Map<string, { data: Buffer; type: string }>();
  first = new Map<string, Buffer>();
  async get(p: string) { return this.first.get(p) ?? null; }
  async exists(p: string) { return this.blobs.has(p); }
  async stat(p: string) { const b = this.blobs.get(p); return b ? { type: b.type, etag: createHash('sha1').update(b.data).digest('hex') } : null; }
  async put(p: string, data: Buffer, o: { contentType: string; overwrite?: boolean; ifMatch?: string }) {
    await new Promise(r => setTimeout(r, Math.random() * 5));     // writers interleave, as concurrent builds do
    if (o.ifMatch !== undefined) { if ((await this.stat(p))?.etag !== o.ifMatch) throw new StoreConflict(`${p} changed`); }
    else if (!o.overwrite && this.blobs.has(p)) throw new Error(`blob exists: ${p}`);
    this.blobs.set(p, { data, type: o.contentType });
    if (!this.first.has(p)) this.first.set(p, data);
    return `mem:/${p}`;
  }
  url(p: string) { return `mem:/${p}`; }
  async list(prefix: string) { return [...this.blobs.keys()].filter(k => k.startsWith(prefix)).map(pathname => ({ pathname, uploadedAt: new Date(0), size: 0 })); }
  async del(p: string) { this.blobs.delete(p); }
}

const meta = (key: string, commits: number) => ({
  key, target: key, kind: key.includes('/') ? 'repo' : 'user', avatar: '', commits, repos: 1, lines: 10, v: Date.now(),
  who: { human: commits, bot: 0, agent: 0, agents: [] },
}) as unknown as CityMeta;

test('builds finishing together all reach the gallery, through a stale CDN copy', async () => {
  setStore(new StaleCdnStore());
  await addToGallery(meta('first', 1));
  await Promise.all(['a', 'b', 'c', 'd', 'e'].map((k, i) => addToGallery(meta(k, 10 + i))));
  const keys = (await readGallery()).map(e => e.key);
  assert.equal(keys.length, 6);
  assert.deepEqual(new Set(keys), new Set(['first', 'a', 'b', 'c', 'd', 'e']));
  assert.equal(keys.at(-1), 'first');
});

test('a rebuilt city moves to the front once, with its new numbers', async () => {
  setStore(new StaleCdnStore());
  await addToGallery(meta('vercel', 14661));
  await addToGallery(meta('torvalds', 863));
  await addToGallery(meta('vercel', 21136));
  const g = await readGallery();
  assert.deepEqual(g.map(e => [e.key, e.commits]), [['vercel', 21136], ['torvalds', 863]]);
});

test('hiding an owner takes their cities out of the gallery', async () => {
  setStore(new StaleCdnStore());
  for (const k of ['me', 'me/app', 'meadow', 'you']) await addToGallery(meta(k, 5));
  await removeFromGallery('Me');
  assert.deepEqual((await readGallery()).map(e => e.key), ['you', 'meadow']);
});

test('a gallery written before versions is read, and carried into the first version', async () => {
  setStore(new StaleCdnStore());
  await putJSON(GALLERY, [{ ...meta('old', 3), agent: 0, bot: 0 }], { overwrite: true });
  assert.deepEqual((await readGallery()).map(e => e.key), ['old']);
  await addToGallery(meta('new', 4));
  assert.deepEqual((await readGallery()).map(e => e.key), ['new', 'old']);
});

test('the landing lists show one city per repo, under the name GitHub uses now', async () => {
  setStore(new StaleCdnStore());
  const { GET } = await import('../lib/routes/gallery');
  await addToGallery({ ...meta('facebook/react', 685), target: 'react/react' });      // built before the repo moved
  await addToGallery(meta('react/react', 689));
  await putJSON('meta/react/react.json', meta('react/react', 689));
  const g = await (await GET(new Request('https://commit.city/api/gallery'))).json() as { featured: { key: string }[]; recent: { key: string; commits: number }[] };
  assert.deepEqual(g.recent.map(e => [e.key, e.commits]), [['react/react', 689]]);
  assert.deepEqual(g.featured.map(e => e.key), ['react/react']);
});
