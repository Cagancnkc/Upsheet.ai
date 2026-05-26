'use strict';
const { createClient } = require('@supabase/supabase-js');
const PLANS = require('../config/plans');

let _supabase = null;
function getSupabase() {
  if (!_supabase) {
    _supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);
  }
  return _supabase;
}
// alias for brevity
const supabase = new Proxy({}, { get: (_, prop) => getSupabase()[prop] });

// Kullanıcıyı al veya oluştur
async function getOrCreateUsage(userId) {
  const { data, error } = await supabase
    .from('user_usage')
    .select('*')
    .eq('user_id', userId)
    .single();

  if (error && error.code === 'PGRST116') {
    // Kayıt yok, oluştur
    const { data: newData } = await supabase
      .from('user_usage')
      .insert({ user_id: userId, plan: 'free' })
      .select()
      .single();
    return newData;
  }

  return data;
}

// Günlük/aylık sıfırlama kontrolü
async function resetIfNeeded(usage, userId) {
  const today = new Date().toISOString().split('T')[0];
  const currentMonth = new Date().getMonth() + 1;
  const updates = {};

  if (usage.last_command_date !== today) {
    updates.ai_commands_used_today = 0;
    updates.last_command_date = today;
  }

  if (usage.last_reset_month !== currentMonth) {
    updates.ai_commands_used_month = 0;
    updates.last_reset_month = currentMonth;
  }

  if (Object.keys(updates).length > 0) {
    await supabase
      .from('user_usage')
      .update(updates)
      .eq('user_id', userId);
    return { ...usage, ...updates };
  }

  return usage;
}

// Limit kontrolü middleware
async function checkLimit(req, res, next) {
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (!token) {
    return res.status(401).json({
      error: 'Giriş gerekli',
      code: 'AUTH_REQUIRED'
    });
  }

  // Servis anahtarı ile dahili scheduler çağrıları — x-user-id header zorunlu
  if (token === process.env.SUPABASE_SERVICE_KEY) {
    const userId = req.headers['x-user-id'];
    if (!userId) return res.status(401).json({ error: 'x-user-id header gerekli', code: 'INVALID_TOKEN' });
    const usage = await getOrCreateUsage(userId);
    const plan = PLANS[usage?.plan] || PLANS.free;
    req.user = { id: userId };
    req.usage = usage;
    req.plan = plan;
    return next();
  }

  const { data: { user }, error } = await supabase.auth.getUser(token);
  if (error || !user) {
    return res.status(401).json({
      error: 'Geçersiz token',
      code: 'INVALID_TOKEN'
    });
  }

  let usage = await getOrCreateUsage(user.id);
  usage = await resetIfNeeded(usage, user.id);

  const plan = PLANS[usage.plan] || PLANS.free;

  if (plan.ai_commands_per_day !== Infinity &&
      usage.ai_commands_used_today >= plan.ai_commands_per_day) {
    return res.status(429).json({
      error: 'Günlük AI komut limitine ulaştınız',
      code: 'DAILY_LIMIT_REACHED',
      limit: plan.ai_commands_per_day,
      used: usage.ai_commands_used_today,
      plan: usage.plan,
      reset: 'Yarın gece yarısı sıfırlanır',
      upgrade_url: '/?upgrade=true#pricing'
    });
  }

  if (plan.ai_commands_per_month !== Infinity &&
      usage.ai_commands_used_month >= plan.ai_commands_per_month) {
    return res.status(429).json({
      error: 'Aylık AI komut limitine ulaştınız',
      code: 'MONTHLY_LIMIT_REACHED',
      limit: plan.ai_commands_per_month,
      used: usage.ai_commands_used_month,
      plan: usage.plan,
      reset: 'Ayın 1\'inde sıfırlanır',
      upgrade_url: '/?upgrade=true#pricing'
    });
  }

  req.user = user;
  req.usage = usage;
  req.plan = plan;
  next();
}

// Komut kullanımını artır
async function incrementUsage(userId) {
  await supabase.rpc('increment_usage', { p_user_id: userId });
}

// Özellik kontrolü middleware
function requireFeature(feature) {
  return (req, res, next) => {
    const plan = req.plan;
    if (!plan) return res.status(500).json({ error: 'Plan bilgisi yok' });

    if (!plan[feature]) {
      return res.status(403).json({
        error: 'Bu özellik planınızda mevcut değil',
        code: 'FEATURE_NOT_AVAILABLE',
        feature,
        plan: req.usage?.plan,
        upgrade_url: '/?upgrade=true#pricing'
      });
    }
    next();
  };
}

module.exports = { checkLimit, incrementUsage, requireFeature, getOrCreateUsage };
