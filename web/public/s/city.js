// commit.city page runtime. Finds the city, builds it when it does not exist yet (start -> repo x N ->
// finish, driven from here so no request outlives a function), then hands the payload to the viewer app.
(() => {
  'use strict';
  const CC = window.CC || {};
  const $ = id => document.getElementById(id);
  const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const fmt = n => Number(n || 0).toLocaleString('en-US');
  const sleep = ms => new Promise(r => setTimeout(r, ms));
  const hash = new URLSearchParams(location.hash.slice(1));
  const EMBED = hash.get('embed') === '1';
  const FORCE = hash.get('build') === '1';
  const BOT = !FORCE && (navigator.webdriver || /bot|crawl|spider|slurp|preview|facebookexternalhit|embedly|headless/i.test(navigator.userAgent));
  const GH = '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"/></svg>';
  const box = $('cc-build');
  const pagePath = () => location.pathname + location.search;
  const signInUrl = () => `/api/auth/login?next=${encodeURIComponent(pagePath())}`;
  const isRepo = CC.target.includes('/');
  const q = `t=${encodeURIComponent(CC.target)}${CC.all ? '&all=1' : ''}`;
  if (EMBED) document.body.classList.add('embed');
  // an embedding page (like commit.city's own home) hears when there is nothing to show, so it can fall back
  const tellParent = status => { if (EMBED && parent !== window) try { parent.postMessage({ cc: status, target: CC.target }, '*'); } catch { /* cross-origin parent gone */ } };

  class ApiError extends Error {
    constructor(status, info) { super(info.error || `HTTP ${status}`); this.status = status; this.info = info; }
  }
  async function call(path, body) {
    let r;
    try {
      r = await fetch(path, body ? { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) } : {});
    } catch (e) {
      throw new ApiError(0, { error: 'network error; check your connection' });
    }
    const info = await r.json().catch(() => ({ error: r.status === 504 ? 'the builder timed out' : `HTTP ${r.status}` }));
    if (!r.ok) throw new ApiError(r.status, info);
    return info;
  }

  // ─────────────────────────────────────────────── loading an existing city
  async function payloadText(url, progress) {
    const r = await fetch(url);
    if (!r.ok) throw new Error(`HTTP ${r.status}`);
    const total = +(r.headers.get('content-length') || 0);
    const chunks = [];
    let got = 0;
    if (r.body && r.body.getReader) {
      const rd = r.body.getReader();
      for (;;) {
        const { done, value } = await rd.read();
        if (done) break;
        chunks.push(value); got += value.length;
        progress(`${(got / 1e6).toFixed(1)}${total ? ` / ${(total / 1e6).toFixed(1)}` : ''} MB`);
      }
    } else chunks.push(new Uint8Array(await r.arrayBuffer()));
    const blob = new Blob(chunks);
    const head = new Uint8Array(await blob.slice(0, 2).arrayBuffer());
    if (head[0] !== 0x1f || head[1] !== 0x8b) return blob.text();      // already inflated on the way
    if (typeof DecompressionStream === 'undefined') throw new Error('this browser cannot unpack the city; try a current Chrome, Firefox or Safari');
    return new Response(blob.stream().pipeThrough(new DecompressionStream('gzip'))).text();
  }

  async function dataUri(url) {
    if (!url) return null;
    try {
      const u = new URL(url);
      if (u.hostname.endsWith('githubusercontent.com')) u.searchParams.set('s', '256');
      const r = await fetch(u.href);
      if (!r.ok) return null;
      const b = await r.blob();
      return await new Promise(res => { const fr = new FileReader(); fr.onload = () => res(fr.result); fr.onerror = () => res(null); fr.readAsDataURL(b); });
    } catch { return null; }
  }

  let opened = false, recheck = false;
  async function open(meta) {
    CC.meta = meta;
    const ld = $('loading');
    const say = t => { if (ld) ld.textContent = t; };
    say(`loading ${meta.target}…`);
    let text;
    try {
      text = await payloadText(meta.url, p => say(`loading ${meta.target} · ${p}`));
    } catch (e) {
      if (!recheck) {                                   // the page was cached before a rebuild or a hide
        recheck = true;
        const s = await call(`/api/city?${q}&fresh=1`).catch(() => null);
        if (s && s.status === 'ready' && s.meta.url !== meta.url) return open(s.meta);
        if (s && s.status === 'hidden') return showHidden();
        if (s && s.status === 'missing') return start();
      }
      return showError(`The city could not be downloaded (${e.message}).`, true);
    }
    $('lapse-data').textContent = text;
    const av = await dataUri(meta.avatar);
    if (av) $('avatar-src').setAttribute('src', av);
    say(`raising ${meta.target}'s city…`);
    box.hidden = true;
    const s = document.createElement('script');
    s.src = CC.app;
    s.onerror = () => showError('The 3D viewer failed to load. Reload to try again.', true);
    document.body.appendChild(s);
    opened = true;
    bar(meta);
  }

  // ─────────────────────────────────────────────── building
  function head(kick, title, avatar, square) {
    return `<div class="cc-head">${avatar ? `<img class="cc-av${square ? ' sq' : ''}" src="${esc(avatar)}" alt="">` : '<div class="cc-av"></div>'}
      <div><div class="cc-kick">${esc(kick)}</div><div class="cc-title">${esc(title)}</div></div></div>`;
  }
  function show(html) { box.innerHTML = `<div class="cc-box">${html}</div>`; box.hidden = false; }
  const foot = `<p class="cc-foot">Public data only: default-branch history of public repos, read with git and GitHub's API.
    No code is stored, only paths, sizes and times. <a href="/about#privacy">Privacy &amp; opt-out</a></p>`;

  function showFinding() {
    show(`${head('commit.city', CC.target, isRepo ? null : `https://github.com/${encodeURIComponent(CC.target)}.png?size=112`)}
      <p class="cc-sub">Looking up <b>${esc(CC.target)}</b> on GitHub…</p>
      <div class="cc-bar2 indet"><i></i></div>${foot}`);
  }

  function showOffer() {
    show(`${head('commit.city', CC.target, isRepo ? null : `https://github.com/${encodeURIComponent(CC.target)}.png?size=112`)}
      <p class="cc-sub">There is no city for <b>${esc(CC.target)}</b> yet. Building one replays a year of its public git history;
      it takes a minute or two and is then cached for everyone.</p>
      <div class="cc-actions"><button class="cc-primary" id="cc-start">Build this city</button><a href="/explore">Explore others</a></div>${foot}`);
    $('cc-start').onclick = () => start();
  }

  async function pool(items, n, fn) {
    let i = 0;
    await Promise.all(Array.from({ length: Math.min(n, items.length) }, async () => { while (i < items.length) await fn(items[i++]); }));
  }

  let building = false;
  async function start() {
    if (building) return;
    building = true;
    try { await run(); } finally { building = false; }
  }

  async function run() {
    showFinding();
    let st;
    try {
      st = await call('/api/build/start', { t: CC.target, all: !!CC.all });
    } catch (e) { return fail(e); }
    // GitHub moved this repo: the city is built, and lives, under its current name
    if (isRepo && st.target.toLowerCase() !== CC.target.toLowerCase() && history.replaceState) {
      history.replaceState(null, '', `/${st.target}${CC.all ? '?all=1' : ''}${location.hash}`);
    }
    const who = st.kind === 'org' ? `the ${st.profile.login} org` : st.kind === 'repo' ? st.target : st.profile.name || st.profile.login;
    const jobs = st.repos.map(r => ({ ...r, s: r.cached ? 'hit' : 'wait', note: r.cached ? 'cached' : `${fmt(r.commits)} commits` }));
    for (const s of st.skipped || []) jobs.push({ name: s.name, s: 'bad', note: s.reason, skipped: true, commits: s.commits });
    const since = new Date(st.start * 1000).toISOString().slice(0, 10);
    const total = st.repos.length;
    show(`${head(st.kind === 'repo' ? 'building a repo city' : st.kind === 'org' ? 'building an org city' : 'building a city', st.target, st.profile.avatar, st.kind !== 'user')}
      <p class="cc-sub">Replaying <b>${fmt(total)} repo${total === 1 ? '' : 's'}</b> of ${esc(who)} since ${since},
      straight from GitHub's git servers: every commit, every file, how big it was at every moment.
      Records are shared, so cached repos are instant.</p>
      <div class="cc-bar2"><i id="cc-prog"></i></div>
      <div class="cc-meta"><span id="cc-count">0 / ${total} repos</span><span id="cc-clock">0:00</span></div>
      <ul class="cc-repos" id="cc-repos">${jobs.map((j, k) => `<li id="cc-r${k}" data-s="${j.s}"><span class="cc-dot"></span>
        <span class="nm">${esc(j.name)}</span><span class="st">${esc(j.note)}</span></li>`).join('')}</ul>${foot}`);
    const t0 = Date.now();
    const clock = setInterval(() => {
      const s = Math.floor((Date.now() - t0) / 1000);
      const el = $('cc-clock'); if (el) el.textContent = `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
    }, 250);
    let done = jobs.filter(j => j.s === 'hit').length;
    const tick = () => {
      const p = $('cc-prog'), c = $('cc-count');
      if (p) p.style.width = `${total ? (100 * done) / total : 100}%`;
      if (c) c.textContent = `${done} / ${total} repos`;
    };
    const set = (j, s, note) => {
      j.s = s; j.note = note;
      const li = $(`cc-r${jobs.indexOf(j)}`);
      if (li) { li.dataset.s = s; li.querySelector('.st').textContent = note; if (s === 'run') li.scrollIntoView({ block: 'nearest' }); }
    };
    tick();
    const todo = jobs.filter(j => j.s === 'wait').sort((a, b) => b.mb - a.mb || b.commits - a.commits);
    let expired = null;
    await pool(todo, 4, async j => {
      if (expired) return;
      const t1 = Date.now();
      let doing = 'replaying';
      set(j, 'run', 'replaying…');
      const live = setInterval(() => set(j, 'run', `${doing}… ${Math.floor((Date.now() - t1) / 1000)}s`), 1000);
      try {
        for (let attempt = 1; ; attempt++) {
          try {
            const r = await call('/api/build/repo', { ticket: st.ticket, repo: j.name });
            set(j, r.cached ? 'hit' : 'ok', r.cached ? 'cached' : `${((Date.now() - t1) / 1000).toFixed(1)}s · ${fmt(r.files)} files`);
            break;
          } catch (e) {
            if (e.status === 401) { expired = e; set(j, 'bad', 'ticket expired'); break; }
            // busy: the builder is replaying other big repos; ask again rather than draw the city without this one
            const busy = e.status === 503 && e.info.status === 'busy';
            if (e.status === 422 || e.status === 400 || attempt >= (busy ? 6 : 2)) { set(j, 'bad', e.message); break; }
            doing = busy ? 'builder busy, retrying' : 'retrying';
            await sleep(busy ? 3000 : 1500);
            doing = 'replaying';
          }
        }
      } finally { clearInterval(live); }
      done++; tick();
    });
    if (expired) { clearInterval(clock); return fail(expired); }
    const c = $('cc-count'); if (c) c.textContent = 'assembling the city…';
    let meta;
    try {
      meta = await call('/api/build/finish', { ticket: st.ticket, plan: st.plan });
    } catch (e) {
      clearInterval(clock);
      // nothing drawable because replays failed: each failed repo's own reason is the one its row showed
      if (e.info && e.info.status === 'repo_failed') {
        for (const s of e.info.skipped || []) { const j = jobs.find(x => x.name === s.name && x.s === 'bad'); if (j) s.reason = j.note; }
      }
      return fail(e);
    }
    clearInterval(clock);
    remember(meta);
    if (history.replaceState) history.replaceState(null, '', pagePath() + location.hash);
    await open(meta);
  }

  // The cities this browser built, newest first, as gallery entries: the home page and /explore lead with them
  // (site.js reads the list). It stays in this browser.
  function remember(m) {
    const share = n => (m.commits ? Math.round((1000 * n) / m.commits) / 1000 : 0);
    const e = { key: m.key, target: m.target, kind: m.kind, avatar: m.avatar, commits: m.commits, repos: m.repos, lines: m.lines, v: m.v,
      agent: share((m.who || {}).agent || 0), bot: share((m.who || {}).bot || 0) };
    try {
      const kept = JSON.parse(localStorage.getItem('cc.mine') || '[]').filter(x => x && x.key !== e.key);
      localStorage.setItem('cc.mine', JSON.stringify([e, ...kept].slice(0, 24)));
    } catch { /* storage off: the gallery still lists it */ }
  }

  function fail(e) {
    const info = (e && e.info) || {};
    const s = info.status;
    if (s === 'hidden') return showHidden();
    if (s === 'not_found') {
      return show(`${head('commit.city', CC.target)}<p class="cc-sub">GitHub has no user, organization or public repository called <b>${esc(CC.target)}</b>.</p>
        <div class="cc-actions"><a class="cc-primary" href="/">Try another</a></div>`);
    }
    if (s === 'rate_limited') {
      return show(`${head('commit.city', CC.target)}<p class="cc-sub">commit.city has used up its GitHub API quota for the moment.
        Sign in with GitHub and the build runs on your own quota instead. Sign-in asks for no permissions: public data only.</p>
        <div class="cc-actions"><a class="cc-primary" href="${signInUrl()}">${GH}Sign in with GitHub</a><button id="cc-retry">Try again</button></div>${foot}`), wireRetry();
    }
    if (s === 'too_big') {
      tellParent('missing');
      const big = (info.skipped || [])[0] || {};
      const owner = isRepo ? CC.target.split('/')[0] : '';
      return show(`${head('commit.city', CC.target)}<p class="cc-sub"><b>${esc(big.name || CC.target)}</b> is ${esc(big.reason || 'too big for the hosted builder')}.
        Replaying ${big.commits ? `its ${fmt(big.commits)} commits from the last year` : 'its history'} would run past what one build may take;
        for now the hosted builder takes repos up to about 1.5 GB.</p>
        <div class="cc-actions">${owner ? `<a class="cc-primary" href="/${esc(owner)}">See ${esc(owner)}'s city</a>` : ''}<a href="/explore">Explore other cities</a></div>${foot}`);
    }
    if (s === 'repo_failed') {
      tellParent('missing');
      const bad = (info.skipped || [])[0] || {};
      const owner = isRepo ? CC.target.split('/')[0] : '';
      const heavy = /too big|too long/.test(bad.reason || '');      // not for a fetch that failed or a busy builder
      return show(`${head('commit.city', CC.target)}<p class="cc-sub"><b>${esc(bad.name || CC.target)}</b> could not be replayed${bad.reason ? `: ${esc(bad.reason)}` : ''}.
        ${bad.commits ? `It has ${fmt(bad.commits)} commits from the last year${heavy ? ', more than one hosted build can replay' : ''}.` : ''}</p>
        <div class="cc-actions"><button class="cc-primary" id="cc-retry">Try again</button>${owner ? `<a href="/${esc(owner)}">See ${esc(owner)}'s city</a>` : ''}<a href="/explore">Explore other cities</a></div>${foot}`), wireRetry();
    }
    if (s === 'empty') {
      const whole = isRepo && !CC.all;
      return show(`${head('commit.city', CC.target)}<p class="cc-sub">${esc(e.message)}.
        ${isRepo ? '' : 'Commits count once they land on the default branch of a public repo; private work and other branches are not visible.'}</p>
        <div class="cc-actions">${whole ? `<a class="cc-primary" href="/${esc(CC.target)}?all=1">Build its whole history</a>` : ''}<a href="/explore">Explore other cities</a></div>${foot}`);
    }
    showError(e && e.status === 401 ? 'This build took longer than its ticket allows. Retry and it will pick up where it stopped.' : (e && e.message) || String(e), true);
  }

  function showHidden() {
    tellParent('missing');
    show(`${head('commit.city', CC.target)}<p class="cc-sub">This city is hidden by its owner.</p>
      <div class="cc-actions"><a class="cc-primary" href="/explore">Explore other cities</a></div>`);
  }

  function showError(msg, retry) {
    tellParent('error');
    show(`${head('commit.city', CC.target)}<div class="cc-err">${esc(msg)}</div>
      <div class="cc-actions">${retry ? '<button class="cc-primary" id="cc-retry">Try again</button>' : ''}<a href="/">Home</a>
      <a href="https://github.com/azank1/commit-city/issues/new" target="_blank" rel="noopener">Report a problem</a></div>`);
    wireRetry();
  }
  function wireRetry() { const b = $('cc-retry'); if (b) b.onclick = () => (opened ? location.reload() : start()); }

  // ─────────────────────────────────────────────── the bar: search, share, owner controls
  function cookie(name) {
    const m = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
    return m ? decodeURIComponent(m[1]) : null;
  }
  const me = cookie('cc_user');

  function ago(iso) {
    const s = (Date.now() - Date.parse(iso)) / 1000;
    if (!(s >= 0)) return '';
    if (s < 3600) return `${Math.max(1, Math.round(s / 60))} min ago`;
    if (s < 86400) return `${Math.round(s / 3600)} h ago`;
    return `${Math.round(s / 86400)} d ago`;
  }

  function bar(meta) {
    const share = $('cc-share'), age = $('cc-age');
    if (share) share.hidden = !meta;
    if (age && meta) {
      const stale = Date.now() - Date.parse(meta.generated) > 6 * 3600e3;
      age.hidden = false;
      age.innerHTML = `built ${esc(ago(meta.generated))}${stale ? ' · <a href="#" id="cc-rebuild" style="color:var(--accent)">update</a>' : ''}`;
      const rb = $('cc-rebuild');
      if (rb) rb.onclick = ev => { ev.preventDefault(); location.hash = 'build=1'; location.reload(); };
    }
  }

  function parseQuery(v) {
    let t = String(v || '').trim().replace(/^@/, '');
    try { if (/^https?:\/\//.test(t)) t = new URL(t).pathname; } catch { /* keep as typed */ }
    t = t.replace(/^(?:www\.)?github\.com\//i, '').replace(/^(?:www\.)?commit\.city\//i, '').replace(/^\/+|\/+$/g, '').replace(/\.git$/, '');
    const parts = t.split('/').filter(Boolean).slice(0, 2);
    return parts.length ? parts.join('/') : '';
  }
  const go = $('cc-go');
  if (go) go.addEventListener('submit', ev => {
    ev.preventDefault();
    const t = parseQuery($('cc-q').value);
    if (t) location.href = `/${t}`;
  });

  function sheet(html) {
    const el = $('cc-sheet');
    if (!html) { el.hidden = true; el.innerHTML = ''; return; }
    el.innerHTML = html; el.hidden = false;
    el.querySelectorAll('[data-copy]').forEach(b => b.addEventListener('click', async () => {
      const text = b.dataset.copy;
      try { await navigator.clipboard.writeText(text); b.textContent = 'Copied'; }
      catch { const code = b.previousElementSibling; if (code) { const r = document.createRange(); r.selectNodeContents(code); getSelection().removeAllRanges(); getSelection().addRange(r); } b.textContent = 'Select + copy'; }
      setTimeout(() => (b.textContent = 'Copy'), 1600);
    }));
  }
  document.addEventListener('keydown', e => { if (e.key === 'Escape') sheet(null); });
  document.addEventListener('pointerdown', e => {
    const el = $('cc-sheet');
    if (!el.hidden && !el.contains(e.target) && !e.target.closest('#cc-share')) sheet(null);
  });

  function momentLink() {
    const L = window.__lapse, D = (() => { try { return JSON.parse($('lapse-data').textContent); } catch { return null; } })();
    if (!L || !D) return null;
    const off = (D.tz && D.tz.offset) || 0;
    const when = new Date((L.EPOCH + L.T * 60 + off * 60) * 1000).toISOString().slice(0, 16);
    const c = L.camera.position, t = L.controls.target, r = v => Math.round(v * 10) / 10;
    return `${location.origin}${pagePath()}#t=${when}&cam=${[c.x, c.y, c.z, t.x, t.y, t.z].map(r).join(',')}&play=0${L.lens ? '&lens=agents' : ''}`;
  }

  const share = $('cc-share');
  if (share) share.addEventListener('click', () => {
    if (!$('cc-sheet').hidden) return sheet(null);
    const meta = CC.meta;
    if (!meta) return;
    const url = `${location.origin}/${meta.target}${CC.all ? '?all=1' : ''}`;
    const card = `${location.origin}/api/card?t=${encodeURIComponent(meta.target)}${CC.all ? '&all=1' : ''}`;
    const md = `[![${meta.target} on commit.city](${card})](${url})`;
    const moment = momentLink();
    const text = meta.kind === 'user' ? `My last year on GitHub as a 3D city: ${fmt(meta.commits)} commits across ${meta.repos} repos.` :
      `${meta.target} on GitHub as a 3D city: ${fmt(meta.commits)} commits, ${fmt(meta.lines)} lines.`;
    const owner = meta.kind === 'org' ? null : meta.target.split('/')[0];
    const mine = me && owner && me.toLowerCase() === owner.toLowerCase();
    sheet(`<div class="cc-sec"><h3>Share this city</h3>
        <div class="cc-copy"><code>${esc(url)}</code><button data-copy="${esc(url)}">Copy</button></div>
        ${moment ? `<div class="cc-copy"><code>${esc(moment)}</code><button data-copy="${esc(moment)}">Copy</button></div>
        <p>The second link opens at this exact moment and camera angle.</p>` : ''}
        <div class="cc-row">
          <a href="https://x.com/intent/post?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}" target="_blank" rel="noopener">Post on X</a>
          <a href="https://bsky.app/intent/compose?text=${encodeURIComponent(`${text} ${url}`)}" target="_blank" rel="noopener">Bluesky</a>
          <a href="https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}" target="_blank" rel="noopener">LinkedIn</a>
        </div></div>
      <div class="cc-sec"><h3>Make a clip</h3>
        <p>Record the year replaying as a video, wide or vertical, right in your browser.</p>
        <div class="cc-row"><button class="cc-primary" id="cc-rec">● Record a clip</button><button id="cc-lens">${window.__lapse && window.__lapse.lens ? 'Agent lens: on' : 'Agent lens'}</button></div></div>
      <div class="cc-sec"><h3>Put it on your profile README</h3>
        <p>A live card that links back here. It refreshes whenever the city is rebuilt.</p>
        <img class="cc-card" src="${esc(card)}" alt="">
        <div class="cc-copy"><code>${esc(md)}</code><button data-copy="${esc(md)}">Copy</button></div></div>
      ${owner && meta.kind !== 'org' ? `<div class="cc-sec"><h3>${mine ? 'Your city' : 'Is this you?'}</h3>
        <p>${mine ? 'Leave repos out of your city, or hide it (and your repo cities) from commit.city.' :
          `Sign in as ${esc(owner)} to leave repos out or hide this city. Sign-in asks for no permissions.`}</p>
        <div class="cc-row">${mine ? '<button id="cc-manage" class="cc-primary">Manage my city</button><button id="cc-out">Sign out</button>' :
          `<a class="cc-primary" href="${signInUrl()}">Sign in with GitHub</a>`}</div></div>` : ''}`);
    const rc = $('cc-rec'); if (rc) rc.onclick = () => { sheet(null); if (window.__lapse) window.__lapse.toggleRecPanel(true); };
    const ln = $('cc-lens'); if (ln) ln.onclick = () => { if (!window.__lapse) return; window.__lapse.setLens(!window.__lapse.lens); ln.textContent = window.__lapse.lens ? 'Agent lens: on' : 'Agent lens'; };
    const mg = $('cc-manage'); if (mg) mg.onclick = () => manage(owner);
    const so = $('cc-out'); if (so) so.onclick = async () => { await fetch('/api/auth/logout', { method: 'POST' }).catch(() => {}); location.reload(); };
  });

  async function manage(owner) {
    let st;
    try { st = await call('/api/settings'); } catch (e) { return sheet(`<div class="cc-err">${esc(e.message)}</div>`); }
    let names = [];
    try { names = JSON.parse($('lapse-data').textContent).repos.map(r => r.n); } catch { /* the city may not be loaded */ }
    const ex = new Set((st.exclude || []).map(s => s.toLowerCase()));
    for (const n of st.exclude || []) if (!names.some(m => m.toLowerCase() === n.toLowerCase())) names.push(n);
    sheet(`<div class="cc-sec"><h3>Manage ${esc(owner)}'s city</h3>
      <p>Unticked repos are left out the next time any of your cities is built.</p>
      <div class="cc-list">${names.map(n => `<label class="cc-check"><input type="checkbox" value="${esc(n)}" ${ex.has(n.toLowerCase()) ? '' : 'checked'}>${esc(n)}</label>`).join('') || '<p>No repos yet.</p>'}</div>
      <label class="cc-check"><input type="checkbox" id="cc-hide" ${st.hidden ? 'checked' : ''}>Hide my city and my repo cities from commit.city</label>
      <div class="cc-row" style="margin-top:10px"><button class="cc-primary" id="cc-save">Save</button><button id="cc-cancel">Cancel</button></div>
      <p class="cc-note" id="cc-msg"></p></div>`);
    $('cc-cancel').onclick = () => sheet(null);
    $('cc-save').onclick = async () => {
      const exclude = [...document.querySelectorAll('#cc-sheet .cc-list input')].filter(i => !i.checked).map(i => i.value);
      const hidden = $('cc-hide').checked;
      $('cc-msg').textContent = 'Saving…';
      try {
        await call('/api/settings', { exclude, hidden });
        if (hidden) { location.href = '/'; return; }
        $('cc-msg').textContent = 'Saved. Rebuilding with your choices…';
        location.hash = 'build=1'; location.reload();
      } catch (e) { $('cc-msg').textContent = e.message; }
    };
  }

  // the stars on the repo, for the bar (cached server-side)
  fetch('/api/stars').then(r => (r.ok ? r.json() : null)).then(s => {
    const el = document.querySelector('.cc-star span');
    if (s && s.stars && el) el.textContent = s.stars >= 1000 ? `${(s.stars / 1000).toFixed(s.stars >= 10000 ? 0 : 1)}k` : String(s.stars);
  }).catch(() => {});

  // ─────────────────────────────────────────────── go
  (async () => {
    if (CC.meta && !FORCE) return open(CC.meta);
    if (FORCE) { history.replaceState(null, '', pagePath()); return start(); }
    let s;
    try { s = await call(`/api/city?${q}`); } catch (e) { return showError(e.message, true); }
    if (s.status === 'ready') return open(s.meta);
    if (s.status === 'hidden') return showHidden();
    if (EMBED) { tellParent('missing'); return show(`${head('commit.city', CC.target)}<p class="cc-sub">No city here yet. <a href="/${esc(CC.target)}" target="_blank" rel="noopener">Build it on commit.city ↗</a></p>`); }
    if (BOT) return showOffer();
    return start();
  })();
})();
