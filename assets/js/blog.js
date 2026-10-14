/* ==========================================================
   Eat Easily — blog listing (ایت مگ)
   • cardHTML() is shared with tools/build-blog.js (Node), so the
     crawlable HTML written into blog.html is identical to what the
     browser renders.
   • Browser part: category / reading-time filters, sort, title search,
     URL state and infinite scroll (IntersectionObserver).
   ========================================================== */
(function (root) {
  'use strict';

  const DATA = root.EE_BLOG || (typeof require === 'function' ? require('./blog-data.js') : null);
  const CATS = DATA.cats;
  const ALL = DATA.articles;
  const BATCH = 8;

  /* ---------- helpers ---------- */
  const DIG = '۰۱۲۳۴۵۶۷۸۹';
  const fa = n => String(n).replace(/\d/g, d => DIG[d]);
  const num = n => fa(String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, '٬'));
  const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const dateFmt = new Intl.DateTimeFormat('fa-IR-u-ca-persian-nu-latn', { year: 'numeric', month: '2-digit', day: '2-digit' });
  const jdate = iso => fa(dateFmt.formatToParts(new Date(iso + 'T12:00:00Z')).filter(p => p.type !== 'literal').map(p => p.value).join('/'));
  const catOf = id => CATS.find(c => c.id === id) || CATS[0];
  // Persian-friendly normalisation: unify ی/ک, drop spaces / ZWNJ / digits style
  const norm = s => String(s).toLowerCase()
    .replace(/[يى]/g, 'ی').replace(/[كڪ]/g, 'ک')
    .replace(/[۰-۹]/g, d => DIG.indexOf(d)).replace(/[٠-٩]/g, d => '٠١٢٣٤٥٦٧٨٩'.indexOf(d))
    .replace(/[\s\u200c\u200f\u200e\u064b-\u065f]/g, '');

  const I = {
    medical: '<path d="M20.8 8.7c0 5-8.8 11-8.8 11s-8.8-6-8.8-11A4.7 4.7 0 0 1 12 6.1a4.7 4.7 0 0 1 8.8 2.6Z"/>',
    nutrition: '<path d="M20 4C9 4 4 9 5 16c1 4 5 5 8 3 5-3 7-8 7-15Z"/><path d="M4 21c3-5 7-8 12-11"/>',
    diets: '<path d="M4 11h16c0 5-3.6 9-8 9s-8-4-8-9Z"/><path d="M7 8c-1-2 1-3 0-5m5 5c-1-2 1-3 0-5m5 5c-1-2 1-3 0-5"/>',
    psychology: '<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>',
    workout: '<path d="M13 2 4 14h7l-1 8 10-13h-7l0-7Z"/>'
  };
  const M = {
    clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
    text: '<path d="M4 6h16M4 12h16M4 18h10"/>',
    eye: '<path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12Z"/><circle cx="12" cy="12" r="3"/>',
    heart: '<path d="M20.8 8.7c0 5-8.8 11-8.8 11s-8.8-6-8.8-11A4.7 4.7 0 0 1 12 6.1a4.7 4.7 0 0 1 8.8 2.6Z"/>'
  };
  const svg = p => '<svg viewBox="0 0 24 24" aria-hidden="true">' + p + '</svg>';

  /* ---------- card template (shared with the Node build) ---------- */
  function cardHTML(a, animate) {
    const c = catOf(a.cat);
    return '<li class="bl-item"><article class="bl-card glass-panel' + (animate ? ' bl-in' : '') + '" data-id="' + esc(a.id) + '">' +
      '<a class="bl-tile bl-tile--' + c.tone + '" href="' + esc(a.url) + '" tabindex="-1" aria-hidden="true">' + svg(I[a.cat] || I.medical) + '</a>' +
      '<div class="bl-body">' +
      '<div class="bl-top"><a class="bl-cat" href="' + esc(c.url) + '">' + esc(c.name) + '</a><time datetime="' + esc(a.date) + '">' + jdate(a.date) + '</time></div>' +
      '<h2 class="bl-title"><a href="' + esc(a.url) + '">' + esc(a.title) + '</a></h2>' +
      '<p class="bl-desc">' + esc(a.desc) + '</p>' +
      '<ul class="bl-meta">' +
      '<li>' + svg(M.clock) + '<span>' + num(a.min) + ' دقیقه مطالعه</span></li>' +
      '<li>' + svg(M.text) + '<span>' + num(a.words) + ' کلمه</span></li>' +
      '<li>' + svg(M.eye) + '<span>' + num(a.views) + ' بازدید</span></li>' +
      '<li>' + svg(M.heart) + '<span>' + num(a.likes) + ' پسند</span></li>' +
      '</ul></div></article></li>';
  }

  /* ---------- filtering + sorting ---------- */
  const SORTS = {
    newest: (a, b) => b.date.localeCompare(a.date),
    popular: (a, b) => b.likes - a.likes,
    views_desc: (a, b) => b.views - a.views,
    views_asc: (a, b) => a.views - b.views,
    long: (a, b) => b.words - a.words,
    short: (a, b) => a.words - b.words,
    time_desc: (a, b) => b.min - a.min || b.words - a.words,
    time_asc: (a, b) => a.min - b.min || a.words - b.words
  };
  const TIMES = {
    all: () => true,
    s: a => a.min <= 5,
    m: a => a.min > 5 && a.min <= 10,
    l: a => a.min > 10
  };
  function query(state) {
    const q = norm(state.q || '');
    const sorter = SORTS[state.sort] || SORTS.newest;
    return ALL.filter(a =>
      (state.cat === 'all' || a.cat === state.cat) &&
      (TIMES[state.time] || TIMES.all)(a) &&
      (!q || norm(a.title).includes(q))
    ).sort((a, b) => sorter(a, b) || b.date.localeCompare(a.date));
  }

  const api = { cardHTML, query, jdate, num, fa, CATS, ALL, BATCH };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  root.EEBlog = api;

  /* ======================= browser UI ======================= */
  if (typeof document === 'undefined') return;

  const list = document.getElementById('bl-list');
  if (!list) return;
  const qInput = document.getElementById('bl-q');
  const sortSel = document.getElementById('bl-sort');
  const timeSel = document.getElementById('bl-time');
  const chips = [...document.querySelectorAll('.bl-chip')];
  const statusEl = document.getElementById('bl-status');
  const resetBtn = document.getElementById('bl-reset');
  const emptyEl = document.getElementById('bl-empty');
  const loader = document.getElementById('bl-loader');
  const endEl = document.getElementById('bl-end');
  const moreBtn = document.getElementById('bl-more');
  const sentinel = document.getElementById('bl-sentinel');
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const DEFAULT = { q: '', cat: 'all', sort: 'newest', time: 'all' };

  const state = Object.assign({}, DEFAULT);
  const params = new URLSearchParams(location.search);
  if (params.get('q')) state.q = params.get('q').slice(0, 80);
  if (CATS.some(c => c.id === params.get('cat'))) state.cat = params.get('cat');
  if (SORTS[params.get('sort')]) state.sort = params.get('sort');
  if (TIMES[params.get('time')]) state.time = params.get('time');

  let results = [];
  let shown = 0;
  let busy = false;
  const isDefault = () => Object.keys(DEFAULT).every(k => state[k] === DEFAULT[k]);

  function syncControls() {
    qInput.value = state.q;
    sortSel.value = state.sort;
    timeSel.value = state.time;
    chips.forEach(ch => ch.setAttribute('aria-pressed', String(ch.dataset.cat === state.cat)));
  }
  function syncURL() {
    const p = new URLSearchParams();
    Object.keys(DEFAULT).forEach(k => { if (state[k] !== DEFAULT[k]) p.set(k, state[k]); });
    const qs = p.toString();
    history.replaceState(null, '', location.pathname + (qs ? '?' + qs : '') + location.hash);
  }
  function updateStatus() {
    const total = results.length;
    statusEl.innerHTML = isDefault()
      ? '<strong>' + num(total) + '</strong> مقاله'
      : '<strong>' + num(total) + '</strong> مقاله از ' + num(ALL.length) + ' مقاله پیدا شد';
    resetBtn.hidden = isDefault();
    emptyEl.hidden = total !== 0;
  }
  function updateTail() {
    const more = shown < results.length;
    endEl.hidden = more || results.length === 0;
    if (!('IntersectionObserver' in window)) moreBtn.hidden = !more;
    else moreBtn.hidden = true;
  }
  function append(animate) {
    const next = results.slice(shown, shown + BATCH);
    list.insertAdjacentHTML('beforeend', next.map(a => cardHTML(a, animate && !reduce)).join(''));
    shown += next.length;
    updateTail();
  }
  function loadMore() {
    if (busy || shown >= results.length) return;
    busy = true;
    loader.hidden = false;
    // a short pause so the loader is perceptible and scrolling stays smooth
    setTimeout(() => {
      append(true);
      loader.hidden = true;
      busy = false;
      if (io) { io.unobserve(sentinel); io.observe(sentinel); } // re-check if still in view
    }, reduce ? 0 : 260);
  }
  function apply(fromStatic) {
    results = query(state);
    if (!fromStatic) {
      list.innerHTML = '';
      shown = 0;
      append(false);
    } else {
      shown = list.children.length;
      updateTail();
    }
    updateStatus();
    syncURL();
    if (io) { io.unobserve(sentinel); io.observe(sentinel); }
  }

  let io = null;
  if ('IntersectionObserver' in window) {
    io = new IntersectionObserver(entries => { if (entries[0].isIntersecting) loadMore(); }, { rootMargin: '0px 0px 700px 0px' });
    io.observe(sentinel);
  }
  moreBtn.addEventListener('click', loadMore);

  /* ---------- controls ---------- */
  let t;
  qInput.addEventListener('input', () => {
    clearTimeout(t);
    t = setTimeout(() => { state.q = qInput.value.trim(); apply(false); }, 180);
  });
  qInput.form && qInput.form.addEventListener('submit', e => e.preventDefault());
  sortSel.addEventListener('change', () => { state.sort = sortSel.value; apply(false); });
  timeSel.addEventListener('change', () => { state.time = timeSel.value; apply(false); });
  chips.forEach(ch => ch.addEventListener('click', () => {
    state.cat = ch.dataset.cat;
    syncControls();
    apply(false);
  }));
  const reset = () => {
    Object.assign(state, DEFAULT);
    syncControls();
    apply(false);
    qInput.focus({ preventScroll: true });
  };
  resetBtn.addEventListener('click', reset);
  document.getElementById('bl-empty-reset')?.addEventListener('click', reset);

  /* ---------- init ---------- */
  syncControls();
  // Default view: keep the server-rendered cards (no flash, no re-render).
  apply(isDefault() && list.children.length > 0);
})(typeof window !== 'undefined' ? window : globalThis);
