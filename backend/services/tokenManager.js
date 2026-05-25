'use strict';
const { createClient } = require('@supabase/supabase-js');
const { google } = require('googleapis');
const { encrypt, decrypt } = require('./encryption');

let _supabase = null;
function getSupabase() {
  if (!_supabase) {
    _supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);
  }
  return _supabase;
}

const TABLE = 'user_integrations';

async function saveToken(userId, provider, { accessToken, refreshToken, expiresAt, scopes, metadata, status } = {}) {
  const row = {
    user_id: userId,
    provider,
    access_token: accessToken != null ? encrypt(accessToken) : null,
    refresh_token: refreshToken != null ? encrypt(refreshToken) : null,
    expires_at: expiresAt ? new Date(expiresAt).toISOString() : null,
    scopes: scopes || [],
    status: status || 'active',
    metadata: metadata || {},
    updated_at: new Date().toISOString(),
  };

  const { error } = await getSupabase()
    .from(TABLE)
    .upsert(row, { onConflict: 'user_id,provider' });

  if (error) throw new Error(`saveToken failed [${provider}]: ${error.message}`);
}

async function getToken(userId, provider) {
  const { data, error } = await getSupabase()
    .from(TABLE)
    .select('*')
    .eq('user_id', userId)
    .eq('provider', provider)
    .single();

  if (error || !data) return null;

  return {
    ...data,
    accessToken: data.access_token ? decrypt(data.access_token) : null,
    refreshToken: data.refresh_token ? decrypt(data.refresh_token) : null,
  };
}

function isExpired(row) {
  if (!row?.expires_at) return false;
  return new Date(row.expires_at) < new Date(Date.now() + 5 * 60 * 1000);
}

async function refreshGoogleToken(userId, provider) {
  const row = await getToken(userId, provider);
  if (!row?.refreshToken) throw new Error(`No refresh token for ${provider}`);

  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    `${process.env.BACKEND_URL}/api/integrations/${provider.replace('google-', '')}/callback`
  );
  oauth2Client.setCredentials({ refresh_token: row.refreshToken });

  const { credentials } = await oauth2Client.refreshAccessToken();

  await saveToken(userId, provider, {
    accessToken: credentials.access_token,
    refreshToken: credentials.refresh_token || row.refreshToken,
    expiresAt: credentials.expiry_date ? new Date(credentials.expiry_date) : null,
    scopes: row.scopes,
    metadata: row.metadata,
    status: 'active',
  });

  return credentials.access_token;
}

async function getValidAccessToken(userId, provider) {
  const row = await getToken(userId, provider);
  if (!row || row.status === 'disconnected') return null;

  if (isExpired(row) && row.refreshToken) {
    try {
      return await refreshGoogleToken(userId, provider);
    } catch {
      await getSupabase()
        .from(TABLE)
        .update({ status: 'error', updated_at: new Date().toISOString() })
        .eq('user_id', userId)
        .eq('provider', provider);
      return null;
    }
  }

  return row.accessToken;
}

async function deleteToken(userId, provider) {
  const { error } = await getSupabase()
    .from(TABLE)
    .update({
      status: 'disconnected',
      access_token: null,
      refresh_token: null,
      updated_at: new Date().toISOString(),
    })
    .eq('user_id', userId)
    .eq('provider', provider);

  if (error) throw new Error(`deleteToken failed [${provider}]: ${error.message}`);
}

async function getAllStatuses(userId) {
  const { data, error } = await getSupabase()
    .from(TABLE)
    .select('provider, status, expires_at, created_at, updated_at, metadata, scopes')
    .eq('user_id', userId)
    .neq('status', 'disconnected');

  if (error) throw new Error(`getAllStatuses failed: ${error.message}`);

  const result = {};
  for (const row of data || []) {
    result[row.provider] = {
      connected: row.status === 'active',
      status: row.status,
      expiresAt: row.expires_at,
      connectedAt: row.created_at,
      lastSync: row.updated_at,
      metadata: row.metadata || {},
      scopes: row.scopes || [],
    };
  }
  return result;
}

module.exports = { saveToken, getToken, isExpired, refreshGoogleToken, getValidAccessToken, deleteToken, getAllStatuses };
