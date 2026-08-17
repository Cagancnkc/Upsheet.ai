'use strict';
const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const Anthropic = require('@anthropic-ai/sdk');
const { createClient } = require('@supabase/supabase-js');
const { encrypt, decrypt } = require('../services/encryption');
const { checkLimit, incrementUsage } = require('../middleware/limits');
const { indexProductsForRAG, INDEX_THRESHOLD } = require('../services/productIndexer');
const { createNotification } = require('../services/notificationGenerator');

async function fetchAllPages(url, headers, maxPages = 20) {
  const results = [];
  let nextUrl = url;
  let page = 0;
  while (nextUrl && page < maxPages) {
    const res = await fetch(nextUrl, { headers });
    if (!res.ok) break;
    const data = await res.json();
    const key = Object.keys(data)[0];
    results.push(...(data[key] || []));
    const link = res.headers.get('link') || res.headers.get('Link');
    const nextMatch = link && link.match(/<([^>]+)>;\s*rel="next"/);
    nextUrl = nextMatch ? nextMatch[1] : null;
    page++;
  }
  return results;
}

let _anthropic = null;
function getAnthropic() {
  if (!_anthropic) _anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  return _anthropic;
}

let _supabase = null;
function getSupabase() {
  if (!_supabase) {
    _supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);
  }
  return _supabase;
}

async function getQualityGuidelines() {
  const { data } = await getSupabase()
    .from('quality_guidelines')
    .select('field_type, rule_text, good_example, bad_example')
    .order('display_order');
  return data || [];
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
  if (error || !user) {
    console.warn('[requireAuth:shopify] Token reddedildi:', error?.message || 'kullanıcı bulunamadı');
    return res.status(401).json({ error: 'Geçersiz token' });
  }
  req.user = user;
  next();
}

function normalizeShop(raw) {
  if (!raw) return null;
  let s = raw.trim().toLowerCase()
    .replace(/^https?:\/\//, '')
    .replace(/\/.*$/, '');
  if (!s.includes('.')) s += '.myshopify.com';
  return s;
}

function buildShopifyAuthorizeUrl(shop, clientId, redirectUri, scopes, state) {
  const host = shop
    ? `https://${shop}/admin/oauth/authorize`
    : 'https://admin.shopify.com/admin/oauth/authorize';
  return (
    `${host}?client_id=${clientId}` +
    `&scope=${scopes}` +
    `&redirect_uri=${redirectUri}` +
    `&state=${state}`
  );
}

// ─── GET /api/shopify/auth ────────────────────────────────────────────────────
// Shop domain'i normalize et: maganizad → maganizad.myshopify.com
// ?shop= gerekli (ön yüzden alınacak) · ?token= JWT (mevcut kullanıcı) · ?mode=popup
router.get('/auth', (req, res) => {
  const { shop: rawShop, token, mode, redirect } = req.query;
  const shop = normalizeShop(rawShop);

  const clientId = process.env.SHOPIFY_CLIENT_ID;
  if (!clientId) return res.status(500).send('<p>Shopify OAuth yapılandırılmamış</p>');

  const nonce = crypto.randomUUID();
  pendingStates.set(nonce, {
    shop,
    userToken: token || null,
    mode: mode === 'popup' ? 'popup' : 'redirect',
    redirect: redirect || null,
    createdAt: Date.now(),
  });

  const base = process.env.BACKEND_URL || `http://localhost:${process.env.PORT || 3001}`;
  const redirectUri = encodeURIComponent(`${base}/api/shopify/callback`);
  const scopes = encodeURIComponent(
    process.env.SHOPIFY_SCOPES || 'read_orders,read_products,read_customers,read_inventory,write_products'
  );

  res.redirect(buildShopifyAuthorizeUrl(shop, clientId, redirectUri, scopes, nonce));
});

async function resolveUserIdFromToken(token) {
  if (!token) return null;
  try {
    const { data: { user }, error } = await getSupabase().auth.getUser(token);
    if (error || !user) return null;
    return user.id;
  } catch {
    return null;
  }
}

function shopifyPopupScript(origin, payload) {
  return `<script>window.opener?.postMessage(${JSON.stringify(payload)},${JSON.stringify(origin)});window.close();</script>`;
}

// ─── GET /api/shopify/callback ────────────────────────────────────────────────
router.get('/callback', async (req, res) => {
  const frontend = process.env.FRONTEND_URL || 'https://mocksheets.com';
  const { code, shop, state } = req.query;

  const failRedirect = () => res.redirect(`${frontend}/auth.html?shopify_error=true`);
  const failPopup = (msg) => res.send(shopifyPopupScript(frontend, { type: 'shopify_auth', error: msg || 'Bağlantı başarısız' }));

  try {
    const session = state ? pendingStates.get(state) : null;
    if (!state || !session) {
      if (req.query.mode === 'popup') return failPopup('Geçersiz oturum');
      return failRedirect();
    }
    pendingStates.delete(state);

    if (!code || !shop) {
      if (session.mode === 'popup') return failPopup('Onay iptal edildi');
      return failRedirect();
    }

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
      if (session.mode === 'popup') return failPopup('Access token alınamadı');
      return failRedirect();
    }

    const shopResp = await fetch(`https://${shop}/admin/api/2024-07/shop.json`, {
      headers: { 'X-Shopify-Access-Token': tokenData.access_token },
    });
    const shopData = await shopResp.json();
    const shopInfo = shopData.shop || {};
    const email = shopInfo.email;
    const shopName = shopInfo.name || shop;

    if (!email) {
      if (session.mode === 'popup') return failPopup('Mağaza e-postası alınamadı');
      return failRedirect();
    }

    const sb = getSupabase();
    let userId = await resolveUserIdFromToken(session.userToken);

    if (!userId) {
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
          if (session.mode === 'popup') return failPopup('Kullanıcı oluşturulamadı');
          return failRedirect();
        }
        userId = newUser.user.id;
      }
    }

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

    if (session.mode === 'popup') {
      return res.send(shopifyPopupScript(frontend, {
        type: 'shopify_auth',
        connected: true,
        shop_domain: shop,
        shop_name: shopName,
      }));
    }

    if (session.userToken) {
      const target = session.redirect || `${frontend}/app.html?shopify=connected&autopull=1`;
      return res.redirect(target);
    }

    const { data: linkData, error: linkErr } = await sb.auth.admin.generateLink({
      type: 'magiclink',
      email,
      options: {
        redirectTo: `${frontend}/app.html?shopify=connected&autopull=1`,
      },
    });

    if (linkErr || !linkData?.properties?.action_link) {
      return failRedirect();
    }

    res.redirect(linkData.properties.action_link);
  } catch (err) {
    console.error('[shopify callback]', err.message);
    if (req.query.mode === 'popup') return failPopup(err.message);
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
router.get('/sync', requireAuth, checkLimit, async (req, res) => {
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

  // Catalog size limit check — fetch count before pulling all pages
  const maxCatalog = req.plan?.max_catalog_size ?? null;
  if (maxCatalog !== null) {
    try {
      const countRes = await fetch(`https://${shop}/admin/api/2024-01/products/count.json`, { headers });
      if (countRes.ok) {
        const { count } = await countRes.json();
        if (count > maxCatalog) {
          return res.status(402).json({
            error: `Planınız en fazla ${maxCatalog} ürün katalog boyutunu destekler. Mağazanızda ${count} ürün var.`,
            code: 'CATALOG_LIMIT_EXCEEDED',
            limit: maxCatalog,
            count,
            plan: req.usage?.plan,
            upgrade_url: '/pricing'
          });
        }
      }
    } catch (countErr) {
      console.warn('[shopify/sync] ürün sayısı alınamadı, devam ediliyor:', countErr.message);
    }
  }

  try {
    const [productsAll, ordersAll] = await Promise.all([
      fetchAllPages(`https://${shop}/admin/api/2024-01/products.json?limit=250`, headers),
      fetchAllPages(`https://${shop}/admin/api/2024-01/orders.json?limit=250&status=any`, headers),
    ]);
    console.log(`[shopify/sync] fetched ${productsAll.length} products, ${ordersAll.length} orders for user ${req.user.id}`);

    const productRows = [];
    for (const p of productsAll) {
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

    const orderRows = ordersAll.map(o => ({
      name: o.name || '',
      customer: (o.customer ? `${o.customer.first_name || ''} ${o.customer.last_name || ''}`.trim() : '') || o.email || '',
      total_price: o.total_price || '',
      financial_status: o.financial_status || '',
      fulfillment_status: o.fulfillment_status || 'unfulfilled',
      created_at: (o.created_at || '').slice(0, 10),
      line_items_count: (o.line_items || []).length,
    }));

    // RAG indexleme — arka planda, hata swallowla ama LOGLA (sessiz başarısızlık yok)
    if (productsAll.length >= INDEX_THRESHOLD) {
      const sheetRows = [
        ['id', 'title', 'vendor', 'product_type', 'tags', 'description'],
        ...productsAll.map(p => [p.id, p.title, p.vendor, p.product_type, (p.tags || ''), (p.body_html || '').slice(0, 500)]),
      ];
      indexProductsForRAG(req.user.id, sheetRows)
        .then(r => console.log(`[shopify/sync] RAG indexed: ${r?.indexed || 0} products for user ${req.user.id}`))
        .catch(err => console.error(`[shopify/sync] RAG indexing FAILED for user ${req.user.id}:`, err.message));
    }

    // Update last_sync in shopify_connections
    await getSupabase()
      .from('shopify_connections')
      .update({ last_sync: new Date().toISOString() })
      .eq('user_id', req.user.id);

    createNotification(req.user.id, 'Katalog senkronize edildi',
      `${productRows.length} ürün güncellendi`, 'sync', getSupabase()).catch(() => {});

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
  const { changes, confirmed, products } = req.body || {};

  if (!confirmed) {
    return res.status(400).json({
      error: 'onay_gerekli',
      message: 'confirmed:true bayrağı zorunlu. Canlı mağaza değişecek.'
    });
  }

  const { data: conn, error: connErr } = await getSupabase()
    .from('shopify_connections')
    .select('shop_domain, access_token')
    .eq('user_id', req.user.id)
    .single();

  if (connErr || !conn) return res.status(404).json({ error: 'Shopify bağlantısı bulunamadı' });

  const accessToken = decrypt(conn.access_token);
  if (!accessToken) return res.status(500).json({ error: 'Token çözümlenemedi' });

  const headers = { 'X-Shopify-Access-Token': accessToken, 'Content-Type': 'application/json' };
  const shop = conn.shop_domain;
  const apiBase = `https://${shop}/admin/api/2024-01`;
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

  let pushed = 0, skipped = 0, errors = [];
  let scopeMissing = false;

  try {
    // ─── MOD 1: granular `changes` ────────────────────────────────
    if (Array.isArray(changes) && changes.length > 0) {
      // Ürün bazında grupla (title/tags/vendor/product_type tek istekte birleşir)
      const grouped = {};
      const seoOps = [];
      const variantGrouped = {};
      for (const c of changes) {
        if (!c.product_id || !c.field) continue;
        if (['title', 'body_html', 'tags', 'vendor', 'product_type', 'status'].includes(c.field)) {
          if (!grouped[c.product_id]) grouped[c.product_id] = {};
          grouped[c.product_id][c.field] = c.new_value;
        } else if (c.field === 'seo_title' || c.field === 'seo_description') {
          seoOps.push(c);
        } else if (['price', 'compare_at_price'].includes(c.field) && c.variant_id) {
          if (!variantGrouped[c.variant_id]) variantGrouped[c.variant_id] = {};
          variantGrouped[c.variant_id][c.field] = c.new_value;
        } else {
          skipped++;
        }
      }

      for (const productId of Object.keys(grouped)) {
        try {
          const r = await fetch(`${apiBase}/products/${productId}.json`, {
            method: 'PUT',
            headers,
            body: JSON.stringify({ product: { id: Number(productId), ...grouped[productId] } }),
          });
          if (r.ok) {
            pushed++;
          } else {
            if (r.status === 403) scopeMissing = true;
            const body = await r.text().catch(() => '');
            errors.push({ productId, status: r.status, error: body.slice(0, 200) });
          }
        } catch (err) {
          errors.push({ productId, error: err.message });
        }
        await sleep(300);
      }

      for (const c of seoOps) {
        try {
          const r = await fetch(`${apiBase}/products/${c.product_id}/metafields.json`, {
            method: 'POST',
            headers,
            body: JSON.stringify({
              metafield: {
                namespace: 'global',
                key: c.field === 'seo_title' ? 'title_tag' : 'description_tag',
                value: c.new_value,
                type: 'single_line_text_field',
              },
            }),
          });
          if (r.ok) {
            pushed++;
          } else {
            if (r.status === 403) scopeMissing = true;
            const body = await r.text().catch(() => '');
            errors.push({ productId: c.product_id, field: c.field, status: r.status, error: body.slice(0, 200) });
          }
        } catch (err) {
          errors.push({ productId: c.product_id, field: c.field, error: err.message });
        }
        await sleep(300);
      }

      for (const variantId of Object.keys(variantGrouped)) {
        try {
          const r = await fetch(`${apiBase}/variants/${variantId}.json`, {
            method: 'PUT',
            headers,
            body: JSON.stringify({ variant: { id: Number(variantId), ...variantGrouped[variantId] } }),
          });
          if (r.ok) {
            pushed++;
          } else {
            if (r.status === 403) scopeMissing = true;
            const body = await r.text().catch(() => '');
            errors.push({ variantId, status: r.status, error: body.slice(0, 200) });
          }
        } catch (err) {
          errors.push({ variantId, error: err.message });
        }
        await sleep(300);
      }
    }

    // ─── MOD 2: bulk `products` (geriye uyumlu) ──────────────────
    if (Array.isArray(products) && products.length > 0) {
      for (const p of products) {
        if (!p.shopify_product_id) { skipped++; continue; }

        try {
          const r = await fetch(`${apiBase}/products/${p.shopify_product_id}.json`, {
            method: 'PUT',
            headers,
            body: JSON.stringify({
              product: {
                title: p.title,
                body_html: p.body_html,
                vendor: p.vendor,
                product_type: p.product_type,
                tags: p.tags,
                status: p.status,
              },
            }),
          });

          if (!r.ok) {
            if (r.status === 403) scopeMissing = true;
            const body = await r.text().catch(() => '');
            errors.push({ productId: p.shopify_product_id, status: r.status, error: body.slice(0, 200) });
            await sleep(300);
            continue;
          }

          if (p.shopify_variant_id && p.price) {
            await fetch(`${apiBase}/variants/${p.shopify_variant_id}.json`, {
              method: 'PUT',
              headers,
              body: JSON.stringify({
                variant: {
                  price: p.price,
                  compare_at_price: p.compare_at_price || null,
                },
              }),
            });
            await sleep(300);
          }

          pushed++;
        } catch (err) {
          errors.push({ productId: p.shopify_product_id, error: err.message });
        }
        await sleep(300);
      }
    }

    // last_sync güncelle
    await getSupabase()
      .from('shopify_connections')
      .update({ last_sync: new Date().toISOString() })
      .eq('user_id', req.user.id);

    // Denetim izi (workflow_runs tablosu yoksa sessizce geç)
    await getSupabase().from('workflow_runs').insert({
      user_id: req.user.id,
      status: errors.length > 0 ? 'partial' : 'success',
      node_results: { type: 'shopify_push', pushed, skipped, errorCount: errors.length, scopeMissing },
      completed_at: new Date().toISOString(),
    }).catch(() => {});

    if (pushed > 0) createNotification(req.user.id, "Değişiklikler Shopify'a aktarıldı",
      `${pushed} ürün güncellendi`, 'sync', getSupabase()).catch(() => {});

    res.json({
      pushed,
      skipped,
      errors: errors.length > 0 ? errors : undefined,
      scope_missing: scopeMissing || undefined,
    });
  } catch (err) {
    console.error('[shopify push]', err.message);
    res.status(502).json({ error: 'Shopify push başarısız' });
  }
});

// ─── POST /api/shopify/ai-analyze ────────────────────────────────────────────
router.post('/ai-analyze', checkLimit, async (req, res) => {
  const { productIds, analysisType } = req.body || {};

  const bulkLimit = req.plan?.max_bulk_size ?? null;
  if (bulkLimit !== null && Array.isArray(productIds) && productIds.length > bulkLimit) {
    const planName = req.usage?.plan === 'free' ? 'Ücretsiz' : (req.usage?.plan || 'Mevcut');
    return res.status(402).json({
      error: 'Plan limiti aşıldı',
      message: `${planName} planınız tek seferde en fazla ${bulkLimit} ürün analiz edebilir.`,
      currentPlan: req.usage?.plan,
      limit: bulkLimit,
      upgradeUrl: '/pricing',
    });
  }

  const { data: conn, error: connErr } = await getSupabase()
    .from('shopify_connections')
    .select('shop_domain, access_token')
    .eq('user_id', req.user.id)
    .single();

  if (connErr || !conn) return res.status(404).json({ error: 'Shopify bağlantısı bulunamadı' });

  const accessToken = decrypt(conn.access_token);
  if (!accessToken) return res.status(500).json({ error: 'Token çözümlenemedi' });

  const apiBase = `https://${conn.shop_domain}/admin/api/2024-01`;
  const shopifyHeaders = { 'X-Shopify-Access-Token': accessToken };

  try {
    let products;
    let totalScanned;
    if (Array.isArray(productIds) && productIds.length > 0) {
      const prodRes = await fetch(`${apiBase}/products.json?ids=${productIds.join(',')}&limit=250`, { headers: shopifyHeaders });
      if (!prodRes.ok) {
        return res.status(502).json({ error: 'Shopify ürünleri çekilemedi', status: prodRes.status });
      }
      ({ products } = await prodRes.json());
      totalScanned = products?.length || 0;
    } else {
      products = [];
      let nextUrl = `${apiBase}/products.json?limit=250`;
      const HARD_CAP = 2000;
      while (nextUrl && products.length < HARD_CAP) {
        const r = await fetch(nextUrl, { headers: shopifyHeaders });
        if (!r.ok) break;
        const { products: page } = await r.json();
        if (Array.isArray(page)) products = products.concat(page);
        const link = r.headers.get('Link') || r.headers.get('link');
        const m = link && link.match(/<([^>]+)>;\s*rel="next"/);
        nextUrl = m ? m[1] : null;
      }
      totalScanned = products.length;
    }

    if (!products || products.length === 0) {
      return res.json({ suggestions: [], analyzedCount: 0, totalScanned: 0 });
    }

    // Akıllı ön-filtre — sadece gerçek eksikliği olan ürünler AI'a gider.
    // productIds verildiyse filtre uygulanmaz (kullanıcı zaten belirli ID seçti).
    const useSmartFilter = !(Array.isArray(productIds) && productIds.length > 0);
    const isProblematic = (p) => {
      const plain = (p.body_html || '').replace(/<[^>]+>/g, '').trim();
      const shortDesc = plain.length < 100;
      const shortTitle = (p.title || '').length < 20;
      const thinTags = (p.tags || '').split(',').map(t => t.trim()).filter(Boolean).length < 3;
      if (analysisType === 'titles') return shortTitle;
      if (analysisType === 'descriptions') return shortDesc;
      if (analysisType === 'tags') return thinTags;
      return shortDesc || shortTitle || thinTags;
    };
    const candidateProducts = useSmartFilter ? products.filter(isProblematic) : products;
    console.log(`[shopify ai-analyze] scanned ${totalScanned}, analyzing ${candidateProducts.length}`);

    if (candidateProducts.length === 0) {
      return res.json({ suggestions: [], analyzedCount: 0, totalScanned });
    }

    // Fallback yolunda bulk limit'i candidateProducts sayısına uygula
    if (useSmartFilter && bulkLimit !== null && candidateProducts.length > bulkLimit) {
      const planName = req.usage?.plan === 'free' ? 'Ücretsiz' : (req.usage?.plan || 'Mevcut');
      return res.status(402).json({
        error: 'Plan limiti aşıldı',
        message: `${planName} planınız tek seferde en fazla ${bulkLimit} ürün analiz edebilir. Kataloğunuzda ${candidateProducts.length} sorunlu ürün bulundu.`,
        currentPlan: req.usage?.plan,
        limit: bulkLimit,
        upgradeUrl: '/pricing',
      });
    }

    // Sonraki kod bloğunun candidateProducts'ı işleyebilmesi için products'ı yeniden tanımla
    products = candidateProducts;

    // SEO metafield'ları ayrı çağrıyla al — Shopify REST products.json'da
    // metafields_global_title_tag/description_tag 2021'de kaldırıldı.
    const seoByProduct = new Map();
    await Promise.all(
      products.map(async (p) => {
        try {
          const mfRes = await fetch(
            `${apiBase}/products/${p.id}/metafields.json?namespace=global`,
            { headers: shopifyHeaders }
          );
          if (!mfRes.ok) return;
          const { metafields = [] } = await mfRes.json();
          seoByProduct.set(p.id, {
            title: metafields.find(m => m.key === 'title_tag')?.value || '',
            description: metafields.find(m => m.key === 'description_tag')?.value || '',
          });
        } catch (err) {
          console.warn(`[shopify ai-analyze] metafield fetch (${p.id}):`, err.message);
        }
      })
    );

    const productSummaries = products.map((p) => {
      const variant = p.variants?.[0] || {};
      const seo = seoByProduct.get(p.id) || { title: '', description: '' };
      return {
        id: p.id,
        title: p.title,
        body_html: (p.body_html || '').replace(/<[^>]+>/g, '').slice(0, 200),
        vendor: p.vendor,
        product_type: p.product_type,
        tags: p.tags,
        seo_title: seo.title,
        seo_description: seo.description,
        price: variant.price || '',
        compare_at_price: variant.compare_at_price || '',
        inventory_quantity: variant.inventory_quantity ?? '',
        variant_count: p.variants?.length || 1,
      };
    });

    const guidelines = await getQualityGuidelines();
    const guidelinesText = guidelines.length > 0
      ? '\n\nKALİTE KÜTÜPHANESİ (BU KURALLARA KESİNLİKLE UY):\n' +
        guidelines.map(g =>
          `- [${g.field_type}] ${g.rule_text}\n  ✓ İYİ: "${g.good_example}"\n  ✗ KÖTÜ: "${g.bad_example}"`
        ).join('\n\n')
      : '';

    const analysisPrompts = {
      seo: 'Her ürün için SEO başlığı (60 karakter altı) ve meta açıklaması (155 karakter altı) öner.',
      titles: 'Her ürün başlığını daha çekici ve SEO uyumlu hale getir.',
      descriptions: 'Her ürün için ikna edici, 2-3 cümlelik açıklama öner (field: body_html DEĞİL, seo_description olarak kullanılamayacaksa title veya tags olarak kalabilir — SADECE aşağıdaki field değerlerini kullan).',
      tags: 'Her ürünün etiketlerini standartlaştır, eksikleri tamamla (virgülle ayrılmış).',
      all: 'Her ürün için başlık, SEO başlığı, meta açıklama ve etiket önerileri sun.',
      geo: 'Her ürün için, AI alışveriş asistanlarının (ChatGPT, Perplexity) kolayca anlayabileceği şekilde seo_description alanını zenginleştir. "Bu ürün kimin için uygun", "nasıl kullanılır", "hangi malzeme/özellik" gibi sorulara açıkça cevap veren, en az 100 karakterlik detaylı bir meta açıklama öner.',
    };

    const systemPrompt = `Sen bir e-ticaret SEO ve katalog uzmanısın. Türkiye pazarına yönelik Shopify mağazaları için katalog kalitesini artırıyorsun.

GÖREV: ${analysisPrompts[analysisType] || analysisPrompts.all}

SEO KURALLARI (KESİNLİKLE UYGULANACAK):
- seo_title: EN FAZLA 60 karakter. Marka adı + ana keyword + farklılaştırıcı özellik.
- seo_description: EN FAZLA 155 karakter. Faydayı vurgula, call-to-action ekle.
- title: Marka + Model + Özellik formatı. 70 karakter altı.
- tags: Küçük harf, Türkçe keyword'ler, virgülle ayır. Kategori + renk + malzeme + kullanım.

ÖRNEK ÇIKTI:
[
  {"product_id": 9876543210, "field": "seo_title", "old_value": "Mavi Kazak", "new_value": "Erkek Mavi Yün Kazak | Kışlık | MarkaAdı", "reason": "Başlık 10 karakterdi, SEO için 40-60 karakter önerilir"},
  {"product_id": 9876543210, "field": "seo_description", "old_value": "", "new_value": "Premium yün karışımlı erkek kazak. Soğuk günlerde konfor sağlar. Ücretsiz kargo ve kolay iade.", "reason": "Meta açıklama eksikti, tıklama oranını artırmak için oluşturuldu"},
  {"product_id": 9876543210, "field": "tags", "old_value": "kazak", "new_value": "kazak, erkek, yün, kışlık, mavi, premium", "reason": "Tek etiket vardı, arama görünürlüğü için genişletildi"}
]

ÇIKTI KURALLARI:
- SADECE JSON dizisi döndür, başka hiçbir metin ekleme
- Her öneri için old_value VE new_value zorunlu
- Değişmeyecek alanlar için öneri oluşturma
- field değeri KESİNLİKLE şunlardan biri: title, seo_title, seo_description, tags
- reason alanı zorunlu: DEĞİŞİKLİĞİN NEDENİNİ 10-15 kelimeyle, kullanıcıya hitap eden basit bir dille açıkla. Teknik jargon kullanma. Örnek: "Başlık 15 karakterdi, SEO için 40-60 karakter arası önerilir"${guidelinesText}`;

    const BATCH_SIZE = 10;
    const batches = [];
    for (let i = 0; i < productSummaries.length; i += BATCH_SIZE) {
      batches.push(productSummaries.slice(i, i + BATCH_SIZE));
    }

    const batchResults = await Promise.all(
      batches.map((batch) =>
        getAnthropic().messages.create({
          model: 'claude-sonnet-4-6',
          max_tokens: 2000,
          temperature: 0,
          system: [{ type: 'text', text: systemPrompt, cache_control: { type: 'ephemeral' } }],
          messages: [
            { role: 'user', content: `Bu ürünleri analiz et:\n\n${JSON.stringify(batch)}` },
          ],
        })
      )
    );

    const allSuggestionsRaw = [];
    batchResults.forEach((msg, idx) => {
      const text = msg.content[0]?.text || '';
      try {
        const match = text.match(/\[[\s\S]*\]/);
        const parsed = JSON.parse(match ? match[0] : text);
        if (Array.isArray(parsed)) allSuggestionsRaw.push(...parsed);
      } catch {
        console.warn(`[shopify ai-analyze] batch #${idx} parse hatası:`, text.slice(0, 200));
      }
    });

    const ALLOWED = new Set(['title', 'seo_title', 'seo_description', 'tags']);
    const CHAR_LIMITS = { seo_title: 60, seo_description: 155, title: 70 };

    const suggestions = allSuggestionsRaw
      .filter((s) => s && s.product_id && ALLOWED.has(s.field))
      .filter((s) => s.new_value && s.new_value !== s.old_value)
      .map((s) => {
        const limit = CHAR_LIMITS[s.field];
        if (limit && typeof s.new_value === 'string' && s.new_value.length > limit) {
          s.new_value = s.new_value.slice(0, limit).trimEnd();
        }
        return s;
      });

    createNotification(req.user.id, 'AI analizi tamamlandı',
      `${suggestions.length} öneri hazır`, 'ai_complete', getSupabase()).catch(() => {});

    await incrementUsage(req.user.id);
    res.json({ suggestions, analyzedCount: products.length, totalScanned });
  } catch (e) {
    console.error('[shopify ai-analyze]', e.message);
    res.status(500).json({ error: e.message });
  }
});

// ─── GET /api/shopify/rag-status ─────────────────────────────────────────────
router.get('/rag-status', requireAuth, async (req, res) => {
  try {
    const { count, error } = await getSupabase()
      .from('product_embeddings')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', req.user.id);
    if (error) throw error;
    res.json({
      indexed: count || 0,
      ready: (count || 0) > 0,
      threshold: INDEX_THRESHOLD,
    });
  } catch (err) {
    console.error('[shopify/rag-status]', err.message);
    res.status(500).json({ error: err.message });
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

// ─── GDPR / Compliance Webhooks ──────────────────────────────────────────────

function verifyShopifyWebhook(req) {
  const hmacHeader = req.headers['x-shopify-hmac-sha256'];
  if (!hmacHeader || !req.body) return false;
  const generatedHash = crypto
    .createHmac('sha256', process.env.SHOPIFY_CLIENT_SECRET)
    .update(req.body)
    .digest('base64');
  try {
    const a = Buffer.from(generatedHash, 'base64');
    const b = Buffer.from(hmacHeader, 'base64');
    if (a.length !== b.length) return false;
    return crypto.timingSafeEqual(a, b);
  } catch {
    return false;
  }
}

function parseWebhookPayload(req) {
  const raw = req.body;
  if (!raw || !raw.length) return null;
  try {
    return JSON.parse(raw.toString());
  } catch {
    return null;
  }
}

// POST /api/shopify/webhooks — birleşik GDPR/compliance endpoint (shopify.app.toml)
router.post('/webhooks', (req, res) => {
  try {
    if (!verifyShopifyWebhook(req)) return res.status(401).send('Unauthorized');
    const topic = (req.headers['x-shopify-topic'] || '').toLowerCase();
    const payload = parseWebhookPayload(req);
    if (!payload) return res.status(400).send('Bad Request');

    console.log(`[shopify/webhooks] ${topic} for ${payload.shop_domain || 'unknown'}`);

    if (topic === 'customers/data_request') {
      // Müşteri verisi talebi — merchant düzeyinde saklanır, hemen onayla
      return res.status(200).send('OK');
    }

    if (topic === 'customers/redact') {
      // Müşteri verisi silme — kişisel veri saklanmıyor
      return res.status(200).send('OK');
    }

    if (topic === 'shop/redact') {
      const shopDomain = payload.shop_domain;
      if (shopDomain) {
        getSupabase().from('shopify_connections').delete().eq('shop_domain', shopDomain)
          .then(() => console.log('[GDPR] shop/redact completed:', shopDomain))
          .catch((e) => console.error('[GDPR] shop/redact error:', e.message));
      }
      return res.status(200).send('OK');
    }

    res.status(200).send('OK');
  } catch (e) {
    console.error('[shopify/webhooks] error:', e);
    res.status(500).send('Error');
  }
});

// POST /api/shopify/webhooks/customers-data-request
// Triggered when a customer requests a copy of their data
router.post('/webhooks/customers-data-request', (req, res) => {
  try {
    if (!verifyShopifyWebhook(req)) return res.status(401).send('Unauthorized');
    const payload = JSON.parse(req.body.toString());
    console.log('[GDPR] customers/data_request:', payload.shop_domain);
    // Upsheet does not store customer-level personal data — only merchant-level
    // product/order metadata. Nothing to export; acknowledge immediately.
    res.status(200).send('OK');
  } catch (e) {
    console.error('[GDPR] customers-data-request error:', e);
    res.status(500).send('Error');
  }
});

// POST /api/shopify/webhooks/customers-redact
// Triggered when a customer requests erasure of their data
router.post('/webhooks/customers-redact', (req, res) => {
  try {
    if (!verifyShopifyWebhook(req)) return res.status(401).send('Unauthorized');
    const payload = JSON.parse(req.body.toString());
    console.log('[GDPR] customers/redact:', payload.shop_domain);
    // No customer-level personal data stored — acknowledge immediately.
    res.status(200).send('OK');
  } catch (e) {
    console.error('[GDPR] customers-redact error:', e);
    res.status(500).send('Error');
  }
});

// POST /api/shopify/webhooks/shop-redact
// Triggered 48 hours after a merchant uninstalls the app — erase all their data
router.post('/webhooks/shop-redact', async (req, res) => {
  try {
    if (!verifyShopifyWebhook(req)) return res.status(401).send('Unauthorized');
    const payload = JSON.parse(req.body.toString());
    const shopDomain = payload.shop_domain;
    console.log('[GDPR] shop/redact:', shopDomain);
    const sb = getSupabase();
    await sb.from('shopify_connections').delete().eq('shop_domain', shopDomain);
    res.status(200).send('OK');
  } catch (e) {
    console.error('[GDPR] shop-redact error:', e);
    res.status(500).send('Error');
  }
});

// ─── GET /api/shopify/quality-guidelines ─────────────────────────────────────
router.get('/quality-guidelines', requireAuth, async (req, res) => {
  const { data, error } = await getSupabase()
    .from('quality_guidelines')
    .select('*')
    .order('display_order');
  if (error) return res.status(500).json({ error: error.message });
  res.json({ guidelines: data || [] });
});

// ─── POST /api/shopify/quality-guidelines ────────────────────────────────────
router.post('/quality-guidelines', requireAuth, async (req, res) => {
  const { field_type, rule_text, good_example, bad_example } = req.body;
  if (!field_type || !rule_text) return res.status(400).json({ error: 'field_type ve rule_text zorunlu' });
  const { data, error } = await getSupabase()
    .from('quality_guidelines')
    .insert({ field_type, rule_text, good_example, bad_example })
    .select()
    .single();
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

// ─── POST /api/shopify/chat ──────────────────────────────────────────────────
router.post('/chat', requireAuth, async (req, res) => {
  try {
    const { message, products = [], history = [] } = req.body;
    if (!message?.trim()) return res.status(400).json({ error: 'Mesaj gerekli' });

    const systemPrompt = `Sen bir Shopify ürün yöneticisi yapay zeka asistansın. Kullanıcının ürün kataloğu hakkında sorularını yanıtlar, düzenleme talepleri için yapılandırılmış değişiklik listesi üretirsin.

Eğer kullanıcı bir veya daha fazla ürünü DEĞİŞTİRMEK istiyorsa yanıtını MUTLAKA şu JSON formatında ver:
{
  "reply": "Türkçe açıklama — neyi değiştireceğini kısaca anlat",
  "type": "changes",
  "changes": [
    {
      "product_id": <sayı — ürünün shopify product_id'si>,
      "variant_id": <sayı veya null — sadece fiyat/variant alanları için>,
      "product_title": "<ürün adı — kullanıcıya göstermek için>",
      "field": "title" | "body_html" | "tags" | "vendor" | "product_type" | "status" | "price" | "compare_at_price" | "seo_title" | "seo_description",
      "old_value": "<mevcut değer — katalogdan al>",
      "new_value": "<yeni değer>"
    }
  ]
}

Eğer sadece bilgi veriyorsan, soru yanıtlıyorsan veya değişiklik gerekmiyorsa:
{
  "reply": "Türkçe yanıt",
  "type": "message"
}

Kurallar:
- Yanıtın her zaman geçerli JSON olsun — başka hiçbir şey yazma
- Türkçe konuş
- Yalnızca kullanıcının gönderdiği katalog verilerindeki ürünleri kullan; ürün uydurmadan
- Birden fazla ürün etkileniyorsa tüm değişiklikleri tek "changes" dizisinde topla
- status değerleri: "active", "draft", "archived"`;

    const productCtx = products.length > 0
      ? '\n\nMEVCUT ÜRÜN KATALOĞU:\n' + JSON.stringify(products, null, 2)
      : '\n\n(Henüz ürün yüklenmemiş veya Shopify bağlı değil)';

    const messages = [
      ...history.slice(-10).map(h => ({ role: h.role, content: h.content })),
      { role: 'user', content: message + productCtx },
    ];

    const aiRes = await getAnthropic().messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 2048,
      system: systemPrompt,
      messages,
    });

    const raw = aiRes.content[0]?.text || '{"reply":"Yanıt alınamadı","type":"message"}';

    let parsed;
    try {
      const match = raw.match(/\{[\s\S]*\}/);
      parsed = JSON.parse(match ? match[0] : raw);
    } catch {
      parsed = { reply: raw, type: 'message' };
    }

    res.json({
      reply: parsed.reply || '',
      type: parsed.type || 'message',
      changes: Array.isArray(parsed.changes) ? parsed.changes : [],
    });
  } catch (e) {
    console.error('[shopify/chat] hata:', e);
    res.status(500).json({ error: e.message });
  }
});

router.get('/notifications', requireAuth, async (req, res) => {
  try {
    const sb = getSupabase();
    const { data } = await sb.from('notifications')
      .select('*').eq('user_id', req.user.id)
      .order('created_at', { ascending: false }).limit(20);
    const { count: unreadCount } = await sb.from('notifications')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', req.user.id).eq('is_read', false);
    res.json({ notifications: data || [], unreadCount: unreadCount || 0 });
  } catch (e) {
    console.error('[shopify/notifications]', e.message);
    res.status(500).json({ error: e.message });
  }
});

router.post('/notifications/mark-read', requireAuth, async (req, res) => {
  try {
    await getSupabase().from('notifications')
      .update({ is_read: true }).eq('user_id', req.user.id).eq('is_read', false);
    res.json({ ok: true });
  } catch (e) {
    console.error('[shopify/notifications/mark-read]', e.message);
    res.status(500).json({ error: e.message });
  }
});

// POST /api/shopify/analytics/enable — enable visitor tracking via ScriptTag
router.post('/analytics/enable', requireAuth, async (req, res) => {
  try {
    const sb = getSupabase();
    const { data: conn } = await sb
      .from('shopify_connections')
      .select('shop_domain, access_token')
      .eq('user_id', req.user.id)
      .single();

    if (!conn) {
      return res.status(404).json({ error: 'Shopify bağlantısı bulunamadı' });
    }

    const scriptUrl = `${process.env.FRONTEND_URL}/tracker.js`;
    const resp = await fetch(
      `https://${conn.shop_domain}/admin/api/2024-01/script_tags.json`,
      {
        method: 'POST',
        headers: {
          'X-Shopify-Access-Token': conn.access_token,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ script_tag: { event: 'onload', src: scriptUrl } })
      }
    );

    const json = await resp.json();
    const scriptId = json.script_tag?.id?.toString();

    await sb.from('shopify_connections')
      .update({ tracking_enabled: true, tracking_script_id: scriptId })
      .eq('user_id', req.user.id);

    res.json({ ok: true, script_id: scriptId });
  } catch (e) {
    console.error('[shopify/analytics/enable]', e.message);
    res.status(500).json({ error: e.message });
  }
});

// POST /api/shopify/analytics/disable — disable visitor tracking
router.post('/analytics/disable', requireAuth, async (req, res) => {
  try {
    const sb = getSupabase();
    const { data: conn } = await sb
      .from('shopify_connections')
      .select('shop_domain, access_token, tracking_script_id')
      .eq('user_id', req.user.id)
      .single();

    if (!conn) {
      return res.status(404).json({ error: 'Shopify bağlantısı bulunamadı' });
    }

    if (conn.tracking_script_id) {
      await fetch(
        `https://${conn.shop_domain}/admin/api/2024-01/script_tags/${conn.tracking_script_id}.json`,
        {
          method: 'DELETE',
          headers: { 'X-Shopify-Access-Token': conn.access_token }
        }
      );
    }

    await sb.from('shopify_connections')
      .update({ tracking_enabled: false, tracking_script_id: null })
      .eq('user_id', req.user.id);

    res.json({ ok: true });
  } catch (e) {
    console.error('[shopify/analytics/disable]', e.message);
    res.status(500).json({ error: e.message });
  }
});

module.exports = router;
