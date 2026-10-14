(() => {
  'use strict';

  const persianDigits = value => String(value).replace(/\d/g, digit => '۰۱۲۳۴۵۶۷۸۹'[digit]);
  const toEnglishDigits = value => String(value).replace(/[۰-۹]/g, digit => '۰۱۲۳۴۵۶۷۸۹'.indexOf(digit)).replace(/[٠-٩]/g, digit => '٠١٢٣٤٥٦٧٨٩'.indexOf(digit)).replace(/٫/g, '.').replace(/,/g, '.');

  // Mobile navigation: accessible expanded state, keyboard escape and outside click.
  const menuToggle = document.querySelector('.menu-toggle');
  const mobileMenu = document.getElementById('mobile-menu');
  if (menuToggle && mobileMenu) {
    const closeMenu = () => {
      menuToggle.setAttribute('aria-expanded', 'false');
      menuToggle.setAttribute('aria-label', 'باز کردن منو');
      mobileMenu.hidden = true;
    };
    menuToggle.addEventListener('click', () => {
      const isOpen = menuToggle.getAttribute('aria-expanded') === 'true';
      menuToggle.setAttribute('aria-expanded', String(!isOpen));
      menuToggle.setAttribute('aria-label', isOpen ? 'باز کردن منو' : 'بستن منو');
      mobileMenu.hidden = isOpen;
    });
    mobileMenu.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
    document.addEventListener('keydown', event => { if (event.key === 'Escape') closeMenu(); });
    document.addEventListener('click', event => {
      if (!mobileMenu.hidden && !mobileMenu.contains(event.target) && !menuToggle.contains(event.target)) closeMenu();
    });
    const desktopQuery = window.matchMedia('(min-width: 851px)');
    desktopQuery.addEventListener?.('change', event => { if (event.matches) closeMenu(); });
  }

  // Keep current year accurate and localized to Persian numerals.
  const year = document.getElementById('current-year');
  if (year) year.textContent = persianDigits(new Date().getFullYear());

  // BMI calculator. Values stay client-side; no form data is sent to a server.
  const bmiForm = document.getElementById('bmi-form');
  if (bmiForm) {
    const heightInput = document.getElementById('height');
    const weightInput = document.getElementById('weight');
    const error = document.getElementById('bmi-error');
    const result = document.getElementById('bmi-result');
    const number = document.getElementById('bmi-number');
    const status = document.getElementById('bmi-status');
    const explainer = document.getElementById('bmi-explainer');
    const marker = document.getElementById('bmi-marker');
    const reset = document.getElementById('bmi-reset');
    const ctaEl = document.getElementById('bmi-cta');
    const cats = [
      { max: 18.5, t: 'کمبود وزن', c: '#2555bd', m: 'شاخص توده بدنی شما کمتر از محدوده طبیعی است. پیش از هر برنامه کاهش وزن حتماً با پزشک مشورت کنید؛ این برنامه برای شما مناسب نیست.', cta: false },
      { max: 25, t: 'وزن طبیعی', c: '#2563eb', m: 'عالی! BMI شما در محدوده سالم قرار دارد. اگر هدفتان اصلاح فرم بدن است، می‌توانید با آزمون لاغری وضعیت خود را دقیق‌تر بسنجید.', cta: true },
      { max: 30, t: 'اضافه وزن', c: '#b5760a', m: 'کمی بالاتر از محدوده طبیعی هستید. با یک برنامه اصولی و بدون سخت‌گیری می‌توانید به‌راحتی به وزن ایده‌آل برسید.', cta: true },
      { max: 35, t: 'چاقی درجه ۱', c: '#c2641d', m: 'شاخص شما بالاتر از محدوده سالم است. یک برنامه شخصی‌سازی‌شده با پشتیبانی پزشکی می‌تواند مسیر را برایتان آسان کند.', cta: true },
      { max: 40, t: 'چاقی درجه ۲', c: '#c24a2a', m: 'توصیه می‌شود در کنار برنامه کاهش وزن، با پزشک نیز مشورت کنید. پشتیبانی پزشکی ایت ایزیلی در کنار شماست.', cta: true },
      { max: Infinity, t: 'چاقی درجه ۳', c: '#b32d2d', m: 'برای سلامت شما بهتر است حتماً با پزشک مشورت کنید و برنامه کاهش وزن را زیر نظر متخصص پیش ببرید.', cta: true }
    ];

    const showError = () => {
      error.hidden = false;
      result.hidden = true;
      const heightValue = Number(toEnglishDigits(heightInput.value));
      const weightValue = Number(toEnglishDigits(weightInput.value));
      const validHeight = Boolean(heightInput.value) && Number.isFinite(heightValue) && heightValue >= 80 && heightValue <= 250;
      const validWeight = Boolean(weightInput.value) && Number.isFinite(weightValue) && weightValue >= 20 && weightValue <= 350;
      (validHeight && !validWeight ? weightInput : heightInput).focus();
    };
    const hideError = () => { error.hidden = true; };

    [heightInput, weightInput].forEach(input => {
      input.addEventListener('input', () => {
        // Allow Persian/Arabic digit entry in browsers whose number field rejects it.
        const clean = toEnglishDigits(input.value);
        if (clean !== input.value && input.type !== 'number') input.value = clean;
        if (!error.hidden) hideError();
      });
    });

    bmiForm.addEventListener('submit', event => {
      event.preventDefault();
      const heightCm = Number(toEnglishDigits(heightInput.value));
      const weightKg = Number(toEnglishDigits(weightInput.value));
      if (!heightInput.value || !weightInput.value || !Number.isFinite(heightCm) || !Number.isFinite(weightKg) || heightCm < 80 || heightCm > 250 || weightKg < 20 || weightKg > 350) {
        showError();
        return;
      }
      hideError();
      const bmi = weightKg / ((heightCm / 100) ** 2);
      const cat = cats.find(c => bmi < c.max);
      const label = cat.t;
      const message = cat.m;
      if (ctaEl) ctaEl.hidden = !cat.cta;
      number.textContent = persianDigits(bmi.toFixed(1));
      status.textContent = label;
      explainer.textContent = message;
      // Map BMI from 10 to 40 onto the 0–100% indicator range.
      const position = Math.max(0, Math.min(100, ((bmi - 10) / 30) * 100));
      marker.style.left = `${position}%`;
      result.hidden = false;
      result.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'nearest' });
    });

    reset?.addEventListener('click', () => {
      result.hidden = true;
      hideError();
      heightInput.focus();
    });
  }

  // Sticky liquid-glass header: stronger glass once the page is scrolled.
  const siteHeader = document.querySelector('.site-header');
  if (siteHeader) {
    const onScroll = () => siteHeader.classList.toggle('is-scrolled', window.scrollY > 10);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  // Desktop mega menu (articles).
  const megaBtn = document.getElementById('mega-btn');
  const megaPanel = document.getElementById('mega-panel');
  if (megaBtn && megaPanel) {
    const wrap = megaBtn.parentNode;
    let hoverTimer; let hoverOpenedAt = 0;
    const setMega = open => { megaBtn.setAttribute('aria-expanded', String(open)); megaPanel.setAttribute('data-open', String(open)); };
    megaBtn.addEventListener('click', () => {
      if (Date.now() - hoverOpenedAt < 500) return;
      setMega(megaBtn.getAttribute('aria-expanded') !== 'true');
    });
    if (window.matchMedia('(hover: hover)').matches) {
      wrap.addEventListener('mouseenter', () => { clearTimeout(hoverTimer); if (megaBtn.getAttribute('aria-expanded') !== 'true') hoverOpenedAt = Date.now(); setMega(true); });
      wrap.addEventListener('mouseleave', () => { hoverTimer = setTimeout(() => setMega(false), 160); });
    }
    document.addEventListener('click', e => { if (!wrap.contains(e.target)) setMega(false); });
    wrap.addEventListener('focusout', e => { if (!wrap.contains(e.relatedTarget)) setMega(false); });
    document.addEventListener('keydown', e => { if (e.key === 'Escape') setMega(false); });
  }

  // Before / after stories (same behaviour as v1).
  const stories = [
    { name: 'آزیتا، ۴۰ ساله از شیراز', kg: '۸ کیلو کاهش وزن', time: '۱ ماه همراهی', short: 'آزیتا', loss: '۸' },
    { name: 'حامد، ۴۴ ساله از تهران', kg: '۱۷ کیلو کاهش وزن', time: '۳ ماه همراهی', short: 'حامد', loss: '۱۷' },
    { name: 'آذر، ۵۹ ساله از رشت', kg: '۱۹ کیلو کاهش وزن', time: '۳ ماه همراهی', short: 'آذر', loss: '۱۹' },
    { name: 'الهام، ۴۲ ساله از تهران', kg: '۲۳ کیلو کاهش وزن', time: '۳ ماه همراهی', short: 'الهام', loss: '۲۳' },
    { name: 'امیرحسین، ۳۸ ساله از مشهد', kg: '۱۰ کیلو کاهش وزن', time: '۲ ماه همراهی', short: 'امیرحسین', loss: '۱۰' }
  ];
  const picker = document.getElementById('story-picker');
  const ba = document.getElementById('ba');
  const baRange = document.getElementById('ba-range');
  if (picker && ba && baRange) {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const imgBefore = document.getElementById('ba-before');
    const imgAfter = document.getElementById('ba-after');
    const setPos = v => { baRange.value = v; ba.style.setProperty('--pos', v + '%'); };
    const select = i => {
      const s = stories[i];
      imgBefore.src = `assets/images/story-${i + 1}-before.webp`;
      imgAfter.src = `assets/images/story-${i + 1}-after.webp`;
      imgBefore.alt = 'تصویر قبل از کاهش وزن ' + s.short;
      imgAfter.alt = 'تصویر بعد از کاهش وزن ' + s.short;
      document.getElementById('ba-name').textContent = s.name;
      document.getElementById('ba-kg').textContent = s.kg;
      document.getElementById('ba-time').textContent = s.time;
      picker.querySelectorAll('.story-btn').forEach((el, j) => el.setAttribute('aria-pressed', String(j === i)));
      setPos(50);
    };
    stories.forEach((s, i) => {
      const b = document.createElement('button');
      b.type = 'button'; b.className = 'story-btn'; b.setAttribute('aria-pressed', String(i === 0)); b.setAttribute('aria-label', s.name + '، ' + s.kg);
      b.innerHTML = `<img src="assets/images/story-${i + 1}-after.webp" alt="" width="54" height="54" loading="lazy" decoding="async"><span><b>${s.short}</b><small>${s.time}</small></span><span class="kg">${s.loss} کیلو</span>`;
      b.addEventListener('click', () => { select(i); b.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', inline: 'center', block: 'nearest' }); });
      picker.appendChild(b);
    });
    baRange.addEventListener('input', () => ba.style.setProperty('--pos', baRange.value + '%'));
    setPos(50);
    if ('IntersectionObserver' in window && !reduce) {
      let hinted = false;
      new IntersectionObserver((en, ob) => {
        if (en[0].isIntersecting && !hinted) {
          hinted = true; ob.disconnect();
          let t0 = null;
          const step = t => {
            if (t0 === null) t0 = t;
            const p = Math.min((t - t0) / 1400, 1);
            setPos(Math.round(50 + Math.sin(p * Math.PI * 2) * 22 * (1 - p * 0.3)));
            if (p < 1) requestAnimationFrame(step); else setPos(50);
          };
          requestAnimationFrame(step);
        }
      }, { threshold: 0.6 }).observe(ba);
    }
  }

  // Reviews carousel (RTL: "next" scrolls toward negative scrollLeft).
  const rv = document.getElementById('reviews');
  const prev = document.getElementById('rev-prev');
  const next = document.getElementById('rev-next');
  if (rv && prev && next) {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const amount = () => (rv.firstElementChild ? rv.firstElementChild.getBoundingClientRect().width : 320) + 18;
    next.addEventListener('click', () => rv.scrollBy({ left: -amount(), behavior: reduce ? 'auto' : 'smooth' }));
    prev.addEventListener('click', () => rv.scrollBy({ left: amount(), behavior: reduce ? 'auto' : 'smooth' }));
    rv.addEventListener('keydown', e => {
      if (e.key === 'ArrowLeft') { e.preventDefault(); next.click(); }
      if (e.key === 'ArrowRight') { e.preventDefault(); prev.click(); }
    });
  }

  // Optional progressive enhancement: when one FAQ opens, close the others.
  const faqItems = [...document.querySelectorAll('.faq-item')];
  faqItems.forEach(item => item.addEventListener('toggle', () => {
    if (!item.open) return;
    faqItems.forEach(other => { if (other !== item) other.open = false; });
  }));

  // Theme toggle: light / dark, remembers choice, follows system until chosen.
  (() => {
    const root = document.documentElement;
    const btn = document.getElementById('theme-toggle');
    const meta = document.getElementById('meta-theme-color');
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const current = () => root.getAttribute('data-theme') || (mq.matches ? 'dark' : 'light');
    const sync = () => {
      const dark = current() === 'dark';
      if (btn) {
        btn.setAttribute('aria-pressed', String(dark));
        btn.setAttribute('aria-label', dark ? 'تغییر تم به حالت روشن' : 'تغییر تم به حالت تاریک');
      }
      if (meta) meta.setAttribute('content', dark ? '#0f141c' : '#eff6ff');
    };
    sync();
    if (btn) btn.addEventListener('click', () => {
      const next = current() === 'dark' ? 'light' : 'dark';
      root.classList.add('theme-anim');
      root.setAttribute('data-theme', next);
      try { localStorage.setItem('ee-theme', next); } catch (e) {}
      sync();
      setTimeout(() => root.classList.remove('theme-anim'), 450);
    });
    const onChange = () => { if (!root.hasAttribute('data-theme')) sync(); };
    if (mq.addEventListener) mq.addEventListener('change', onChange);
  })();
})();
