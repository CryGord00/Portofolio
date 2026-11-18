(function (global) {
  'use strict';

  const Portfolio = (global.Portfolio = global.Portfolio || {});

  /**
   * Mengatur kemunculan blok saat menggulir (scroll reveal dua arah) dan transisi tiba ke section.
   */
  class ScrollRevealManager {
    constructor(options) {
      this.root = document.documentElement;
      this.blocks = Array.from(document.querySelectorAll(options.selector || '.reveal-block'));
      this.reducedMotion = Boolean(options.reducedMotion);
      this.observer = null;
      this.armed = this.reducedMotion;
      this.arriveTimer = null;
      this.pendingSectionEnterId = null;
    }

    syncInViewport() {
      if (!this.blocks.length) return;

      if (this.reducedMotion) {
        this.blocks.forEach((block) => {
          block.classList.add('is-visible');
          block.classList.remove('reveal-from-top');
        });
        return;
      }

      if (!this.armed) return;

      const vh = window.innerHeight || document.documentElement.clientHeight || 800;
      const enterPad = Math.min(36, Math.round(vh * 0.04));

      this.blocks.forEach((block) => {
        if (block.offsetParent === null) {
          block.classList.remove('is-visible', 'reveal-from-top');
          return;
        }

        const rect = block.getBoundingClientRect();
        const inEnterZone = rect.bottom > enterPad && rect.top < vh - enterPad;
        const isOffscreen = rect.bottom <= -12 || rect.top >= vh + 12;

        if (inEnterZone) {
          block.classList.add('is-visible');
        } else if (isOffscreen) {
          block.classList.remove('is-visible');
          block.classList.toggle('reveal-from-top', rect.bottom <= -12);
        }
      });
    }

    playSectionTransition(targetSection) {
      clearTimeout(this.arriveTimer);
      document.querySelectorAll('.is-section-entering').forEach((el) => {
        el.classList.remove('is-section-entering');
      });

      void targetSection.offsetWidth;
      targetSection.classList.add('is-section-entering');

      const cleanup = () => {
        targetSection.classList.remove('is-section-entering');
        clearTimeout(this.arriveTimer);
      };

      targetSection.addEventListener('animationend', cleanup, { once: true });
      this.arriveTimer = setTimeout(cleanup, 1400);
    }

    flushPendingTransition(cancelIfNotInView) {
      if (!this.pendingSectionEnterId) return;
      const targetSection = document.getElementById(this.pendingSectionEnterId);
      if (!targetSection) {
        this.pendingSectionEnterId = null;
        return;
      }

      const rect = targetSection.getBoundingClientRect();
      const inArrivalZone =
        rect.top < window.innerHeight * 0.78 &&
        rect.bottom > Math.min(180, window.innerHeight * 0.25);

      if (!inArrivalZone) {
        if (cancelIfNotInView) {
          this.pendingSectionEnterId = null;
        }
        return;
      }

      const sectionBlocks = Array.from(targetSection.querySelectorAll('.reveal-block'));
      const hasUnrevealed = sectionBlocks.some(
        (block) => block.offsetParent !== null && !block.classList.contains('is-visible')
      );

      this.pendingSectionEnterId = null;
      if (!hasUnrevealed) {
        this.playSectionTransition(targetSection);
      }
    }

    triggerSectionTransition(targetId, topSectionId) {
      this.pendingSectionEnterId = null;
      if (this.reducedMotion) return;

      const targetSection = document.getElementById(targetId);
      if (!targetSection) return;

      const targetY = targetId === topSectionId ? 0 : Math.max(0, targetSection.offsetTop - 92);
      if (Math.abs(window.scrollY - targetY) < 80) return;

      const sectionBlocks = Array.from(targetSection.querySelectorAll('.reveal-block'));
      const hasUnrevealed = sectionBlocks.some(
        (block) => block.offsetParent !== null && !block.classList.contains('is-visible')
      );

      if (hasUnrevealed) return;

      this.pendingSectionEnterId = targetId;
      this.flushPendingTransition(false);
    }

    clearPendingTransition() {
      this.pendingSectionEnterId = null;
    }

    init() {
      if (!this.blocks.length) return;

      if (this.reducedMotion) {
        this.syncInViewport();
        return;
      }

      if ('IntersectionObserver' in window) {
        this.observer = new IntersectionObserver(
          () => this.syncInViewport(),
          { threshold: [0, 0.05] }
        );
        this.blocks.forEach((block) => this.observer.observe(block));
      }

      this.root.classList.add('reveal-ready');
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          this.armed = true;
          this.syncInViewport();
        });
      });

      window.addEventListener('resize', () => this.syncInViewport());
    }
  }

  Portfolio.ScrollRevealManager = ScrollRevealManager;
})(window);
