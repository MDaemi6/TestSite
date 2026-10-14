/* TEMPORARY page switcher — remove this file and its <script> tag when done. */
(() => {
  'use strict';
  const PAGES = [
    { href: 'index.html', label: 'صفحه اصلی' },
    { href: 'complications.html', label: 'عوارض لاغری' },
    { href: 'quiz.html', label: 'آزمون' },
    { href: 'about-us.html', label: 'درباره ما' },
    { href: 'contact-us.html', label: 'تماس با ما' },
    { href: 'blog.html', label: 'مقالات (بلاگ)' }
  ];
  const cur = (location.pathname.split('/').pop() || 'index.html').toLowerCase();
  const css = `
  .dsw{position:fixed;top:6px;right:6px;z-index:2147483000;font-family:Vazirmatn,Tahoma,sans-serif;direction:rtl}
  .dsw__btn{width:34px;height:34px;border-radius:11px;border:0;background:#f59e0b;color:#1f2937;display:grid;place-items:center;cursor:pointer;box-shadow:0 6px 16px rgba(31,41,55,.25);opacity:.92}
  .dsw__btn:hover,.dsw__btn[aria-expanded="true"]{opacity:1}
  .dsw__btn svg{width:18px;height:18px}
  .dsw__menu{position:absolute;top:40px;right:0;min-width:170px;padding:6px;border-radius:14px;background:#fff;color:#1f2937;box-shadow:0 14px 40px rgba(31,41,55,.25);border:1px solid rgba(31,41,55,.08)}
  .dsw__menu[hidden]{display:none}
  .dsw__menu a{display:flex;align-items:center;gap:8px;min-height:44px;padding:0 12px;border-radius:10px;color:inherit;text-decoration:none;font-size:14px}
  .dsw__menu a:hover{background:#eff6ff}
  .dsw__menu a[aria-current="page"]{background:#2563eb;color:#fff;font-weight:700}
  .dsw__tag{padding:4px 12px 6px;font-size:11px;color:#6b7280}
  @media(prefers-color-scheme:dark){.dsw__menu{background:#1f2937;color:#ebeef2;border-color:rgba(255,255,255,.1)}.dsw__menu a:hover{background:#273449}.dsw__tag{color:#9ca3af}}
  :root[data-theme="dark"] .dsw__menu{background:#1f2937;color:#ebeef2}
  :root[data-theme="light"] .dsw__menu{background:#fff;color:#1f2937}`;
  const st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);
  const box = document.createElement('div'); box.className = 'dsw';
  box.innerHTML = `<button class="dsw__btn" type="button" aria-label="تغییر صفحه" aria-expanded="false" aria-haspopup="true">
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/></svg></button>
    <nav class="dsw__menu" hidden aria-label="صفحات"><div class="dsw__tag">منوی موقت صفحات</div>${PAGES.map(p => `<a href="${p.href}"${p.href === cur ? ' aria-current="page"' : ''}>${p.label}</a>`).join('')}</nav>`;
  document.body.appendChild(box);
  const btn = box.querySelector('button'), menu = box.querySelector('nav');
  const set = o => { menu.hidden = !o; btn.setAttribute('aria-expanded', String(o)); };
  btn.addEventListener('click', e => { e.stopPropagation(); set(menu.hidden); });
  document.addEventListener('click', e => { if (!box.contains(e.target)) set(false); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') set(false); });
})();
