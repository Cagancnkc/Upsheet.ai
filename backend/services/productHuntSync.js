'use strict';
const fetch = require('node-fetch');
const { createClient } = require('@supabase/supabase-js');
const Anthropic = require('@anthropic-ai/sdk');

function getSb() {
  return createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);
}

async function translateToTurkish(text) {
  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  const msg = await client.messages.create({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 500,
    messages: [{
      role: 'user',
      content: 'Translate this Product Hunt review to natural Turkish. Return ONLY the translated text, no quotes, no explanation:\n\n' + text,
    }],
  });
  return msg.content[0].text.trim();
}

async function fetchProductHuntComments() {
  const slug = process.env.PRODUCTHUNT_POST_SLUG;
  const token = process.env.PRODUCTHUNT_TOKEN;

  if (!slug || !token) {
    console.warn('[ProductHunt Sync] PRODUCTHUNT_POST_SLUG veya PRODUCTHUNT_TOKEN eksik, atlanıyor');
    return 0;
  }

  const query = `
    query {
      post(slug: "${slug}") {
        comments(first: 20, order: NEWEST) {
          edges {
            node {
              id
              body
              votesCount
              createdAt
              user {
                name
                profileImage
              }
            }
          }
        }
      }
    }
  `;

  const res = await fetch('https://api.producthunt.com/v2/api/graphql', {
    method: 'POST',
    headers: {
      'Authorization': 'Bearer ' + token,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ query }),
  });

  if (!res.ok) throw new Error('PH API HTTP ' + res.status);

  const data = await res.json();
  if (data.errors) throw new Error('PH GraphQL hata: ' + JSON.stringify(data.errors));

  const comments = data.data?.post?.comments?.edges || [];
  const sb = getSb();

  // Mevcut kayıtların çeviri durumunu kontrol et — zaten çevrilmişleri tekrar çevirme
  const ids = comments.map(e => e.node.id).filter(Boolean);
  const { data: existing } = ids.length
    ? await sb.from('producthunt_reviews').select('id, content_tr').in('id', ids)
    : { data: [] };
  const existingMap = new Map((existing || []).map(r => [r.id, r.content_tr]));

  for (const edge of comments) {
    const c = edge.node;
    if (!c.body || c.body.trim().length < 10) continue;

    const alreadyTranslated = existingMap.get(c.id);
    let content_tr = alreadyTranslated || null;
    if (!content_tr) {
      try {
        content_tr = await translateToTurkish(c.body);
      } catch (e) {
        console.error('[ProductHunt Sync] çeviri hatası:', e.message);
        content_tr = c.body; // çeviri başarısızsa orijinali kullan
      }
    }

    await sb.from('producthunt_reviews').upsert({
      id: c.id,
      author_name: c.user?.name || 'Anonim',
      author_avatar_url: c.user?.profileImage || null,
      content: c.body,
      content_tr,
      votes_count: c.votesCount || 0,
      ph_created_at: c.createdAt,
      fetched_at: new Date().toISOString(),
      // is_visible'a dokunmuyoruz — mevcut onay durumu korunur
    }, {
      onConflict: 'id',
      ignoreDuplicates: false,
    });
  }

  return comments.length;
}

module.exports = { fetchProductHuntComments };
