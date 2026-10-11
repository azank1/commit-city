// Link previews: /api/og?t=<target>[&all=1][&v=<city version>] -> 1200x630 PNG; /api/og[?page=events|explore|...] for the site's own pages.
import { Resvg } from '@resvg/resvg-js';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { avatarUri } from '../lib/avatar.js';
import { ogSVG, siteOgSVG } from '../lib/card.js';
import { type CityMeta, readMeta, readSettings, readSky } from '../lib/city.js';
import { handle } from '../lib/http.js';
import { cityKey, parseTarget, wantsWhole } from '../lib/target.js';

// Resolved from this module, not the working directory: inside the deployed function the cwd is not web/, and
// resvg skips a missing font file without a word, so every preview silently lost its text. The literal
// `new URL(..., import.meta.url)` form is also what Vercel's file tracer follows to ship the fonts.
const FONT_PATHS = {
  'Inter-Regular.ttf': fileURLToPath(new URL('../fonts/Inter-Regular.ttf', import.meta.url)),
  'Inter-Bold.ttf': fileURLToPath(new URL('../fonts/Inter-Bold.ttf', import.meta.url)),
};
const FONTS = Object.entries(FONT_PATHS).map(([f, p]) => [p, path.join(process.cwd(), 'fonts', f)].find(c => existsSync(c)) ?? p);
if (!FONTS.every(f => existsSync(f))) console.error(`og: Inter fonts missing from the function bundle, previews will have no text: ${FONTS.join(', ')}`);

export const GET = handle(async req => {
  const u = new URL(req.url);
  if (!u.searchParams.get('t')) {
    const png = new Resvg(siteOgSVG(u.searchParams.get('page') ?? 'home'), {
      fitTo: { mode: 'width', value: 1200 },
      font: { fontFiles: FONTS, loadSystemFonts: false, defaultFontFamily: 'Inter' },
    }).render().asPng();
    return new Response(new Uint8Array(png), { headers: { 'Content-Type': 'image/png', 'Cache-Control': 'public, max-age=3600, s-maxage=86400' } });
  }
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
