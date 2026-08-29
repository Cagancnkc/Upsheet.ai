/**
 * MS.track(event, params) — GA4 + backend event pipe.
 * No PII: strip email/token/message keys before sending.
 */
(function (global) {
  'use strict';

  const API = (typeof window !== 'undefined' && window.location.hostname === 'localhost')
    ? 'http://localhost:3001'
    : 'https://upsheet-ai.onrender.com';

  const PII_KEYS = /email|token|secret|password|message|user_input|prompt/i;

  function sanitize(params) {
    if (!params || typeof params !== 'object') return {};
    const out = {};
    for (const k of Object.keys(params)) {
      if (PII_KEYS.test(k)) continue;
      const v = params[k];
      if (v == null) continue;
      if (typeof v === 'string') {
        if (v.length > 200 || v.includes('@')) continue;
        out[k] = v;
      } else if (typeof v === 'number' || typeof v === 'boolean') {
        out[k] = v;
      } else {
        // avoid nested PII
        try { out[k] = String(v).slice(0, 200); } catch { /* ignore */ }
      }
    }
    return out;
  }

  async function authHeadersSafe() {
    try {
      if (typeof authHeaders === 'function') return await authHeaders();
    } catch { /* noop */ }
    try {
      const tok = localStorage.getItem('mocksheets_token') || localStorage.getItem('sb-access-token');
      return tok ? { Authorization: `Bearer ${tok}`, 'Content-Type': 'application/json' } : { 'Content-Type': 'application/json' };
    } catch {
      return { 'Content-Type': 'application/json' };
    }
  }

  function track(event, params) {
    const safe = sanitize(params);
    // 1) GA4 gtag if present
    try {
      if (typeof gtag === 'function') gtag('event', event, safe);
    } catch { /* noop */ }
    // 2) Backend fallback (best effort, no blocking)
    (async () => {
      try {
        const headers = await authHeadersSafe();
        if (!headers.Authorization) return; // anonymous: rely on GA only
        await fetch(`${API}/api/onboarding/track`, {
          method: 'POST',
          headers,
          body: JSON.stringify({ event, params: safe }),
          keepalive: true,
        });
      } catch { /* silent */ }
    })();
  }

  global.MS = global.MS || {};
  global.MS.track = track;
})(typeof window !== 'undefined' ? window : globalThis);
