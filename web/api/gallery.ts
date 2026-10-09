// Cities for the landing page: a hand-picked few, and the most recently built.
import { GALLERY, type GalleryEntry, readMeta } from '../lib/city.js';
import { handle, json } from '../lib/http.js';
import { getJSON } from '../lib/store.js';

const FEATURED = ['torvalds', 'sindresorhus', 'vercel', 'facebook/react', 'denoland/deno', 'gaearon', 'tj', 'rust-lang/rust', 'withastro', 'antfu'];

export const GET = handle(async () => {
  const [recent, metas] = await Promise.all([
    getJSON<GalleryEntry[]>(GALLERY).catch(() => null),
    Promise.all(FEATURED.map(k => readMeta(k).catch(() => null))),
  ]);
  const featured: GalleryEntry[] = metas.filter(m => m !== null).map(m => ({
    key: m.key, target: m.target, kind: m.kind, avatar: m.avatar, commits: m.commits, repos: m.repos, lines: m.lines, v: m.v,
  }));
  return json({ featured, recent: recent ?? [] }, 200, { 'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=600' });
});
