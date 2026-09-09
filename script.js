/* ═══════════════════════════════════════════════════════
   ABDELWAHAB ADEL — Premium Light Portfolio · JS
   GSAP + ScrollTrigger cinematic scroll system
   ═══════════════════════════════════════════════════════ */

(() => {
  'use strict';

  const hasHover = window.matchMedia('(hover: hover)').matches;
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const hasGSAP = !!(window.gsap && window.ScrollTrigger);
  const isDesktop = window.innerWidth >= 900;

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
        duration: 1,
        ease: 'back.out(1.6)',
        stagger: 0.018,
        delay: 0.15
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
            duration: 0.9,
            ease: 'power4.out',
            stagger: 0.035
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
      gsap.set(revealEls, { opacity: 0, y: 32, scale: 0.97, filter: 'blur(6px)' });
      ScrollTrigger.batch(revealEls, {
        start: 'top 88%',
        onEnter: (batch) => {
          gsap.to(batch, {
            opacity: 1,
            y: 0,
            scale: 1,
            filter: 'blur(0px)',
            duration: 1,
            ease: 'power3.out',
            stagger: 0.09,
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
    const duration = 1600;
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
    const phrases = ['scalable web apps.', 'clean Laravel APIs.', 'modern React interfaces.', 'full-stack platforms.'];

    if (reduceMotion) {
      el.textContent = phrases[0];
      return;
    }

    let phraseIndex = 0;
    let charIndex = 0;
    let deleting = false;
    const typeSpeed = 55;
    const deleteSpeed = 28;
    const holdTime = 1800;

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
      const lastCard = stackCards[stackCards.length - 1];
      stackCards.forEach((card, i) => {
        const isLast = i === stackCards.length - 1;
        if (!isLast) {
          ScrollTrigger.create({
            trigger: card,
            start: 'top 96px',
            endTrigger: lastCard,
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
    const filenameEl = document.getElementById('process-filename');
    if (!steps.length) return;

    const filenames = [
      'DISCOVERY/BRIEF.MD',
      'PLANNING/ROADMAP.MD',
      'DESIGN/SYSTEM.MD',
      'SPRINTS/SPRINT-01.MD',
      'QA/REPORT.MD',
      'LAUNCH/CHECKLIST.MD'
    ];

    const setActiveStep = (i) => {
      steps.forEach((s, idx) => {
        s.classList.toggle('is-active', idx === i);
        s.setAttribute('aria-selected', idx === i ? 'true' : 'false');
      });
      frames.forEach((f, idx) => f.classList.toggle('is-active', idx === i));
      dots.forEach((d, idx) => d.classList.toggle('is-active', idx === i));
      if (filenameEl && filenames[i]) filenameEl.textContent = filenames[i];
    };

    steps.forEach((step, i) => {
      step.addEventListener('click', () => setActiveStep(i));
    });
  })();

  /* ─────────────────────────────────────────────────
     Mega wordmark — outline-to-solid scroll scrub
     ───────────────────────────────────────────────── */
  if (hasGSAP && !reduceMotion) {
    gsap.utils.toArray('.mega-wordmark').forEach((el) => {
      const solid = el.querySelector('.mega-solid');
      if (!solid) return;
      const isSecond = el.classList.contains('mega-wordmark-2');
      gsap.fromTo(
        solid,
        { clipPath: isSecond ? 'inset(0 0 0 100%)' : 'inset(0 100% 0 0)' },
        {
          clipPath: isSecond ? 'inset(0 0 0 0%)' : 'inset(0 0% 0 0)',
          ease: 'none',
          scrollTrigger: {
            trigger: '.mega-close',
            start: 'top 85%',
            end: 'bottom 45%',
            scrub: true
          }
        }
      );
    });
  }

  /* ─────────────────────────────────────────────────
     Refresh ScrollTrigger once everything has settled
     (fonts + async images can shift layout heights)
     ───────────────────────────────────────────────── */
  if (hasGSAP) {
    window.addEventListener('load', () => ScrollTrigger.refresh());
    setTimeout(() => ScrollTrigger.refresh(), 1200);
  }

})();
