// In-page self-test for /events (no automation protocol needed): open /events#selftest=1.
// Runs on the synthetic demo feed; frames are driven through L.step(seconds).
const key = k => window.dispatchEvent(new KeyboardEvent('keydown', { key: k, bubbles: true }));

export async function run(L) {
  const out = [];
  const check = (name, ok, detail = '') => { const line = `SELFTEST ${ok ? 'PASS' : 'FAIL'} ${name}${detail ? ' — ' + detail : ''}`; out.push(line); console.log(line); };
  const errs = [];
  window.addEventListener('error', e => errs.push(e.message));
  const $ = id => document.getElementById(id);
  try {
    L.step(3);
    check('the demo feed raises towers', L.repos.size > 20, `${L.repos.size} repos`);
    const blocks = [...L.repos.values()].reduce((a, r) => a + r.segs.length, 0);
    check('events stack blocks once their beams land', blocks > 40, `${blocks} blocks`);
    L.step(1);
    check('the ticker lists events', $('feed').children.length >= 10, `${$('feed').children.length} rows`);
    check('who-split counters fill in', L.who.human > 0 && L.who.bot > 0 && L.who.agent > 0, JSON.stringify(L.who));
    check('agents seen are listed', $('seen').querySelectorAll('span').length >= 1);
    check('busiest list ranks repos', $('hot').querySelectorAll('li[data-repo]').length >= 3);
    const before = L.lens;
    key('a');
    check('A switches to the who lens', L.lens !== before && L.lens === 'who');
    key('a');
    const r = [...L.repos.values()].sort((a, b) => b.segs.length - a.segs.length)[0];
    L.focusRepo(r); L.step(1.5);
    check('focusing a repo opens its card', !$('card').hidden && $('card').textContent.includes(r.name.split('/')[1]));
    check('the card links to its city', !!$('card').querySelector(`a[href="/${r.name}"]`));
    key('Escape'); L.step(0.2);
    check('Esc closes the card', $('card').hidden);
    L.typeBtns[0].click(); L.step(0.2);
    check('a legend chip switches a class off', L.off.has(0) && L.typeBtns[0].getAttribute('aria-pressed') === 'false');
    L.typeBtns[0].click();
    const n0 = L.repos.size;
    L.ingest(L.demoBatch(60)); L.step(4);
    check('a new batch keeps the city growing', [...L.repos.values()].reduce((a, x) => a + x.total, 0) > 0 && L.repos.size >= n0);
    key(' '); const q0 = L.queue.length; L.ingest(L.demoBatch(30)); L.step(2);
    check('space pauses the drip', L.queue.length >= q0 + 30, `queue ${q0} -> ${L.queue.length}`);
    key(' ');
    key('h'); check('H hides the panels', document.body.classList.contains('ui-off')); key('h');
    check('no page errors', errs.length === 0, errs.join(' | '));
  } catch (err) {
    check('self-test ran to completion', false, String(err && err.stack || err));
  }
  const pass = out.filter(l => l.includes(' PASS ')).length;
  const pre = document.createElement('pre');
  pre.id = 'selftest-out';
  pre.style.cssText = 'position:fixed;left:16px;top:16px;z-index:99;max-width:60vw;background:rgba(0,0,0,.85);color:#cfe;padding:12px;border-radius:10px;font:12px/1.5 monospace;white-space:pre-wrap';
  pre.textContent = `${pass}/${out.length} passed\n` + out.join('\n');
  document.body.appendChild(pre);
  document.title = `SELFTEST ${pass}/${out.length}`;
}
