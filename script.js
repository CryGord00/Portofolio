(function (global) {
  'use strict';

  const Portfolio = (global.Portfolio = global.Portfolio || {});

  /**
   * Titik masuk utama aplikasi portofolio berbasis OOP yang merangkai seluruh modul UI.
   */
  class PortfolioApp {
    constructor() {
      this.reducedMotion =
        Boolean(window.matchMedia) && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      this.theme = new Portfolio.ThemeController({
        buttonId: 'themeToggleBtn',
        labelId: 'themeToggleLabel',
        storageKey: 'portfolio-theme'
      });

      this.reveal = new Portfolio.ScrollRevealManager({
        selector: '.reveal-block',
        reducedMotion: this.reducedMotion
      });

      this.projectFilter = new Portfolio.ProjectFilterController({
        buttonSelector: '.filter-btn',
        itemSelector: '[data-project-item]',
        statusId: 'projectFilterStatus',
        emptyStateId: 'projectEmptyState',
        resetButtonId: 'resetFilterBtn',
        onAfterFilter: () => this.reveal.syncInViewport()
      });

      this.navigation = new Portfolio.NavigationController({
        revealManager: this.reveal
      });

      this.lanyard = new Portfolio.LanyardController({
        heroId: 'tentang',
        stageId: 'lanyardStage',
        rigId: 'lanyardRig',
        pendantId: 'lanyardPendant',
        cardId: 'lanyardCard',
        reducedMotion: this.reducedMotion
      });

      this.loader = new Portfolio.PageLoaderController({
        loaderId: 'pageLoader',
        barFillId: 'loaderBarFill',
        percentId: 'loaderPercent',
        reducedMotion: this.reducedMotion,
        onCurtainOpening: () => this.lanyard.triggerDrop()
      });

      this.cvNotice = new Portfolio.CvNoticeController({
        buttonId: 'cvStatusBtn',
        noticeId: 'cvStatusNotice'
      });

      this.certModal = new Portfolio.CertificateModalController({
        modalId: 'certModal',
        metaId: 'certModalMeta',
        titleId: 'certModalTitle',
        stageId: 'certModalStage',
        descId: 'certModalDesc',
        closeBtnId: 'certModalClose',
        triggerSelector: '.achievement-thumb'
      });

      this.modules = [
        this.theme,
        this.projectFilter,
        this.reveal,
        this.navigation,
        this.lanyard,
        this.loader,
        this.cvNotice,
        this.certModal
      ];
    }

    init() {
      this.modules.forEach((mod) => {
        if (mod && typeof mod.init === 'function') {
          mod.init();
        }
      });
    }
  }

  Portfolio.PortfolioApp = PortfolioApp;

  const app = new PortfolioApp();
  app.init();
  Portfolio.app = app;
})(window);
