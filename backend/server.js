import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import Anthropic from '@anthropic-ai/sdk';

const app    = express();
const port   = process.env.PORT || 3001;
const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

app.use(cors({ origin: process.env.FRONTEND_URL || '*' }));
app.use(express.json({ limit: '2mb' }));

app.get('/', (_req, res) => res.json({ status: 'ok', service: 'ExcelAI Backend' }));

app.post('/api/chat', async (req, res) => {
  const { message, sheetContext, history = [], sheetName = 'Sheet1' } = req.body;
  if (!message) return res.status(400).json({ error: 'message gerekli' });

  const systemPrompt = `Sen bir Excel AI asistanısın. Kullanıcının Excel verilerini analiz et, formüller öner, içgörüler sun.
Aktif sheet: "${sheetName}"
İlk 20 satır, 10 sütun verisi:
${sheetContext || '(Veri yok)'}

Kısa, net ve Türkçe yanıtlar ver. Formül önerilerinde Excel formatını kullan (=TOPLA(), =ORTALAMA() vb.).`;

  const messages = [
    ...history.slice(-8).map(m => ({ role: m.role, content: m.content })),
    { role: 'user', content: message }
  ];

  const response = await client.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 1024,
    system: systemPrompt,
    messages
  });

  res.json({ reply: response.content[0].text });
});

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ error: err.message });
});

app.listen(port, () => console.log(`ExcelAI backend → http://localhost:${port}`));
