// README card: /api/card?t=<user|org|owner/repo>[&all=1][&theme=light][&animate=0] -> SVG.
// &layout=sky gives the skyline alone (no text, transparent), as the landing page's poster.
import { avatarUri } from '../lib/avatar.js';
import { cardSVG, skySVG } from '../lib/card.js';
import { readMeta, readSettings, readSky } from '../lib/city.js';
import { handle } from '../lib/http.js';
import { cityKey, parseTarget, wantsWhole } from '../lib/target.js';

const svg = (body: string, ready: boolean) => new Response(body, {
  headers: {
    'Content-Type': 'image/svg+xml; charset=utf-8',
    'Cache-Control': ready ? 'public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400' : 'public, max-age=300, s-maxage=300',
  },
});

export const GET = handle(async req => {
  const u = new URL(req.url);
  const theme = u.searchParams.get('theme') === 'light' ? 'light' : 'dark';
  const animate = u.searchParams.get('animate') !== '0';
  const bare = u.searchParams.get('layout') === 'sky';
  let target;
  try { target = parseTarget(u.searchParams.get('t')); } catch { return svg(bare ? skySVG(null, null) : cardSVG(null, null, '?', theme, false), false); }
  const name = target.kind === 'owner' ? target.login : `${target.owner}/${target.name}`;
  const owner = target.kind === 'owner' ? target.login : target.owner;
  const [meta, settings] = await Promise.all([readMeta(cityKey(target, wantsWhole(u.searchParams.get('all')))), readSettings(owner)]);
  const m = settings.hidden ? null : meta;
  const [sky, avatar] = m ? await Promise.all([readSky(m), avatarUri(m.avatar, 96)]) : [null, null];
  return svg(bare ? skySVG(sky, avatar, animate) : cardSVG(m, sky, name, theme, animate, avatar), !!m);
});
