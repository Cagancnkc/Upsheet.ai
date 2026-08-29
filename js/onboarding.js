/**
 * MS.onboarding — persistent activation state client.
 * Fetches server-side onboarding state, exposes helpers to record events
 * and open contextual upgrade prompts.
 */
(function (global) {
  'use strict';

  const API = (typeof window !== 'undefined' && window.location.hostname === 'localhost')
    ? 'http://localhost:3001'
    : 'https://upsheet-ai.onrender.com';

  let cached = null;
  const listeners = new Set();
  const sentEvents = new Set(); // in-page idempotency guard

  async function authHeadersSafe() {
    try {
      if (typeof authHeaders === 'function') return await authHeaders();
    } catch { /* noop */ }
    try {
      const tok = localStorage.getItem('mocksheets_token') || localStorage.getItem('sb-access-token');
      return tok ? { Authorization: `Bearer ${tok}`, 'Content-Type': 'application/json' } : { 'Content-Type': 'application/json' };
    } catch { return { 'Content-Type': 'application/json' }; }
  }

  function notify() {
    listeners.forEach(fn => { try { fn(cached); } catch (e) { /* noop */ } });
    if (global.MS?.state && cached) {
      global.MS.state.set({
        connection: cached.storeStatus === 'connected' ? 'connected' : 'not_connected',
        mode: cached.dataMode,
        plan: { loaded: true, tier: cached.plan, displayName: cached.plan },
      });
    }
  }

  async function fetchState() {
    try {
      const headers = await authHeadersSafe();
      if (!headers.Authorization) return null;
      const r = await fetch(`${API}/api/onboarding/state`, { headers });
      if (!r.ok) return null;
      cached = await r.json();
      notify();
      return cached;
    } catch { return null; }
  }

  async function recordEvent(event, delta) {
    // idempotency for one-shot events per page load
    const singletons = ['shopify_connect_success', 'catalog_scan_complete', 'first_value_reached'];
    if (singletons.includes(event) && sentEvents.has(event)) return;
    sentEvents.add(event);

    // GA4 + backend track
    try { global.MS?.track?.(event, delta); } catch { /* noop */ }

    try {
      const headers = await authHeadersSafe();
      if (!headers.Authorization) return;
      await fetch(`${API}/api/onboarding/event`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ event, delta }),
      });
      // refresh state (fire-and-forget)
      fetchState();
    } catch { /* silent */ }
  }

  function subscribe(fn) {
    listeners.add(fn);
    if (cached) { try { fn(cached); } catch (_) {} }
    return () => listeners.delete(fn);
  }

  function get() { return cached; }

  // ── Contextual upgrade modal ───────────────────────────────────────
  function t(key, fallback) {
    try {
      const v = global.i18n?.t?.(key);
      if (v && v !== key) return v;
    } catch (_) {}
    return fallback;
  }

  const TRIGGER_KEYS = ['bulk_scan', 'recommendations_limit', 'bulk_edit', 'auto_sync', 'scan_limit'];
  function buildTrigger(key) {
    const feats = ['f1', 'f2', 'f3', 'f4']
      .map(fk => t(`upgrade.${key}.${fk}`, null))
      .filter(v => v && !v.startsWith('upgrade.'));
    return {
      title: t(`upgrade.${key}.title`, key),
      body: t(`upgrade.${key}.body`, ''),
      features: feats,
    };
  }
  const TRIGGERS = new Proxy({}, {
    get: (_, key) => TRIGGER_KEYS.includes(key) ? buildTrigger(key) : buildTrigger('recommendations_limit'),
  });

  function ensureUpgradeStyles() {
    if (document.getElementById('ms-upgrade-styles')) return;
    const s = document.createElement('style');
    s.id = 'ms-upgrade-styles';
    s.textContent = `
      .ms-upg-overlay { position:fixed;inset:0;background:rgba(15,23,42,0.55);z-index:9999;display:flex;align-items:center;justify-content:center;padding:20px;backdrop-filter:blur(3px); }
      .ms-upg-card { background:#fff;border-radius:16px;max-width:480px;width:100%;padding:28px;box-shadow:0 20px 60px rgba(0,0,0,0.25);font-family:'Inter',sans-serif; }
      .ms-upg-title { font-size:20px;font-weight:700;margin:0 0 8px;color:#0f172a; }
      .ms-upg-body { font-size:14px;color:#475569;line-height:1.55;margin:0 0 16px; }
      .ms-upg-feats { list-style:none;padding:0;margin:0 0 20px;display:flex;flex-direction:column;gap:6px; }
      .ms-upg-feats li { font-size:13.5px;color:#0f172a;padding-left:22px;position:relative; }
      .ms-upg-feats li::before { content:'✓';position:absolute;left:0;color:#059669;font-weight:700; }
      .ms-upg-ctas { display:flex;flex-direction:column;gap:8px; }
      .ms-upg-btn-primary { background:#059669;color:#fff;border:none;padding:12px 18px;border-radius:10px;font-weight:600;font-size:14px;cursor:pointer; }
      .ms-upg-btn-secondary { background:transparent;color:#475569;border:1px solid #cbd5e1;padding:12px 18px;border-radius:10px;font-weight:600;font-size:14px;cursor:pointer; }
      .ms-upg-close { position:absolute;top:14px;right:16px;background:transparent;border:none;font-size:22px;color:#64748b;cursor:pointer;line-height:1; }
      .ms-demo-badge { display:inline-block;font-size:10.5px;font-weight:700;padding:2px 8px;border-radius:999px;background:#fef3c7;color:#92400e;letter-spacing:0.02em;text-transform:uppercase; }
      .ms-trial-badge { display:inline-flex;align-items:center;gap:4px;font-size:11px;font-weight:600;padding:3px 8px;border-radius:999px;background:#dcfce7;color:#065f46; }
    `;
    document.head.appendChild(s);
  }

  function openUpgrade(opts) {
    const { trigger, intent, returnAction } = opts || {};
    const cfg = TRIGGERS[trigger] || TRIGGERS.recommendations_limit;
    ensureUpgradeStyles();

    // remember intent for post-purchase return
    if (intent || returnAction) {
      try {
        sessionStorage.setItem('pending_intent', JSON.stringify({ intent, returnAction, trigger, ts: Date.now() }));
      } catch (_) {}
    }

    global.MS?.track?.('upgrade_prompt_view', { trigger });

    const overlay = document.createElement('div');
    overlay.className = 'ms-upg-overlay';
    overlay.innerHTML = `
      <div class="ms-upg-card" style="position:relative">
        <button class="ms-upg-close" aria-label="Kapat">×</button>
        <h3 class="ms-upg-title">${cfg.title}</h3>
        <p class="ms-upg-body">${cfg.body}</p>
        <ul class="ms-upg-feats">${cfg.features.map(f => `<li>${f}</li>`).join('')}</ul>
        <div class="ms-upg-ctas">
          <button class="ms-upg-btn-primary" data-act="trial">${t('upgrade.trial_cta', "7 Gün Pro'yu Ücretsiz Dene")}</button>
          <button class="ms-upg-btn-secondary" data-act="compare">${t('upgrade.compare_cta', 'Planları Karşılaştır')}</button>
        </div>
        <p style="font-size:11px;color:#94a3b8;text-align:center;margin:12px 0 0;">${t('upgrade.footer_note', 'Deneme sonunda otomatik ücretlendirme. İstediğin an iptal edebilirsin.')}</p>
      </div>
    `;
    document.body.appendChild(overlay);

    const close = () => { try { document.body.removeChild(overlay); } catch (_) {} };
    overlay.addEventListener('click', (e) => { if (e.target === overlay) close(); });
    overlay.querySelector('.ms-upg-close').addEventListener('click', close);
    overlay.querySelector('[data-act="trial"]').addEventListener('click', () => {
      global.MS?.track?.('upgrade_click', { trigger, target: 'trial' });
      close();
      if (typeof global.startCheckout === 'function') {
        global.startCheckout('pro', 'monthly', { trial: true, intent });
      } else {
        window.location.href = `/pricing?intent=${encodeURIComponent(intent || trigger)}&trial=1`;
      }
    });
    overlay.querySelector('[data-act="compare"]').addEventListener('click', () => {
      global.MS?.track?.('upgrade_click', { trigger, target: 'pricing' });
      close();
      window.location.href = `/pricing?intent=${encodeURIComponent(intent || trigger)}`;
    });
  }

  // Auto-init on load if authed
  function init() {
    fetchState();
    // Consume post-checkout return
    try {
      const url = new URL(window.location.href);
      if (url.searchParams.get('checkout') === 'success') {
        const raw = sessionStorage.getItem('pending_intent');
        if (raw) {
          const p = JSON.parse(raw);
          sessionStorage.removeItem('pending_intent');
          if (p?.returnAction && typeof global[p.returnAction] === 'function') {
            setTimeout(() => { try { global[p.returnAction](); } catch (_) {} }, 500);
          }
        }
        global.MS?.track?.('subscription_activated', {});
      }
    } catch (_) { /* noop */ }
  }

  global.MS = global.MS || {};
  global.MS.onboarding = { fetchState, recordEvent, subscribe, get, openUpgrade, init, TRIGGERS };

  if (typeof document !== 'undefined') {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', init);
    } else {
      setTimeout(init, 0);
    }
  }
})(typeof window !== 'undefined' ? window : globalThis);
