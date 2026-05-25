const Anthropic = require('@anthropic-ai/sdk');
require('dotenv').config();
const express = require('express');
const cors    = require('cors');
const fetch   = require('node-fetch');
const { processExcelCommand } = require('./rag/pipeline');
const tokenManager = require('./services/tokenManager');
const { createClient: _createSbClient } = require('@supabase/supabase-js');

let _sbForAuth = null;
function getSbForAuth() {
  if (!_sbForAuth) _sbForAuth = _createSbClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);
  return _sbForAuth;
}
async function getUserIdFromState(state) {
  if (!state) return null;
  try {
    const { data: { user } } = await getSbForAuth().auth.getUser(state);
    return user?.id || null;
  } catch { return null; }
}

const UPSHEET_KNOWLEDGE_BASE = {

  excel_formulas: {
    TOPLA: "=SUM(A1:A10) — Belirtilen aralığın toplamı",
    ORTALAMA: "=AVERAGE(A1:A10) — Ortalama değer",
    EĞER: "=IF(A1>0,'Pozitif','Negatif') — Koşullu değer",
    DÜŞEY_ARA: "=VLOOKUP(aranan,tablo,sütun,0) — Dikey arama",
    YATAY_ARA: "=HLOOKUP(aranan,tablo,satır,0) — Yatay arama",
    BAĞ_DEĞ_SAY: "=COUNTIF(A1:A10,'>0') — Koşullu sayma",
    ETOPLA: "=SUMIF(A1:A10,'>0',B1:B10) — Koşullu toplama",
    MAKS: "=MAX(A1:A10) — En büyük değer",
    MIN: "=MIN(A1:A10) — En küçük değer",
    UZUNLUK: "=LEN(A1) — Karakter sayısı",
    KIRP: "=TRIM(A1) — Baştaki/sondaki boşlukları kaldır",
    BİRLEŞTİR: "=CONCATENATE(A1,' ',B1) — Hücreleri birleştir",
    METNE_ÇEVİR: "=TEXT(A1,'DD.MM.YYYY') — Tarihi metne çevir",
    PARÇAAL: "=MID(A1,2,3) — Metinden parça al",
    BÜYÜKHARF: "=UPPER(A1) — Büyük harfe çevir",
    KÜÇÜKHARF: "=LOWER(A1) — Küçük harfe çevir",
    YUVARLAK: "=ROUND(A1,2) — Yuvarla",
    MUTLAK: "=ABS(A1) — Mutlak değer",
    BUGÜN: "=TODAY() — Bugünün tarihi",
    ŞİMDİ: "=NOW() — Şimdiki tarih ve saat",
  },

  accounting_terms: {
    KDV: "Katma Değer Vergisi — Türkiye'de %20 (genel), %10 (indirimli), %1 (özel)",
    KDV_HESAP: "KDV Dahil = Net Tutar × 1.20 | KDV Hariç = KDV Dahil / 1.20",
    BRÜT_MAAŞ: "Çalışanın işverene toplam maliyeti (SGK dahil)",
    NET_MAAŞ: "Çalışanın eline geçen tutar (kesintiler sonrası)",
    SGK_İŞÇİ: "İşçi SGK payı: %14 (emeklilik %9 + sağlık %5)",
    SGK_İŞVEREN: "İşveren SGK payı: %20.5",
    GELİR_VERGİSİ: "Dilimler: %15, %20, %27, %35, %40",
    ASGARI_ÜCRET: "2025: 22.104 TL (brüt)",
    KAR_MARJI: "(Gelir - Gider) / Gelir × 100",
    CARİ_ORAN: "Dönen Varlıklar / Kısa Vadeli Borçlar",
    ROI: "(Kazanç - Maliyet) / Maliyet × 100",
    EBITDA: "Faiz, Vergi, Amortisman Öncesi Kâr",
  },

  colors: {
    kırmızı: "#fecaca",
    turuncu: "#fed7aa",
    sarı: "#fef08a",
    yeşil: "#bbf7d0",
    mavi: "#bfdbfe",
    mor: "#e9d5ff",
    pembe: "#fce7f3",
    gri: "#f3f4f6",
    siyah: "#000000",
    beyaz: "#ffffff",
  },

  date_formats: {
    tr_short: "GG.AA.YYYY",
    tr_long: "GG MMMM YYYY",
    tr_months: {
      1: "Ocak", 2: "Şubat", 3: "Mart", 4: "Nisan",
      5: "Mayıs", 6: "Haziran", 7: "Temmuz", 8: "Ağustos",
      9: "Eylül", 10: "Ekim", 11: "Kasım", 12: "Aralık"
    }
  },

  common_tasks: {
    monthly_report: [
      "Aylık satış toplamı",
      "Ürün bazlı grupla",
      "Önceki ayla karşılaştır",
      "Grafik oluştur"
    ],
    data_cleaning: [
      "Boş satırları sil",
      "Tekrar edenleri kaldır",
      "Format düzelt",
      "Büyük/küçük harf normalize et"
    ],
    financial_analysis: [
      "Gelir-gider tablosu",
      "KDV hesaplama",
      "Kâr marjı analizi",
      "Bütçe vs gerçek karşılaştırma"
    ]
  }
};

const helmet = require('helmet');
const app    = express();
const PORT = process.env.PORT || 3001;
const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:8080',
  'https://upsheet-ai.vercel.app',
  'https://mocksheets.com',
  'https://www.mocksheets.com',
  process.env.FRONTEND_URL,
  process.env.CLIENT_URL
].filter(Boolean);

app.use(helmet({ crossOriginResourcePolicy: false }));
app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('CORS hatası'));
    }
  },
  credentials: true
}));
app.use(express.json({ limit: '2mb' }));

const rateLimit = require('express-rate-limit');
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Çok fazla istek. Lütfen 15 dakika sonra tekrar deneyin.' }
});
const aiLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 15,
  message: { error: 'AI istek limiti aşıldı. 1 dakika sonra tekrar deneyin.' }
});
app.use('/api/', generalLimiter);
app.use('/api/ai', aiLimiter);
app.use('/api/batch-ai', aiLimiter);

const integrationsRouter = require('./routes/integrations');
const stripeRouter = require('./routes/stripe');
const promosRouter = require('./routes/promos');
const automationsRouter = require('./routes/automations');
const { checkLimit, incrementUsage, requireFeature, getOrCreateUsage } = require('./middleware/limits');
const PLANS = require('./config/plans');
// OAuth endpoints — auth middleware'den önce kayıtlı (browser popup header gönderemez)
app.get('/api/integrations/drive/auth', (req, res) => {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  if (!clientId) return res.status(500).send('<p>Google OAuth yapılandırılmamış</p>');
  const base = process.env.BACKEND_URL || `http://localhost:${process.env.PORT || 3001}`;
  const redirectUri = base + '/api/integrations/drive/callback';
  const scope = 'https://www.googleapis.com/auth/drive.file';
  const state = req.query.token || '';
  res.redirect(`https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code&scope=${encodeURIComponent(scope)}&access_type=offline&prompt=consent&state=${encodeURIComponent(state)}`);
});

app.get('/api/integrations/drive/callback', async (req, res) => {
  const origin = process.env.FRONTEND_URL || 'https://mocksheets.com';
  const { code, error, state } = req.query;
  if (error || !code) return res.send(`<script>window.opener?.postMessage({type:'drive_auth',error:${JSON.stringify(error || 'cancelled')}},${JSON.stringify(origin)});window.close();</script>`);
  const base = process.env.BACKEND_URL || `http://localhost:${process.env.PORT || 3001}`;
  try {
    const r = await fetch('https://oauth2.googleapis.com/token', { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: new URLSearchParams({ code, client_id: process.env.GOOGLE_CLIENT_ID, client_secret: process.env.GOOGLE_CLIENT_SECRET, redirect_uri: base + '/api/integrations/drive/callback', grant_type: 'authorization_code' }) });
    const tokens = await r.json();
    if (tokens.access_token) {
      const userId = await getUserIdFromState(state);
      if (userId) {
        await tokenManager.saveToken(userId, 'google-drive', {
          accessToken: tokens.access_token,
          refreshToken: tokens.refresh_token || null,
          expiresAt: tokens.expires_in ? new Date(Date.now() + tokens.expires_in * 1000) : null,
          scopes: (tokens.scope || '').split(' ').filter(Boolean),
          metadata: {},
        }).catch(e => console.error('[drive/callback] saveToken failed:', e.message));
      }
      res.send(`<script>window.opener?.postMessage({type:'drive_auth',token:${JSON.stringify(tokens.access_token)},connected:true},${JSON.stringify(origin)});window.close();</script>`);
    } else {
      res.send(`<script>window.opener?.postMessage({type:'drive_auth',error:'Token alınamadı'},${JSON.stringify(origin)});window.close();</script>`);
    }
  } catch (err) { res.send(`<script>window.opener?.postMessage({type:'drive_auth',error:${JSON.stringify(err.message)}},${JSON.stringify(origin)});window.close();</script>`); }
});

app.get('/api/integrations/sheets/auth', (req, res) => {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  if (!clientId) return res.status(500).send('<p>Google OAuth yapılandırılmamış</p>');
  const base = process.env.BACKEND_URL || `http://localhost:${process.env.PORT || 3001}`;
  const redirectUri = base + '/api/integrations/sheets/callback';
  const scopes = 'https://www.googleapis.com/auth/spreadsheets https://www.googleapis.com/auth/drive.file';
  const state = req.query.token || '';
  res.redirect(`https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code&scope=${encodeURIComponent(scopes)}&access_type=offline&prompt=consent&state=${encodeURIComponent(state)}`);
});

app.get('/api/integrations/sheets/callback', async (req, res) => {
  const origin = process.env.FRONTEND_URL || 'https://mocksheets.com';
  const { code, error, state } = req.query;
  if (error || !code) return res.send(`<script>window.opener?.postMessage({type:'sheets_auth',error:${JSON.stringify(error || 'cancelled')}},${JSON.stringify(origin)});window.close();</script>`);
  const base = process.env.BACKEND_URL || `http://localhost:${process.env.PORT || 3001}`;
  try {
    const r = await fetch('https://oauth2.googleapis.com/token', { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: new URLSearchParams({ code, client_id: process.env.GOOGLE_CLIENT_ID, client_secret: process.env.GOOGLE_CLIENT_SECRET, redirect_uri: base + '/api/integrations/sheets/callback', grant_type: 'authorization_code' }) });
    const tokens = await r.json();
    if (tokens.access_token) {
      const userId = await getUserIdFromState(state);
      if (userId) {
        await tokenManager.saveToken(userId, 'google-sheets', {
          accessToken: tokens.access_token,
          refreshToken: tokens.refresh_token || null,
          expiresAt: tokens.expires_in ? new Date(Date.now() + tokens.expires_in * 1000) : null,
          scopes: (tokens.scope || '').split(' ').filter(Boolean),
          metadata: {},
        }).catch(e => console.error('[sheets/callback] saveToken failed:', e.message));
      }
      res.send(`<script>window.opener?.postMessage({type:'sheets_auth',tokens:${JSON.stringify(tokens)},connected:true},${JSON.stringify(origin)});window.close();</script>`);
    } else {
      res.send(`<script>window.opener?.postMessage({type:'sheets_auth',error:${JSON.stringify(tokens.error_description || 'Token alınamadı')}},${JSON.stringify(origin)});window.close();</script>`);
    }
  } catch (err) { res.send(`<script>window.opener?.postMessage({type:'sheets_auth',error:${JSON.stringify(err.message)}},${JSON.stringify(origin)});window.close();</script>`); }
});

app.get('/api/integrations/excel/auth', (_req, res) => {
  const clientId = process.env.MSFT_CLIENT_ID;
  if (!clientId) return res.status(500).send('<p>MSFT_CLIENT_ID eksik</p>');
  const base = process.env.BACKEND_URL || `http://localhost:${process.env.PORT || 3001}`;
  const redirectUri = base + '/api/integrations/excel/callback';
  res.redirect(`https://login.microsoftonline.com/common/oauth2/v2.0/authorize?client_id=${clientId}&response_type=code&redirect_uri=${encodeURIComponent(redirectUri)}&response_mode=query&scope=${encodeURIComponent('Files.ReadWrite User.Read offline_access')}`);
});

app.get('/api/integrations/excel/callback', async (req, res) => {
  const origin = process.env.FRONTEND_URL || 'https://mocksheets.com';
  const { code, error } = req.query;
  if (error || !code) return res.send(`<script>window.opener?.postMessage({type:'excel_auth',error:${JSON.stringify(error||'cancelled')}},${JSON.stringify(origin)});window.close();</script>`);
  const base = process.env.BACKEND_URL || `http://localhost:${process.env.PORT || 3001}`;
  try {
    const r = await fetch('https://login.microsoftonline.com/common/oauth2/v2.0/token', {
      method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({ client_id: process.env.MSFT_CLIENT_ID, client_secret: process.env.MSFT_CLIENT_SECRET, code, redirect_uri: base + '/api/integrations/excel/callback', grant_type: 'authorization_code', scope: 'Files.ReadWrite User.Read offline_access' })
    });
    const tokens = await r.json();
    if (tokens.access_token) {
      const expiry = Date.now() + (tokens.expires_in || 3600) * 1000;
      res.send(`<script>window.opener?.postMessage({type:'excel_auth',tokens:${JSON.stringify({ access_token: tokens.access_token, refresh_token: tokens.refresh_token, expiry })}},${JSON.stringify(origin)});window.close();</script>`);
    } else {
      const msg = tokens.error_description || tokens.error || 'Token alınamadı';
      res.send(`<script>window.opener?.postMessage({type:'excel_auth',error:${JSON.stringify(msg)}},${JSON.stringify(origin)});window.close();</script>`);
    }
  } catch (err) { res.send(`<script>window.opener?.postMessage({type:'excel_auth',error:${JSON.stringify(err.message)}},${JSON.stringify(origin)});window.close();</script>`); }
});

// Gmail OAuth
app.get('/api/integrations/gmail/auth', (req, res) => {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  if (!clientId) return res.status(500).send('<p>Google OAuth yapılandırılmamış</p>');
  const base = process.env.BACKEND_URL || `http://localhost:${process.env.PORT || 3001}`;
  const redirectUri = base + '/api/integrations/gmail/callback';
  const scopes = [
    'https://www.googleapis.com/auth/gmail.send',
    'https://www.googleapis.com/auth/gmail.compose',
    'https://www.googleapis.com/auth/gmail.readonly',
  ].join(' ');
  const state = req.query.token || '';
  res.redirect(`https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code&scope=${encodeURIComponent(scopes)}&access_type=offline&prompt=consent&state=${encodeURIComponent(state)}`);
});

app.get('/api/integrations/gmail/callback', async (req, res) => {
  const origin = process.env.FRONTEND_URL || 'https://mocksheets.com';
  const { code, error, state } = req.query;
  if (error || !code) return res.send(`<script>window.opener?.postMessage({type:'gmail_auth',error:${JSON.stringify(error || 'cancelled')}},${JSON.stringify(origin)});window.close();</script>`);
  const base = process.env.BACKEND_URL || `http://localhost:${process.env.PORT || 3001}`;
  try {
    const r = await fetch('https://oauth2.googleapis.com/token', { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: new URLSearchParams({ code, client_id: process.env.GOOGLE_CLIENT_ID, client_secret: process.env.GOOGLE_CLIENT_SECRET, redirect_uri: base + '/api/integrations/gmail/callback', grant_type: 'authorization_code' }) });
    const tokens = await r.json();
    if (tokens.access_token) {
      const userId = await getUserIdFromState(state);
      if (userId) {
        await tokenManager.saveToken(userId, 'gmail', {
          accessToken: tokens.access_token,
          refreshToken: tokens.refresh_token || null,
          expiresAt: tokens.expires_in ? new Date(Date.now() + tokens.expires_in * 1000) : null,
          scopes: (tokens.scope || '').split(' ').filter(Boolean),
          metadata: {},
        }).catch(e => console.error('[gmail/callback] saveToken failed:', e.message));
      }
      res.send(`<script>window.opener?.postMessage({type:'gmail_auth',connected:true},${JSON.stringify(origin)});window.close();</script>`);
    } else {
      res.send(`<script>window.opener?.postMessage({type:'gmail_auth',error:${JSON.stringify(tokens.error_description || 'Token alınamadı')}},${JSON.stringify(origin)});window.close();</script>`);
    }
  } catch (err) { res.send(`<script>window.opener?.postMessage({type:'gmail_auth',error:${JSON.stringify(err.message)}},${JSON.stringify(origin)});window.close();</script>`); }
});

// Notion OAuth
app.get('/api/integrations/notion/auth', (req, res) => {
  const clientId = process.env.NOTION_CLIENT_ID;
  if (!clientId) return res.status(500).send('<p>Notion OAuth yapılandırılmamış. NOTION_CLIENT_ID eksik.</p>');
  const base = process.env.BACKEND_URL || `http://localhost:${process.env.PORT || 3001}`;
  const redirectUri = process.env.NOTION_REDIRECT_URI || (base + '/api/integrations/notion/callback');
  const state = req.query.token || '';
  const params = new URLSearchParams({ client_id: clientId, response_type: 'code', owner: 'user', redirect_uri: redirectUri, state });
  res.redirect(`https://api.notion.com/v1/oauth/authorize?${params}`);
});

app.get('/api/integrations/notion/callback', async (req, res) => {
  const origin = process.env.FRONTEND_URL || 'https://mocksheets.com';
  const { code, error, state } = req.query;
  if (error || !code) return res.send(`<script>window.opener?.postMessage({type:'notion_auth',error:${JSON.stringify(error || 'cancelled')}},${JSON.stringify(origin)});window.close();</script>`);
  const base = process.env.BACKEND_URL || `http://localhost:${process.env.PORT || 3001}`;
  const redirectUri = process.env.NOTION_REDIRECT_URI || (base + '/api/integrations/notion/callback');
  try {
    const r = await fetch('https://api.notion.com/v1/oauth/token', {
      method: 'POST',
      headers: {
        'Authorization': 'Basic ' + Buffer.from(`${process.env.NOTION_CLIENT_ID}:${process.env.NOTION_CLIENT_SECRET}`).toString('base64'),
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ grant_type: 'authorization_code', code, redirect_uri: redirectUri }),
    });
    const data = await r.json();
    if (data.access_token) {
      const userId = await getUserIdFromState(state);
      if (userId) {
        await tokenManager.saveToken(userId, 'notion', {
          accessToken: data.access_token,
          refreshToken: null,
          expiresAt: null,
          scopes: ['read_content', 'insert_content', 'update_content'],
          metadata: {
            workspace_name: data.workspace_name,
            workspace_id: data.workspace_id,
            bot_id: data.bot_id,
          },
        }).catch(e => console.error('[notion/callback] saveToken failed:', e.message));
      }
      res.send(`<script>window.opener?.postMessage({type:'notion_auth',connected:true},${JSON.stringify(origin)});window.close();</script>`);
    } else {
      res.send(`<script>window.opener?.postMessage({type:'notion_auth',error:${JSON.stringify(data.error || 'Token alınamadı')}},${JSON.stringify(origin)});window.close();</script>`);
    }
  } catch (err) { res.send(`<script>window.opener?.postMessage({type:'notion_auth',error:${JSON.stringify(err.message)}},${JSON.stringify(origin)});window.close();</script>`); }
});

app.use('/api/integrations', checkLimit, requireFeature('integrations'), integrationsRouter);
app.use('/api/automations', automationsRouter);
app.use('/api/stripe', stripeRouter);
app.use('/api/promos', promosRouter);
const pdfRouter = require('./routes/pdf');
app.use('/api/pdf', pdfRouter);

app.get('/', (req, res) => {
  res.json({ status: 'ok', service: 'Mocksheets API', version: '1.2.0' });
});

app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.post('/api/chat', checkLimit, async (req, res) => {
  try {
    const { message, sheetContext, sheetData, sheetName, history } = req.body;
    if (!message || !message.trim())
      return res.status(400).json({ error: 'Mesaj boş olamaz' });

    if (message.length > 2000)
      return res.status(400).json({ error: 'Komut çok uzun (max 2000 karakter)' });

    let sheetArr = sheetContext || sheetData || [];
    if (sheetArr.length > 200) sheetArr = sheetArr.slice(0, 200);

    const result = await processExcelCommand(message.trim(), sheetArr, history || []);

    await incrementUsage(req.user.id);

    const plan = req.plan;
    const usage = req.usage;
    const monthLimit = plan.ai_commands_per_month;
    const remaining = monthLimit === Infinity
      ? null
      : Math.max(0, monthLimit - (usage.ai_commands_used_month + 1));

    res.json({
      ...result,
      usage: {
        plan: usage.plan,
        commands_used_today: usage.ai_commands_used_today + 1,
        commands_used_month: usage.ai_commands_used_month + 1,
        daily_limit: plan.ai_commands_per_day === Infinity ? null : plan.ai_commands_per_day,
        monthly_limit: monthLimit === Infinity ? null : monthLimit,
        remaining_this_month: remaining
      }
    });
  } catch (error) {
    console.error('/api/chat hatası:', error);
    res.status(500).json({ action: 'message', changes: [], reply: 'Sunucu hatası. Lütfen tekrar deneyin.' });
  }
});

app.get('/api/usage', async (req, res) => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ error: 'Giriş gerekli' });

  const { createClient } = require('@supabase/supabase-js');
  const sb = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);

  const { data: { user }, error } = await sb.auth.getUser(token);
  if (error || !user) return res.status(401).json({ error: 'Geçersiz token' });

  const usage = await getOrCreateUsage(user.id);
  const plan = PLANS[usage.plan] || PLANS.free;

  res.json({
    plan: usage.plan,
    plan_name: plan.displayName,
    badge: plan.badge,
    limits: {
      ai_commands_per_day: plan.ai_commands_per_day === Infinity ? null : plan.ai_commands_per_day,
      ai_commands_per_month: plan.ai_commands_per_month === Infinity ? null : plan.ai_commands_per_month,
      max_rows: plan.max_rows,
      max_file_size_mb: plan.max_file_size_mb
    },
    used: {
      today: usage.ai_commands_used_today,
      this_month: usage.ai_commands_used_month
    },
    remaining: {
      today: plan.ai_commands_per_day === Infinity
        ? null
        : Math.max(0, plan.ai_commands_per_day - usage.ai_commands_used_today),
      this_month: plan.ai_commands_per_month === Infinity
        ? null
        : Math.max(0, plan.ai_commands_per_month - usage.ai_commands_used_month)
    },
    features: {
      integrations: plan.integrations,
      auto_report: plan.auto_report,
      competitor_analysis: plan.competitor_analysis,
      accounting_formulas: plan.accounting_formulas
    },
    subscription_status: usage.subscription_status,
    plan_ends_at: usage.plan_ends_at
  });
});


// ── Sentiment Analysis Endpoint ──────────────────────────────────────────────
app.post('/api/sentiment', checkLimit, async (req, res) => {
  try {
    const { texts } = req.body;
    if (!texts || !texts.length) return res.status(400).json({ error: 'Metin gerekli' });

    const limited = texts.slice(0, 50);
    const response = await client.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 500,
      messages: [{
        role: 'user',
        content: `Aşağıdaki metinlerin her biri için duygu analizi yap.
Sadece JSON array döndür: ["Pozitif", "Negatif", "Nötr", ...]
Sıra korunmalı. Başka açıklama yazma.

Metinler:
${limited.map((t, i) => `${i + 1}. ${String(t).slice(0, 200)}`).join('\n')}`
      }]
    });

    const raw = response.content[0].text.trim();
    const match = raw.match(/\[[\s\S]*\]/);
    const labels = match ? JSON.parse(match[0]) : limited.map(() => 'Nötr');
    res.json({ labels });
  } catch (e) {
    console.error('/api/sentiment hatası:', e.message);
    res.status(500).json({ error: e.message });
  }
});

// ── Batch AI Endpoint ─────────────────────────────────────────────────────────
app.post('/api/batch-ai', checkLimit, async (req, res) => {
  try {
    const { task, text } = req.body;
    if (!text) return res.status(400).json({ error: 'Metin gerekli' });

    const prompts = {
      summarize:            `Şu metni 1-2 cümleyle özetle (Türkçe, sadece özeti yaz): "${String(text).slice(0, 500)}"`,
      translate:            `Şu metni Türkçeye çevir, sadece çeviriyi yaz: "${String(text).slice(0, 500)}"`,
      generate_description: `Şu ürün için kısa açıklama yaz (max 50 kelime, Türkçe): "${String(text).slice(0, 300)}"`,
      classify:             `Şu metni bir kategoriye yerleştir. Sadece kategori adını yaz (max 3 kelime): "${String(text).slice(0, 300)}"`,
      extract_keywords:     `Şu metinden 3-5 anahtar kelime çıkar. Virgülle ayır, başka bir şey yazma: "${String(text).slice(0, 500)}"`
    };

    const prompt = prompts[task] || prompts.summarize;
    const response = await client.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 200,
      messages: [{ role: 'user', content: prompt }]
    });

    res.json({ result: response.content[0].text.trim() });
  } catch (e) {
    console.error('/api/batch-ai hatası:', e.message);
    res.status(500).json({ error: 'Sunucu hatası. Lütfen tekrar deneyin.' });
  }
});

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ error: 'Sunucu hatası. Lütfen tekrar deneyin.' });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server ${PORT} portunda çalışıyor`);

  // Initialize server-side automation scheduler
  try {
    const scheduler = require('./services/scheduler');
    scheduler.loadAndScheduleAll().catch(e => console.error('[scheduler] Init error:', e.message));
  } catch (e) { console.error('[scheduler] Load error:', e.message); }

  // Render free tier'ı uyanık tut: her 14 dakikada self-ping
  const SELF_URL = process.env.RENDER_EXTERNAL_URL || `http://localhost:${PORT}`;
  const _pingMod = SELF_URL.startsWith('https') ? require('https') : require('http');
  setInterval(() => {
    _pingMod.get(`${SELF_URL}/health`, (r) => {
      console.log(`[keep-alive] ping → ${r.statusCode}`);
      r.resume();
    }).on('error', (e) => {
      console.warn('[keep-alive] ping başarısız:', e.message);
    });
  }, 14 * 60 * 1000);
});
