/* ============================================================
   Shawn Liu — Portfolio JS
   Preserves: modal system, Spotify live stats, cat lightbox,
   confetti + birthday countdown. Adds: scroll reveals, metric
   count-up, universal image fallback, mobile nav, nav highlight.
   ============================================================ */
(function () {
  'use strict';
  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Universal image fallback ----------
     If an asset 404s (e.g. before deploy), swap to a tasteful
     labeled placeholder so layout never collapses. */
  function placeholder(label) {
    var t = (label || 'image').replace(/[<>&]/g, '').slice(0, 46);
    var svg = '<svg xmlns="http://www.w3.org/2000/svg" width="800" height="600">' +
      '<defs><pattern id="p" width="22" height="22" patternTransform="rotate(45)" patternUnits="userSpaceOnUse">' +
      '<rect width="22" height="22" fill="#1b1910"/><rect width="11" height="22" fill="#1f1c12"/></pattern></defs>' +
      '<rect width="800" height="600" fill="url(#p)"/>' +
      '<text x="400" y="300" fill="#8c8670" font-family="IBM Plex Mono, monospace" font-size="22" ' +
      'text-anchor="middle" dominant-baseline="middle">' + t + '</text>' +
      '<text x="400" y="332" fill="#5d5847" font-family="IBM Plex Mono, monospace" font-size="14" ' +
      'text-anchor="middle" dominant-baseline="middle">image unavailable</text></svg>';
    return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
  }
  function attachFallback(img) {
    if (img.dataset.fbk) return;
    img.addEventListener('error', function () {
      if (img.dataset.fbk) return;
      img.dataset.fbk = '1';
      img.src = placeholder(img.getAttribute('alt'));
    });
    if (img.complete && img.naturalWidth === 0 && img.getAttribute('src')) {
      img.dataset.fbk = '1';
      img.src = placeholder(img.getAttribute('alt'));
    }
  }
  function scanImages(root) {
    var imgs = (root || document).querySelectorAll('img');
    for (var i = 0; i < imgs.length; i++) attachFallback(imgs[i]);
  }
  scanImages(document);

  /* ---------- Footer year ---------- */
  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ============================================================
     MODAL SYSTEM (research / project deep-dives + cat collage)
     ============================================================ */
  (function () {
    var modal = document.getElementById('modal');
    var body = document.getElementById('modal-body');
    if (!modal || !body) return;

    window.openModal = function (key) {
      var tpl = document.getElementById('modal-content-' + key);
      if (!tpl) return;
      body.innerHTML = tpl.innerHTML;
      modal.classList.add('open');
      modal.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
      scanImages(body);
      startBirthdayCountdown();
      var dialog = modal.querySelector('.modal-dialog');
      if (dialog) dialog.scrollTop = 0;
    };
    window.closeModal = function () {
      modal.classList.remove('open');
      modal.setAttribute('aria-hidden', 'true');
      body.innerHTML = '';
      document.body.style.overflow = '';
      if (countdownInterval) { clearInterval(countdownInterval); countdownInterval = null; }
    };

    modal.addEventListener('click', function (e) {
      if (e.target.matches('[data-close]')) window.closeModal();
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && modal.classList.contains('open')) window.closeModal();
    });
    document.addEventListener('click', function (e) {
      var link = e.target.closest('.read-more, .read-more-btn, .clickable-image, [data-modal]');
      if (!link || !link.hasAttribute('data-modal')) return;
      e.preventDefault();
      window.openModal(link.getAttribute('data-modal'));
    });
  })();

  /* ============================================================
     CONFETTI ENGINE
     ============================================================ */
  (function () {
    var canvas, ctx, pieces, animId, running = false;
    var COLORS = ['#2438e8', '#5b6cff', '#ff4b2b', '#ffb454', '#1DB954', '#9fb0ff', '#ff8c6e', '#1a1a2e'];

    function initCanvas() {
      if (!canvas) {
        canvas = document.createElement('canvas');
        canvas.id = 'confetti-canvas';
        document.body.appendChild(canvas);
      }
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      ctx = canvas.getContext('2d');
    }
    function randomPiece() {
      return {
        x: Math.random() * canvas.width,
        y: Math.random() * -canvas.height * 0.6 - 20,
        w: 5 + Math.random() * 7, h: 3 + Math.random() * 4,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        rotation: Math.random() * Math.PI * 2, rotSpeed: (Math.random() - 0.5) * 0.15,
        vx: (Math.random() - 0.5) * 3, vy: 2.5 + Math.random() * 3.5,
        wobble: Math.random() * Math.PI * 2, wobbleSpeed: 0.03 + Math.random() * 0.05, opacity: 1
      };
    }
    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      var alive = false;
      for (var i = 0; i < pieces.length; i++) {
        var p = pieces[i];
        p.x += p.vx + Math.sin(p.wobble) * 0.8; p.y += p.vy;
        p.rotation += p.rotSpeed; p.wobble += p.wobbleSpeed;
        if (p.y > canvas.height + 20) { p.opacity -= 0.05; }
        if (p.opacity <= 0) continue;
        alive = true;
        ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.rotation);
        ctx.globalAlpha = Math.max(0, p.opacity); ctx.fillStyle = p.color;
        ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h); ctx.restore();
      }
      if (alive) { animId = requestAnimationFrame(draw); }
      else { running = false; ctx.clearRect(0, 0, canvas.width, canvas.height); }
    }
    window.launchConfetti = function () {
      initCanvas(); pieces = [];
      for (var i = 0; i < 280; i++) pieces.push(randomPiece());
      if (running) cancelAnimationFrame(animId);
      running = true; draw();
    };
    window.addEventListener('resize', function () {
      if (canvas) { canvas.width = window.innerWidth; canvas.height = window.innerHeight; }
    });
  })();

  /* ============================================================
     BIRTHDAY COUNTDOWN (PST, lives inside the cat modal)
     ============================================================ */
  var countdownInterval = null;
  function isBirthdayToday() {
    var nowPST = new Date(new Date().toLocaleString('en-US', { timeZone: 'America/Los_Angeles' }));
    return nowPST.getMonth() === 1 && nowPST.getDate() === 28;
  }
  function startBirthdayCountdown() {
    var el = document.querySelector('#modal-body .birthday-countdown');
    if (!el) return;
    if (countdownInterval) clearInterval(countdownInterval);

    var btn = document.querySelector('#modal-body .confetti-btn');
    if (btn) {
      if (isBirthdayToday()) {
        btn.textContent = '🎉 Release the confetti!';
        btn.setAttribute('data-state', 'birthday');
        window.launchConfetti();
      } else {
        btn.textContent = '🎉 Confetti!';
        btn.setAttribute('data-state', 'initial');
      }
      btn.addEventListener('click', function () {
        var state = btn.getAttribute('data-state');
        if (state === 'birthday') { window.launchConfetti(); }
        else if (state === 'initial') { btn.textContent = '😿 Not yet... (I want confetti anyway)'; btn.setAttribute('data-state', 'not-yet'); }
        else if (state === 'not-yet') { window.launchConfetti(); btn.textContent = '🎉 Again!'; btn.setAttribute('data-state', 'birthday'); }
      });
    }
    function tick() {
      var nowPST = new Date(new Date().toLocaleString('en-US', { timeZone: 'America/Los_Angeles' }));
      var year = nowPST.getFullYear();
      var nextBday = new Date(year, 1, 28);
      if (nowPST >= new Date(year, 1, 29)) nextBday = new Date(year + 1, 1, 28);
      var diff = nextBday - nowPST;
      if (diff <= 0) { el.textContent = '🎉 Happy Birthday today!'; clearInterval(countdownInterval); return; }
      var d = Math.floor(diff / 86400000), h = Math.floor((diff % 86400000) / 3600000),
          m = Math.floor((diff % 3600000) / 60000), s = Math.floor((diff % 60000) / 1000);
      el.textContent = d + 'd ' + h + 'h ' + m + 'm ' + s + 's until their next birthday 🐱🐱';
    }
    tick();
    countdownInterval = setInterval(tick, 1000);
  }

  /* ============================================================
     CAT LIGHTBOX
     ============================================================ */
  (function () {
    var lightbox = document.createElement('div');
    lightbox.className = 'lightbox';
    lightbox.innerHTML =
      '<button class="lightbox-close" aria-label="Close">&times;</button>' +
      '<button class="lightbox-nav lightbox-prev" aria-label="Previous">&#8249;</button>' +
      '<img alt="Enlarged photo" />' +
      '<button class="lightbox-nav lightbox-next" aria-label="Next">&#8250;</button>';
    document.body.appendChild(lightbox);
    var lbImg = lightbox.querySelector('img');
    var images = [], currentIdx = 0;

    function openLightbox(src, allImgs, idx) {
      images = allImgs; currentIdx = idx; lbImg.src = src;
      lightbox.style.display = 'flex';
      requestAnimationFrame(function () { lightbox.classList.add('open'); });
    }
    function closeLightbox() {
      lightbox.classList.remove('open');
      setTimeout(function () { lightbox.style.display = 'none'; lbImg.removeAttribute('src'); }, 250);
    }
    function navigate(dir) { currentIdx = (currentIdx + dir + images.length) % images.length; lbImg.src = images[currentIdx].src; }

    lightbox.querySelector('.lightbox-close').addEventListener('click', closeLightbox);
    lightbox.querySelector('.lightbox-prev').addEventListener('click', function (e) { e.stopPropagation(); navigate(-1); });
    lightbox.querySelector('.lightbox-next').addEventListener('click', function (e) { e.stopPropagation(); navigate(1); });
    lightbox.addEventListener('click', function (e) { if (e.target === lightbox) closeLightbox(); });
    document.addEventListener('keydown', function (e) {
      if (lightbox.style.display !== 'flex') return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') navigate(-1);
      if (e.key === 'ArrowRight') navigate(1);
    });
    document.addEventListener('click', function (e) {
      var img = e.target.closest('.cat-collage img');
      if (!img) return;
      var collage = img.closest('.cat-collage');
      var allImgs = Array.prototype.slice.call(collage.querySelectorAll('img'));
      openLightbox(img.src, allImgs, allImgs.indexOf(img));
    });
  })();

  /* ============================================================
     SCROLL REVEALS + METRIC COUNT-UP
     Rect-based (robust even when embedded in an offscreen iframe,
     where IntersectionObserver reports nothing intersecting).
     ============================================================ */
  (function () {
    var revs = Array.prototype.slice.call(document.querySelectorAll('.reveal'));
    var nums = Array.prototype.slice.call(document.querySelectorAll('[data-count]'));
    function vh() { return window.innerHeight || document.documentElement.clientHeight; }
    function inView(el, frac) { var r = el.getBoundingClientRect(); return r.top < vh() * frac && r.bottom > 0; }
    function countUp(el) {
      var raw = el.getAttribute('data-count'), target = parseFloat(raw), dur = 1100, start = null;
      var dec = (raw.split('.')[1] || '').length;
      function fmt(v) { return dec ? v.toFixed(dec) : String(Math.round(v)); }
      if (reduceMotion) { el.textContent = fmt(target); return; }
      function step(ts) {
        if (start === null) start = ts;
        var p = Math.min((ts - start) / dur, 1), eased = 1 - Math.pow(1 - p, 3);
        el.textContent = fmt(target * eased);
        if (p < 1) requestAnimationFrame(step); else el.textContent = fmt(target);
      }
      requestAnimationFrame(step);
    }
    function check() {
      for (var i = revs.length - 1; i >= 0; i--) { if (inView(revs[i], 0.94)) { revs[i].classList.add('in'); revs.splice(i, 1); } }
      for (var j = nums.length - 1; j >= 0; j--) { if (inView(nums[j], 0.88)) { countUp(nums[j]); nums.splice(j, 1); } }
    }
    if (reduceMotion) { revs.forEach(function (e) { e.classList.add('in'); }); revs = []; }
    var ticking = false;
    function onScroll() { if (ticking) return; ticking = true; requestAnimationFrame(function () { check(); ticking = false; }); }
    check();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    window.addEventListener('load', check);
    // safety net: if anything is still hidden shortly after load, show it
    setTimeout(function () { if (revs.length) { revs.forEach(function (e) { e.classList.add('in'); }); revs = []; } if (nums.length) { nums.forEach(countUp); nums = []; } }, 2200);
  })();

  /* ============================================================
     MOBILE NAV
     ============================================================ */
  (function () {
    var toggle = document.querySelector('.nav__menu');
    var drawer = document.getElementById('nav-drawer');
    if (!toggle || !drawer) return;
    function setOpen(open) {
      drawer.classList.toggle('open', open);
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      document.body.style.overflow = open ? 'hidden' : '';
    }
    toggle.addEventListener('click', function () { setOpen(!drawer.classList.contains('open')); });
    drawer.addEventListener('click', function (e) {
      if (e.target.closest('a') || e.target === drawer) setOpen(false);
    });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') setOpen(false); });
  })();

  /* ============================================================
     ACTIVE SECTION NAV HIGHLIGHT
     ============================================================ */
  (function () {
    var links = Array.prototype.slice.call(document.querySelectorAll('.nav__links a[href^="#"]'));
    if (!links.length || !('IntersectionObserver' in window)) return;
    var map = {};
    links.forEach(function (l) { var id = l.getAttribute('href').slice(1); if (id) map[id] = l; });
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        var l = map[en.target.id];
        if (!l) return;
        if (en.isIntersecting) {
          links.forEach(function (x) { x.removeAttribute('data-active'); });
          l.setAttribute('data-active', 'true');
        }
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    Object.keys(map).forEach(function (id) { var s = document.getElementById(id); if (s) io.observe(s); });
  })();

  /* ============================================================
     SPOTIFY LIVE STATS — fetches external serverless endpoint
     ============================================================ */
  (function () {
    var SPOTIFY_API = 'https://personal-website-mauve-tau.vercel.app/api/spotify';
    var modal = document.getElementById('modal');
    var modalBody = document.getElementById('modal-body');
    var trigger = document.querySelector('.spotify-stats-trigger');
    if (!trigger || !modal || !modalBody) return;

    var SPOTIFY_SVG = '<svg viewBox="0 0 24 24" width="28" height="28" style="fill:#1DB954;flex-shrink:0"><path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/></svg>';

    var spotifyData = null;
    var activeTab = 'recent';
    var activeRanges = { songs: 'short_term', albums: 'short_term', artists: 'short_term' };

    function openSpotifyModal() {
      modal.classList.add('open');
      modal.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    }
    function esc(s) { var d = document.createElement('div'); d.textContent = s; return d.innerHTML; }
    var PODIUM_ICONS = ['\u{1F451}', '\u{1F948}', '\u{1F949}'];

    function renderTracks(tracks, ranked) {
      if (!tracks || !tracks.length) return '<p style="color:var(--muted)">No data available.</p>';
      var items = tracks.map(function (t, i) {
        var rankHtml = (ranked && i < 3)
          ? '<span class="spotify-rank spotify-rank-' + (i + 1) + '">' + PODIUM_ICONS[i] + '</span>'
          : '<span class="spotify-rank">' + (i + 1) + '</span>';
        var popHtml = '';
        if (ranked && t.popularity != null) {
          popHtml = '<span class="spotify-popularity" title="Spotify Popularity Score">' +
            '<svg class="spotify-pop-icon" viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>' +
            t.popularity + '</span>';
        }
        return '<li class="spotify-track">' + rankHtml +
          '<img src="' + esc(t.image) + '" alt="" loading="lazy" />' +
          '<div class="spotify-track-info"><a href="' + esc(t.url) + '" target="_blank" rel="noopener">' + esc(t.name) + '</a>' +
          '<span>' + esc(t.artist) + '</span></div>' + popHtml + '</li>';
      }).join('');
      return '<ul class="spotify-tracks">' + items + '</ul>';
    }
    function renderAlbums(albums) {
      if (!albums || !albums.length) return '<p style="color:var(--muted)">No data available.</p>';
      var items = albums.map(function (a, i) {
        var badge = (i < 3) ? '<span class="spotify-podium-badge spotify-podium-' + (i + 1) + '">' + PODIUM_ICONS[i] + '</span>' : '';
        return '<a href="' + esc(a.url) + '" target="_blank" rel="noopener" class="spotify-album">' +
          '<div class="spotify-album-img-wrap">' + badge + '<img src="' + esc(a.image) + '" alt="' + esc(a.name) + '" loading="lazy" /></div>' +
          '<span class="spotify-album-name">' + esc(a.name) + '</span>' +
          '<span class="spotify-album-artist">' + esc(a.artist) + '</span></a>';
      }).join('');
      return '<div class="spotify-albums">' + items + '</div>';
    }
    function renderArtists(artists) {
      if (!artists || !artists.length) return '<p style="color:var(--muted)">No data available.</p>';
      var items = artists.map(function (a, i) {
        var badge = (i < 3) ? '<span class="spotify-podium-badge spotify-podium-' + (i + 1) + '">' + PODIUM_ICONS[i] + '</span>' : '';
        var genres = (a.genres || []).map(function (g) { return esc(g); }).join(', ');
        var popHtml = '';
        if (a.popularity != null) {
          popHtml = '<span class="spotify-artist-popularity" title="Spotify Popularity Score">' +
            '<svg class="spotify-pop-icon" viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>' +
            a.popularity + '</span>';
        }
        return '<a href="' + esc(a.url) + '" target="_blank" rel="noopener" class="spotify-artist">' +
          '<div class="spotify-artist-img-wrap">' + badge + '<img src="' + esc(a.image) + '" alt="' + esc(a.name) + '" loading="lazy" /></div>' +
          '<span class="spotify-artist-name">' + esc(a.name) + '</span>' +
          (genres ? '<span class="spotify-artist-genres">' + genres + '</span>' : '') + popHtml + '</a>';
      }).join('');
      return '<div class="spotify-artists">' + items + '</div>';
    }
    function buildRangeButtons(tabId) {
      return '<div class="spotify-tab-flyout">' +
        '<button class="spotify-range active" data-stab="' + tabId + '" data-srange="short_term">4 Weeks</button>' +
        '<button class="spotify-range" data-stab="' + tabId + '" data-srange="medium_term">6 Months</button>' +
        '<button class="spotify-range" data-stab="' + tabId + '" data-srange="long_term">All Time</button></div>';
    }
    function getPanelContent(tab, range) {
      if (!spotifyData) return '';
      if (tab === 'recent') return renderTracks(spotifyData.recentTracks, false);
      if (tab === 'songs') return renderTracks(spotifyData.tracks && spotifyData.tracks[range], true);
      if (tab === 'albums') return renderAlbums(spotifyData.albums && spotifyData.albums[range]);
      if (tab === 'artists') return renderArtists(spotifyData.artists && spotifyData.artists[range]);
      return '';
    }
    function buildContent(data) {
      spotifyData = data; activeTab = 'recent';
      activeRanges = { songs: 'short_term', albums: 'short_term', artists: 'short_term' };
      var html = '<div class="spotify-header">' +
        '<h2 id="modal-title" class="spotify-modal-title">' + SPOTIFY_SVG + ' My Spotify Stats</h2>' +
        '<div class="spotify-tabs" role="tablist">' +
        '<button class="spotify-tab active" data-stab="recent" role="tab">Recently Played</button>' +
        '<div class="spotify-tab-group"><button class="spotify-tab" data-stab="songs" role="tab">Top Songs</button>' + buildRangeButtons('songs') + '</div>' +
        '<div class="spotify-tab-group"><button class="spotify-tab" data-stab="albums" role="tab">Top Albums</button>' + buildRangeButtons('albums') + '</div>' +
        '<div class="spotify-tab-group"><button class="spotify-tab" data-stab="artists" role="tab">Top Artists</button>' + buildRangeButtons('artists') + '</div>' +
        '</div></div>';
      html += '<div class="spotify-panel" role="tabpanel">' + getPanelContent('recent', 'short_term') + '</div>';
      return html;
    }
    function switchTab(tab, range) {
      activeTab = tab;
      if (range && activeRanges.hasOwnProperty(tab)) activeRanges[tab] = range;
      var currentRange = activeRanges[tab] || 'short_term';
      modalBody.querySelectorAll('.spotify-tab').forEach(function (t) {
        t.classList.toggle('active', t.getAttribute('data-stab') === tab);
      });
      modalBody.querySelectorAll('.spotify-range').forEach(function (r) {
        r.classList.toggle('active', r.getAttribute('data-stab') === tab && r.getAttribute('data-srange') === currentRange);
      });
      var panel = modalBody.querySelector('.spotify-panel');
      if (panel) {
        panel.innerHTML = getPanelContent(tab, currentRange);
        scanImages(panel);
        panel.style.animation = 'none'; void panel.offsetWidth; panel.style.animation = '';
      }
    }
    modalBody.addEventListener('click', function (e) {
      var range = e.target.closest('.spotify-range');
      if (range) { switchTab(range.getAttribute('data-stab'), range.getAttribute('data-srange')); return; }
      var tab = e.target.closest('.spotify-tab');
      if (!tab) return;
      switchTab(tab.getAttribute('data-stab'));
    });
    trigger.addEventListener('click', function () {
      modalBody.innerHTML =
        '<div class="spotify-header"><h2 id="modal-title" class="spotify-modal-title">' + SPOTIFY_SVG + ' My Spotify Stats</h2></div>' +
        '<div class="spotify-loading"><div class="spotify-spinner"></div><p>Loading stats from Spotify&hellip;</p></div>';
      openSpotifyModal();
      fetch(SPOTIFY_API)
        .then(function (r) { if (!r.ok) throw new Error(r.status); return r.json(); })
        .then(function (data) { if (modal.classList.contains('open')) { modalBody.innerHTML = buildContent(data); scanImages(modalBody); } })
        .catch(function () {
          if (modal.classList.contains('open')) {
            modalBody.innerHTML =
              '<div class="spotify-header"><h2 id="modal-title" class="spotify-modal-title">' + SPOTIFY_SVG + ' My Spotify Stats</h2></div>' +
              '<p class="spotify-error">Could not load Spotify data right now. Please try again later.</p>';
          }
        });
    });
  })();
})();
