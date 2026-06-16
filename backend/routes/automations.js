'use strict';
const express = require('express');
const router = express.Router();
const { createClient } = require('@supabase/supabase-js');
const Anthropic = require('@anthropic-ai/sdk');
const fetch = require('node-fetch');

function getSupabase() {
  return createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);
}

async function requireAuth(req, res, next) {
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ error: 'Giriş gerekli' });

  const sb = getSupabase();
  const { data: { user }, error } = await sb.auth.getUser(token);
  if (error || !user) return res.status(401).json({ error: 'Geçersiz token' });

  req.user = user;
  req.supabase = sb;
  req.authToken = token;
  next();
}

// Execute a single action against the backend integrations API
// userId is only needed when authToken is the service key (scheduler context)
async function executeAction(action, matchedRows, authToken, backendUrl, userId) {
  const base = backendUrl || process.env.BACKEND_URL || 'http://localhost:3001';
  const headers = { 'Content-Type': 'application/json', Authorization: `Bearer ${authToken}` };
  if (userId) headers['x-user-id'] = userId;
  const type = action.type;

  try {
    if (type === 'gmail') {
      const row = matchedRows[0] || {};
      const interpolate = (s = '') => s.replace(/\{([^}]+)\}/g, (_, k) => row[k] ?? k);
      const resp = await fetch(`${base}/api/integrations/gmail/send`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          to: interpolate(action.to),
          subject: interpolate(action.subject),
          body: interpolate(action.body || action.message || ''),
        }),
      });
      const data = await resp.json();
      return { type, status: resp.ok ? 'success' : 'error', result: data };
    }

    if (type === 'slack') {
      const row = matchedRows[0] || {};
      const interpolate = (s = '') => s.replace(/\{([^}]+)\}/g, (_, k) => row[k] ?? k);
      const cfg = action.webhookUrl
        ? { webhookUrl: action.webhookUrl, title: interpolate(action.subject || action.title || 'Otomasyon'), message: interpolate(action.body || action.message || '') }
        : null;
      if (!cfg) return { type, status: 'skipped', result: { reason: 'No webhook URL' } };
      const resp = await fetch(`${base}/api/integrations/slack/notify`, { method: 'POST', headers, body: JSON.stringify(cfg) });
      const data = await resp.json();
      return { type, status: resp.ok ? 'success' : 'error', result: data };
    }

    if (type === 'webhook') {
      const row = matchedRows[0] || {};
      const resp = await fetch(`${base}/api/integrations/webhook/send`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ url: action.url, secret: action.secret, event: action.event || 'automation.triggered', data: { rows: matchedRows, ...row } }),
      });
      const data = await resp.json();
      return { type, status: resp.ok ? 'success' : 'error', result: data };
    }

    if (type === 'make') {
      const resp = await fetch(`${base}/api/integrations/make/trigger`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ webhookUrl: action.webhookUrl, event: action.event || 'automation', data: { rows: matchedRows } }),
      });
      const data = await resp.json();
      return { type, status: resp.ok ? 'success' : 'error', result: data };
    }

    if (type === 'notion' || type === 'notion_page') {
      const row = matchedRows[0] || {};
      const interpolate = (s = '') => s.replace(/\{([^}]+)\}/g, (_, k) => row[k] ?? k);
      const resp = await fetch(`${base}/api/integrations/notion/export`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          dbId: action.dbId,
          headers: Object.keys(row),
          data: matchedRows,
          pageTitle: interpolate(action.title || 'Otomasyon Kaydı'),
        }),
      });
      const data = await resp.json();
      return { type, status: resp.ok ? 'success' : 'error', result: data };
    }

    if (type === 'notification') {
      return { type, status: 'success', result: { message: action.message || 'Otomasyon tetiklendi', rows: matchedRows.length } };
    }

    if (type === 'discord') {
      const row = matchedRows[0] || {};
      const interpolate = (s = '') => s.replace(/\{([^}]+)\}/g, (_, k) => row[k] ?? k);
      const resp = await fetch(`${base}/api/integrations/discord/notify`, { method: 'POST', headers, body: JSON.stringify({ webhookUrl: action.webhookUrl, title: interpolate(action.title || 'Mocksheets Bildirimi'), message: interpolate(action.message || '') }) });
      return { type, status: resp.ok ? 'success' : 'error', result: await resp.json() };
    }

    if (type === 'google-chat') {
      const row = matchedRows[0] || {};
      const interpolate = (s = '') => s.replace(/\{([^}]+)\}/g, (_, k) => row[k] ?? k);
      const resp = await fetch(`${base}/api/integrations/google-chat/notify`, { method: 'POST', headers, body: JSON.stringify({ webhookUrl: action.webhookUrl, message: interpolate(action.message || '') }) });
      return { type, status: resp.ok ? 'success' : 'error', result: await resp.json() };
    }

    if (type === 'n8n') {
      const resp = await fetch(`${base}/api/integrations/n8n/trigger`, { method: 'POST', headers, body: JSON.stringify({ webhookUrl: action.webhookUrl, event: action.event || 'automation', data: { rows: matchedRows } }) });
      return { type, status: resp.ok ? 'success' : 'error', result: await resp.json() };
    }

    if (type === 'pipedream') {
      const resp = await fetch(`${base}/api/integrations/pipedream/trigger`, { method: 'POST', headers, body: JSON.stringify({ webhookUrl: action.webhookUrl, event: action.event || 'automation', data: { rows: matchedRows } }) });
      return { type, status: resp.ok ? 'success' : 'error', result: await resp.json() };
    }

    if (type === 'zapier') {
      const resp = await fetch(`${base}/api/integrations/zapier/trigger`, { method: 'POST', headers, body: JSON.stringify({ webhookUrl: action.webhookUrl, data: matchedRows[0] || {} }) });
      return { type, status: resp.ok ? 'success' : 'error', result: await resp.json() };
    }

    if (type === 'ifttt') {
      const row = matchedRows[0] || {};
      const interpolate = (s = '') => s.replace(/\{([^}]+)\}/g, (_, k) => row[k] ?? k);
      const resp = await fetch(`${base}/api/integrations/ifttt/trigger`, { method: 'POST', headers, body: JSON.stringify({ key: action.key, event: action.event, value1: interpolate(action.value1 || ''), value2: action.value2 || '', value3: action.value3 || '' }) });
      return { type, status: resp.ok ? 'success' : 'error', result: await resp.json() };
    }

    if (type === 'sendgrid') {
      const row = matchedRows[0] || {};
      const interpolate = (s = '') => s.replace(/\{([^}]+)\}/g, (_, k) => row[k] ?? k);
      const resp = await fetch(`${base}/api/integrations/sendgrid/send`, { method: 'POST', headers, body: JSON.stringify({ apiKey: action.apiKey, to: interpolate(action.to), subject: interpolate(action.subject || ''), body: interpolate(action.body || '') }) });
      return { type, status: resp.ok ? 'success' : 'error', result: await resp.json() };
    }

    if (type === 'mailchimp') {
      const row = matchedRows[0] || {};
      const interpolate = (s = '') => s.replace(/\{([^}]+)\}/g, (_, k) => row[k] ?? k);
      const resp = await fetch(`${base}/api/integrations/mailchimp/subscribe`, { method: 'POST', headers, body: JSON.stringify({ apiKey: action.apiKey, listId: action.listId, email: interpolate(action.email || '') }) });
      return { type, status: resp.ok ? 'success' : 'error', result: await resp.json() };
    }

    if (type === 'brevo') {
      const row = matchedRows[0] || {};
      const interpolate = (s = '') => s.replace(/\{([^}]+)\}/g, (_, k) => row[k] ?? k);
      const resp = await fetch(`${base}/api/integrations/brevo/send`, { method: 'POST', headers, body: JSON.stringify({ apiKey: action.apiKey, to: interpolate(action.to), subject: interpolate(action.subject || ''), body: interpolate(action.body || '') }) });
      return { type, status: resp.ok ? 'success' : 'error', result: await resp.json() };
    }

    if (type === 'twilio') {
      const row = matchedRows[0] || {};
      const interpolate = (s = '') => s.replace(/\{([^}]+)\}/g, (_, k) => row[k] ?? k);
      const resp = await fetch(`${base}/api/integrations/twilio/send`, { method: 'POST', headers, body: JSON.stringify({ accountSid: action.accountSid, authToken: action.authToken, from: action.from, to: interpolate(action.to), message: interpolate(action.message || '') }) });
      return { type, status: resp.ok ? 'success' : 'error', result: await resp.json() };
    }

    if (type === 'telegram') {
      const row = matchedRows[0] || {};
      const interpolate = (s = '') => s.replace(/\{([^}]+)\}/g, (_, k) => row[k] ?? k);
      const resp = await fetch(`${base}/api/integrations/telegram/send`, { method: 'POST', headers, body: JSON.stringify({ botToken: action.botToken, chatId: action.chatId, message: interpolate(action.message || '') }) });
      return { type, status: resp.ok ? 'success' : 'error', result: await resp.json() };
    }

    if (type === 'jira') {
      const row = matchedRows[0] || {};
      const interpolate = (s = '') => s.replace(/\{([^}]+)\}/g, (_, k) => row[k] ?? k);
      const resp = await fetch(`${base}/api/integrations/jira/create-issue`, { method: 'POST', headers, body: JSON.stringify({ email: action.email, apiToken: action.apiToken, domain: action.domain, projectKey: action.projectKey, summary: interpolate(action.summary || ''), description: interpolate(action.description || '') }) });
      return { type, status: resp.ok ? 'success' : 'error', result: await resp.json() };
    }

    if (type === 'linear') {
      const row = matchedRows[0] || {};
      const interpolate = (s = '') => s.replace(/\{([^}]+)\}/g, (_, k) => row[k] ?? k);
      const resp = await fetch(`${base}/api/integrations/linear/create-issue`, { method: 'POST', headers, body: JSON.stringify({ apiKey: action.apiKey, teamId: action.teamId, title: interpolate(action.title || ''), description: interpolate(action.description || '') }) });
      return { type, status: resp.ok ? 'success' : 'error', result: await resp.json() };
    }

    if (type === 'github') {
      const row = matchedRows[0] || {};
      const interpolate = (s = '') => s.replace(/\{([^}]+)\}/g, (_, k) => row[k] ?? k);
      const resp = await fetch(`${base}/api/integrations/github/create-issue`, { method: 'POST', headers, body: JSON.stringify({ token: action.token, owner: action.owner, repo: action.repo, title: interpolate(action.title || ''), body: interpolate(action.body || '') }) });
      return { type, status: resp.ok ? 'success' : 'error', result: await resp.json() };
    }

    if (type === 'clickup') {
      const row = matchedRows[0] || {};
      const interpolate = (s = '') => s.replace(/\{([^}]+)\}/g, (_, k) => row[k] ?? k);
      const resp = await fetch(`${base}/api/integrations/clickup/create-task`, { method: 'POST', headers, body: JSON.stringify({ apiKey: action.apiKey, listId: action.listId, name: interpolate(action.name || ''), description: interpolate(action.description || '') }) });
      return { type, status: resp.ok ? 'success' : 'error', result: await resp.json() };
    }

    if (type === 'asana') {
      const row = matchedRows[0] || {};
      const interpolate = (s = '') => s.replace(/\{([^}]+)\}/g, (_, k) => row[k] ?? k);
      const resp = await fetch(`${base}/api/integrations/asana/create-task`, { method: 'POST', headers, body: JSON.stringify({ token: action.token, projectId: action.projectId, name: interpolate(action.name || ''), notes: interpolate(action.notes || '') }) });
      return { type, status: resp.ok ? 'success' : 'error', result: await resp.json() };
    }

    if (type === 'monday') {
      const row = matchedRows[0] || {};
      const interpolate = (s = '') => s.replace(/\{([^}]+)\}/g, (_, k) => row[k] ?? k);
      const resp = await fetch(`${base}/api/integrations/monday/create-item`, { method: 'POST', headers, body: JSON.stringify({ apiKey: action.apiKey, boardId: action.boardId, itemName: interpolate(action.itemName || '') }) });
      return { type, status: resp.ok ? 'success' : 'error', result: await resp.json() };
    }

    if (type === 'hubspot') {
      const row = matchedRows[0] || {};
      const interpolate = (s = '') => s.replace(/\{([^}]+)\}/g, (_, k) => row[k] ?? k);
      const resp = await fetch(`${base}/api/integrations/hubspot/create-contact`, { method: 'POST', headers, body: JSON.stringify({ token: action.token, email: interpolate(action.email || ''), firstName: interpolate(action.firstName || ''), lastName: interpolate(action.lastName || '') }) });
      return { type, status: resp.ok ? 'success' : 'error', result: await resp.json() };
    }

    if (type === 'pagerduty') {
      const row = matchedRows[0] || {};
      const interpolate = (s = '') => s.replace(/\{([^}]+)\}/g, (_, k) => row[k] ?? k);
      const resp = await fetch(`${base}/api/integrations/pagerduty/trigger`, { method: 'POST', headers, body: JSON.stringify({ routingKey: action.routingKey, summary: interpolate(action.summary || ''), severity: action.severity || 'warning' }) });
      return { type, status: resp.ok ? 'success' : 'error', result: await resp.json() };
    }

    if (type === 'smartsheet') {
      const resp = await fetch(`${base}/api/integrations/smartsheet/add-row`, { method: 'POST', headers, body: JSON.stringify({ apiKey: action.apiKey, sheetId: action.sheetId, values: matchedRows[0] || {} }) });
      return { type, status: resp.ok ? 'success' : 'error', result: await resp.json() };
    }

    if (type === 'hubspot_create_deal') {
      const row = matchedRows[0] || {};
      const interpolate = (s = '') => s.replace(/\{([^}]+)\}/g, (_, k) => row[k] ?? k);
      const resp = await fetch(`${base}/api/integrations/hubspot/create-deal`, { method: 'POST', headers, body: JSON.stringify({ token: action.token, dealName: interpolate(action.dealName || ''), amount: interpolate(action.amount || ''), pipelineId: action.pipelineId || '', stageId: action.stageId || '' }) });
      return { type, status: resp.ok ? 'success' : 'error', result: await resp.json() };
    }

    if (type === 'hubspot_update_contact') {
      const row = matchedRows[0] || {};
      const interpolate = (s = '') => s.replace(/\{([^}]+)\}/g, (_, k) => row[k] ?? k);
      const resp = await fetch(`${base}/api/integrations/hubspot/update-contact`, { method: 'POST', headers, body: JSON.stringify({ token: action.token, email: interpolate(action.email || ''), firstName: interpolate(action.firstName || ''), lastName: interpolate(action.lastName || ''), phone: interpolate(action.phone || '') }) });
      return { type, status: resp.ok ? 'success' : 'error', result: await resp.json() };
    }

    if (type === 'hubspot_add_note') {
      const row = matchedRows[0] || {};
      const interpolate = (s = '') => s.replace(/\{([^}]+)\}/g, (_, k) => row[k] ?? k);
      const resp = await fetch(`${base}/api/integrations/hubspot/add-note`, { method: 'POST', headers, body: JSON.stringify({ token: action.token, contactEmail: interpolate(action.contactEmail || ''), noteBody: interpolate(action.noteBody || '') }) });
      return { type, status: resp.ok ? 'success' : 'error', result: await resp.json() };
    }

    if (type === 'jira_add_comment') {
      const row = matchedRows[0] || {};
      const interpolate = (s = '') => s.replace(/\{([^}]+)\}/g, (_, k) => row[k] ?? k);
      const resp = await fetch(`${base}/api/integrations/jira/add-comment`, { method: 'POST', headers, body: JSON.stringify({ email: action.email, apiToken: action.apiToken, domain: action.domain, issueKey: interpolate(action.issueKey || ''), comment: interpolate(action.comment || '') }) });
      return { type, status: resp.ok ? 'success' : 'error', result: await resp.json() };
    }

    if (type === 'jira_transition') {
      const row = matchedRows[0] || {};
      const interpolate = (s = '') => s.replace(/\{([^}]+)\}/g, (_, k) => row[k] ?? k);
      const resp = await fetch(`${base}/api/integrations/jira/transition`, { method: 'POST', headers, body: JSON.stringify({ email: action.email, apiToken: action.apiToken, domain: action.domain, issueKey: interpolate(action.issueKey || ''), transitionName: action.transitionName || '' }) });
      return { type, status: resp.ok ? 'success' : 'error', result: await resp.json() };
    }

    if (type === 'jira_assign') {
      const row = matchedRows[0] || {};
      const interpolate = (s = '') => s.replace(/\{([^}]+)\}/g, (_, k) => row[k] ?? k);
      const resp = await fetch(`${base}/api/integrations/jira/assign`, { method: 'POST', headers, body: JSON.stringify({ email: action.email, apiToken: action.apiToken, domain: action.domain, issueKey: interpolate(action.issueKey || ''), assigneeEmail: interpolate(action.assigneeEmail || '') }) });
      return { type, status: resp.ok ? 'success' : 'error', result: await resp.json() };
    }

    if (type === 'github_add_comment') {
      const row = matchedRows[0] || {};
      const interpolate = (s = '') => s.replace(/\{([^}]+)\}/g, (_, k) => row[k] ?? k);
      const resp = await fetch(`${base}/api/integrations/github/add-comment`, { method: 'POST', headers, body: JSON.stringify({ token: action.token, owner: action.owner, repo: action.repo, issueNumber: interpolate(action.issueNumber || ''), body: interpolate(action.body || '') }) });
      return { type, status: resp.ok ? 'success' : 'error', result: await resp.json() };
    }

    if (type === 'github_close_issue') {
      const row = matchedRows[0] || {};
      const interpolate = (s = '') => s.replace(/\{([^}]+)\}/g, (_, k) => row[k] ?? k);
      const resp = await fetch(`${base}/api/integrations/github/close-issue`, { method: 'POST', headers, body: JSON.stringify({ token: action.token, owner: action.owner, repo: action.repo, issueNumber: interpolate(action.issueNumber || '') }) });
      return { type, status: resp.ok ? 'success' : 'error', result: await resp.json() };
    }

    if (type === 'github_create_pr') {
      const row = matchedRows[0] || {};
      const interpolate = (s = '') => s.replace(/\{([^}]+)\}/g, (_, k) => row[k] ?? k);
      const resp = await fetch(`${base}/api/integrations/github/create-pr`, { method: 'POST', headers, body: JSON.stringify({ token: action.token, owner: action.owner, repo: action.repo, title: interpolate(action.title || ''), head: action.head || '', base: action.base || 'main', body: interpolate(action.body || '') }) });
      return { type, status: resp.ok ? 'success' : 'error', result: await resp.json() };
    }

    if (type === 'trello') {
      const row = matchedRows[0] || {};
      const interpolate = (s = '') => s.replace(/\{([^}]+)\}/g, (_, k) => row[k] ?? k);
      const resp = await fetch(`${base}/api/integrations/trello/create-card`, { method: 'POST', headers, body: JSON.stringify({ apiKey: action.apiKey, token: action.token, listId: action.listId, name: interpolate(action.name || ''), desc: interpolate(action.desc || '') }) });
      return { type, status: resp.ok ? 'success' : 'error', result: await resp.json() };
    }

    if (type === 'trello_add_comment') {
      const row = matchedRows[0] || {};
      const interpolate = (s = '') => s.replace(/\{([^}]+)\}/g, (_, k) => row[k] ?? k);
      const resp = await fetch(`${base}/api/integrations/trello/add-comment`, { method: 'POST', headers, body: JSON.stringify({ apiKey: action.apiKey, token: action.token, cardId: interpolate(action.cardId || ''), text: interpolate(action.text || '') }) });
      return { type, status: resp.ok ? 'success' : 'error', result: await resp.json() };
    }

    if (type === 'trello_move_card') {
      const row = matchedRows[0] || {};
      const interpolate = (s = '') => s.replace(/\{([^}]+)\}/g, (_, k) => row[k] ?? k);
      const resp = await fetch(`${base}/api/integrations/trello/move-card`, { method: 'POST', headers, body: JSON.stringify({ apiKey: action.apiKey, token: action.token, cardId: interpolate(action.cardId || ''), listId: action.listId || '' }) });
      return { type, status: resp.ok ? 'success' : 'error', result: await resp.json() };
    }

    if (type === 'clickup_update_task') {
      const row = matchedRows[0] || {};
      const interpolate = (s = '') => s.replace(/\{([^}]+)\}/g, (_, k) => row[k] ?? k);
      const resp = await fetch(`${base}/api/integrations/clickup/update-task`, { method: 'POST', headers, body: JSON.stringify({ apiKey: action.apiKey, taskId: interpolate(action.taskId || ''), status: action.status || '', name: interpolate(action.name || '') }) });
      return { type, status: resp.ok ? 'success' : 'error', result: await resp.json() };
    }

    if (type === 'clickup_add_comment') {
      const row = matchedRows[0] || {};
      const interpolate = (s = '') => s.replace(/\{([^}]+)\}/g, (_, k) => row[k] ?? k);
      const resp = await fetch(`${base}/api/integrations/clickup/add-comment`, { method: 'POST', headers, body: JSON.stringify({ apiKey: action.apiKey, taskId: interpolate(action.taskId || ''), comment: interpolate(action.comment || '') }) });
      return { type, status: resp.ok ? 'success' : 'error', result: await resp.json() };
    }

    if (type === 'asana_complete_task') {
      const row = matchedRows[0] || {};
      const interpolate = (s = '') => s.replace(/\{([^}]+)\}/g, (_, k) => row[k] ?? k);
      const resp = await fetch(`${base}/api/integrations/asana/complete-task`, { method: 'POST', headers, body: JSON.stringify({ token: action.token, taskId: interpolate(action.taskId || '') }) });
      return { type, status: resp.ok ? 'success' : 'error', result: await resp.json() };
    }

    if (type === 'asana_add_comment') {
      const row = matchedRows[0] || {};
      const interpolate = (s = '') => s.replace(/\{([^}]+)\}/g, (_, k) => row[k] ?? k);
      const resp = await fetch(`${base}/api/integrations/asana/add-comment`, { method: 'POST', headers, body: JSON.stringify({ token: action.token, taskId: interpolate(action.taskId || ''), text: interpolate(action.text || '') }) });
      return { type, status: resp.ok ? 'success' : 'error', result: await resp.json() };
    }

    if (type === 'notion_update_page') {
      const row = matchedRows[0] || {};
      const interpolate = (s = '') => s.replace(/\{([^}]+)\}/g, (_, k) => row[k] ?? k);
      const resp = await fetch(`${base}/api/integrations/notion/update-page`, { method: 'POST', headers, body: JSON.stringify({ token: action.token, pageId: interpolate(action.pageId || ''), properties: action.properties || '' }) });
      return { type, status: resp.ok ? 'success' : 'error', result: await resp.json() };
    }

    if (type === 'airtable_update') {
      const row = matchedRows[0] || {};
      const interpolate = (s = '') => s.replace(/\{([^}]+)\}/g, (_, k) => row[k] ?? k);
      const resp = await fetch(`${base}/api/integrations/airtable/update-record`, { method: 'POST', headers, body: JSON.stringify({ token: action.token, baseId: action.baseId, tableName: action.tableName, recordId: interpolate(action.recordId || ''), fields: action.fields || '' }) });
      return { type, status: resp.ok ? 'success' : 'error', result: await resp.json() };
    }

    if (type === 'monday_update_item') {
      const row = matchedRows[0] || {};
      const interpolate = (s = '') => s.replace(/\{([^}]+)\}/g, (_, k) => row[k] ?? k);
      const resp = await fetch(`${base}/api/integrations/monday/update-item`, { method: 'POST', headers, body: JSON.stringify({ apiKey: action.apiKey, boardId: action.boardId, itemId: interpolate(action.itemId || ''), columnId: action.columnId || '', value: interpolate(action.value || '') }) });
      return { type, status: resp.ok ? 'success' : 'error', result: await resp.json() };
    }

    if (type === 'linear_update_issue') {
      const row = matchedRows[0] || {};
      const interpolate = (s = '') => s.replace(/\{([^}]+)\}/g, (_, k) => row[k] ?? k);
      const resp = await fetch(`${base}/api/integrations/linear/update-issue`, { method: 'POST', headers, body: JSON.stringify({ apiKey: action.apiKey, issueId: interpolate(action.issueId || ''), stateId: action.stateId || '', priority: action.priority || '' }) });
      return { type, status: resp.ok ? 'success' : 'error', result: await resp.json() };
    }

    if (type === 'linear_add_comment') {
      const row = matchedRows[0] || {};
      const interpolate = (s = '') => s.replace(/\{([^}]+)\}/g, (_, k) => row[k] ?? k);
      const resp = await fetch(`${base}/api/integrations/linear/add-comment`, { method: 'POST', headers, body: JSON.stringify({ apiKey: action.apiKey, issueId: interpolate(action.issueId || ''), body: interpolate(action.body || '') }) });
      return { type, status: resp.ok ? 'success' : 'error', result: await resp.json() };
    }

    if (type === 'gmail_create_draft') {
      const row = matchedRows[0] || {};
      const interpolate = (s = '') => s.replace(/\{([^}]+)\}/g, (_, k) => row[k] ?? k);
      const resp = await fetch(`${base}/api/integrations/gmail/create-draft`, { method: 'POST', headers, body: JSON.stringify({ to: interpolate(action.to || ''), subject: interpolate(action.subject || ''), body: interpolate(action.body || '') }) });
      return { type, status: resp.ok ? 'success' : 'error', result: await resp.json() };
    }

    return { type, status: 'skipped', result: { reason: `Unknown action type: ${type}` } };
  } catch (err) {
    return { type, status: 'error', error: err.message };
  }
}

// Evaluate condition_config against sheet data, return matching rows
function evaluateConditions(sheetData, triggerConfig, conditionConfig) {
  if (!sheetData || sheetData.length < 2) return [];
  const [headers, ...rows] = sheetData;

  const check = (rowObj, cond) => {
    const val = rowObj[cond.column];
    const num = parseFloat(val);
    const condNum = parseFloat(cond.value);
    switch (cond.operator) {
      case 'less_than':     return !isNaN(num) && num < condNum;
      case 'greater_than':  return !isNaN(num) && num > condNum;
      case 'equals':        return String(val).toLowerCase() === String(cond.value).toLowerCase();
      case 'not_equals':    return String(val).toLowerCase() !== String(cond.value).toLowerCase();
      case 'contains':      return String(val).toLowerCase().includes(String(cond.value).toLowerCase());
      case 'is_empty':      return val == null || val === '';
      case 'is_not_empty':  return val != null && val !== '';
      case 'date_passed':   return val && new Date(val) < new Date();
      case 'date_is_today': {
        const today = new Date().toDateString();
        return val && new Date(val).toDateString() === today;
      }
      default: return false;
    }
  };

  const rowObjs = rows.map(r => {
    const obj = {};
    headers.forEach((h, i) => { obj[h] = r[i] ?? ''; });
    return obj;
  });

  // Filter by trigger condition first
  let matched = rowObjs;
  if (triggerConfig?.column && triggerConfig?.operator) {
    matched = matched.filter(row => check(row, triggerConfig));
  }

  // Apply extra conditions (AND logic by default)
  if (Array.isArray(conditionConfig) && conditionConfig.length > 0) {
    matched = matched.filter(row => conditionConfig.every(cond => check(row, cond)));
  }

  return matched;
}

// Log a run to workflow_runs table
async function logRun(sb, { ruleId, userId, status, triggeredBy, triggerData, actionResults, errorMessage, durationMs }) {
  await sb.from('workflow_runs').insert({
    rule_id: ruleId,
    user_id: userId,
    status,
    triggered_by: triggeredBy,
    trigger_data: triggerData || null,
    action_results: actionResults || null,
    error_message: errorMessage || null,
    duration_ms: durationMs,
    completed_at: new Date().toISOString(),
  });
}

// ── GET /api/automations ─────────────────────────────────────────────────────
router.get('/', requireAuth, async (req, res) => {
  const { data, error } = await req.supabase
    .from('automation_rules')
    .select('*')
    .eq('user_id', req.user.id)
    .order('created_at', { ascending: false });

  if (error) return res.status(500).json({ error: error.message });
  res.json({ rules: data || [] });
});

// ── POST /api/automations ────────────────────────────────────────────────────
router.post('/', requireAuth, async (req, res) => {
  const { name, integration, trigger_config, condition_config, action_config, throttle_seconds, enabled, description, template_id } = req.body;

  if (!name || !trigger_config || !action_config) {
    return res.status(400).json({ error: 'name, trigger_config, action_config zorunludur' });
  }

  const { data, error } = await req.supabase
    .from('automation_rules')
    .insert({
      user_id: req.user.id,
      name,
      description: description || null,
      integration: integration || 'webhook',
      trigger_config,
      condition_config: condition_config || [],
      action_config: Array.isArray(action_config) ? action_config : [action_config],
      throttle_seconds: throttle_seconds ?? 3600,
      enabled: enabled !== false,
      template_id: template_id || null,
    })
    .select()
    .single();

  if (error) return res.status(500).json({ error: error.message });

  // Register schedule if applicable
  try {
    if (data.trigger_config?.type === 'schedule' && data.enabled) {
      const scheduler = require('../services/scheduler');
      scheduler.scheduleRule(data);
    }
  } catch (err) { console.warn('[automations] Scheduler register failed:', err.message); }

  res.json({ rule: data });
});

// ── PUT /api/automations/:id ─────────────────────────────────────────────────
router.put('/:id', requireAuth, async (req, res) => {
  const { id } = req.params;
  const updates = {};
  const allowed = ['name', 'enabled', 'integration', 'trigger_config', 'condition_config', 'action_config', 'throttle_seconds', 'description', 'template_id'];
  for (const key of allowed) {
    if (req.body[key] !== undefined) updates[key] = req.body[key];
  }

  if (!Object.keys(updates).length) {
    return res.status(400).json({ error: 'Güncellenecek alan yok' });
  }
  updates.updated_at = new Date().toISOString();

  const { data, error } = await req.supabase
    .from('automation_rules')
    .update(updates)
    .eq('id', id)
    .eq('user_id', req.user.id)
    .select()
    .single();

  if (error) return res.status(500).json({ error: error.message });
  if (!data) return res.status(404).json({ error: 'Kural bulunamadı' });

  // Update scheduler
  try {
    const scheduler = require('../services/scheduler');
    scheduler.unschedule(id);
    if (data.trigger_config?.type === 'schedule' && data.enabled) {
      scheduler.scheduleRule(data);
    }
  } catch (err) { console.warn('[automations] Scheduler update failed:', err.message); }

  res.json({ rule: data });
});

// ── DELETE /api/automations/:id ──────────────────────────────────────────────
router.delete('/:id', requireAuth, async (req, res) => {
  const { id } = req.params;

  const { error } = await req.supabase
    .from('automation_rules')
    .delete()
    .eq('id', id)
    .eq('user_id', req.user.id);

  if (error) return res.status(500).json({ error: error.message });

  try { require('../services/scheduler').unschedule(id); } catch (err) { console.warn('[automations] Scheduler unschedule failed:', err.message); }

  res.json({ success: true });
});

// ── POST /api/automations/suggest ────────────────────────────────────────────
router.post('/suggest', requireAuth, async (req, res) => {
  const { headers, integration } = req.body;

  if (!headers || !Array.isArray(headers) || !headers.length) {
    return res.status(400).json({ error: 'headers array gerekli' });
  }

  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

  const prompt = `Bir Türk kullanıcı "${integration || 'Make'}" entegrasyonu kuruyor.
Tablolarındaki sütun başlıkları: ${headers.filter(Boolean).join(', ')}

Bu başlıklara göre:
1. Kullanıcının hangi iş türünde olduğunu tespit et (stok, spor salonu, muhasebe, personel, satış, proje, diğer)
2. Bu entegrasyon için maksimum 3 adet somut otomasyon kuralı öner

Sadece şu JSON formatında yanıt ver:
{
  "business_type": "stok",
  "business_label": "Stok Yönetimi",
  "suggestions": [
    {
      "name": "Kural adı (Türkçe, 50 char max)",
      "description": "Ne yapar (1 cümle)",
      "trigger_config": {
        "type": "cell_condition",
        "column": "tam sütun adı",
        "operator": "less_than|greater_than|equals|not_equals|contains|is_empty|date_is_today|date_passed|changed",
        "value": "eşik değeri veya boş string"
      },
      "action_config": [
        {
          "type": "gmail|slack|webhook|make|notification|notion_page",
          "subject": "Mesaj başlığı, {SütunAdı} kullanılabilir",
          "body": "Mesaj içeriği"
        }
      ],
      "throttle_seconds": 3600
    }
  ]
}`;

  try {
    const response = await client.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 1000,
      messages: [{ role: 'user', content: prompt }]
    });

    const raw = response.content[0].text.trim();
    const match = raw.match(/\{[\s\S]*\}/);
    if (!match) return res.status(500).json({ error: 'AI yanıtı parse edilemedi' });

    let result;
    try { result = JSON.parse(match[0]); }
    catch { return res.status(500).json({ error: 'AI yanıtı geçersiz JSON döndürdü' }); }
    res.json(result);
  } catch (e) {
    console.error('/api/automations/suggest hatası:', e.message);
    res.status(500).json({ error: e.message });
  }
});

// ── POST /api/automations/generate — NL → Workflow ───────────────────────────
router.post('/generate', requireAuth, async (req, res) => {
  const { query } = req.body;
  if (!query || !query.trim()) return res.status(400).json({ error: 'query zorunludur' });

  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

  const systemPrompt = `Sen Mocksheets için bir otomasyon kuralı üretecisisin. Türkçe doğal dil komutunu aşağıdaki JSON şemasına dönüştür.

SADECE GEÇERLİ JSON döndür. Markdown, açıklama, kod bloğu işareti YAZMA. { ile başla } ile bitir.

ŞEMA:
{
  "name": "Kısa Türkçe isim (max 50 karakter)",
  "description": "Bu otomasyon şunu yapar: ... (1 cümle Türkçe)",
  "trigger_config": {
    "type": "cell_condition" | "schedule" | "value_changed" | "row_added" | "date_arrived",

    // cell_condition için: column, operator (less_than|greater_than|equals|not_equals|contains), value
    // schedule için: frequency (every_day|every_week|every_month), time ("HH:MM"), day_of_week (0-6, weekly için)
    // value_changed için: column
    // row_added için: (boş obje yeterli)
    // date_arrived için: column, days_before (int)
  },
  "condition_config": [
    { "column": "Sütun", "operator": "equals|contains|less_than|greater_than|not_equals|is_empty|is_not_empty", "value": "değer", "logic": "AND" }
  ],
  "action_config": [
    // slack: { "type": "slack", "webhookUrl": "", "title": "Başlık", "message": "Mesaj {Sütun Adı}" }
    // gmail: { "type": "gmail", "to": "{E-posta Sütunu}", "subject": "Konu {Sütun}", "body": "Gövde {Sütun}" }
    // notification: { "type": "notification", "message": "Mesaj metni {Sütun Adı}" }
    // webhook: { "type": "webhook", "url": "", "event": "automation.triggered" }
    // notion_page: { "type": "notion_page", "token": "", "dbId": "", "title": "Başlık {Sütun}" }
  ]
}

KURALLAR:
- Sütun adı belirtilmemişse mantıklı bir Türkçe isim kullan (stok→"Stok Miktarı", fiyat→"Fiyat", durum→"Durum", tarih→"Tarih")
- Sayısal eşik sayı string olarak yaz ("10" değil 10 yazma, string olsun)
- Zaman belirtilmemişse schedule için time="09:00"
- Platform ipucu: Slack→slack, Gmail/mail/e-posta→gmail, Notion→notion_page, bildirim/uyarı→notification, Teams→webhook
- condition_config boşsa [] döndür
- action_config en az 1 aksiyon içersin`;

  try {
    const response = await client.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1024,
      system: systemPrompt,
      messages: [{ role: 'user', content: query.trim() }]
    });

    const raw = response.content[0].text.trim();
    const match = raw.match(/\{[\s\S]*\}/);
    if (!match) return res.status(500).json({ error: 'AI yanıtı parse edilemedi' });

    let workflow;
    try { workflow = JSON.parse(match[0]); }
    catch { return res.status(500).json({ error: 'AI yanıtı geçersiz JSON döndürdü' }); }

    if (!workflow.name || !workflow.trigger_config || !workflow.action_config) {
      return res.status(500).json({ error: 'AI eksik otomasyon üretdi. Komutu daha detaylı yazar mısın?' });
    }

    res.json({ workflow });
  } catch (e) {
    console.error('/api/automations/generate hatası:', e.message);
    if (e.status === 429) return res.status(429).json({ error: 'Çok fazla istek. Lütfen biraz bekleyin.' });
    res.status(500).json({ error: e.message });
  }
});

// ── GET /api/automations/runs — Run history ───────────────────────────────────
router.get('/runs', requireAuth, async (req, res) => {
  const limit = Math.min(parseInt(req.query.limit) || 20, 100);
  const offset = parseInt(req.query.offset) || 0;
  const ruleId = req.query.rule_id;

  let q = req.supabase
    .from('workflow_runs')
    .select(`
      id, rule_id, status, triggered_by, action_results, error_message, duration_ms, started_at, completed_at,
      automation_rules(name)
    `)
    .eq('user_id', req.user.id)
    .order('started_at', { ascending: false })
    .range(offset, offset + limit - 1);

  if (ruleId) q = q.eq('rule_id', ruleId);

  const { data, error } = await q;
  if (error) return res.status(500).json({ error: error.message });
  res.json({ runs: data || [] });
});

// ── POST /api/automations/:id/run — Manual trigger ────────────────────────────
router.post('/:id/run', requireAuth, async (req, res) => {
  const { id } = req.params;
  const { sheet_data } = req.body;
  const startedAt = Date.now();

  const { data: rule, error: ruleErr } = await req.supabase
    .from('automation_rules')
    .select('*')
    .eq('id', id)
    .eq('user_id', req.user.id)
    .single();

  if (ruleErr || !rule) return res.status(404).json({ error: 'Kural bulunamadı' });

  const matchedRows = sheet_data ? evaluateConditions(sheet_data, rule.trigger_config, rule.condition_config) : [];
  const actions = Array.isArray(rule.action_config) ? rule.action_config : [rule.action_config];

  const actionResults = [];
  let overallStatus = 'success';

  for (const action of actions) {
    const result = await executeAction(action, matchedRows, req.authToken);
    actionResults.push(result);
    if (result.status === 'error') overallStatus = 'error';
  }

  const durationMs = Date.now() - startedAt;

  await logRun(req.supabase, {
    ruleId: id,
    userId: req.user.id,
    status: overallStatus,
    triggeredBy: 'manual',
    triggerData: { matched_rows: matchedRows.length },
    actionResults,
    durationMs,
  });

  // Update last_fired + run_count
  await req.supabase
    .from('automation_rules')
    .update({ last_fired: new Date().toISOString(), run_count: (rule.run_count || 0) + 1 })
    .eq('id', id)
    .eq('user_id', req.user.id);

  res.json({ status: overallStatus, matched_rows: matchedRows.length, action_results: actionResults, duration_ms: durationMs });
});

// ── POST /api/automations/:id/test — simülasyon modu ────────────────────────
router.post('/:id/test', requireAuth, async (req, res) => {
  const { id } = req.params;
  const startedAt = Date.now();

  const { data: rule, error: ruleErr } = await req.supabase
    .from('automation_rules').select('*')
    .eq('id', id).eq('user_id', req.user.id).single();
  if (ruleErr || !rule) return res.status(404).json({ error: 'Kural bulunamadı' });

  const actions = Array.isArray(rule.action_config) ? rule.action_config : [rule.action_config].filter(Boolean);
  const ACTION_LABELS = {
    gmail: 'Gmail', slack: 'Slack', teams: 'Teams', webhook: 'Webhook',
    make: 'Make', notion: 'Notion', notion_page: 'Notion Page',
    airtable: 'Airtable', update_cells: 'Hücre Güncelle', notification: 'Bildirim',
    discord: 'Discord', 'google-chat': 'Google Chat', n8n: 'n8n', pipedream: 'Pipedream',
    zapier: 'Zapier', ifttt: 'IFTTT', sendgrid: 'SendGrid', mailchimp: 'Mailchimp',
    brevo: 'Brevo', twilio: 'Twilio SMS', telegram: 'Telegram', jira: 'Jira',
    linear: 'Linear', github: 'GitHub Issues', clickup: 'ClickUp', asana: 'Asana',
    monday: 'Monday.com', hubspot: 'HubSpot', pagerduty: 'PagerDuty', smartsheet: 'Smartsheet',
    hubspot_create_deal: 'HubSpot Deal', hubspot_update_contact: 'HubSpot Contact', hubspot_add_note: 'HubSpot Not',
    jira_add_comment: 'Jira Yorum', jira_transition: 'Jira Transition', jira_assign: 'Jira Atama',
    github_add_comment: 'GitHub Yorum', github_close_issue: 'GitHub Kapat', github_create_pr: 'GitHub PR',
    trello: 'Trello', trello_add_comment: 'Trello Yorum', trello_move_card: 'Trello Taşı',
    clickup_update_task: 'ClickUp Güncelle', clickup_add_comment: 'ClickUp Yorum',
    asana_complete_task: 'Asana Tamamla', asana_add_comment: 'Asana Yorum',
    notion_update_page: 'Notion Güncelle', airtable_update: 'Airtable Güncelle',
    monday_update_item: 'Monday.com Güncelle', linear_update_issue: 'Linear Güncelle',
    linear_add_comment: 'Linear Yorum', gmail_create_draft: 'Gmail Taslak'
  };

  const actionResults = [];
  let overallSuccess = true;

  for (const action of actions) {
    const label = ACTION_LABELS[action?.type] || action?.type || '—';
    if (action.type === 'webhook' && action.url) {
      try {
        const r = await fetch(action.url, {
          method: action.method || 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ test: true, rule: rule.name, timestamp: new Date().toISOString() }),
          signal: AbortSignal.timeout(5000)
        });
        actionResults.push({ type: action.type, label, success: r.ok, detail: `HTTP ${r.status}`, simulated: false });
        if (!r.ok) overallSuccess = false;
      } catch (e) {
        actionResults.push({ type: action.type, label, success: false, detail: 'Bağlantı hatası: ' + e.message, simulated: false });
        overallSuccess = false;
      }
    } else {
      await new Promise(r => setTimeout(r, 80));
      actionResults.push({ type: action.type, label, success: true, detail: `Test modu — gerçek ${label} gönderilmedi`, simulated: true });
    }
  }

  const durationMs = Date.now() - startedAt;

  await req.supabase.from('automation_rules')
    .update({ last_fired: new Date().toISOString(), run_count: (rule.run_count || 0) + 1 })
    .eq('id', id).eq('user_id', req.user.id);

  await logRun(req.supabase, {
    ruleId: id, userId: req.user.id,
    status: overallSuccess ? 'success' : 'error',
    triggeredBy: 'test',
    triggerData: { matched_rows: 0 },
    actionResults: actionResults.map(a => ({ type: a.type, status: a.success ? 'success' : 'error', result: { detail: a.detail } })),
    durationMs,
  });

  res.json({
    success: overallSuccess,
    duration: durationMs + 'ms',
    actions: actionResults,
    message: overallSuccess
      ? `✓ Test başarılı — ${actionResults.length} aksiyon simüle edildi`
      : '⚠ Test tamamlandı ama bazı aksiyonlar başarısız'
  });
});

// ── POST /api/automations/:id/log — legacy compat ────────────────────────────
router.post('/:id/log', requireAuth, async (req, res) => {
  const { id } = req.params;
  const { data, error } = await req.supabase
    .from('automation_rules')
    .update({ last_fired: new Date().toISOString() })
    .eq('id', id)
    .eq('user_id', req.user.id)
    .select()
    .single();

  if (error) return res.status(500).json({ error: error.message });
  res.json({ success: true, last_fired: data?.last_fired });
});

module.exports = router;
module.exports.executeAction = executeAction;
