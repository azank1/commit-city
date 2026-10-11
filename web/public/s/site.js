// commit.city: the site's shared runtime. Navigation, the commit.city/<anything> omnibox, copy buttons,
// reveal-on-scroll, the star count and the gallery feed. Every page but the city viewer loads it.
(() => {
  'use strict';
  const $ = (s, root = document) => root.querySelector(s);
  const $$ = (s, root = document) => [...root.querySelectorAll(s)];
  const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const compact = n => {
    n = Number(n) || 0;
    return n >= 1e6 ? `${(n / 1e6).toFixed(n >= 1e7 ? 0 : 1)}M` : n >= 1e3 ? `${(n / 1e3).toFixed(n >= 1e4 ? 0 : 1)}k` : String(Math.round(n));
  };
  const fmt = n => Number(n || 0).toLocaleString('en-US');
  const LOGIN = /^[A-Za-z0-9](?:[A-Za-z0-9]|-(?=[A-Za-z0-9])){0,38}$/;
  const REPO = /^[A-Za-z0-9._-]{1,100}$/;

  /** Any way of naming a GitHub account or repo -> "owner" or "owner/repo" ("" when it isn't one). */
  function parse(v) {
    let t = String(v || '').trim().replace(/^@/, '');
    try { if (/^https?:\/\//i.test(t)) t = new URL(t).host + new URL(t).pathname; } catch { /* as typed */ }
    t = t.replace(/^(?:www\.)?(?:github\.com|commit\.city)(?=\/|$)/i, '').replace(/^git@github\.com:/i, '').replace(/[?#].*$/, '');
    const parts = t.split('/').filter(Boolean);
    if (!parts.length || !LOGIN.test(parts[0])) return '';
    if (parts.length === 1) return parts[0];
    const repo = parts[1].replace(/\.git$/, '');
    return REPO.test(repo) && repo !== '.' && repo !== '..' ? `${parts[0]}/${repo}` : parts[0];
  }
  const avatarOf = (owner, size = 64) => `https://github.com/${encodeURIComponent(owner)}.png?size=${size}`;

  // ─────────────────────────────────────────────── gallery feed (one fetch per page)
  let galleryP = null;
  function gallery() {
    if (!galleryP) {
      galleryP = fetch('/api/gallery').then(r => (r.ok ? r.json() : { featured: [], recent: [] })).catch(() => ({ featured: [], recent: [] }))
        .then(g => {
          const seen = new Set(), all = [];
          for (const e of [...(g.featured || []), ...(g.recent || [])]) if (!seen.has(e.key)) { seen.add(e.key); all.push(e); }
          return { featured: g.featured || [], recent: g.recent || [], all };
        });
    }
    return galleryP;
  }
  const kindLabel = k => (k === 'org' ? 'org' : k === 'repo' ? 'repo' : 'person');

  // ─────────────────────────────────────────────── omnibox
  /** Wire a commit.city/<target> input. By default it navigates; `onGo(target, whole)` takes over instead. */
  function omnibox(form, opts = {}) {
    const input = $('input[type="text"], input:not([type])', form);
    const av = $('.av', form);
    const allBox = $('.opt', form);
    const pop = document.createElement('div');
    pop.className = 'pop'; pop.hidden = true; pop.setAttribute('role', 'listbox');
    form.appendChild(pop);
    input.setAttribute('role', 'combobox'); input.setAttribute('aria-autocomplete', 'list'); input.setAttribute('aria-expanded', 'false');
    let items = [], sel = -1, avTimer = 0, lastOwner = '';

    const go = (t, whole) => {
      if (!t) { input.focus(); form.classList.add('shake'); setTimeout(() => form.classList.remove('shake'), 400); return; }
      if (opts.onGo) { close(); input.value = t; return opts.onGo(t, whole); }
      location.href = `/${t}${whole && t.includes('/') ? '?all=1' : ''}`;
    };
    const close = () => { pop.hidden = true; sel = -1; input.setAttribute('aria-expanded', 'false'); };
    const mark = () => $$('a', pop).forEach((a, i) => a.setAttribute('aria-selected', String(i === sel)));

    async function suggest() {
      const raw = input.value.trim();
      const t = parse(raw);
      const owner = t.split('/')[0];
      // the avatar of whoever is being typed, straight from GitHub (no API call)
      clearTimeout(avTimer);
      if (av) {
        if (!owner) { av.hidden = true; lastOwner = ''; }
        else if (owner !== lastOwner) avTimer = setTimeout(() => {
          lastOwner = owner;
          const img = new Image();
          img.onload = () => { if (parse(input.value).split('/')[0] === owner) { av.src = img.src; av.hidden = false; } };
          img.onerror = () => { if (lastOwner === owner) av.hidden = true; };
          img.src = avatarOf(owner);
        }, 260);
      }
      if (allBox) allBox.hidden = !t.includes('/');
      if (!raw) return close();
      const g = await gallery();
      const q = raw.toLowerCase().replace(/^@/, '');
      const hits = g.all.filter(e => e.target.toLowerCase().includes(t.toLowerCase() || q)).slice(0, 5);
      items = [];
      if (t && !hits.some(e => e.target.toLowerCase() === t.toLowerCase())) items.push({ t, fresh: true });
      for (const e of hits) items.push({ t: e.target, e });
      if (!items.length) return close();
      pop.innerHTML = (items[0].fresh ? '' : '<div class="hd">Already built · opens instantly</div>') + items.map((it, i) => {
        if (it.fresh) {
          return `<a href="/${esc(it.t)}" data-i="${i}" role="option"><span class="ico">→</span><span class="t">commit.city/${esc(it.t)}</span>
            <span class="k">${it.t.includes('/') ? 'repo' : 'person or org'} · build</span></a>${hits.length ? '<div class="hd">Already built · opens instantly</div>' : ''}`;
        }
        const e = it.e;
        return `<a href="/${esc(e.target)}" data-i="${i}" role="option"><img src="${esc(e.avatar)}${e.avatar.includes('?') ? '&' : '?'}s=48" alt="" loading="lazy">
          <span class="t">${esc(e.target)}</span><span class="k fast">${kindLabel(e.kind)} · ${compact(e.commits)} commits</span></a>`;
      }).join('');
      sel = -1; mark();
      pop.hidden = false; input.setAttribute('aria-expanded', 'true');
    }

    input.addEventListener('input', suggest);
    input.addEventListener('focus', () => { if (input.value.trim()) suggest(); });
    input.addEventListener('paste', () => setTimeout(() => { const t = parse(input.value); if (t && t !== input.value) { input.value = t; suggest(); } }, 0));
    input.addEventListener('keydown', e => {
      if (pop.hidden) return;
      const n = items.length;
      if (e.key === 'ArrowDown') { e.preventDefault(); sel = (sel + 1) % n; mark(); }
      else if (e.key === 'ArrowUp') { e.preventDefault(); sel = (sel - 1 + n) % n; mark(); }
      else if (e.key === 'Escape') close();
    });
    pop.addEventListener('mousedown', e => e.preventDefault());
    pop.addEventListener('click', e => {
      const a = e.target.closest('a[data-i]');
      if (a && opts.onGo) { e.preventDefault(); go(items[+a.dataset.i].t, false); }
    });
    document.addEventListener('click', e => { if (!form.contains(e.target)) close(); });
    form.addEventListener('submit', e => {
      e.preventDefault();
      const whole = allBox ? $('input', allBox)?.checked : false;
      if (!pop.hidden && sel >= 0 && items[sel]) return go(items[sel].t, whole);
      go(parse(input.value), whole);
    });
    return { input, set(v) { input.value = v; suggest(); } };
  }

  // ─────────────────────────────────────────────── copy buttons: <button class="copy" data-copy="#id|text">
  async function copyText(text, btn) {
    let ok = false;
    try { await navigator.clipboard.writeText(text); ok = true; } catch {
      const ta = document.createElement('textarea');
      ta.value = text; ta.style.position = 'fixed'; ta.style.opacity = '0';
      document.body.appendChild(ta); ta.select();
      try { ok = document.execCommand('copy'); } catch { ok = false; }
      ta.remove();
    }
    if (btn) {
      const was = btn.dataset.label || btn.textContent;
      btn.dataset.label = was;
      btn.textContent = ok ? 'Copied' : 'Press ⌘C';
      btn.classList.toggle('ok', ok);
      clearTimeout(btn._t);
      btn._t = setTimeout(() => { btn.textContent = was; btn.classList.remove('ok'); }, 1600);
    }
    return ok;
  }
  document.addEventListener('click', e => {
    const b = e.target.closest('[data-copy]');
    if (!b) return;
    const src = b.dataset.copy;
    const text = src.startsWith('#') ? ($(src)?.textContent ?? '') : src;
    copyText(text.trim(), b);
  });

  function toast(msg, ms = 2600) {
    let host = $('.toasts');
    if (!host) { host = document.createElement('div'); host.className = 'toasts'; host.setAttribute('aria-live', 'polite'); document.body.appendChild(host); }
    const t = document.createElement('div');
    t.className = 'toast'; t.textContent = msg;
    host.appendChild(t);
    setTimeout(() => { t.classList.add('out'); setTimeout(() => t.remove(), 350); }, ms);
  }

  // ─────────────────────────────────────────────── chrome: nav, stars, session, reveal
  const nav = $('.nav');
  if (nav) {
    const onScroll = () => nav.classList.toggle('scrolled', scrollY > 8);
    addEventListener('scroll', onScroll, { passive: true }); onScroll();
    const burger = $('.burger', nav);
    if (burger) burger.addEventListener('click', () => { const o = nav.classList.toggle('open'); burger.setAttribute('aria-expanded', String(o)); });
    const here = location.pathname.replace(/\/$/, '') || '/';
    $$('.links a', nav).forEach(a => { if (a.getAttribute('href') === here) a.setAttribute('aria-current', 'page'); });
  }
  const cookie = name => { const m = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`)); return m ? decodeURIComponent(m[1]) : null; };
  const me = cookie('cc_user');
  if (me && LOGIN.test(me)) {
    $$('[data-me]').forEach(el => {
      el.innerHTML = `<img src="${avatarOf(me, 52)}" alt="">${esc(me)}`;
      el.href = `/${me}`; el.title = 'Your city'; el.hidden = false;
    });
  }
  const starEls = $$('[data-stars]');
  if (starEls.length) {
    fetch('/api/stars').then(r => (r.ok ? r.json() : null)).then(s => {
      if (s && s.stars) starEls.forEach(el => { el.textContent = compact(s.stars); el.hidden = false; });
    }).catch(() => {});
  }
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { rootMargin: '0px 0px -8% 0px' });
    $$('.rv').forEach(el => io.observe(el));
  } else $$('.rv').forEach(el => el.classList.add('in'));
  $$('form[data-omni]').forEach(omnibox);
  if (/[?&]signin=/.test(location.search)) history.replaceState(null, '', location.pathname);

  /** A gallery tile for a built city. */
  function tile(e, opts = {}) {
    const n = e.kind === 'repo' ? e.target : e.target;
    const agent = e.agent || 0, bot = e.bot || 0;
    const human = Math.max(0, 1 - agent - bot);
    const split = (agent || bot) ? `<div class="split" title="${Math.round(human * 100)}% human · ${Math.round(bot * 100)}% bots · ${Math.round(agent * 100)}% AI agents">
      <span class="h" style="flex-grow:${human}"></span><span class="b" style="flex-grow:${bot}"></span><span class="a" style="flex-grow:${agent}"></span></div>` : '';
    return `<a class="tile" href="/${esc(n)}"><div class="sky"><img src="/api/card?t=${encodeURIComponent(e.target)}&layout=thumb&v=${e.v || 0}" alt="" loading="lazy" decoding="async">
      <span class="badge">${kindLabel(e.kind)}</span>${agent >= 0.01 ? `<span class="badge ag">${Math.round(agent * 100)}% agent</span>` : ''}</div>
      <div class="meta"><img class="${e.kind === 'user' ? '' : 'sq'}" src="${esc(e.avatar)}${String(e.avatar).includes('?') ? '&' : '?'}s=64" alt="" loading="lazy">
      <div><b>${esc(e.target)}</b><small>${compact(e.commits)} commits · ${e.repos} repo${e.repos === 1 ? '' : 's'} · ${compact(e.lines)} lines</small></div></div>${opts.split === false ? '' : split}</a>`;
  }
  const skeleton = n => Array.from({ length: n }, () => '<div class="tile skel"><div class="sky"></div><div class="meta"><div><b>…</b><small>…</small></div></div></div>').join('');

  window.CCSite = { $, $$, esc, fmt, compact, parse, avatarOf, gallery, omnibox, copyText, toast, tile, skeleton, kindLabel, me };
})();
