/* ═══════════════════════════════════════════════════════
   ePortfolio — Imane ABDOU
   Site 100 % statique : navigation mobile, filtres projets,
   visionneuse PDF, galerie d'images, animations légères.
═══════════════════════════════════════════════════════ */
(function () {
  'use strict';

  /* ═══ MENU MOBILE ═══ */
  var toggle = document.querySelector('.nav-toggle');
  var links = document.querySelector('.nav-links');
  if (toggle && links) {
    toggle.addEventListener('click', function () {
      var open = links.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    links.addEventListener('click', function (e) {
      if (e.target.tagName === 'A') {
        links.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  /* ═══ APPARITION AU DÉFILEMENT ═══ */
  var reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('visible'); io.unobserve(en.target); }
      });
    }, { threshold: 0.08 });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add('visible'); });
  }

  /* ═══ BOUTON RETOUR EN HAUT ═══ */
  var topBtn = document.querySelector('.to-top');
  if (topBtn) {
    window.addEventListener('scroll', function () {
      topBtn.classList.toggle('show', window.scrollY > 500);
    });
    topBtn.addEventListener('click', function () { window.scrollTo({ top: 0, behavior: 'smooth' }); });
  }

  /* ═══ FILTRE DES PROJETS PAR SEMESTRE ═══ */
  var tabs = document.querySelectorAll('.sem-tab');
  var cards = document.querySelectorAll('.projet-card[data-sem]');
  function applyFilter(sem) {
    tabs.forEach(function (t) { t.classList.toggle('active', t.dataset.sem === sem); });
    cards.forEach(function (c) { c.classList.toggle('hidden', sem !== 'all' && c.dataset.sem !== sem); });
  }
  tabs.forEach(function (t) {
    t.addEventListener('click', function () {
      applyFilter(t.dataset.sem);
      if (history.replaceState) history.replaceState(null, '', t.dataset.sem === 'all' ? location.pathname : '#' + t.dataset.sem);
    });
  });
  if (tabs.length) {
    var h = location.hash.replace('#', '');
    var valid = Array.prototype.some.call(tabs, function (t) { return t.dataset.sem === h; });
    applyFilter(valid ? h : 'all');
  }

  /* ═══ VISIONNEUSE PDF ═══ */
  var pdfModal = document.getElementById('pdf-modal');
  if (pdfModal) {
    var iframe = pdfModal.querySelector('iframe');
    var title = pdfModal.querySelector('h3');
    var openNew = pdfModal.querySelector('.pdf-open-new');
    document.querySelectorAll('[data-pdf]').forEach(function (btn) {
      btn.addEventListener('click', function (e) {
        e.preventDefault();
        var src = btn.getAttribute('data-pdf');
        title.textContent = btn.getAttribute('data-title') || 'Document';
        iframe.src = src;
        openNew.href = src;
        pdfModal.classList.add('open');
        document.body.style.overflow = 'hidden';
      });
    });
    var closePdf = function () {
      pdfModal.classList.remove('open');
      iframe.src = 'about:blank';
      document.body.style.overflow = '';
    };
    pdfModal.querySelector('.modal-close').addEventListener('click', closePdf);
    pdfModal.addEventListener('click', function (e) { if (e.target === pdfModal) closePdf(); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && pdfModal.classList.contains('open')) closePdf(); });
  }

  /* ═══ GALERIE / LIGHTBOX ═══ */
  var lb = document.getElementById('lightbox');
  if (lb) {
    var items = Array.prototype.slice.call(document.querySelectorAll('[data-zoom]'));
    var lbImg = lb.querySelector('img');
    var lbCap = lb.querySelector('.cap');
    var idx = 0;
    var show = function (i) {
      idx = (i + items.length) % items.length;
      var el = items[idx];
      lbImg.src = el.getAttribute('data-zoom');
      lbImg.alt = el.getAttribute('data-caption') || '';
      lbCap.textContent = el.getAttribute('data-caption') || '';
      lb.querySelector('.lb-prev').style.display = items.length > 1 ? '' : 'none';
      lb.querySelector('.lb-next').style.display = items.length > 1 ? '' : 'none';
    };
    var closeLb = function () { lb.classList.remove('open'); document.body.style.overflow = ''; };
    items.forEach(function (el, i) {
      el.setAttribute('tabindex', '0');
      el.setAttribute('role', 'button');
      var open = function () { show(i); lb.classList.add('open'); document.body.style.overflow = 'hidden'; };
      el.addEventListener('click', open);
      el.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(); } });
    });
    lb.querySelector('.modal-close').addEventListener('click', closeLb);
    lb.querySelector('.lb-prev').addEventListener('click', function (e) { e.stopPropagation(); show(idx - 1); });
    lb.querySelector('.lb-next').addEventListener('click', function (e) { e.stopPropagation(); show(idx + 1); });
    lb.addEventListener('click', function (e) { if (e.target === lb) closeLb(); });
    document.addEventListener('keydown', function (e) {
      if (!lb.classList.contains('open')) return;
      if (e.key === 'Escape') closeLb();
      if (e.key === 'ArrowLeft') show(idx - 1);
      if (e.key === 'ArrowRight') show(idx + 1);
    });
  }

  /* ═══ ANNÉE DU PIED DE PAGE ═══ */
  var y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();
})();
