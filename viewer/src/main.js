import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';
import { CSS2DRenderer, CSS2DObject } from 'three/addons/renderers/CSS2DRenderer.js';
import { layoutRepo, placeIslands, heightOf, STEP_H, BASE_H } from './layout.js';
import * as SH from './shaders.js';
import { agents as AGENT_RULES } from '../../schema/agents.json';

// ───────────────────────────────────────────────────────────── constants
const $ = id => document.getElementById(id);
const DATA = JSON.parse($('lapse-data').textContent);
const EPOCH = DATA.epoch;                 // unix seconds at t=0 (local midnight); t is in minutes
const TZ = DATA.tz || { offset: 0, label: 'UTC' };
const LOGIN = (DATA.user && DATA.user.login) || 'you';
const PERSONAL = !DATA.kind || DATA.kind === 'user';     // orgs and repos show everyone's commits
const YOUR = PERSONAL ? 'your ' : '';
// who wrote each commit (the agent lens): payload.who names the actors and each commit row carries an index into it
// (0, or absent, = a person). Older payloads have no who at all, which reads as every commit human.
const WHO = Array.isArray(DATA.who) && DATA.who.length ? DATA.who : ['human'];
const AGENT = Object.fromEntries(AGENT_RULES.map(a => [a.id, a]));
const whoHex = id => (!id || id === 'human' ? '#5fd3f3' : id === 'bot' ? '#ffb454' : AGENT[id]?.color || '#c58bff');
const whoLabel = id => (!id || id === 'human' ? (PERSONAL ? LOGIN : 'people') : id === 'bot' ? 'bots' : AGENT[id]?.label || id);
const WHO_HEX = WHO.map(whoHex), WHO_LABEL = WHO.map(whoLabel);
const WHO_RGB = WHO_HEX.map(h => new THREE.Color(h));
const T_END = DATA.t_end;
const TAU = 10 * 1440;                    // activity decay constant (minutes)
const AY = 15;                            // avatar altitude
const LANG_HEX = ['#3987e5', '#d95926', '#199e70', '#c98500', '#d55181', '#008300', '#9085e9', '#e66767', '#7d7b75'];
const DEPTH_HEX = ['#161d2b', '#1c2537', '#232e44', '#2a3751', '#31405e', '#38496b', '#3f5278'];
const SPEEDS = [
  { k: '1h', v: 60, label: '1 hr/s' }, { k: '6h', v: 360, label: '6 hr/s' }, { k: '1d', v: 1440, label: '1 day/s' },
  { k: '3d', v: 4320, label: '3 days/s' }, { k: '1w', v: 10080, label: '1 wk/s' }, { k: '2w', v: 20160, label: '2 wk/s' },
];
const STATUS = [
  { max: 3, key: 'hot', label: 'hot' }, { max: 14, key: 'active', label: 'active' },
  { max: 45, key: 'cooling', label: 'cooling' }, { max: 90, key: 'dormant', label: 'dormant' },
  { max: Infinity, key: 'abandoned', label: 'abandoned' },
];
const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
const smooth = (e0, e1, x) => { const t = clamp((x - e0) / (e1 - e0), 0, 1); return t * t * (3 - 2 * t); };
const easeIO = t => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const easeOut = t => 1 - Math.pow(1 - t, 3);
const fmtInt = n => Math.round(n).toLocaleString('en-US');
const fmtK = n => (n >= 1e6 ? (n / 1e6).toFixed(2) + 'M' : n >= 1e4 ? (n / 1e3).toFixed(1) + 'K' : fmtInt(n));
function upper(arr, x) { let lo = 0, hi = arr.length; while (lo < hi) { const m = (lo + hi) >> 1; if (arr[m] <= x) lo = m + 1; else hi = m; } return lo; }
function lower(arr, x) { let lo = 0, hi = arr.length; while (lo < hi) { const m = (lo + hi) >> 1; if (arr[m] < x) lo = m + 1; else hi = m; } return lo; }
// the user's zone is a fixed offset: dates are shifted into it and formatted as UTC
const DTF_DATE = new Intl.DateTimeFormat('en-GB', { timeZone: 'UTC', weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' });
const DTF_TIME = new Intl.DateTimeFormat('en-GB', { timeZone: 'UTC', hour: '2-digit', minute: '2-digit', hour12: false });
const DTF_DAY = new Intl.DateTimeFormat('en-GB', { timeZone: 'UTC', day: 'numeric', month: 'short', year: 'numeric' });
const DTF_MON = new Intl.DateTimeFormat('en-GB', { timeZone: 'UTC', month: 'short' });
const tDate = t => new Date((EPOCH + t * 60 + TZ.offset * 60) * 1000);
const localToT = ms => (ms / 1000 - TZ.offset * 60 - EPOCH) / 60;   // ms of a wall-clock time written as UTC

// ───────────────────────────────────────────────────────────── data → model
const R = DATA.repos.map((r, ri) => {
  const nF = r.p.length;
  const maxSize = new Float32Array(nF);
  for (let i = 0; i < nF; i++) {
    const ev = r.e[i];
    let m = 0;
    for (let k = 1; k < ev.length; k += 2) if (ev[k] > m) m = ev[k];
    maxSize[i] = m;
  }
  const [owner, short] = r.n.split('/');
  const lay = layoutRepo(r.p, maxSize);
  return { ri, name: r.n, owner, short, fork: r.fork, fp: r.fp, paths: r.p, lang: r.l, ev: r.e, mine: r.m, nF, maxSize, lay };
});
let NF = 0, ND = 0;
for (const r of R) { r.f0 = NF; NF += r.nF; r.d0 = ND; ND += r.lay.dirs.length; }
const fRepo = new Uint16Array(NF), fDir = new Int32Array(NF), fLang = new Uint8Array(NF);
const dParent = new Int32Array(ND), dRepo = new Uint16Array(ND);
for (const r of R) {
  for (let i = 0; i < r.nF; i++) { fRepo[r.f0 + i] = r.ri; fDir[r.f0 + i] = r.d0 + r.lay.fileDir[i]; fLang[r.f0 + i] = r.lang[i]; }
  for (const d of r.lay.dirs) { dParent[r.d0 + d.id] = d.parent ? r.d0 + d.parent.id : -1; dRepo[r.d0 + d.id] = r.ri; }
}
// structure events (landing time on the default branch), globally time-sorted
let NE = 0;
for (const r of R) for (const ev of r.ev) NE += ev.length / 2;
const eT = new Float64Array(NE), eF = new Int32Array(NE), eS = new Float32Array(NE);
{
  const t = new Float64Array(NE), f = new Int32Array(NE), s = new Float32Array(NE);
  let k = 0;
  for (const r of R) r.ev.forEach((ev, i) => { for (let j = 0; j < ev.length; j += 2) { t[k] = ev[j]; f[k] = r.f0 + i; s[k] = ev[j + 1]; k++; } });
  const order = Array.from({ length: NE }, (_, i) => i).sort((a, b) => t[a] - t[b] || a - b);
  order.forEach((o, i) => { eT[i] = t[o]; eF[i] = f[o]; eS[i] = s[o]; });
}
// your commits (author time), globally time-sorted
const C = [];
for (const r of R) for (const m of r.mine) C.push({ t: m[0], r: r.ri, n: m[1], files: Int32Array.from(m[2], x => x + r.f0), w: m[3] || 0 });
C.sort((a, b) => a.t - b.t);
const cT = Float64Array.from(C, c => c.t);
const NC = C.length;
for (const r of R) {
  const ms = r.mine.slice().sort((a, b) => a[0] - b[0]);
  r.cT = Float64Array.from(ms, m => m[0]);
  r.cW = Uint8Array.from(ms, m => m[3] || 0);
}
const HAS_WHO = C.some(c => c.w);
const maxCum = Math.max(...R.map(r => r.mine.length));
for (const r of R) {
  const ts = new Set();
  for (const ev of r.ev) for (let j = 0; j < ev.length; j += 2) ts.add(ev[j]);
  r.evTimes = Float64Array.from([...ts].sort((a, b) => a - b));
}
const N_DAYS = Math.ceil(T_END / 1440) + 1;
const dayCounts = new Uint16Array(N_DAYS);
const dayWho = new Uint16Array(N_DAYS * WHO.length);       // per day, per actor: the timeline's stacks under the lens
for (const c of C) if (c.t >= 0) {
  const d = Math.floor(c.t / 1440);
  dayCounts[d]++;
  dayWho[d * WHO.length + c.w]++;
}

// ───────────────────────────────────────────────────────────── islands
const { pos, sectors } = placeIslands(R.map(r => ({ key: r.ri, org: r.owner, R: r.lay.L * 0.7071 + 0.8, weight: r.mine.length })));
let SCENE_R = 30;
for (const r of R) {
  const p = pos.get(r.ri);
  r.x = p.x; r.z = p.z;
  let mh = 0;
  for (let i = 0; i < r.nF; i++) mh = Math.max(mh, heightOf(r.maxSize[i]) + r.lay.dirs[r.lay.fileDir[i]].depth * STEP_H);
  r.maxH = mh;
  r.portY = Math.max(4, Math.min(16, mh + 3.2));
  SCENE_R = Math.max(SCENE_R, Math.hypot(r.x, r.z) + r.lay.L * 0.7);
}

// ───────────────────────────────────────────────────────────── renderer / scene
const stage = $('stage');
const renderer = new THREE.WebGLRenderer({ antialias: false, powerPreference: 'high-performance' });
let quality = 'high';
renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
renderer.setSize(stage.clientWidth, stage.clientHeight);
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.05;
renderer.outputColorSpace = THREE.SRGBColorSpace;
stage.appendChild(renderer.domElement);
const labelRenderer = new CSS2DRenderer();
labelRenderer.setSize(stage.clientWidth, stage.clientHeight);
labelRenderer.domElement.className = 'labels';
stage.appendChild(labelRenderer.domElement);

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(42, stage.clientWidth / stage.clientHeight, 0.3, 6000);
// home view: back the camera off until every island's footprint lands inside the screen area the
// panels leave free (NDC x within ±0.68, y within -0.62..0.9), whatever the city's size or shape
{
  camera.updateProjectionMatrix();
  const dir = new THREE.Vector3(0, 0.62, 1.42).normalize(), tgt = new THREE.Vector3(0, 5, 0), q = new THREE.Vector3();
  const pts = [];
  for (const r of R) {
    const h = r.lay.L / 2;
    for (const [dx, dz] of [[-h, -h], [h, -h], [-h, h], [h, h]]) pts.push([r.x + dx, 0, r.z + dz], [r.x + dx, r.maxH, r.z + dz]);
  }
  let d = SCENE_R * 1.2;
  for (; d < SCENE_R * 5; d *= 1.04) {
    camera.position.copy(dir).multiplyScalar(d).add(tgt);
    camera.lookAt(tgt);
    camera.updateMatrixWorld();
    if (pts.every(([x, y, z]) => { q.set(x, y, z).project(camera); return Math.abs(q.x) <= 0.68 && q.y >= -0.62 && q.y <= 0.9; })) break;
  }
}
const controls = new OrbitControls(camera, renderer.domElement);
controls.target.set(0, 5, 0);
controls.enableDamping = true;
controls.dampingFactor = 0.07;
controls.screenSpacePanning = true;
controls.minDistance = 4;
controls.maxDistance = SCENE_R * 5;
controls.maxPolarAngle = Math.PI * 0.495;
controls.autoRotate = true;
controls.autoRotateSpeed = 0.55;
const HOME = { pos: camera.position.clone(), target: controls.target.clone() };

const rtSize = new THREE.Vector2();
renderer.getDrawingBufferSize(rtSize);
const rt = new THREE.WebGLRenderTarget(rtSize.x, rtSize.y, { type: THREE.HalfFloatType, samples: 4 });
const composer = new EffectComposer(renderer, rt);
composer.addPass(new RenderPass(scene, camera));
const bloom = new UnrealBloomPass(new THREE.Vector2(stage.clientWidth, stage.clientHeight), 0.6, 0.42, 1.0);
composer.addPass(bloom);
composer.addPass(new OutputPass());

// shared environment uniforms (day/night drives these)
const ENV = {
  uSky: { value: new THREE.Color(0.32, 0.38, 0.52) },
  uGround: { value: new THREE.Color(0.06, 0.06, 0.08) },
  uKeyDir: { value: new THREE.Vector3(0.45, 0.8, 0.35).normalize() },
  uKeyCol: { value: new THREE.Color(0.85, 0.82, 0.78) },
  uFog: { value: new THREE.Color(0.02, 0.03, 0.06) },
  uFogDen: { value: 0.9 / (SCENE_R * 4.2) },
};
const TIME = { value: 0 };
const PXK = { value: 0.001 };   // world units per screen pixel at distance 1

// sky dome, stars, floor
const sky = new THREE.Mesh(new THREE.SphereGeometry(4000, 32, 16), new THREE.ShaderMaterial({
  side: THREE.BackSide, depthWrite: false, vertexShader: SH.skyVS, fragmentShader: SH.skyFS,
  uniforms: { uTop: { value: new THREE.Color(0.01, 0.018, 0.045) }, uHorizon: { value: new THREE.Color(0.03, 0.045, 0.09) }, uBottom: { value: new THREE.Color(0.004, 0.006, 0.012) } },
}));
scene.add(sky);
const NIGHT = { value: 0.5 };
{
  const n = 2600, p = new Float32Array(n * 3), sz = new Float32Array(n), ph = new Float32Array(n);
  for (let i = 0; i < n; i++) {
    const u = Math.random() * 2 - 1, th = Math.random() * Math.PI * 2, y = Math.abs(u) * 0.92 + 0.04;
    const rr = Math.sqrt(1 - y * y), d = 2600 + Math.random() * 900;
    p[i * 3] = Math.cos(th) * rr * d; p[i * 3 + 1] = y * d; p[i * 3 + 2] = Math.sin(th) * rr * d;
    sz[i] = 1 + Math.pow(Math.random(), 6) * 3.2; ph[i] = Math.random();
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.BufferAttribute(p, 3));
  g.setAttribute('aSize', new THREE.BufferAttribute(sz, 1));
  g.setAttribute('aPhase', new THREE.BufferAttribute(ph, 1));
  scene.add(new THREE.Points(g, new THREE.ShaderMaterial({
    transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
    uniforms: { uTime: TIME, uNight: NIGHT }, vertexShader: SH.starsVS, fragmentShader: SH.starsFS,
  })));
}
const floor = new THREE.Mesh(new THREE.PlaneGeometry(SCENE_R * 6, SCENE_R * 6), new THREE.ShaderMaterial({
  transparent: true, depthWrite: false, vertexShader: SH.floorVS, fragmentShader: SH.floorFS,
  uniforms: { uCol: { value: new THREE.Color(0.25, 0.55, 0.8) }, uFade: { value: SCENE_R * 1.9 } },
}));
floor.rotation.x = -Math.PI / 2;
floor.position.y = -BASE_H - 1.2;
scene.add(floor);

// ───────────────────────────────────────────────────────────── avatar
const avatar = new THREE.Group();
avatar.position.set(0, AY, 0);
scene.add(avatar);
const avatarSpin = new THREE.Group();
avatar.add(avatarSpin);
const GH_MARK = 'M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z';
function ghMark(g, cx, cy, size, color) {
  g.save(); g.translate(cx - size / 2, cy - size / 2); g.scale(size / 16, size / 16); g.fillStyle = color; g.fill(new Path2D(GH_MARK)); g.restore();
}
const RIM = { value: 0 };
const AV_R = 4;
const avMats = [];
{
  const front = new THREE.MeshBasicMaterial({ color: new THREE.Color(1.1, 1.1, 1.1) });
  const back = new THREE.MeshBasicMaterial({ color: 0xffffff });
  avMats.push(front, back);
  const img = new Image();
  const paint = ok => {
    const S = 1024;
    const c = document.createElement('canvas'); c.width = c.height = S;
    const g = c.getContext('2d');
    g.fillStyle = '#0b1220'; g.fillRect(0, 0, S, S);
    if (ok) {
      g.imageSmoothingEnabled = img.naturalWidth >= 256;    // keep pixel-art avatars crisp, smooth photos
      g.imageSmoothingQuality = 'high';
      g.drawImage(img, 0, 0, S, S);
    } else {                                                // no avatar: the login's initial
      g.fillStyle = '#1d2b45'; g.fillRect(0, 0, S, S);
      g.fillStyle = '#cfe0ff'; g.font = '600 520px system-ui, sans-serif'; g.textAlign = 'center'; g.textBaseline = 'middle';
      g.fillText(LOGIN.slice(0, 1).toUpperCase(), S / 2, S / 2 + 20);
    }
    const bx = S * 0.73, by = S * 0.73, br = S * 0.125;
    g.beginPath(); g.arc(bx, by, br + 12, 0, Math.PI * 2); g.fillStyle = '#0b1220'; g.fill();
    g.beginPath(); g.arc(bx, by, br, 0, Math.PI * 2); g.fillStyle = '#f4f6fa'; g.fill();
    ghMark(g, bx, by, br * 1.55, '#0b1220');
    const tex = new THREE.CanvasTexture(c);
    tex.colorSpace = THREE.SRGBColorSpace; tex.anisotropy = 8;
    front.map = tex; front.needsUpdate = true;
    const c2 = document.createElement('canvas'); c2.width = c2.height = 512;
    const g2 = c2.getContext('2d');
    g2.fillStyle = '#0d1424'; g2.fillRect(0, 0, 512, 512);
    ghMark(g2, 256, 236, 250, '#e8eef8');
    g2.fillStyle = '#9fb3cf'; g2.font = '600 44px system-ui, sans-serif'; g2.textAlign = 'center';
    g2.fillText(LOGIN, 256, 430);
    const tex2 = new THREE.CanvasTexture(c2); tex2.colorSpace = THREE.SRGBColorSpace;
    back.map = tex2; back.needsUpdate = true;
  };
  img.onload = () => paint(true);
  img.onerror = () => paint(false);
  const src = $('avatar-src').getAttribute('src');
  if (src && src.startsWith('data:')) img.src = src; else paint(false);
  const f = new THREE.Mesh(new THREE.CircleGeometry(AV_R, 96), front); f.position.z = 0.14;
  const b = new THREE.Mesh(new THREE.CircleGeometry(AV_R, 96), back); b.position.z = -0.14; b.rotation.y = Math.PI;
  const edge = new THREE.Mesh(new THREE.CylinderGeometry(AV_R, AV_R, 0.28, 96, 1, true), new THREE.MeshBasicMaterial({ color: new THREE.Color(0.05, 0.07, 0.11) }));
  edge.rotation.x = Math.PI / 2;
  avatarSpin.add(f, b, edge);
}
const rimMat = new THREE.MeshBasicMaterial({ color: new THREE.Color(0.5, 1.7, 2.4) });
const rim = new THREE.Mesh(new THREE.TorusGeometry(AV_R + 0.08, 0.1, 20, 200), rimMat);
avatarSpin.add(rim);
const orbitRings = [];
for (const [rad, tilt, spd] of [[5.6, 0.55, 0.22], [6.6, -0.35, -0.15], [7.7, 1.2, 0.09]]) {
  const m = new THREE.Mesh(new THREE.TorusGeometry(rad, 0.022, 8, 256), new THREE.MeshBasicMaterial({
    color: new THREE.Color(0.35, 0.9, 1.3), transparent: true, opacity: 0.45, blending: THREE.AdditiveBlending, depthWrite: false }));
  const holder = new THREE.Group();
  holder.rotation.x = Math.PI / 2 + tilt;
  holder.add(m);
  avatar.add(holder);
  orbitRings.push({ m, holder, spd });
}
const halo = (() => {
  const n = 420, p = new Float32Array(n * 3), s = new Float32Array(n), a = new Float32Array(n), c = new Float32Array(n * 3);
  for (let i = 0; i < n; i++) {
    const th = Math.random() * Math.PI * 2, rr = 4.9 + Math.random() * 3.6, y = (Math.random() - 0.5) * 1.6 * Math.random();
    p[i * 3] = Math.cos(th) * rr; p[i * 3 + 1] = y; p[i * 3 + 2] = Math.sin(th) * rr;
    s[i] = 0.1 + Math.random() * 0.16; a[i] = 0.12 + Math.random() * 0.35;
    c[i * 3] = 0.6; c[i * 3 + 1] = 1.3; c[i * 3 + 2] = 1.9;
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.BufferAttribute(p, 3));
  g.setAttribute('aSize', new THREE.BufferAttribute(s, 1));
  g.setAttribute('aAlpha', new THREE.BufferAttribute(a, 1));
  g.setAttribute('aColor', new THREE.BufferAttribute(c, 3));
  const pts = new THREE.Points(g, new THREE.ShaderMaterial({
    transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
    uniforms: { uScale: { value: 600 } }, vertexShader: SH.pointsVS, fragmentShader: SH.pointsFS }));
  avatar.add(pts);
  return pts;
})();
const aura = (() => {
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.BufferAttribute(new Float32Array([0, 0, 0]), 3));
  g.setAttribute('aSize', new THREE.BufferAttribute(new Float32Array([10]), 1));
  g.setAttribute('aAlpha', new THREE.BufferAttribute(new Float32Array([0.1]), 1));
  g.setAttribute('aColor', new THREE.BufferAttribute(new Float32Array([0.12, 0.42, 0.7]), 3));
  const m = new THREE.Points(g, new THREE.ShaderMaterial({
    transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
    uniforms: { uScale: halo.material.uniforms.uScale }, vertexShader: SH.pointsVS, fragmentShader: SH.pointsFS }));
  m.renderOrder = -1;
  avatar.add(m);
  return m;
})();
{
  const el = document.createElement('div');
  el.className = 'me-label';
  el.textContent = LOGIN;
  const o = new CSS2DObject(el);
  o.position.set(0, -AV_R - 1.4, 0);
  avatar.add(o);
}

// ───────────────────────────────────────────────────────────── repo islands
const boxGeo = new THREE.BoxGeometry(1, 1, 1);
boxGeo.translate(0, 0.5, 0);
const solidMat = over => new THREE.ShaderMaterial({
  vertexShader: SH.solidVS, fragmentShader: SH.solidFS,
  uniforms: {
    ...ENV, uSat: { value: 1 }, uBright: { value: 1 }, uEdge: { value: 0.5 }, uEdgeTint: { value: new THREE.Color(0.015, 0.02, 0.03) },
    uAO: { value: 0.42 }, uRim: { value: 0 }, uRimCol: { value: new THREE.Color(0.25, 0.95, 1.5) }, ...over,
  },
});
const instGeo = n => {
  const g = boxGeo.clone();
  const a = new THREE.InstancedBufferAttribute(new Float32Array(Math.max(1, n)), 1);
  a.setUsage(THREE.DynamicDrawUsage);
  g.setAttribute('aGlow', a);
  return g;
};
const HIDDEN = new THREE.Matrix4().compose(new THREE.Vector3(0, -5000, 0), new THREE.Quaternion(), new THREE.Vector3(1e-5, 1e-5, 1e-5));
const tmpC = new THREE.Color();
const pickables = [];
const beamMats = [];
for (const r of R) {
  const g = new THREE.Group();
  g.position.set(r.x, 0, r.z);
  scene.add(g);
  r.group = g;
  const L = r.lay.L;
  const bs = new THREE.Sphere(new THREE.Vector3(0, r.maxH / 2, 0), L * 0.75 + r.maxH + 2);
  // slab
  r.matBase = solidMat({ uEdge: { value: 0.75 }, uAO: { value: 0 }, uEdgeTint: { value: new THREE.Color(0.03, 0.05, 0.08) } });
  r.base = new THREE.InstancedMesh(instGeo(1), r.matBase, 1);
  r.base.setColorAt(0, tmpC.set('#0e1522'));
  r.base.setMatrixAt(0, HIDDEN);
  r.base.boundingSphere = bs;
  r.base.userData = { kind: 'base', r };
  g.add(r.base);
  // directory platforms (every dir except the root)
  const nd = r.lay.dirs.length - 1;
  r.matPlat = solidMat({ uEdge: { value: 0.6 }, uAO: { value: 0.12 }, uEdgeTint: { value: new THREE.Color(0.04, 0.06, 0.09) } });
  if (nd > 0) {
    r.plat = new THREE.InstancedMesh(instGeo(nd), r.matPlat, nd);
    for (let k = 0; k < nd; k++) {
      const d = r.lay.dirs[k + 1];
      r.plat.setColorAt(k, tmpC.set(DEPTH_HEX[Math.min(DEPTH_HEX.length - 1, d.depth - 1)]));
      r.plat.setMatrixAt(k, HIDDEN);
    }
    r.plat.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
    r.plat.boundingSphere = bs;
    g.add(r.plat);
  }
  // buildings (one per file path ever seen)
  r.matBuild = solidMat({});
  r.build = new THREE.InstancedMesh(instGeo(r.nF), r.matBuild, r.nF);
  for (let i = 0; i < r.nF; i++) { r.build.setColorAt(i, tmpC.set(LANG_HEX[r.lang[i]])); r.build.setMatrixAt(i, HIDDEN); }
  r.build.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
  r.build.boundingSphere = bs;
  r.build.userData = { kind: 'build', r };
  g.add(r.build);
  pickables.push(r.build, r.base);
  // beam: avatar → port above the island
  const start = new THREE.Vector3(0, AY, 0), end = new THREE.Vector3(r.x, r.portY, r.z);
  const dist = Math.hypot(r.x, r.z);
  const ctrl = new THREE.Vector3(r.x * 0.5, Math.max(AY, r.portY) + 3 + dist * 0.1, r.z * 0.5);
  const curve = new THREE.QuadraticBezierCurve3(start, ctrl, end);
  const TS = 80, RS = 6;
  const tube = new THREE.TubeGeometry(curve, TS, 1, RS, false);
  const nv = tube.attributes.position.count;
  const aC = new Float32Array(nv * 3), aU = new Float32Array(nv);
  const pt = new THREE.Vector3();
  for (let i = 0; i <= TS; i++) {
    curve.getPointAt(i / TS, pt);
    for (let j = 0; j <= RS; j++) { const v = i * (RS + 1) + j; aC[v * 3] = pt.x; aC[v * 3 + 1] = pt.y; aC[v * 3 + 2] = pt.z; aU[v] = i / TS; }
  }
  tube.setAttribute('aCenter', new THREE.BufferAttribute(aC, 3));
  tube.setAttribute('aU', new THREE.BufferAttribute(aU, 1));
  r.beamMat = new THREE.ShaderMaterial({
    transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, vertexShader: SH.beamVS, fragmentShader: SH.beamFS,
    uniforms: { uColor: { value: new THREE.Color(0.3, 0.92, 1.45) }, uAlpha: { value: 0 }, uTime: TIME, uFlow: { value: 0 }, uGrow: { value: 0 }, uWidth: { value: 0.1 }, uPx: { value: 1 }, uPxK: PXK, uFogDen: ENV.uFogDen },
  });
  beamMats.push(r.beamMat);
  r.beam = new THREE.Mesh(tube, r.beamMat);
  r.beam.frustumCulled = false;
  r.beam.visible = false;
  scene.add(r.beam);
  // port + tether
  r.port = new THREE.Mesh(new THREE.SphereGeometry(0.32, 20, 14), new THREE.MeshBasicMaterial({ color: new THREE.Color(0.6, 1.6, 2.2) }));
  r.port.position.set(r.x, r.portY, r.z);
  r.port.visible = false;
  scene.add(r.port);
  const tg = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(r.x, r.portY, r.z), new THREE.Vector3(r.x, 0, r.z)]);
  r.tether = new THREE.Line(tg, new THREE.LineBasicMaterial({ color: new THREE.Color(0.4, 0.9, 1.3), transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false }));
  r.tether.visible = false;
  scene.add(r.tether);
  // pulse path (beam then tether), arc-length parametrised
  const pts = curve.getSpacedPoints(90);
  for (let k = 1; k <= 12; k++) pts.push(new THREE.Vector3(r.x, r.portY * (1 - k / 12) + 0.3 * (k / 12), r.z));
  r.path = new Float32Array(pts.length * 3);
  r.pathCum = new Float32Array(pts.length);
  pts.forEach((p, k) => { r.path.set([p.x, p.y, p.z], k * 3); if (k) r.pathCum[k] = r.pathCum[k - 1] + p.distanceTo(pts[k - 1]); });
  // label
  const el = document.createElement('div');
  el.className = 'repo-label';
  const nm = document.createElement('span'); nm.className = 'nm'; nm.textContent = r.short;
  const ow = document.createElement('span'); ow.className = 'ow'; ow.textContent = r.owner;
  const ct = document.createElement('span'); ct.className = 'ct'; ct.textContent = '0';
  el.append(ow, nm, ct);
  el.addEventListener('click', () => focusRepo(r.ri));
  r.labelEl = el; r.labelCt = ct;
  r.label = new CSS2DObject(el);
  r.label.position.set(r.x, r.portY + 1.4, r.z);
  scene.add(r.label);
  // live state
  Object.assign(r, { whoCum: new Uint32Array(WHO.length), cum: 0, heat: 0, act: 0, last: -Infinity, alive: 0, lines: 0, baseV: 0, baseFrom: 0, baseTo: 0, baseT0: 0,
    flash: 0, beamGrow: 0, beamBorn: false, dirty: false, platDirty: false, glowDirty: false, platGlowDirty: false });
}
// org sector labels
for (const s of sectors) {
  const el = document.createElement('div');
  el.className = 'sector-label';
  el.textContent = s.name;
  const o = new CSS2DObject(el);
  const rr = s.outer + 6;
  o.position.set(Math.cos(s.mid) * rr, -0.5, Math.sin(s.mid) * rr);
  scene.add(o);
}

// ───────────────────────────────────────────────────────────── per-file / per-dir animation state
const cur = new Float32Array(NF);          // current size (lines; 0 = absent)
const hFrom = new Float32Array(NF), hTo = new Float32Array(NF), aT0 = new Float64Array(NF), aDur = new Float32Array(NF);
const animOn = new Uint8Array(NF);
let animList = [];
const gT0 = new Float64Array(NF).fill(-1e9), gAmp = new Float32Array(NF);
const glowOn = new Uint8Array(NF);
let glowList = [];
const dAlive = new Int32Array(ND);         // alive files in subtree
const dFrom = new Float32Array(ND), dTo = new Float32Array(ND), dT0 = new Float64Array(ND), dDur = new Float32Array(ND);
const dAnimOn = new Uint8Array(ND);
let dAnimList = [];
const dGT0 = new Float64Array(ND).fill(-1e9);
const dGlowOn = new Uint8Array(ND);
let dGlowList = [];
let NOW = 0;                               // real clock, seconds

function hNow(i) {
  if (!animOn[i]) return hTo[i];
  const p = clamp((NOW - aT0[i]) / aDur[i], 0, 1);
  return hFrom[i] + (hTo[i] - hFrom[i]) * easeOut(p);
}
function setHeight(i, h, dur) {
  if (h === hTo[i] && !animOn[i]) return;
  if (dur <= 0) { hFrom[i] = hTo[i] = h; writeBuilding(i, h); return; }
  hFrom[i] = hNow(i); hTo[i] = h; aT0[i] = NOW; aDur[i] = dur;
  if (!animOn[i]) { animOn[i] = 1; animList.push(i); }
}
const M = new Float32Array(16);
function writeBuilding(i, h) {
  const r = R[fRepo[i]], k = i - r.f0, arr = r.build.instanceMatrix.array, o = k * 16;
  if (h <= 0.001) { HIDDEN.toArray(arr, o); r.dirty = true; return; }
  const fr = r.lay.fileRect, d = r.lay.dirs[r.lay.fileDir[k]];
  const grow = clamp(h / 0.35, 0.35, 1);    // footprint eases in as the building rises
  arr[o] = fr[k * 4 + 2] * grow; arr[o + 1] = 0; arr[o + 2] = 0; arr[o + 3] = 0;
  arr[o + 4] = 0; arr[o + 5] = h; arr[o + 6] = 0; arr[o + 7] = 0;
  arr[o + 8] = 0; arr[o + 9] = 0; arr[o + 10] = fr[k * 4 + 3] * grow; arr[o + 11] = 0;
  arr[o + 12] = fr[k * 4]; arr[o + 13] = d.depth * STEP_H; arr[o + 14] = fr[k * 4 + 1]; arr[o + 15] = 1;
  r.dirty = true;
}
function dNow(d) {
  if (!dAnimOn[d]) return dTo[d];
  const p = clamp((NOW - dT0[d]) / dDur[d], 0, 1);
  return dFrom[d] + (dTo[d] - dFrom[d]) * easeOut(p);
}
function setDirVis(d, v, dur) {
  if (v === dTo[d] && !dAnimOn[d]) return;
  if (dur <= 0) { dFrom[d] = dTo[d] = v; writeDir(d, v); return; }
  dFrom[d] = dNow(d); dTo[d] = v; dT0[d] = NOW; dDur[d] = dur;
  if (!dAnimOn[d]) { dAnimOn[d] = 1; dAnimList.push(d); }
}
function writeDir(gd, v) {
  const r = R[dRepo[gd]], id = gd - r.d0;
  if (id === 0) { writeBase(r, v); return; }
  const arr = r.plat.instanceMatrix.array, o = (id - 1) * 16;
  if (v <= 0.002) { HIDDEN.toArray(arr, o); r.platDirty = true; return; }
  const d = r.lay.dirs[id], [x, y, w, h] = d.rect, s = 0.92 + 0.08 * v;
  arr.fill(0, o, o + 16);
  arr[o] = w * s; arr[o + 5] = STEP_H * v; arr[o + 10] = h * s;
  arr[o + 12] = x + w / 2; arr[o + 13] = (d.depth - 1) * STEP_H; arr[o + 14] = y + h / 2; arr[o + 15] = 1;
  r.platDirty = true;
}
function writeBase(r, v) {
  const arr = r.base.instanceMatrix.array;
  if (v <= 0.002) { HIDDEN.toArray(arr, 0); r.base.instanceMatrix.needsUpdate = true; r.baseV = 0; return; }
  const L = r.lay.L + 0.7;
  arr.fill(0, 0, 16);
  arr[0] = L * (0.85 + 0.15 * v); arr[5] = BASE_H * v; arr[10] = L * (0.85 + 0.15 * v);
  arr[13] = -BASE_H * v; arr[15] = 1;
  r.base.instanceMatrix.needsUpdate = true;
  r.baseV = v;
}
function glowFile(i, amp) {
  gT0[i] = NOW; gAmp[i] = amp;
  if (!glowOn[i]) { glowOn[i] = 1; glowList.push(i); }
}
function glowDir(d) {
  dGT0[d] = NOW;
  if (!dGlowOn[d]) { dGlowOn[d] = 1; dGlowList.push(d); }
}

// ───────────────────────────────────────────────────────────── simulation clock
let T = 0;
let ePtr = 0, cPtr = 0;
let totalAlive = 0, totalLines = 0;
const whoSoFar = new Uint32Array(WHO.length);
let playing = true, scrubbing = false;
let speedIdx = 3, curSpeed = SPEEDS[3].v;
let heatT = 0;
let priorMax = 0, priorUpTo = 0, recordToastDay = -1, scrubTo = null;
function refreshPriorMax(dIdx) { while (priorUpTo < dIdx && priorUpTo < N_DAYS) { priorMax = Math.max(priorMax, dayCounts[priorUpTo]); priorUpTo++; } }

function aliveDelta(i, wasAlive, isAlive) {
  if (wasAlive === isAlive) return;
  const dlt = isAlive ? 1 : -1;
  const r = R[fRepo[i]];
  r.alive += dlt; totalAlive += dlt;
  for (let d = fDir[i]; d >= 0; d = dParent[d]) {
    const before = dAlive[d];
    dAlive[d] += dlt;
    if ((before > 0) !== (dAlive[d] > 0)) setDirVis(d, dAlive[d] > 0 ? 1 : 0, isAlive ? 0.6 : 0.5);
  }
}
function applyEvent(k, live) {
  const i = eF[k], s = eS[k], old = cur[i];
  cur[i] = s;
  const r = R[fRepo[i]];
  r.lines += s - old; totalLines += s - old;
  aliveDelta(i, old > 0, s > 0);
  setHeight(i, heightOf(s), live ? (old > 0 && s > 0 ? 0.55 : 0.75) : 0.3);
}
function fireCommit(k, live) {
  const c = C[k], r = R[c.r];
  r.cum++;
  r.whoCum[c.w]++; whoSoFar[c.w]++;
  r.heat += Math.exp(-(T - c.t) / TAU);
  r.last = c.t;
  if (!r.beamBorn) {
    r.beamBorn = true;
    if (live) { r.beamGrow = 0; toast(`connected → ${r.name}`, 'new'); } else r.beamGrow = 1;
  }
  if (live) spawnPulse(r, c.files, 1, WHO_RGB[c.w], c.w === 0);
}
function advance(nt) {
  nt = clamp(nt, 0, T_END);
  if (nt < T) { seek(nt); return; }
  const decay = Math.exp(-(nt - heatT) / TAU);
  for (const r of R) r.heat *= decay;
  heatT = nt;
  const prevT = T;
  T = nt;
  while (ePtr < NE && eT[ePtr] <= nt) applyEvent(ePtr++, true);
  while (cPtr < NC && cT[cPtr] <= nt) fireCommit(cPtr++, true);
  if (Math.floor(prevT / 1440) !== Math.floor(nt / 1440)) checkQuietRepos(prevT, nt);
}
function seek(nt, dur = 0.35) {
  nt = clamp(nt, 0, T_END);
  T = nt; heatT = nt;
  cur.fill(0); dAlive.fill(0);
  totalAlive = 0; totalLines = 0;
  for (const r of R) { r.alive = 0; r.lines = 0; }
  ePtr = 0;
  while (ePtr < NE && eT[ePtr] <= nt) { cur[eF[ePtr]] = eS[ePtr]; ePtr++; }
  for (let i = 0; i < NF; i++) {
    const s = cur[i];
    if (s > 0) {
      const r = R[fRepo[i]];
      r.alive++; r.lines += s; totalAlive++; totalLines += s;
      for (let d = fDir[i]; d >= 0; d = dParent[d]) dAlive[d]++;
    }
    setHeight(i, heightOf(s), dur);
  }
  for (let d = 0; d < ND; d++) setDirVis(d, dAlive[d] > 0 ? 1 : 0, dur);
  cPtr = upper(cT, nt);
  whoSoFar.fill(0);
  for (let k = 0; k < cPtr; k++) whoSoFar[C[k].w]++;
  for (const r of R) {
    const n = upper(r.cT, nt);
    r.cum = n; r.heat = 0;
    r.whoCum.fill(0);
    for (let k = 0; k < n; k++) r.whoCum[r.cW[k]]++;
    for (let k = 0; k < n; k++) r.heat += Math.exp(-(nt - r.cT[k]) / TAU);
    r.last = n ? r.cT[n - 1] : -Infinity;
    r.beamBorn = n > 0; r.beamGrow = n > 0 ? 1 : 0;
    r.quietAnnounced = n > 0 && nt - r.last > 90 * 1440;
  }
  priorMax = 0; priorUpTo = 0;
  refreshPriorMax(Math.floor(nt / 1440));
  recordToastDay = Math.floor(nt / 1440);
  pulses.length = 0;
}
function checkQuietRepos(prevT, nt) {
  for (const r of R) {
    if (r.cum >= 5 && !r.quietAnnounced && nt - r.last > 90 * 1440) {
      r.quietAnnounced = true;
      toast(`went quiet (90 days) → ${r.name}`, 'quiet');
    }
    if (nt - r.last <= 90 * 1440) r.quietAnnounced = false;
  }
}

// ───────────────────────────────────────────────────────────── pulses + shockwaves
let lens = false;                          // the agent lens: colour by who sent each commit
const MAXP = 320, TRAIL = 9;
const pGeo = new THREE.BufferGeometry();
const pPos = new Float32Array(MAXP * TRAIL * 3), pSize = new Float32Array(MAXP * TRAIL), pAlpha = new Float32Array(MAXP * TRAIL), pCol = new Float32Array(MAXP * TRAIL * 3);
pGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3).setUsage(THREE.DynamicDrawUsage));
pGeo.setAttribute('aSize', new THREE.BufferAttribute(pSize, 1).setUsage(THREE.DynamicDrawUsage));
pGeo.setAttribute('aAlpha', new THREE.BufferAttribute(pAlpha, 1).setUsage(THREE.DynamicDrawUsage));
pGeo.setAttribute('aColor', new THREE.BufferAttribute(pCol, 3).setUsage(THREE.DynamicDrawUsage));
const pulseUScale = { value: 600 };
const pulsePts = new THREE.Points(pGeo, new THREE.ShaderMaterial({
  transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
  uniforms: { uScale: pulseUScale }, vertexShader: SH.pointsVS, fragmentShader: SH.pointsFS }));
pulsePts.frustumCulled = false;
scene.add(pulsePts);
const pulses = [];
// col: the sender's colour (shown under the agent lens, and always for live events); human: dimmed under the lens
function spawnPulse(r, files, n, col = WHO_RGB[0], human = true, live = false) {
  for (let k = pulses.length - 1; k >= Math.max(0, pulses.length - 12); k--) {
    const p = pulses[k];
    if (p.r === r && p.col === col && NOW - p.t0 < 0.08) { p.files.push(files); p.n += n; return; }
  }
  if (pulses.length >= MAXP) { arrive({ r, files: [files], n, col, human, live }); return; }
  const dur = live ? 1.5 : clamp(1.25 - Math.log10(curSpeed / 60) * 0.32, 0.55, 1.2);
  pulses.push({ r, files: [files], n, t0: NOW, dur, col, human, live });
  avatarKick = 1;
}
const tmpV = new THREE.Vector3();
function pathAt(r, u, out) {
  const cum = r.pathCum, L = cum[cum.length - 1] * u;
  let lo = 0, hi = cum.length - 1;
  while (lo < hi - 1) { const m = (lo + hi) >> 1; if (cum[m] <= L) lo = m; else hi = m; }
  const seg = cum[hi] - cum[lo] || 1, f = clamp((L - cum[lo]) / seg, 0, 1), P = r.path;
  out.set(P[lo * 3] + (P[hi * 3] - P[lo * 3]) * f, P[lo * 3 + 1] + (P[hi * 3 + 1] - P[lo * 3 + 1]) * f, P[lo * 3 + 2] + (P[hi * 3 + 2] - P[lo * 3 + 2]) * f);
  return out;
}
function updatePulses() {
  let w = 0;
  for (let k = 0; k < pulses.length; k++) {
    const p = pulses[k];
    const u = (NOW - p.t0) / p.dur;
    if (u >= 1) { arrive(p); continue; }
    pulses[w++] = p;
  }
  pulses.length = w;
  pAlpha.fill(0);
  for (let k = 0; k < pulses.length; k++) {
    const p = pulses[k], u = easeIO(clamp((NOW - p.t0) / p.dur, 0, 1));
    const big = Math.min(1.8, 1 + Math.log2(p.n) * 0.25) * (p.live ? 1.5 : 1);
    const lit = lens || p.live ? p.col : null, dim = lens && p.human && !p.live ? 0.5 : 1;
    for (let j = 0; j < TRAIL; j++) {
      const uj = u - j * 0.016;
      const o = k * TRAIL + j;
      if (uj < 0) { pAlpha[o] = 0; continue; }
      pathAt(p.r, uj, tmpV);
      pPos[o * 3] = tmpV.x; pPos[o * 3 + 1] = tmpV.y; pPos[o * 3 + 2] = tmpV.z;
      const fall = 1 - j / TRAIL;
      pSize[o] = (j === 0 ? 1.15 : 0.75 * fall) * big;
      pAlpha[o] = (j === 0 ? 1 : 0.55 * fall * fall) * dim;
      if (lit) {
        const b = j === 0 ? 3.4 : 2.6, w = j === 0 ? 0.5 : 0;
        pCol[o * 3] = lit.r * b + w; pCol[o * 3 + 1] = lit.g * b + w; pCol[o * 3 + 2] = lit.b * b + w;
      } else { pCol[o * 3] = 1.4 + 1.2 * (j === 0); pCol[o * 3 + 1] = 2.2 + 0.8 * (j === 0); pCol[o * 3 + 2] = 2.8; }
    }
  }
  for (const n of ['position', 'aSize', 'aAlpha', 'aColor']) pGeo.attributes[n].needsUpdate = true;
}
const waves = [];
const waveGeo = new THREE.RingGeometry(0.94, 1, 96);
waveGeo.rotateX(-Math.PI / 2);
for (let k = 0; k < 40; k++) {
  const m = new THREE.Mesh(waveGeo, new THREE.MeshBasicMaterial({ color: new THREE.Color(0.5, 1.4, 2.0), transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false }));
  m.visible = false;
  scene.add(m);
  waves.push({ m, t0: -1e9, r: null });
}
let waveIdx = 0;
const WAVE_COL = new THREE.Color(0.5, 1.4, 2.0);
function arrive(p) {
  const r = p.r;
  for (const files of p.files) for (let q = 0; q < files.length; q++) {
    const i = files[q];
    if (cur[i] > 0) { glowFile(i, 1); glowDir(fDir[i]); }
  }
  r.flash = Math.min(1.6, r.flash + 0.6 + 0.1 * p.n);
  const w = waves[waveIdx++ % waves.length];
  w.t0 = NOW; w.r = r; w.m.visible = true;
  if ((lens || p.live) && p.col) w.m.material.color.copy(p.col).multiplyScalar(2.2); else w.m.material.color.copy(WAVE_COL);
  w.m.position.set(r.x, 0.06, r.z);
  r.labelEl.classList.remove('bump'); void r.labelEl.offsetWidth; r.labelEl.classList.add('bump');
}
function updateWaves() {
  for (const w of waves) {
    if (!w.m.visible) continue;
    const u = (NOW - w.t0) / 0.95;
    if (u >= 1) { w.m.visible = false; continue; }
    const L = w.r.lay.L * 0.72 + 1;
    w.m.scale.setScalar(L * (0.25 + 0.85 * easeOut(u)));
    w.m.material.opacity = 0.85 * (1 - u) * (1 - u);
  }
}

// ───────────────────────────────────────────────────────────── per-frame visual state
let focusRi = -1, hoverRi = -1;
let avatarKick = 0;
function updateAnimations() {
  let w = 0;
  for (let k = 0; k < animList.length; k++) {
    const i = animList[k];
    const p = clamp((NOW - aT0[i]) / aDur[i], 0, 1);
    writeBuilding(i, hFrom[i] + (hTo[i] - hFrom[i]) * easeOut(p));
    if (p >= 1) { animOn[i] = 0; hFrom[i] = hTo[i]; } else animList[w++] = i;
  }
  animList.length = w;
  w = 0;
  for (let k = 0; k < dAnimList.length; k++) {
    const d = dAnimList[k];
    const p = clamp((NOW - dT0[d]) / dDur[d], 0, 1);
    writeDir(d, dFrom[d] + (dTo[d] - dFrom[d]) * easeOut(p));
    if (p >= 1) { dAnimOn[d] = 0; dFrom[d] = dTo[d]; } else dAnimList[w++] = d;
  }
  dAnimList.length = w;
  w = 0;
  for (let k = 0; k < glowList.length; k++) {
    const i = glowList[k], r = R[fRepo[i]];
    const g = gAmp[i] * Math.exp(-(NOW - gT0[i]) / 0.5);
    r.build.geometry.attributes.aGlow.array[i - r.f0] = g > 0.01 ? g : 0;
    r.glowDirty = true;
    if (g > 0.01) glowList[w++] = i; else glowOn[i] = 0;
  }
  glowList.length = w;
  w = 0;
  for (let k = 0; k < dGlowList.length; k++) {
    const d = dGlowList[k], r = R[dRepo[d]], id = d - r.d0;
    const g = 0.5 * Math.exp(-(NOW - dGT0[d]) / 0.6);
    if (id > 0) { r.plat.geometry.attributes.aGlow.array[id - 1] = g > 0.01 ? g : 0; r.platGlowDirty = true; }
    if (g > 0.01) dGlowList[w++] = d; else dGlowOn[d] = 0;
  }
  dGlowList.length = w;
  for (const r of R) {
    if (r.dirty) { r.build.instanceMatrix.needsUpdate = true; r.dirty = false; }
    if (r.platDirty) { r.plat.instanceMatrix.needsUpdate = true; r.platDirty = false; }
    if (r.glowDirty) { r.build.geometry.attributes.aGlow.needsUpdate = true; r.glowDirty = false; }
    if (r.platGlowDirty) { r.plat.geometry.attributes.aGlow.needsUpdate = true; r.platGlowDirty = false; }
  }
}
function statusOf(r) {
  if (!r.cum) return { key: 'none', label: 'not yet', days: Infinity };
  const days = (T - r.last) / 1440;
  for (const s of STATUS) if (days <= s.max) return { ...s, days };
  return { ...STATUS[STATUS.length - 1], days };
}
// a repo's colour under the lens: its people's colour, pulled toward its bots' and agents' by the square root of
// their share (so a repo with a tenth of its commits from an agent visibly takes on that agent's colour)
const mixC = new THREE.Color(), otherC = new THREE.Color();
function whoMix(r, out) {
  out.copy(WHO_RGB[0]);
  if (!r.cum) return out;
  let n = 0;
  otherC.setRGB(0, 0, 0);
  for (let w = 1; w < WHO.length; w++) {
    const c = r.whoCum[w];
    if (c) { n += c; otherC.r += WHO_RGB[w].r * c; otherC.g += WHO_RGB[w].g * c; otherC.b += WHO_RGB[w].b * c; }
  }
  if (n) out.lerp(otherC.multiplyScalar(1 / n), Math.sqrt(n / r.cum));
  return out;
}
const BEAM_COL = new THREE.Color(0.3, 0.92, 1.45);
function updateRepoVisuals(dt) {
  for (const r of R) {
    const a = 1 - Math.exp(-r.heat / 1.4);
    r.act += (a - r.act) * (1 - Math.exp(-dt * 6));
    const act = r.act;
    const iso = focusRi >= 0 && focusRi !== r.ri ? 0.32 : 1;
    const born = r.cum > 0;
    const sat = born ? 0.3 + 0.7 * clamp(act * 1.6, 0, 1) : 0.22;
    const bright = (born ? 0.62 + 0.38 * clamp(act * 1.4, 0, 1) : 0.5) * iso;
    for (const m of [r.matBuild, r.matPlat, r.matBase]) { m.uniforms.uSat.value = sat; m.uniforms.uBright.value = bright; }
    r.flash *= Math.exp(-dt * 2.6);
    r.matBase.uniforms.uRim.value = (born ? 0.08 + 0.55 * act : 0) * iso + r.flash * 0.9;
    // connection: thicker for a deep history, brighter for recent activity; fades as the repo goes quiet
    if (r.beamBorn) {
      if (r.beamGrow < 1) r.beamGrow = Math.min(1, r.beamGrow + dt / 1.1);
      const bond = Math.log1p(r.cum) / Math.log1p(maxCum);
      const st = (T - r.last) / 1440;
      const floorA = st > 90 ? 0.035 : 0.07;
      r.beam.visible = true;
      r.beamMat.uniforms.uGrow.value = easeOut(r.beamGrow);
      r.beamMat.uniforms.uWidth.value = (0.03 + 0.15 * bond) * (0.3 + 0.7 * act) + r.flash * 0.03;
      r.beamMat.uniforms.uAlpha.value = (floorA + 0.72 * act + r.flash * 0.25) * iso;
      r.beamMat.uniforms.uFlow.value = act;
      r.beamMat.uniforms.uPx.value = (0.9 + 3.4 * act * (0.4 + 0.6 * bond) + r.flash * 1.5) * (iso < 1 ? 0.7 : 1);
      r.port.visible = r.beamGrow >= 1;
      r.port.scale.setScalar(0.55 + 0.6 * act + r.flash * 0.5);
      if (lens) {
        whoMix(r, mixC);
        r.beamMat.uniforms.uColor.value.copy(mixC).multiplyScalar(1.7);
        r.port.material.color.copy(mixC).multiplyScalar(0.7 + 1.6 * act);
      } else r.port.material.color.setRGB(0.25 + 0.5 * act, 0.5 + 1.3 * act, 0.7 + 1.7 * act);
      r.tether.visible = true;
      r.tether.material.opacity = (0.05 + 0.4 * act) * iso;
    } else {
      r.beam.visible = false; r.port.visible = false; r.tether.visible = false;
    }
  }
}
let labelsOn = true;
const projV = new THREE.Vector3();
function updateLabels() {
  const cands = [];
  for (const r of R) {
    const vis = labelsOn && r.baseV > 0.05 && (r.cum > 0 || r.ri === focusRi || r.ri === hoverRi);
    if (!vis) { r.label.visible = false; continue; }
    const score = (r.ri === focusRi ? 1000 : 0) + (r.ri === hoverRi ? 500 : 0) + r.act * 4 + Math.log1p(r.cum);
    cands.push([score, r]);
  }
  cands.sort((a, b) => b[0] - a[0]);
  // greedy screen-space placement: higher-priority labels win, overlapping ones hide
  const W = stage.clientWidth, H = stage.clientHeight, boxes = [];
  {                                              // the avatar is a no-label zone
    projV.copy(avatar.position).project(camera);
    const ax = (projV.x * 0.5 + 0.5) * W, ay = (-projV.y * 0.5 + 0.5) * H;
    projV.copy(avatar.position).y += AV_R; projV.project(camera);
    const ar = Math.abs((-projV.y * 0.5 + 0.5) * H - ay) * 1.1;
    if (projV.z < 1) boxes.push([ax - ar, ay - ar, ax + ar, ay + ar]);
  }
  const reserved = boxes.length;
  for (const [, r] of cands) {
    projV.copy(r.label.position).project(camera);
    const x = (projV.x * 0.5 + 0.5) * W, y = (-projV.y * 0.5 + 0.5) * H;
    const w = (r.short.length + r.owner.length) * 6.3 + 44, h = 22;
    const box = [x - w / 2, y - h, x + w / 2, y];
    const pinned = r.ri === focusRi || r.ri === hoverRi;
    let ok = projV.z < 1 && boxes.length - reserved < 16;
    if (ok && !pinned) for (const b of boxes) if (box[0] < b[2] && box[2] > b[0] && box[1] < b[3] && box[3] > b[1]) { ok = false; break; }
    r.label.visible = ok || pinned;
    if (!r.label.visible) continue;
    boxes.push(box);
    const t = String(r.cum);
    if (r.labelCt.textContent !== t) r.labelCt.textContent = t;
    const o = (focusRi >= 0 && focusRi !== r.ri && hoverRi !== r.ri) ? 0.35 : 0.55 + 0.45 * clamp(r.act * 1.5, 0, 1);
    r.labelEl.style.opacity = o.toFixed(2);
    r.labelEl.dataset.status = statusOf(r).key;
  }
}

// ───────────────────────────────────────────────────────────── day / night (PKT clock)
const C_SKY_DAY = new THREE.Color(0.44, 0.46, 0.52), C_SKY_NIGHT = new THREE.Color(0.25, 0.27, 0.34);
const C_GR_DAY = new THREE.Color(0.1, 0.09, 0.08), C_GR_NIGHT = new THREE.Color(0.035, 0.045, 0.07);
const C_KEY_DAY = new THREE.Color(1.0, 0.97, 0.93), C_KEY_NIGHT = new THREE.Color(0.58, 0.6, 0.7);
const C_TOP_DAY = new THREE.Color(0.018, 0.035, 0.085), C_TOP_NIGHT = new THREE.Color(0.003, 0.006, 0.016);
const C_HOR_DAY = new THREE.Color(0.06, 0.085, 0.15), C_HOR_NIGHT = new THREE.Color(0.014, 0.02, 0.042);
let nightNow = 0.5;
function dayNight() {
  const hour = ((T % 1440) + 1440) % 1440 / 60;
  const sun = Math.cos(((hour - 13) / 24) * Math.PI * 2);
  const night = smooth(0.25, -0.35, sun);
  const amt = clamp(1 - Math.log(Math.max(60, curSpeed) / 60) / Math.log(30), 0, 1);
  const n = 0.62 + (night - 0.62) * amt;
  nightNow = n;
  NIGHT.value = n;
  ENV.uSky.value.lerpColors(C_SKY_DAY, C_SKY_NIGHT, n);
  ENV.uGround.value.lerpColors(C_GR_DAY, C_GR_NIGHT, n);
  ENV.uKeyCol.value.lerpColors(C_KEY_DAY, C_KEY_NIGHT, n);
  sky.material.uniforms.uTop.value.lerpColors(C_TOP_DAY, C_TOP_NIGHT, n);
  sky.material.uniforms.uHorizon.value.lerpColors(C_HOR_DAY, C_HOR_NIGHT, n);
  ENV.uFog.value.copy(sky.material.uniforms.uHorizon.value);
  const az = (hour / 24) * Math.PI * 2 * amt + 0.9;
  ENV.uKeyDir.value.set(Math.cos(az) * 0.55, 0.78 - 0.25 * n, Math.sin(az) * 0.55).normalize();
}

// ───────────────────────────────────────────────────────────── HUD
const el = {
  date: $('clock-date'), time: $('clock-time'), phase: $('clock-phase'), speed: $('speed-label'),
  total: $('c-total'), today: $('c-today'), hour: $('c-hour'), active: $('c-active'), conn: $('c-conn'), files: $('c-files'), lines: $('c-lines'),
  ticker: $('ticker'), tl: $('timeline'), board: $('board'), focus: $('focus'), tip: $('tip'), toasts: $('toasts'),
  play: $('btn-play'), orbit: $('btn-orbit'), labels: $('btn-labels'), loading: $('loading'),
};
// identity + the note that reconciles GitHub's contribution count with the buildings, in numbers
{
  document.title = DATA.title || `${LOGIN} · commit city`;
  $('kicker-title').textContent = `${LOGIN} · commit city`;
  $('clock-tz').textContent = TZ.label;
  const tot = DATA.totals || {};
  const bits = [];
  const list = xs => (xs.length < 3 ? xs.join(' and ') : `${xs.slice(0, -1).join(', ')}, and ${xs[xs.length - 1]}`);
  // the repos too big to replay are named, because one of them can be most of a person's year (torvalds/linux)
  const big = Array.isArray(tot.too_big) ? tot.too_big : [];
  const bigCommits = big.reduce((a, b) => a + b.commits, 0);
  const skip = big.length ? `Not drawn, too big for the hosted builder: ${big.map(b => `${b.repo} (${fmtInt(b.commits)} commits)`).join(', ')}.` : '';
  // the rest = repos past the busiest-N cap *and* any further too-big ones, so no "smaller"
  const rest = (tot.omitted_repos || 0) - big.length, restCommits = Math.max(0, (tot.omitted_commits || 0) - bigCommits);
  const gh = tot.contributions != null && tot.github ? tot.github : null;
  if (gh) {
    // the calendar = public commits + private contributions + issues, PRs, reviews and the like
    const priv = tot.restricted || 0, other = Math.max(0, tot.contributions - priv - gh.commits);
    const parts = [`${fmtInt(gh.commits)} public commits`, ...(priv ? [`${fmtInt(priv)} private`] : []), ...(other ? [`${fmtInt(other)} issues, PRs, reviews and other activity`] : [])];
    bits.push(`GitHub shows ${fmtInt(tot.contributions)} contributions since ${tot.window_start}: ${list(parts)}. Buildings show ${fmtInt(tot.commits)} commits, all on default branches as they stand today.`);
  } else if (tot.contributions != null) {
    bits.push(`GitHub shows ${fmtInt(tot.contributions)} contributions since ${tot.window_start}; it also counts PRs, issues, reviews and private activity. Buildings show default-branch commits.`);
  } else if (!PERSONAL) {
    bits.push(`Buildings show every non-merge commit on ${DATA.kind === 'org' ? "each repo's" : 'the'} default branch since ${tot.window_start}.`);
  }
  if (rest > 0) bits.push(`${rest} ${big.length ? 'more ' : ''}${rest === 1 ? 'repo' : 'repos'} (${fmtInt(restCommits)} commits) not drawn: the very largest are skipped, and only the busiest are shown.`);
  // what is left of GitHub's count: commits it credits to co-authors, commits once pushed to a default branch and
  // rewritten since (it keeps counting those), one commit in several repos (drawn once), repos it never listed
  const more = gh ? gh.commits - (tot.commits || 0) - bigCommits - restCommits : 0;
  if (more > 0) {
    const why = [...(gh.capped ? ['commits in repos past the 100 it lists'] : []), 'co-authored commits', 'commits later rewritten off a default branch', 'the same commit in several repos'];
    bits.push(`GitHub also counts ${fmtInt(more)} more, such as ${list(why)}.`);
  }
  if (!PERSONAL) {
    for (const [sel, text] of [['#f-commits + label', 'commits'], ['.side-head span', 'repos · commits so far'], ['.tick-labels span:nth-child(2)', 'commits per hour']]) {
      const n = document.querySelector(sel); if (n) n.textContent = text;
    }
  }
  const note = $('contrib-note');
  note.replaceChildren(...(skip ? [Object.assign(document.createElement('b'), { textContent: skip })] : []), bits.join(' '));
  note.hidden = !skip && !bits.length;
}
const speedBtns = [];
SPEEDS.forEach((s, k) => {
  const b = document.createElement('button');
  b.className = 'seg'; b.textContent = s.k; b.title = s.label;
  b.addEventListener('click', () => setSpeed(k));
  $('speeds').appendChild(b);
  speedBtns.push(b);
});
function setSpeed(k) {
  speedIdx = clamp(k, 0, SPEEDS.length - 1);
  speedBtns.forEach((b, j) => b.classList.toggle('on', j === speedIdx));
  el.speed.textContent = SPEEDS[speedIdx].label;
}
function setPlaying(p) {
  playing = p;
  if (p && T >= T_END - 1) seek(0, 0.3);
  el.play.textContent = playing ? '❚❚' : '▶';
  el.play.setAttribute('aria-label', playing ? 'Pause' : 'Play');
}
{
  const leg = $('legend');
  DATA.langs.forEach((name, k) => {
    const s = document.createElement('span'); s.className = 'chip';
    const sw = document.createElement('i'); sw.style.background = LANG_HEX[k];
    s.append(sw, document.createTextNode(name));
    leg.appendChild(s);
  });
}
const rows = R.map(r => {
  const b = document.createElement('button');
  b.className = 'row';
  const dot = document.createElement('i'); dot.className = 'dot';
  const name = document.createElement('span'); name.className = 'rn';
  const own = document.createElement('small'); own.textContent = r.owner + '/';
  name.append(own, document.createTextNode(r.short));
  const n = document.createElement('span'); n.className = 'rc';
  const bar = document.createElement('span'); bar.className = 'bar';
  const fill = document.createElement('span'); bar.appendChild(fill);
  b.append(dot, name, n, bar);
  b.addEventListener('click', () => focusRepo(r.ri === focusRi ? -1 : r.ri));
  b.addEventListener('mouseenter', () => { hoverRi = r.ri; });
  b.addEventListener('mouseleave', () => { if (hoverRi === r.ri) hoverRi = -1; });
  el.board.appendChild(b);
  return { b, dot, n, fill, r };
});
function updateBoard() {
  const order = [...rows].sort((a, b) => b.r.cum - a.r.cum || b.r.act - a.r.act);
  const top = Math.max(1, order[0].r.cum);
  order.forEach((row, k) => {
    const r = row.r;
    const show = k < 16 && r.cum > 0;
    row.b.hidden = !show;
    if (!show) return;
    row.b.style.order = k;
    row.n.textContent = fmtInt(r.cum);
    row.fill.style.width = (100 * r.cum / top).toFixed(1) + '%';
    row.fill.style.background = lens ? splitGradient(r.whoCum, r.cum) : '';
    const st = statusOf(r);
    row.dot.dataset.status = st.key;
    row.b.classList.toggle('sel', r.ri === focusRi);
    row.b.title = `${r.name}: ${st.label}${isFinite(st.days) ? ` (${Math.floor(st.days)} days since the last commit)` : ''}`;
  });
}
function splitGradient(counts, total) {
  if (!total) return '';
  const stops = [];
  let at = 0;
  for (let w = 0; w < WHO.length; w++) {
    if (!counts[w]) continue;
    const to = at + (100 * counts[w]) / total;
    stops.push(`${WHO_HEX[w]} ${at.toFixed(1)}% ${to.toFixed(1)}%`);
    at = to;
  }
  return `linear-gradient(90deg, ${stops.join(', ')})`;
}
// the split bar and its legend: counts per actor, people first, then by size
function whoRows(counts) {
  const tot = counts.reduce((a, b) => a + b, 0);
  const rows = [];
  for (let w = 0; w < WHO.length; w++) if (counts[w] || w === 0) rows.push({ w, n: counts[w], p: tot ? counts[w] / tot : 0 });
  rows.sort((a, b) => (a.w === 0 ? -1 : b.w === 0 ? 1 : b.n - a.n));
  return { tot, rows };
}
function fillSplit(node, rows) {
  const want = rows.filter(x => x.n);
  if (node.children.length !== want.length) node.replaceChildren(...want.map(() => document.createElement('span')));
  want.forEach((x, k) => { const sp = node.children[k]; sp.style.flexGrow = x.n; sp.style.background = WHO_HEX[x.w]; sp.title = `${WHO_LABEL[x.w]}: ${(100 * x.p).toFixed(1)}%`; });
}
const pctTxt = p => (p > 0 && p < 0.01 ? '<1%' : `${Math.round(p * 100)}%`);
function updateWho() {
  if (!lens) return;
  const { tot, rows } = whoRows(whoSoFar);
  fillSplit($('who-split'), rows);
  const other = tot ? 1 - whoSoFar[0] / tot : 0;
  setText($('who-pct'), tot ? `${pctTxt(other)} not ${PERSONAL ? 'you' : 'people'}` : '');
  const shown = rows.slice(0, 6), list = $('who-list');
  if (list.children.length !== shown.length) list.replaceChildren(...shown.map(() => {
    const li = document.createElement('li');
    li.append(document.createElement('i'), Object.assign(document.createElement('span'), { className: 'nm' }),
      Object.assign(document.createElement('span'), { className: 'n' }), Object.assign(document.createElement('span'), { className: 'p' }));
    return li;
  }));
  shown.forEach((x, k) => {
    const [dot, nm, n, p] = list.children[k].children;
    dot.style.background = WHO_HEX[x.w];
    setText(nm, WHO_LABEL[x.w]); setText(n, fmtInt(x.n)); setText(p, pctTxt(x.p));
  });
}
function setLens(on, quiet) {
  lens = on;
  document.body.classList.toggle('lens', on);
  $('btn-lens').classList.toggle('on', on);
  $('whobox').hidden = !on;
  tlBg = null;
  if (!on) for (const r of R) r.beamMat.uniforms.uColor.value.copy(BEAM_COL);
  updateWho(); updateBoard();
  if (on && !quiet) {
    const all = new Uint32Array(WHO.length);
    for (const c of C) all[c.w]++;
    const bot = WHO.indexOf('bot'), agent = all.reduce((a, n, w) => a + (w && w !== bot ? n : 0), 0);
    toast(HAS_WHO ? `agent lens: ${pctTxt(bot > 0 ? all[bot] / NC : 0)} bots · ${pctTxt(agent / NC)} AI agents over the whole window`
      : 'agent lens: no bot or agent signatures here, every commit reads as human', 'lens');
  }
}
function langMix(r) {
  const n = new Float64Array(9);
  for (let i = 0; i < r.nF; i++) { const s = cur[r.f0 + i]; if (s > 0) n[r.lang[i]] += s; }
  return n;
}
function topDirs(r) {
  const out = [];
  for (const d of r.lay.dirs) if (d.depth === 1 && dAlive[r.d0 + d.id] > 0) out.push([d.name, dAlive[r.d0 + d.id]]);
  let rootFiles = 0;
  for (let i = 0; i < r.nF; i++) if (r.lay.fileDir[i] === 0 && cur[r.f0 + i] > 0) rootFiles++;
  if (rootFiles) out.push(['(root files)', rootFiles]);
  return out.sort((a, b) => b[1] - a[1]);
}
function dirStats(r) {
  let dirs = 0, depth = 0;
  for (const d of r.lay.dirs) if (d.depth > 0 && dAlive[r.d0 + d.id] > 0) { dirs++; depth = Math.max(depth, d.depth); }
  return { dirs, depth };
}
const F = {
  name: $('f-name'), owner: $('f-owner'), status: $('f-status'), commits: $('f-commits'), files: $('f-files'), dirs: $('f-dirs'),
  depth: $('f-depth'), lines: $('f-lines'), last: $('f-last'), mix: $('f-mix'), tops: $('f-tops'), share: $('f-share'), fp: $('f-fp'),
};
const dirLabels = [];
for (let k = 0; k < 10; k++) {
  const e = document.createElement('div');
  e.className = 'dir-label';
  const o = new CSS2DObject(e);
  o.visible = false;
  scene.add(o);
  dirLabels.push({ o, e });
}
function updateDirLabels() {
  const r = focusRi >= 0 ? R[focusRi] : null;
  const tops = [];
  if (r && labelsOn) for (const d of r.lay.dirs) if (d.depth === 1 && dAlive[r.d0 + d.id] > 0) tops.push(d);
  tops.sort((a, b) => dAlive[r.d0 + b.id] - dAlive[r.d0 + a.id]);
  dirLabels.forEach((L, k) => {
    const d = tops[k];
    if (!d) { L.o.visible = false; return; }
    const [x, y, w, h] = d.rect;
    L.o.position.set(r.x + x + w / 2, STEP_H + 0.2, r.z + y + h / 2);
    const t = d.name + '/';
    if (L.e.textContent !== t) L.e.textContent = t;
    L.o.visible = true;
  });
}
function updateFocus() {
  updateDirLabels();
  if (focusRi < 0) { el.focus.hidden = true; return; }
  const r = R[focusRi];
  el.focus.hidden = false;
  F.name.textContent = r.short;
  F.owner.textContent = r.owner + (r.fork ? ' · fork' : '');
  const st = statusOf(r);
  F.status.textContent = st.label;
  F.status.dataset.status = st.key;
  F.commits.textContent = fmtInt(r.cum);
  F.share.textContent = cPtr ? (100 * r.cum / cPtr).toFixed(1) + (PERSONAL ? '% of yours' : '% of all') : '';
  F.files.textContent = fmtInt(r.alive);
  const ds = dirStats(r);
  F.dirs.textContent = fmtInt(ds.dirs);
  F.depth.textContent = ds.depth;
  F.lines.textContent = fmtK(r.lines);
  F.fp.textContent = fmtInt(upper(r.evTimes, T));
  F.last.textContent = r.cum ? `${DTF_DAY.format(tDate(r.last))} · ${st.days < 1 ? 'today' : Math.floor(st.days) + ' d ago'}` : (PERSONAL ? 'no commits from you yet' : 'no commits yet');
  $('f-whobox').hidden = !HAS_WHO || !r.cum;
  if (HAS_WHO && r.cum) {
    const { rows } = whoRows(r.whoCum);
    fillSplit($('f-who'), rows);
    setText($('f-who-n'), `${fmtInt(r.cum)} commits`);
    const top = rows.filter(x => x.n).slice(0, 4);
    const key = top.map(x => `${x.w}:${pctTxt(x.p)}`).join(',');
    const lg = $('f-who-l');
    if (lg.dataset.k !== key) {
      lg.dataset.k = key;
      lg.replaceChildren(...top.map(x => { const s = document.createElement('span'), i = document.createElement('i'); i.style.background = WHO_HEX[x.w]; s.append(i, `${WHO_LABEL[x.w]} ${pctTxt(x.p)}`); return s; }));
    }
  }
  const mix = langMix(r), tot = mix.reduce((a, b) => a + b, 0) || 1;
  F.mix.replaceChildren(...[...mix].map((v, k) => {
    const s = document.createElement('span');
    s.style.width = (100 * v / tot) + '%'; s.style.background = LANG_HEX[k];
    s.title = `${DATA.langs[k]}: ${(100 * v / tot).toFixed(1)}% of lines`;
    return s;
  }).filter(s => parseFloat(s.style.width) > 0.15));
  const tops = topDirs(r).slice(0, 7);
  const maxv = tops.length ? tops[0][1] : 1;
  F.tops.replaceChildren(...tops.map(([n, v]) => {
    const li = document.createElement('li');
    const a = document.createElement('span'); a.className = 'dn'; a.textContent = n === '(root files)' ? n : n + '/';
    const b = document.createElement('span'); b.className = 'dv'; b.textContent = fmtInt(v);
    const bar = document.createElement('i'); bar.style.width = (100 * v / maxv) + '%';
    li.append(a, b, bar);
    return li;
  }));
}
let lastClockKey = '';
function updateHUD() {
  const d = tDate(T);
  const key = DTF_DATE.format(d) + DTF_TIME.format(d);
  if (key !== lastClockKey) {
    lastClockKey = key;
    el.date.textContent = DTF_DATE.format(d);
    el.time.textContent = DTF_TIME.format(d);
    const hour = ((T % 1440) + 1440) % 1440 / 60;
    el.phase.textContent = hour < 5 || hour >= 22 ? 'late night' : hour < 12 ? 'morning' : hour < 17 ? 'afternoon' : 'evening';
  }
  const dayStart = Math.floor(T / 1440) * 1440, hourStart = Math.floor(T / 60) * 60;
  const today = cPtr - lower(cT, dayStart);
  setText(el.total, fmtInt(cPtr));
  setText(el.today, fmtInt(today));
  setText(el.hour, fmtInt(cPtr - lower(cT, hourStart)));
  let active = 0, conn = 0;
  for (const r of R) { if (r.cum) conn++; if (r.cum && T - r.last <= 7 * 1440) active++; }
  setText(el.active, active);
  setText(el.conn, conn);
  setText(el.files, fmtInt(totalAlive));
  setText(el.lines, fmtK(totalLines));
  const dIdx = Math.floor(T / 1440);
  refreshPriorMax(dIdx);
  if (playing && today > priorMax && today >= 15 && recordToastDay !== dIdx) {
    recordToastDay = dIdx;
    toast(`record day: passed the old best of ${priorMax} commits`, 'record');
  }
}
function setText(node, v) { const s = String(v); if (node.textContent !== s) node.textContent = s; }
function toast(msg, kind, whenText) {
  const t = document.createElement('div');
  t.className = 'toast ' + (kind || '');
  const when = document.createElement('small'); when.textContent = whenText || DTF_DAY.format(tDate(T));
  t.append(when, document.createTextNode(msg));
  el.toasts.prepend(t);
  while (el.toasts.children.length > 4) el.toasts.lastChild.remove();
  setTimeout(() => t.classList.add('out'), 3200);
  setTimeout(() => t.remove(), 3800);
}
// hourly ticker: commits per hour over the last 48 simulated hours
const tk = el.ticker.getContext('2d');
function drawTicker() {
  const cw = el.ticker.clientWidth, ch = el.ticker.clientHeight, dpr = Math.min(2, window.devicePixelRatio || 1);
  if (!cw || !ch) return;
  if (el.ticker.width !== Math.round(cw * dpr)) { el.ticker.width = Math.round(cw * dpr); el.ticker.height = Math.round(ch * dpr); }
  tk.setTransform(dpr, 0, 0, dpr, 0, 0);
  tk.clearRect(0, 0, cw, ch);
  const hourStart = Math.floor(T / 60) * 60;
  const vals = [];
  let mx = 4;
  for (let h = 47; h >= 0; h--) {
    const lo = hourStart - h * 60, hi = Math.min(lo + 60, T + 1e-6);
    const v = upper(cT, hi) - lower(cT, lo);
    vals.push(v); mx = Math.max(mx, v);
  }
  const bw = cw / 48;
  for (let k = 0; k < 48; k++) {
    const v = vals[k];
    const bh = v ? Math.max(2, (ch - 4) * Math.sqrt(v / mx)) : 1;
    const hourOfDay = ((Math.floor((hourStart - (47 - k) * 60) / 60) % 24) + 24) % 24;
    tk.fillStyle = k === 47 ? '#9be7ff' : v ? '#4f9fdc' : 'rgba(150,170,200,0.18)';
    const x = k * bw + 0.5, w = Math.max(1, bw - 1.5);
    if (bh > 3) { roundTop(tk, x, ch - bh, w, bh, Math.min(2, w / 2)); } else tk.fillRect(x, ch - bh, w, bh);
    if (hourOfDay === 0 && k > 0) { tk.fillStyle = 'rgba(200,215,235,0.35)'; tk.fillRect(x - 1, 0, 1, ch); }
  }
}
function roundTop(g, x, y, w, h, rad) {
  g.beginPath(); g.moveTo(x, y + h); g.lineTo(x, y + rad); g.quadraticCurveTo(x, y, x + rad, y);
  g.lineTo(x + w - rad, y); g.quadraticCurveTo(x + w, y, x + w, y + rad); g.lineTo(x + w, y + h); g.closePath(); g.fill();
}
// timeline: daily commits, month ticks, playhead, scrub
const tl = el.tl.getContext('2d');
let tlBg = null, tlHover = -1;
const TL_PAD = 10;
function drawTimelineBg() {
  const cw = el.tl.clientWidth, ch = el.tl.clientHeight, dpr = Math.min(2, window.devicePixelRatio || 1);
  el.tl.width = Math.round(cw * dpr); el.tl.height = Math.round(ch * dpr);
  tlBg = document.createElement('canvas'); tlBg.width = el.tl.width; tlBg.height = el.tl.height;
  const g = tlBg.getContext('2d');
  g.setTransform(dpr, 0, 0, dpr, 0, 0);
  const w = cw - TL_PAD * 2, base = ch - 16;
  const mx = Math.max(...dayCounts);
  g.fillStyle = 'rgba(160,180,210,0.12)';
  g.fillRect(TL_PAD, base, w, 1);
  for (let d = 0; d < N_DAYS; d++) {
    const v = dayCounts[d];
    if (!v) continue;
    const x = TL_PAD + (d * 1440 / T_END) * w, bh = Math.max(1.5, (base - 4) * Math.sqrt(v / mx)), bw = Math.max(1, w / N_DAYS - 0.4);
    g.fillStyle = 'rgba(120,170,230,0.55)';
    g.fillRect(x, base - bh, bw, bh);
    if (lens && dayWho[d * WHO.length] < v) {           // people at the bottom, everyone else stacked on top
      let y = base - bh;
      for (let k = 1; k < WHO.length; k++) {
        const n = dayWho[d * WHO.length + k];
        if (!n) continue;
        const h = bh * n / v;
        g.fillStyle = WHO_HEX[k]; g.fillRect(x, y, bw, h);
        y += h;
      }
    }
  }
  g.font = '10px system-ui, sans-serif'; g.textBaseline = 'top';
  const start = tDate(0);
  let firstLbl = true;
  let lastLblX = -1e9;
  const nMonths = Math.ceil(T_END / 1440 / 28) + 2;
  const every = Math.max(1, Math.ceil(nMonths / 18));
  for (let m = 0; m < nMonths; m++) {
    const dt = new Date(Date.UTC(start.getUTCFullYear(), start.getUTCMonth() + m, 1));
    const t = localToT(dt.getTime());
    if ((start.getUTCMonth() + m) % every) continue;
    if (t < 0 || t > T_END) continue;
    const x = TL_PAD + (t / T_END) * w;
    const lbl = DTF_MON.format(dt);
    if (x - lastLblX < (lbl === 'Jan' || firstLbl ? 40 : 28)) continue;   // never let month names collide
    lastLblX = x;
    g.fillStyle = 'rgba(160,180,210,0.28)'; g.fillRect(x, base - 2, 1, 6);
    g.fillStyle = 'rgba(190,205,225,0.75)';
    const mon = DTF_MON.format(dt);
    g.fillText(mon === 'Jan' || firstLbl ? `${mon} ${String(dt.getUTCFullYear()).slice(2)}` : mon, x + 3, base + 3);
    firstLbl = false;
  }
}
function drawTimeline() {
  const cw = el.tl.clientWidth, ch = el.tl.clientHeight, dpr = Math.min(2, window.devicePixelRatio || 1);
  if (!cw || !ch) return;                       // hidden UI / collapsed layout
  if (!tlBg || tlBg.width !== Math.round(cw * dpr) || tlBg.height !== Math.round(ch * dpr)) drawTimelineBg();
  tl.setTransform(1, 0, 0, 1, 0, 0);
  tl.clearRect(0, 0, el.tl.width, el.tl.height);
  tl.drawImage(tlBg, 0, 0);
  tl.setTransform(dpr, 0, 0, dpr, 0, 0);
  const w = cw - TL_PAD * 2, base = ch - 16, x = TL_PAD + (T / T_END) * w;
  tl.fillStyle = 'rgba(95,211,243,0.10)';
  tl.fillRect(TL_PAD, 0, x - TL_PAD, base);
  tl.fillStyle = '#9be7ff';
  tl.fillRect(x - 1, 0, 2, base + 4);
  tl.beginPath(); tl.arc(x, 4, 4, 0, Math.PI * 2); tl.fill();
  if (tlHover >= 0) {
    const hx = TL_PAD + (tlHover / T_END) * w;
    tl.fillStyle = 'rgba(255,255,255,0.35)'; tl.fillRect(hx, 0, 1, base);
  }
}
function tlTimeAt(clientX) {
  const rect = el.tl.getBoundingClientRect();
  return clamp(((clientX - rect.left - TL_PAD) / (rect.width - TL_PAD * 2)) * T_END, 0, T_END);
}
let wasPlaying = false;
el.tl.addEventListener('pointerdown', e => {
  scrubbing = true; wasPlaying = playing; playing = false;
  try { el.tl.setPointerCapture(e.pointerId); } catch { /* synthetic or already-released pointer */ }
  scrubTo = tlTimeAt(e.clientX);
});
el.tl.addEventListener('pointermove', e => {
  tlHover = tlTimeAt(e.clientX);
  const day = Math.floor(tlHover / 1440);
  showTip(e.clientX, e.clientY - 14, [DTF_DAY.format(tDate(day * 1440 + 720)), `${dayCounts[day] || 0} commits that day`], true);
  if (scrubbing) scrubTo = tlHover;
});
el.tl.addEventListener('pointerup', () => { if (scrubbing) { scrubbing = false; setPlaying(wasPlaying); } });
el.tl.addEventListener('pointerleave', () => { tlHover = -1; hideTip(); });

// ───────────────────────────────────────────────────────────── tooltip / picking
function showTip(x, y, lines, above) {
  const t = el.tip;
  t.replaceChildren(...lines.map((s, k) => { const d = document.createElement(k === 0 ? 'b' : 'div'); d.textContent = s; return d; }));
  t.hidden = false;
  const w = t.offsetWidth, h = t.offsetHeight;
  t.style.left = clamp(x + 14, 8, window.innerWidth - w - 8) + 'px';
  t.style.top = clamp(above ? y - h - 6 : y + 16, 8, window.innerHeight - h - 8) + 'px';
}
function hideTip() { el.tip.hidden = true; }
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
let pickPending = null, lastPick = 0, downAt = null;
const hoverBox = new THREE.LineSegments(new THREE.EdgesGeometry(boxGeo), new THREE.LineBasicMaterial({ color: new THREE.Color(1.6, 1.9, 2.2), transparent: true, opacity: 0.9 }));
hoverBox.visible = false;
scene.add(hoverBox);
renderer.domElement.addEventListener('pointermove', e => { pickPending = e; });
renderer.domElement.addEventListener('pointerleave', () => { pickPending = null; hideTip(); hoverBox.visible = false; if (hoverRi >= 0) hoverRi = -1; });
renderer.domElement.addEventListener('pointerdown', e => { downAt = [e.clientX, e.clientY]; });
renderer.domElement.addEventListener('pointerup', e => {
  if (!downAt || Math.hypot(e.clientX - downAt[0], e.clientY - downAt[1]) > 5) return;
  const hit = pick(e);
  if (hit) focusRepo(hit.r.ri);
});
renderer.domElement.addEventListener('dblclick', e => { if (!pick(e)) focusRepo(-1); });
function pick(e) {
  const rect = renderer.domElement.getBoundingClientRect();
  mouse.set(((e.clientX - rect.left) / rect.width) * 2 - 1, -((e.clientY - rect.top) / rect.height) * 2 + 1);
  camera.updateMatrixWorld();
  scene.updateMatrixWorld();
  raycaster.setFromCamera(mouse, camera);
  const hits = raycaster.intersectObjects(pickables, false);
  for (const h of hits) {
    const { kind, r } = h.object.userData;
    if (kind === 'build') {
      const k = h.instanceId, i = r.f0 + k;
      if (cur[i] <= 0) continue;
      return { kind, r, k, i };
    }
    if (kind === 'base' && r.baseV > 0.05) return { kind, r };
  }
  return null;
}
const mtx = new THREE.Matrix4();
function doPick() {
  if (!pickPending || NOW - lastPick < 0.06) return;
  const e = pickPending; pickPending = null; lastPick = NOW;
  if (e.buttons) { hideTip(); return; }
  const hit = pick(e);
  if (!hit) { hideTip(); hoverBox.visible = false; hoverRi = -1; renderer.domElement.style.cursor = ''; return; }
  hoverRi = hit.r.ri;
  renderer.domElement.style.cursor = 'pointer';
  const r = hit.r;
  if (hit.kind === 'build') {
    const i = hit.i, k = hit.k;
    let touches = 0;
    const lim = upper(cT, T);
    for (let q = 0; q < lim; q++) if (C[q].r === r.ri && C[q].files.includes(i)) touches++;
    showTip(e.clientX, e.clientY, [r.paths[k], `${r.name}`, `${fmtInt(cur[i])} lines · ${DATA.langs[r.lang[k]]}`,
      touches ? `touched by ${touches} of ${YOUR}commits so far` : `not touched by ${YOUR}commits yet`]);
    r.build.getMatrixAt(k, mtx);
    hoverBox.matrix.copy(r.group.matrixWorld).multiply(mtx);
    hoverBox.matrixAutoUpdate = false;
    hoverBox.visible = true;
  } else {
    hoverBox.visible = false;
    const st = statusOf(r);
    showTip(e.clientX, e.clientY, [r.name, `${fmtInt(r.cum)} ${PERSONAL ? 'of your ' : ''}commits · ${st.label}`, `${fmtInt(r.alive)} files · ${fmtK(r.lines)} lines`, 'click to inspect']);
  }
}

// ───────────────────────────────────────────────────────────── camera moves
let fly = null;
function flyTo(pos, target, dur = 1.2) {
  fly = { t0: NOW, dur, p0: camera.position.clone(), p1: pos.clone(), q0: controls.target.clone(), q1: target.clone() };
}
function focusRepo(ri) {
  focusRi = ri;
  document.body.classList.toggle('focused', ri >= 0);
  if (ri < 0) { flyTo(HOME.pos, HOME.target); updateFocus(); return; }
  const r = R[ri];
  const target = new THREE.Vector3(r.x, Math.min(3, r.maxH * 0.3), r.z);
  const dist = clamp(r.lay.L * 1.55 + r.maxH * 1.2, 12, 95);
  const dir = new THREE.Vector3(r.x, 0, r.z).normalize();
  if (!isFinite(dir.x)) dir.set(0, 0, 1);
  const pos = target.clone().addScaledVector(dir, dist * 0.82).add(new THREE.Vector3(0, dist * 0.62, 0));
  controls.autoRotate = false; syncOrbitBtn();
  flyTo(pos, target);
  updateFocus();
}
function updateFly() {
  if (!fly) return;
  const u = clamp((NOW - fly.t0) / fly.dur, 0, 1), e = easeIO(u);
  camera.position.lerpVectors(fly.p0, fly.p1, e);
  controls.target.lerpVectors(fly.q0, fly.q1, e);
  if (u >= 1) fly = null;
}
controls.addEventListener('start', () => { fly = null; if (controls.autoRotate) { controls.autoRotate = false; syncOrbitBtn(); } });
function syncOrbitBtn() { el.orbit.classList.toggle('on', controls.autoRotate); }

// ───────────────────────────────────────────────────────────── controls wiring
el.play.addEventListener('click', () => setPlaying(!playing));
$('btn-back').addEventListener('click', () => seek(T - 1440, 0.3));
$('btn-fwd').addEventListener('click', () => { const was = playing; playing = false; advance(Math.min(T_END, T + 1440)); playing = was; });
el.orbit.addEventListener('click', () => { controls.autoRotate = !controls.autoRotate; syncOrbitBtn(); });
el.labels.addEventListener('click', () => { labelsOn = !labelsOn; el.labels.classList.toggle('on', labelsOn); });
$('btn-home').addEventListener('click', () => focusRepo(-1));
$('btn-hud').addEventListener('click', () => document.body.classList.toggle('bare'));
$('f-close').addEventListener('click', () => focusRepo(-1));
$('btn-quality').addEventListener('click', () => setQuality(quality === 'high' ? 'low' : 'high'));
$('btn-lens').addEventListener('click', () => setLens(!lens));
$('btn-rec').addEventListener('click', () => toggleRecPanel());
$('rec-stop').addEventListener('click', () => stopRecord());
window.addEventListener('keydown', e => {
  if (e.target.closest && e.target.closest('input, textarea')) return;
  if (e.metaKey || e.ctrlKey || e.altKey) return;              // leave browser shortcuts (cmd+R, ctrl+A) alone
  const k = e.key;
  if (rec) { if (k === 'Escape') stopRecord(); return; }
  if (k === ' ') { e.preventDefault(); setPlaying(!playing); }
  else if (k === 'ArrowRight') { e.preventDefault(); const step = e.shiftKey ? 60 : 1440; const was = playing; playing = false; advance(Math.min(T_END, T + step)); playing = was; }
  else if (k === 'ArrowLeft') { e.preventDefault(); seek(T - (e.shiftKey ? 60 : 1440), 0.3); }
  else if (k === 'ArrowUp' || k === '+' || k === '=') setSpeed(speedIdx + 1);
  else if (k === 'ArrowDown' || k === '-') setSpeed(speedIdx - 1);
  else if (k >= '1' && k <= '6') setSpeed(+k - 1);
  else if (k === 'Home') seek(0, 0.3);
  else if (k === 'End') seek(T_END, 0.3);
  else if (k === 'Escape') focusRepo(-1);
  else if (k === 'o' || k === 'O') { controls.autoRotate = !controls.autoRotate; syncOrbitBtn(); }
  else if (k === 'l' || k === 'L') { labelsOn = !labelsOn; el.labels.classList.toggle('on', labelsOn); }
  else if (k === 'h' || k === 'H') document.body.classList.toggle('bare');
  else if ((k === 'f' || k === 'F') && hoverRi >= 0) focusRepo(hoverRi);
  else if (k === 'a' || k === 'A') setLens(!lens);
  else if (k === 'r' || k === 'R') toggleRecPanel();
});
function setQuality(q) {
  quality = q;
  renderer.setPixelRatio(q === 'high' ? Math.min(window.devicePixelRatio || 1, 2) : 1);
  bloom.enabled = q === 'high';
  $('btn-quality').classList.toggle('on', q === 'high');
  onResize();
}
function onResize() {
  const w = stage.clientWidth, h = stage.clientHeight;
  camera.aspect = w / h; camera.updateProjectionMatrix();
  renderer.setSize(w, h);
  composer.setPixelRatio(renderer.getPixelRatio());
  composer.setSize(w, h);
  labelRenderer.setSize(w, h);
  const s = h * renderer.getPixelRatio() * 0.5 / Math.tan(THREE.MathUtils.degToRad(camera.fov / 2));
  pulseUScale.value = s;
  PXK.value = 1 / s;
  halo.material.uniforms.uScale.value = s;
  tlBg = null;
}
window.addEventListener('resize', onResize);


// ───────────────────────────────────────────────────────────── record a clip
// The stage becomes a viewfinder in the clip's shape, the year replays in a fixed number of seconds, and each frame is
// copied with its labels and a title overlay onto a 2D canvas that MediaRecorder encodes. Nothing leaves the browser.
const REC_FMT = { '16:9': [1280, 720], '9:16': [720, 1280], '1:1': [1080, 1080] };
let rec = null, recSpeed = null;
const recOpts = { fmt: '16:9', secs: 20 };
const SLUG = String((window.CC && window.CC.target) || LOGIN).replace(/[^\w.-]+/g, '-');
const TARGET = (window.CC && window.CC.target) || LOGIN;
function recMime() {
  if (typeof MediaRecorder === 'undefined' || !HTMLCanvasElement.prototype.captureStream) return null;
  for (const m of ['video/mp4;codecs=avc1.42E01F', 'video/mp4;codecs=avc1', 'video/mp4', 'video/webm;codecs=vp9', 'video/webm;codecs=vp8', 'video/webm']) {
    try { if (MediaRecorder.isTypeSupported(m)) return m; } catch { /* some browsers throw on unknown types */ }
  }
  return null;
}
function segs(name, opts, val) {
  return `<div class="segs" data-k="${name}">${opts.map(([v, t]) => `<button class="seg${String(v) === String(val) ? ' on' : ''}" data-v="${v}">${t}</button>`).join('')}</div>`;
}
function toggleRecPanel(force) {
  const pn = $('recpanel');
  const show = force ?? pn.hidden;
  if (!show) { pn.hidden = true; return; }
  const mime = recMime();
  pn.innerHTML = `<h3>Record a clip<button id="rec-x" aria-label="Close">×</button></h3>
    <p>The whole window replays from the first day to the last while the camera orbits. It renders in your browser; nothing is uploaded.</p>
    ${mime ? `<div class="lbl">Shape</div>${segs('fmt', [['16:9', '16:9 wide'], ['9:16', '9:16 tall'], ['1:1', '1:1 square']], recOpts.fmt)}
    <div class="lbl">Length</div>${segs('secs', [[10, '10 s'], [20, '20 s'], [30, '30 s']], recOpts.secs)}
    <button class="go" id="rec-go">● Start recording</button>
    <p style="margin:10px 0 0">${/mp4/.test(mime) ? 'Saves as MP4' : 'Saves as WebM'}${lens ? ', with the agent lens on' : ''}. Esc stops early and keeps what was recorded.</p>`
    : '<p>This browser cannot record video from a page. A current Chrome, Edge, Firefox or Safari can.</p>'}`;
  pn.hidden = false;
  pn.querySelectorAll('.segs').forEach(g => g.addEventListener('click', e => {
    const b = e.target.closest('button'); if (!b) return;
    recOpts[g.dataset.k] = g.dataset.k === 'secs' ? +b.dataset.v : b.dataset.v;
    g.querySelectorAll('button').forEach(x => x.classList.toggle('on', x === b));
  }));
  $('rec-x').onclick = () => (pn.hidden = true);
  const go = $('rec-go');
  if (go) go.onclick = () => record(recOpts).then(showClip, err => { finishRecord(); toast(`recording failed: ${err.message || err}`, 'quiet'); });
}
function record({ fmt = '16:9', secs = 20 } = {}) {
  const mime = recMime();
  if (!mime) return Promise.reject(new Error('this browser cannot record video'));
  if (rec) return Promise.reject(new Error('already recording'));
  const [W, H] = REC_FMT[fmt] || REC_FMT['16:9'];
  const fit = Math.min((window.innerWidth - 32) / W, (window.innerHeight - 84) / H);
  const cw = Math.max(120, Math.floor(W * fit)), ch = Math.max(120, Math.floor(H * fit));
  document.body.style.setProperty('--rec-w', `${cw}px`);
  document.body.style.setProperty('--rec-h', `${ch}px`);
  document.body.classList.add('rec');
  $('recpanel').hidden = true;
  hideTip(); hoverBox.visible = false;
  renderer.setPixelRatio(Math.min(3, W / cw));
  onResize();
  const cv = document.createElement('canvas');
  cv.width = W; cv.height = H;
  const g = cv.getContext('2d');
  const stream = cv.captureStream(30);
  const mr = new MediaRecorder(stream, { mimeType: mime, videoBitsPerSecond: Math.round(W * H * 30 * 0.24) });
  const chunks = [];
  // from the top: overview camera, orbiting, the whole window in `secs` seconds
  focusRepo(-1); fly = null;
  camera.position.copy(HOME.pos); controls.target.copy(HOME.target);
  controls.autoRotate = true; controls.autoRotateSpeed = 1.1; syncOrbitBtn();
  seek(0, 0);
  recSpeed = curSpeed = T_END / secs;
  setPlaying(true);
  return new Promise((resolve, reject) => {
    rec = { W, H, cw, ch, g, mr, t0: NOW, end: 0, mime, fmt };
    mr.ondataavailable = e => { if (e.data && e.data.size) chunks.push(e.data); };
    mr.onerror = e => reject(e.error || new Error('the recorder stopped'));
    mr.onstop = () => {
      const blob = new Blob(chunks, { type: mime.split(';')[0] });
      const info = { blob, mime, fmt, W, H };
      finishRecord();
      if (!blob.size) reject(new Error('the clip came out empty')); else resolve(info);
    };
    mr.start(500);
    drawRecFrame();
  });
}
function stopRecord() { if (rec && rec.mr.state !== 'inactive') rec.mr.stop(); }
function finishRecord() {
  if (!rec && !document.body.classList.contains('rec')) return;
  rec = null; recSpeed = null;
  document.body.classList.remove('rec');
  controls.autoRotateSpeed = 0.55;
  setQuality(quality);
}
function showClip({ blob, mime, fmt, W, H }) {
  const url = URL.createObjectURL(blob), ext = /mp4/.test(mime) ? 'mp4' : 'webm';
  const name = `commit-city-${SLUG}-${fmt.replace(':', 'x')}.${ext}`;
  const file = typeof File !== 'undefined' ? new File([blob], name, { type: blob.type }) : null;
  const canShare = !!(file && navigator.canShare && navigator.canShare({ files: [file] }));
  const pn = $('recpanel');
  pn.innerHTML = `<h3>Your clip<button id="rec-x" aria-label="Close">×</button></h3>
    <video src="${url}" autoplay muted loop playsinline controls></video>
    <div class="rec-actions"><a class="pri" href="${url}" download="${name}">Download .${ext}</a>${canShare ? '<button id="rec-share">Share…</button>' : ''}<button id="rec-again">Record again</button></div>
    <p>${(blob.size / 1e6).toFixed(1)} MB · ${W}×${H}${ext === 'webm' ? ' · WebM. Some sites only take MP4; Safari and recent Chrome record MP4 directly.' : ''}</p>`;
  pn.hidden = false;
  $('rec-x').onclick = () => { pn.hidden = true; URL.revokeObjectURL(url); };
  $('rec-again').onclick = () => { URL.revokeObjectURL(url); toggleRecPanel(true); };
  const sh = $('rec-share');
  if (sh) sh.onclick = () => navigator.share({ files: [file], title: `${TARGET} on commit.city`, text: `${TARGET} on GitHub, as a city` }).catch(() => {});
}
function rrect(g, x, y, w, h, r) { g.beginPath(); if (g.roundRect) g.roundRect(x, y, w, h, r); else g.rect(x, y, w, h); }
function drawRecFrame() {
  const { g, W, H, cw } = rec, k = W / cw, u = Math.min(W, H) / 720;
  g.drawImage(renderer.domElement, 0, 0, W, H);
  // the page draws labels as HTML; the clip draws them by hand where the page shows them
  g.textBaseline = 'middle';
  for (const r of R) {
    if (!r.label.visible) continue;
    projV.copy(r.label.position).project(camera);
    if (projV.z > 1) continue;
    const x = (projV.x * 0.5 + 0.5) * W, y = (-projV.y * 0.5 + 0.5) * H;
    g.globalAlpha = +(r.labelEl.style.opacity || 1);
    const f1 = `600 ${11.5 * k}px system-ui, sans-serif`, f2 = `${10 * k}px system-ui, sans-serif`;
    g.font = f2; const wo = g.measureText(r.owner).width;
    g.font = f1; const wn = g.measureText(r.short).width, wc = g.measureText(String(r.cum)).width;
    const gap = 5 * k, w = wo + wn + wc + gap * 2 + 15 * k, h = 20 * k;
    rrect(g, x - w / 2, y - h / 2, w, h, h / 2);
    g.fillStyle = 'rgba(6,10,18,0.7)'; g.fill();
    g.strokeStyle = 'rgba(255,255,255,0.12)'; g.lineWidth = k; g.stroke();
    let tx = x - w / 2 + 7 * k;
    g.font = f2; g.fillStyle = '#7f8ca2'; g.fillText(r.owner, tx, y); tx += wo + gap;
    g.font = f1; g.fillStyle = '#e8eef7'; g.fillText(r.short, tx, y); tx += wn + gap;
    g.fillStyle = lens ? (r.whoCum[0] === r.cum ? '#5fd3f3' : '#c58bff') : '#5fd3f3'; g.fillText(String(r.cum), tx, y);
  }
  g.globalAlpha = 1;
  // title, date and counter over a soft vignette
  let gr = g.createLinearGradient(0, 0, 0, 190 * u);
  gr.addColorStop(0, 'rgba(4,6,12,0.82)'); gr.addColorStop(1, 'rgba(4,6,12,0)');
  g.fillStyle = gr; g.fillRect(0, 0, W, 190 * u);
  gr = g.createLinearGradient(0, H - 110 * u, 0, H);
  gr.addColorStop(0, 'rgba(4,6,12,0)'); gr.addColorStop(1, 'rgba(4,6,12,0.85)');
  g.fillStyle = gr; g.fillRect(0, H - 110 * u, W, 110 * u);
  const P = 32 * u;
  g.textBaseline = 'alphabetic'; g.textAlign = 'left';
  g.font = `600 ${15 * u}px system-ui, sans-serif`; g.fillStyle = '#5fd3f3'; g.fillText('commit.city', P, P + 12 * u);
  g.font = `700 ${34 * u}px system-ui, sans-serif`; g.fillStyle = '#f2f6fb'; g.fillText(TARGET, P, P + 52 * u, W * 0.6);
  g.font = `500 ${17 * u}px system-ui, sans-serif`; g.fillStyle = '#b4c0d3'; g.fillText(DTF_DATE.format(tDate(T)), P, P + 80 * u);
  g.textAlign = 'right';
  g.font = `750 ${44 * u}px system-ui, sans-serif`; g.fillStyle = '#f2f6fb'; g.fillText(fmtInt(cPtr), W - P, P + 40 * u);
  g.font = `500 ${14 * u}px system-ui, sans-serif`; g.fillStyle = '#7f8ca2'; g.fillText(PERSONAL ? 'commits' : 'commits landed', W - P, P + 62 * u);
  if (lens && cPtr) {                                  // who wrote it, as a bar under the counter
    const bw = 200 * u, bx = W - P - bw, by = P + 76 * u;
    let x = bx;
    for (const row of whoRows(whoSoFar).rows) { if (!row.n) continue; const ww = bw * row.p; g.fillStyle = WHO_HEX[row.w]; g.fillRect(x, by, Math.max(1, ww - 1), 6 * u); x += ww; }
  }
  g.textAlign = 'left';
  // the year as a progress bar, and where to find it
  const bx = P, bw = W - P * 2, by = H - 26 * u;
  g.fillStyle = 'rgba(255,255,255,0.14)'; g.fillRect(bx, by, bw, 4 * u);
  g.fillStyle = '#5fd3f3'; g.shadowColor = '#5fd3f3'; g.shadowBlur = 10 * u;
  g.fillRect(bx, by, bw * clamp(T / T_END, 0, 1), 4 * u); g.shadowBlur = 0;
  g.font = `500 ${14 * u}px ui-monospace, SFMono-Regular, Menlo, monospace`; g.fillStyle = '#b4c0d3';
  g.fillText(`commit.city/${TARGET}`, bx, by - 12 * u);
  // timing: hold a beat on the finished city, then stop
  if (T >= T_END - 1e-6 && !rec.end) rec.end = NOW;
  if (rec.end && NOW - rec.end > 1.6) stopRecord();
  const s = Math.floor(NOW - rec.t0);
  setText($('rec-time'), `REC ${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`);
}

// ───────────────────────────────────────────────────────────── live: what happened since the city was built
// On commit.city, once the replay reaches the end, the city keeps listening: the owner's (or org's, or repo's) newest
// public events fly in as beams in their sender's colour. GitHub publishes events about five minutes late.
const LIVE = { on: false, seen: new Set(), since: Date.parse(DATA.generated || '') / 1000 || Date.now() / 1000, n: 0, timer: 0, queue: [] };
const LIVE_RGB = new Map();
const liveColor = who => { let c = LIVE_RGB.get(who); if (!c) LIVE_RGB.set(who, (c = new THREE.Color(whoHex(who)))); return c; };
const repoByName = new Map(R.map(r => [r.name.toLowerCase(), r]));
const LIVE_VERB = { push: 'pushed to', pr: 'opened a pull request in', merge: 'merged a pull request in', review: 'reviewed in', issue: 'opened an issue in',
  comment: 'commented in', release: 'released', create: 'created a branch in', delete: 'deleted a branch in', star: 'starred', fork: 'forked' };
async function pollLive() {
  if (document.hidden || rec) return;
  const kind = DATA.kind === 'org' ? '&kind=org' : '';
  try {
    const res = await fetch(`/api/pulse?t=${encodeURIComponent(TARGET)}${kind}`);
    if (!res.ok) return;
    const { events } = await res.json();
    for (const e of events || []) {
      if (LIVE.seen.has(e.id)) continue;
      LIVE.seen.add(e.id);
      if (e.t <= LIVE.since) continue;
      const r = repoByName.get(String(e.repo).toLowerCase());
      if (r) LIVE.queue.push({ e, r });
    }
  } catch { /* offline, or GitHub is slow: try again next time */ }
}
function dripLive() {
  const it = LIVE.queue.shift();
  if (!it) return;
  const { e, r } = it;
  LIVE.n++;
  spawnPulse(r, [], 1, liveColor(e.who), !e.who, true);
  const by = e.who && e.who !== 'bot' ? ` (${whoLabel(e.who)})` : '';
  toast(`${e.actor}${by} ${LIVE_VERB[e.type] || 'touched'} ${r.name}`, 'live', `${Math.max(1, Math.round((Date.now() / 1000 - e.t) / 60))} min ago`);
  setText($('live-n'), `${LIVE.n} since built`);
}
function startLive() {
  if (LIVE.on || !window.CC || !/^https?:/.test(location.protocol)) return;
  LIVE.on = true;
  $('livebadge').hidden = false;
  pollLive();
  LIVE.timer = setInterval(pollLive, 60_000);
  setInterval(dripLive, 1400);
}

// ───────────────────────────────────────────────────────────── URL state (deep links / screenshots)
function parseHash() {
  const q = new URLSearchParams(location.hash.slice(1));
  const out = {};
  if (q.has('t')) {
    const v = q.get('t');
    if (v === 'end') out.t = T_END;
    else { const d = new Date(v.length <= 10 ? v + 'T12:00:00Z' : v + ':00Z'); if (!isNaN(d)) out.t = localToT(d.getTime()); }
  }
  if (q.has('speed')) { const k = SPEEDS.findIndex(s => s.k === q.get('speed')); if (k >= 0) out.speed = k; }
  if (q.has('play')) out.play = q.get('play') !== '0';
  if (q.has('focus')) out.focus = R.findIndex(r => r.name.toLowerCase() === q.get('focus').toLowerCase());
  if (q.has('hud')) out.hud = q.get('hud') !== '0';
  if (q.has('orbit')) out.orbit = q.get('orbit') !== '0';
  if (q.has('cam')) { const a = q.get('cam').split(',').map(Number); if (a.length === 6 && a.every(isFinite)) out.cam = a; }
  if (q.has('lens')) out.lens = !['0', 'off', ''].includes(q.get('lens'));
  out.embed = q.get('embed') === '1';
  return out;
}

// ───────────────────────────────────────────────────────────── main loop
let lastFrame = performance.now(), lastSlow = 0, lastBoard = 0, fpsAcc = 0, fpsN = 0, lowFpsFor = 0;
function loop(now) { requestAnimationFrame(loop); frame(now); }
function frame(now, logicOnly = false) {
  const dt = clamp((now - lastFrame) / 1000, 0, 0.1);
  lastFrame = now;
  NOW = now / 1000;
  TIME.value = NOW;
  const target = recSpeed ?? SPEEDS[speedIdx].v;
  curSpeed += (target - curSpeed) * (1 - Math.exp(-dt * 3.5));
  if (scrubTo !== null) { seek(scrubTo, 0.2); scrubTo = null; }
  if (playing && !scrubbing) {
    advance(T + curSpeed * dt);
    if (T >= T_END) setPlaying(false);
  }
  updateAnimations();
  updatePulses();
  updateWaves();
  updateRepoVisuals(dt);
  // avatar: float, face the camera, react to commits
  avatarKick *= Math.exp(-dt * 5);
  avatar.position.y = AY + Math.sin(NOW * 1.1) * 0.35;
  const yaw = Math.atan2(camera.position.x - avatar.position.x, camera.position.z - avatar.position.z);
  let dy = yaw - avatarSpin.rotation.y;
  dy = Math.atan2(Math.sin(dy), Math.cos(dy));
  avatarSpin.rotation.y += dy * (1 - Math.exp(-dt * 2.5));
  avatarSpin.rotation.z = Math.sin(NOW * 0.7) * 0.05;
  avatarSpin.rotation.x = Math.sin(NOW * 0.9) * 0.04;
  avatarSpin.scale.setScalar(1 + avatarKick * 0.05);
  rimMat.color.setRGB(0.5 + avatarKick * 1.6, 1.6 + avatarKick * 1.8, 2.2 + avatarKick * 1.6);
  for (const o of orbitRings) o.m.rotation.z += o.spd * dt * (1 + avatarKick * 3);
  halo.rotation.y += dt * (0.08 + avatarKick * 0.6);
  aura.material.uniforms.uScale.value = halo.material.uniforms.uScale.value;
  dayNight();
  updateFly();
  controls.update(dt);
  doPick();
  try {
    updateHUD();
    if (NOW - lastSlow > 0.12) { lastSlow = NOW; updateLabels(); drawTicker(); }
    if (NOW - lastBoard > 0.3) { lastBoard = NOW; updateBoard(); updateFocus(); updateWho(); }
    drawTimeline();
  } catch (err) { if (!frame.warned) { frame.warned = true; console.error(err); } }
  if (logicOnly) return;
  composer.render();
  labelRenderer.render(scene, camera);
  if (rec) drawRecFrame();
  if (!LIVE.on && T >= T_END - 1e-6) startLive();
  // adaptive quality: drop bloom / pixel ratio if the machine can't keep up
  fpsAcc += dt; fpsN++;
  if (fpsAcc > 2) {
    const fps = fpsN / fpsAcc; fpsAcc = 0; fpsN = 0;
    if (quality === 'high' && fps < 28 && !rec) { lowFpsFor++; if (lowFpsFor >= 2) setQuality('low'); } else lowFpsFor = 0;
  }
}

const init = parseHash();
setSpeed(init.speed ?? 3);
curSpeed = SPEEDS[speedIdx].v;
onResize();
seek(init.t ?? 0, 0);
updateAnimations();
if (init.hud === false) document.body.classList.add('bare');
if (init.orbit === false) controls.autoRotate = false;
syncOrbitBtn();
el.labels.classList.toggle('on', labelsOn);
if (init.cam) { camera.position.set(init.cam[0], init.cam[1], init.cam[2]); controls.target.set(init.cam[3], init.cam[4], init.cam[5]); }
if (init.focus >= 0) { focusRepo(init.focus); if (fly) fly.dur = 0.001; }
if (init.lens) setLens(true, true);
if (init.embed) {
  // inside someone else's page the wheel scrolls that page until the city is clicked
  controls.enableZoom = false;
  renderer.domElement.addEventListener('pointerdown', () => { controls.enableZoom = true; }, { once: true });
  const a = $('embed-link');
  if (a) { a.href = `${location.origin}${location.pathname}${location.search}`; a.textContent = `commit.city/${TARGET} ↗`; }
}
setPlaying(init.play ?? true);
el.loading.classList.add('done');
setTimeout(() => el.loading.remove(), 900);
requestAnimationFrame(loop);
function step(seconds, render = false) {      // deterministic frames for the self-test (render: draw them too)
  let t = Math.max(performance.now(), lastFrame);
  for (let k = 0; k < Math.max(1, Math.round(seconds * 60)); k++) { t += 1000 / 60; frame(t, !render); }
}
window.__lapse = { step, R, seek, advance, get T() { return T; }, get playing() { return playing; }, focusRepo, camera, controls, T_END, EPOCH,
  get lens() { return lens; }, setLens, WHO, whoSoFar, record, stopRecord, recMime, toggleRecPanel, get recording() { return !!rec; }, LIVE,
  get recInfo() { return rec ? { end: rec.end, state: rec.mr.state, T } : null; }, get recCanvas() { return rec ? rec.g.canvas : null; } };
if (/(^|&)selftest=1/.test(location.hash.slice(1))) import('./selftest.js').then(m => m.run(window.__lapse));
