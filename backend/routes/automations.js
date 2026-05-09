'use strict';
const express = require('express');
const router = express.Router();
const { createClient } = require('@supabase/supabase-js');
const Anthropic = require('@anthropic-ai/sdk');

function getSupabase() {
  return createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);
}

// Lightweight auth middleware — sadece token doğrular, limit kontrol etmez
async function requireAuth(req, res, next) {
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ error: 'Giriş gerekli' });

  const sb = getSupabase();
  const { data: { user }, error } = await sb.auth.getUser(token);
  if (error || !user) return res.status(401).json({ error: 'Geçersiz token' });

  req.user = user;
  req.supabase = sb;
  next();
}

// GET /api/automations — kullanıcının tüm kuralları
router.get('/', requireAuth, async (req, res) => {
  const { data, error } = await req.supabase
    .from('automation_rules')
    .select('*')
    .eq('user_id', req.user.id)
    .order('created_at', { ascending: false });

  if (error) return res.status(500).json({ error: error.message });
  res.json({ rules: data || [] });
});

// POST /api/automations — yeni kural oluştur
router.post('/', requireAuth, async (req, res) => {
  const { name, integration, trigger_config, action_config, throttle_seconds, enabled } = req.body;

  if (!name || !integration || !trigger_config || !action_config) {
    return res.status(400).json({ error: 'name, integration, trigger_config, action_config zorunludur' });
  }

  const { data, error } = await req.supabase
    .from('automation_rules')
    .insert({
      user_id: req.user.id,
      name,
      integration,
      trigger_config,
      action_config,
      throttle_seconds: throttle_seconds ?? 3600,
      enabled: enabled !== false
    })
    .select()
    .single();

  if (error) return res.status(500).json({ error: error.message });
  res.json({ rule: data });
});

// PUT /api/automations/:id — kural güncelle
router.put('/:id', requireAuth, async (req, res) => {
  const { id } = req.params;
  const updates = {};
  const allowed = ['name', 'enabled', 'integration', 'trigger_config', 'action_config', 'throttle_seconds'];
  for (const key of allowed) {
    if (req.body[key] !== undefined) updates[key] = req.body[key];
  }

  if (!Object.keys(updates).length) {
    return res.status(400).json({ error: 'Güncellenecek alan yok' });
  }

  const { data, error } = await req.supabase
    .from('automation_rules')
    .update(updates)
    .eq('id', id)
    .eq('user_id', req.user.id)
    .select()
    .single();

  if (error) return res.status(500).json({ error: error.message });
  if (!data) return res.status(404).json({ error: 'Kural bulunamadı' });
  res.json({ rule: data });
});

// DELETE /api/automations/:id — kural sil
router.delete('/:id', requireAuth, async (req, res) => {
  const { id } = req.params;

  const { error } = await req.supabase
    .from('automation_rules')
    .delete()
    .eq('id', id)
    .eq('user_id', req.user.id);

  if (error) return res.status(500).json({ error: error.message });
  res.json({ success: true });
});

// POST /api/automations/:id/log — tetiklenme zamanını kaydet
router.post('/:id/log', requireAuth, async (req, res) => {
  const { id } = req.params;

  const { data, error } = await req.supabase
    .from('automation_rules')
    .update({ last_fired: new Date().toISOString() })
    .eq('id', id)
    .eq('user_id', req.user.id)
    .select()
    .single();

  if (error) return res.status(500).json({ error: error.message });
  res.json({ success: true, last_fired: data?.last_fired });
});

// POST /api/automations/suggest — AI ile iş türü tespit + kural şablonu öner
router.post('/suggest', requireAuth, async (req, res) => {
  const { headers, integration } = req.body;

  if (!headers || !Array.isArray(headers) || !headers.length) {
    return res.status(400).json({ error: 'headers array gerekli' });
  }

  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

  const prompt = `Bir Türk kullanıcı "${integration || 'Make'}" entegrasyonu kuruyor.
Tablolarındaki sütun başlıkları: ${headers.filter(Boolean).join(', ')}

Bu başlıklara göre:
1. Kullanıcının hangi iş türünde olduğunu tespit et (stok, spor salonu, muhasebe, personel, satış, proje, diğer)
2. Bu entegrasyon için maksimum 3 adet somut otomasyon kuralı öner

Sadece şu JSON formatında yanıt ver:
{
  "business_type": "stok",
  "business_label": "Stok Yönetimi",
  "suggestions": [
    {
      "name": "Kural adı (Türkçe, 50 char max)",
      "description": "Ne yapar (1 cümle)",
      "trigger_config": {
        "type": "cell_condition",
        "column": "tam sütun adı",
        "operator": "less_than|greater_than|equals|not_equals|contains|is_empty|date_is_today|date_passed|changed",
        "value": "eşik değeri veya boş string"
      },
      "action_config": {
        "event": "event_adi",
        "message": "Şablon mesaj, {SütunAdı} placeholder kullanılabilir",
        "include_columns": ["sütun1", "sütun2"]
      },
      "throttle_seconds": 3600
    }
  ]
}`;

  try {
    const response = await client.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 800,
      messages: [{ role: 'user', content: prompt }]
    });

    const raw = response.content[0].text.trim();
    const match = raw.match(/\{[\s\S]*\}/);
    if (!match) return res.status(500).json({ error: 'AI yanıtı parse edilemedi' });

    const result = JSON.parse(match[0]);
    res.json(result);
  } catch (e) {
    console.error('/api/automations/suggest hatası:', e.message);
    res.status(500).json({ error: e.message });
  }
});

module.exports = router;
