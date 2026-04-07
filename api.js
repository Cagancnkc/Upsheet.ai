// MockSheets — Backend API wrapper (tarayıcıda yüklenir)
const API_URL = window.location.hostname === 'localhost'
  ? 'http://localhost:3001'
  : 'https://upsheet-ai.onrender.com';

function getAPIAuthToken() {
  try {
    const key = Object.keys(localStorage).find(k => k.startsWith('sb-') && k.endsWith('-auth-token'));
    if (!key) return null;
    const data = JSON.parse(localStorage.getItem(key));
    return data?.access_token || null;
  } catch { return null; }
}

async function callAPI(endpoint, body) {
  if (!API_URL) {
    return { error: 'offline', message: 'AI özelliği yakında aktif olacak' };
  }
  const token = getAPIAuthToken();
  let res;
  try {
    res = await fetch(`${API_URL}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': 'Bearer ' + token } : {})
      },
      body: JSON.stringify(body)
    });
  } catch (networkErr) {
    throw new Error('Sunucuya bağlanılamıyor. Backend çalışıyor mu?');
  }
  if (res.status === 500) throw new Error('Sunucu hatası. Lütfen tekrar deneyin.');
  if (res.status === 401) {
    window.location.href = 'auth.html';
    throw new Error('Giriş gerekli');
  }
  if (res.status === 429 || res.status === 403) {
    const errData = await res.json().catch(() => ({}));
    const err = new Error(errData.error || 'Limit aşıldı');
    err.status = res.status;
    err.data = errData;
    throw err;
  }
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || `Sunucu hatası: ${res.status}`);
  }
  return res.json();
}

async function processAICommand(message, sheetContext, sheetName, history) {
  const data = await callAPI('/api/chat', { message, sheetContext, sheetName, history });
  if (!data || data.error === 'offline') return data || { error: 'offline' };
  return data;
}
