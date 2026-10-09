// A city in miniature for README cards and link previews: the viewer's own layout, frozen at the end of
// the window and drawn isometrically as plain SVG.
import type { Payload } from './engine/bundle.js';
import { BASE_H, heightOf, layoutRepo, placeIslands, STEP_H } from './layout.js';

export const LANG_HEX = ['#3987e5', '#d95926', '#199e70', '#c98500', '#d55181', '#008300', '#9085e9', '#e66767', '#7d7b75'];
const DEPTH_HEX = ['#161d2b', '#1c2537', '#232e44', '#2a3751', '#31405e', '#38496b', '#3f5278'];
const AY = 15;                                   // avatar altitude in the viewer
const MIN_PER_ISLAND = 8;

/**
 * World units, as in the viewer, most important first so a prefix is a good subset:
 * b: [x, z, w, d, y0, h, lang] per building; p: [x, z, w, d, depth] per directory platform;
 * i: [x, z, L, portY] per island.
 */
export interface Sky { b: number[]; p: number[]; i: number[] }

const r2 = (v: number) => Math.round(v * 100) / 100;

export function skyline(payload: Payload, maxBuildings = 1100, maxPlatforms = 500): Sky {
  const repos = payload.repos.map((r, ri) => {
    const n = r.p.length;
    const maxSize = new Float32Array(n), last = new Float32Array(n);
    for (let i = 0; i < n; i++) {
      const ev = r.e[i];
      let m = 0;
      for (let k = 1; k < ev.length; k += 2) if (ev[k] > m) m = ev[k];
      maxSize[i] = m;
      last[i] = ev[ev.length - 1];
    }
    return { ri, r, n, last, maxSize, lay: layoutRepo(r.p, maxSize) };
  });
  const { pos } = placeIslands(repos.map(x => ({ key: x.ri, org: x.r.n.split('/')[0], R: x.lay.L * 0.7071 + 0.8, weight: x.r.m.length })));
  const islands: number[] = [];
  const perIsland: number[][][] = [];
  const plats: number[][] = [];
  for (const x of repos) {
    const p = pos.get(x.ri) as { x: number; z: number };
    const dirs = x.lay.dirs as { id: number; depth: number; rect: number[]; parent: unknown }[];
    const live = new Set<number>();
    let mh = 0;
    const bs: number[][] = [];
    for (let i = 0; i < x.n; i++) {
      const d = dirs[x.lay.fileDir[i]];
      mh = Math.max(mh, heightOf(x.maxSize[i]) + d.depth * STEP_H);
      const h = heightOf(x.last[i]);
      if (h <= 0) continue;
      for (let k = x.lay.fileDir[i]; k > 0 && !live.has(k); k = (dirs[k].parent as { id: number }).id) live.add(k);
      const o = i * 4, fr = x.lay.fileRect, grow = Math.min(1, Math.max(0.35, h / 0.35));
      bs.push([p.x + fr[o], p.z + fr[o + 1], fr[o + 2] * grow, fr[o + 3] * grow, d.depth * STEP_H, h, x.r.l[i]]);
    }
    bs.sort((a, b) => b[5] * Math.sqrt(b[2] * b[3]) - a[5] * Math.sqrt(a[2] * a[3]));
    perIsland.push(bs);
    for (const k of live) {
      const d = dirs[k], [rx, ry, rw, rh] = d.rect;
      plats.push([p.x + rx + rw / 2, p.z + ry + rh / 2, rw, rh, d.depth]);
    }
    islands.push(r2(p.x), r2(p.z), r2(x.lay.L + 0.7), r2(Math.max(4, Math.min(16, mh + 3.2))));
  }
  // every island gets a few towers, then the rest of the budget goes to the most visible ones anywhere
  const first = perIsland.flatMap(bs => bs.slice(0, MIN_PER_ISLAND));
  const rest = perIsland.flatMap(bs => bs.slice(MIN_PER_ISLAND));
  rest.sort((a, b) => b[5] * Math.sqrt(b[2] * b[3]) - a[5] * Math.sqrt(a[2] * a[3]));
  const b = [...first, ...rest].slice(0, maxBuildings);
  plats.sort((a, b) => a[4] - b[4] || b[2] * b[3] - a[2] * a[3]);
  return { b: b.flat().map(r2), p: plats.slice(0, maxPlatforms).flat().map(r2), i: islands };
}

// ─────────────────────────────────────────────── drawing
const C30 = Math.cos(Math.PI / 6), S30 = 0.5;
const shade = (hex: string, k: number) => {
  const n = parseInt(hex.slice(1), 16);
  const ch = (v: number) => Math.max(0, Math.min(255, Math.round(k >= 1 ? v + (255 - v) * (k - 1) : v * k)));
  return `#${[(n >> 16) & 255, (n >> 8) & 255, n & 255].map(v => ch(v).toString(16).padStart(2, '0')).join('')}`;
};
const rows = (flat: number[], w: number, max = Infinity) => {
  const out: number[][] = [];
  for (let k = 0; k < Math.min(flat.length / w, max); k++) out.push(flat.slice(k * w, k * w + w));
  return out;
};

export interface DrawOptions {
  x: number; y: number; w: number; h: number;
  maxBuildings?: number; maxPlatforms?: number;
  beams?: boolean;            // the avatar above the centre, wired to every island
  avatar?: string | null;     // a data: URI drawn inside the avatar ring
  rise?: boolean;             // towers grow in when the card is shown
  id?: string;                // prefix for ids and classes, so two drawings can share a page
}

/** SVG markup (a <style> and a <g>) fitting the skyline into the box. */
export function drawSky(sky: Sky, o: DrawOptions): string {
  const B = rows(sky.b, 7, o.maxBuildings), P = rows(sky.p ?? [], 5, o.maxPlatforms ?? 400), I = rows(sky.i, 4);
  if (!I.length) return '';
  const id = o.id ?? 'k';
  const px = (x: number, z: number) => (x - z) * C30, py = (x: number, y: number, z: number) => (x + z) * S30 - y;
  let x0 = Infinity, x1 = -Infinity, y0 = Infinity, y1 = -Infinity;
  const fit = (x: number, y: number, z: number) => {
    const sx = px(x, z), sy = py(x, y, z);
    if (sx < x0) x0 = sx; if (sx > x1) x1 = sx; if (sy < y0) y0 = sy; if (sy > y1) y1 = sy;
  };
  const CORNERS = [[-1, -1], [1, -1], [1, 1], [-1, 1]];
  for (const [x, z, L] of I) for (const [dx, dz] of CORNERS) { fit(x + dx * L / 2, -BASE_H, z + dz * L / 2); fit(x + dx * L / 2, 0, z + dz * L / 2); }
  for (const [x, z, w, d, b, h] of B) for (const [dx, dz] of CORNERS) fit(x + dx * w / 2, b + h, z + dz * d / 2);
  const AVR = 4;
  if (o.beams) { fit(-AVR, AY + AVR, AVR); fit(AVR, AY + AVR, -AVR); }
  const k = Math.min(o.w / (x1 - x0), o.h / (y1 - y0));
  const ox = o.x + (o.w - (x1 - x0) * k) / 2 - x0 * k, oy = o.y + (o.h - (y1 - y0) * k) / 2 - y0 * k;
  const P2 = (x: number, y: number, z: number) => `${(ox + px(x, z) * k).toFixed(1)} ${(oy + py(x, y, z) * k).toFixed(1)}`;
  const quad = (a: number[][]) => `M${a.map(p => P2(p[0], p[1], p[2])).join('L')}Z`;
  const box = (cx: number, cz: number, w: number, d: number, b: number, t: number) => {
    const a = cx - w / 2, e = cx + w / 2, c = cz - d / 2, f = cz + d / 2;
    return [quad([[a, t, c], [e, t, c], [e, t, f], [a, t, f]]), quad([[e, t, c], [e, t, f], [e, b, f], [e, b, c]]), quad([[a, t, f], [e, t, f], [e, b, f], [a, b, f]])];
  };
  const out: string[] = [];
  for (const [x, z, L] of I) {
    const [t, r, f] = box(x, z, L, L, -BASE_H, 0);
    out.push(`<path class="${id}s0" d="${t}"/><path class="${id}s1" d="${r}"/><path class="${id}s2" d="${f}"/>`);
  }
  P.sort((p, q) => p[4] - q[4] || (p[0] + p[1]) - (q[0] + q[1]));
  for (const [x, z, w, d, depth] of P) {
    const [t, r, f] = box(x, z, w, d, (depth - 1) * STEP_H, depth * STEP_H);
    out.push(`<g class="${id}d${Math.min(DEPTH_HEX.length, depth) - 1}"><path d="${t}"/><path class="r" d="${r}"/><path class="f" d="${f}"/></g>`);
  }
  if (o.beams) {
    for (const [x, z, , portY] of I) {
      const dist = Math.hypot(x, z);
      out.push(`<path class="${id}bm" d="M${P2(0, AY, 0)}Q${P2(x * 0.5, Math.max(AY, portY) + 3 + dist * 0.1, z * 0.5)} ${P2(x, portY, z)}"/>`);
    }
  }
  B.sort((p, q) => (p[0] + p[1]) - (q[0] + q[1]));
  let n = 0;
  for (const [cx, cz, w, d, b, h, lang] of B) {
    const [t, r, f] = box(cx, cz, w, d, b, b + h);
    const delay = o.rise ? ` style="animation-delay:${((n++ * 7) % 900) / 1000}s"` : '';
    out.push(`<g class="${id}l${lang}"${delay}><path d="${t}"/><path class="r" d="${r}"/><path class="f" d="${f}"/></g>`);
  }
  if (o.beams) {
    const cx = ox + px(0, 0) * k, cy = oy + py(0, AY, 0) * k, rad = Math.max(5, AVR * k * 0.9);
    out.push(`<circle cx="${cx.toFixed(1)}" cy="${cy.toFixed(1)}" r="${(rad + 3).toFixed(1)}" fill="#5fd3f3" opacity=".18"/>`);
    out.push(`<circle class="${id}av" cx="${cx.toFixed(1)}" cy="${cy.toFixed(1)}" r="${rad.toFixed(1)}"/>`);
    if (o.avatar) {
      out.push(`<clipPath id="${id}clip"><circle cx="${cx.toFixed(1)}" cy="${cy.toFixed(1)}" r="${(rad - 1).toFixed(1)}"/></clipPath>` +
        `<image href="${o.avatar}" x="${(cx - rad).toFixed(1)}" y="${(cy - rad).toFixed(1)}" width="${(2 * rad).toFixed(1)}" height="${(2 * rad).toFixed(1)}" clip-path="url(#${id}clip)" preserveAspectRatio="xMidYMid slice"/>` +
        `<circle cx="${cx.toFixed(1)}" cy="${cy.toFixed(1)}" r="${rad.toFixed(1)}" fill="none" stroke="#8ff0ff" stroke-width="2"/>`);
    }
  }
  const css = [
    `.${id}s0{fill:#0e1522}.${id}s1{fill:#070b13}.${id}s2{fill:#0a101b}`,
    `.${id}bm{fill:none;stroke:#5fd3f3;stroke-opacity:.26;stroke-width:1}`,
    `.${id}av{fill:#04060c;stroke:#8ff0ff;stroke-width:2}`,
    ...DEPTH_HEX.map((hex, i) => `.${id}d${i}>path{fill:${shade(hex, 1.07)}}.${id}d${i}>.r{fill:${shade(hex, 0.62)}}.${id}d${i}>.f{fill:${shade(hex, 0.82)}}`),
    ...LANG_HEX.map((hex, i) => `.${id}l${i}>path{fill:${shade(hex, 1.12)}}.${id}l${i}>.r{fill:${shade(hex, 0.55)}}.${id}l${i}>.f{fill:${shade(hex, 0.78)}}`),
    o.rise ? `g[class^=${id}l]{animation:${id}rise .9s cubic-bezier(.2,.8,.2,1) both;transform-box:fill-box;transform-origin:50% 100%}@keyframes ${id}rise{from{transform:scaleY(0)}}` : '',
  ].join('');
  return `<style>${css}</style><g>${out.join('')}</g>`;
}
