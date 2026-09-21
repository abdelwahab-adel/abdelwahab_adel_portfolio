/* ═══════════════════════════════════════════════════════
   ABDELWAHAB ADEL — Premium Light Portfolio · JS
   GSAP + ScrollTrigger cinematic scroll system
   ═══════════════════════════════════════════════════════ */

(() => {
  'use strict';

  const hasHover = window.matchMedia('(hover: hover)').matches;
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const hasGSAP = !!(window.gsap && window.ScrollTrigger);
  let isDesktop = window.innerWidth >= 900;

  if (hasGSAP) {
    gsap.registerPlugin(ScrollTrigger);
  } else {
    document.documentElement.classList.add('no-gsap');
  }

  /* ─────────────────────────────────────────────────
     Intro preloader — plays on an actual page reload
     (F5 / reload button) AND on the very first page a
     visitor lands on this session. Clicking between
     Home/Projects afterwards, and Back/Forward, both
     skip it so browsing the site isn't interrupted.
     ───────────────────────────────────────────────── */
  (() => {
    const preloader = document.getElementById('preloader');
    if (!preloader) return;

    function getNavigationType() {
      try {
        const entries = performance.getEntriesByType('navigation');
        if (entries && entries.length) return entries[0].type;
      } catch (e) { /* Navigation Timing unavailable — fall through */ }
      if (performance.navigation) {
        if (performance.navigation.type === 1) return 'reload';
        if (performance.navigation.type === 2) return 'back_forward';
      }
      return 'navigate';
    }

    let isFirstVisitThisSession = true;
    try { isFirstVisitThisSession = !sessionStorage.getItem('pw-visited'); } catch (e) { /* storage blocked — treat as first visit */ }

    if (getNavigationType() !== 'reload' && !isFirstVisitThisSession) {
      preloader.remove();
      return;
    }

    try { sessionStorage.setItem('pw-visited', '1'); } catch (e) { /* storage blocked — intro simply replays */ }

    const wordmarkEl = preloader.querySelector('.preloader-wordmark');
    const roleEl = preloader.querySelector('.preloader-role');
    if (!wordmarkEl || !roleEl) { preloader.remove(); return; }
    document.body.classList.add('is-preloading');

    function exit() {
      preloader.classList.add('is-hiding');
      document.body.classList.remove('is-preloading');
      window.setTimeout(() => preloader.remove(), 650);
    }
    window.setTimeout(exit, 6000); // hard failsafe — never trap the page behind the intro

    if (reduceMotion) {
      wordmarkEl.classList.add('is-static');
      roleEl.classList.add('is-in');
      window.setTimeout(exit, 400);
      return;
    }

    if (hasGSAP && wordmarkEl) {
      const chars = splitChars(wordmarkEl);
      gsap.set(wordmarkEl, { opacity: 1 });
      gsap.set(chars, { opacity: 0, y: 26 });
      gsap.timeline({ onComplete: () => window.setTimeout(exit, 550) })
        .to(chars, { opacity: 1, y: 0, duration: 0.55, ease: 'power3.out', stagger: 0.03 })
        .to(roleEl, { opacity: 1, y: 0, duration: 0.45, ease: 'power3.out' }, '-=0.25');
    } else {
      wordmarkEl.classList.add('is-static');
      roleEl.classList.add('is-in');
      window.setTimeout(exit, 1200);
    }
  })();

  /* ─────────────────────────────────────────────────
     Split-text utilities (no paid SplitText plugin needed)
     ───────────────────────────────────────────────── */
  function splitChars(root) {
    const chars = [];
    function walk(node) {
      if (node.nodeType === Node.TEXT_NODE) {
        const frag = document.createDocumentFragment();
        // Letters are grouped into nowrap "words": separate inline-block letters may otherwise
        // wrap in the middle of a word on narrow screens ("Abdelwa / hab").
        let word = null;
        for (const ch of node.textContent) {
          if (/\s/.test(ch)) {
            word = null;
            frag.appendChild(document.createTextNode(ch));
          } else {
            if (!word) {
              word = document.createElement('span');
              word.className = 'char-word';
              frag.appendChild(word);
            }
            const span = document.createElement('span');
            span.className = 'char';
            span.setAttribute('aria-hidden', 'true');
            span.textContent = ch;
            word.appendChild(span);
            chars.push(span);
          }
        }
        node.replaceWith(frag);
      } else if (node.nodeType === Node.ELEMENT_NODE && node.tagName !== 'BR') {
        Array.from(node.childNodes).forEach(walk);
      }
    }
    Array.from(root.childNodes).forEach(walk);
    return chars;
  }

  function splitWordsMask(root) {
    function walk(node) {
      if (node.nodeType === Node.TEXT_NODE) {
        const frag = document.createDocumentFragment();
        const parts = node.textContent.split(/(\s+)/);
        parts.forEach((part) => {
          if (part === '') return;
          if (/^\s+$/.test(part)) {
            frag.appendChild(document.createTextNode(part));
            return;
          }
          const mask = document.createElement('span');
          mask.className = 'word-mask';
          const inner = document.createElement('span');
          inner.className = 'word-inner';
          inner.textContent = part;
          mask.appendChild(inner);
          frag.appendChild(mask);
        });
        node.replaceWith(frag);
      } else if (node.nodeType === Node.ELEMENT_NODE && node.tagName !== 'BR') {
        Array.from(node.childNodes).forEach(walk);
      }
    }
    Array.from(root.childNodes).forEach(walk);
    return Array.from(root.querySelectorAll('.word-inner'));
  }

  /* ─────────────────────────────────────────────────
     Year
     ───────────────────────────────────────────────── */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ─────────────────────────────────────────────────
     Broken images are hidden (this used to be an inline
     onerror="" attribute, which a strict CSP forbids).
     ───────────────────────────────────────────────── */
  document.querySelectorAll('img').forEach((img) => {
    const hide = () => { img.style.display = 'none'; };
    if (img.complete && img.naturalWidth === 0 && img.getAttribute('src')) hide();
    else img.addEventListener('error', hide, { once: true });
  });

  const syncChips = (chips) => chips.forEach((c) => c.setAttribute('aria-pressed', c.classList.contains('active') ? 'true' : 'false'));

  /* ─────────────────────────────────────────────────
     Navbar scroll state + scroll progress
     ───────────────────────────────────────────────── */
  const nav = document.getElementById('nav');
  const onScroll = () => {
    const y = window.scrollY;
    if (nav) nav.classList.toggle('scrolled', y > 16);
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const pct = max > 0 ? Math.min(100, (y / max) * 100) : 0;
    const sp = document.getElementById('scroll-progress');
    if (sp) sp.style.width = pct + '%';
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ─────────────────────────────────────────────────
     Active nav link on scroll (intersection)
     ───────────────────────────────────────────────── */
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');
  const setActive = (id) => {
    navLinks.forEach((l) => {
      l.classList.toggle('active', l.getAttribute('href') === '#' + id);
    });
  };
  const navObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) setActive(e.target.id);
      });
    },
    { rootMargin: '-40% 0px -55% 0px', threshold: 0 }
  );
  sections.forEach((s) => navObserver.observe(s));

  /* ─────────────────────────────────────────────────
     Mobile menu
     ───────────────────────────────────────────────── */
  const menuBtn = document.getElementById('menu-btn');
  const mobileNav = document.getElementById('mobile-nav');
  const mobileLinks = document.querySelectorAll('.mobile-link');
  const closeMenu = () => {
    menuBtn.classList.remove('active');
    mobileNav.classList.remove('open');
    menuBtn.setAttribute('aria-expanded', 'false');
    menuBtn.setAttribute('aria-label', 'Open menu');
    document.body.style.overflow = '';
  };
  const openMenu = () => {
    menuBtn.classList.add('active');
    mobileNav.classList.add('open');
    menuBtn.setAttribute('aria-expanded', 'true');
    menuBtn.setAttribute('aria-label', 'Close menu');
    document.body.style.overflow = 'hidden';
    if (mobileLinks[0]) mobileLinks[0].focus({ preventScroll: true });
  };
  if (menuBtn) {
    menuBtn.addEventListener('click', () => {
      if (mobileNav.classList.contains('open')) closeMenu();
      else openMenu();
    });
    mobileLinks.forEach((l) => l.addEventListener('click', closeMenu));
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && mobileNav.classList.contains('open')) {
        closeMenu();
        menuBtn.focus();
      }
    });
    // The drawer is only meant for narrow screens — don't leave it (and the scroll lock) open after a resize.
    window.matchMedia('(min-width: 1101px)').addEventListener('change', (e) => {
      if (e.matches && mobileNav.classList.contains('open')) closeMenu();
    });
  }

  /* ─────────────────────────────────────────────────
     HERO — letter-by-letter cinematic entrance
     ───────────────────────────────────────────────── */
  const heroTitle = document.querySelector('.hero-title-v2');
  const typingFallback = document.getElementById('typing-text');
  if (typingFallback) typingFallback.textContent = ''; // static fallback text is for no-JS only; the typewriter refills it
  if (heroTitle) {
    if (hasGSAP && !reduceMotion) {
      const chars = splitChars(heroTitle);
      gsap.set(chars, { opacity: 0, y: 46, rotateZ: 6 });
      gsap.to(chars, {
        opacity: 1,
        y: 0,
        rotateZ: 0,
        duration: 0.7,
        ease: 'back.out(1.6)',
        stagger: 0.012,
        delay: 0.05
      });
    } else {
      heroTitle.style.opacity = '1';
    }
  }

  /* ─────────────────────────────────────────────────
     Section titles — word mask reveal on scroll
     ───────────────────────────────────────────────── */
  if (hasGSAP && !reduceMotion) {
    const titles = document.querySelectorAll('.section-title, .contact-title');
    titles.forEach((title) => {
      const words = splitWordsMask(title);
      if (!words.length) return;
      gsap.set(words, { yPercent: 115 });
      ScrollTrigger.create({
        trigger: title,
        start: 'top 90%',
        once: true,
        onEnter: () => {
          gsap.to(words, {
            yPercent: 0,
            duration: 0.6,
            ease: 'power4.out',
            stagger: 0.025
          });
        }
      });
    });
  }

  /* ─────────────────────────────────────────────────
     Stagger groups → promote children to .reveal
     ───────────────────────────────────────────────── */
  document.querySelectorAll('[data-stagger]').forEach((group) => {
    Array.from(group.children).forEach((child) => child.classList.add('reveal'));
  });

  /* ─────────────────────────────────────────────────
     Generic reveal-on-scroll (GSAP batch, cinematic ease)
     with graceful no-JS/no-GSAP fallback
     ───────────────────────────────────────────────── */
  const revealEls = Array.from(document.querySelectorAll('.reveal'));
  if (hasGSAP) {
    if (reduceMotion) {
      gsap.set(revealEls, { opacity: 1, y: 0 });
    } else {
      gsap.set(revealEls, { opacity: 0, y: 16 });
      ScrollTrigger.batch(revealEls, {
        start: 'top 88%',
        onEnter: (batch) => {
          gsap.to(batch, {
            opacity: 1,
            y: 0,
            duration: 0.55,
            ease: 'power3.out',
            stagger: 0.05,
            overwrite: true
          });
        },
        once: true
      });
    }
  } else {
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('visible');
            revealObserver.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -8% 0px' }
    );
    revealEls.forEach((r) => revealObserver.observe(r));
  }

  /* ─────────────────────────────────────────────────
     Number counters
     ───────────────────────────────────────────────── */
  const counters = document.querySelectorAll('[data-count]');
  // HTML holds the final numbers (no-JS / reduced motion); when animating we count up from 0.
  if (!reduceMotion) counters.forEach((c) => { c.textContent = '0'; });
  const animateCount = (el) => {
    const target = parseInt(el.dataset.count, 10);
    const duration = 900;
    const start = performance.now();
    const tick = (now) => {
      const t = Math.min(1, (now - start) / duration);
      const e = 1 - Math.pow(1 - t, 3);
      el.textContent = Math.floor(target * e).toString();
      if (t < 1) requestAnimationFrame(tick);
      else el.textContent = target.toString();
    };
    requestAnimationFrame(tick);
  };
  const counterObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          animateCount(e.target);
          counterObserver.unobserve(e.target);
        }
      });
    },
    { threshold: 0.4 }
  );
  if (!reduceMotion) counters.forEach((c) => counterObserver.observe(c));

  /* ─────────────────────────────────────────────────
     Skill progress bars — fill on scroll into view
     ───────────────────────────────────────────────── */
  const progressBars = document.querySelectorAll('.progress-bar');
  if (progressBars.length) {
    const progressObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const bar = entry.target;
            const target = bar.dataset.target || '0';
            requestAnimationFrame(() => {
              bar.style.width = target + '%';
            });
            progressObserver.unobserve(bar);
          }
        });
      },
      { threshold: 0.4 }
    );
    progressBars.forEach((b) => progressObserver.observe(b));
  }

  /* ─────────────────────────────────────────────────
     Projects — horizontal movement driven by vertical
     scroll (pin + scrub), not autoplay. Falls back to a
     native swipeable row on mobile / reduced motion.
     ───────────────────────────────────────────────── */
  const filterBar = document.getElementById('projects-filter');
  const marquee = document.getElementById('project-marquee');
  const track = document.getElementById('project-track');
  const countText = document.getElementById('projects-count-text');
  const HIDE_MS = 380;

  if (filterBar && track && marquee) {
    const originalCards = Array.from(track.querySelectorAll('.project-card'));
    const originalMore = track.querySelector('.project-more-tile');
    const chips = Array.from(filterBar.querySelectorAll('.filter-chip'));
    syncChips(chips);
    let horizontalST = null;

    const setTileVisible = (el, show) => {
      if (show) {
        el.style.display = '';
        void el.offsetWidth;
        requestAnimationFrame(() => el.classList.remove('hide'));
      } else {
        el.classList.add('hide');
        window.setTimeout(() => {
          if (el.classList.contains('hide')) el.style.display = 'none';
        }, HIDE_MS);
      }
    };

    const killHorizontalScroll = () => {
      if (horizontalST) {
        horizontalST.kill();
        horizontalST = null;
      }
      marquee.classList.remove('is-pinned');
      if (hasGSAP) gsap.set(track, { x: 0 });
    };

    const setupHorizontalScroll = () => {
      if (!hasGSAP || reduceMotion || !isDesktop) return;
      killHorizontalScroll();
      const distance = track.scrollWidth - marquee.clientWidth;
      if (distance <= 40) return;
      marquee.classList.add('is-pinned');
      gsap.set(track, { x: 0 });
      horizontalST = ScrollTrigger.create({
        trigger: marquee,
        start: 'top top+=96',
        end: '+=' + distance,
        pin: true,
        scrub: 0.6,
        invalidateOnRefresh: true,
        onUpdate: (self) => gsap.set(track, { x: -distance * self.progress })
      });
    };

    const renderCount = (isAll, visible, filter) => {
      if (!countText) return;
      countText.textContent = '';
      const add = (t) => countText.appendChild(document.createTextNode(t));
      const strong = (t) => { const el = document.createElement('strong'); el.textContent = t; countText.appendChild(el); };
      if (isAll) {
        add('Showing '); strong(String(originalCards.length)); add(' of '); strong('49+'); add(' projects · ');
      } else {
        const activeChip = filterBar.querySelector('[data-filter="' + filter + '"]');
        const label = activeChip ? activeChip.textContent.trim() : filter;
        add('Showing '); strong(String(visible)); add(' ' + label + ' project' + (visible === 1 ? '' : 's') + ' · ');
      }
      const a = document.createElement('a');
      a.href = 'https://github.com/abdelwahab-adel/';
      a.target = '_blank';
      a.rel = 'noopener';
      a.className = 'projects-controls-link';
      a.textContent = 'View all on GitHub →';
      countText.appendChild(a);
    };

    const applyFilter = (filter) => {
      const isAll = filter === 'all';
      track.classList.toggle('is-static', !isAll);
      if (!isAll) killHorizontalScroll();

      let visible = 0;
      originalCards.forEach((card) => {
        const match = isAll || card.dataset.category === filter;
        setTileVisible(card, match);
        if (match) visible++;
      });
      if (originalMore) setTileVisible(originalMore, isAll);

      renderCount(isAll, visible, filter);

      if (isAll) {
        window.setTimeout(() => {
          setupHorizontalScroll();
          if (hasGSAP) ScrollTrigger.refresh();
        }, HIDE_MS + 60);
      }
    };

    chips.forEach((chip) => {
      chip.addEventListener('click', () => {
        if (chip.classList.contains('active')) return;
        chips.forEach((c) => c.classList.remove('active'));
        chip.classList.add('active');
        syncChips(chips);
        applyFilter(chip.dataset.filter);
      });
    });

    // Keyboard: focusing an off-screen card must bring it into view. While the strip is pinned the
    // browser can only nudge the (overflow:hidden) container, so translate that into page scroll.
    track.addEventListener('focusin', (e) => {
      if (!horizontalST) return;
      const item = e.target.closest('.project-card, .project-more-tile');
      if (!item) return;
      marquee.scrollLeft = 0; // undo the browser's own focus-scroll; the GSAP transform does the moving
      const distance = track.scrollWidth - marquee.clientWidth;
      const offset = item.getBoundingClientRect().left - track.getBoundingClientRect().left - 32;
      const progress = Math.min(1, Math.max(0, offset / distance));
      window.scrollTo({ top: horizontalST.start + progress * (horizontalST.end - horizontalST.start), behavior: 'auto' });
    });

    setupHorizontalScroll();
    window.addEventListener('load', () => setupHorizontalScroll());
    let projResizeTimer;
    window.addEventListener('resize', () => {
      clearTimeout(projResizeTimer);
      projResizeTimer = setTimeout(() => {
        isDesktop = window.innerWidth >= 900;
        if (!track.classList.contains('is-static')) setupHorizontalScroll();
      }, 250);
    });
  }

  /* ─────────────────────────────────────────────────
     Projects page — filter for the full grid (no pinned strip here).
     Was an inline <script>, which a strict CSP forbids.
     ───────────────────────────────────────────────── */
  (() => {
    const bar = document.getElementById('projects-filter');
    const grid = document.getElementById('projects-full-grid');
    const emptyMsg = document.getElementById('projects-empty-msg');
    if (!bar || !grid) return;

    const cards = Array.from(grid.querySelectorAll('.project-card'));
    const chips = Array.from(bar.querySelectorAll('.filter-chip'));
    syncChips(chips);

    const setVisible = (el, show) => {
      if (show) {
        el.style.display = '';
        void el.offsetWidth;
        requestAnimationFrame(() => el.classList.remove('hide'));
      } else {
        el.classList.add('hide');
        window.setTimeout(() => {
          if (el.classList.contains('hide')) el.style.display = 'none';
        }, HIDE_MS);
      }
    };

    chips.forEach((chip) => {
      chip.addEventListener('click', () => {
        if (chip.classList.contains('active')) return;
        chips.forEach((c) => c.classList.remove('active'));
        chip.classList.add('active');
        syncChips(chips);
        const filter = chip.dataset.filter;
        let visible = 0;
        cards.forEach((card) => {
          const match = filter === 'all' || card.dataset.category === filter;
          setVisible(card, match);
          if (match) visible++;
        });
        if (emptyMsg) emptyMsg.hidden = visible !== 0;
        if (hasGSAP) window.setTimeout(() => ScrollTrigger.refresh(), HIDE_MS + 60);
      });
    });
  })();

  /* ─────────────────────────────────────────────────
     Project card tilt (fine pointers only)
     ───────────────────────────────────────────────── */
  if (hasHover) {
    document.querySelectorAll('.project-card').forEach((card) => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width;
        const y = (e.clientY - rect.top) / rect.height;
        const rotateY = (x - 0.5) * 7;
        const rotateX = (0.5 - y) * 7;
        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
      });
      card.addEventListener('mouseleave', () => {
        card.style.transform = '';
      });
    });
  }

  /* ─────────────────────────────────────────────────
     Project details modal — one shared dialog, built
     once and re-populated from whichever .project-card
     the visitor opens. Links inside the card (Live Demo /
     GitHub) still work normally and don't open the modal.
     ───────────────────────────────────────────────── */
  (() => {
    const cards = Array.from(document.querySelectorAll('.project-card'));
    if (!cards.length) return;

    const EXTERNAL_ICON = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M15 3h6v6"/><path d="M10 14 21 3"/><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/></svg>';
    const GITHUB_ICON = '<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 .5C5.73.5.5 5.73.5 12c0 5.08 3.29 9.39 7.86 10.91.57.1.78-.25.78-.55 0-.27-.01-1.17-.02-2.12-3.2.7-3.88-1.36-3.88-1.36-.52-1.33-1.28-1.68-1.28-1.68-1.04-.71.08-.7.08-.7 1.15.08 1.76 1.18 1.76 1.18 1.03 1.76 2.7 1.25 3.36.96.1-.75.4-1.25.73-1.54-2.55-.29-5.23-1.28-5.23-5.68 0-1.25.45-2.28 1.18-3.08-.12-.29-.51-1.46.11-3.04 0 0 .96-.31 3.15 1.18a10.9 10.9 0 0 1 5.74 0c2.19-1.49 3.15-1.18 3.15-1.18.62 1.58.23 2.75.11 3.04.74.8 1.18 1.83 1.18 3.08 0 4.41-2.69 5.38-5.25 5.67.41.36.78 1.08.78 2.17 0 1.57-.01 2.83-.01 3.22 0 .3.2.66.79.55A10.52 10.52 0 0 0 23.5 12C23.5 5.73 18.27.5 12 .5z"/></svg>';

    const overlay = document.createElement('div');
    overlay.className = 'pm-overlay';
    overlay.setAttribute('aria-hidden', 'true');
    overlay.innerHTML =
      '<div class="pm-dialog" role="dialog" aria-modal="true" aria-labelledby="pm-title">' +
        '<div class="pm-media">' +
          '<img id="pm-image" src="" alt="">' +
          '<button type="button" class="pm-close" aria-label="Close project details">' +
            '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>' +
          '</button>' +
        '</div>' +
        '<div class="pm-body">' +
          '<div class="pm-badges">' +
            '<span class="pm-badge pm-badge-dark" id="pm-type"></span>' +
            '<span class="pm-badge pm-badge-success"><span class="pm-dot" aria-hidden="true"></span><span id="pm-status"></span></span>' +
          '</div>' +
          '<h3 id="pm-title" class="pm-title"></h3>' +
          '<p id="pm-desc" class="pm-desc"></p>' +
          '<div class="pm-actions" id="pm-actions"></div>' +
          '<div class="pm-tech" id="pm-tech"></div>' +
          '<div class="pm-divider" aria-hidden="true"></div>' +
          '<span class="pm-section-label">' +
            '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 22a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.704.706l3.588 3.588A2.4 2.4 0 0 1 20 8v12a2 2 0 0 1-2 2z"/><path d="M14 2v5a1 1 0 0 0 1 1h5"/><path d="M10 9H8"/><path d="M16 13H8"/><path d="M16 17H8"/></svg>' +
            'About the project' +
          '</span>' +
          '<div id="pm-about-text" class="pm-about-text"></div>' +
        '</div>' +
      '</div>';
    document.body.appendChild(overlay);

    const closeBtn  = overlay.querySelector('.pm-close');
    const pmImage   = overlay.querySelector('#pm-image');
    const pmType    = overlay.querySelector('#pm-type');
    const pmStatus  = overlay.querySelector('#pm-status');
    const pmTitle   = overlay.querySelector('#pm-title');
    const pmDesc    = overlay.querySelector('#pm-desc');
    const pmActions = overlay.querySelector('#pm-actions');
    const pmTech    = overlay.querySelector('#pm-tech');
    const pmAbout   = overlay.querySelector('#pm-about-text');

    let lastFocused = null;

    function openModal(card) {
      lastFocused = document.activeElement;

      const img = card.querySelector('.project-device img');
      pmImage.src = img ? img.getAttribute('src') : '';
      pmImage.alt = img ? img.getAttribute('alt') : '';

      const tagPill = card.querySelector('.project-tag-pill');
      pmType.textContent = card.dataset.type || (tagPill ? tagPill.textContent.trim() : 'Project');
      pmStatus.textContent = card.dataset.status || 'Completed';

      pmTitle.textContent = card.querySelector('h3') ? card.querySelector('h3').textContent.trim() : '';
      const descEl = card.querySelector('.project-card-content > p');
      pmDesc.textContent = descEl ? descEl.textContent.trim() : '';

      pmActions.textContent = '';
      Array.from(card.querySelectorAll('.project-links a')).forEach((link, i) => {
        let url;
        try { url = new URL(link.href); } catch (err) { return; }
        if (url.protocol !== 'https:' && url.protocol !== 'http:') return;
        const isGithub = url.hostname === 'github.com';
        const isRepo = isGithub && url.pathname.split('/').filter(Boolean).length >= 2;
        const a = document.createElement('a');
        a.href = url.href;
        a.target = '_blank';
        a.rel = 'noopener';
        a.className = 'pm-btn ' + (i === 0 ? 'pm-btn-primary' : 'pm-btn-ghost');
        a.insertAdjacentHTML('afterbegin', isGithub ? GITHUB_ICON : EXTERNAL_ICON); // trusted constants
        const text = document.createElement('span');
        text.textContent = isRepo ? 'View Code' : link.textContent.trim();
        a.appendChild(text);
        pmActions.appendChild(a);
      });

      pmTech.innerHTML = '';
      card.querySelectorAll('.project-stack span').forEach((s) => {
        const span = document.createElement('span');
        span.textContent = s.textContent;
        pmTech.appendChild(span);
      });

      pmAbout.innerHTML = '';
      (card.dataset.about || '').split(/\n\s*\n/).forEach((para) => {
        if (!para.trim()) return;
        const p = document.createElement('p');
        p.textContent = para.trim();
        pmAbout.appendChild(p);
      });

      overlay.classList.add('open');
      overlay.setAttribute('aria-hidden', 'false');
      document.body.classList.add('pm-open');
      // Root cause was `transition: all` on the close button (see style.css). Kept as a safety net: if the
      // browser still refuses focus for a moment, poll briefly instead of relying on frame timing.
      const focusClose = () => closeBtn.focus({ preventScroll: true });
      focusClose();
      if (document.activeElement !== closeBtn) {
        let tries = 0;
        const timer = window.setInterval(() => {
          focusClose();
          if (document.activeElement === closeBtn || ++tries > 20 || !overlay.classList.contains('open')) window.clearInterval(timer);
        }, 30);
      }
    }

    function closeModal() {
      overlay.classList.remove('open');
      overlay.setAttribute('aria-hidden', 'true');
      document.body.classList.remove('pm-open');
      if (lastFocused && lastFocused.focus) lastFocused.focus();
    }

    closeBtn.addEventListener('click', closeModal);
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) closeModal();
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && overlay.classList.contains('open')) closeModal();
    });
    // aria-modal only *declares* a modal — keep keyboard focus inside it as well.
    document.addEventListener('keydown', (e) => {
      if (e.key !== 'Tab' || !overlay.classList.contains('open')) return;
      const f = Array.from(overlay.querySelectorAll('a[href], button:not([disabled])')).filter((el) => el.offsetParent !== null);
      if (!f.length) return;
      const first = f[0];
      const last = f[f.length - 1];
      if (!overlay.contains(document.activeElement)) { e.preventDefault(); first.focus(); }
      else if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    });

    cards.forEach((card) => {
      const opener = card.querySelector('.project-open');
      if (!opener) return;
      opener.setAttribute('aria-haspopup', 'dialog');
      opener.addEventListener('click', () => openModal(card));
    });
  })();

  /* ─────────────────────────────────────────────────
     Magnetic buttons & chips
     ───────────────────────────────────────────────── */
  if (hasHover) {
    document.querySelectorAll('.btn, .filter-chip, .project-more-tile').forEach((btn) => {
      btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const x = (e.clientX - rect.left - rect.width / 2) * 0.25;
        const y = (e.clientY - rect.top - rect.height / 2) * 0.25;
        btn.style.transform = `translate(${x}px, ${y}px)`;
      });
      btn.addEventListener('mouseleave', () => {
        btn.style.transform = '';
      });
    });
  }

  /* ─────────────────────────────────────────────────
     Smooth scroll for in-page anchors
     ───────────────────────────────────────────────── */
  document.querySelectorAll('a[href^="#"]').forEach((a) => {
    a.addEventListener('click', (e) => {
      const id = a.getAttribute('href');
      if (id.length <= 1) return;
      const target = document.getElementById(id.slice(1));
      if (!target) return;
      e.preventDefault();
      const top = target.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top, behavior: reduceMotion ? 'auto' : 'smooth' });
      // Move keyboard focus with the view (skip link + nav links), and keep the URL in sync.
      if (!target.hasAttribute('tabindex')) target.setAttribute('tabindex', '-1');
      target.focus({ preventScroll: true });
      if (window.history && history.pushState) history.pushState(null, '', id);
    });
  });

  /* ─────────────────────────────────────────────────
     Hero — portrait tilt on mouse move
     ───────────────────────────────────────────────── */
  const hero = document.getElementById('home');
  if (hero && hasHover) {
    const portrait = hero.querySelector('.hero-portrait');
    if (portrait) {
      hero.addEventListener('mousemove', (e) => {
        const rect = hero.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        portrait.style.transform = `perspective(1200px) rotateY(${x * 6}deg) rotateX(${-y * 6}deg)`;
      });
      hero.addEventListener('mouseleave', () => {
        portrait.style.transform = '';
      });
    }
  }

  /* ─────────────────────────────────────────────────
     Hero — typewriter effect
     ───────────────────────────────────────────────── */
  (() => {
    const el = document.getElementById('typing-text');
    if (!el) return;
    const phrases = ['scalable web apps.', 'clean Laravel APIs.', 'modern interfaces.', 'full-stack platforms.'];

    if (reduceMotion) {
      el.textContent = phrases[0];
      return;
    }

    let phraseIndex = 0;
    let charIndex = 0;
    let deleting = false;
    const typeSpeed = 32;
    const deleteSpeed = 16;
    const holdTime = 1200;

    const tick = () => {
      const current = phrases[phraseIndex];
      if (!deleting) {
        charIndex++;
        el.textContent = current.slice(0, charIndex);
        if (charIndex === current.length) {
          deleting = true;
          setTimeout(tick, holdTime);
          return;
        }
        setTimeout(tick, typeSpeed);
      } else {
        charIndex--;
        el.textContent = current.slice(0, charIndex);
        if (charIndex === 0) {
          deleting = false;
          phraseIndex = (phraseIndex + 1) % phrases.length;
          setTimeout(tick, 300);
          return;
        }
        setTimeout(tick, deleteSpeed);
      }
    };
    tick();
  })();

  /* ─────────────────────────────────────────────────
     Hero — scroll parallax (portrait drift)
     ───────────────────────────────────────────────── */
  if (hasGSAP && !reduceMotion && hero) {
    const portraitEl = hero.querySelector('.hero-portrait');
    if (portraitEl) {
      gsap.to(portraitEl, {
        y: 60,
        ease: 'none',
        scrollTrigger: {
          trigger: hero,
          start: 'top top',
          end: 'bottom top',
          scrub: true
        }
      });
    }
  }

  /* ─────────────────────────────────────────────────
     Generic scroll parallax for decorative visuals
     ───────────────────────────────────────────────── */
  if (hasGSAP && !reduceMotion) {
    gsap.utils.toArray('[data-parallax]').forEach((el) => {
      const speed = parseFloat(el.dataset.parallax) || 0.15;
      gsap.to(el, {
        y: () => -160 * speed,
        ease: 'none',
        scrollTrigger: {
          trigger: el,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true
        }
      });
    });
  }

  /* ─────────────────────────────────────────────────
     Services — pinned stacking cards (desktop only)
     ───────────────────────────────────────────────── */
  if (hasGSAP && !reduceMotion && isDesktop) {
    const stackCards = gsap.utils.toArray('.services-list .service-feature');
    if (stackCards.length > 1) {
      stackCards.forEach((card, i) => {
        const isLast = i === stackCards.length - 1;
        // Explicit stacking order — guarantees each card renders above the
        // ones before it even when ScrollTrigger wraps pinned cards in its
        // own spacer elements (which breaks CSS :nth-child z-index rules).
        gsap.set(card, { zIndex: i + 1 });
        if (!isLast) {
          ScrollTrigger.create({
            trigger: card,
            start: 'top 96px',
            // Hand off the pin to the NEXT card, not the last one — each
            // card should only stay pinned until it's covered by the card
            // right after it. Pinning until the final card caused every
            // earlier card to stay stacked (and visible/ghosting through
            // the faded 0.65-opacity cards) for the rest of the section.
            endTrigger: stackCards[i + 1],
            end: 'top 96px',
            pin: true,
            pinSpacing: false
          });
        }
        if (i > 0) {
          gsap.to(stackCards[i - 1], {
            scale: 0.94,
            opacity: 0.65,
            filter: 'blur(1px)',
            ease: 'none',
            scrollTrigger: {
              trigger: card,
              start: 'top bottom',
              end: 'top 96px',
              scrub: true
            }
          });
        }
      });
    }
  }

  /* ─────────────────────────────────────────────────
     Process — clickable workflow tabs + code panel
     ───────────────────────────────────────────────── */
  (() => {
    const steps = Array.from(document.querySelectorAll('.workflow-step'));
    const frames = Array.from(document.querySelectorAll('.process-code-frame'));
    const dots = Array.from(document.querySelectorAll('.process-dots i'));
    if (!steps.length) return;

    const setActiveStep = (i, focus) => {
      steps.forEach((s, idx) => {
        s.classList.toggle('is-active', idx === i);
        s.setAttribute('aria-selected', idx === i ? 'true' : 'false');
        s.setAttribute('tabindex', idx === i ? '0' : '-1');
      });
      frames.forEach((f, idx) => {
        f.classList.toggle('is-active', idx === i);
        f.setAttribute('aria-hidden', idx === i ? 'false' : 'true');
        f.inert = idx !== i;
      });
      dots.forEach((d, idx) => d.classList.toggle('is-active', idx === i));
      if (focus) steps[i].focus();
    };

    steps.forEach((step, i) => {
      step.addEventListener('click', () => setActiveStep(i));
      step.addEventListener('keydown', (e) => {
        const move = { ArrowDown: 1, ArrowRight: 1, ArrowUp: -1, ArrowLeft: -1 };
        let next = null;
        if (e.key in move) next = (i + move[e.key] + steps.length) % steps.length;
        else if (e.key === 'Home') next = 0;
        else if (e.key === 'End') next = steps.length - 1;
        if (next !== null) { e.preventDefault(); setActiveStep(next, true); }
      });
    });
  })();

  /* ─────────────────────────────────────────────────
     Section pixel-icon — animated constellation mark
     Shown above a section title. Pauses off-screen and
     respects prefers-reduced-motion.
     ───────────────────────────────────────────────── */
 

    (() => {
      // ════════════════════════════════════════════════════════
      //  Pixel Hex Star — 6-fold + Gaussian Flow Blink
      // ════════════════════════════════════════════════════════

      const canvases = document.querySelectorAll('.pixel-icon');
      if (!canvases.length) return;

      // ── ثوابت ──────────────────────────────────────────────
      const SIZE = 80;
      const CX   = 40;
      const CY   = 40;
      const RGB  = '20, 24, 26';
      const N    = 6;
      const RADIUS = 24;

      const ROT_SPEED  = 1.4;
      const WAVE_SPEED = 2.7;            // سرعة تدفق القمة على الخط

      // عرض القمة Gaussian: كل ما الرقم أعلى، كل ما القمة أحد
      const PEAK_SHARPNESS = 2.5;
      const BASE_OPACITY   = 0.15;       // opacity دائم للنقاط (مفيش لحظة سوداء)
      const PEAK_OPACITY   = 0.80;       // قمة القمة

      const DOT_DISTANCES = [6, 12, 18];
      const DOT_SIZE      = 2;

      // ── إعدادات الإظهار الواضح (دايماً مرئية زي الأصل) ────
      const CENTER_BLINK_SPEED = 2.2;    // سرعة نبض المنتصف
      const VERTEX_CHASE_SPEED = 1.6;    // سرعة chase للـ 6 رؤوس
      const MIN_LIT = 0.45;              // أقل قيمة (دايماً مرئية، مش بتختفي تماماً)
      const MAX_LIT = 1.0;               // أعلى قيمة (full bright)

      // ── 6 رؤوس pointy-top ─────────────────────────────────
      const baseVertices = Array.from({ length: N }, (_, i) => {
        const angle = (i * 2 * Math.PI) / N - Math.PI / 2;
        return { angle, s: 5, a: 0.85 };
      });

      const rgba = (a) => `rgba(${RGB}, ${a.toFixed(3)})`;
      const half = Math.floor(DOT_SIZE / 2);

      // (reduceMotion is inherited from the outer scope)

      canvases.forEach((canvas) => {
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        ctx.imageSmoothingEnabled = false;

        // ── النسخة الثابتة (مرئية بالكامل زي الأصل) ─────────
        const drawStatic = () => {
          ctx.clearRect(0, 0, SIZE, SIZE);

          ctx.fillStyle = rgba(0.95);
          ctx.fillRect(CX - 3, CY - 3, 6, 6);

          baseVertices.forEach((v) => {
            const x = CX + Math.cos(v.angle) * RADIUS;
            const y = CY + Math.sin(v.angle) * RADIUS;

            ctx.fillStyle = rgba(0.45);
            DOT_DISTANCES.forEach((d) => {
              const dx = CX + Math.cos(v.angle) * d;
              const dy = CY + Math.sin(v.angle) * d;
              ctx.fillRect(
                Math.round(dx) - half,
                Math.round(dy) - half,
                DOT_SIZE,
                DOT_SIZE
              );
            });

            ctx.fillStyle = rgba(v.a);
            const vh = Math.floor(v.s / 2);
            ctx.fillRect(Math.round(x) - vh, Math.round(y) - vh, v.s, v.s);
          });
        };

        if (reduceMotion) { drawStatic(); return; }

        // ── النسخة المتحركة ─────────────────────────────────
        let rafId = null;

        const draw = (time) => {
          ctx.clearRect(0, 0, SIZE, SIZE);
          const t = time * 0.001;
          const rotation = t * ROT_SPEED;

          // ════════════════════════════════════════════════════
          // 1) نقطة المنتصف — واضحة ومرئية دايماً مع نبضة قوية
          // ════════════════════════════════════════════════════
          const cWave = (Math.sin(t * CENTER_BLINK_SPEED) + 1) / 2;   // 0 → 1
          const cLit  = MIN_LIT + cWave * (MAX_LIT - MIN_LIT);        // 0.35 → 1.0
          const cSize = 5 + Math.round(cWave * 2);                     // 5 → 7
          const ch    = Math.floor(cSize / 2);
          ctx.fillStyle = rgba(cLit);
          ctx.fillRect(CX - ch, CY - ch, cSize, cSize);

          // ════════════════════════════════════════════════════
          // 2) الخطوط Gaussian + الرؤوس الستة (chase واضح)
          // ════════════════════════════════════════════════════
          baseVertices.forEach((v, i) => {
            const a = v.angle + rotation;
            const x = CX + Math.cos(a) * RADIUS;
            const y = CY + Math.sin(a) * RADIUS;

            // ── Gaussian Flow ─────────────────────────────
            // قمة بتجري على الخط من المركز (0) للرأس (3)
            const peakPos = (t * WAVE_SPEED + i * 0.3) % 3;

            DOT_DISTANCES.forEach((d, dotIdx) => {
              // مسافة القمة من النقطة دي (مع wrap للقمة)
              let dist = Math.abs(peakPos - dotIdx);
              if (dist > 1.5) dist = 3 - dist;

              // Gaussian ناعم: قمة حادة بس smooth falloff
              const peak = Math.exp(-dist * dist * PEAK_SHARPNESS);

              // base + peak: النقطة دايماً مرئية + قمة فوقها
              const opacity = BASE_OPACITY + peak * PEAK_OPACITY;

              const dx = CX + Math.cos(a) * d;
              const dy = CY + Math.sin(a) * d;

              ctx.fillStyle = rgba(opacity);
              ctx.fillRect(
                Math.round(dx) - half,
                Math.round(dy) - half,
                DOT_SIZE,
                DOT_SIZE
              );
            });

            // ── الرأس — واضح ومرئي دايماً مع chase قوي ───
            // كل رأس متأخر بـ 60° = موجة تدور حوالين السداسي
            const vPhase = t * VERTEX_CHASE_SPEED - i * (2 * Math.PI / N);
            const vWave  = (Math.sin(vPhase) + 1) / 2;
            const vLit   = MIN_LIT + vWave * (MAX_LIT - MIN_LIT);        // 0.35 → 1.0
            const vSize  = 4 + Math.round(vWave * 2);                     // 4 → 6
            const vh     = Math.floor(vSize / 2);
            ctx.fillStyle = rgba(vLit);
            ctx.fillRect(Math.round(x) - vh, Math.round(y) - vh, vSize, vSize);
          });

          rafId = requestAnimationFrame(draw);
        };

        // ── تشغيل/إيقاف حسب الظهور ────────────────────────
        const start = () => { if (rafId === null) rafId = requestAnimationFrame(draw); };
        const stop  = () => { if (rafId !== null) { cancelAnimationFrame(rafId); rafId = null; } };

        if ('IntersectionObserver' in window) {
          const io = new IntersectionObserver(
            (entries) => entries.forEach((e) => (e.isIntersecting ? start() : stop())),
            { threshold: 0.1 }
          );
          io.observe(canvas);
        } else {
          start();
        }
      });
    })();

  /* ─────────────────────────────────────────────────
     Contact form — client-side validation + WhatsApp handoff.
     This is a static site with no backend, so a real submit
     isn't possible; instead we validate in the browser then
     open WhatsApp in a new tab with everything pre-filled.
     (Swap this for Formspree/EmailJS/etc. if you add a backend.)
     ───────────────────────────────────────────────── */
  (() => {
    const form = document.getElementById('contact-form');
    if (!form) return;

    const WHATSAPP_NUMBER = '201100340198'; // international format, no leading +
    const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    const fields = {
      name:    { input: document.getElementById('name'),    error: document.getElementById('err-name') },
      email:   { input: document.getElementById('email'),   error: document.getElementById('err-email') },
      subject: { input: document.getElementById('subject'), error: document.getElementById('err-subject') },
      message: { input: document.getElementById('message'), error: document.getElementById('err-message') },
    };
    const submitBtn  = document.getElementById('submit-btn');
    const submitText = document.getElementById('submit-text');
    const feedback   = document.getElementById('form-feedback');

    function setError(key, message) {
      const { input, error } = fields[key];
      input.closest('.field').classList.toggle('invalid', !!message);
      input.setAttribute('aria-invalid', message ? 'true' : 'false');
      error.textContent = message || '';
    }

    function validate() {
      let valid = true;

      if (fields.name.input.value.trim().length < 2) {
        setError('name', 'Please enter your name.');
        valid = false;
      } else setError('name', '');

      if (!EMAIL_RE.test(fields.email.input.value.trim())) {
        setError('email', 'Please enter a valid email address.');
        valid = false;
      } else setError('email', '');

      if (fields.subject.input.value.trim().length < 3) {
        setError('subject', 'Please add a short subject.');
        valid = false;
      } else setError('subject', '');

      if (fields.message.input.value.trim().length < 10) {
        setError('message', 'Please add a few more details (10+ characters).');
        valid = false;
      } else setError('message', '');

      return valid;
    }

    // Re-validate a field live once it has already been flagged invalid
    Object.keys(fields).forEach((key) => {
      fields[key].input.addEventListener('input', () => {
        if (fields[key].input.closest('.field').classList.contains('invalid')) validate();
      });
    });

    function showFeedback(type, message, link) {
      feedback.hidden = false;
      feedback.textContent = message;
      feedback.className = 'form-feedback ' + type;
      if (link) {
        feedback.appendChild(document.createTextNode(' '));
        const a = document.createElement('a');
        a.href = link;
        a.target = '_blank';
        a.rel = 'noopener';
        a.textContent = 'Open WhatsApp';
        feedback.appendChild(a);
      }
    }

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      feedback.hidden = true;

      if (!validate()) {
        showFeedback('error', 'Please fix the highlighted fields and try again.');
        return;
      }

      const oneLine = (v) => v.replace(/\s+/g, ' ').trim();
      const name    = oneLine(fields.name.input.value);
      const email   = oneLine(fields.email.input.value);
      const subject = oneLine(fields.subject.input.value);
      const message = fields.message.input.value.trim();

      submitBtn.disabled = true;
      submitText.textContent = 'Opening WhatsApp…';

      const waText = `*${subject}*\nName: ${name}\nEmail: ${email}\n\n${message}`;
      const waLink = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(waText)}`;

      // No "noopener" feature: it makes window.open() always return null, so a blocked pop-up
      // could not be detected. The opener link is severed manually instead.
      const win = window.open(waLink, '_blank');
      if (win) {
        win.opener = null;
        showFeedback('success', 'WhatsApp is opening in a new tab. Nothing is sent until you press Send there.', waLink);
        form.reset();
      } else {
        // Pop-up blocked: keep what the visitor typed and offer a direct link instead.
        showFeedback('error', 'Your browser blocked the new tab. Your message is still here —', waLink);
      }

      setTimeout(() => {
        submitBtn.disabled = false;
        submitText.textContent = 'Send via WhatsApp';
      }, 2500);
    });
  })();

  /* ─────────────────────────────────────────────────
     Refresh ScrollTrigger once everything has settled
     (fonts + async images can shift layout heights)
     ───────────────────────────────────────────────── */
  if (hasGSAP) {
    window.addEventListener('load', () => ScrollTrigger.refresh());
    setTimeout(() => ScrollTrigger.refresh(), 1200);
  }

})();
