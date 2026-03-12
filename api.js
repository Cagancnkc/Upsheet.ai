// Upsheet — Backend API wrapper (tarayıcıda yüklenir)
const API_BASE = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
  ? 'http://localhost:3001'
  : 'RAILWAY_URL_BURAYA';

async function processAICommand(message, sheetContext, sheetName, history) {
  let res;
  try {
    res = await fetch(`${API_BASE}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message, sheetContext, sheetName, history })
    });
  } catch (networkErr) {
    throw new Error('Sunucuya bağlanılamıyor. Backend çalışıyor mu?');
  }

  if (res.status === 500) {
    throw new Error('Sunucu hatası. Lütfen tekrar deneyin.');
  }

  if (res.status === 401 || res.status === 403) {
    throw new Error('AI servisi henüz yapılandırılmadı.');
  }

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || `Sunucu hatası: ${res.status}`);
  }

  const data = await res.json();
  return data.reply;
}
