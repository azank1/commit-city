// The city page: the viewer's markup and styles, the builder overlay, and share metadata for link previews.
// The payload itself loads in the browser (public/s/city.js), so this page is small and cacheable.
import { type CityMeta, readMeta } from '../lib/city.js';
import { handle, SITE } from '../lib/http.js';
import { cityKey, parseTarget, wantsWhole } from '../lib/target.js';
import { VIEWER_APP, VIEWER_BODY, VIEWER_CSS } from '../lib/viewer-shell.js';

const esc = (s: string) => s.replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]!));
const fmt = (n: number) => n.toLocaleString('en-US');

export function describe(target: string, meta: CityMeta | null): string {
  if (!meta) return `${target} on GitHub, replayed as a 3D city: every file a building, every commit a pulse of light.`;
  const who = meta.kind === 'repo' ? meta.target : meta.login;
  return `${who}: ${fmt(meta.commits)} commits across ${meta.repos} repo${meta.repos === 1 ? '' : 's'} since ${meta.window_start}, ` +
    `${fmt(meta.files)} files and ${fmt(meta.lines)} lines, replayed as a 3D city time-lapse.`;
}

export const GET = handle(async req => {
  const u = new URL(req.url);
  const target = parseTarget(u.searchParams.get('t'));
  const all = target.kind === 'repo' && wantsWhole(u.searchParams.get('all'));
  const key = cityKey(target, all);
  const meta = await readMeta(key).catch(() => null);
  const name = target.kind === 'owner' ? target.login : `${target.owner}/${target.name}`;
  const shown = meta?.target ?? name;
  const path = `/${shown}${all ? '?all=1' : ''}`;
  const title = `${shown}${all ? ' (whole history)' : ''} · commit city`;
  const desc = describe(shown, meta);
  const og = `${SITE}/api/og?t=${encodeURIComponent(shown)}${all ? '&all=1' : ''}${meta ? `&v=${meta.v}` : ''}`;
  const boot = JSON.stringify({ target: name, key, all, app: VIEWER_APP, meta }).replace(/</g, '\\u003c');
  const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>${esc(title)}</title>
<meta name="description" content="${esc(desc)}">
<link rel="canonical" href="${SITE}${esc(path)}">
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<meta property="og:type" content="website">
<meta property="og:site_name" content="commit.city">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(desc)}">
<meta property="og:url" content="${SITE}${esc(path)}">
<meta property="og:image" content="${esc(og)}">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${esc(title)}">
<meta name="twitter:description" content="${esc(desc)}">
<meta name="twitter:image" content="${esc(og)}">
<style>${VIEWER_CSS}</style>
<link rel="stylesheet" href="/s/city.css">
<link rel="preload" href="${VIEWER_APP}" as="script">
</head>
<body>
${VIEWER_BODY}
<img id="avatar-src" hidden alt="">
<script id="lapse-data" type="application/json"></script>
<nav id="cc-bar" aria-label="commit.city">
  <a class="cc-brand" href="/" title="commit.city home"><span class="cc-logo" aria-hidden="true"></span><span class="cc-wm">commit<span>.city</span></span></a>
  <a class="cc-link" href="/explore">Explore</a><a class="cc-link" href="/events"><i class="cc-live"></i>Live</a>
  <form id="cc-go" class="cc-go" role="search"><label for="cc-q" class="cc-sr">GitHub user, org or owner/repo</label><input id="cc-q" placeholder="any GitHub user or owner/repo" autocomplete="off" spellcheck="false"><button aria-label="Open city">→</button></form>
  <span id="cc-age" class="cc-age" hidden></span>
  <button id="cc-share" class="cc-btn cc-primary" hidden>Share</button>
  <a class="cc-btn cc-star" href="https://github.com/azank1/commit-city" target="_blank" rel="noopener" title="Star commit.city on GitHub">★ <span>Star</span></a>
</nav>
<div id="cc-sheet" hidden></div>
<div id="cc-build" hidden></div>
<script>window.CC = ${boot};</script>
<script src="/s/city.js" defer></script>
</body>
</html>`;
  return new Response(html, {
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Cache-Control': meta ? 'public, max-age=0, s-maxage=60, stale-while-revalidate=600' : 'public, max-age=0, s-maxage=5',
    },
  });
});
