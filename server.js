require('dotenv').config();
const express   = require('express');
const cors      = require('cors');
const helmet    = require('helmet');
const morgan    = require('morgan');
const rateLimit = require('express-rate-limit');
const Anthropic = require('@anthropic-ai/sdk');
const { createClient: createSupabase } = require('@supabase/supabase-js');

const app    = express();
const port   = process.env.PORT || 3001;
const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

// Supabase admin client (needs SUPABASE_SERVICE_KEY in .env for storage bypass)
const sbAdmin = createSupabase(
  process.env.SUPABASE_URL      || 'https://ogizbfzoywylljvnidak.supabase.co',
  process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_ANON_KEY || ''
);

// ── Rate limiters ────────────────────────────────────────────
// General: 200 req / 15 min per IP (all /api/ routes)
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Çok fazla istek gönderdiniz. 15 dakika bekleyin.' }
});

// AI-specific: 10 req / 1 min per IP (/api/chat only)
const chatLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'AI limitinize ulaştınız. 1 dakika bekleyin.' }
});

// ── Middleware stack ─────────────────────────────────────────
// Helmet security headers (CSP off — app serves static HTML files)
app.use(helmet({ contentSecurityPolicy: false }));

// CORS: whitelist localhost + Vercel + custom FRONTEND_URL
const allowedOrigins = [
  'http://localhost:8080',
  'http://localhost:3000',
  'http://127.0.0.1:5500',
  'https://upsheet-ai.vercel.app',
  process.env.FRONTEND_URL
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('CORS: Bu origin\'e izin verilmiyor'));
    }
  },
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  optionsSuccessStatus: 204
}));
app.options('*', cors()); // handle OPTIONS pre-flight for all routes

app.use(express.json({ limit: '2mb' }));

// Request logging (development only)
if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('[:date[iso]] :method :url :status :response-time ms'));
}

// Apply general rate limit to all /api/ routes
app.use('/api/', generalLimiter);

// ── Input validation helpers ─────────────────────────────────
function stripHtml(str) {
  return str.replace(/<[^>]*>/g, '').trim();
}

function validateChatBody(body) {
  const { message, sheetContext, history, sheetName } = body;

  // message — required
  if (!message || typeof message !== 'string')
    return 'Mesaj zorunludur';
  const cleanMsg = stripHtml(message);
  if (cleanMsg.length === 0)
    return 'Mesaj boş olamaz';
  if (cleanMsg.length > 2000)
    return 'Mesaj çok uzun (max 2000 karakter)';

  // sheetContext — optional
  if (sheetContext != null) {
    if (typeof sheetContext !== 'string')
      return 'sheetContext string olmalıdır';
    if (sheetContext.length > 50000)
      return 'Sayfa verisi çok büyük (max 50.000 karakter)';
  }

  // history — optional
  if (history != null) {
    if (!Array.isArray(history))
      return 'history dizi olmalıdır';
    if (history.length > 20)
      return 'Geçmiş çok uzun (max 20 mesaj)';
    for (const item of history) {
      if (!item || typeof item !== 'object')
        return 'Geçmiş elemanları nesne olmalıdır';
      if (!['user', 'assistant'].includes(item.role))
        return 'Geçersiz mesaj rolü';
      if (typeof item.content !== 'string' || item.content.length > 5000)
        return 'Geçmiş mesajı çok uzun (max 5000 karakter)';
    }
  }

  // sheetName — optional
  if (sheetName != null) {
    if (typeof sheetName !== 'string' || sheetName.length > 100)
      return 'Sayfa adı çok uzun (max 100 karakter)';
  }

  return null; // valid
}

// ── Routes ───────────────────────────────────────────────────
app.get('/', (_req, res) => {
  res.json({ status: 'ok', service: 'Upsheet API', version: '1.0.0' });
});

app.get('/api/health', (_req, res) => {
  res.json({
    status:    'ok',
    timestamp: new Date().toISOString(),
    anthropic: !!process.env.ANTHROPIC_API_KEY,
    uptime:    process.uptime()
  });
});

app.post('/api/chat', chatLimiter, async (req, res, next) => {
  const validationError = validateChatBody(req.body);
  if (validationError) return res.status(400).json({ error: validationError });

  const {
    message,
    sheetContext = '',
    history      = [],
    sheetName    = 'Sheet1'
  } = req.body;

  const cleanMessage = stripHtml(message);

  const systemPrompt = `Sen bir Excel AI asistanısın. Kullanıcının Excel verilerini analiz et, formüller öner, içgörüler sun.
Aktif sheet: "${sheetName}"
İlk 20 satır, 10 sütun verisi:
${sheetContext || '(Veri yok)'}

Kısa, net ve Türkçe yanıtlar ver. Formül önerilerinde Excel formatını kullan (=TOPLA(), =ORTALAMA() vb.).`;

  const messages = [
    ...history.slice(-8).map(m => ({ role: m.role, content: m.content })),
    { role: 'user', content: cleanMessage }
  ];

  try {
    const response = await client.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 1024,
      system: systemPrompt,
      messages
    });
    res.json({ reply: response.content[0].text });
  } catch (err) {
    next(err); // → global error handler
  }
});

// ── Shared file download ──────────────────────────────────────
app.get('/api/shared/:token', async (req, res, next) => {
  try {
    const { token } = req.params;
    if (!token || token.length < 10) return res.status(400).json({ error: 'Geçersiz token' });

    // Look up file by share token
    const { data: file, error: dbErr } = await sbAdmin
      .from('files')
      .select('*')
      .eq('share_token', token)
      .eq('is_shared', true)
      .single();

    if (dbErr || !file) return res.status(404).json({ error: 'Paylaşım bulunamadı veya kaldırılmış' });

    // Download from storage
    const { data: blob, error: storageErr } = await sbAdmin.storage
      .from('excel-files')
      .download(file.storage_path);

    if (storageErr || !blob) return res.status(502).json({ error: 'Dosya indirilemedi' });

    const arrayBuffer = await blob.arrayBuffer();
    const buffer      = Buffer.from(arrayBuffer);

    res.setHeader('Content-Type',        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `inline; filename="${encodeURIComponent(file.name)}"`);
    res.setHeader('Content-Length',      buffer.length);
    res.send(buffer);
  } catch (err) {
    next(err);
  }
});

// ── Global error handler ─────────────────────────────────────
// 4-argument signature is required by Express to recognise as error handler
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, _next) => {
  console.error(`[ERROR] ${req.method} ${req.path}:`, err.message);

  let msg    = 'Beklenmeyen bir hata oluştu';
  let status = 500;
  const m    = (err.message || '').toLowerCase();

  if (err.status === 401 || m.includes('api key') || m.includes('authentication')) {
    msg = 'AI servisi yapılandırma hatası';
  } else if (err.status === 429 || m.includes('rate limit') || m.includes('overloaded')) {
    msg    = 'AI servisi şu an yoğun, 1 dakika bekleyin';
    status = 429;
  } else if (err.code === 'ECONNREFUSED' || err.code === 'ENOTFOUND' || err.name === 'FetchError') {
    msg    = 'Bağlantı hatası, tekrar deneyin';
    status = 503;
  }

  res.status(status).json({ error: msg });
});

// ── Start ────────────────────────────────────────────────────
app.listen(port, () => console.log(`Upsheet API → http://localhost:${port}`));
