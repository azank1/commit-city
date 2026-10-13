// Cities for the landing page: a hand-picked few, and the most recently built.
import { type GalleryEntry, readGallery, readMeta } from '../city.js';
import { handle, json } from '../http.js';

const FEATURED = ['torvalds', 'sindresorhus', 'vercel', 'facebook/react', 'denoland/deno', 'gaearon', 'karpathy', 'rust-lang/rust', 'withastro', 'antfu'];

export const GET = handle(async () => {
  const recent = await readGallery().catch(() => [] as GalleryEntry[]);
  // a featured city built lately takes its entry from the list, so both lists show the same build; its meta otherwise
  const latest = new Map(recent.map(e => [e.key, e]));
  const metas = await Promise.all(FEATURED.map(k => (latest.has(k) ? null : readMeta(k).catch(() => null))));
  const featured: GalleryEntry[] = FEATURED.flatMap((k, i) => {
    const e = latest.get(k), m = metas[i];
    if (e) return [e];
    if (!m) return [];
    return [{
      key: m.key, target: m.target, kind: m.kind, avatar: m.avatar, commits: m.commits, repos: m.repos, lines: m.lines, v: m.v,
      // commit shares as galleryEntry() in city.ts writes them; metas built before the agent lens have no `who`
      agent: m.who && m.commits ? Math.round((1000 * m.who.agent) / m.commits) / 1000 : 0,
      bot: m.who && m.commits ? Math.round((1000 * m.who.bot) / m.commits) / 1000 : 0,
    }];
  });
  return json({ featured, recent }, 200, { 'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=600' });
});
