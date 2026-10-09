// Link previews: /api/og?t=<target>[&all=1][&v=<city version>] -> 1200x630 PNG.
import { Resvg } from '@resvg/resvg-js';
import path from 'node:path';
import { avatarUri } from '../lib/avatar.js';
import { ogSVG } from '../lib/card.js';
import { type CityMeta, readMeta, readSettings, readSky } from '../lib/city.js';
import { handle } from '../lib/http.js';
import { cityKey, parseTarget, wantsWhole } from '../lib/target.js';

const FONTS = ['Inter-Regular.ttf', 'Inter-Bold.ttf'].map(f => path.join(process.cwd(), 'fonts', f));

export const GET = handle(async req => {
  const u = new URL(req.url);
  let target;
  try { target = parseTarget(u.searchParams.get('t')); } catch { target = null; }
  const name = !target ? 'commit.city' : target.kind === 'owner' ? target.login : `${target.owner}/${target.name}`;
  let meta: CityMeta | null = null;
  if (target) {
    const owner = target.kind === 'owner' ? target.login : target.owner;
    const [m, settings] = await Promise.all([readMeta(cityKey(target, wantsWhole(u.searchParams.get('all')))), readSettings(owner)]);
    meta = settings.hidden ? null : m;
  }
  const [sky, avatar] = meta ? await Promise.all([readSky(meta), avatarUri(meta.avatar, 160)]) : [null, null];
  const png = new Resvg(ogSVG(meta, sky, name, avatar), {
    fitTo: { mode: 'width', value: 1200 },
    font: { fontFiles: FONTS, loadSystemFonts: false, defaultFontFamily: 'Inter' },
  }).render().asPng();
  const pinned = !!meta && u.searchParams.get('v') === String(meta.v);
  return new Response(new Uint8Array(png), {
    headers: {
      'Content-Type': 'image/png',
      'Cache-Control': pinned ? 'public, max-age=86400, s-maxage=31536000, immutable' : 'public, max-age=600, s-maxage=600',
    },
  });
});
