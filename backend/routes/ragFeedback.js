'use strict';

const express = require('express');
const { createClient } = require('@supabase/supabase-js');
const { checkLimit } = require('../middleware/limits');

const router = express.Router();

let _supabase = null;
function db() {
  if (!_supabase) {
    _supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);
  }
  return _supabase;
}

// POST /api/chat/rag-feedback
// Body: { query, matchedExamples, topCategory, rating (+1 / -1) }
router.post('/rag-feedback', checkLimit, async (req, res) => {
  try {
    const userId = req.user?.id || null;
    const { query, matchedExamples, topCategory, rating } = req.body || {};

    if (!query || typeof query !== 'string') {
      return res.status(400).json({ error: 'query gerekli' });
    }
    if (rating !== 1 && rating !== -1) {
      return res.status(400).json({ error: 'rating 1 veya -1 olmalı' });
    }

    const { error } = await db().from('shopify_rag_feedback').insert({
      user_id: userId,
      query: query.slice(0, 1000),
      matched_examples: Array.isArray(matchedExamples) ? matchedExamples : [],
      top_category: topCategory || null,
      rating
    });

    if (error) throw error;

    res.json({ ok: true });
  } catch (err) {
    console.error('[rag-feedback] error:', err.message);
    res.status(500).json({ error: 'Feedback kaydedilemedi' });
  }
});

module.exports = router;
