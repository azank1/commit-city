// commit.city/events: GitHub's public timeline landing as a city, live. Every repo that shows up takes the next
// free lot on a spiral out from the centre; every event drops in as a beam of light and stacks one block on
// that repo's tower, coloured by what it was (or by who sent it). Quiet repos sink away after a few minutes,
// so the city is always the last stretch of GitHub. Data: /api/live (the public events API, compacted).
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';
import { CSS2DRenderer, CSS2DObject } from 'three/addons/renderers/CSS2DRenderer.js';
import * as SH from './shaders.js';

const $ = id => document.getElementById(id);
const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
const easeOut = t => 1 - Math.pow(1 - t, 3);
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const fmt = n => Math.round(n).toLocaleString('en-US');
const HASH = new URLSearchParams(location.hash.slice(1));
const DEMO = HASH.get('demo') === '1' || HASH.get('selftest') === '1';

// ───────────────────────────────────────────────────────────── what events look like
const CLASSES = [
  { k: 'push', label: 'Pushes', hex: '#5fd3f3' },
  { k: 'pr', label: 'Pull requests', hex: '#a78bfa' },
  { k: 'issue', label: 'Issues', hex: '#fb923c' },
  { k: 'star', label: 'Stars', hex: '#ffd479' },
  { k: 'fork', label: 'Forks', hex: '#4ade80' },
  { k: 'release', label: 'Releases', hex: '#f472b6' },
  { k: 'create', label: 'New repos & branches', hex: '#cbd5e1' },
];
const CLASS_OF = { push: 0, pr: 1, merge: 1, review: 1, issue: 2, comment: 2, star: 3, fork: 4, release: 5, create: 6, delete: 6, public: 6 };
const WHO_HEX = { human: '#5fd3f3', bot: '#ffb454', agent: '#c58bff' };
const whoKind = w => (!w ? 'human' : w === 'bot' ? 'bot' : 'agent');
const VERB = {
  push: 'pushed to', pr: 'opened a pull request in', merge: 'merged a pull request in', review: 'reviewed a pull request in', issue: 'opened an issue in',
  comment: 'commented in', star: 'starred', fork: 'forked', release: 'published a release of', create: 'created', delete: 'deleted a branch in', public: 'open-sourced',
};
const verbOf = e => {
  const a = e.act;
  if (e.type === 'pr') return a === 'opened' || a === 'reopened' ? 'opened a pull request in' : a === 'closed' ? 'closed a pull request in' : 'updated a pull request in';
  if (e.type === 'issue') return a === 'opened' || a === 'reopened' ? 'opened an issue in' : a === 'closed' ? 'closed an issue in' : 'updated an issue in';
  if (e.type === 'create') return e.rt === 'repository' ? 'created' : e.rt === 'tag' ? 'tagged' : 'branched';
  return VERB[e.type] || 'touched';
};
const linear = hex => new THREE.Color(hex);
const CLASS_COL = CLASSES.map(c => linear(c.hex));
const WHO_COL = { human: linear(WHO_HEX.human), bot: linear(WHO_HEX.bot), agent: linear(WHO_HEX.agent) };
const OFF_COL = linear('#1b2333');

// ───────────────────────────────────────────────────────────── renderer / scene
const stage = $('stage');
const renderer = new THREE.WebGLRenderer({ antialias: false, powerPreference: 'high-performance' });
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
camera.position.set(0, 40, 66);
const controls = new OrbitControls(camera, renderer.domElement);
controls.target.set(0, 4, 0);
controls.enableDamping = true;
controls.dampingFactor = 0.07;
controls.screenSpacePanning = true;
controls.minDistance = 6;
controls.maxDistance = 260;
controls.maxPolarAngle = Math.PI * 0.48;
controls.autoRotate = true;
controls.autoRotateSpeed = 0.35;
const HOME = { pos: camera.position.clone(), target: controls.target.clone() };

const rtSize = new THREE.Vector2();
renderer.getDrawingBufferSize(rtSize);
const rt = new THREE.WebGLRenderTarget(rtSize.x, rtSize.y, { type: THREE.HalfFloatType, samples: 4 });
const composer = new EffectComposer(renderer, rt);
composer.addPass(new RenderPass(scene, camera));
const bloom = new UnrealBloomPass(new THREE.Vector2(stage.clientWidth, stage.clientHeight), 0.7, 0.45, 0.95);
composer.addPass(bloom);
composer.addPass(new OutputPass());

const ENV = {
  uSky: { value: new THREE.Color(0.3, 0.36, 0.5) },
  uGround: { value: new THREE.Color(0.05, 0.05, 0.07) },
  uKeyDir: { value: new THREE.Vector3(0.45, 0.8, 0.35).normalize() },
  uKeyCol: { value: new THREE.Color(0.8, 0.8, 0.82) },
  uFog: { value: new THREE.Color(0.015, 0.022, 0.045) },
  uFogDen: { value: 1 / 260 },
};
const TIME = { value: 0 };
scene.add(new THREE.Mesh(new THREE.SphereGeometry(4000, 32, 16), new THREE.ShaderMaterial({
  side: THREE.BackSide, depthWrite: false, vertexShader: SH.skyVS, fragmentShader: SH.skyFS,
  uniforms: { uTop: { value: new THREE.Color(0.008, 0.014, 0.038) }, uHorizon: { value: new THREE.Color(0.028, 0.042, 0.085) }, uBottom: { value: new THREE.Color(0.004, 0.006, 0.012) } },
})));
{
  const n = 2200, p = new Float32Array(n * 3), sz = new Float32Array(n), ph = new Float32Array(n);
  for (let i = 0; i < n; i++) {
    const u = Math.random(), th = Math.random() * Math.PI * 2, y = u * 0.92 + 0.05;
    const rr = Math.sqrt(1 - y * y), d = 2600 + Math.random() * 900;
    p[i * 3] = Math.cos(th) * rr * d; p[i * 3 + 1] = y * d; p[i * 3 + 2] = Math.sin(th) * rr * d;
    sz[i] = 1 + Math.pow(Math.random(), 6) * 3; ph[i] = Math.random();
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.BufferAttribute(p, 3));
  g.setAttribute('aSize', new THREE.BufferAttribute(sz, 1));
  g.setAttribute('aPhase', new THREE.BufferAttribute(ph, 1));
  scene.add(new THREE.Points(g, new THREE.ShaderMaterial({
    transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
    uniforms: { uTime: TIME, uNight: { value: 1 } }, vertexShader: SH.starsVS, fragmentShader: SH.starsFS,
  })));
}
const floor = new THREE.Mesh(new THREE.PlaneGeometry(400, 400), new THREE.ShaderMaterial({
  transparent: true, depthWrite: false, vertexShader: SH.floorVS, fragmentShader: SH.floorFS,
  uniforms: { uCol: { value: new THREE.Color(0.25, 0.55, 0.8) }, uFade: { value: 150 } },
}));
floor.rotation.x = -Math.PI / 2;
floor.position.y = -0.02;
scene.add(floor);

// ───────────────────────────────────────────────────────────── lots and towers
const CELL = 1.42, FOOT = 0.9, SEG = 0.34, MAXSEG = 56, MAXREPO = 640;
const IDLE_S = 9 * 60;          // a repo with no events for this long sinks away
const LOTS = (() => {           // grid cells by distance from the centre, a touch of noise for a ragged edge
  const out = [];
  const R = 34;
  for (let i = -R; i <= R; i++) for (let j = -R; j <= R; j++) {
    const h = Math.sin(i * 12.9898 + j * 78.233) * 43758.5453;
    const d = Math.hypot(i, j) + (h - Math.floor(h)) * 1.6;
    if (d <= R) out.push({ i, j, d, used: false });
  }
  return out.sort((a, b) => a.d - b.d);
})();

const boxGeo = new THREE.BoxGeometry(1, 1, 1);
boxGeo.translate(0, 0.5, 0);
const mkGeo = n => {
  const g = boxGeo.clone();
  const a = new THREE.InstancedBufferAttribute(new Float32Array(n), 1);
  a.setUsage(THREE.DynamicDrawUsage);
  g.setAttribute('aGlow', a);
  return g;
};
const solidMat = over => new THREE.ShaderMaterial({
  vertexShader: SH.solidVS, fragmentShader: SH.solidFS,
  uniforms: { ...ENV, uSat: { value: 1 }, uBright: { value: 1 }, uEdge: { value: 0.55 }, uEdgeTint: { value: new THREE.Color(0.015, 0.02, 0.03) },
    uAO: { value: 0.3 }, uRim: { value: 0 }, uRimCol: { value: new THREE.Color(0.25, 0.95, 1.5) }, ...over },
});
const NSEG = MAXREPO * MAXSEG;
const segs = new THREE.InstancedMesh(mkGeo(NSEG), solidMat({}), NSEG);
segs.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
segs.frustumCulled = false;
const plinth = new THREE.InstancedMesh(mkGeo(MAXREPO), solidMat({ uEdge: { value: 0.8 }, uAO: { value: 0 }, uEdgeTint: { value: new THREE.Color(0.03, 0.05, 0.08) } }), MAXREPO);
plinth.frustumCulled = false;
const HIDDEN = new THREE.Matrix4().compose(new THREE.Vector3(0, -5000, 0), new THREE.Quaternion(), new THREE.Vector3(1e-5, 1e-5, 1e-5));
const tmpC = new THREE.Color(), M = new THREE.Matrix4(), V = new THREE.Vector3(), Q = new THREE.Quaternion(), S = new THREE.Vector3();
for (let i = 0; i < NSEG; i++) { segs.setMatrixAt(i, HIDDEN); segs.setColorAt(i, tmpC.set(0, 0, 0)); }
for (let i = 0; i < MAXREPO; i++) { plinth.setMatrixAt(i, HIDDEN); plinth.setColorAt(i, tmpC.set('#0e1522')); }
scene.add(segs, plinth);

const repos = new Map();                  // name -> repo
const slots = new Array(MAXREPO).fill(null);
let lens = 'type';                        // 'type' | 'who'
const off = new Set();                    // event classes switched off
let NOW = 0;                              // seconds, page clock
const dirty = new Set();                  // repos whose blocks need rewriting this frame

function colourOf(s) {
  if (off.has(s.c)) return OFF_COL;
  return lens === 'who' ? WHO_COL[whoKind(s.w)] : CLASS_COL[s.c];
}
function newRepo(name) {
  if (repos.size >= MAXREPO) {
    let old = null;
    for (const r of repos.values()) if (!r.dying && (!old || r.last < old.last)) old = r;
    if (old) drop(old, true);
  }
  const slot = slots.indexOf(null);
  const lot = LOTS.find(l => !l.used);
  if (slot < 0 || !lot) return null;
  lot.used = true;
  const r = { name, slot, lot, x: lot.i * CELL, z: lot.j * CELL, segs: [], total: 0, last: NOW, born: NOW, popT: -1e9, glow: 0, sink: 1, dying: false,
    recent: [], times: [], byClass: new Array(CLASSES.length).fill(0), agent: 0 };
  slots[slot] = r;
  repos.set(name, r);
  M.compose(V.set(r.x, -0.12, r.z), Q, S.set(CELL * 0.96, 0.24, CELL * 0.96));
  plinth.setMatrixAt(slot, M);
  plinth.instanceMatrix.needsUpdate = true;
  return r;
}
function drop(r, now = false) {
  if (now) {
    for (let k = 0; k < MAXSEG; k++) segs.setMatrixAt(r.slot * MAXSEG + k, HIDDEN);
    plinth.setMatrixAt(r.slot, HIDDEN);
    segs.instanceMatrix.needsUpdate = plinth.instanceMatrix.needsUpdate = true;
    slots[r.slot] = null; r.lot.used = false; repos.delete(r.name);
    if (focus === r) unfocus();
    return;
  }
  r.dying = true; r.dieT = NOW;
}
function writeRepo(r) {
  const base = r.slot * MAXSEG, n = r.segs.length;
  const pop = easeOut(clamp((NOW - r.popT) / 0.35, 0, 1));
  const gl = segs.geometry.attributes.aGlow;
  for (let k = 0; k < MAXSEG; k++) {
    if (k >= n) { segs.setMatrixAt(base + k, HIDDEN); continue; }
    const top = k === n - 1;
    const h = SEG * (top ? pop : 1) * r.sink;
    M.compose(V.set(r.x, k * SEG * r.sink, r.z), Q, S.set(FOOT, Math.max(0.001, h * 0.94), FOOT));
    segs.setMatrixAt(base + k, M);
    segs.setColorAt(base + k, colourOf(r.segs[k]));
    gl.array[base + k] = top ? r.glow : 0;
  }
  segs.instanceMatrix.needsUpdate = true;
  segs.instanceColor.needsUpdate = true;
  gl.needsUpdate = true;
}
function recolourAll() { for (const r of repos.values()) dirty.add(r); }

// ───────────────────────────────────────────────────────────── beams falling in
const MAXP = 420, TRAIL = 8;
const pGeo = new THREE.BufferGeometry();
const pPos = new Float32Array(MAXP * TRAIL * 3), pSize = new Float32Array(MAXP * TRAIL), pAlpha = new Float32Array(MAXP * TRAIL), pCol = new Float32Array(MAXP * TRAIL * 3);
pGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3).setUsage(THREE.DynamicDrawUsage));
pGeo.setAttribute('aSize', new THREE.BufferAttribute(pSize, 1).setUsage(THREE.DynamicDrawUsage));
pGeo.setAttribute('aAlpha', new THREE.BufferAttribute(pAlpha, 1).setUsage(THREE.DynamicDrawUsage));
pGeo.setAttribute('aColor', new THREE.BufferAttribute(pCol, 3).setUsage(THREE.DynamicDrawUsage));
const pScale = { value: 600 };
const pts = new THREE.Points(pGeo, new THREE.ShaderMaterial({ transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
  uniforms: { uScale: pScale }, vertexShader: SH.pointsVS, fragmentShader: SH.pointsFS }));
pts.frustumCulled = false;
scene.add(pts);
const beams = [];
const waves = [];
{
  const g = new THREE.RingGeometry(0.9, 1, 64);
  g.rotateX(-Math.PI / 2);
  for (let k = 0; k < 48; k++) {
    const m = new THREE.Mesh(g, new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false }));
    m.visible = false; scene.add(m); waves.push({ m, t0: -1e9 });
  }
}
let waveIdx = 0;

function launch(e, r) {
  const col = off.has(e.c) ? OFF_COL : lens === 'who' ? WHO_COL[whoKind(e.who)] : CLASS_COL[e.c];
  const dur = 0.75 + Math.random() * 0.35;
  const b = { e, r, t0: NOW, dur, h0: 46 + Math.random() * 26, dx: (Math.random() - 0.5) * 6, dz: (Math.random() - 0.5) * 6, col };
  if (beams.length >= MAXP || off.has(e.c)) { land(b); return; }
  beams.push(b);
}
function land(b) {
  const { e, r } = b;
  if (!repos.has(r.name)) return;
  r.segs.push({ c: e.c, w: e.who });
  if (r.segs.length > MAXSEG) r.segs.splice(0, r.segs.length - MAXSEG);
  r.popT = NOW; r.glow = 1.1; r.last = NOW; r.sink = 1; r.dying = false;
  dirty.add(r);
  if (!off.has(e.c)) {
    const w = waves[waveIdx++ % waves.length];
    w.t0 = NOW; w.m.visible = true; w.m.position.set(r.x, r.segs.length * SEG + 0.05, r.z);
    w.m.material.color.copy(b.col).multiplyScalar(1.6);
    shown(e, r);
  }
}
function updateBeams() {
  let w = 0;
  for (const b of beams) { if (NOW - b.t0 >= b.dur) land(b); else beams[w++] = b; }
  beams.length = w;
  pAlpha.fill(0);
  for (let k = 0; k < beams.length; k++) {
    const b = beams[k], u = clamp((NOW - b.t0) / b.dur, 0, 1);
    const topY = b.r.segs.length * SEG;
    for (let j = 0; j < TRAIL; j++) {
      const uj = u - j * 0.035;
      const o = k * TRAIL + j;
      if (uj < 0) continue;
      const f = uj * uj;                       // falling: slow, then fast
      pPos[o * 3] = b.r.x + b.dx * (1 - f); pPos[o * 3 + 1] = b.h0 + (topY - b.h0) * f; pPos[o * 3 + 2] = b.r.z + b.dz * (1 - f);
      const fall = 1 - j / TRAIL;
      pSize[o] = j === 0 ? 1.25 : 0.8 * fall;
      pAlpha[o] = j === 0 ? 1 : 0.5 * fall * fall;
      pCol[o * 3] = b.col.r * 2.2 + (j === 0) * 0.8; pCol[o * 3 + 1] = b.col.g * 2.2 + (j === 0) * 0.8; pCol[o * 3 + 2] = b.col.b * 2.2 + (j === 0) * 0.8;
    }
  }
  for (const n of ['position', 'aSize', 'aAlpha', 'aColor']) pGeo.attributes[n].needsUpdate = true;
  for (const wv of waves) {
    if (!wv.m.visible) continue;
    const u = (NOW - wv.t0) / 0.8;
    if (u >= 1) { wv.m.visible = false; continue; }
    wv.m.scale.setScalar(0.4 + 2.2 * easeOut(u));
    wv.m.material.opacity = 0.9 * (1 - u) * (1 - u);
  }
}

// ───────────────────────────────────────────────────────────── the feed: queue, pacing, stats
const queue = [];
const seenIds = new Set();
const actors = new Set();
const who = { human: 0, bot: 0, agent: 0 };
const agentsSeen = new Map();             // id -> count
let AGENTS = {};                          // id -> { label, color } from the server
const classCount = new Array(CLASSES.length).fill(0);
const landed = [];                        // page-clock times of the last minute's events
let lastShownT = 0, booting = true, paused = false;

function ingest(list) {
  const fresh = [];
  for (const e of list) {
    if (seenIds.has(e.id)) continue;
    seenIds.add(e.id);
    e.c = CLASS_OF[e.type] ?? 6;
    fresh.push(e);
  }
  if (seenIds.size > 20000) { const keep = [...seenIds].slice(-8000); seenIds.clear(); keep.forEach(i => seenIds.add(i)); }
  fresh.sort((a, b) => a.t - b.t || (a.id < b.id ? -1 : 1));
  queue.push(...fresh);
  if (queue.length > 1500) queue.splice(0, queue.length - 1500);
  return fresh.length;
}
let releaseAcc = 0;
function pace(dt) {
  if (paused || !queue.length) return;
  // drip at a rate that drains what we have over ~25 s (GitHub hands us batches, not a stream); boot fast
  const rate = booting ? 45 : clamp(queue.length / 25, 0.6, 30);
  releaseAcc += rate * dt;
  while (releaseAcc >= 1 && queue.length) {
    releaseAcc -= 1;
    release(queue.shift());
  }
  if (booting && (queue.length < 20 || repos.size > 140)) booting = false;
}
function release(e) {
  let r = repos.get(e.repo);
  if (!r) r = newRepo(e.repo);
  if (!r) return;
  r.total++; r.byClass[e.c]++; r.times.push(NOW);
  if (e.who && e.who !== 'bot') r.agent++;
  r.recent.unshift(e); if (r.recent.length > 14) r.recent.length = 14;
  actors.add(e.aid || e.actor);
  who[whoKind(e.who)]++;
  if (e.who && e.who !== 'bot') agentsSeen.set(e.who, (agentsSeen.get(e.who) || 0) + 1);
  classCount[e.c]++;
  landed.push(NOW);
  lastShownT = Math.max(lastShownT, e.t);
  launch(e, r);
}

// ───────────────────────────────────────────────────────────── DOM: ticker, stats, hot list, focus card
const feed = $('feed');
const rowsQ = [];
function shown(e, r) {
  if (rowsQ.length > 40) rowsQ.shift();
  rowsQ.push([e, r]);
}
function flushRows() {
  if (!rowsQ.length) return;
  const frag = document.createDocumentFragment();
  for (const [e] of rowsQ.splice(0, rowsQ.length).slice(-12)) {
    const li = document.createElement('li');
    const kind = whoKind(e.who);
    const tag = kind === 'human' ? '' : `<span class="wh" style="color:${kind === 'bot' ? WHO_HEX.bot : (AGENTS[e.who]?.color || WHO_HEX.agent)};border-color:currentColor">${esc(kind === 'bot' ? 'bot' : AGENTS[e.who]?.label || e.whoLabel || e.who)}</span>`;
    const extra = e.type === 'release' && e.tag ? ` <b>${esc(e.tag)}</b>` : e.n ? ` <span class="dim">#${e.n}</span>` : '';
    li.innerHTML = `<img src="https://avatars.githubusercontent.com/u/${encodeURIComponent(e.aid || 0)}?s=52" alt="" loading="lazy">
      <div><div class="l1"><b>${esc(e.actor)}</b> ${verbOf(e)} <b>${esc(e.repo)}</b>${extra}</div>
      <div class="l2"><span class="ty"><i style="background:${CLASSES[e.c].hex}"></i>${CLASSES[e.c].label.replace(/s$/, '').replace('New repos & branche', 'create')}</span>${tag}<span>${ago(e.t)}</span></div></div>`;
    li.dataset.repo = e.repo;
    frag.prepend(li);
  }
  feed.prepend(frag);
  while (feed.children.length > 60) feed.lastElementChild.remove();
}
feed.addEventListener('click', ev => { const li = ev.target.closest('li'); if (li) { const r = repos.get(li.dataset.repo); if (r) focusRepo(r); } });
function ago(t) {
  const s = Math.max(0, Date.now() / 1000 - t);
  return s < 90 ? `${Math.round(s)}s ago` : `${Math.round(s / 60)} min ago`;
}
const setText = (el, v) => { const s = String(v); if (el && el.textContent !== s) el.textContent = s; };
const typeBtns = [];
{
  const box = $('types');
  CLASSES.forEach((c, i) => {
    const b = document.createElement('button');
    b.setAttribute('aria-pressed', 'true');
    b.title = `Show or hide ${c.label.toLowerCase()}`;
    b.innerHTML = `<i style="background:${c.hex}"></i><span>${c.label}</span><b>0</b>`;
    b.onclick = () => { if (off.has(i)) off.delete(i); else off.add(i); b.setAttribute('aria-pressed', String(!off.has(i))); recolourAll(); };
    box.appendChild(b);
    typeBtns.push(b);
  });
}
function updateStats() {
  while (landed.length && NOW - landed[0] > 60) landed.shift();
  const span = Math.min(60, NOW - (startedAt || NOW));
  setText($('n-rate'), fmt(span > 5 ? landed.length * 60 / Math.max(span, 1) : landed.length));
  setText($('n-repos'), fmt([...repos.values()].filter(r => !r.dying).length));
  setText($('n-people'), fmt(actors.size));
  const tot = who.human + who.bot + who.agent || 1;
  const sp = $('split').children;
  sp[0].style.flexGrow = who.human; sp[1].style.flexGrow = who.bot; sp[2].style.flexGrow = who.agent;
  setText($('p-h'), `${Math.round(100 * who.human / tot)}%`); setText($('p-b'), `${Math.round(100 * who.bot / tot)}%`);
  setText($('p-a'), who.agent && who.agent / tot < 0.01 ? '<1%' : `${Math.round(100 * who.agent / tot)}%`);
  if (agentsSeen.size) {
    const list = [...agentsSeen].sort((a, b) => b[1] - a[1]).slice(0, 6);
    const html = list.map(([id, n]) => `<span><i style="background:${AGENTS[id]?.color || WHO_HEX.agent}"></i>${esc(AGENTS[id]?.label || id)}<b>${n}</b></span>`).join('');
    if ($('seen').dataset.h !== html) { $('seen').innerHTML = html; $('seen').dataset.h = html; }
  }
  classCount.forEach((n, i) => setText(typeBtns[i].querySelector('b'), n >= 1000 ? `${(n / 1000).toFixed(1)}k` : n));
  setText($('feedn'), `${fmt(seenIds.size)} seen`);
  if (lastShownT) setText($('lag'), `≈ ${Math.max(1, Math.round((Date.now() / 1000 - lastShownT) / 60))} min behind`);
  // busiest right now
  const hot = [...repos.values()].map(r => { while (r.times.length && NOW - r.times[0] > 600) r.times.shift(); return [r, r.times.length]; })
    .filter(x => x[1] > 1).sort((a, b) => b[1] - a[1]).slice(0, 6);
  const html = hot.map(([r, n], i) => `<li data-repo="${esc(r.name)}"><span class="rk">${i + 1}</span><span class="nm">${esc(r.name)}</span><span class="ct">${n}</span></li>`).join('');
  if ($('hot').dataset.h !== html) { $('hot').innerHTML = html || '<li class="dim" style="cursor:default">warming up…</li>'; $('hot').dataset.h = html; }
  if (focus) cardBody(focus);
}
$('hot').addEventListener('click', ev => { const li = ev.target.closest('li[data-repo]'); if (li) { const r = repos.get(li.dataset.repo); if (r) focusRepo(r); } });

// labels over the busiest towers
const TAGS = Array.from({ length: 9 }, () => {
  const el = document.createElement('div');
  el.className = 'repo-tag';
  const o = new CSS2DObject(el);
  o.visible = false;
  el.addEventListener('click', () => { if (o.userData.r) focusRepo(o.userData.r); });
  scene.add(o);
  return o;
});
let labelsOn = true;
function updateTags() {
  const top = [...repos.values()].filter(r => !r.dying && r.times.length > 1).sort((a, b) => b.times.length - a.times.length).slice(0, labelsOn ? TAGS.length : 0);
  TAGS.forEach((o, i) => {
    const r = top[i];
    o.visible = !!r;
    if (!r) return;
    o.userData.r = r;
    o.position.set(r.x, r.segs.length * SEG + 1.1, r.z);
    const html = `${esc(r.name.length > 34 ? r.name.slice(0, 33) + '…' : r.name)} <b>${r.times.length}</b>`;
    if (o.element.dataset.h !== html) { o.element.innerHTML = html; o.element.dataset.h = html; }
    o.element.classList.toggle('agent', r.agent > 0);
  });
}

// focus card
let focus = null;
const card = $('card');
function cardBody(r) {
  const [owner, name] = r.name.split('/');
  const cts = r.byClass.map((n, i) => (n ? `<span><i style="background:${CLASSES[i].hex}"></i>${n} ${CLASSES[i].label.toLowerCase()}</span>` : '')).join('');
  const html = `<div class="hd"><img src="https://github.com/${encodeURIComponent(owner)}.png?size=80" alt=""><div><div class="ow">${esc(owner)}</div><div class="nm">${esc(name)}</div></div>
    <button class="x" id="card-x" aria-label="Close">×</button></div>
    <div class="cts">${cts}</div>
    <ul>${r.recent.map(e => `<li><img src="https://avatars.githubusercontent.com/u/${encodeURIComponent(e.aid || 0)}?s=40" alt=""><span><b>${esc(e.actor)}</b> ${verbOf(e).replace(/ (in|to|of)$/, '')}</span><small>${ago(e.t)}</small></li>`).join('')}</ul>
    <div class="acts"><a class="btn sm primary" href="/${esc(r.name)}">Build its city →</a><a class="btn sm" href="https://github.com/${esc(r.name)}" target="_blank" rel="noopener">GitHub ↗</a></div>`;
  if (card.dataset.h !== html) { card.innerHTML = html; card.dataset.h = html; $('card-x').onclick = unfocus; }
}
let fly = null;
function flyTo(pos, target, dur = 1.1) { fly = { p0: camera.position.clone(), t0v: controls.target.clone(), p1: pos, t1: target, s: NOW, dur }; }
function focusRepo(r) {
  focus = r;
  cardBody(r);
  card.hidden = false;
  controls.autoRotate = false; syncTools();
  const t = new THREE.Vector3(r.x, r.segs.length * SEG * 0.5, r.z);
  const dir = camera.position.clone().sub(controls.target).normalize();
  flyTo(t.clone().add(dir.multiplyScalar(22 + r.segs.length * SEG)), t);
}
function unfocus() { focus = null; card.hidden = true; card.dataset.h = ''; }

// picking + tooltip
const ray = new THREE.Raycaster();
const mouse = new THREE.Vector2();
const tip = $('tip');
let hover = null, downAt = null;
function pickAt(cx, cy) {
  const rect = renderer.domElement.getBoundingClientRect();
  mouse.set(((cx - rect.left) / rect.width) * 2 - 1, -((cy - rect.top) / rect.height) * 2 + 1);
  ray.setFromCamera(mouse, camera);
  const hit = ray.intersectObjects([segs, plinth], false)[0];
  if (!hit || hit.instanceId == null) return null;
  return slots[hit.object === segs ? Math.floor(hit.instanceId / MAXSEG) : hit.instanceId];
}
renderer.domElement.addEventListener('pointermove', e => {
  if (e.buttons) { tip.hidden = true; return; }
  const r = pickAt(e.clientX, e.clientY);
  hover = r;
  renderer.domElement.style.cursor = r ? 'pointer' : '';
  if (!r) { tip.hidden = true; return; }
  const last = r.recent[0];
  tip.innerHTML = `<b>${esc(r.name)}</b>${r.total} event${r.total === 1 ? '' : 's'} so far${last ? ` · last: ${esc(last.actor)} ${verbOf(last).replace(/ (in|to|of)$/, '')}` : ''}`;
  tip.hidden = false;
  tip.style.left = `${Math.min(innerWidth - 310, e.clientX + 14)}px`; tip.style.top = `${e.clientY + 14}px`;
});
renderer.domElement.addEventListener('pointerleave', () => { tip.hidden = true; hover = null; });
renderer.domElement.addEventListener('pointerdown', e => { downAt = [e.clientX, e.clientY]; });
renderer.domElement.addEventListener('pointerup', e => {
  if (!downAt || Math.hypot(e.clientX - downAt[0], e.clientY - downAt[1]) > 5) return;
  const r = pickAt(e.clientX, e.clientY);
  if (r) focusRepo(r); else if (focus) unfocus();
});
controls.addEventListener('start', () => { fly = null; });

// tools
function syncTools() {
  $('t-orbit').classList.toggle('on', controls.autoRotate);
  $('t-labels').classList.toggle('on', labelsOn);
  $('by-type').setAttribute('aria-pressed', String(lens === 'type'));
  $('by-who').setAttribute('aria-pressed', String(lens === 'who'));
  $('play').textContent = paused ? '▶' : '❚❚';
  $('play').setAttribute('aria-label', paused ? 'Resume' : 'Pause');
}
const setLens = l => { lens = l; recolourAll(); syncTools(); };
$('by-type').onclick = () => setLens('type');
$('by-who').onclick = () => setLens('who');
$('t-orbit').onclick = () => { controls.autoRotate = !controls.autoRotate; syncTools(); };
$('t-labels').onclick = () => { labelsOn = !labelsOn; syncTools(); updateTags(); };
$('t-ui').onclick = () => document.body.classList.add('ui-off');
$('unhide').onclick = () => document.body.classList.remove('ui-off');
$('play').onclick = () => { paused = !paused; syncTools(); };
addEventListener('keydown', e => {
  if (e.target.closest && e.target.closest('input, textarea, select')) return;
  const k = e.key.toLowerCase();
  if (e.key === ' ') { e.preventDefault(); paused = !paused; syncTools(); }
  else if (k === 'a') setLens(lens === 'who' ? 'type' : 'who');
  else if (k === 'l') { labelsOn = !labelsOn; syncTools(); updateTags(); }
  else if (k === 'o') { controls.autoRotate = !controls.autoRotate; syncTools(); }
  else if (k === 'h') document.body.classList.toggle('ui-off');
  else if (e.key === 'Escape') { unfocus(); flyTo(HOME.pos.clone(), HOME.target.clone()); }
});
if (HASH.get('lens') === 'who' || HASH.get('lens') === 'agents') lens = 'who';
syncTools();

// ───────────────────────────────────────────────────────────── network
let startedAt = 0, failures = 0;
async function poll() {
  if (DEMO) return;
  try {
    const r = await fetch('/api/live');
    if (!r.ok) throw new Error(`HTTP ${r.status}`);
    const d = await r.json();
    if (d.agents) AGENTS = d.agents;
    ingest(d.events || []);
    failures = 0;
    $('err').hidden = true;
    ready();
  } catch (err) {
    failures++;
    if (failures >= 2 && !repos.size) { $('err').hidden = false; $('boot').classList.add('done'); }
  }
}
function ready() {
  if (startedAt) return;
  startedAt = NOW;
  $('boot').classList.add('done');
}
// demo feed: plausible synthetic events, for offline development and the self-test
const DEMO_REPOS = Array.from({ length: 160 }, (_, i) => `${['acme', 'octo', 'nova', 'pixel', 'delta', 'orbit', 'lumen', 'kite'][i % 8]}/${['api', 'web', 'cli', 'docs', 'infra', 'app', 'sdk', 'site', 'bot', 'lab'][(i * 7) % 10]}-${i}`);
let demoN = 0;
function demoBatch(n) {
  const out = [], t = Math.floor(Date.now() / 1000) - 240;
  const types = ['push', 'push', 'push', 'push', 'pr', 'pr', 'review', 'issue', 'comment', 'comment', 'star', 'fork', 'release', 'create', 'delete'];
  for (let k = 0; k < n; k++) {
    const repo = DEMO_REPOS[Math.floor(Math.pow(Math.random(), 2.2) * DEMO_REPOS.length)];
    const roll = Math.random();
    const w = roll < 0.22 ? 'bot' : roll < 0.3 ? ['claude', 'copilot', 'codex', 'cursor'][k % 4] : '';
    out.push({ id: `d${demoN++}`, t: t + k * 0.5, type: types[Math.floor(Math.random() * types.length)], actor: w === 'bot' ? 'github-actions[bot]' : `dev${k % 37}`,
      aid: 1000 + (k % 37), repo, who: w, whoLabel: w });
  }
  return out;
}
if (DEMO) { AGENTS = { claude: { label: 'Claude', color: '#d97757' }, copilot: { label: 'Copilot', color: '#7ee787' }, codex: { label: 'Codex', color: '#e6edf3' }, cursor: { label: 'Cursor', color: '#9fb4ff' } }; }

// ───────────────────────────────────────────────────────────── frame loop
let lastFrame = performance.now(), lastSlow = 0, lastTag = 0;
function onResize() {
  const w = stage.clientWidth, h = stage.clientHeight;
  camera.aspect = w / h; camera.updateProjectionMatrix();
  renderer.setSize(w, h); labelRenderer.setSize(w, h);
  renderer.getDrawingBufferSize(rtSize); composer.setSize(w, h); bloom.setSize(w, h);
  pScale.value = h * renderer.getPixelRatio() * 0.5 / Math.tan(THREE.MathUtils.degToRad(camera.fov / 2));
}
addEventListener('resize', onResize);
function frame(now, logicOnly = false) {
  const dt = clamp((now - lastFrame) / 1000, 0, 0.1);
  lastFrame = now;
  NOW = now / 1000;
  TIME.value = NOW;
  pace(dt);
  updateBeams();
  for (const r of repos.values()) {
    if (r.glow > 0.01) { r.glow *= Math.exp(-dt * 2.2); dirty.add(r); }
    if (NOW - r.popT < 0.4) dirty.add(r);
    if (!r.dying && NOW - r.last > IDLE_S) drop(r);
    if (r.dying) {
      r.sink = clamp(1 - (NOW - r.dieT) / 2.5, 0, 1);
      dirty.add(r);
      if (r.sink <= 0) { dirty.delete(r); drop(r, true); }
    }
  }
  for (const r of dirty) if (repos.has(r.name)) writeRepo(r);
  dirty.clear();
  if (fly) {
    const u = easeOut(clamp((NOW - fly.s) / fly.dur, 0, 1));
    camera.position.lerpVectors(fly.p0, fly.p1, u);
    controls.target.lerpVectors(fly.t0v, fly.t1, u);
    if (u >= 1) fly = null;
  }
  controls.update(dt);
  if (NOW - lastSlow > 0.5) { lastSlow = NOW; updateStats(); flushRows(); }
  if (NOW - lastTag > 1) { lastTag = NOW; updateTags(); }
  if (logicOnly) return;
  composer.render();
  labelRenderer.render(scene, camera);
}
function loop(now) { requestAnimationFrame(loop); frame(now); }
onResize();
requestAnimationFrame(loop);
if (DEMO) { ingest(demoBatch(320)); ready(); setInterval(() => ingest(demoBatch(40)), 8000); }
else { poll(); setInterval(() => { if (!document.hidden) poll(); }, 15000); }

function step(seconds) {                       // deterministic frames for the self-test
  let t = Math.max(performance.now(), lastFrame);
  for (let k = 0; k < Math.round(seconds * 60); k++) { t += 1000 / 60; frame(t, true); }
}
window.__live = { step, repos, queue, ingest, demoBatch, focusRepo, get focus() { return focus; }, get lens() { return lens; }, setLens, who, classCount, off, typeBtns, recolourAll };
if (HASH.get('selftest') === '1') import('./live-selftest.js').then(m => m.run(window.__live));
