import assert from 'node:assert/strict';
import { test } from 'node:test';
import { GET } from '../api/page';
import { putJSON, setStore, type Store } from '../lib/store';

class MemStore implements Store {
  blobs = new Map<string, Buffer>();
  async get(p: string) { return this.blobs.get(p) ?? null; }
  async exists(p: string) { return this.blobs.has(p); }
  async stat() { return null; }
  async put(p: string, data: Buffer) { this.blobs.set(p, data); return `mem:/${p}`; }
  url(p: string) { return `mem:/${p}`; }
  async list() { return []; }
  async del(p: string) { this.blobs.delete(p); }
}

const meta = (key: string, target: string) => ({ v: 1, key, target, kind: 'repo', login: target, name: target, avatar: '', url: '', generated: '',
  repos: 1, commits: 685, files: 1, lines: 1, window_start: '2025-10-11', who: { human: 685, bot: 0, agent: 0, agents: [] } });

test('a repo GitHub moved opens under its current name; others stay put', async () => {
  setStore(new MemStore());
  await putJSON('meta/facebook/react.json', meta('facebook/react', 'react/react'));
  await putJSON('meta/react/react.json', meta('react/react', 'react/react'));
  const moved = await GET(new Request('https://commit.city/api/page?t=facebook/react'));
  assert.equal(moved.status, 307);
  assert.equal(moved.headers.get('location'), '/react/react');
  const whole = await GET(new Request('https://commit.city/api/page?t=facebook/react&all=1'));
  assert.equal(whole.status, 200);                      // no whole-history city of it yet: the build page, not a redirect
  const here = await GET(new Request('https://commit.city/api/page?t=React/React'));
  assert.equal(here.status, 200);                       // a different case is the same name
  assert.match(await here.text(), /<title>react\/react · commit city<\/title>/);
});
