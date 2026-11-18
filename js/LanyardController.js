(function (global) {
  'use strict';

  const Portfolio = (global.Portfolio = global.Portfolio || {});

  const PHYSICS = {
    proximityX: 64,
    proximityY: 48,
    springK: 0.115,
    springDamp: 0.928,
    rotSpringK: 0.11,
    rotSpringDamp: 0.905,
    unrollDurationMs: 540
  };

  /**
   * Mengelola fisika pegas lanyard ID: efek roll gorden saat terbuka, tarik elastis atas/bawah/samping, dan kemiringan 3D.
   */
  class LanyardController {
    constructor(options) {
      this.heroSection = document.getElementById(options.heroId || 'tentang');
      this.stage = document.getElementById(options.stageId || 'lanyardStage');
      this.rig = document.getElementById(options.rigId || 'lanyardRig');
      this.pendant = document.getElementById(options.pendantId || 'lanyardPendant');
      this.card = document.getElementById(options.cardId || 'lanyardCard');
      this.reducedMotion = Boolean(options.reducedMotion);
      this.hasFinePointer =
        Boolean(window.matchMedia) && window.matchMedia('(hover: hover) and (pointer: fine)').matches;

      this.target = { x: 0, y: 0, rx: 0, ry: 0 };
      this.current = { x: 0, y: 0, rx: 0, ry: 0 };
      this.vel = { x: 0, y: 0, rx: 0, ry: 0 };
      this.smoothDragVel = { x: 0, y: 0 };
      this.dragVel = { x: 0, y: 0 };

      this.isDragging = false;
      this.isDroppingIntro = false;
      this.unrollStartTime = 0;
      this.dragStartX = 0;
      this.dragStartY = 0;
      this.lastDragClientX = 0;
      this.lastDragClientY = 0;
      this.lastDragMoveTime = 0;
      this.lastFrameTime = 0;
      this.rafId = null;
    }

    isReady() {
      return Boolean(
        this.heroSection && this.stage && this.rig && this.pendant && this.card && !this.reducedMotion
      );
    }

    applyFrame() {
      const pivotRz = -(this.current.x * 0.15) + this.vel.x * 0.11;
      const strapPullY = this.current.y + Math.abs(this.current.x) * 0.06;
      const strapScaleX = Math.max(0.84, Math.min(1.06, 1 - strapPullY * 0.001));

      this.rig.style.setProperty('--lanyard-y', strapPullY.toFixed(2) + 'px');
      this.rig.style.setProperty('--lanyard-strap-scale-x', strapScaleX.toFixed(3));
      this.rig.style.transform =
        'perspective(950px) translate3d(' +
        (this.current.x * 0.28).toFixed(2) +
        'px, 0, 0) rotateZ(' +
        pivotRz.toFixed(2) +
        'deg)';
      this.pendant.style.transform =
        'translate3d(0, ' +
        strapPullY.toFixed(2) +
        'px, 0) rotateX(' +
        this.current.rx.toFixed(2) +
        'deg) rotateY(' +
        this.current.ry.toFixed(2) +
        'deg)';
    }

    updateUnrollClip(now) {
      if (!this.rig.classList.contains('is-unrolling') || this.unrollStartTime <= 0) return;
      const unrollT = Math.min(1, Math.max(0, (now - this.unrollStartTime) / PHYSICS.unrollDurationMs));
      const unrollEased = 1 - Math.pow(1 - unrollT, 3);
      const clipBottom = Math.max(0, (1 - unrollEased) * 100);
      this.rig.style.setProperty('--lanyard-unroll-clip', clipBottom.toFixed(1) + '%');
      if (unrollT >= 1) {
        this.rig.classList.remove('is-unrolling');
        this.rig.style.removeProperty('--lanyard-unroll-clip');
      }
    }

    stepMotion(timestamp) {
      const now = timestamp || performance.now();
      const rawDt = this.lastFrameTime ? (now - this.lastFrameTime) / 16.667 : 1;
      const dt = Math.min(2.2, Math.max(0.15, rawDt));
      this.lastFrameTime = now;

      if (this.isDragging) {
        const prevX = this.current.x;
        const prevY = this.current.y;
        const follow = 1 - Math.pow(0.52, dt);
        const rotFollow = 1 - Math.pow(0.62, dt);

        this.current.x += (this.target.x - this.current.x) * follow;
        this.current.y += (this.target.y - this.current.y) * follow;
        this.current.rx += (this.target.rx - this.current.rx) * rotFollow;
        this.current.ry += (this.target.ry - this.current.ry) * rotFollow;

        this.smoothDragVel.x = (this.current.x - prevX) / dt;
        this.smoothDragVel.y = (this.current.y - prevY) / dt;
        this.vel.x = 0;
        this.vel.y = 0;
        this.vel.rx = 0;
        this.vel.ry = 0;
      } else {
        const substeps = dt > 1.1 ? 2 : 1;
        const stepDt = dt / substeps;
        const dampLin = Math.pow(PHYSICS.springDamp, stepDt);
        const dampRot = Math.pow(PHYSICS.rotSpringDamp, stepDt);

        for (let s = 0; s < substeps; s++) {
          this.vel.x = (this.vel.x + (this.target.x - this.current.x) * PHYSICS.springK * stepDt) * dampLin;
          this.vel.y = (this.vel.y + (this.target.y - this.current.y) * PHYSICS.springK * stepDt) * dampLin;
          this.current.x += this.vel.x * stepDt;
          this.current.y += this.vel.y * stepDt;

          this.vel.rx = (this.vel.rx + (this.target.rx - this.current.rx) * PHYSICS.rotSpringK * stepDt) * dampRot;
          this.vel.ry = (this.vel.ry + (this.target.ry - this.current.ry) * PHYSICS.rotSpringK * stepDt) * dampRot;
          this.current.rx += this.vel.rx * stepDt;
          this.current.ry += this.vel.ry * stepDt;
        }
      }

      this.applyFrame();
      this.updateUnrollClip(now);

      const settled =
        !this.isDragging &&
        !this.rig.classList.contains('is-unrolling') &&
        Math.abs(this.target.rx - this.current.rx) < 0.03 &&
        Math.abs(this.target.ry - this.current.ry) < 0.03 &&
        Math.abs(this.target.x - this.current.x) < 0.06 &&
        Math.abs(this.target.y - this.current.y) < 0.06 &&
        Math.abs(this.vel.x) < 0.04 &&
        Math.abs(this.vel.y) < 0.04 &&
        Math.abs(this.vel.rx) < 0.04 &&
        Math.abs(this.vel.ry) < 0.04;

      if (!settled) {
        this.rafId = requestAnimationFrame((ts) => this.stepMotion(ts));
        return;
      }

      this.rafId = null;
      this.lastFrameTime = 0;
      this.isDroppingIntro = false;
      this.rig.classList.remove('is-dropping', 'is-unrolling');
      this.rig.style.removeProperty('--lanyard-unroll-clip');

      if (this.target.x === 0 && this.target.y === 0 && this.target.rx === 0 && this.target.ry === 0) {
        this.rig.classList.remove('is-pointer-active', 'is-dragging');
        this.rig.style.removeProperty('--lanyard-y');
        this.rig.style.removeProperty('--lanyard-strap-scale-x');
        this.rig.style.transform = '';
        this.pendant.style.transform = '';
      }
    }

    ensureLoop() {
      if (this.rafId === null) {
        this.lastFrameTime = 0;
        this.rafId = requestAnimationFrame((ts) => this.stepMotion(ts));
      }
    }

    preparePreload() {
      if (!this.isReady()) return;
      this.isDroppingIntro = true;
      this.current = { x: -6, y: -44, rx: 6, ry: -4 };
      this.rig.classList.add('is-dropping', 'is-unrolling');
      this.rig.style.setProperty('--lanyard-unroll-clip', '100%');
      this.applyFrame();
    }

    triggerDrop() {
      if (!this.isReady()) return;
      if (this.rafId !== null) {
        cancelAnimationFrame(this.rafId);
        this.rafId = null;
      }

      this.isDroppingIntro = true;
      this.isDragging = false;
      this.unrollStartTime = performance.now();
      this.target = { x: 0, y: 0, rx: 0, ry: 0 };
      this.current = { x: -6, y: -44, rx: 6, ry: -4 };
      this.vel = { x: 1.2, y: 6.4, rx: -1.2, ry: 0.9 };

      this.rig.classList.add('is-dropping', 'is-unrolling');
      this.rig.style.setProperty('--lanyard-unroll-clip', '100%');
      this.applyFrame();
      this.ensureLoop();
    }

    resetTilt() {
      if (this.isDragging || this.isDroppingIntro) return;
      if (
        !this.rig.classList.contains('is-pointer-active') &&
        this.current.rx === 0 &&
        this.current.ry === 0 &&
        this.current.x === 0 &&
        this.current.y === 0
      ) {
        return;
      }
      this.target = { x: 0, y: 0, rx: 0, ry: 0 };
      this.ensureLoop();
    }

    updateGlare(clientX, clientY) {
      const cardRect = this.card.getBoundingClientRect();
      const stageRect = this.stage.getBoundingClientRect();
      const glareX = Math.max(5, Math.min(95, ((clientX - cardRect.left) / (cardRect.width || stageRect.width || 1)) * 100));
      const glareY = Math.max(5, Math.min(95, ((clientY - cardRect.top) / (cardRect.height || stageRect.height || 1)) * 100));
      this.card.style.setProperty('--lanyard-glare-x', glareX.toFixed(1) + '%');
      this.card.style.setProperty('--lanyard-glare-y', glareY.toFixed(1) + '%');
    }

    handlePointerDown(e) {
      if (e.button !== undefined && e.button !== 0 && e.pointerType === 'mouse') return;
      this.isDroppingIntro = false;
      this.isDragging = true;
      this.dragStartX = e.clientX - this.current.x;
      this.dragStartY = e.clientY - this.current.y;
      this.lastDragClientX = e.clientX;
      this.lastDragClientY = e.clientY;
      this.lastDragMoveTime = performance.now();
      this.dragVel = { x: 0, y: 0 };

      document.body.classList.add('is-lanyard-dragging');
      this.rig.classList.remove('is-dropping', 'is-unrolling');
      this.rig.style.removeProperty('--lanyard-unroll-clip');
      this.rig.classList.add('is-pointer-active', 'is-dragging');

      if (typeof this.card.setPointerCapture === 'function') {
        try {
          this.card.setPointerCapture(e.pointerId);
        } catch (err) {
          // Abaikan bila perangkat tidak mendukung capture
        }
      }
      this.ensureLoop();
    }

    updateDragPosition(clientX, clientY) {
      const now = performance.now();
      const elapsed = Math.max(8, now - this.lastDragMoveTime);
      const instantVx = ((clientX - this.lastDragClientX) / elapsed) * 16.667;
      const instantVy = ((clientY - this.lastDragClientY) / elapsed) * 16.667;
      this.dragVel.x = this.dragVel.x * 0.5 + Math.max(-28, Math.min(28, instantVx)) * 0.5;
      this.dragVel.y = this.dragVel.y * 0.5 + Math.max(-28, Math.min(28, instantVy)) * 0.5;
      this.lastDragClientX = clientX;
      this.lastDragClientY = clientY;
      this.lastDragMoveTime = now;

      const rawDx = clientX - this.dragStartX;
      const rawDy = clientY - this.dragStartY;
      const maxUp = window.innerWidth <= 680 ? 64 : 108;

      this.target.x = 112 * Math.tanh(rawDx / 135);
      this.target.y = rawDy >= 0 ? 145 * Math.tanh(rawDy / 160) : maxUp * Math.tanh(rawDy / (maxUp * 1.15));
      this.target.ry = (this.target.x / 112) * 16;
      this.target.rx = rawDy >= 0 ? -(this.target.y / 145) * 11 : -(this.target.y / maxUp) * 10;

      this.updateGlare(clientX, clientY);
      this.ensureLoop();
    }

    releaseDrag(e) {
      if (!this.isDragging) return;
      this.isDragging = false;
      document.body.classList.remove('is-lanyard-dragging');
      this.rig.classList.remove('is-dragging');

      if (e && e.pointerId !== undefined && typeof this.card.hasPointerCapture === 'function') {
        try {
          if (this.card.hasPointerCapture(e.pointerId)) {
            this.card.releasePointerCapture(e.pointerId);
          }
        } catch (err) {
          // Abaikan
        }
      }

      const staleDrag = performance.now() - this.lastDragMoveTime > 70;
      const pointerVx = staleDrag ? 0 : this.dragVel.x * 0.25;
      const pointerVy = staleDrag ? 0 : this.dragVel.y * 0.25;
      this.vel.x = this.smoothDragVel.x * 0.65 + pointerVx;
      this.vel.y = this.smoothDragVel.y * 0.65 + pointerVy;
      this.vel.rx += -this.vel.y * 0.12 - this.current.y * 0.035;
      this.vel.ry += this.vel.x * 0.14;

      this.smoothDragVel = { x: 0, y: 0 };
      this.target = { x: 0, y: 0, rx: 0, ry: 0 };
      this.ensureLoop();
    }

    handleProximityMove(e) {
      if (this.isDragging || this.isDroppingIntro) return;
      const stageRect = this.stage.getBoundingClientRect();
      if (!stageRect.width || !stageRect.height) return;

      const isNearLanyard =
        e.clientX >= stageRect.left - PHYSICS.proximityX &&
        e.clientX <= stageRect.right + PHYSICS.proximityX &&
        e.clientY >= stageRect.top - PHYSICS.proximityY &&
        e.clientY <= stageRect.bottom + PHYSICS.proximityY;

      if (!isNearLanyard) {
        this.resetTilt();
        return;
      }

      const cx = stageRect.left + stageRect.width * 0.5;
      const cy = stageRect.top + stageRect.height * 0.5;
      const nx = Math.max(-1, Math.min(1, (e.clientX - cx) / (stageRect.width * 0.72 + PHYSICS.proximityX)));
      const ny = Math.max(-1, Math.min(1, (e.clientY - cy) / (stageRect.height * 0.55 + PHYSICS.proximityY)));

      this.target.x = nx * 9;
      this.target.y = 0;
      this.target.ry = nx * 13;
      this.target.rx = -ny * 9;

      this.updateGlare(e.clientX, e.clientY);
      this.rig.classList.add('is-pointer-active');
      this.ensureLoop();
    }

    bindEvents() {
      this.card.addEventListener('dragstart', (e) => e.preventDefault());
      this.card.addEventListener('pointerdown', (e) => this.handlePointerDown(e));

      window.addEventListener('pointermove', (e) => {
        if (this.isDragging) {
          this.updateDragPosition(e.clientX, e.clientY);
        }
      });

      window.addEventListener('pointerup', (e) => this.releaseDrag(e));
      window.addEventListener('pointercancel', (e) => this.releaseDrag(e));

      if (this.hasFinePointer) {
        this.heroSection.addEventListener('pointermove', (e) => this.handleProximityMove(e));
        this.heroSection.addEventListener('pointerleave', () => this.resetTilt());
      }
    }

    init() {
      if (!this.isReady()) return;
      if (document.documentElement.classList.contains('is-preloading')) {
        this.preparePreload();
      }
      this.bindEvents();
    }
  }

  Portfolio.LanyardController = LanyardController;
})(window);
