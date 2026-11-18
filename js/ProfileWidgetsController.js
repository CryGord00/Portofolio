(function (global) {
  'use strict';

  const Portfolio = (global.Portfolio = global.Portfolio || {});

  /**
   * Mengelola toggle informasi status berkas CV pada slot khusus.
   */
  class CvNoticeController {
    constructor(options) {
      this.button = document.getElementById(options.buttonId || 'cvStatusBtn');
      this.notice = document.getElementById(options.noticeId || 'cvStatusNotice');
    }

    init() {
      if (!this.button || !this.notice) return;
      this.button.addEventListener('click', () => {
        const nextExpanded = this.notice.hidden;
        this.notice.hidden = !nextExpanded;
        this.button.setAttribute('aria-expanded', nextExpanded ? 'true' : 'false');
      });
    }
  }

  /**
   * Mengelola dialog pratinjau sertifikat dan kegiatan organisasi UMN.
   */
  class CertificateModalController {
    constructor(options) {
      this.modal = document.getElementById(options.modalId || 'certModal');
      this.metaEl = document.getElementById(options.metaId || 'certModalMeta');
      this.titleEl = document.getElementById(options.titleId || 'certModalTitle');
      this.stageEl = document.getElementById(options.stageId || 'certModalStage');
      this.descEl = document.getElementById(options.descId || 'certModalDesc');
      this.closeBtn = document.getElementById(options.closeBtnId || 'certModalClose');
      this.triggers = Array.from(document.querySelectorAll(options.triggerSelector || '.achievement-thumb'));
      this.lastTrigger = null;
    }

    openFromTrigger(btn) {
      this.lastTrigger = btn;
      const category = btn.getAttribute('data-cert-category') || 'Sertifikat';
      const index = btn.getAttribute('data-cert-index') || '';
      const title = btn.getAttribute('data-cert-title') || 'Pratinjau Sertifikat';
      const desc = btn.getAttribute('data-cert-desc') || '';
      const existingImg = btn.querySelector('img');

      if (this.metaEl) {
        this.metaEl.textContent = index ? category + ' · Slot ' + index : category;
      }
      if (this.titleEl) {
        this.titleEl.textContent = title;
      }
      if (this.descEl) {
        this.descEl.textContent = desc;
      }
      if (this.stageEl) {
        this.stageEl.textContent = '';
        this.stageEl.classList.remove('cert-modal-stage--gallery');
        const galleryAttr = btn.getAttribute('data-cert-gallery');
        const gallerySources = galleryAttr
          ? galleryAttr
              .split(',')
              .map((src) => src.trim())
              .filter(Boolean)
          : [];

        if (gallerySources.length > 1) {
          this.stageEl.classList.add('cert-modal-stage--gallery');
          gallerySources.forEach((src, photoIdx) => {
            const imgEl = document.createElement('img');
            imgEl.src = src;
            imgEl.alt = title + ' - Dokumentasi ' + (photoIdx + 1);
            imgEl.decoding = 'async';
            this.stageEl.appendChild(imgEl);
          });
        } else if (existingImg) {
          this.stageEl.appendChild(existingImg.cloneNode(true));
        } else {
          const placeholderNote = document.createElement('span');
          placeholderNote.className = 'photo-hint';
          placeholderNote.textContent = 'Slot Gambar Dokumentasi / Sertifikat ' + index + ' (4:3) siap diisi di index.html';
          this.stageEl.appendChild(placeholderNote);
        }
      }

      if (typeof this.modal.showModal === 'function') {
        this.modal.showModal();
      } else {
        this.modal.setAttribute('open', '');
      }
    }

    restoreFocus() {
      if (this.lastTrigger && typeof this.lastTrigger.focus === 'function') {
        this.lastTrigger.focus();
      }
    }

    close() {
      if (!this.modal) return;
      if (typeof this.modal.close === 'function' && this.modal.open) {
        this.modal.close();
      } else {
        this.modal.removeAttribute('open');
      }
      this.restoreFocus();
    }

    init() {
      if (!this.modal || !this.triggers.length) return;

      this.triggers.forEach((btn) => {
        btn.addEventListener('click', () => this.openFromTrigger(btn));
      });

      if (this.closeBtn) {
        this.closeBtn.addEventListener('click', () => this.close());
      }

      this.modal.addEventListener('click', (e) => {
        if (e.target === this.modal) {
          this.close();
        }
      });

      this.modal.addEventListener('close', () => this.restoreFocus());
    }
  }

  Portfolio.CvNoticeController = CvNoticeController;
  Portfolio.CertificateModalController = CertificateModalController;
})(window);
