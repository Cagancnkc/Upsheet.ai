'use strict';
const { decrypt } = require('./encryption');

async function _fetchAllPages(url, accessToken, maxPages = 20) {
  const results = [];
  let nextUrl = url;
  let page = 0;
  const headers = { 'X-Shopify-Access-Token': accessToken };
  while (nextUrl && page < maxPages) {
    const res = await fetch(nextUrl, { headers });
    if (!res.ok) break;
    const data = await res.json();
    const key = Object.keys(data)[0];
    results.push(...(data[key] || []));
    const link = res.headers.get('link') || res.headers.get('Link');
    const m = link && link.match(/<([^>]+)>;\s*rel="next"/);
    nextUrl = m ? m[1] : null;
    page++;
  }
  return results;
}

// conn: { shop_domain, access_token (encrypted) }
// Returns 2D sheetRows array — identical to the RAG format in /sync endpoint
async function fetchAllProductsAsSheetRows(conn) {
  const token = decrypt(conn.access_token);
  if (!token) throw new Error('Token çözümlenemedi');
  const shop = conn.shop_domain;
  const products = await _fetchAllPages(
    `https://${shop}/admin/api/2025-07/products.json?limit=250`,
    token
  );
  return [
    ['id', 'title', 'vendor', 'product_type', 'tags', 'description'],
    ...products.map(p => [
      p.id,
      p.title || '',
      p.vendor || '',
      p.product_type || '',
      p.tags || '',
      (p.body_html || '').slice(0, 500),
    ]),
  ];
}

module.exports = { fetchAllProductsAsSheetRows };
