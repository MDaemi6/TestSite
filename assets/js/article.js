(() => {
  'use strict';
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Tabs (latest articles / categories) ---------- */
  document.querySelectorAll('.art-tablist').forEach(list => {
    const tabs = [...list.querySelectorAll('[role="tab"]')];
    const select = (tab, focus) => {
      tabs.forEach(t => {
        const on = t === tab;
        t.setAttribute('aria-selected', String(on));
        t.tabIndex = on ? 0 : -1;
        const panel = document.getElementById(t.getAttribute('aria-controls'));
        if (panel) panel.hidden = !on;
      });
      if (focus) tab.focus();
    };
    tabs.forEach((tab, i) => {
      tab.addEventListener('click', () => select(tab, false));
      tab.addEventListener('keydown', e => {
        // RTL: ArrowRight goes to the previous tab, ArrowLeft to the next one.
        let n = null;
        if (e.key === 'ArrowLeft') n = tabs[(i + 1) % tabs.length];
        else if (e.key === 'ArrowRight') n = tabs[(i - 1 + tabs.length) % tabs.length];
        else if (e.key === 'Home') n = tabs[0];
        else if (e.key === 'End') n = tabs[tabs.length - 1];
        if (n) { e.preventDefault(); select(n, true); }
      });
    });
  });

  /* ---------- Table of contents ---------- */
  const toc = document.getElementById('toc');
  if (!toc) return;
  const links = [...toc.querySelectorAll('a[href^="#"]')];
  const byId = new Map(links.map(a => [decodeURIComponent(a.getAttribute('href').slice(1)), a]));
  const heads = [...byId.keys()].map(id => document.getElementById(id)).filter(Boolean);
  const mobileQ = window.matchMedia('(max-width: 900px)');

  // Collapsible on mobile, always open on desktop.
  const syncOpen = () => { toc.open = !mobileQ.matches ? true : toc.open && toc.dataset.userOpened === '1'; };
  toc.open = !mobileQ.matches;
  mobileQ.addEventListener?.('change', syncOpen);
  const summary = toc.querySelector('summary');
  summary?.addEventListener('click', e => {
    if (!mobileQ.matches) { e.preventDefault(); return; }
    toc.dataset.userOpened = toc.open ? '0' : '1';
  });

  // Scroll-spy.
  const scroller = toc.querySelector('.toc__scroll');
  let current = null;
  const setActive = id => {
    if (id === current) return;
    current = id;
    links.forEach(a => {
      const on = byId.get(id) === a;
      a.classList.toggle('is-active', on);
      if (on) a.setAttribute('aria-current', 'location'); else a.removeAttribute('aria-current');
    });
    const a = byId.get(id);
    if (a && scroller && scroller.scrollHeight > scroller.clientHeight) {
      const top = a.offsetTop - scroller.clientHeight / 2 + a.clientHeight / 2;
      scroller.scrollTo({ top, behavior: reduce ? 'auto' : 'smooth' });
    }
  };
  const update = () => {
    const offset = mobileQ.matches ? 190 : 150;
    let id = heads.length ? heads[0].id : null;
    for (const h of heads) { if (h.getBoundingClientRect().top - offset <= 0) id = h.id; else break; }
    if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4 && heads.length) id = heads[heads.length - 1].id;
    if (id) setActive(id);
  };
  let ticking = false;
  window.addEventListener('scroll', () => {
    if (ticking) return; ticking = true;
    requestAnimationFrame(() => { update(); ticking = false; });
  }, { passive: true });
  window.addEventListener('resize', update);
  update();

  // Keyboard/screen-reader users land on the heading they chose.
  links.forEach(a => a.addEventListener('click', () => {
    const target = document.getElementById(decodeURIComponent(a.getAttribute('href').slice(1)));
    if (target) { target.setAttribute('tabindex', '-1'); setTimeout(() => target.focus({ preventScroll: true }), 50); }
    if (mobileQ.matches) { toc.open = false; toc.dataset.userOpened = '0'; }
  }));
})();
