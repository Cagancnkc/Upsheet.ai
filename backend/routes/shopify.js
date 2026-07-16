'use strict';
const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const { createClient } = require('@supabase/supabase-js');
const { encrypt, decrypt } = require('../services/encryption');

let _supabase = null;
function getSupabase() {
  if (!_supabase) {
    _supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);
  }
  return _supabase;
}

// CSRF state nonces — file-scope Map, tek instance için yeterli
const pendingStates = new Map();

// Eski nonce'ları temizle (10 dk sonra expire)
setInterval(() => {
  const cutoff = Date.now() - 10 * 60 * 1000;
  for (const [key, val] of pendingStates) {
    if (val.createdAt < cutoff) pendingStates.delete(key);
  }
}, 5 * 60 * 1000);

async function requireAuth(req, res, next) {
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ error: 'Giriş gerekli' });
  const { data: { user }, error } = await getSupabase().auth.getUser(token);
  if (error || !user) return res.status(401).json({ error: 'Geçersiz token' });
  req.user = user;
  next();
}

// ─── GET /api/shopify/auth ────────────────────────────────────────────────────
router.get('/auth', (req, res) => {
  const { shop } = req.query;
  if (!shop) return res.status(400).send('<p>shop parametresi eksik</p>');

  const clientId = process.env.SHOPIFY_CLIENT_ID;
  if (!clientId) return res.status(500).send('<p>Shopify OAuth yapılandırılmamış</p>');

  const nonce = crypto.randomUUID();
  pendingStates.set(nonce, { shop, createdAt: Date.now() });

  const base = process.env.BACKEND_URL || `http://localhost:${process.env.PORT || 3001}`;
  const redirectUri = encodeURIComponent(`${base}/api/shopify/callback`);
  const scopes = encodeURIComponent(
    process.env.SHOPIFY_SCOPES || 'read_orders,read_products,read_customers,read_inventory'
  );

  res.redirect(
    `https://${shop}/admin/oauth/authorize` +
    `?client_id=${clientId}` +
    `&scope=${scopes}` +
    `&redirect_uri=${redirectUri}` +
    `&state=${nonce}`
  );
});

// ─── GET /api/shopify/callback ────────────────────────────────────────────────
router.get('/callback', async (req, res) => {
  const frontend = process.env.FRONTEND_URL || 'https://mocksheets.com';
  const { code, shop, state } = req.query;

  try {
    // 1. CSRF kontrolü
    if (!state || !pendingStates.has(state)) {
      return res.redirect(`${frontend}/auth.html?shopify_error=true`);
    }
    pendingStates.delete(state);

    if (!code || !shop) {
      return res.redirect(`${frontend}/auth.html?shopify_error=true`);
    }

    // 2. Access token al
    const tokenResp = await fetch(`https://${shop}/admin/oauth/access_token`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        client_id: process.env.SHOPIFY_CLIENT_ID,
        client_secret: process.env.SHOPIFY_CLIENT_SECRET,
        code,
      }),
    });
    const tokenData = await tokenResp.json();
    if (!tokenData.access_token) {
      return res.redirect(`${frontend}/auth.html?shopify_error=true`);
    }

    // 3. Mağaza bilgisini çek
    const shopResp = await fetch(`https://${shop}/admin/api/2024-01/shop.json`, {
      headers: { 'X-Shopify-Access-Token': tokenData.access_token },
    });
    const shopData = await shopResp.json();
    const shopInfo = shopData.shop || {};
    const email = shopInfo.email;
    const shopName = shopInfo.name || shop;

    if (!email) {
      return res.redirect(`${frontend}/auth.html?shopify_error=true`);
    }

    const sb = getSupabase();

    // 4. Kullanıcıyı bul veya oluştur
    let userId;
    const lookupResp = await fetch(
      `${process.env.SUPABASE_URL}/auth/v1/admin/users?email=${encodeURIComponent(email)}&page=1&per_page=1`,
      {
        headers: {
          apikey: process.env.SUPABASE_SERVICE_KEY,
          Authorization: `Bearer ${process.env.SUPABASE_SERVICE_KEY}`,
        },
      }
    );
    const lookupData = await lookupResp.json();
    const existingUser = lookupData.users?.[0];

    if (existingUser) {
      userId = existingUser.id;
    } else {
      const { data: newUser, error: createErr } = await sb.auth.admin.createUser({
        email,
        email_confirm: true,
        user_metadata: { full_name: shopName, shopify_shop: shop },
      });
      if (createErr || !newUser?.user) {
        return res.redirect(`${frontend}/auth.html?shopify_error=true`);
      }
      userId = newUser.user.id;
    }

    // 5. shopify_connections tablosuna kaydet
    await sb.from('shopify_connections').upsert(
      {
        user_id: userId,
        shop_domain: shop,
        shop_name: shopName,
        access_token: encrypt(tokenData.access_token),
        scope: tokenData.scope || '',
        shop_meta: {
          email: shopInfo.email,
          currency: shopInfo.currency,
          country: shopInfo.country,
          plan_name: shopInfo.plan_name,
        },
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'user_id' }
    );

    // 6. Magic link üret → Supabase session kurar, app.html'e yönlendirir
    const { data: linkData, error: linkErr } = await sb.auth.admin.generateLink({
      type: 'magiclink',
      email,
      options: {
        redirectTo: `${frontend}/app.html?shopify=connected`,
      },
    });

    if (linkErr || !linkData?.properties?.action_link) {
      return res.redirect(`${frontend}/auth.html?shopify_error=true`);
    }

    res.redirect(linkData.properties.action_link);
  } catch (err) {
    console.error('[shopify callback]', err.message);
    res.redirect(`${frontend}/auth.html?shopify_error=true`);
  }
});

// ─── GET /api/shopify/status ──────────────────────────────────────────────────
router.get('/status', requireAuth, async (req, res) => {
  const { data } = await getSupabase()
    .from('shopify_connections')
    .select('shop_domain, shop_name, last_sync')
    .eq('user_id', req.user.id)
    .single();

  res.json(
    data
      ? { connected: true, shop_domain: data.shop_domain, shop_name: data.shop_name, last_sync: data.last_sync }
      : { connected: false }
  );
});

// ─── GET /api/shopify/data ────────────────────────────────────────────────────
const DATA_ENDPOINTS = {
  orders:          (shop) => `https://${shop}/admin/api/2024-01/orders.json?limit=250&status=any`,
  products:        (shop) => `https://${shop}/admin/api/2024-01/products.json?limit=250`,
  customers:       (shop) => `https://${shop}/admin/api/2024-01/customers.json?limit=250`,
  abandoned_carts: (shop) => `https://${shop}/admin/api/2024-01/checkouts.json?limit=250`,
};

router.get('/data', requireAuth, async (req, res) => {
  const { type } = req.query;
  if (!type || !DATA_ENDPOINTS[type]) {
    return res.status(400).json({ error: 'Geçersiz type. Kabul edilenler: orders, products, customers, abandoned_carts' });
  }

  const { data: conn, error: connErr } = await getSupabase()
    .from('shopify_connections')
    .select('shop_domain, access_token')
    .eq('user_id', req.user.id)
    .single();

  if (connErr || !conn) return res.status(404).json({ error: 'Shopify bağlantısı bulunamadı' });

  const accessToken = decrypt(conn.access_token);
  if (!accessToken) return res.status(500).json({ error: 'Token çözümlenemedi' });

  const url = DATA_ENDPOINTS[type](conn.shop_domain);
  const shopResp = await fetch(url, {
    headers: { 'X-Shopify-Access-Token': accessToken },
  });
  const shopData = await shopResp.json();
  res.json(shopData);
});

// ─── GET /api/shopify/sync ────────────────────────────────────────────────────
router.get('/sync', requireAuth, async (req, res) => {
  const { data: conn, error: connErr } = await getSupabase()
    .from('shopify_connections')
    .select('shop_domain, access_token')
    .eq('user_id', req.user.id)
    .single();

  if (connErr || !conn) return res.status(404).json({ error: 'Shopify bağlantısı bulunamadı' });

  const accessToken = decrypt(conn.access_token);
  if (!accessToken) return res.status(500).json({ error: 'Token çözümlenemedi' });

  const headers = { 'X-Shopify-Access-Token': accessToken };
  const shop = conn.shop_domain;

  try {
    const [pResp, oResp] = await Promise.all([
      fetch(`https://${shop}/admin/api/2024-01/products.json?limit=250`, { headers }),
      fetch(`https://${shop}/admin/api/2024-01/orders.json?limit=250&status=any`, { headers }),
    ]);
    const [pJson, oJson] = await Promise.all([pResp.json(), oResp.json()]);

    const productRows = [];
    for (const p of (pJson.products || [])) {
      for (const v of (p.variants || [])) {
        productRows.push({
          shopify_product_id: p.id,
          shopify_variant_id: v.id,
          handle: p.handle || '',
          title: p.title || '',
          body_html: p.body_html || '',
          vendor: p.vendor || '',
          product_type: p.product_type || '',
          tags: p.tags || '',
          status: p.status || 'active',
          sku: v.sku || '',
          variant_title: v.title !== 'Default Title' ? v.title : '',
          price: v.price || '',
          compare_at_price: v.compare_at_price || '',
          inventory_quantity: v.inventory_quantity ?? 0,
          image: (p.images?.[0]?.src) || '',
          created_at: (p.created_at || '').slice(0, 10),
        });
      }
    }

    const orderRows = (oJson.orders || []).map(o => ({
      name: o.name || '',
      customer: (o.customer ? `${o.customer.first_name || ''} ${o.customer.last_name || ''}`.trim() : '') || o.email || '',
      total_price: o.total_price || '',
      financial_status: o.financial_status || '',
      fulfillment_status: o.fulfillment_status || 'unfulfilled',
      created_at: (o.created_at || '').slice(0, 10),
      line_items_count: (o.line_items || []).length,
    }));

    // Update last_sync in shopify_connections
    await getSupabase()
      .from('shopify_connections')
      .update({ last_sync: new Date().toISOString() })
      .eq('user_id', req.user.id);

    res.json({
      products: productRows,
      orders: orderRows,
      variants: [],
      collections: [],
      inventory: [],
    });
  } catch (err) {
    console.error('[shopify sync]', err.message);
    res.status(502).json({ error: 'Shopify verisi alınamadı' });
  }
});

// ─── POST /api/shopify/push ────────────────────────────────────────────────
router.post('/push', requireAuth, async (req, res) => {
  const { data: conn, error: connErr } = await getSupabase()
    .from('shopify_connections')
    .select('shop_domain, access_token')
    .eq('user_id', req.user.id)
    .single();

  if (connErr || !conn) return res.status(404).json({ error: 'Shopify bağlantısı bulunamadı' });

  const accessToken = decrypt(conn.access_token);
  if (!accessToken) return res.status(500).json({ error: 'Token çözümlenemedi' });

  const products = req.body.products || [];
  const headers = { 'X-Shopify-Access-Token': accessToken };
  const shop = conn.shop_domain;
  let pushed = 0, skipped = 0, errors = [];

  try {
    for (const p of products) {
      if (!p.shopify_product_id) { skipped++; continue; }

      // Update product
      const productUpdate = await fetch(`https://${shop}/admin/api/2024-01/products/${p.shopify_product_id}.json`, {
        method: 'PUT',
        headers: { ...headers, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          product: {
            title: p.title,
            body_html: p.body_html,
            vendor: p.vendor,
            product_type: p.product_type,
            tags: p.tags,
            status: p.status,
          }
        })
      });

      if (!productUpdate.ok) {
        errors.push(`Product ${p.shopify_product_id}: ${productUpdate.statusText}`);
        continue;
      }

      // Update variant price if exists
      if (p.shopify_variant_id && p.price) {
        await fetch(`https://${shop}/admin/api/2024-01/variants/${p.shopify_variant_id}.json`, {
          method: 'PUT',
          headers: { ...headers, 'Content-Type': 'application/json' },
          body: JSON.stringify({
            variant: {
              price: p.price,
              compare_at_price: p.compare_at_price || null,
            }
          })
        });
      }

      pushed++;
    }

    // Update last_sync
    await getSupabase()
      .from('shopify_connections')
      .update({ last_sync: new Date().toISOString() })
      .eq('user_id', req.user.id);

    res.json({ pushed, skipped, errors: errors.length > 0 ? errors : undefined });
  } catch (err) {
    console.error('[shopify push]', err.message);
    res.status(502).json({ error: 'Shopify push başarısız' });
  }
});

// ─── DELETE /api/shopify/disconnect ──────────────────────────────────────────
router.delete('/disconnect', requireAuth, async (req, res) => {
  const { error } = await getSupabase()
    .from('shopify_connections')
    .delete()
    .eq('user_id', req.user.id);

  if (error) return res.status(500).json({ error: 'Bağlantı silinemedi' });
  res.json({ disconnected: true });
});

module.exports = router;
