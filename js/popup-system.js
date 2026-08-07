/* ================================================================
   Mocksheets — Popup System v1.0
   Usage:
     window.popupSystem = new PopupSystem({ page: 'landing', authUrl: '/auth' });
     window.popupSystem.init();
   Test:
     window.popupSystem.showExit()
     window.popupSystem.showScroll()
     window.popupSystem.showToast(0)
     window.popupSystem.clearStorage()
   ================================================================ */

class PopupSystem {
  constructor(opts = {}) {
    this.page     = opts.page     || 'landing';
    this.authUrl  = opts.authUrl  || '/auth';
    this.proLink  = opts.proLink  || '/auth';

    this.KEYS = {
      EXIT_LAST_SHOWN:  'ms_exit_last',
      SCROLL_SHOWN:     'ms_scroll_shown',
      WELCOME_SHOWN:    'ms_welcome_shown',
      TOAST_DISABLED:   'ms_toast_off',
      CAMPAIGN_CLOSED:  'ms_campaign_closed',
      VARIANT:          'ms_popup_variant'
    };

    this.state = {
      exitShown:   false,
      scrollShown: false,
      activePopup: null,
      toastCount:  0,
      idleTimer:   null,
      lastScrollY: 0,
      lastScrollT: 0,
      swipeStartY: 0
    };

    this.TOASTS = [
      { avatar: 'AK', color: '#16a34a', text: 'Ahmet K. Pro plana geçti',            time: '2 dakika önce' },
      { avatar: 'ZD', color: '#0ea5e9', text: 'Zeynep D. ilk komutunu kullandı',      time: '5 dakika önce' },
      { avatar: 'MÇ', color: '#f59e0b', text: 'Mert Ç. PDF\'den tablo oluşturdu',     time: '8 dakika önce' },
      { avatar: 'SB', color: '#8b5cf6', text: 'Selin B. ekibini davet etti',           time: '12 dakika önce' }
    ];

    this.VARIANTS = {
      A: { headline: 'Haftada <span class="ms-accent">18 saat</span> mi Excel\'e gidiyor?', cta: 'Ücretsiz Başla — Kart Gerekmez' },
      B: { headline: 'Formül yazmadan <span class="ms-accent">Excel</span> yönet.',          cta: '3 Ay $1\'a Başla →' }
    };
  }

  /* ──────────────────────────────────────────────────────────────
     INIT
  ────────────────────────────────────────────────────────────── */
  init() {
    if (this.page === 'landing') {
      this._injectExitModal();
      this._injectSnackbar();
      this._injectCampaignStrip();
      this._injectSPToast();

      this.checkCampaignStrip();
      this.initScrollDepth();
      this.initExitIntent();
      this.initSocialProof();
    }

    if (this.page === 'app') {
      this._injectFeatureTooltip();
      this.initFeatureTooltip();
    }

    this._announcer = this._createAnnouncer();
  }

  /* ──────────────────────────────────────────────────────────────
     POPUP 1 — EXIT INTENT
  ────────────────────────────────────────────────────────────── */
  _injectExitModal() {
    const v    = this._getVariant();
    const copy = this.VARIANTS[v];
    const isMobile = window.innerWidth <= 768;

    const el = document.createElement('div');
    el.id = 'ms-exit-overlay';
    el.className = 'ms-popup-overlay';
    el.setAttribute('role', 'dialog');
    el.setAttribute('aria-modal', 'true');
    el.setAttribute('aria-labelledby', 'ms-exit-title');
    el.setAttribute('aria-describedby', 'ms-exit-desc');
    el.setAttribute('aria-hidden', 'true');
    el.innerHTML = `
      <div class="ms-exit-modal" id="ms-exit-modal">
        ${isMobile ? '<div class="ms-sheet-handle"></div>' : ''}
        <button class="ms-close-btn" id="ms-exit-close" aria-label="Popup kapat">×</button>
        <div class="ms-exit-badge">⚡ Kampanya bitmeden</div>
        <h2 class="ms-exit-title" id="ms-exit-title">${copy.headline}</h2>
        <p class="ms-exit-sub" id="ms-exit-desc">İlk 1 ay $1/ay ile başla.<br>Formülsüz. Anında. Türkçe.</p>
        <div class="ms-exit-features">
          <span class="ms-exit-feat">⏱ 2.2s yanıt</span>
          <span class="ms-exit-feat">🔒 KVKK uyumlu</span>
        </div>
        <a href="${this.authUrl}" class="ms-exit-cta" id="ms-exit-cta">${copy.cta}</a>
        <button class="ms-exit-dismiss" id="ms-exit-dismiss">Şimdi değil</button>
      </div>`;

    document.body.appendChild(el);

    el.addEventListener('click', (e) => { if (e.target === el) this.closeExit(); });
    document.getElementById('ms-exit-close').addEventListener('click', () => this.closeExit());
    document.getElementById('ms-exit-dismiss').addEventListener('click', () => this.closeExit());
    document.getElementById('ms-exit-cta').addEventListener('click', () => {
      this.track('popup_cta_click', { type: 'exit', variant: v });
    });

    if (isMobile) this._initSwipeClose(document.getElementById('ms-exit-modal'), () => this.closeExit());

    this._trapFocus(el);
  }

  initExitIntent() {
    if (!this._canShowExit()) return;

    const isMobile = window.innerWidth <= 768;

    // Desktop: mouseleave top 10%
    if (!isMobile) {
      document.addEventListener('mouseleave', (e) => {
        if (e.clientY < window.innerHeight * 0.10 && this._canShowExit()) {
          this.showExit();
        }
      }, { once: true });
    }

    // Mobile: fast scroll up (200px in 300ms)
    if (isMobile) {
      window.addEventListener('scroll', () => {
        const now  = Date.now();
        const cur  = window.scrollY;
        const diff = this.state.lastScrollY - cur;
        const dt   = now - this.state.lastScrollT;
        if (diff > 200 && dt < 300 && this._canShowExit()) {
          this.showExit();
        }
        this.state.lastScrollY = cur;
        this.state.lastScrollT = now;
      }, { passive: true });
    }

    // Idle 60s
    this._resetIdleTimer();
    ['mousemove', 'keydown', 'scroll', 'touchstart'].forEach(ev => {
      window.addEventListener(ev, () => this._resetIdleTimer(), { passive: true });
    });
  }

  _resetIdleTimer() {
    clearTimeout(this.state.idleTimer);
    this.state.idleTimer = setTimeout(() => {
      if (this._canShowExit()) this.showExit();
    }, 60000);
  }

  _canShowExit() {
    if (this.state.exitShown) return false;
    const last = parseInt(localStorage.getItem(this.KEYS.EXIT_LAST_SHOWN) || '0', 10);
    return Date.now() - last > 7 * 24 * 60 * 60 * 1000;
  }

  showExit() {
    if (!this.canShowPopup('exit')) return;
    this.state.exitShown = true;
    localStorage.setItem(this.KEYS.EXIT_LAST_SHOWN, Date.now().toString());
    this.state.activePopup = 'exit';

    const overlay = document.getElementById('ms-exit-overlay');
    if (!overlay) return;
    overlay.setAttribute('aria-hidden', 'false');
    overlay.style.display = 'flex';
    requestAnimationFrame(() => overlay.classList.add('ms-visible'));

    this._announce('Teklif popup\'ı açıldı');
    this.track('popup_shown', { type: 'exit', variant: this._getVariant() });
    this._focusFirst(overlay);
    clearTimeout(this.state.idleTimer);
  }

  closeExit() {
    const overlay = document.getElementById('ms-exit-overlay');
    if (!overlay) return;
    overlay.classList.remove('ms-visible');
    setTimeout(() => {
      overlay.style.display = 'none';
      overlay.setAttribute('aria-hidden', 'true');
    }, 300);
    this.state.activePopup = null;
    this._announce('Popup kapatıldı');
    this.track('popup_closed', { type: 'exit' });
  }

  /* ──────────────────────────────────────────────────────────────
     POPUP 2 — SCROLL DEPTH SNACKBAR
  ────────────────────────────────────────────────────────────── */
  _injectSnackbar() {
    const el = document.createElement('div');
    el.id = 'ms-snackbar';
    el.className = 'ms-snackbar';
    el.setAttribute('role', 'status');
    el.innerHTML = `
      <div class="ms-snackbar-head">
        <span class="ms-snackbar-title">🎯 Fiyatı gördün mü?</span>
        <button class="ms-snackbar-close" id="ms-snackbar-close" aria-label="Kapat">×</button>
      </div>
      <div class="ms-snackbar-body">
        <span class="ms-snackbar-price">$1/ay — İlk 1 ay</span>
        <a href="${this.authUrl}" class="ms-snackbar-link">Hemen başla →</a>
      </div>
      <div class="ms-snackbar-progress" id="ms-snackbar-progress"></div>`;
    document.body.appendChild(el);

    document.getElementById('ms-snackbar-close').addEventListener('click', () => this.closeSnackbar());
  }

  initScrollDepth() {
    if (localStorage.getItem(this.KEYS.SCROLL_SHOWN)) return;

    const sentinel = document.createElement('div');
    sentinel.style.cssText = 'position:absolute;height:1px;pointer-events:none';

    const setPos = () => {
      sentinel.style.top = (document.body.scrollHeight * 0.60) + 'px';
    };
    setPos();
    window.addEventListener('resize', setPos, { passive: true });
    document.body.appendChild(sentinel);

    const obs = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && !this.state.scrollShown && !this.state.exitShown) {
        this.showScroll();
        obs.disconnect();
      }
    }, { threshold: 0 });
    obs.observe(sentinel);
  }

  showScroll() {
    if (!this.canShowPopup('scroll')) return;
    this.state.scrollShown = true;
    localStorage.setItem(this.KEYS.SCROLL_SHOWN, '1');
    this.state.activePopup = 'scroll';

    const el = document.getElementById('ms-snackbar');
    if (!el) return;
    el.style.display = 'block';
    requestAnimationFrame(() => el.classList.add('ms-visible'));

    this.track('popup_shown', { type: 'scroll' });

    // reset progress bar
    const bar = document.getElementById('ms-snackbar-progress');
    if (bar) { bar.style.animation = 'none'; void bar.offsetWidth; bar.style.animation = ''; }

    this._snackTimer = setTimeout(() => this.closeSnackbar(), 8000);
    el.addEventListener('mouseenter', () => clearTimeout(this._snackTimer));
    el.addEventListener('mouseleave', () => {
      this._snackTimer = setTimeout(() => this.closeSnackbar(), 2000);
    });
  }

  closeSnackbar() {
    const el = document.getElementById('ms-snackbar');
    if (!el) return;
    el.classList.remove('ms-visible');
    setTimeout(() => { el.style.display = 'none'; }, 400);
    this.state.activePopup = null;
    clearTimeout(this._snackTimer);
  }

  /* ──────────────────────────────────────────────────────────────
     POPUP 3 — CAMPAIGN STRIP
  ────────────────────────────────────────────────────────────── */
  _injectCampaignStrip() {
    const el = document.createElement('div');
    el.id = 'ms-campaign-strip';
    el.className = 'ms-campaign-strip';
    el.setAttribute('role', 'banner');
    el.innerHTML = `
      <span class="ms-strip-text">⚡ MAYIS kampanyası: İlk 1 ay <strong>$1/ay</strong></span>
      <a href="${this.authUrl}" class="ms-strip-btn">Pro'ya Geç →</a>
      <button class="ms-strip-close" id="ms-strip-close" aria-label="Duyuruyu kapat">×</button>`;
    document.body.insertBefore(el, document.body.firstChild);

    document.getElementById('ms-strip-close').addEventListener('click', () => {
      this.closeCampaignStrip();
    });
  }

  checkCampaignStrip() {
    const closed = parseInt(localStorage.getItem(this.KEYS.CAMPAIGN_CLOSED) || '0', 10);
    if (Date.now() - closed < 3 * 24 * 60 * 60 * 1000) return;

    const el = document.getElementById('ms-campaign-strip');
    if (!el) return;

    setTimeout(() => {
      el.style.display = 'flex';
      document.body.classList.add('has-strip');
      requestAnimationFrame(() => el.classList.add('ms-visible'));
    }, 3000);
  }

  closeCampaignStrip() {
    const el = document.getElementById('ms-campaign-strip');
    if (!el) return;
    el.classList.remove('ms-visible');
    document.body.classList.remove('has-strip');
    setTimeout(() => { el.style.display = 'none'; }, 350);
    localStorage.setItem(this.KEYS.CAMPAIGN_CLOSED, Date.now().toString());
  }

  /* ──────────────────────────────────────────────────────────────
     POPUP 4 — FEATURE TOOLTIP (app.html only)
  ────────────────────────────────────────────────────────────── */
  _injectFeatureTooltip() {
    const inputArea = document.querySelector('.ai-input');
    if (!inputArea) return;

    inputArea.style.position = 'relative';
    const el = document.createElement('div');
    el.id = 'ms-tooltip';
    el.className = 'ms-tooltip-wrap';
    el.setAttribute('role', 'tooltip');
    el.innerHTML = `
      <button class="ms-tooltip-close" id="ms-tooltip-close" aria-label="Kapat">×</button>
      <div class="ms-tooltip-title">Son 1 komutun kaldı 🎯</div>
      <div class="ms-tooltip-body">Ücretsiz limitin dolmak üzere. Pro'da günde 30 komut var.</div>
      <a href="${this.proLink}" class="ms-tooltip-cta">Pro'ya Geç — $1/ay</a>`;
    inputArea.appendChild(el);

    document.getElementById('ms-tooltip-close').addEventListener('click', () => this.closeTooltip());
  }

  initFeatureTooltip() {
    let cmdCount = 0;
    const THRESHOLD = 5;

    // Listen for AI command submissions
    document.addEventListener('ms:commandSent', () => {
      cmdCount++;
      if (cmdCount >= THRESHOLD && !localStorage.getItem('ms_tooltip_shown')) {
        this.showFeatureTooltip();
      }
    });

    // Also watch send button as fallback
    const sendBtn = document.querySelector('.ai-send');
    if (sendBtn) {
      sendBtn.addEventListener('click', () => {
        cmdCount++;
        if (cmdCount >= THRESHOLD && !localStorage.getItem('ms_tooltip_shown')) {
          this.showFeatureTooltip();
        }
      });
    }
  }

  showFeatureTooltip() {
    const el = document.getElementById('ms-tooltip');
    if (!el) return;
    el.classList.add('ms-visible');
    localStorage.setItem('ms_tooltip_shown', Date.now().toString());
    this.track('popup_shown', { type: 'tooltip' });

    setTimeout(() => this.closeTooltip(), 24000);
  }

  closeTooltip() {
    const el = document.getElementById('ms-tooltip');
    if (el) el.classList.remove('ms-visible');
  }

  /* ──────────────────────────────────────────────────────────────
     POPUP 5 — SOCIAL PROOF TOAST
  ────────────────────────────────────────────────────────────── */
  _injectSPToast() {
    const el = document.createElement('div');
    el.id = 'ms-sp-toast';
    el.className = 'ms-sp-toast';
    el.setAttribute('aria-live', 'polite');
    el.innerHTML = `
      <div class="ms-sp-avatar" id="ms-sp-avatar"></div>
      <div class="ms-sp-content">
        <div class="ms-sp-text" id="ms-sp-text"></div>
        <div class="ms-sp-time" id="ms-sp-time"></div>
      </div>`;
    document.body.appendChild(el);
  }

  initSocialProof() {
    if (localStorage.getItem(this.KEYS.TOAST_DISABLED)) return;

    const shuffled = [...this.TOASTS].sort(() => Math.random() - 0.5);
    let idx = 0;

    const showNext = () => {
      if (idx >= shuffled.length || this.state.toastCount >= 4) {
        localStorage.setItem(this.KEYS.TOAST_DISABLED, '1');
        return;
      }
      if (this.state.activePopup !== null) {
        setTimeout(showNext, 3000);
        return;
      }
      this.showToast(idx, shuffled);
      idx++;
      this.state.toastCount++;
      const delay = 12000 + Math.random() * 6000;
      setTimeout(showNext, delay + 5000);
    };

    setTimeout(showNext, 8000);

    // Stop after user interacts
    ['click', 'keydown'].forEach(ev => {
      window.addEventListener(ev, () => {
        localStorage.setItem(this.KEYS.TOAST_DISABLED, '1');
      }, { once: true, passive: true });
    });
  }

  showToast(indexOrNum, pool) {
    const toasts = pool || this.TOASTS;
    const data   = toasts[indexOrNum % toasts.length];
    const el     = document.getElementById('ms-sp-toast');
    if (!el) return;

    document.getElementById('ms-sp-avatar').textContent        = data.avatar;
    document.getElementById('ms-sp-avatar').style.background   = data.color;
    document.getElementById('ms-sp-text').textContent          = data.text;
    document.getElementById('ms-sp-time').textContent          = data.time;

    el.classList.remove('ms-visible');
    void el.offsetWidth;
    el.style.display = 'flex';
    requestAnimationFrame(() => el.classList.add('ms-visible'));
    this.track('popup_shown', { type: 'toast', index: indexOrNum });

    setTimeout(() => {
      el.classList.remove('ms-visible');
      setTimeout(() => { el.style.display = 'none'; }, 350);
    }, 5000);
  }

  /* ──────────────────────────────────────────────────────────────
     HELPERS
  ────────────────────────────────────────────────────────────── */
  canShowPopup(type) {
    if (type === 'exit' || type === 'scroll') {
      return this.state.activePopup === null;
    }
    return true;
  }

  track(event, data = {}) {
    if (typeof gtag !== 'undefined') {
      gtag('event', event, { popup_type: data.type, popup_action: data.action, popup_variant: data.variant });
    }
    console.log('[Popup]', event, data);
  }

  clearStorage() {
    Object.values(this.KEYS).forEach(k => localStorage.removeItem(k));
    localStorage.removeItem('ms_tooltip_shown');
    this.state.exitShown   = false;
    this.state.scrollShown = false;
    this.state.toastCount  = 0;
    console.log('[Popup] localStorage cleared');
  }

  _getVariant() {
    let v = localStorage.getItem(this.KEYS.VARIANT);
    if (!v) {
      v = Math.random() < 0.5 ? 'A' : 'B';
      localStorage.setItem(this.KEYS.VARIANT, v);
    }
    return v;
  }

  _createAnnouncer() {
    const el = document.createElement('div');
    el.className = 'ms-sr-only';
    el.setAttribute('aria-live', 'assertive');
    el.setAttribute('aria-atomic', 'true');
    document.body.appendChild(el);
    return el;
  }

  _announce(msg) {
    if (this._announcer) {
      this._announcer.textContent = '';
      setTimeout(() => { this._announcer.textContent = msg; }, 50);
    }
  }

  _focusFirst(container) {
    const focusable = container.querySelector('button, a, [tabindex="0"]');
    if (focusable) setTimeout(() => focusable.focus(), 50);
  }

  _trapFocus(container) {
    container.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        if (container.id === 'ms-exit-overlay') this.closeExit();
        return;
      }
      if (e.key !== 'Tab') return;
      const focusables = [...container.querySelectorAll('button, a, [tabindex="0"]')];
      if (!focusables.length) return;
      const first = focusables[0];
      const last  = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault(); last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault(); first.focus();
      }
    });
  }

  _initSwipeClose(el, closeFn) {
    el.addEventListener('touchstart', (e) => {
      this.state.swipeStartY = e.touches[0].clientY;
    }, { passive: true });
    el.addEventListener('touchend', (e) => {
      const diff = e.changedTouches[0].clientY - this.state.swipeStartY;
      if (diff > 60) closeFn();
    }, { passive: true });
  }
}
