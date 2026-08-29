/**
 * Mocksheets central state store.
 * Slices: connection, mode, data, plan, sync, chat.
 * Consumers subscribe; DOM re-renders via [data-bind] atributes in render loop.
 */
(function (global) {
  'use strict';

  const CONNECTION = {
    NOT_CONNECTED: 'not_connected',
    CONNECTING: 'connecting',
    CONNECTED: 'connected',
    SYNCING: 'syncing',
    SUCCESS: 'success',
    AUTH_ERROR: 'auth_error',
    NETWORK_ERROR: 'network_error',
  };

  const MODE = {
    LIVE: 'live',
    DEMO: 'demo',
    LOADING: 'loading',
    EMPTY: 'empty',
    ERROR: 'error',
  };

  const initial = {
    connection: CONNECTION.NOT_CONNECTED,
    mode: MODE.LOADING,
    data: {
      products: null,
      visitors: null,
      sales: null,
      revenue: null,
      healthTrend: [],
      catalog: { issues: 0, affectedProducts: 0, items: [] },
      sources: { organic: 0, direct: 0, other: 0 },
    },
    plan: { loaded: false, tier: null, displayName: 'Mocksheets' },
    sync: { lastSuccess: null, nextRun: null, lastError: null, inFlight: false },
    chat: { state: 'idle', lastError: null },
    integrations: { googleSheets: false, googleDrive: false, gmail: false, notion: false, slack: false },
    retryCounts: {},
  };

  let state = deepClone(initial);
  const listeners = new Set();

  function deepClone(obj) {
    return JSON.parse(JSON.stringify(obj));
  }

  function get() {
    return state;
  }

  function set(patch) {
    state = mergeDeep(state, patch);
    notify();
  }

  function mergeDeep(target, source) {
    const out = Array.isArray(target) ? target.slice() : { ...target };
    for (const key of Object.keys(source || {})) {
      const val = source[key];
      if (val && typeof val === 'object' && !Array.isArray(val) && target[key] && typeof target[key] === 'object' && !Array.isArray(target[key])) {
        out[key] = mergeDeep(target[key], val);
      } else {
        out[key] = val;
      }
    }
    return out;
  }

  function subscribe(fn) {
    listeners.add(fn);
    try { fn(state); } catch (_) {}
    return () => listeners.delete(fn);
  }

  function notify() {
    listeners.forEach((fn) => {
      try { fn(state); } catch (e) { console.error('[state] listener error', e); }
    });
  }

  function reset() {
    state = deepClone(initial);
    notify();
  }

  function incRetry(key) {
    const n = (state.retryCounts[key] || 0) + 1;
    set({ retryCounts: { ...state.retryCounts, [key]: n } });
    return n;
  }

  function clearRetry(key) {
    const rc = { ...state.retryCounts };
    delete rc[key];
    set({ retryCounts: rc });
  }

  global.MS = global.MS || {};
  global.MS.state = { get, set, subscribe, reset, incRetry, clearRetry, CONNECTION, MODE };
})(typeof window !== 'undefined' ? window : globalThis);
