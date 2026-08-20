'use strict';
const express = require('express');
const router = express.Router();
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

const PH_API = 'https://api.producthunt.com/v2/api/graphql';
const PH_SLUG = process.env.PH_POST_SLUG || 'mocksheets';
const BONUS = 10;

function normalizeUsername(name) {
  if (!name) return '';
  return String(name).trim().replace(/^@/, '').toLowerCase();
}

async function phQuery(query, variables) {
  const token = process.env.PH_DEVELOPER_TOKEN;
  if (!token) throw new Error('PH_DEVELOPER_TOKEN yok');
  const r = await fetch(PH_API, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ query, variables })
  });
  if (!r.ok) {
    const text = await r.text().catch(() => '');
    throw new Error(`PH API ${r.status}: ${text.slice(0, 200)}`);
  }
  const json = await r.json();
  if (json.errors) throw new Error('PH GraphQL: ' + JSON.stringify(json.errors).slice(0, 300));
  return json.data;
}

async function findInVotes(slug, target) {
  let cursor = null;
  for (let i = 0; i < 40; i++) {
    const data = await phQuery(`
      query($slug: String!, $after: String) {
        post(slug: $slug) {
          votes(first: 50, after: $after) {
            pageInfo { hasNextPage endCursor }
            edges { node { user { username name } } }
          }
        }
      }
    `, { slug, after: cursor });
    const post = data && data.post;
    if (!post) return false;
    const edges = post.votes?.edges || [];
    for (const e of edges) {
      const u = normalizeUsername(e?.node?.user?.username);
      if (u && u === target) return true;
    }
    if (!post.votes?.pageInfo?.hasNextPage) return false;
    cursor = post.votes.pageInfo.endCursor;
  }
  return false;
}

async function findInComments(slug, target) {
  let cursor = null;
  for (let i = 0; i < 40; i++) {
    const data = await phQuery(`
      query($slug: String!, $after: String) {
        post(slug: $slug) {
          comments(first: 50, after: $after) {
            pageInfo { hasNextPage endCursor }
            edges { node { user { username name } } }
          }
        }
      }
    `, { slug, after: cursor });
    const post = data && data.post;
    if (!post) return false;
    const edges = post.comments?.edges || [];
    for (const e of edges) {
      const u = normalizeUsername(e?.node?.user?.username);
      if (u && u === target) return true;
    }
    if (!post.comments?.pageInfo?.hasNextPage) return false;
    cursor = post.comments.pageInfo.endCursor;
  }
  return false;
}

router.get('/status', async (req, res) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token) return res.status(401).json({ error: 'Giriş gerekli' });
    const { data: { user }, error } = await supabase.auth.getUser(token);
    if (error || !user) return res.status(401).json({ error: 'Geçersiz token' });

    const { data: usage } = await supabase
      .from('user_usage')
      .select('ph_bonus_claimed, ph_bonus_commands, ph_username')
      .eq('user_id', user.id)
      .maybeSingle();

    res.json({
      claimed: !!usage?.ph_bonus_claimed,
      bonus_commands: usage?.ph_bonus_commands || 0,
      ph_username: usage?.ph_username || null,
      post_url: `https://www.producthunt.com/products/${PH_SLUG}?launch=${PH_SLUG}`
    });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.post('/claim', async (req, res) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token) return res.status(401).json({ error: 'Giriş gerekli' });

    const { data: { user }, error: authErr } = await supabase.auth.getUser(token);
    if (authErr || !user) return res.status(401).json({ error: 'Geçersiz token' });

    const raw = (req.body?.ph_username || '').toString().trim();
    const target = normalizeUsername(raw);
    if (!target || target.length < 2 || target.length > 40 || !/^[a-z0-9._-]+$/.test(target)) {
      return res.status(400).json({ error: 'Geçersiz Product Hunt kullanıcı adı' });
    }

    // Kayıt var mı bak, yoksa oluştur
    let { data: usage } = await supabase
      .from('user_usage')
      .select('*')
      .eq('user_id', user.id)
      .maybeSingle();

    if (!usage) {
      const { data: created } = await supabase
        .from('user_usage')
        .insert({ user_id: user.id, plan: 'free' })
        .select()
        .single();
      usage = created;
    }

    if (usage?.ph_bonus_claimed) {
      return res.status(409).json({
        error: 'Bu hesap için ödül zaten alınmış',
        code: 'ALREADY_CLAIMED'
      });
    }

    // Aynı PH kullanıcı adını başka biri kullanmış mı?
    const { data: existing } = await supabase
      .from('user_usage')
      .select('user_id')
      .eq('ph_username', target)
      .maybeSingle();
    if (existing && existing.user_id !== user.id) {
      return res.status(409).json({
        error: 'Bu Product Hunt kullanıcı adı başka bir hesap için kullanılmış',
        code: 'USERNAME_TAKEN'
      });
    }

    if (!process.env.PH_DEVELOPER_TOKEN) {
      return res.status(503).json({ error: 'Product Hunt entegrasyonu henüz aktif değil' });
    }

    // Doğrulama: hem upvote hem yorum
    let voted = false, commented = false;
    try {
      voted = await findInVotes(PH_SLUG, target);
      if (voted) commented = await findInComments(PH_SLUG, target);
    } catch (e) {
      console.error('[producthunt/claim] PH API hatası:', e.message);
      return res.status(502).json({ error: 'Product Hunt API şu an cevap vermiyor, biraz sonra tekrar dene' });
    }

    if (!voted) {
      return res.status(404).json({
        error: `"${raw}" bu ürüne upvote vermemiş görünüyor. Önce upvote+yorum yap, sonra tekrar dene.`,
        code: 'NOT_VOTED'
      });
    }
    if (!commented) {
      return res.status(404).json({
        error: `"${raw}" bu ürüne yorum yapmamış görünüyor. Bir yorum bırakıp tekrar dene.`,
        code: 'NOT_COMMENTED'
      });
    }

    const newBonus = (usage.ph_bonus_commands || 0) + BONUS;
    const { error: updErr } = await supabase
      .from('user_usage')
      .update({
        ph_bonus_claimed: true,
        ph_username: target,
        ph_bonus_commands: newBonus,
        ph_claimed_at: new Date().toISOString()
      })
      .eq('user_id', user.id);

    if (updErr) {
      console.error('[producthunt/claim] update hatası:', updErr);
      return res.status(500).json({ error: 'Kayıt güncellenemedi' });
    }

    res.json({
      ok: true,
      bonus: BONUS,
      total_bonus_commands: newBonus,
      message: `🎁 ${BONUS} ekstra komut hesabına eklendi!`
    });
  } catch (e) {
    console.error('[producthunt/claim] hata:', e);
    res.status(500).json({ error: e.message || 'Sunucu hatası' });
  }
});

module.exports = router;
