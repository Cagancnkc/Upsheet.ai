'use strict';
const { createClient } = require('@supabase/supabase-js');

let _supabase = null;
function getSupabase() {
  if (!_supabase) {
    _supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);
  }
  return _supabase;
}

async function requireProMax(req, res, next) {
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ error: 'Giriş gerekli' });

  const supabase = getSupabase();
  const { data: { user }, error } = await supabase.auth.getUser(token);
  if (error || !user) return res.status(401).json({ error: 'Geçersiz token' });

  const { data: usage } = await supabase
    .from('user_usage')
    .select('plan')
    .eq('user_id', user.id)
    .single();

  // 'promax' yeni plan adı; 'business' eski eşdeğeri (mevcut kullanıcılar için)
  const plan = usage?.plan;
  if (plan !== 'promax' && plan !== 'business') {
    return res.status(403).json({
      error: 'Bu özellik Pro Max planına özeldir.',
      upgrade_required: true
    });
  }

  req.user = user;
  req.userPlan = plan;
  next();
}

module.exports = requireProMax;
