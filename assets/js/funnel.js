/* ==========================================================
   Eat Easily — purchase funnel logic (steps 1–4)
   Step 1 keeps the ORIGINAL landing/v2 logic (tracking, login redirect,
   payment API) — only the UI around it was redesigned.
   Steps 2–4 are a CONCEPT: they run client-side with sample data.
   ========================================================== */
(() => {
  'use strict';
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const DIG = '۰۱۲۳۴۵۶۷۸۹';
  const fa = n => String(n).replace(/\d/g, d => DIG[d]).replace('.', '٫');
  const num = n => fa(String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, '٬'));
  const toEn = v => String(v).replace(/[۰-۹]/g, d => DIG.indexOf(d)).replace(/[٠-٩]/g, d => '٠١٢٣٤٥٦٧٨٩'.indexOf(d)).replace(/٫/g, '.');
  const PLANS = {
    'plan-101': { name: 'برنامه ۱۰۱ روزه (VIP)', days: 101, price: 994000 },
    'plan-21': { name: 'برنامه ۲۱ روزه', days: 21, price: 490000 }
  };
  const planKey = (() => {
    const k = new URLSearchParams(location.search).get('plan');
    return PLANS[k] ? k : 'plan-101';
  })();
  const plan = PLANS[planKey];

  /* ---------- theme toggle (same key as the main site) ---------- */
  (() => {
    const root = document.documentElement, btn = $('#theme-toggle'), meta = $('#meta-theme-color');
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const cur = () => root.getAttribute('data-theme') || (mq.matches ? 'dark' : 'light');
    const sync = () => {
      const d = cur() === 'dark';
      if (btn) { btn.setAttribute('aria-pressed', String(d)); btn.setAttribute('aria-label', d ? 'تغییر تم به حالت روشن' : 'تغییر تم به حالت تاریک'); }
      if (meta) meta.setAttribute('content', d ? '#0f141c' : '#eff6ff');
    };
    sync();
    btn && btn.addEventListener('click', () => {
      const next = cur() === 'dark' ? 'light' : 'dark';
      root.setAttribute('data-theme', next);
      try { localStorage.setItem('ee-theme', next); } catch (e) {}
      sync();
    });
  })();

  /* ---------- fill plan summary (steps 2–4) ---------- */
  $$('[data-plan-name]').forEach(el => { el.textContent = plan.name; });
  $$('[data-plan-days]').forEach(el => { el.textContent = fa(plan.days) + ' روز'; });
  $$('[data-plan-price]').forEach(el => { el.textContent = num(plan.price) + ' تومان'; });
  $$('[data-keep-plan]').forEach(a => {
    const u = new URL(a.getAttribute('href'), location.href);
    u.searchParams.set('plan', planKey);
    a.setAttribute('href', u.pathname.split('/').pop() + u.search);
  });

  /* =====================================================
     STEP 1 — plan selection  (original logic preserved)
     ===================================================== */
  if ($('.fn-plans')) {
    const PENDING = 'landing_v2_pending_package_key';
    const SESSION = 'landing_v2_session_key';
    // On the real l.eateasily.net the real API is used; anywhere else
    // (local preview / test site) the button just opens step 2.
    const LIVE = /(^|\.)eateasily\.net$/.test(location.hostname) && location.hostname.startsWith('l.');

    const sessionKey = () => {
      try {
        let sk = localStorage.getItem(SESSION);
        if (!sk && window.crypto && crypto.randomUUID) { sk = crypto.randomUUID(); localStorage.setItem(SESSION, sk); }
        return sk;
      } catch (e) { return null; }
    };
    const sourceUrl = () => {
      try {
        const u = new URL(location.pathname + location.search, location.origin);
        u.searchParams.delete('auth_token');
        return u.pathname + u.search;
      } catch (e) { return location.pathname + location.search; }
    };
    const track = (event, extra) => {
      if (!LIVE) return Promise.resolve();
      const sk = sessionKey();
      if (!sk) return Promise.resolve();
      return fetch('/api/landing/v2/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(Object.assign({ session_key: sk, event }, extra || {}))
      }).catch(() => {});
    };
    const token = () => {
      const m = document.cookie.match(/(?:^|; )access_token=([^;]*)/);
      if (m && m[1]) return decodeURIComponent(m[1]);
      const st = localStorage.getItem('access_token');
      if (st) {
        const week = 60 * 60 * 24 * 7;
        document.cookie = 'access_token=' + encodeURIComponent(st) + '; Path=/; Max-Age=' + week + '; Expires=' + new Date(Date.now() + week * 1000).toUTCString() + '; SameSite=Lax';
      }
      return st;
    };
    const redirectToLogin = key => {
      const back = '/landing/v2/redirect-to-payment.html' + (key ? '?package_key=' + encodeURIComponent(key) : '');
      location.assign('/user-login?redirect=' + encodeURIComponent(back));
    };
    const setBtn = (btn, busy) => {
      if (!btn) return;
      if (busy) { btn.disabled = true; btn.dataset.t = btn.innerHTML; btn.textContent = 'در حال انتقال به درگاه…'; }
      else { btn.disabled = false; if (btn.dataset.t) btn.innerHTML = btn.dataset.t; }
    };

    function goToPayment(key, btn) {
      setBtn(btn, true);
      track('click_plan', { package_key: key }).finally(() => {
        if (!LIVE) { location.assign('landing-medical.html?plan=' + encodeURIComponent(key)); return; }
        const tk = token();
        if (!tk) {
          setBtn(btn, false);
          try { localStorage.setItem(PENDING, key); } catch (e) {}
          redirectToLogin(key);
          return;
        }
        fetch('/api/landing/payment', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Accept: 'application/json', Authorization: 'Bearer ' + tk },
          body: JSON.stringify({ package_key: key, session_key: sessionKey() || undefined, landing_source_url: sourceUrl() })
        })
          .then(r => {
            if (r.status === 401) { try { localStorage.setItem(PENDING, key); } catch (e) {} redirectToLogin(key); return null; }
            if (!r.ok) throw new Error('payment_request_failed_' + r.status);
            return r.json();
          })
          .catch(err => { console.log(err.message); })
          .then(data => {
            if (data && data.payment_url) { try { localStorage.removeItem(PENDING); } catch (e) {} location.assign(data.payment_url); }
            else setBtn(btn, false);
          });
      });
    }
    $$('[data-pay]').forEach(b => b.addEventListener('click', () => goToPayment(b.dataset.pay, b)));
    track('page_view', { landing_source_url: sourceUrl() });

    /* countdown — the end time is remembered, so a refresh does not restart it */
    const KEY = 'ee_landing_deadline';
    let end = 0;
    try { end = Number(localStorage.getItem(KEY)) || 0; } catch (e) {}
    if (end < Date.now() - 1000 * 60 * 60 * 12 || !end) {
      end = Date.now() + 25 * 60 * 1000;
      try { localStorage.setItem(KEY, String(end)); } catch (e) {}
    }
    const h = $('#t-h'), m = $('#t-m'), s = $('#t-s'), box = $('.fn-timer');
    const tick = () => {
      const left = Math.max(0, Math.round((end - Date.now()) / 1000));
      h.textContent = fa(String(Math.floor(left / 3600)).padStart(2, '0'));
      m.textContent = fa(String(Math.floor((left % 3600) / 60)).padStart(2, '0'));
      s.textContent = fa(String(left % 60).padStart(2, '0'));
      box.classList.toggle('is-over', left === 0);
    };
    tick();
    setInterval(tick, 1000);

    /* sticky buy bar on mobile: show after the hero scrolls away */
    const bar = $('.fn-bar'), anchor = $('.fn-plans');
    if (bar && 'IntersectionObserver' in window) {
      document.body.classList.add('has-fnbar');
      const io = new IntersectionObserver(es => {
        const e = es[0];
        // visible while the plans are NOT in view and we're above them (i.e. before choosing)
        bar.classList.toggle('is-on', !e.isIntersecting && e.boundingClientRect.top > 0);
      }, { threshold: 0.05 });
      io.observe(anchor);
    }
  }

  /* =====================================================
     STEP 2 — medical screening (concept)
     ===================================================== */
  const form = $('#fn-medical');
  if (form) {
    const hEl = $('#md-h'), wEl = $('#md-w'), bmi = $('#md-bmi'), bmiNote = $('#md-bmi-note');
    const calc = () => {
      const h = parseFloat(toEn(hEl.value)) / 100, w = parseFloat(toEn(wEl.value));
      if (h > 0.9 && w > 20) { bmi.textContent = fa((w / (h * h)).toFixed(1)); bmiNote.textContent = 'شاخص توده بدنی شما'; }
      else { bmi.textContent = '—'; bmiNote.textContent = 'قد و وزن را وارد کنید تا BMI محاسبه شود'; }
    };
    [hEl, wEl].forEach(el => el.addEventListener('input', calc));
    const setErr = (el, t) => {
      const o = document.getElementById(el.id + '-e');
      if (o) o.textContent = t || '';
      t ? el.setAttribute('aria-invalid', 'true') : el.removeAttribute('aria-invalid');
      return !t;
    };
    const range = (el, min, max, msg) => { const v = parseFloat(toEn(el.value)); return setErr(el, !(v >= min && v <= max) ? msg : ''); };
    form.addEventListener('submit', e => {
      e.preventDefault();
      const checks = [
        [range($('#md-age'), 18, 90, 'سن باید بین ۱۸ تا ۹۰ سال باشد.'), $('#md-age')],
        [range(hEl, 120, 230, 'قد را به سانتی‌متر وارد کنید (۱۲۰ تا ۲۳۰).'), hEl],
        [range(wEl, 35, 300, 'وزن را به کیلوگرم وارد کنید (۳۵ تا ۳۰۰).'), wEl]
      ];
      const bad = checks.find(c => !c[0]);
      const agree = $('#md-agree');
      const okAgree = agree.checked;
      $('#md-agree-e').textContent = okAgree ? '' : 'برای ادامه، تأیید این مورد لازم است.';
      if (bad) { bad[1].focus(); return; }
      if (!okAgree) { agree.focus(); return; }
      try {
        sessionStorage.setItem('ee_concept_profile', JSON.stringify({ h: toEn(hEl.value), w: toEn(wEl.value), plan: planKey }));
      } catch (err) {}
      location.assign('landing-plan.html?plan=' + planKey);
    });
  }

  /* =====================================================
     STEP 3 — plan delivery (concept)
     ===================================================== */
  const tabs = $$('.fn-day');
  if (tabs.length) {
    const panels = $$('[data-day-panel]');
    const open = i => {
      tabs.forEach((t, k) => t.setAttribute('aria-selected', String(k === i)));
      panels.forEach((p, k) => { p.hidden = k !== i; });
    };
    tabs.forEach((t, i) => {
      t.addEventListener('click', () => open(i));
      t.addEventListener('keydown', e => {
        if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
          const n = (i + (e.key === 'ArrowLeft' ? 1 : -1) + tabs.length) % tabs.length;
          open(n); tabs[n].focus();
        }
      });
    });
    open(0);
    const d = $('#fn-start-date');
    if (d) {
      const f = new Intl.DateTimeFormat('fa-IR-u-ca-persian-nu-latn', { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' });
      $$('[data-start]').forEach(b => b.addEventListener('click', () => {
        const dt = new Date(Date.now() + Number(b.dataset.start) * 86400000);
        d.textContent = fa(f.format(dt));
        $$('[data-start]').forEach(x => x.setAttribute('aria-pressed', String(x === b)));
      }));
      $('[data-start="0"]').click();
    }
  }

  /* =====================================================
     STEP 4 — progress dashboard (concept, sample data)
     ===================================================== */
  const chart = $('#fn-chart');
  if (chart) {
    let prof = {};
    try { prof = JSON.parse(sessionStorage.getItem('ee_concept_profile') || '{}'); } catch (e) {}
    const start = Math.round((parseFloat(prof.w) || 82) * 10) / 10;
    const steps = [0, 0.8, 1.9, 2.6, 3.7, 4.4]; // sample kg lost per week
    const data = steps.map(x => Math.round((start - x) * 10) / 10);
    const W = 640, H = 240, P = { l: 44, r: 16, t: 18, b: 34 };
    const draw = () => {
      const min = Math.floor(Math.min(...data) - 1), max = Math.ceil(Math.max(...data) + 1);
      const x = i => P.l + (i * (W - P.l - P.r)) / (data.length - 1);
      const y = v => P.t + ((max - v) * (H - P.t - P.b)) / (max - min);
      let g = '';
      for (let i = 0; i <= 3; i++) {
        const v = max - ((max - min) * i) / 3, yy = y(v);
        g += '<line class="g" x1="' + P.l + '" x2="' + (W - P.r) + '" y1="' + yy + '" y2="' + yy + '"/><text x="' + (P.l - 8) + '" y="' + (yy + 4) + '" text-anchor="end">' + fa(Math.round(v)) + '</text>';
      }
      const pts = data.map((v, i) => [x(i), y(v)]);
      const line = pts.map((p, i) => (i ? 'L' : 'M') + p[0].toFixed(1) + ' ' + p[1].toFixed(1)).join(' ');
      const area = line + ' L' + pts[pts.length - 1][0] + ' ' + (H - P.b) + ' L' + pts[0][0] + ' ' + (H - P.b) + ' Z';
      const dots = pts.map((p, i) => '<circle class="d" cx="' + p[0] + '" cy="' + p[1] + '" r="5"/><text x="' + p[0] + '" y="' + (H - 10) + '" text-anchor="middle">هفته ' + fa(i + 1) + '</text>').join('');
      chart.innerHTML = '<defs><linearGradient id="fnGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2f6bff" stop-opacity=".28"/><stop offset="1" stop-color="#2f6bff" stop-opacity="0"/></linearGradient></defs>' + g + '<path class="a" d="' + area + '"/><path class="l" d="' + line + '"/>' + dots;
      const cur = data[data.length - 1], lost = Math.round((start - cur) * 10) / 10;
      $('#k-start').textContent = fa(start);
      $('#k-now').textContent = fa(cur);
      $('#k-lost').textContent = fa(lost);
      $('#k-streak').textContent = fa(data.length * 7);
      chart.setAttribute('aria-label', 'نمودار نمونه کاهش وزن از ' + fa(start) + ' به ' + fa(cur) + ' کیلوگرم در ' + fa(data.length) + ' هفته');
    };
    draw();
    const ci = $('#fn-checkin');
    ci && ci.addEventListener('submit', e => {
      e.preventDefault();
      const v = parseFloat(toEn($('#ci-w').value));
      const out = $('#ci-e');
      if (!(v >= 35 && v <= 300)) { out.textContent = 'وزن معتبر وارد کنید (۳۵ تا ۳۰۰ کیلوگرم).'; return; }
      out.textContent = '';
      data[data.length - 1] = Math.round(v * 10) / 10;
      draw();
      $('#ci-ok').hidden = false;
    });
  }
})();
