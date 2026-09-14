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
     Split-text utilities (no paid SplitText plugin needed)
     ───────────────────────────────────────────────── */
  function splitChars(root) {
    const chars = [];
    function walk(node) {
      if (node.nodeType === Node.TEXT_NODE) {
        const frag = document.createDocumentFragment();
        for (const ch of node.textContent) {
          if (/\s/.test(ch)) {
            frag.appendChild(document.createTextNode(ch));
          } else {
            const span = document.createElement('span');
            span.className = 'char';
            span.textContent = ch;
            frag.appendChild(span);
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
    document.body.style.overflow = '';
  };
  const openMenu = () => {
    menuBtn.classList.add('active');
    mobileNav.classList.add('open');
    menuBtn.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  };
  if (menuBtn) {
    menuBtn.addEventListener('click', () => {
      if (mobileNav.classList.contains('open')) closeMenu();
      else openMenu();
    });
    mobileLinks.forEach((l) => l.addEventListener('click', closeMenu));
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && mobileNav.classList.contains('open')) closeMenu();
    });
  }

  /* ─────────────────────────────────────────────────
     HERO — letter-by-letter cinematic entrance
     ───────────────────────────────────────────────── */
  const heroTitle = document.querySelector('.hero-title-v2');
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
  counters.forEach((c) => counterObserver.observe(c));

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

      if (countText) {
        if (isAll) {
          countText.innerHTML = 'Showing <strong>' + originalCards.length + '</strong> of <strong>49+</strong> projects · <a href="https://github.com/abdelwahab-adel/" target="_blank" rel="noopener" style="color: var(--text-hi); font-weight: 500;">View all on GitHub →</a>';
        } else {
          const activeChip = filterBar.querySelector('[data-filter="' + filter + '"]');
          const label = activeChip ? activeChip.textContent.trim() : filter;
          countText.innerHTML = 'Showing <strong>' + visible + '</strong> ' + label + ' project' + (visible === 1 ? '' : 's') + ' · <a href="https://github.com/abdelwahab-adel/" target="_blank" rel="noopener" style="color: var(--text-hi); font-weight: 500;">View all on GitHub →</a>';
        }
      }

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
        applyFilter(chip.dataset.filter);
      });
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

      pmActions.innerHTML = '';
      Array.from(card.querySelectorAll('.project-links a')).forEach((link, i) => {
        const label = link.textContent.trim();
        const isGithub = /github\.com/.test(link.href) && /profile/i.test(label);
        const a = document.createElement('a');
        a.href = link.href;
        a.target = '_blank';
        a.rel = 'noopener';
        a.className = 'pm-btn ' + (i === 0 ? 'pm-btn-primary' : 'pm-btn-ghost');
        a.innerHTML = (isGithub ? GITHUB_ICON : EXTERNAL_ICON) + '<span>' + (isGithub ? 'View Code' : label) + '</span>';
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
      closeBtn.focus();
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

    cards.forEach((card) => {
      card.setAttribute('tabindex', '0');
      card.setAttribute('role', 'button');
      card.setAttribute('aria-haspopup', 'dialog');

      card.addEventListener('click', (e) => {
        if (e.target.closest('.project-links')) return; // let the card's own links work normally
        openModal(card);
      });
      card.addEventListener('keydown', (e) => {
        if ((e.key === 'Enter' || e.key === ' ') && !e.target.closest('.project-links')) {
          e.preventDefault();
          openModal(card);
        }
      });
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
      if (id.length > 1) {
        const target = document.querySelector(id);
        if (target) {
          e.preventDefault();
          const top = target.getBoundingClientRect().top + window.scrollY - 80;
          window.scrollTo({ top, behavior: 'smooth' });
        }
      }
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

    const setActiveStep = (i) => {
      steps.forEach((s, idx) => {
        s.classList.toggle('is-active', idx === i);
        s.setAttribute('aria-selected', idx === i ? 'true' : 'false');
      });
      frames.forEach((f, idx) => f.classList.toggle('is-active', idx === i));
      dots.forEach((d, idx) => d.classList.toggle('is-active', idx === i));
    };

    steps.forEach((step, i) => {
      step.addEventListener('click', () => setActiveStep(i));
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

      const reduceMotion =
        window.matchMedia('(prefers-reduced-motion: reduce)').matches;

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

    function showFeedback(type, message) {
      feedback.hidden = false;
      feedback.textContent = message;
      feedback.className = 'form-feedback ' + type;
    }

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      feedback.hidden = true;

      if (!validate()) {
        showFeedback('error', 'Please fix the highlighted fields and try again.');
        return;
      }

      const name    = fields.name.input.value.trim();
      const email   = fields.email.input.value.trim();
      const subject = fields.subject.input.value.trim();
      const message = fields.message.input.value.trim();

      submitBtn.disabled = true;
      submitText.textContent = 'Opening WhatsApp…';

      const waText = `*${subject}*\nName: ${name}\nEmail: ${email}\n\n${message}`;
      const waLink = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(waText)}`;

      window.open(waLink, '_blank', 'noopener');

      showFeedback('success', `WhatsApp should be opening now in a new tab — if it didn't, message us directly at wa.me/${WHATSAPP_NUMBER}.`);
      form.reset();

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
