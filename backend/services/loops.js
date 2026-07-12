'use strict';
const LOOPS_API_KEY = process.env.LOOPS_API_KEY;
const LOOPS_BASE = 'https://app.loops.so/api/v1';

async function loopsRequest(endpoint, method, body) {
  const res = await fetch(LOOPS_BASE + endpoint, {
    method,
    headers: {
      'Authorization': 'Bearer ' + LOOPS_API_KEY,
      'Content-Type': 'application/json',
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = await res.json().catch(() => null);
  if (!res.ok) console.error(`[loops] ${endpoint} hatası:`, data);
  return data;
}

async function upsertContact(email, fields = {}) {
  return loopsRequest('/contacts/update', 'PUT', { email, ...fields });
}

async function sendEvent(email, eventName, contactFields = {}, eventProperties = {}) {
  return loopsRequest('/events/send', 'POST', {
    email, eventName, ...contactFields, eventProperties,
  });
}

const scenarios = require('../data/emailScenarios');

async function sendScenarioEmail(email, scenarioKey, extra = {}) {
  const scenario = scenarios[scenarioKey];
  if (!scenario) { console.error(`[loops] Bilinmeyen senaryo: ${scenarioKey}`); return; }
  return sendEvent(email, scenarioKey, {}, {
    mailTitle: scenario.title,
    mailBody: scenario.body,
    mailCta: scenario.cta_text,
    mailCtaUrl: scenario.cta_url,
    ...extra,
  });
}

module.exports = { upsertContact, sendEvent, sendScenarioEmail };
