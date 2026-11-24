(function (global) {
  'use strict';

  const Portfolio = (global.Portfolio = global.Portfolio || {});

  function isKeyboardFocus(el) {
    try {
      return el.matches(':focus-visible');
    } catch (err) {
      return true;
    }
  }

  /**
   * Indikator kapsul bergeser di dalam daftar tautan navigasi (gaya Liquid Glass).
   */
  class SlidingIndicator {
    constructor(listEl, indicatorSelector, itemSelector) {
      this.listEl = listEl;
      this.indicatorEl = listEl ? listEl.querySelector(indicatorSelector) : null;
      this.links = listEl ? Array.from(listEl.querySelectorAll(itemSelector)) : [];
      this.hasPositioned = false;
    }

    isReady() {
      return Boolean(this.listEl && this.indicatorEl && this.links.length);
    }

    moveTo(targetLink) {
      if (!this.isReady() || !targetLink || this.listEl.offsetParent === null) return;
      this.indicatorEl.style.transform =
        'translate3d(' + targetLink.offsetLeft + 'px, ' + targetLink.offsetTop + 'px, 0)';
      this.indicatorEl.style.width = targetLink.offsetWidth + 'px';
      this.indicatorEl.style.height = targetLink.offsetHeight + 'px';
      this.indicatorEl.style.opacity = '1';

      if (!this.hasPositioned) {
        this.hasPositioned = true;
        requestAnimationFrame(() => {
          this.indicatorEl.classList.add('is-ready');
        });
      }
    }

    syncActive() {
      if (!this.isReady()) return;
      const current = this.listEl.querySelector('a.is-active') || this.links[0];
      this.moveTo(current);
    }

    init() {
      if (!this.isReady()) return false;
      this.listEl.classList.add('has-indicator');

      this.links.forEach((link) => {
        link.addEventListener('mouseenter', () => {
          this.listEl.classList.add('is-hovering');
          this.moveTo(link);
        });

        link.addEventListener('pointerdown', () => {
          this.listEl.classList.add('is-pressing');
        });

        link.addEventListener('pointerup', () => {
          this.listEl.classList.remove('is-pressing');
        });

        link.addEventListener('pointercancel', () => {
          this.listEl.classList.remove('is-pressing');
        });

        link.addEventListener('focusin', () => {
          if (isKeyboardFocus(link)) {
            this.moveTo(link);
          }
        });
      });

      this.listEl.addEventListener('mouseleave', () => {
        this.listEl.classList.remove('is-hovering', 'is-pressing');
        this.syncActive();
      });

      this.listEl.addEventListener('focusout', (e) => {
        if (!this.listEl.contains(e.relatedTarget) && !this.listEl.classList.contains('is-hovering')) {
          this.syncActive();
        }
      });

      if ('ResizeObserver' in window) {
        new ResizeObserver(() => {
          if (!this.listEl.classList.contains('is-hovering')) {
            this.syncActive();
          }
        }).observe(this.listEl);
      }

      window.addEventListener('resize', () => this.syncActive());
      return true;
    }
  }

  /**
   * Mengelola drawer navigasi mobile (buka/tutup, Escape, dan reset saat resize desktop).
   */
  class MobileDrawerController {
    constructor(options) {
      this.menuBtn = document.getElementById(options.menuBtnId);
      this.drawer = document.getElementById(options.drawerId);
      this.onOpen = options.onOpen || null;
      this.lang = options.lang || 'id';
    }

    setLanguage(lang) {
      this.lang = lang === 'en' ? 'en' : 'id';
      if (!this.menuBtn || !this.drawer) return;
      const isOpen = this.drawer.classList.contains('is-open');
      this.menuBtn.textContent = isOpen ? (this.lang === 'en' ? 'Close' : 'Tutup') : 'Menu';
    }

    setOpen(open) {
      if (!this.menuBtn || !this.drawer) return;
      this.drawer.classList.toggle('is-open', open);
      this.drawer.setAttribute('aria-hidden', open ? 'false' : 'true');
      this.menuBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
      this.menuBtn.textContent = open ? (this.lang === 'en' ? 'Close' : 'Tutup') : 'Menu';
      if (open && typeof this.onOpen === 'function') {
        requestAnimationFrame(this.onOpen);
      }
    }

    init() {
      if (!this.menuBtn || !this.drawer) return;

      this.menuBtn.addEventListener('click', () => {
        this.setOpen(!this.drawer.classList.contains('is-open'));
      });

      this.drawer.querySelectorAll('a').forEach((link) => {
        link.addEventListener('click', () => this.setOpen(false));
      });

      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && this.drawer.classList.contains('is-open')) {
          this.setOpen(false);
          this.menuBtn.focus();
        }
      });

      window.addEventListener('resize', () => {
        if (window.innerWidth >= 640 && this.drawer.classList.contains('is-open')) {
          this.setOpen(false);
        }
      });
    }
  }

  /**
   * Mengkoordinasikan scroll-spy, status scroll header, indikator navbar desktop & mobile, serta drawer.
   */
  class NavigationController {
    constructor(options) {
      this.revealManager = options.revealManager || null;
      this.siteHeader = document.querySelector('.site-header');
      this.desktopNavList = document.querySelector('.nav-links');
      this.mobileNavList = document.querySelector('.mobile-nav-links');
      this.desktopNavLinks = Array.from(document.querySelectorAll('.nav-links a[href^="#"]'));
      this.mobileNavLinks = Array.from(document.querySelectorAll('.mobile-nav-links a[href^="#"]'));
      this.observedSections = this.desktopNavLinks
        .map((link) => document.querySelector(link.getAttribute('href')))
        .filter(Boolean);
      this.observedSectionIds = this.observedSections.map((sec) => sec.id);

      this.desktopGlide = new SlidingIndicator(this.desktopNavList, '.nav-indicator', 'a[href^="#"]');
      this.mobileGlide = new SlidingIndicator(this.mobileNavList, '.mobile-nav-indicator', 'a[href^="#"]');
      this.drawer = new MobileDrawerController({
        menuBtnId: 'mobileMenuBtn',
        drawerId: 'mobileNavDrawer',
        onOpen: () => this.mobileGlide.syncActive()
      });

      this.lastActiveId = null;
      this.scrollSpyLockId = null;
      this.scrollLockIdleTimer = null;
      this.scrollLockMaxTimer = null;
      this.scrollRafPending = false;
    }

    static syncLinkList(links, activeId) {
      links.forEach((link) => {
        const isActive = link.getAttribute('href') === '#' + activeId;
        link.classList.toggle('is-active', isActive);
        if (isActive) {
          link.setAttribute('aria-current', 'location');
        } else {
          link.removeAttribute('aria-current');
        }
      });
    }

    setLanguage(lang) {
      if (this.drawer) {
        this.drawer.setLanguage(lang);
      }
      requestAnimationFrame(() => {
        if (!this.desktopNavList || !this.desktopNavList.classList.contains('is-hovering')) {
          this.desktopGlide.syncActive();
        }
        if (!this.mobileNavList || !this.mobileNavList.classList.contains('is-hovering')) {
          this.mobileGlide.syncActive();
        }
      });
    }

    applyActiveSection(activeId) {
      if (!activeId || activeId === this.lastActiveId) return;
      this.lastActiveId = activeId;
      NavigationController.syncLinkList(this.desktopNavLinks, activeId);
      NavigationController.syncLinkList(this.mobileNavLinks, activeId);

      if (!this.desktopNavList || !this.desktopNavList.classList.contains('is-hovering')) {
        this.desktopGlide.syncActive();
      }
      if (!this.mobileNavList || !this.mobileNavList.classList.contains('is-hovering')) {
        this.mobileGlide.syncActive();
      }
    }

    getActiveSectionId() {
      if (!this.observedSections.length) return null;

      const doc = document.documentElement;
      const maxScroll = Math.max(0, doc.scrollHeight - window.innerHeight);

      if (window.scrollY <= 24) {
        return this.observedSections[0].id;
      }

      if (maxScroll > 0 && window.scrollY >= maxScroll - 28) {
        return this.observedSections[this.observedSections.length - 1].id;
      }

      const probeOffset = Math.min(260, Math.max(130, Math.round(window.innerHeight * 0.28)));
      const scrollPos = window.scrollY + probeOffset;
      let activeId = this.observedSections[0].id;

      this.observedSections.forEach((sec) => {
        if (scrollPos >= sec.offsetTop) {
          activeId = sec.id;
        }
      });

      return activeId;
    }

    clearScrollSpyLock(syncFromScroll) {
      this.scrollSpyLockId = null;
      clearTimeout(this.scrollLockIdleTimer);
      clearTimeout(this.scrollLockMaxTimer);
      this.scrollLockIdleTimer = null;
      this.scrollLockMaxTimer = null;

      if (syncFromScroll) {
        this.applyActiveSection(this.getActiveSectionId());
        if (this.revealManager) {
          this.revealManager.syncInViewport();
          this.revealManager.flushPendingTransition(true);
        }
      } else if (this.revealManager) {
        this.revealManager.clearPendingTransition();
      }
    }

    armScrollLockIdleRelease() {
      clearTimeout(this.scrollLockIdleTimer);
      this.scrollLockIdleTimer = setTimeout(() => {
        this.clearScrollSpyLock(true);
      }, 140);
    }

    lockActiveSectionOnClick(targetId) {
      if (this.desktopNavList) this.desktopNavList.classList.remove('is-hovering', 'is-pressing');
      if (this.mobileNavList) this.mobileNavList.classList.remove('is-hovering', 'is-pressing');

      clearTimeout(this.scrollLockIdleTimer);
      clearTimeout(this.scrollLockMaxTimer);
      this.scrollSpyLockId = targetId;
      this.applyActiveSection(targetId);

      this.desktopGlide.syncActive();
      this.mobileGlide.syncActive();
      if (this.revealManager) {
        this.revealManager.triggerSectionTransition(targetId, this.observedSectionIds[0]);
      }

      this.scrollLockIdleTimer = setTimeout(() => {
        this.clearScrollSpyLock(true);
      }, 240);

      this.scrollLockMaxTimer = setTimeout(() => {
        this.clearScrollSpyLock(true);
      }, 2200);
    }

    updateScrollState() {
      if (this.siteHeader) {
        this.siteHeader.classList.toggle('is-scrolled', window.scrollY > 24);
      }

      if (this.revealManager) {
        this.revealManager.syncInViewport();
        this.revealManager.flushPendingTransition(false);
      }

      if (this.scrollSpyLockId !== null) {
        this.armScrollLockIdleRelease();
        return;
      }

      this.applyActiveSection(this.getActiveSectionId());
    }

    scheduleScrollUpdate() {
      if (this.scrollRafPending) return;
      this.scrollRafPending = true;
      requestAnimationFrame(() => {
        this.scrollRafPending = false;
        this.updateScrollState();
      });
    }

    bindAnchorEvents() {
      document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
        anchor.addEventListener('click', () => {
          const href = anchor.getAttribute('href');
          if (!href || href.length < 2) return;
          const rawId = href.slice(1);
          const targetId =
            rawId === 'top' && this.observedSectionIds.length ? this.observedSectionIds[0] : rawId;
          if (this.observedSectionIds.indexOf(targetId) !== -1) {
            this.lockActiveSectionOnClick(targetId);
          }
        });
      });

      ['wheel', 'touchstart'].forEach((evtName) => {
        window.addEventListener(
          evtName,
          () => {
            if (this.scrollSpyLockId !== null) {
              this.clearScrollSpyLock(true);
            }
          },
          { passive: true }
        );
      });

      window.addEventListener('keydown', (e) => {
        if (
          this.scrollSpyLockId !== null &&
          (e.key === 'ArrowUp' ||
            e.key === 'ArrowDown' ||
            e.key === 'PageUp' ||
            e.key === 'PageDown' ||
            e.key === 'Home' ||
            e.key === 'End' ||
            e.key === ' ')
        ) {
          this.clearScrollSpyLock(true);
        }
      });
    }

    init() {
      this.drawer.init();
      const hasDesktopGlide = this.desktopGlide.init();
      this.mobileGlide.init();
      this.bindAnchorEvents();
      this.updateScrollState();

      if (hasDesktopGlide) {
        requestAnimationFrame(() => this.desktopGlide.syncActive());
        if (document.fonts && document.fonts.ready) {
          document.fonts.ready.then(() => this.desktopGlide.syncActive());
        }
      }

      window.addEventListener('scroll', () => this.scheduleScrollUpdate(), { passive: true });
    }
  }

  Portfolio.SlidingIndicator = SlidingIndicator;
  Portfolio.MobileDrawerController = MobileDrawerController;
  Portfolio.NavigationController = NavigationController;
})(window);
