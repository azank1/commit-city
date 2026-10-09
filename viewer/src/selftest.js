// In-page interaction self-test (no automation protocol needed): open lapse.html#selftest=1
// Frames are driven through L.step(seconds) so results don't depend on the browser's frame pacing.
const key = (k, extra = {}) => window.dispatchEvent(new KeyboardEvent('keydown', { key: k, bubbles: true, ...extra }));
const ptr = (el, type, x, y, buttons = 0) => el.dispatchEvent(new PointerEvent(type, { clientX: x, clientY: y, pointerId: 1, pointerType: 'mouse', isPrimary: true, buttons, bubbles: true }));

export async function run(L) {
  const out = [];
  const check = (name, ok, detail = '') => { const line = `SELFTEST ${ok ? 'PASS' : 'FAIL'} ${name}${detail ? ' — ' + detail : ''}`; out.push(line); console.log(line); };
  const errs = [];
  window.addEventListener('error', e => errs.push(e.message));
  const $ = id => document.getElementById(id);
  const DAY = 1440;
  L.step(0.5);
  try {
    L.seek(L.T_END * 0.9); if (L.playing) key(' ');
    L.step(0.2);
    const t0 = L.T;
    key(' '); L.step(1);
    const t1 = L.T;
    check('space starts playback (3 days/s ≈ 4320 min per s)', t1 > t0 + 2000, `advanced ${(t1 - t0).toFixed(0)} min in 1 s`);
    key(' '); const t2 = L.T; L.step(0.5);
    check('space pauses', Math.abs(L.T - t2) < 0.01);
    key('ArrowRight');
    check('→ steps one day', Math.abs(L.T - t2 - DAY) < 0.01);
    key('ArrowLeft', { shiftKey: true });
    check('shift+← steps back one hour', Math.abs(L.T - (t2 + DAY - 60)) < 0.01);
    key('1'); key(' '); L.step(2); const s0 = L.T; L.step(1); key(' ');
    check('1 = 1 hr/s settles at ~60 sim-min per s (after a smooth ramp)', L.T - s0 > 45 && L.T - s0 < 90, `${(L.T - s0).toFixed(1)} min in 1 s`);
    key('5');
    check('5 selects 1 wk/s', $('speed-label').textContent.includes('wk'));
    key('3');
    const tl = $('timeline'), r = tl.getBoundingClientRect(), y = r.top + r.height / 2;
    const at = f => r.left + 10 + (r.width - 20) * f;
    ptr(tl, 'pointerdown', at(0.25), y, 1); L.step(0.05); ptr(tl, 'pointerup', at(0.25), y); L.step(0.1);
    check('timeline click seeks', Math.abs(L.T - L.T_END * 0.25) < L.T_END * 0.01, `T=${L.T.toFixed(0)} want≈${(L.T_END * 0.25).toFixed(0)}`);
    ptr(tl, 'pointerdown', at(0.5), y, 1);
    for (let k = 1; k <= 10; k++) { ptr(tl, 'pointermove', at(0.5 + 0.025 * k), y, 1); L.step(0.02); }
    ptr(tl, 'pointerup', at(0.75), y); L.step(0.1);
    check('timeline drag scrubs', Math.abs(L.T - L.T_END * 0.75) < L.T_END * 0.01, `T=${L.T.toFixed(0)} want≈${(L.T_END * 0.75).toFixed(0)}`);
    check('scrub on a paused lapse stays paused', !L.playing);
    tl.dispatchEvent(new PointerEvent('pointerleave', { bubbles: true }));
    L.seek(L.T_END * 0.3); L.step(0.1); const a = $('c-total').textContent;
    L.seek(L.T_END * 0.97); L.step(0.1); const b = $('c-total').textContent; L.seek(L.T_END * 0.3); L.step(0.1);
    check('seek back-and-forth is deterministic', $('c-total').textContent === a && String(L.R.reduce((s, q) => s + q.cum, 0)) === a.replace(/,/g, '') && a !== b, `${a} ↔ ${b}`);
    L.seek(L.T_END - 60); L.step(0.3);
    document.querySelector('#board .row:not([hidden])').click();
    L.step(1.8);
    check('board click opens the repo card', !$('focus').hidden && $('f-name').textContent.length > 0, $('f-name').textContent);
    check('focused repo lists its top-level directories', document.querySelectorAll('#f-tops li').length > 0, `${document.querySelectorAll('#f-tops li').length} dirs`);
    const cv = document.querySelector('#stage canvas'), cr = cv.getBoundingClientRect();
    let tip = '';
    for (const [dx, dy] of [[0, 0], [10, 20], [-20, 30], [30, -10], [0, 60], [-40, 50], [60, 80], [-80, 10]]) {
      ptr(cv, 'pointermove', cr.left + cr.width / 2 + dx, cr.top + cr.height * 0.58 + dy);
      L.step(0.12);
      if (!$('tip').hidden && /lines/.test($('tip').textContent)) { tip = $('tip').textContent; break; }
    }
    check('hovering the city shows a file / repo tooltip', !!tip, tip.slice(0, 90));
    key('Escape'); L.step(0.3);
    check('Esc closes the repo card', $('focus').hidden);
    const d0 = L.camera.position.distanceTo(L.controls.target);
    cv.dispatchEvent(new WheelEvent('wheel', { deltaY: -600, clientX: cr.left + cr.width / 2, clientY: cr.top + cr.height / 2, bubbles: true, cancelable: true }));
    L.step(0.8);
    const d1 = L.camera.position.distanceTo(L.controls.target);
    check('wheel zooms the camera', d1 < d0 * 0.97, `${d0.toFixed(1)} → ${d1.toFixed(1)}`);
    L.seek(L.T_END * 0.5);
    key('h'); key(' ');
    const h0 = L.T; L.step(1); const h1 = L.T;
    check('hidden UI keeps rendering and playing', document.body.classList.contains('bare') && h1 > h0, `${h0.toFixed(0)} → ${h1.toFixed(0)}`);
    key('h'); key(' ');
    L.seek(L.T_END - 20); key(' '); L.step(1);
    check('lapse stops at the end', !L.playing && L.T >= L.T_END - 1e-6);
    key(' '); L.step(0.2);
    check('play at the end restarts from the start', L.playing && L.T < 5000, `T=${L.T.toFixed(0)}`);
    key(' ');
  } catch (e) {
    check('selftest ran to completion', false, e.message + ' ' + (e.stack || '').split('\n')[1]);
  }
  check('no uncaught page errors', errs.length === 0, errs.slice(0, 3).join(' | '));
  const pre = document.createElement('pre');
  pre.id = 'selftest';
  pre.style.cssText = 'position:fixed;left:16px;top:16px;z-index:99;background:#000d;color:#cfe;padding:12px 14px;font:12px/1.5 ui-monospace,monospace;border-radius:10px;max-width:80vw;white-space:pre-wrap';
  pre.textContent = out.join('\n');
  document.body.appendChild(pre);
  console.log('SELFTEST DONE');
}
