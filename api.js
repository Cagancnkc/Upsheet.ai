// MockSheets — Backend API wrapper (tarayıcıda yüklenir)
const API_URL = window.location.hostname === 'localhost'
  ? 'http://localhost:3001'
  : 'https://upsheet-ai.onrender.com';

async function callAPI(endpoint, body) {
  if (!API_URL) {
    return { error: 'offline', message: 'AI özelliği yakında aktif olacak' };
  }
  let res;
  try {
    res = await fetch(`${API_URL}${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });
  } catch (networkErr) {
    throw new Error('Sunucuya bağlanılamıyor. Backend çalışıyor mu?');
  }
  if (res.status === 500) throw new Error('Sunucu hatası. Lütfen tekrar deneyin.');
  if (res.status === 401 || res.status === 403) throw new Error('AI servisi henüz yapılandırılmadı.');
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || `Sunucu hatası: ${res.status}`);
  }
  return res.json();
}

async function processAICommand(message, sheetContext, sheetName, history) {
  const data = await callAPI('/api/chat', { message, sheetContext, sheetName, history });
  if (!data || data.error === 'offline') return data || { error: 'offline' };
  return data.reply;
}
