/* PREVIEW 2026-10-23: mobile sliders + pricing card order. Presentation only.
   No tracking, checkout, storage, cookie, form or network code in this file (it only moves/styles existing nodes and adds dots).
   Runs after js/fa-promo.js (which sets the live order One / All three / Two) so the final order is One 01, Two 02, All three 03. */
(function () {
  'use strict';
  /* 1) card order + numbers: One 01, Two 02, All three 03 (same nodes moved, listeners and attributes preserved) */
  var grid = document.querySelector('.kpz-grid');
  if (grid) ['.kpz-one', '.kpz-two', '.kpz-all'].forEach(function (s, i) {
    var c = grid.querySelector(s); if (!c) return;
    grid.appendChild(c);
    var n = c.querySelector('.kpz-num'); if (n) n.textContent = '0' + (i + 1);
  });

  /* 2) sliders (phones only) */
  var mq = window.matchMedia('(max-width:760px)');
  var SL = [
    ['.kpz-grid', 'pricing', 'Swipe for all 3 packages'],
    ['.kps-trust .row', '', ''],
    ['.kps-cards', 'capsules', 'Swipe the 3 capsules'],
    ['.kps-grid', 'classes', 'Swipe the 10 classes'],
    ['.kps-rail', '', ''],
    ['.cap-faculty-grid', 'faculty', 'Swipe to meet the speakers'],
    ['.kpx-vids', 'films', ''],
    ['.kps-steps', '', ''],
    ['.kps-learn .cols', 'learn', ''],
    ['.kps-faq .list', 'faq', 'Swipe the questions'],
    ['.kps-read .grid', '', '']
  ];
  var made = [];
  function dotsFor(el, hint) {
    var kids = [].slice.call(el.children).filter(function (k) { return k.offsetParent !== null || getComputedStyle(k).display !== 'none'; });
    var wrap = document.createElement('div'); wrap.className = 'fa-sl-dots'; wrap.setAttribute('aria-hidden', 'true');
    kids.forEach(function (k, i) {
      var b = document.createElement('button'); b.type = 'button'; b.tabIndex = -1;
      b.addEventListener('click', function () { el.scrollTo({ left: k.offsetLeft - (el.clientWidth - k.offsetWidth) / 2, behavior: 'smooth' }); });
      wrap.appendChild(b);
    });
    el.parentNode.insertBefore(wrap, el.nextSibling);
    var h = null;
    if (hint) { h = document.createElement('p'); h.className = 'fa-sl-hint'; h.textContent = hint; wrap.parentNode.insertBefore(h, wrap.nextSibling); }
    function upd() {
      var c = el.scrollLeft + el.clientWidth / 2, best = 0, bd = 1e9;
      kids.forEach(function (k, i) { var d = Math.abs(k.offsetLeft + k.offsetWidth / 2 - c); if (d < bd) { bd = d; best = i; } });
      [].forEach.call(wrap.children, function (b, i) { b.classList.toggle('is-on', i === best); });
      el.setAttribute('data-sl-index', String(best));
    }
    el.addEventListener('scroll', function () { window.requestAnimationFrame(upd); }, { passive: true });
    upd();
    return { el: el, wrap: wrap, hint: h, upd: upd };
  }
  function enable() {
    if (made.length) return;
    SL.forEach(function (s) {
      document.querySelectorAll(s[0]).forEach(function (el) {
        el.classList.add('fa-slider');
        if (s[1]) el.setAttribute('data-fa-slider', s[1]);
        made.push(dotsFor(el, s[2]));
      });
    });
    /* FAQ: show every answer inside its own card on phones (no accordion). Presentation only. */
    document.querySelectorAll('.kps-faq .list > details').forEach(function (d) { d.setAttribute('open', ''); });
    made.forEach(function (m) { m.upd(); });
  }
  function disable() {
    made.forEach(function (m) { m.el.classList.remove('fa-slider'); m.el.removeAttribute('data-fa-slider'); m.wrap.remove(); if (m.hint) m.hint.remove(); });
    made = [];
  }
  function sync() { if (mq.matches) enable(); else disable(); }
  if (mq.addEventListener) mq.addEventListener('change', sync); else if (mq.addListener) mq.addListener(sync);
  sync();
})();
