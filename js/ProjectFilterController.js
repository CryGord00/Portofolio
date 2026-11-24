(function (global) {
  'use strict';

  const Portfolio = (global.Portfolio = global.Portfolio || {});

  /**
   * Mengelola filter kategori project beserta status jumlah item dan empty state.
   */
  class ProjectFilterController {
    constructor(options) {
      this.buttons = Array.from(document.querySelectorAll(options.buttonSelector || '.filter-btn'));
      this.items = Array.from(document.querySelectorAll(options.itemSelector || '[data-project-item]'));
      this.statusEl = document.getElementById(options.statusId);
      this.emptyStateEl = document.getElementById(options.emptyStateId);
      this.resetButton = document.getElementById(options.resetButtonId);
      this.onAfterFilter = options.onAfterFilter || null;
      this.currentCategory = 'all';
      this.lang = options.lang || 'id';
    }

    formatStatus(visibleCount, totalCount) {
      if (this.lang === 'en') {
        return 'Showing ' + visibleCount + ' of ' + totalCount + ' projects';
      }
      return 'Menampilkan ' + visibleCount + ' dari ' + totalCount + ' project';
    }

    setLanguage(lang) {
      this.lang = lang === 'en' ? 'en' : 'id';
      const visibleCount = this.items.filter((item) => !item.classList.contains('hidden')).length;
      if (this.statusEl) {
        this.statusEl.textContent = this.formatStatus(visibleCount, this.items.length);
      }
    }

    apply(category) {
      this.currentCategory = category;
      let visibleCount = 0;

      this.buttons.forEach((btn) => {
        const active = btn.getAttribute('data-filter') === category;
        btn.classList.toggle('active', active);
        btn.setAttribute('aria-pressed', active ? 'true' : 'false');
      });

      this.items.forEach((item) => {
        const matches = category === 'all' || item.getAttribute('data-category') === category;
        const wasHidden = item.classList.contains('hidden');
        item.classList.toggle('hidden', !matches);
        if (matches) {
          visibleCount += 1;
          if (wasHidden) {
            item.classList.remove('is-visible', 'reveal-from-top');
          }
        }
      });

      if (this.statusEl) {
        this.statusEl.textContent = this.formatStatus(visibleCount, this.items.length);
      }

      if (this.emptyStateEl) {
        this.emptyStateEl.hidden = visibleCount > 0;
      }

      if (typeof this.onAfterFilter === 'function') {
        requestAnimationFrame(this.onAfterFilter);
      }
    }

    init() {
      this.buttons.forEach((btn) => {
        btn.addEventListener('click', () => {
          this.apply(btn.getAttribute('data-filter'));
        });
      });

      if (this.resetButton) {
        this.resetButton.addEventListener('click', () => this.apply('all'));
      }
    }
  }

  Portfolio.ProjectFilterController = ProjectFilterController;
})(window);
