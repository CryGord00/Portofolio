(function (global) {
  'use strict';

  const Portfolio = (global.Portfolio = global.Portfolio || {});

  /**
   * Mengelola tirai loading kinetik awal serta memicu pembukaan lanyard setelah selesai.
   */
  class PageLoaderController {
    constructor(options) {
      this.loaderEl = document.getElementById(options.loaderId || 'pageLoader');
      this.barFillEl = document.getElementById(options.barFillId || 'loaderBarFill');
      this.percentEl = document.getElementById(options.percentId || 'loaderPercent');
      this.words = this.loaderEl ? Array.from(this.loaderEl.querySelectorAll('[data-loader-word]')) : [];
      this.reducedMotion = Boolean(options.reducedMotion);
      this.onCurtainOpening = options.onCurtainOpening || null;

      this.minMs = options.minMs || 950;
      this.maxMs = options.maxMs || 1500;
      this.assetsReady = document.readyState === 'complete';
      this.progress = 8;
      this.dismissed = false;
      this.activeStage = -1;
      this.startTime = 0;
    }

    setStage(stage) {
      if (stage === this.activeStage) return;
      this.activeStage = stage;
      if (!this.words.length) return;

      if (stage === 0) {
        this.words[0].classList.add('is-in');
      }
    }

    dismiss() {
      if (this.dismissed || !this.loaderEl) return;
      this.dismissed = true;
      this.setStage(0);
      if (this.barFillEl) this.barFillEl.style.width = '100%';
      if (this.percentEl) this.percentEl.textContent = '100%';

      setTimeout(() => {
        document.documentElement.classList.remove('is-preloading');
        this.loaderEl.classList.add('is-leaving');
        this.loaderEl.setAttribute('aria-hidden', 'true');

        if (typeof this.onCurtainOpening === 'function') {
          setTimeout(this.onCurtainOpening, 160);
        }

        setTimeout(() => {
          this.loaderEl.classList.add('is-done');
        }, 540);
      }, 140);
    }

    tick(now) {
      if (this.dismissed) return;
      const elapsed = now - this.startTime;

      if (elapsed >= 30) {
        this.setStage(0);
      }

      const canFinish = (this.assetsReady && elapsed >= this.minMs) || elapsed >= this.maxMs;

      if (canFinish) {
        this.progress += (100 - this.progress) * 0.45;
        if (this.progress >= 98.5) {
          this.dismiss();
          return;
        }
      } else {
        const cap = this.assetsReady ? 94 : 86;
        const timeTarget = Math.min(cap, 8 + (elapsed / this.minMs) * 86);
        this.progress += (timeTarget - this.progress) * 0.24;
      }

      const shownPct = Math.min(100, Math.round(this.progress));
      if (this.barFillEl) this.barFillEl.style.width = shownPct + '%';
      if (this.percentEl) {
        this.percentEl.textContent = (shownPct < 10 ? '0' : '') + shownPct + '%';
      }
      requestAnimationFrame((ts) => this.tick(ts));
    }

    init() {
      if (!this.loaderEl) return;

      if (this.reducedMotion) {
        document.documentElement.classList.remove('is-preloading');
        this.loaderEl.classList.add('is-done');
        this.loaderEl.setAttribute('aria-hidden', 'true');
        return;
      }

      this.startTime = performance.now();

      if (!this.assetsReady) {
        window.addEventListener(
          'load',
          () => {
            this.assetsReady = true;
          },
          { once: true }
        );
      }

      if (document.fonts && document.fonts.ready) {
        document.fonts.ready.then(() => {
          if (document.readyState !== 'loading') {
            this.assetsReady = true;
          }
        });
      }

      requestAnimationFrame((ts) => this.tick(ts));
    }
  }

  Portfolio.PageLoaderController = PageLoaderController;
})(window);
