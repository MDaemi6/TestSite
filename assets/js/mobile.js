(() => {
  'use strict';
  const bar = document.getElementById('m-cta');
  if (!bar) return;
  document.body.classList.add('has-mcta');
  let past = false, nearEnd = false;
  const update = () => bar.classList.toggle('is-on', past && !nearEnd);
  const onScroll = () => { const p = window.scrollY > 520; if (p !== past) { past = p; update(); } };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
  const targets = document.querySelectorAll('.final-cta-section, .site-footer');
  if ('IntersectionObserver' in window && targets.length) {
    const seen = new Set();
    const io = new IntersectionObserver(es => {
      es.forEach(e => e.isIntersecting ? seen.add(e.target) : seen.delete(e.target));
      nearEnd = seen.size > 0; update();
    });
    targets.forEach(t => io.observe(t));
  }
})();
