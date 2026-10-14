/* Contact form: validates in the browser and builds a WhatsApp message.
   Nothing is sent to or stored on a server. */
(() => {
  'use strict';
  const form = document.getElementById('ct-form');
  if (!form) return;
  const WA = 'https://wa.me/447769173837';
  const toEn = v => String(v).replace(/[۰-۹]/g, d => '۰۱۲۳۴۵۶۷۸۹'.indexOf(d)).replace(/[٠-٩]/g, d => '٠١٢٣٤٥٦٧٨٩'.indexOf(d));
  const $ = id => document.getElementById(id);
  const name = $('ct-name'), phone = $('ct-phone'), subject = $('ct-subject'), msg = $('ct-msg');
  const toast = $('ct-toast');

  const setErr = (input, text) => {
    const out = $(input.id + '-e');
    if (out) out.textContent = text || '';
    if (text) input.setAttribute('aria-invalid', 'true'); else input.removeAttribute('aria-invalid');
    return !text;
  };
  const validate = () => {
    const okName = setErr(name, name.value.trim().length < 2 ? 'نام خود را وارد کنید.' : '');
    const p = toEn(phone.value).replace(/[\s\-+()]/g, '');
    const okPhone = setErr(phone, p && !/^\d{8,14}$/.test(p) ? 'شماره تماس معتبر نیست.' : '');
    const okMsg = setErr(msg, msg.value.trim().length < 10 ? 'پیام باید دست‌کم ۱۰ نویسه باشد.' : '');
    const first = [[okName, name], [okPhone, phone], [okMsg, msg]].find(x => !x[0]);
    if (first) first[1].focus();
    return !first;
  };
  const text = () => {
    const lines = ['سلام، از طریق سایت ایت ایزیلی پیام می‌دهم.', 'موضوع: ' + subject.value, 'نام: ' + name.value.trim()];
    if (phone.value.trim()) lines.push('شماره تماس: ' + toEn(phone.value).trim());
    lines.push('', msg.value.trim());
    return lines.join('\n');
  };
  const say = t => { toast.textContent = t; toast.hidden = false; };

  [name, phone, msg].forEach(el => el.addEventListener('input', () => { if (el.getAttribute('aria-invalid')) validate(); }));

  form.addEventListener('submit', e => {
    e.preventDefault();
    if (!validate()) return;
    window.open(WA + '?text=' + encodeURIComponent(text()), '_blank', 'noopener');
    say('واتساپ باز شد؛ پیام را در آنجا ارسال کنید.');
  });

  $('ct-copy').addEventListener('click', async () => {
    if (!validate()) return;
    const t = text();
    try {
      await navigator.clipboard.writeText(t);
      say('متن پیام کپی شد؛ آن را در تلگرام (t.me/eateasily) بچسبانید.');
    } catch (_) {
      msg.focus(); msg.select();
      say('کپی خودکار انجام نشد؛ متن پیام را دستی کپی کنید.');
    }
  });
})();
