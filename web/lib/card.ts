// README cards (SVG) and link previews (SVG rasterised to PNG): the stats, a language bar and the city in
// miniature. Cards must be self-contained: GitHub serves them through its image proxy, so nothing loads.
import type { CityMeta } from './city.js';
import { LANG_CLASSES } from './engine/langs.js';
import { drawSky, LANG_HEX, type Sky } from './skyline.js';

const esc = (s: string) => s.replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]!));
export const compact = (n: number) =>
  n >= 1e6 ? `${(n / 1e6).toFixed(n >= 1e7 ? 0 : 1)}M` : n >= 1e3 ? `${(n / 1e3).toFixed(n >= 1e4 ? 0 : 1)}k` : String(n);
const fit = (s: string, max: number) => (s.length > max ? s.slice(0, max - 1) + '…' : s);

export type Theme = 'dark' | 'light';
const THEMES = {
  dark: { bg0: '#04060c', bg1: '#0b1526', ink: '#e8eef7', ink2: '#b4c0d3', muted: '#7f8ca2', line: 'rgba(255,255,255,.09)', track: 'rgba(255,255,255,.08)' },
  light: { bg0: '#f6f8fb', bg1: '#e8eef7', ink: '#0d1522', ink2: '#3a4659', muted: '#6a7486', line: 'rgba(13,21,34,.10)', track: 'rgba(13,21,34,.08)' },
};
const FONT = `font-family="Inter,system-ui,-apple-system,'Segoe UI',Helvetica,Arial,sans-serif"`;

type Meta = Pick<CityMeta, 'target' | 'kind' | 'name' | 'login' | 'commits' | 'repos' | 'files' | 'lines' | 'window_start' | 'langs'>;

function langBar(langs: number[], x: number, y: number, w: number, h: number, track: string): { bar: string; top: [string, number][] } {
  const total = langs.reduce((a, b) => a + b, 0);
  if (!total) return { bar: `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${h / 2}" fill="${track}"/>`, top: [] };
  const order = langs.map((v, i) => [i, v] as const).filter(([, v]) => v > 0).sort((a, b) => b[1] - a[1]);
  let cx = x;
  const segs = order.map(([i, v]) => {
    const sw = (v / total) * w;
    const r = `<rect x="${cx.toFixed(1)}" y="${y}" width="${Math.max(0, sw - 1.5).toFixed(1)}" height="${h}" fill="${LANG_HEX[i]}"/>`;
    cx += sw;
    return r;
  });
  return {
    bar: `<clipPath id="lb"><rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${h / 2}"/></clipPath><g clip-path="url(#lb)"><rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${track}"/>${segs.join('')}</g>`,
    top: order.slice(0, 3).map(([i, v]) => [LANG_CLASSES[i], v / total]),
  };
}

/** 860x300 README card. */
export function cardSVG(meta: Meta | null, sky: Sky | null, target: string, theme: Theme = 'dark', animate = true, avatar: string | null = null): string {
  const T = THEMES[theme];
  const W = 860, H = 300;
  const parts: string[] = [];
  parts.push(`<defs><linearGradient id="bg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${T.bg0}"/><stop offset="1" stop-color="${T.bg1}"/></linearGradient>
    <radialGradient id="glow" cx=".7" cy="1" r=".7"><stop offset="0" stop-color="#2c8fd6" stop-opacity="${theme === 'dark' ? 0.32 : 0.16}"/><stop offset="1" stop-color="#2c8fd6" stop-opacity="0"/></radialGradient></defs>`);
  parts.push(`<rect width="${W}" height="${H}" rx="14" fill="url(#bg)"/><rect width="${W}" height="${H}" rx="14" fill="url(#glow)"/>`);
  parts.push(`<rect x=".5" y=".5" width="${W - 1}" height="${H - 1}" rx="13.5" fill="none" stroke="${T.line}"/>`);
  if (meta && sky) parts.push(drawSky(sky, { x: 340, y: 18, w: 500, h: 264, maxBuildings: 480, maxPlatforms: 160, beams: true, rise: animate, avatar }));
  else parts.push(placeholderSky(340, 18, 500, 264));
  const title = meta ? (meta.kind === 'repo' ? meta.target : meta.login) : target;
  const sub = meta ? (meta.kind === 'org' ? 'organization' : meta.kind === 'repo' ? 'repository' : meta.name || '') : 'no city yet';
  parts.push(`<g ${FONT}>`);
  parts.push(`<text x="28" y="40" font-size="12" font-weight="700" letter-spacing="1.4" fill="#5fd3f3">COMMIT.CITY</text>`);
  parts.push(`<text x="28" y="80" font-size="${title.length > 22 ? 22 : 28}" font-weight="700" fill="${T.ink}">${esc(fit(title, 30))}</text>`);
  if (sub) parts.push(`<text x="28" y="104" font-size="14" fill="${T.muted}">${esc(fit(sub, 40))}</text>`);
  if (meta) {
    const stat = (x: number, y: number, v: string, label: string) =>
      `<text x="${x}" y="${y}" font-size="22" font-weight="700" fill="${T.ink}">${v}</text><text x="${x}" y="${y + 17}" font-size="11.5" fill="${T.muted}">${label}</text>`;
    parts.push(stat(28, 150, compact(meta.commits), 'commits'), stat(128, 150, String(meta.repos), meta.repos === 1 ? 'repo' : 'repos'),
      stat(208, 150, compact(meta.lines), 'lines standing'));
    const lb = langBar(meta.langs, 28, 196, 290, 8, T.track);
    parts.push(lb.bar);
    parts.push(`<text x="28" y="226" font-size="11.5" fill="${T.ink2}">${lb.top.map(([n, f], k) =>
      `<tspan fill="${LANG_HEX[LANG_CLASSES.indexOf(n)]}">●</tspan> ${esc(n)} ${Math.round(f * 100)}%${k < lb.top.length - 1 ? '   ' : ''}`).join('')}</text>`);
    parts.push(`<text x="28" y="272" font-size="12" fill="${T.muted}">since ${meta.window_start} · commit.city/${esc(fit(meta.target, 34))}</text>`);
  } else {
    parts.push(`<text x="28" y="160" font-size="14" fill="${T.ink2}">Open commit.city/${esc(fit(target, 30))}</text>`);
    parts.push(`<text x="28" y="182" font-size="14" fill="${T.ink2}">to build this city.</text>`);
  }
  parts.push('</g>');
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" role="img" aria-label="${esc(title)} on commit.city">${parts.join('')}</svg>`;
}

/** 1200x630 link preview, rasterised by api/og. */
export function ogSVG(meta: Meta | null, sky: Sky | null, target: string, avatar: string | null): string {
  const T = THEMES.dark;
  const W = 1200, H = 630;
  const parts: string[] = [];
  parts.push(`<defs><linearGradient id="bg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#03050a"/><stop offset="1" stop-color="#0b1526"/></linearGradient>
    <radialGradient id="glow" cx=".68" cy="1" r=".75"><stop offset="0" stop-color="#2c8fd6" stop-opacity=".38"/><stop offset="1" stop-color="#2c8fd6" stop-opacity="0"/></radialGradient>
    <clipPath id="av"><circle cx="92" cy="104" r="40"/></clipPath></defs>`);
  parts.push(`<rect width="${W}" height="${H}" fill="url(#bg)"/><rect width="${W}" height="${H}" fill="url(#glow)"/>`);
  if (meta && sky) parts.push(drawSky(sky, { x: 450, y: 30, w: 720, h: 570, maxBuildings: 1100, maxPlatforms: 500, beams: true, avatar }));
  else parts.push(placeholderSky(450, 30, 720, 570));
  const title = meta ? (meta.kind === 'repo' ? meta.target : meta.login) : target;
  if (avatar) parts.push(`<circle cx="92" cy="104" r="42" fill="#0e1522" stroke="#8ff0ff" stroke-width="2"/><image href="${avatar}" x="52" y="64" width="80" height="80" clip-path="url(#av)" preserveAspectRatio="xMidYMid slice"/>`);
  const tx = avatar ? 150 : 52;
  parts.push(`<g ${FONT}>`);
  parts.push(`<text x="${tx}" y="96" font-size="18" font-weight="700" letter-spacing="2" fill="#5fd3f3">COMMIT.CITY</text>`);
  parts.push(`<text x="${tx}" y="134" font-size="${title.length > 18 ? 30 : 38}" font-weight="700" fill="${T.ink}">${esc(fit(title, 26))}</text>`);
  if (meta) {
    const stat = (y: number, v: string, label: string) =>
      `<text x="52" y="${y}" font-size="54" font-weight="700" fill="${T.ink}">${v}</text><text x="52" y="${y + 30}" font-size="20" fill="${T.muted}">${label}</text>`;
    parts.push(stat(250, compact(meta.commits), `commits since ${meta.window_start}`));
    parts.push(stat(370, `${meta.repos}`, meta.repos === 1 ? 'repo' : 'repos'));
    parts.push(`<text x="200" y="370" font-size="54" font-weight="700" fill="${T.ink}">${compact(meta.lines)}</text><text x="200" y="400" font-size="20" fill="${T.muted}">lines standing</text>`);
    const lb = langBar(meta.langs, 52, 450, 340, 12, T.track);
    parts.push(lb.bar);
    parts.push(`<text x="52" y="492" font-size="18" fill="${T.ink2}">${lb.top.slice(0, 2).map(([n, f], k) =>
      `<tspan fill="${LANG_HEX[LANG_CLASSES.indexOf(n)]}">●</tspan> ${esc(n)} ${Math.round(f * 100)}%${k === 0 ? '    ' : ''}`).join('')}</text>`);
  } else {
    parts.push(`<text x="52" y="260" font-size="28" fill="${T.ink2}">A GitHub history,</text><text x="52" y="300" font-size="28" fill="${T.ink2}">replayed as a living 3D city.</text>`);
  }
  parts.push(`<text x="52" y="580" font-size="22" fill="${T.muted}">commit.city/${esc(fit(meta?.target ?? target, 30))}</text>`);
  parts.push('</g>');
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">${parts.join('')}</svg>`;
}

/** The site's own pages, previewed: a headline over a placeholder skyline. 1200x630. */
const SITE_OG: Record<string, { kick: string; title: [string, string]; sub: [string, string]; path: string }> = {
  home: { kick: 'COMMIT.CITY', title: ['Your GitHub,', 'as a living city.'], sub: ['Swap github.com for commit.city on any', 'profile, org or repo.'], path: '' },
  events: { kick: '● GITHUB, LIVE', title: ['All of GitHub,', 'right now.'], sub: ['Every public push, PR and release as a beam,', 'sorted by people, bots and AI agents.'], path: '/events' },
  explore: { kick: 'EXPLORE', title: ['Every city,', 'so far.'], sub: ['People, orgs and repos, replayed as', 'cities you can fly through.'], path: '/explore' },
  readme: { kick: 'README CARD', title: ['Your city,', 'on your profile.'], sub: ['A live card with your skyline, stats', 'and language mix.'], path: '/readme' },
  about: { kick: 'HOW IT WORKS', title: ['Git history,', 'drawn to scale.'], sub: ['What a city shows, what it stores,', 'and how to run it yourself.'], path: '/about' },
};
export function siteOgSVG(page: string): string {
  const P = SITE_OG[page] ?? SITE_OG.home;
  const T = THEMES.dark;
  const W = 1200, H = 630;
  const kickFill = page === 'events' ? '#4fd18b' : '#5fd3f3';
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
    <defs><linearGradient id="bg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#03050a"/><stop offset="1" stop-color="#0b1526"/></linearGradient>
    <radialGradient id="glow" cx=".72" cy="1" r=".8"><stop offset="0" stop-color="#2c8fd6" stop-opacity=".4"/><stop offset="1" stop-color="#2c8fd6" stop-opacity="0"/></radialGradient>
    <linearGradient id="fade" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#03050a" stop-opacity=".85"/><stop offset=".55" stop-color="#03050a" stop-opacity="0"/></linearGradient></defs>
    <rect width="${W}" height="${H}" fill="url(#bg)"/><rect width="${W}" height="${H}" fill="url(#glow)"/>
    ${placeholderSky(560, 120, 620, 500)}
    <rect width="${W}" height="${H}" fill="url(#fade)"/>
    <g ${FONT}>
      <text x="64" y="104" font-size="20" font-weight="700" letter-spacing="3" fill="${kickFill}">${esc(P.kick)}</text>
      <text x="62" y="196" font-size="72" font-weight="700" letter-spacing="-2" fill="${T.ink}">${esc(P.title[0])}</text>
      <text x="62" y="278" font-size="72" font-weight="700" letter-spacing="-2" fill="#5fd3f3">${esc(P.title[1])}</text>
      <text x="64" y="352" font-size="27" fill="${T.ink2}">${esc(P.sub[0])}</text>
      <text x="64" y="390" font-size="27" fill="${T.ink2}">${esc(P.sub[1])}</text>
      <text x="64" y="570" font-size="24" font-weight="700" fill="${T.ink}">commit<tspan fill="#5fd3f3">.city</tspan><tspan font-weight="400" fill="${T.muted}">${esc(P.path)}</tspan></text>
    </g></svg>`;
}

/** The skyline alone on a transparent ground, for posters: 880x605 (16:11) by default. `detail` caps the
 * buildings drawn, so gallery thumbnails stay small. */
export function skySVG(sky: Sky | null, avatar: string | null, animate = true, W = 880, H = 605, detail = 1100): string {
  const pad = Math.round(W * 0.032);
  const body = sky
    ? drawSky(sky, { x: pad, y: pad, w: W - 2 * pad, h: H - 2 * pad, maxBuildings: detail, maxPlatforms: Math.round(detail * 0.45), beams: true, avatar, rise: animate })
    : placeholderSky(pad, pad, W - 2 * pad, H - 2 * pad);
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">${body}</svg>`;
}

/** A generic little city for targets that have none yet. Deterministic. */
function placeholderSky(x: number, y: number, w: number, h: number): string {
  const b: number[] = [];
  let seed = 7;
  const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
  for (let i = 0; i < 6; i++) for (let j = 0; j < 6; j++) {
    if (rnd() < 0.25) continue;
    b.push(i * 1.6 - 4, j * 1.6 - 4, 1.1, 1.1, 0, 0.4 + rnd() * rnd() * 5, Math.floor(rnd() * 3) * 2);
  }
  return drawSky({ b, p: [], i: [0, 0, 10.4, 6] }, { x, y, w, h, id: 'z' }).replace('<g>', '<g opacity=".55">');
}
