// commit.city's Halloween look. On 31 October, by the visitor's own date (GitHub turns its contribution graph
// orange the same way), the city takes GitHub's Halloween graph colours, a moon and bats, and every file deleted as
// the year replays gives up a ghost where it stood. Only the look changes: counts, heights and the agent lens's
// colours stay as they are. #theme=halloween shows it on any day, #theme=plain turns it off, and an embed stays
// plain unless it asks. Turned off from the toolbar, it stays off in that browser until next year.
import * as THREE from 'three';

// GitHub's contribution graph on Halloween, levels 0 to 4
export const GH_HALLOWEEN = {
  light: ['#ebedf0', '#ffee4a', '#ffc501', '#fe9600', '#03001c'],
  dark: ['#161b22', '#631c03', '#bd561d', '#fa7a18', '#fddf68'],
};
const KEY = 'cc.season';
export const isHalloween = (d = new Date()) => d.getMonth() === 9 && d.getDate() === 31;

export function season(loc = location, now = new Date()) {
  const h = new URLSearchParams(loc.hash.slice(1)), q = new URLSearchParams(loc.search);
  const ask = h.get('theme') || q.get('theme');
  if (ask === 'halloween') return 'halloween';
  if (ask === 'plain' || h.get('embed') === '1') return '';
  let off = null;
  try { off = localStorage.getItem(KEY); } catch { /* storage off: the date decides */ }
  return isHalloween(now) && off !== `plain-${now.getFullYear()}` ? 'halloween' : '';
}

/** Turn the look on or off in this browser, then reload. */
export function setSeason(on) {
  const now = new Date();
  let kept = true;
  try { if (on) localStorage.removeItem(KEY); else localStorage.setItem(KEY, `plain-${now.getFullYear()}`); } catch { kept = false; }
  const h = new URLSearchParams(location.hash.slice(1));
  h.delete('theme');
  if (on && !isHalloween(now)) h.set('theme', 'halloween');
  if (!on && !kept) h.set('theme', 'plain');
  const s = h.toString();
  history.replaceState(null, '', location.pathname + location.search + (s ? `#${s}` : ''));
  location.reload();
}

// ───────────────────────────────────────────────────────────── drawn once, on canvases
function canvasTex(size, draw) {
  const c = document.createElement('canvas');
  c.width = c.height = size;
  draw(c.getContext('2d'), size);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}
const moonTex = () => canvasTex(256, (g, S) => {
  const c = S / 2, r = S * 0.46;
  const body = g.createRadialGradient(c - r * 0.25, c - r * 0.3, r * 0.1, c, c, r);
  body.addColorStop(0, '#fff8dc'); body.addColorStop(0.7, '#ffe09a'); body.addColorStop(1, '#f2b65a');
  g.fillStyle = body; g.beginPath(); g.arc(c, c, r, 0, Math.PI * 2); g.fill();
  g.save(); g.clip();                                        // maria: soft darker patches inside the disc
  for (const [x, y, s, a] of [[-0.3, -0.15, 0.24, 0.16], [0.18, 0.2, 0.3, 0.13], [0.3, -0.32, 0.14, 0.14], [-0.12, 0.42, 0.16, 0.11], [-0.45, 0.25, 0.1, 0.12]]) {
    const m = g.createRadialGradient(c + x * r, c + y * r, 0, c + x * r, c + y * r, s * r);
    m.addColorStop(0, `rgba(176, 112, 40, ${a})`); m.addColorStop(1, 'rgba(176, 112, 40, 0)');
    g.fillStyle = m; g.fillRect(0, 0, S, S);
  }
  g.restore();
});
const glowTex = () => canvasTex(128, (g, S) => {
  const c = S / 2, gr = g.createRadialGradient(c, c, 0, c, c, c);
  gr.addColorStop(0, 'rgba(255, 190, 90, 0.55)'); gr.addColorStop(0.35, 'rgba(250, 122, 24, 0.18)'); gr.addColorStop(1, 'rgba(250, 122, 24, 0)');
  g.fillStyle = gr; g.fillRect(0, 0, S, S);
});
// a bat, wings up or down: dark, with a thin warm rim so it reads against a dark sky
const batTex = up => canvasTex(128, (g, S) => {
  g.translate(S / 2, S / 2); g.scale(S / 128, S / 128);
  const wing = s => {
    g.beginPath();
    g.moveTo(0, -2);
    if (up) { g.quadraticCurveTo(s * 22, -34, s * 56, -38); g.quadraticCurveTo(s * 48, -22, s * 52, -12); g.quadraticCurveTo(s * 40, -16, s * 34, -6); g.quadraticCurveTo(s * 26, -10, s * 18, 2); }
    else { g.quadraticCurveTo(s * 24, -8, s * 58, 6); g.quadraticCurveTo(s * 46, 12, s * 46, 24); g.quadraticCurveTo(s * 36, 16, s * 28, 22); g.quadraticCurveTo(s * 22, 12, s * 12, 10); }
    g.closePath(); g.fill(); g.stroke();
  };
  g.fillStyle = '#0d0612'; g.strokeStyle = 'rgba(250, 122, 24, 0.55)'; g.lineWidth = 2.2; g.lineJoin = 'round';
  wing(1); wing(-1);
  g.beginPath(); g.ellipse(0, 4, 9, 14, 0, 0, Math.PI * 2); g.fill(); g.stroke();
  g.beginPath(); g.moveTo(-7, -6); g.lineTo(-9, -18); g.lineTo(-2, -9); g.lineTo(2, -9); g.lineTo(9, -18); g.lineTo(7, -6); g.closePath(); g.fill();
  g.fillStyle = '#ffc501'; g.beginPath(); g.arc(-3.5, -3, 1.6, 0, Math.PI * 2); g.arc(3.5, -3, 1.6, 0, Math.PI * 2); g.fill();
});
const ghostTex = () => canvasTex(128, (g, S) => {
  g.translate(S / 2, S / 2); g.scale(S / 128, S / 128);
  const body = new Path2D('M-30 40 L-30 -8 C-30 -42 30 -42 30 -8 L30 40 L20 30 L10 40 L0 30 L-10 40 L-20 30 Z');
  g.shadowColor = 'rgba(255, 238, 200, 0.9)'; g.shadowBlur = 14;
  g.fillStyle = 'rgba(250, 246, 236, 0.92)'; g.fill(body);
  g.shadowBlur = 0;
  g.fillStyle = '#1a1024';
  g.beginPath(); g.ellipse(-11, -6, 5, 7.5, 0, 0, Math.PI * 2); g.ellipse(11, -6, 5, 7.5, 0, 0, Math.PI * 2); g.fill();
  g.beginPath(); g.ellipse(0, 12, 5, 6.5, 0, 0, Math.PI * 2); g.fill();
});

// ───────────────────────────────────────────────────────────── the scene's extras
/**
 * Adds the moon, the bats and the ghost pool to `scene`.
 * radius: the city's size; ay: the avatar's altitude (the bats fly above it).
 * Returns update(dt, now, camera), called every frame, and ghost(x, y, z), for a file deleted where it stood.
 */
export function addHalloween(scene, { radius, ay }) {
  const sprite = (map, color, o = {}) => {
    const s = new THREE.Sprite(new THREE.SpriteMaterial({ map, color, transparent: true, depthWrite: false, fog: false, ...o }));
    scene.add(s);
    return s;
  };
  // the moon hangs behind the city, in the upper part of the view at the opening angle, and keeps its place in
  // the sky as the camera circles (its bearing follows the camera's, its elevation is the world's)
  const D = 2300, MOON_R = D * 0.075;
  const moon = sprite(moonTex(), new THREE.Color(1.55, 1.38, 1.1));
  const halo = sprite(glowTex(), new THREE.Color(1, 1, 1), { blending: THREE.AdditiveBlending });
  moon.scale.setScalar(MOON_R * 2); halo.scale.setScalar(MOON_R * 5.5);
  moon.renderOrder = halo.renderOrder = -2;
  // bats: most circle the city above the avatar; a few cross the moon's face
  const up = batTex(true), down = batTex(false);
  const bats = [];
  const bs = THREE.MathUtils.clamp(radius * 0.05, 1.4, 6);
  for (let k = 0; k < 22; k++) {
    bats.push({
      s: sprite(up, new THREE.Color(1, 1, 1)), moon: false,
      rad: radius * (0.25 + 0.65 * Math.random()), h: ay + 2 + Math.random() * 16, a: Math.random() * Math.PI * 2,
      w: (0.12 + Math.random() * 0.2) * (Math.random() < 0.5 ? -1 : 1), bob: Math.random() * 6, f: 7 + Math.random() * 4, size: bs * (0.7 + 0.6 * Math.random()),
    });
  }
  for (let k = 0; k < 4; k++) bats.push({ s: sprite(up, new THREE.Color(1, 1, 1)), moon: true, a: k * 1.7, w: 0.07 + 0.03 * k, bob: k * 2.1, f: 8 + k, size: MOON_R * (0.14 + 0.03 * k) });
  // ghosts: a pool, the oldest reused when a big deletion asks for more
  const gTex = ghostTex(), ghosts = [];
  const gs = THREE.MathUtils.clamp(radius * 0.04, 1.0, 3.2);
  for (let k = 0; k < 40; k++) { const s = sprite(gTex, new THREE.Color(1.5, 1.45, 1.4)); s.visible = false; ghosts.push({ s, t0: -1, x: 0, y: 0, z: 0, ph: 0 }); }
  let gNext = 0, raised = 0, gBudget = 0, clock = 0;

  const V = new THREE.Vector3(), right = new THREE.Vector3(), upV = new THREE.Vector3();
  function update(dt, camera) {
    clock += dt;
    gBudget = 0;
    // the moon's bearing: a little right of where the camera looks (less in a narrow, portrait view); at the opening
    // angle that puts it in the open sky above the city, clear of the panels
    camera.updateMatrixWorld();
    camera.getWorldDirection(V);
    const az = Math.atan2(V.x, V.z);
    const half = Math.atan(Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)) * camera.aspect);
    const b = az - Math.min(0.2, half * 0.3), el = THREE.MathUtils.degToRad(-9);
    moon.position.set(Math.sin(b) * Math.cos(el), Math.sin(el), Math.cos(b) * Math.cos(el)).multiplyScalar(D).add(camera.position);
    halo.position.copy(moon.position);
    right.setFromMatrixColumn(camera.matrixWorld, 0); upV.setFromMatrixColumn(camera.matrixWorld, 1);
    for (const t of bats) {
      t.a += t.w * dt;
      const flap = Math.sin(clock * t.f + t.bob * 3);
      t.s.material.map = flap > 0 ? up : down;
      if (t.moon) {
        // a slow figure of eight across the disc, a little nearer than the moon
        const u = clock * t.w * 6 + t.a;
        t.s.position.copy(moon.position).multiplyScalar(0.92).addScaledVector(camera.position, 0.08)
          .addScaledVector(right, Math.sin(u) * MOON_R * 1.5).addScaledVector(upV, Math.sin(u * 2) * MOON_R * 0.45 + Math.sin(clock + t.bob) * MOON_R * 0.1);
      } else {
        t.s.position.set(Math.cos(t.a) * t.rad, t.h + Math.sin(clock * 0.9 + t.bob) * 1.6, Math.sin(t.a) * t.rad);
      }
      t.s.scale.set(t.size, t.size * (0.75 + 0.25 * Math.abs(flap)), 1);
    }
    for (const g of ghosts) {
      if (!g.s.visible) continue;
      const u = (clock - g.t0) / 2.6;
      if (u >= 1) { g.s.visible = false; continue; }
      g.s.position.set(g.x + Math.sin(u * 7 + g.ph) * gs * 0.35, g.y + gs * 0.6 + u * gs * 4.5, g.z);
      g.s.material.opacity = Math.min(1, u * 6) * (1 - u) * (1 - u) * 0.95;
      const sc = gs * (0.6 + 0.5 * Math.min(1, u * 3));
      g.s.scale.set(sc, sc, 1);
    }
  }
  function ghost(x, y, z) {
    if (gBudget++ >= 6) return;                     // a mass deletion raises a handful per frame, not a sheet
    const g = ghosts[gNext++ % ghosts.length];
    Object.assign(g, { t0: clock, x, y, z, ph: Math.random() * 6 });
    g.s.visible = true; g.s.material.opacity = 0;
    raised++;
  }
  return { update, ghost, get ghostsRaised() { return raised; }, moon, bats };
}
