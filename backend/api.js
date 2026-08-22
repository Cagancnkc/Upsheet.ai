// Mocksheets — Backend API wrapper (tarayıcıda yüklenir)
const API_BASE = 'http://localhost:3001';

async function processAICommand(message, sheetContext, sheetName, history) {
  const res = await fetch(`${API_BASE}/api/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message, sheetContext, sheetName, history })
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || `Sunucu hatası: ${res.status}`);
  }
  const data = await res.json();
  return data.reply;
}
