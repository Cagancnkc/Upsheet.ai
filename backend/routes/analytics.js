'use strict';
const express = require('express');
const router = express.Router();
const { createClient } = require('@supabase/supabase-js');

function getSupabase() {
  return createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);
}

// Auth middleware — extracts JWT and verifies with Supabase
async function requireAuth(req, res, next) {
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ error: 'Token gerekli' });

  const sb = getSupabase();
  const { data: { user }, error } = await sb.auth.getUser(token);
  if (error || !user) return res.status(401).json({ error: 'Geçersiz token' });

  req.user = user;
  next();
}

// In-memory rate limit — prevent duplicate events within 500ms
const rateLimitMap = new Map();
function checkRateLimit(sessionId, eventType) {
  const key = `${sessionId}:${eventType}`;
  const now = Date.now();
  const lastTime = rateLimitMap.get(key);
  if (lastTime && now - lastTime < 500) {
    return false;
  }
  rateLimitMap.set(key, now);
  return true;
}

// POST /track — public, logs visitor events
router.post('/track', async (req, res) => {
  const { shop_domain, event_type, page_url, element_id, product_id, scroll_depth, session_id, order_total, duration_seconds } = req.body;

  // Validate
  if (!shop_domain || !event_type) return res.status(400).json({ error: 'shop_domain ve event_type gerekli' });
  if (!['page_view', 'click', 'scroll', 'add_to_cart', 'purchase', 'session_duration'].includes(event_type)) {
    return res.status(400).json({ error: 'Geçersiz event_type' });
  }
  if (!session_id) return res.status(400).json({ error: 'session_id gerekli' });

  // Rate limit
  if (!checkRateLimit(session_id, event_type)) {
    return res.status(204).send();
  }

  const sb = getSupabase();

  // Check if tracking is enabled for this shop
  const { data: conn } = await sb
    .from('shopify_connections')
    .select('id')
    .eq('shop_domain', shop_domain)
    .eq('tracking_enabled', true)
    .single();

  if (!conn) {
    return res.status(204).send();
  }

  // Insert event
  const { error } = await sb.from('analytics_events').insert({
    shop_domain, event_type, page_url, element_id,
    product_id, scroll_depth, session_id, order_total, duration_seconds,
  });

  if (error) {
    console.error('Analytics event insert failed:', error);
    return res.status(204).send();
  }

  res.status(204).send();
});

// GET /summary — requires auth, aggregates analytics for user's shop
router.get('/summary', requireAuth, async (req, res) => {
  const days = parseInt(req.query.days || '7', 10);
  const sb = getSupabase();

  // Get user's shopify connection to get shop_domain
  const { data: conn } = await sb
    .from('shopify_connections')
    .select('shop_domain')
    .eq('user_id', req.user.id)
    .single();

  if (!conn) {
    return res.json({
      total_visits: 0, total_clicks: 0, total_cart: 0, avg_scroll_depth: 0, top_products: [],
      unique_visitors: 0, bounce_rate: 0, total_purchases: 0, conversion_rate: 0, total_revenue: 0,
      avg_session_duration: 0, cart_abandonment_rate: 0, top_abandoned_products: [],
    });
  }

  const cutoffDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString();

  // Aggregate events
  const { data: events } = await sb
    .from('analytics_events')
    .select('event_type, product_id, scroll_depth, session_id, order_total, duration_seconds')
    .eq('shop_domain', conn.shop_domain)
    .gt('created_at', cutoffDate);

  if (!events || !events.length) {
    return res.json({
      total_visits: 0, total_clicks: 0, total_cart: 0, avg_scroll_depth: 0, top_products: [],
      unique_visitors: 0, bounce_rate: 0, total_purchases: 0, conversion_rate: 0, total_revenue: 0,
      avg_session_duration: 0, cart_abandonment_rate: 0, top_abandoned_products: [],
    });
  }

  // Aggregate
  let total_visits = 0, total_clicks = 0, total_cart = 0, total_scroll = 0;
  let duration_sum = 0, duration_count = 0;
  const productMap = new Map();
  const allSessions = new Set();
  const pageViewsBySession = {};
  let total_purchases = 0;
  let total_revenue = 0;

  for (const evt of events) {
    if (evt.session_id) allSessions.add(evt.session_id);
    if (evt.event_type === 'page_view') {
      total_visits++;
      if (evt.session_id) {
        pageViewsBySession[evt.session_id] = (pageViewsBySession[evt.session_id] || 0) + 1;
      }
    }
    if (evt.event_type === 'click') {
      total_clicks++;
      if (evt.product_id) productMap.set(evt.product_id, (productMap.get(evt.product_id) || 0) + 1);
    }
    if (evt.event_type === 'add_to_cart') total_cart++;
    if (evt.event_type === 'purchase') {
      total_purchases++;
      total_revenue += parseFloat(evt.order_total) || 0;
    }
    if (evt.scroll_depth != null) total_scroll += evt.scroll_depth;
    if (evt.event_type === 'session_duration' && evt.duration_seconds) {
      duration_sum += evt.duration_seconds;
      duration_count++;
    }
  }

  const unique_visitors = allSessions.size;

  const avg_session_duration = duration_count > 0
    ? Math.round(duration_sum / duration_count)
    : 0;

  const cartSessions = new Set(
    events.filter(e => e.event_type === 'add_to_cart' && e.session_id).map(e => e.session_id)
  );
  const purchaseSessions = new Set(
    events.filter(e => e.event_type === 'purchase' && e.session_id).map(e => e.session_id)
  );
  const abandonedSessions = [...cartSessions].filter(sid => !purchaseSessions.has(sid));
  const cart_abandonment_rate = cartSessions.size > 0
    ? Math.round((abandonedSessions.length / cartSessions.size) * 100)
    : 0;

  const abandonedByProduct = {};
  events
    .filter(e => e.event_type === 'add_to_cart' && e.product_id && abandonedSessions.includes(e.session_id))
    .forEach(e => {
      abandonedByProduct[e.product_id] = (abandonedByProduct[e.product_id] || 0) + 1;
    });
  const top_abandoned_products = Object.entries(abandonedByProduct)
    .sort((a, b) => b[1] - a[1]).slice(0, 5)
    .map(([product_id, count]) => ({ product_id, count }));

  const sessionsWithPageView = Object.keys(pageViewsBySession).length;
  const singlePageSessions = Object.values(pageViewsBySession).filter(n => n === 1).length;
  const bounce_rate = sessionsWithPageView > 0
    ? Math.round((singlePageSessions / sessionsWithPageView) * 100) : 0;

  const conversion_rate = unique_visitors > 0
    ? Math.round((total_purchases / unique_visitors) * 1000) / 10 : 0;

  const avg_scroll_depth = events.filter(e => e.scroll_depth != null).length > 0
    ? Math.round(total_scroll / events.filter(e => e.scroll_depth != null).length) : 0;

  const top_products = Array.from(productMap.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([product_id, count]) => ({ product_id, count }));

  res.json({
    total_visits, total_clicks, total_cart, avg_scroll_depth, top_products,
    unique_visitors, bounce_rate,
    total_purchases, conversion_rate,
    total_revenue: Math.round(total_revenue),
    avg_session_duration,
    cart_abandonment_rate,
    top_abandoned_products,
  });
});

// GET /tracking-status — requires auth, returns tracking state
router.get('/tracking-status', requireAuth, async (req, res) => {
  const sb = getSupabase();
  const { data: conn } = await sb
    .from('shopify_connections')
    .select('tracking_enabled, tracking_script_id')
    .eq('user_id', req.user.id)
    .single();

  if (!conn) {
    return res.json({ tracking_enabled: false, tracking_script_id: null });
  }

  res.json({
    tracking_enabled: conn.tracking_enabled || false,
    tracking_script_id: conn.tracking_script_id || null
  });
});

module.exports = router;
