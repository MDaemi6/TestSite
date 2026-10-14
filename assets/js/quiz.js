/* Eat Easily — weight-loss quiz. All answers stay in the browser (localStorage, optional). */
(() => {
  'use strict';
  const root = document.getElementById('quiz-root');
  if (!root || !window.EEAvatar) return;
  const A = window.EEAvatar;
  const START_URL = 'https://q.eateasily.net/weight-less/start?quiz';
  const TELEGRAM = 'https://t.me/eateasily';

  const fa = v => String(v).replace(/\d/g, d => '۰۱۲۳۴۵۶۷۸۹'[d]).replace(/\./g, '٫');
  const en = v => String(v).replace(/[۰-۹]/g, d => '۰۱۲۳۴۵۶۷۸۹'.indexOf(d)).replace(/[٠-٩]/g, d => '٠١٢٣٤٥٦٧٨٩'.indexOf(d)).replace(/[٫,،]/g, '.').trim();
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const KEY = 'ee-quiz-v1';
  let S = {};
  try { S = JSON.parse(localStorage.getItem(KEY) || '{}') || {}; } catch (e) { S = {}; }
  const save = () => { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) {} };
  const g = () => (S.gender === 'male' ? 'male' : 'female');

  const bmiBuild = b => (b < 18.5 ? 0 : b < 25 ? 1 : b < 30 ? 2 : 3);
  const bmiOf = (w, h) => w / ((h / 100) ** 2);

  /* ---------- steps ---------- */
  const bust = (o, label) => A.bust(Object.assign({ gender: g() }, o, label ? { label } : {}));

  const steps = [
    {
      id: 'gender', type: 'single', layout: 'big', cols: 2,
      title: 'جنسیتت را انتخاب کن',
      sub: 'برای ساختن برنامه‌ای که به بدن تو می‌خورد لازم است.',
      options: () => [
        { v: 'female', t: 'خانم', img: A.full({ gender: 'female', build: 1, mood: 'happy' }) },
        { v: 'male', t: 'آقا', img: A.full({ gender: 'male', build: 1, mood: 'happy' }) }
      ]
    },
    {
      id: 'goal', type: 'single', layout: 'list',
      title: 'مهم‌ترین هدفت چیست؟',
      sub: 'فقط یکی را انتخاب کن؛ بعداً می‌شود دقیق‌ترش کرد.',
      options: () => [
        { v: 'lose', t: 'کاهش وزن اصولی', d: 'بدون گرسنگی و رژیم‌های سخت', img: bust({ prop: 'scale', mood: 'happy' }) },
        { v: 'tone', t: 'اصلاح فرم و تناسب بدن', d: 'سفت‌تر و متناسب‌تر شوم', img: bust({ prop: 'dumbbell', mood: 'smile' }) },
        { v: 'health', t: 'سلامت و انرژی بیشتر', d: 'سبک‌تر و سرحال‌تر باشم', img: bust({ prop: 'heart', mood: 'happy' }) },
        { v: 'keep', t: 'ثابت نگه‌داشتن وزن بعد از لاغری', d: 'دیگر وزن برنگردد', img: bust({ prop: 'star', mood: 'smile' }) }
      ]
    },
    {
      id: 'current', type: 'single', layout: 'full', cols: 4,
      title: 'بدنت الان شبیه کدام است؟',
      sub: 'نزدیک‌ترین شکل را انتخاب کن؛ دقیق بودن لازم نیست.',
      options: () => ['لاغر', 'متناسب', 'اضافه‌وزن', 'چاقی'].map((t, i) => ({ v: i, t, img: A.full({ gender: g(), build: i, mood: 'smile' }) }))
    },
    {
      id: 'target', type: 'single', layout: 'full', cols: 3,
      title: 'دوست داری به چه فرمی برسی؟',
      sub: 'فرم هدف را انتخاب کن؛ مسیر رسیدن به آن را با هم می‌سازیم.',
      options: () => {
        const c = Number(S.current ?? 2);
        const lab = { 0: 'لاغر و کشیده', 1: 'متناسب و سالم', 2: 'یک پله سبک‌تر' };
        let list = [];
        if (c <= 1) { if (c === 1) list.push({ b: 0, t: lab[0] }); list.push({ b: c, t: 'همین فرم؛ سفت‌تر و پرانرژی‌تر' }); }
        else list = [c - 2 >= 0 ? c - 2 : 0, c - 1].filter((v, i, a) => a.indexOf(v) === i).map(b => ({ b, t: lab[b] }));
        return list.map(o => ({ v: o.b, t: o.t, img: A.full({ gender: g(), build: o.b, mood: 'happy' }) }));
      }
    },
    {
      id: 'zones', type: 'multi', layout: 'full', cols: 4,
      title: 'کدام قسمت‌های بدن برایت مهم‌تر است؟',
      sub: 'می‌توانی چند مورد را انتخاب کنی.',
      options: () => {
        const b = Number(S.current ?? 2);
        const z = [
          { v: 'belly', t: 'شکم و پهلو', zones: ['belly'] },
          { v: 'thighs', t: 'ران و باسن', zones: ['thighs', 'hips'] },
          { v: 'arms', t: 'بازوها', zones: ['arms'] },
          { v: 'all', t: 'کل بدن', zones: ['all'] }
        ];
        return z.map(o => ({ v: o.v, t: o.t, img: A.full({ gender: g(), build: b, zones: o.zones, mood: 'smile' }) }));
      }
    },
    {
      id: 'age', type: 'single', layout: 'bust', cols: 3,
      title: 'در چه بازهٔ سنی هستی؟',
      sub: 'نیاز بدن در سنین مختلف متفاوت است.',
      options: () => [
        { v: '18-29', t: '۱۸ تا ۲۹ سال', age: 24 }, { v: '30-39', t: '۳۰ تا ۳۹ سال', age: 34 }, { v: '40-49', t: '۴۰ تا ۴۹ سال', age: 44 },
        { v: '50-59', t: '۵۰ تا ۵۹ سال', age: 55 }, { v: '60+', t: '۶۰ سال به بالا', age: 65 }
      ].map(o => ({ v: o.v, t: o.t, img: bust({ age: o.age, mood: 'smile' }) }))
    },
    { id: 'metrics', type: 'metrics' },
    {
      id: 'activity', type: 'single', layout: 'list',
      title: 'سطح تحرک روزانه‌ات چقدر است؟',
      sub: 'صادقانه جواب بده؛ برنامه را متناسب با همین می‌چینیم.',
      options: () => [
        { v: 'sedentary', t: 'بیشتر وقتم نشسته می‌گذرد', d: 'کار پشت میز، رفت‌وآمد با ماشین', img: bust({ prop: 'phone', mood: 'flat' }) },
        { v: 'light', t: 'پیاده‌روی سبک', d: 'روزی ۳۰ دقیقه حرکت یا کمتر', img: bust({ prop: 'sneaker', mood: 'smile' }) },
        { v: 'regular', t: 'چند بار در هفته ورزش می‌کنم', d: '۲ تا ۴ جلسه در هفته', img: bust({ prop: 'dumbbell', mood: 'happy' }) },
        { v: 'daily', t: 'تقریباً هر روز فعالم', d: 'ورزش یا کار فیزیکی منظم', img: bust({ prop: 'star', mood: 'happy' }) }
      ]
    },
    {
      id: 'habits', type: 'multi', layout: 'list', exclusive: 'none',
      title: 'کدام عادت‌ها برایت آشناست؟',
      sub: 'می‌توانی چند مورد را انتخاب کنی.',
      options: () => [
        { v: 'sweets', t: 'میل زیاد به شیرینی و تنقلات', img: bust({ prop: 'cookie', mood: 'happy' }) },
        { v: 'night', t: 'شب‌خوری', d: 'خوردن بعد از شام', img: bust({ prop: 'moon', mood: 'sleepy' }) },
        { v: 'irregular', t: 'وعده‌های نامنظم', d: 'حذف صبحانه، دیر خوردن ناهار', img: bust({ prop: 'clock', mood: 'think' }) },
        { v: 'stress', t: 'خوردن زیر فشار و استرس', img: bust({ prop: 'drops', mood: 'flat' }) },
        { v: 'none', t: 'هیچ‌کدام', img: bust({ prop: 'star', mood: 'smile' }) }
      ]
    },
    {
      id: 'sleep', type: 'single', layout: 'list',
      title: 'شبانه‌روز معمولاً چند ساعت می‌خوابی؟',
      options: () => [
        { v: 'lt5', t: 'کمتر از ۵ ساعت', img: bust({ prop: 'zzz', mood: 'flat' }) },
        { v: '5-6', t: '۵ تا ۶ ساعت', img: bust({ prop: 'zzz', mood: 'think' }) },
        { v: '7-8', t: '۷ تا ۸ ساعت', img: bust({ prop: 'moon', mood: 'sleepy' }) },
        { v: 'gt8', t: 'بیشتر از ۸ ساعت', img: bust({ prop: 'zzz', mood: 'sleepy' }) }
      ]
    },
    {
      id: 'water', type: 'single', layout: 'list',
      title: 'روزانه چقدر آب می‌نوشی؟',
      sub: 'چای و نوشابه حساب نمی‌شود.',
      options: () => [
        { v: 'lt1', t: 'کمتر از ۱ لیتر', d: 'حدود ۴ لیوان یا کمتر', img: bust({ prop: 'glass', mood: 'flat' }) },
        { v: '1-1.5', t: '۱ تا ۱٫۵ لیتر', img: bust({ prop: 'glass', mood: 'think' }) },
        { v: '1.5-2', t: '۱٫۵ تا ۲ لیتر', img: bust({ prop: 'glass', mood: 'smile' }) },
        { v: 'gt2', t: 'بیشتر از ۲ لیتر', img: bust({ prop: 'glass', mood: 'happy' }) }
      ]
    },
    {
      id: 'history', type: 'single', layout: 'list', final: true,
      title: 'تا امروز چه راه‌هایی را برای لاغری امتحان کرده‌ای؟',
      options: () => [
        { v: 'first', t: 'این اولین بار است', img: bust({ prop: 'star', mood: 'happy' }) },
        { v: 'diets', t: 'چند رژیم غذایی', img: bust({ prop: 'bowl', mood: 'think' }) },
        { v: 'harsh', t: 'رژیم‌های سخت و گرسنگی', d: 'اول کم شد، بعد برگشت', img: bust({ prop: 'clock', mood: 'flat' }) },
        { v: 'pills', t: 'دارو یا مکمل لاغری', img: bust({ prop: 'pill', mood: 'think' }) },
        { v: 'sport', t: 'ورزش بدون نتیجهٔ دلخواه', img: bust({ prop: 'dumbbell', mood: 'flat' }) }
      ]
    }
  ];
  const TOTAL = steps.length;

  /* ---------- rendering ---------- */
  let i = 0;
  const bar = document.getElementById('quiz-bar');
  const count = document.getElementById('quiz-count');
  const back = document.getElementById('quiz-back');
  const progress = document.getElementById('quiz-progress');
  const card = document.getElementById('quiz-card');

  const setProgress = n => {
    const pct = Math.round((n / TOTAL) * 100);
    bar.style.width = pct + '%';
    progress.setAttribute('aria-valuenow', String(pct));
    count.textContent = n >= TOTAL ? 'پایان' : `${fa(n + 1)} از ${fa(TOTAL)}`;
    back.hidden = n === 0 || n >= TOTAL + 1;
  };

  const show = (html, focusTitle = true) => {
    card.innerHTML = `<div class="quiz-step" id="quiz-step">${html}</div>`;
    const h = card.querySelector('.quiz-title');
    if (h && focusTitle) { h.setAttribute('tabindex', '-1'); try { h.focus({ preventScroll: true }); } catch (e) {} }
    const top = document.querySelector('.quiz-top').getBoundingClientRect().top + window.scrollY - 90;
    if (window.scrollY > top + 120) window.scrollTo({ top: Math.max(0, top), behavior: reduce ? 'auto' : 'smooth' });
  };

  const optHtml = (st, o, multi) => {
    const sel = multi ? (S[st.id] || []).includes(String(o.v)) : String(S[st.id]) === String(o.v);
    return `<label class="opt opt--${st.layout}">
      <input type="${multi ? 'checkbox' : 'radio'}" name="${st.id}" value="${esc(o.v)}"${sel ? ' checked' : ''}>
      <span class="opt__card"><span class="opt__img">${o.img}</span><span class="opt__text"><strong>${esc(o.t)}</strong>${o.d ? `<small>${esc(o.d)}</small>` : ''}</span></span>
    </label>`;
  };

  const renderChoice = st => {
    const multi = st.type === 'multi';
    const opts = st.options();
    const cols = st.layout === 'list' ? 'list' : Math.min(st.cols, opts.length);
    const sub = st.sub ? `<p class="quiz-sub">${esc(st.sub)}</p>` : '<div style="height:22px"></div>';
    const hasSel = multi ? (S[st.id] || []).length > 0 : false;
    show(`<h1 class="quiz-title">${esc(st.title)}</h1>${sub}
      <fieldset class="opts opts--${cols}${multi ? ' opts--multi' : ''}"><legend>${esc(st.title)}</legend>${opts.map(o => optHtml(st, o, multi)).join('')}</fieldset>
      ${multi ? `<div class="quiz-actions"><button class="button button--primary button--large" type="button" id="quiz-next"${hasSel ? '' : ' disabled'}>ادامه <span aria-hidden="true">←</span></button></div>` : ''}`);

    const set = card.querySelector('fieldset');
    set.addEventListener('change', e => {
      const inp = e.target;
      if (!(inp instanceof HTMLInputElement)) return;
      if (!multi) {
        S[st.id] = isNaN(Number(inp.value)) || st.id === 'age' || st.id === 'water' ? inp.value : Number(inp.value);
        if (st.id === 'current') delete S.target;
        save();
        setTimeout(next, reduce ? 0 : 420);
        return;
      }
      let cur = new Set(S[st.id] || []);
      if (inp.checked) {
        if (st.exclusive && inp.value === st.exclusive) cur = new Set([inp.value]);
        else { if (st.exclusive) cur.delete(st.exclusive); cur.add(inp.value); }
      } else cur.delete(inp.value);
      S[st.id] = [...cur];
      set.querySelectorAll('input').forEach(x => { x.checked = cur.has(x.value); });
      card.querySelector('#quiz-next').disabled = cur.size === 0;
      save();
    });
    const nx = card.querySelector('#quiz-next');
    if (nx) nx.addEventListener('click', next);
  };

  const renderMetrics = () => {
    show(`<h1 class="quiz-title">قد و وزنت چقدر است؟</h1>
      <p class="quiz-sub">برای محاسبهٔ BMI و تخمین مسیر. اطلاعات فقط در مرورگر خودت می‌ماند.</p>
      <div class="metrics">
        <div><div class="metrics__avatar" id="m-avatar"></div><div class="metrics__bmi" id="m-bmi" aria-live="polite"></div></div>
        <form class="metrics__form" id="m-form" novalidate>
          ${['height', 'weight', 'target'].map(k => {
            const meta = { height: ['قد', 'سانتی‌متر', 'مثلاً ۱۷۰'], weight: ['وزن فعلی', 'کیلوگرم', 'مثلاً ۸۲'], target: ['وزن هدف', 'کیلوگرم', 'مثلاً ۷۰'] }[k];
            return `<div class="qfield"><label for="m-${k}">${meta[0]}</label>
              <div class="qfield__box" id="b-${k}"><input id="m-${k}" name="${k}" inputmode="decimal" autocomplete="off" placeholder="${meta[2]}" value="${S[k] ? fa(S[k]) : ''}" aria-describedby="e-${k}"><span>${meta[1]}</span></div>
              <p class="qfield__err" id="e-${k}" role="alert"></p></div>`;
          }).join('')}
          <button class="button button--primary button--large" type="submit">ادامه <span aria-hidden="true">←</span></button>
        </form>
      </div>`);
    const form = card.querySelector('#m-form');
    const av = card.querySelector('#m-avatar');
    const bm = card.querySelector('#m-bmi');
    let lastB = -1;
    const val = k => Number(en(form.elements[k].value));
    const refresh = () => {
      const h = val('height'), w = val('weight');
      let b = Number(S.current ?? 1), txt = '';
      if (h >= 120 && h <= 230 && w >= 35 && w <= 250) { const bmi = bmiOf(w, h); b = bmiBuild(bmi); txt = `BMI تو: ${fa(bmi.toFixed(1))}`; }
      bm.textContent = txt;
      if (b !== lastB) { av.innerHTML = A.full({ gender: g(), build: b, mood: 'smile' }); lastB = b; const s = av.querySelector('.av'); if (s && !reduce) s.classList.add('is-swap'); }
    };
    refresh();
    form.addEventListener('input', e => {
      const t = e.target;
      const clean = t.value.replace(/[^0-9۰-۹٠-٩.٫,]/g, '');
      if (clean !== t.value) t.value = clean;
      document.getElementById('b-' + t.name).classList.remove('is-bad');
      document.getElementById('e-' + t.name).textContent = '';
      refresh();
    });
    form.addEventListener('submit', e => {
      e.preventDefault();
      const h = val('height'), w = val('weight'), t = val('target');
      const err = {};
      if (!(h >= 120 && h <= 230)) err.height = 'قد را بین ۱۲۰ تا ۲۳۰ سانتی‌متر وارد کن.';
      if (!(w >= 35 && w <= 250)) err.weight = 'وزن را بین ۳۵ تا ۲۵۰ کیلوگرم وارد کن.';
      if (!err.weight) {
        if (!(t >= 35 && t <= 250)) err.target = 'وزن هدف را بین ۳۵ تا ۲۵۰ کیلوگرم وارد کن.';
        else if (t > w) err.target = 'وزن هدف نباید از وزن فعلی بیشتر باشد.';
      }
      const keys = Object.keys(err);
      ['height', 'weight', 'target'].forEach(k => {
        document.getElementById('e-' + k).textContent = err[k] || '';
        document.getElementById('b-' + k).classList.toggle('is-bad', !!err[k]);
      });
      if (keys.length) { form.elements[keys[0]].focus(); return; }
      S.height = h; S.weight = w; S.target = t; save();
      next();
    });
  };

  /* ---------- result ---------- */
  const catOf = b => (b < 18.5 ? 'کمبود وزن' : b < 25 ? 'وزن طبیعی' : b < 30 ? 'اضافه‌وزن' : b < 35 ? 'چاقی درجه ۱' : b < 40 ? 'چاقی درجه ۲' : 'چاقی درجه ۳');

  const insights = () => {
    const out = [];
    const add = (prop, mood, title, text) => out.push({ prop, mood, title, text });
    if (['lt5', '5-6'].includes(S.sleep)) add('zzz', 'sleepy', 'خواب را جدی بگیریم', 'کم‌خوابی معمولاً با اشتهای بیشتر و میل به تنقلات همراه است؛ در برنامه روی ساعت خواب هم کار می‌کنیم.');
    if (['lt1', '1-1.5'].includes(S.water)) add('glass', 'smile', 'آب بیشتر، گرسنگی‌ِ کاذب کمتر', 'نوشیدن آب در طول روز کمک می‌کند تشنگی با گرسنگی اشتباه گرفته نشود. اگر محدودیت پزشکی نداری، به‌تدریج به حدود ۲ لیتر برس.');
    if (S.activity === 'sedentary') add('sneaker', 'happy', 'از یک پیاده‌روی کوتاه شروع کن', 'لازم نیست باشگاه بروی؛ ۱۰ تا ۱۵ دقیقه پیاده‌روی بعد از وعده‌ها شروعی ساده و ماندگار است.');
    const hb = S.habits || [];
    if (hb.includes('night')) add('moon', 'think', 'شب‌خوری قابل مدیریت است', 'با یک شام سیرکننده‌تر و عصرانهٔ برنامه‌ریزی‌شده، میل به خوردن آخر شب معمولاً کم می‌شود.');
    if (hb.includes('sweets')) add('cookie', 'happy', 'بدون ممنوع کردن شیرینی', 'به‌جای حذف کامل، جایگزین‌های سیرکننده و مقدار کنترل‌شده را در برنامه می‌گذاریم تا وسوسه جمع نشود.');
    if (hb.includes('irregular')) add('clock', 'think', 'ریتم ثابت وعده‌ها', 'ساعت منظم وعده‌ها از پرخوری‌های ناگهانی در طول روز جلوگیری می‌کند.');
    if (hb.includes('stress')) add('drops', 'think', 'مدیریت خوردنِ هیجانی', 'در کنار تغذیه، روی راهکارهای مقابله با استرس هم کار می‌کنیم تا غذا تنها راه آرام شدن نباشد.');
    if (['harsh', 'diets'].includes(S.history)) add('heart', 'smile', 'این بار بدون رژیم سخت', 'مسیر بر پایهٔ انتخاب‌های ساده و ماندگار است، نه گرسنگی؛ تا نتیجه فقط موقتی نباشد.');
    if (S.history === 'pills') add('pill', 'think', 'دربارهٔ دارو با پزشک مشورت کن', 'هر دارو یا مکملی را فقط با نظر پزشک شروع یا قطع کن. پشتیبانی پزشکی ما کنارت است.');
    if (!out.length) add('star', 'happy', 'شروع خوبی داری', 'عادت‌های فعلی‌ات پایهٔ مناسبی است؛ برنامهٔ شخصی‌سازی‌شده روی همین‌ها ساخته می‌شود.');
    return out.slice(0, 4);
  };

  const renderResult = () => {
    const h = S.height, w = S.weight, bmi = bmiOf(w, h);
    const minKg = 18.5 * (h / 100) ** 2;
    const under = bmi < 18.5;
    const tUsed = Math.max(S.target, Math.ceil(minKg * 10) / 10);
    const clamped = !under && S.target < tUsed;
    const kg = under ? 0 : Math.max(0, w - tUsed);
    const before = bmiBuild(bmi);
    let after = Math.min(before, bmiBuild(bmiOf(tUsed, h)));
    if (after === before && kg >= 3 && before > 0) after = before - 1;
    const wLow = kg >= 0.5 ? Math.ceil(kg / 1) : 0, wHigh = kg >= 0.5 ? Math.ceil(kg / 0.5) : 0;
    const pos = Math.max(0, Math.min(100, ((bmi - 15) / 25) * 100));
    const goalMsg = S.goal === 'keep' ? 'برای ثابت ماندن وزن، پایه‌ریزی عادت‌های پایدار مهم‌تر از عدد روی ترازوست.' : 'مسیر پیشنهادی بر پایهٔ سرعت سالم کاهش وزن و عادت‌های خودت چیده شده است.';

    const head = under
      ? `<h2>BMI تو پایین‌تر از محدودهٔ طبیعی است</h2><p>در این وضعیت کاهش وزن توصیه نمی‌شود. بهتر است با پزشک یا متخصص تغذیه دربارهٔ افزایش سالم وزن و تناسب مشورت کنی.</p>`
      : `<span class="quiz-tag" style="margin:0 0 10px">نتیجهٔ آزمون</span><h2>برنامهٔ اولیهٔ تو آماده است</h2><p>${esc(goalMsg)}</p>`;

    show(`<div class="res-head">
        <div>${head}</div>
        <div class="res-avatars" role="img" aria-label="مقایسهٔ نمادین فرم فعلی و فرم هدف">
          <figure>${A.full({ gender: g(), build: before, mood: 'smile' })}<figcaption>الان</figcaption></figure>
          ${under ? '' : `<span class="res-arrow" aria-hidden="true">←</span><figure>${A.full({ gender: g(), build: after, mood: 'happy' })}<figcaption>هدف</figcaption></figure>`}
        </div>
      </div>
      <div class="stat-grid">
        <div class="stat"><small>BMI فعلی</small><strong>${fa(bmi.toFixed(1))}</strong><em>${catOf(bmi)}</em></div>
        <div class="stat"><small>وزن فعلی</small><strong>${fa(w)}</strong><em>کیلوگرم</em></div>
        <div class="stat"><small>${under ? 'وزن کمینهٔ سالم' : 'وزن هدف'}</small><strong>${fa(under ? Math.ceil(minKg) : tUsed)}</strong><em>کیلوگرم</em></div>
        <div class="stat"><small>${under ? 'پیشنهاد' : 'زمان تخمینی'}</small><strong>${under ? 'مشاوره' : kg < 0.5 ? 'حفظ وزن' : `${fa(wLow)}–${fa(wHigh)}`}</strong><em>${under ? 'با پزشک' : kg < 0.5 ? '' : 'هفته'}</em></div>
      </div>
      <div class="qz-scale" aria-hidden="true">
        <div class="qz-scale__bar"><span></span><span></span><span></span><span></span><i class="qz-scale__pin" style="inset-inline-start:0"></i></div>
        <div class="qz-scale__labels"><span>کمبود وزن</span><span>طبیعی</span><span>اضافه‌وزن</span><span>چاقی</span></div>
      </div>
      ${clamped ? `<p class="res-note"><strong>یک نکته:</strong> وزن هدفی که وارد کردی کمتر از محدودهٔ سالم برای قد توست؛ برای تخمین، حدود ${fa(tUsed)} کیلوگرم در نظر گرفته شد.</p>` : ''}
      <h3 class="res-h3">چند نکته که برنامهٔ تو را شخصی می‌کند</h3>
      <ul class="insights">${insights().map(x => `<li class="insight"><span class="insight__img">${A.bust({ gender: g(), prop: x.prop, mood: x.mood })}</span><div><strong>${esc(x.title)}</strong><p>${esc(x.text)}</p></div></li>`).join('')}</ul>
      <div class="res-cta">
        <h3>${under ? 'با ما مشورت کن' : 'مرحلهٔ بعد: برنامهٔ اختصاصی'}</h3>
        <p>${under ? 'تیم پشتیبان ایت ایزیلی می‌تواند تو را به مسیر مناسب راهنمایی کند.' : 'آزمون را کامل کن تا برنامهٔ شخصی‌سازی‌شده و پشتیبان پزشکی‌ات را دریافت کنی.'}</p>
        <div class="res-cta__row">
          <a class="button button--primary button--large" href="${under ? TELEGRAM : START_URL}"${under ? ' rel="noopener"' : ''}>${under ? 'مشاوره در تلگرام' : 'دریافت برنامهٔ من'} <span aria-hidden="true">↗</span></a>
          ${under ? `<a class="button button--glass button--large" href="${START_URL}">ادامهٔ آزمون</a>` : `<a class="button button--glass button--large" href="${TELEGRAM}" rel="noopener">مشاوره در تلگرام</a>`}
        </div>
        <button type="button" class="quiz-link" id="quiz-restart">شروع دوباره</button>
      </div>
      <p class="res-fine">این نتیجه یک برآورد کلی بر پایهٔ BMI و پاسخ‌های توست؛ تشخیص یا توصیهٔ پزشکی نیست و سرعت واقعی کاهش وزن در افراد مختلف متفاوت است. تصاویر نمادین‌اند. پیش از شروع هر برنامه با پزشک مشورت کن.</p>`);
    requestAnimationFrame(() => requestAnimationFrame(() => {
      const pin = card.querySelector('.qz-scale__pin');
      if (pin) pin.style.insetInlineStart = pos + '%';
    }));
    card.querySelector('#quiz-restart').addEventListener('click', () => { S = {}; save(); go(0, true); });
  };

  const renderLoader = () => {
    show(`<div class="loader" role="status" aria-live="polite">
      ${A.bust({ gender: g(), prop: 'scale', mood: 'think' })}
      <h1 class="quiz-title" style="margin-top:6px">در حال ساختن برنامهٔ تو…</h1>
      <div class="load-bar"><i></i></div>
      <ul class="load-list"><li>محاسبهٔ BMI و وزن سالم</li><li>بررسی عادت‌های خواب، آب و تحرک</li><li>آماده‌سازی نکته‌های شخصی‌سازی‌شده</li></ul>
    </div>`);
    clearTimeout(renderLoader.t);
    renderLoader.t = setTimeout(() => { if (i === TOTAL) { go(TOTAL + 1, true); } }, reduce ? 300 : 2900);
  };

  /* ---------- navigation ---------- */
  function draw() {
    setProgress(Math.min(i, TOTAL));
    if (i < TOTAL) {
      const st = steps[i];
      if (st.type === 'metrics') renderMetrics(); else renderChoice(st);
    } else if (i === TOTAL) renderLoader();
    else { setProgress(TOTAL); progress.setAttribute('aria-valuenow', '100'); renderResult(); }
  }
  function go(n, replace) {
    clearTimeout(renderLoader.t);
    i = n;
    try { history[replace ? 'replaceState' : 'pushState']({ i }, '', n === 0 ? location.pathname + location.search : '#q' + (n + 1)); } catch (e) {}
    draw();
    document.title = n === 0 ? baseTitle : n > TOTAL ? `نتیجه | ${baseTitle}` : n === TOTAL ? baseTitle : `سؤال ${fa(n + 1)} | ${baseTitle}`;
  }
  function next() { if (i <= TOTAL) go(i + 1, i + 1 >= TOTAL); }
  const baseTitle = document.title;

  const valid = n => {
    // never show a screen whose prerequisites are missing (e.g. a stale #hash)
    for (let k = 0; k < Math.min(n, TOTAL); k++) {
      const st = steps[k];
      if (st.type === 'metrics') { if (!S.height || !S.weight || !S.target) return k; }
      else if (st.type === 'multi') { if (!(S[st.id] || []).length) return k; }
      else if (S[st.id] === undefined) return k;
    }
    return n;
  };

  back.addEventListener('click', () => { if (i > 0) history.back(); });
  window.addEventListener('popstate', e => {
    const n = e.state && typeof e.state.i === 'number' ? e.state.i : 0;
    i = valid(n); clearTimeout(renderLoader.t); draw();
  });

  // start (fresh each visit, but previous answers pre-select so a returning visitor can click through)
  const m = /^#q(\d+)$/.exec(location.hash);
  const startAt = m ? valid(Math.min(Number(m[1]) - 1, TOTAL + 1)) : 0;
  if (startAt === TOTAL) { i = 0; go(0, true); } else { i = startAt; try { history.replaceState({ i }, ''); } catch (e) {} draw(); }
  document.title = baseTitle;
})();
