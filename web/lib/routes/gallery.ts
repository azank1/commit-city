// Cities for the landing page: a hand-picked few, and the most recently built.
import { GALLERY, type GalleryEntry, readMeta } from '../city.js';
import { handle, json } from '../http.js';
import { getJSON } from '../store.js';

const FEATURED = ['torvalds', 'sindresorhus', 'vercel', 'facebook/react', 'denoland/deno', 'gaearon', 'tj', 'rust-lang/rust', 'withastro', 'antfu'];

export const GET = handle(async () => {
  const [recent, metas] = await Promise.all([
    getJSON<GalleryEntry[]>(GALLERY).catch(() => null),
    Promise.all(FEATURED.map(k => readMeta(k).catch(() => null))),
  ]);
  const featured: GalleryEntry[] = metas.filter(m => m !== null).map(m => ({
    key: m.key, target: m.target, kind: m.kind, avatar: m.avatar, commits: m.commits, repos: m.repos, lines: m.lines, v: m.v,
    // commit shares as galleryEntry() in city.ts writes them; metas built before the agent lens have no `who`
    agent: m.who && m.commits ? Math.round((1000 * m.who.agent) / m.commits) / 1000 : 0,
    bot: m.who && m.commits ? Math.round((1000 * m.who.bot) / m.commits) / 1000 : 0,
  }));
  return json({ featured, recent: recent ?? [] }, 200, { 'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=600' });
});
