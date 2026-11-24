(function (global) {
  'use strict';

  const Portfolio = (global.Portfolio = global.Portfolio || {});

  /**
   * Mengelola tema warna Terang/Gelap beserta penyimpanannya di localStorage.
   */
  class ThemeController {
    constructor(options) {
      this.button = document.getElementById(options.buttonId);
      this.label = document.getElementById(options.labelId);
      this.storageKey = options.storageKey || 'portfolio-theme';
      this.root = document.documentElement;
      this.lang = options.lang || 'id';
    }

    getInitialTheme() {
      let saved = null;
      try {
        saved = localStorage.getItem(this.storageKey);
      } catch (err) {
        saved = null;
      }
      const prefersDark =
        Boolean(window.matchMedia) && window.matchMedia('(prefers-color-scheme: dark)').matches;
      return saved || (prefersDark ? 'dark' : 'light');
    }

    setLanguage(lang) {
      this.lang = lang === 'en' ? 'en' : 'id';
      const isDark = this.root.getAttribute('data-theme') === 'dark';
      this.apply(isDark ? 'dark' : 'light');
    }

    apply(theme) {
      const isDark = theme === 'dark';
      if (isDark) {
        this.root.setAttribute('data-theme', 'dark');
      } else {
        this.root.removeAttribute('data-theme');
      }
      if (this.label) {
        if (this.lang === 'en') {
          this.label.textContent = isDark ? 'Dark' : 'Light';
        } else {
          this.label.textContent = isDark ? 'Gelap' : 'Terang';
        }
      }
      if (this.button) {
        this.button.setAttribute('aria-pressed', isDark ? 'true' : 'false');
        this.button.setAttribute(
          'aria-label',
          this.lang === 'en' ? 'Toggle color theme' : 'Ubah mode warna tampilan'
        );
      }
    }

    toggle() {
      const isDark = this.root.getAttribute('data-theme') === 'dark';
      const nextTheme = isDark ? 'light' : 'dark';
      this.apply(nextTheme);
      try {
        localStorage.setItem(this.storageKey, nextTheme);
      } catch (err) {
        // Abaikan jika penyimpanan browser dibatasi
      }
    }

    init() {
      this.apply(this.getInitialTheme());
      if (this.button) {
        this.button.addEventListener('click', () => this.toggle());
      }
    }
  }

  Portfolio.ThemeController = ThemeController;
})(window);
