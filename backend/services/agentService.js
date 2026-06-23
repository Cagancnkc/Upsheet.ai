'use strict';
const { createClient } = require('@supabase/supabase-js');
const Anthropic = require('@anthropic-ai/sdk');
const { getValidAccessToken } = require('./tokenManager');

let _supabase = null;
function getSupabase() {
  if (!_supabase) {
    _supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);
  }
  return _supabase;
}

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

// ─── Step Parsing ────────────────────────────────────────────────────────────

async function parseAgentSteps(prompt) {
  const FALLBACK = [{ step_index: 0, step_type: 'analyze', step_label: 'Komutu işle' }];
  try {
    const msg = await anthropic.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 512,
      system: `Sen bir operasyon asistanısın. Kullanıcının verdiği komutu JSON formatında adımlara böl.
Her adımda şu alanlar olsun: step_index (0'dan başlar), step_type, step_label.
step_type değerleri: read | analyze | send_slack | send_gmail | send_drive | send_hubspot
Sadece JSON array döndür, başka hiçbir şey yazma.
Örnek: [{"step_index":0,"step_type":"read","step_label":"Tabloyu oku"},{"step_index":1,"step_type":"analyze","step_label":"Özet çıkar"},{"step_index":2,"step_type":"send_slack","step_label":"Slack kanalına gönder"}]`,
      messages: [{ role: 'user', content: prompt }],
    });

    const text = msg.content[0]?.text?.trim() || '';
    const parsed = JSON.parse(text);
    if (!Array.isArray(parsed) || parsed.length === 0) return FALLBACK;
    return parsed;
  } catch {
    return FALLBACK;
  }
}

// ─── Step Execution ───────────────────────────────────────────────────────────

async function executeStep(runId, step, context) {
  const { step_type } = step;

  if (step_type === 'read') {
    const tableData = context?.table_data || null;
    return { data: tableData, rows: Array.isArray(tableData) ? tableData.length : 0 };
  }

  if (step_type === 'analyze') {
    const dataStr = context?.table_data
      ? JSON.stringify(context.table_data).slice(0, 4000)
      : context?.previous_output
        ? JSON.stringify(context.previous_output).slice(0, 4000)
        : '(veri yok)';

    const msg = await anthropic.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 1024,
      messages: [{
        role: 'user',
        content: `Aşağıdaki veriyi Türkçe olarak analiz et ve kısa bir özet çıkar:\n\n${dataStr}`,
      }],
    });
    const summary = msg.content[0]?.text?.trim() || '';
    return { summary };
  }

  if (step_type === 'send_slack') {
    const accessToken = await getValidAccessToken(context.user_id, 'slack');
    if (!accessToken) return { skipped: true, reason: 'Slack bağlı değil' };

    const channel = context?.channel_id || context?.slack_channel || 'general';
    const text = context?.previous_output?.summary
      || context?.message
      || step.step_label;

    const resp = await fetch('https://slack.com/api/chat.postMessage', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ channel, text }),
    });
    const data = await resp.json();
    if (!data.ok) throw new Error(`Slack API hatası: ${data.error}`);
    return { channel, ts: data.ts };
  }

  if (step_type === 'send_gmail') {
    const accessToken = await getValidAccessToken(context.user_id, 'google-gmail');
    if (!accessToken) return { skipped: true, reason: 'Gmail bağlı değil' };

    const to = context?.email_to;
    const subject = context?.email_subject || step.step_label;
    const body = context?.previous_output?.summary || context?.message || '';

    if (!to) return { skipped: true, reason: 'Alıcı e-posta adresi belirtilmedi' };

    const rawMessage = [
      `To: ${to}`,
      `Subject: ${subject}`,
      'Content-Type: text/plain; charset=utf-8',
      '',
      body,
    ].join('\r\n');
    const encoded = Buffer.from(rawMessage).toString('base64url');

    const resp = await fetch('https://gmail.googleapis.com/gmail/v1/users/me/messages/send', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ raw: encoded }),
    });
    const data = await resp.json();
    if (data.error) throw new Error(`Gmail API hatası: ${data.error.message}`);
    return { messageId: data.id };
  }

  if (step_type === 'send_drive') {
    const accessToken = await getValidAccessToken(context.user_id, 'google-drive');
    if (!accessToken) return { skipped: true, reason: 'Google Drive bağlı değil' };

    const fileName = context?.file_name || `agent_output_${Date.now()}.txt`;
    const content = context?.previous_output?.summary || context?.message || '';

    const metadata = JSON.stringify({ name: fileName, mimeType: 'text/plain' });
    const boundary = 'agent_boundary';
    const bodyParts = [
      `--${boundary}`,
      'Content-Type: application/json; charset=UTF-8',
      '',
      metadata,
      `--${boundary}`,
      'Content-Type: text/plain; charset=UTF-8',
      '',
      content,
      `--${boundary}--`,
    ].join('\r\n');

    const resp = await fetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': `multipart/related; boundary=${boundary}`,
      },
      body: bodyParts,
    });
    const data = await resp.json();
    if (data.error) throw new Error(`Drive API hatası: ${data.error.message}`);
    return { fileId: data.id, fileName: data.name };
  }

  if (step_type === 'send_hubspot') {
    const accessToken = await getValidAccessToken(context.user_id, 'hubspot');
    if (!accessToken) return { skipped: true, reason: 'HubSpot bağlı değil' };

    const noteBody = context?.previous_output?.summary || context?.message || step.step_label;
    const resp = await fetch('https://api.hubapi.com/crm/v3/objects/notes', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ properties: { hs_note_body: noteBody, hs_timestamp: Date.now() } }),
    });
    const data = await resp.json();
    if (data.status === 'error') throw new Error(`HubSpot API hatası: ${data.message}`);
    return { noteId: data.id };
  }

  return { skipped: true, reason: `Bilinmeyen adım tipi: ${step_type}` };
}

// ─── Log Helpers ──────────────────────────────────────────────────────────────

async function logStep(runId, step, status, extra = {}) {
  const sb = getSupabase();
  const base = {
    run_id: runId,
    step_index: step.step_index,
    step_type: step.step_type,
    step_label: step.step_label,
    status,
  };
  if (status === 'running') {
    await sb.from('agent_step_logs').insert({ ...base, started_at: new Date().toISOString() });
  } else {
    await sb.from('agent_step_logs')
      .update({ status, ...extra, completed_at: new Date().toISOString() })
      .eq('run_id', runId)
      .eq('step_index', step.step_index);
  }
}

async function touchRun(runId, extra = {}) {
  await getSupabase()
    .from('agent_runs')
    .update({ updated_at: new Date().toISOString(), ...extra })
    .eq('id', runId);
}

// ─── Main Orchestrator ────────────────────────────────────────────────────────

async function runAgent(runId, userId, prompt, context = {}) {
  const ctx = { ...context, user_id: userId };
  const sb = getSupabase();

  await touchRun(runId, { status: 'running' });

  let steps;
  try {
    steps = await parseAgentSteps(prompt);
  } catch (err) {
    await touchRun(runId, { status: 'failed', error: err.message });
    return;
  }

  await touchRun(runId, { steps: JSON.stringify(steps) });

  let anySuccess = false;
  let previousOutput = null;

  for (const step of steps) {
    await logStep(runId, step, 'running', { input: ctx });
    try {
      const stepCtx = { ...ctx, previous_output: previousOutput };
      const output = await executeStep(runId, step, stepCtx);
      await logStep(runId, step, 'completed', { output });
      previousOutput = output;
      if (!output?.skipped) anySuccess = true;
    } catch (err) {
      await logStep(runId, step, 'failed', { error: err.message });
    }
    await touchRun(runId);
  }

  const finalStatus = anySuccess ? 'completed' : 'failed';
  await touchRun(runId, {
    status: finalStatus,
    result: previousOutput ? JSON.stringify(previousOutput) : null,
  });
}

module.exports = { parseAgentSteps, executeStep, runAgent };
