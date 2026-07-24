'use strict';
const fetch = require('node-fetch');
const { createClient } = require('@supabase/supabase-js');

function getSb() {
  return createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);
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

  for (const edge of comments) {
    const c = edge.node;
    if (!c.body || c.body.trim().length < 10) continue; // çok kısa yorumları atla

    await sb.from('producthunt_reviews').upsert({
      id: c.id,
      author_name: c.user?.name || 'Anonim',
      author_avatar_url: c.user?.profileImage || null,
      content: c.body,
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
