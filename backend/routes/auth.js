'use strict';
const express = require('express');
const router = express.Router();
const { createClient } = require('@supabase/supabase-js');
const { cancelSubscriptionInternal } = require('./billing');

function getSb() {
  return createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);
}

async function authenticate(req, res) {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Unauthorized' });
    return null;
  }
  const token = auth.split(' ')[1];
  const sb = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);
  const { data: { user }, error } = await sb.auth.getUser(token);
  if (error || !user) {
    res.status(401).json({ error: 'Geçersiz oturum.' });
    return null;
  }
  return user;
}

const TABLES_TO_CLEAN = [
  'shopify_rag_feedback',
  'product_embeddings',
  'health_score_snapshots',
  'shopify_connections',
  'user_usage',
];

// DELETE /api/auth/delete-account
router.delete('/delete-account', async (req, res) => {
  try {
    const user = await authenticate(req, res);
    if (!user) return;
    const sb = getSb();

    // 1. Polar aboneliğini anında iptal et (hata olursa devam et)
    try {
      await cancelSubscriptionInternal(user.id, sb, true);
    } catch (e) {
      console.error('[auth/delete-account] Polar iptal hatası (devam ediliyor):', e.message);
    }

    // 2. CASCADE olmayan tabloları temizle
    for (const table of TABLES_TO_CLEAN) {
      const { error } = await sb.from(table).delete().eq('user_id', user.id);
      if (error) console.error(`[auth/delete-account] ${table} silme hatası:`, error.message);
    }

    // 3. Auth kullanıcısını sil
    const { error: deleteErr } = await sb.auth.admin.deleteUser(user.id);
    if (deleteErr) {
      console.error('[auth/delete-account] Auth silme hatası:', deleteErr.message);
      return res.status(500).json({ error: 'Hesap silinemedi.' });
    }

    res.json({ success: true });
  } catch (e) {
    console.error('[auth/delete-account] Hata:', e);
    res.status(500).json({ error: 'Sunucu hatası.' });
  }
});

module.exports = router;
