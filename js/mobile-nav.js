(function () {
  'use strict';

  function ready(fn) {
    if (document.readyState !== 'loading') fn();
    else document.addEventListener('DOMContentLoaded', fn);
  }

  ready(function () {
    initMobileMenu();
    initLineupCarousel();
    initStickyATC();
  });

  /* ── HAMBURGER MENU ── */
  function initMobileMenu() {
    var navbar = document.getElementById('navbar');
    if (!navbar) return;
    var navRight = navbar.querySelector('.nav-right');
    var navLinks = navbar.querySelector('.nav-links');
    if (!navRight || !navLinks) return;

    var btn = document.createElement('button');
    btn.className = 'hamburger-btn';
    btn.id = 'hamburgerBtn';
    btn.setAttribute('aria-label', 'Отвори меню');
    btn.innerHTML = '<span class="hb-line"></span><span class="hb-line"></span><span class="hb-line"></span>';
    navRight.insertBefore(btn, navRight.firstChild);

    var dropdownGroups = navLinks.querySelectorAll('.nav-dropdown');
    var directLinks = Array.from(navLinks.children).filter(function (el) {
      return el.classList.contains('nav-link');
    });

    var html = '';
    dropdownGroups.forEach(function (group) {
      var mainLink = group.querySelector('.nav-link');
      var subItems = group.querySelectorAll('.dropdown-item');
      var label = mainLink ? mainLink.textContent.trim() : '';
      html += '<div class="mobile-nav-group">' +
        '<div class="mobile-nav-group-header"><span>' + label + '</span>' +
        '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M6 9l6 6 6-6"/></svg></div>' +
        '<div class="mobile-nav-group-items">';
      subItems.forEach(function (item) {
        var img = item.querySelector('.dropdown-item-img');
        var name = item.querySelector('.dropdown-item-name');
        var price = item.querySelector('.dropdown-item-price');
        var href = item.getAttribute('href') || '#';
        html += '<a href="' + href + '" class="mobile-nav-sub-item">';
        if (img) html += '<img src="' + img.src + '" alt="" />';
        html += '<span class="mns-name">' + (name ? name.textContent : '') + '</span>';
        html += '<span class="mns-price">' + (price ? price.textContent : '') + '</span>';
        html += '</a>';
      });
      html += '</div></div>';
    });

    directLinks.forEach(function (link) {
      html += '<a href="' + (link.getAttribute('href') || '#') + '" class="mobile-nav-item">' + link.textContent.trim() + '</a>';
    });

    var menu = document.createElement('div');
    menu.className = 'mobile-menu';
    menu.id = 'mobileMenu';
    var logoEl = navbar.querySelector('.nav-logo');
    var logoHref = logoEl ? (logoEl.getAttribute('href') || '#') : '#';
    var cartEl = navbar.querySelector('.cart-btn');
    var cartHref = cartEl ? (cartEl.getAttribute('href') || '#') : '#';
    menu.innerHTML =
      '<div class="mm-header">' +
      '<a href="' + logoHref + '" class="mm-logo">LIRO</a>' +
      '<button class="mm-close" id="mmClose" aria-label="Затвори">' +
      '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6L6 18M6 6l12 12"/></svg>' +
      '</button></div>' +
      '<nav class="mm-nav">' + html + '</nav>' +
      '<div class="mm-footer"><a href="' + logoHref + '" class="mm-footer-link">Разгледай магазина →</a>' +
      '<a href="' + cartHref + '" class="mm-footer-link">Количка</a></div>';

    var overlay = document.createElement('div');
    overlay.className = 'mobile-overlay';
    overlay.id = 'mobileOverlay';
    document.body.appendChild(overlay);
    document.body.appendChild(menu);

    menu.querySelectorAll('.mobile-nav-group-header').forEach(function (h) {
      h.addEventListener('click', function () {
        var g = h.parentElement;
        var isOpen = g.classList.contains('open');
        menu.querySelectorAll('.mobile-nav-group').forEach(function (x) { x.classList.remove('open'); });
        if (!isOpen) g.classList.add('open');
      });
    });

    var isOpen = false;
    function openMenu() {
      isOpen = true;
      menu.classList.add('open');
      overlay.classList.add('open');
      btn.classList.add('open');
      document.body.classList.add('menu-open');
    }
    function closeMenu() {
      isOpen = false;
      menu.classList.remove('open');
      overlay.classList.remove('open');
      btn.classList.remove('open');
      document.body.classList.remove('menu-open');
    }
    btn.addEventListener('click', function () { isOpen ? closeMenu() : openMenu(); });
    overlay.addEventListener('click', closeMenu);
    var closeBtn = document.getElementById('mmClose');
    if (closeBtn) closeBtn.addEventListener('click', closeMenu);
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeMenu(); });
  }

  /* ── MOBILE LINEUP CAROUSEL ── */
  function initLineupCarousel() {
    if (window.innerWidth > 768) return;
    var imagesRow = document.querySelector('.lineup-images-row');
    var textRow = document.querySelector('.lineup-text-row');
    if (!imagesRow || !textRow) return;
    var imgCells = imagesRow.querySelectorAll('.lineup-img-cell');
    var textCols = textRow.querySelectorAll('.lineup-text-col');
    if (!imgCells.length) return;

    var wrap = document.createElement('div');
    wrap.className = 'mlc-wrap';
    var track = document.createElement('div');
    track.className = 'mlc-track';

    for (var i = 0; i < imgCells.length; i++) {
      var textCol = textCols[i];
      var card = document.createElement('div');
      card.className = 'mlc-card';
      var imgEl = imgCells[i].querySelector('img');
      var imgWrap = document.createElement('div');
      imgWrap.className = 'mlc-img';
      if (imgEl) imgWrap.innerHTML = '<img src="' + imgEl.src + '" alt="' + imgEl.alt + '" />';
      card.appendChild(imgWrap);
      if (textCol) {
        var info = document.createElement('div');
        info.className = 'mlc-info';
        info.innerHTML = textCol.innerHTML;
        card.appendChild(info);
      }
      track.appendChild(card);
    }

    var dots = document.createElement('div');
    dots.className = 'mlc-dots';
    for (var d = 0; d < imgCells.length; d++) {
      var dot = document.createElement('span');
      dot.className = 'mlc-dot' + (d === 0 ? ' active' : '');
      dots.appendChild(dot);
    }
    wrap.appendChild(track);
    wrap.appendChild(dots);

    var grayContainer = document.querySelector('.lineup-gray-area .site-container');
    if (grayContainer) {
      grayContainer.appendChild(wrap);
    }

    var dotEls = dots.querySelectorAll('.mlc-dot');
    track.addEventListener('scroll', function () {
      var cardWidth = track.querySelector('.mlc-card') ? track.querySelector('.mlc-card').offsetWidth : track.offsetWidth;
      var idx = Math.round(track.scrollLeft / (cardWidth + 12));
      idx = Math.max(0, Math.min(idx, dotEls.length - 1));
      dotEls.forEach(function (d, di) { d.classList.toggle('active', di === idx); });
    }, { passive: true });
  }

  /* ── STICKY ADD TO CART ── */
  function initStickyATC() {
    if (window.innerWidth > 768) return;
    var addBtn = document.getElementById('addToCartBtn');
    var priceEl = document.getElementById('totalPrice');
    if (!addBtn) return;

    document.body.classList.add('has-sticky-atc');

    var bar = document.createElement('div');
    bar.className = 'satc-bar';
    bar.id = 'stickyAtcBar';
    bar.innerHTML = '<div class="satc-inner"><span class="satc-price" id="satcPrice">' + (priceEl ? priceEl.textContent : '') + '</span><button class="satc-btn" id="satcBtn">Добави в количката</button></div>';
    document.body.appendChild(bar);

    if (priceEl) {
      new MutationObserver(function () {
        var sp = document.getElementById('satcPrice');
        if (sp) sp.textContent = priceEl.textContent;
      }).observe(priceEl, { childList: true, characterData: true, subtree: true });
    }
    document.getElementById('satcBtn').addEventListener('click', function () { addBtn.click(); });
    new IntersectionObserver(function (entries) {
      bar.classList.toggle('visible', !entries[0].isIntersecting);
    }, { threshold: 0.5 }).observe(addBtn);
  }
})();
