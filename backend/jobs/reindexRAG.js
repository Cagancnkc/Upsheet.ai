'use strict';
const cron = require('node-cron');
const { createClient } = require('@supabase/supabase-js');
const { indexProductsForRAG } = require('../services/productIndexer');
const { fetchAllProductsAsSheetRows } = require('../services/shopifyProductFetcher');

function scheduleRAGReindex() {
  cron.schedule('0 4 * * *', async () => {
    console.log('[RAG Reindex] Günlük yeniden indeksleme başladı');
    try {
      const sb = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);
      const { data: connections } = await sb
        .from('shopify_connections')
        .select('user_id, shop_domain, access_token');

      if (!connections?.length) {
        console.log('[RAG Reindex] Bağlı mağaza yok, atlanıyor');
        return;
      }

      let success = 0, skipped = 0, errors = 0;

      for (const conn of connections) {
        try {
          const sheetRows = await fetchAllProductsAsSheetRows(conn);
          // INDEX_THRESHOLD (500) kontrolü indexProductsForRAG içinde yapılıyor
          const result = await indexProductsForRAG(conn.user_id, sheetRows);
          if (result.skipped) {
            skipped++;
          } else {
            success++;
            console.log('[RAG Reindex]', conn.shop_domain, '—', result.indexed, 'ürün indekslendi');
          }
        } catch (userErr) {
          errors++;
          console.error('[RAG Reindex] Hata (' + conn.shop_domain + '):', userErr.message);
          // Tek kullanıcı hatası döngüyü durdurmaz
        }
        await new Promise(r => setTimeout(r, 1000)); // Shopify rate limit koruması
      }

      console.log('[RAG Reindex] Tamamlandı — Başarılı:', success, 'Atlanan:', skipped, 'Hatalı:', errors);
    } catch (e) {
      console.error('[RAG Reindex] Genel hata:', e);
    }
  }, { timezone: 'Europe/Istanbul' });

  console.log('[RAG Reindex] Günlük 04:00 zamanlaması kuruldu');
}

module.exports = { scheduleRAGReindex };
