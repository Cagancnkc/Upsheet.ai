'use strict';
const express = require('express');
const { createClient } = require('@supabase/supabase-js');
const { checkLimit } = require('../middleware/limits');

const router = express.Router();

let _sb = null;
function sb() {
  if (!_sb) _sb = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);
  return _sb;
}

const VALID_STEPS = ['welcome', 'store_connected', 'scan_complete', 'first_value', 'activated'];
const VALID_EVENTS = [
  'onboarding_started',
  'shopify_connect_success',
  'catalog_scan_complete',
  'recommendation_view',
  'recommendation_apply',
  'first_value_reached',
  'dismissed',
];

async function getOrCreate(userId) {
  const { data, error } = await sb()
    .from('user_onboarding')
    .select('*')
    .eq('user_id', userId)
    .maybeSingle();
  if (data) return data;
  const { data: created } = await sb()
    .from('user_onboarding')
    .insert({ user_id: userId, current_step: 'welcome' })
    .select()
    .single();
  return created;
}

function buildTrialInfo(usage) {
  const trialEndsAt = usage?.trial_ends_at ? new Date(usage.trial_ends_at) : null;
  const now = Date.now();
  if (trialEndsAt && trialEndsAt.getTime() > now) {
    return {
      status: 'active',
      startedAt: usage.trial_started_at,
      endsAt: usage.trial_ends_at,
      daysLeft: Math.max(0, Math.ceil((trialEndsAt.getTime() - now) / 86400000)),
    };
  }
  if (usage?.trial_used) return { status: 'expired' };
  return { status: 'eligible' };
}

router.get('/state', checkLimit, async (req, res) => {
  try {
    const userId = req.user.id;
    const onboarding = await getOrCreate(userId);
    const usage = req.usage || {};

    // storeStatus derived from shopify_connections
    let storeStatus = 'not_connected';
    let storeName = null;
    try {
      const { data: conn } = await sb()
        .from('shopify_connections')
        .select('shop_name, shop_domain, last_sync')
        .eq('user_id', userId)
        .maybeSingle();
      if (conn) {
        storeStatus = conn.last_sync ? 'connected' : 'connected';
        storeName = conn.shop_name || conn.shop_domain;
      }
    } catch (_) {}

    res.json({
      step: onboarding.current_step,
      counters: {
        scannedProducts: onboarding.scanned_products || 0,
        recommendationsViewed: onboarding.recommendations_viewed || 0,
        recommendationsApplied: onboarding.recommendations_applied || 0,
      },
      storeStatus,
      storeName,
      dataMode: storeStatus === 'connected' ? 'live' : 'empty',
      plan: usage.plan || 'free',
      trial: buildTrialInfo(usage),
      dismissedAt: onboarding.dismissed_at,
      timestamps: {
        storeConnectedAt: onboarding.store_connected_at,
        firstScanAt: onboarding.first_scan_at,
        firstValueAt: onboarding.first_value_at,
      },
    });
  } catch (e) {
    console.error('[onboarding/state] error', e.message);
    res.status(500).json({ error: 'internal_error' });
  }
});

// PATCH /event  — idempotent step advancement based on user event
router.post('/event', checkLimit, async (req, res) => {
  try {
    const userId = req.user.id;
    const { event, delta } = req.body || {};
    if (!VALID_EVENTS.includes(event)) {
      return res.status(400).json({ error: 'invalid_event' });
    }
    const cur = await getOrCreate(userId);
    const updates = { updated_at: new Date().toISOString() };
    const now = new Date().toISOString();
    const stepOrder = { welcome: 0, store_connected: 1, scan_complete: 2, first_value: 3, activated: 4 };
    const advance = (target) => {
      if ((stepOrder[cur.current_step] ?? 0) < stepOrder[target]) updates.current_step = target;
    };

    switch (event) {
      case 'onboarding_started':
        advance('welcome');
        break;
      case 'shopify_connect_success':
        if (!cur.store_connected_at) updates.store_connected_at = now;
        advance('store_connected');
        break;
      case 'catalog_scan_complete':
        if (!cur.first_scan_at) updates.first_scan_at = now;
        if (delta && typeof delta.scannedProducts === 'number') {
          updates.scanned_products = (cur.scanned_products || 0) + delta.scannedProducts;
        }
        advance('scan_complete');
        break;
      case 'recommendation_view':
        updates.recommendations_viewed = (cur.recommendations_viewed || 0) + (delta?.count || 1);
        break;
      case 'recommendation_apply':
        updates.recommendations_applied = (cur.recommendations_applied || 0) + 1;
        break;
      case 'first_value_reached':
        if (!cur.first_value_at) updates.first_value_at = now;
        advance('first_value');
        break;
      case 'dismissed':
        updates.dismissed_at = now;
        break;
    }

    await sb().from('user_onboarding').update(updates).eq('user_id', userId);
    res.json({ ok: true });
  } catch (e) {
    console.error('[onboarding/event] error', e.message);
    res.status(500).json({ error: 'internal_error' });
  }
});

// Lightweight analytics ingest (no PII allowed)
router.post('/track', checkLimit, async (req, res) => {
  try {
    const { event, params } = req.body || {};
    if (!event || typeof event !== 'string') return res.status(400).json({ error: 'invalid_event' });
    // Strip anything that looks like PII defensively
    const safe = {};
    for (const k of Object.keys(params || {})) {
      const v = params[k];
      if (v == null) continue;
      if (typeof v === 'string' && (v.includes('@') || v.length > 200)) continue;
      if (/token|password|secret|email/i.test(k)) continue;
      safe[k] = v;
    }
    // Best-effort insert into analytics_events if table exists
    try {
      await sb().from('analytics_events').insert({
        event_type: event,
        user_id: req.user.id,
        payload: safe,
        created_at: new Date().toISOString(),
      });
    } catch (_) {
      // table may have different columns — silent fallback
    }
    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ error: 'internal_error' });
  }
});

module.exports = router;
