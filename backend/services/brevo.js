const BREVO_API_KEY = process.env.BREVO_API_KEY;
const BREVO_BASE = 'https://api.brevo.com/v3';

async function brevoRequest(endpoint, method, body) {
  const res = await fetch(BREVO_BASE + endpoint, {
    method,
    headers: {
      'api-key': BREVO_API_KEY,
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!res.ok && res.status !== 204) {
    const err = await res.text();
    console.error(`[brevo] ${endpoint} hatası:`, err);
  }
  return res.status === 204 ? null : res.json().catch(() => null);
}

async function upsertContact(email, attributes = {}) {
  await brevoRequest('/contacts', 'POST', {
    email,
    attributes,
    updateEnabled: true,
  });
}

async function sendEventToBrevo(email, eventName, properties = {}) {
  await brevoRequest('/events', 'POST', {
    event_name: eventName,
    identifiers: { email_id: email },
    event_properties: properties,
  });
}

const scenarios = require('../data/emailScenarios');

async function sendScenarioEmail(email, scenarioKey, extraAttributes = {}) {
  const scenario = scenarios[scenarioKey];
  if (!scenario) {
    console.error(`[brevo] Bilinmeyen senaryo: ${scenarioKey}`);
    return;
  }

  await upsertContact(email, {
    MAILTITLE: scenario.title,
    MAILBODY: scenario.body,
    MAILCTA: scenario.cta_text,
    MAILCTAURL: scenario.cta_url,
    ...extraAttributes,
  });

  await sendEventToBrevo(email, scenarioKey, {});
}

module.exports = { upsertContact, sendEventToBrevo, sendScenarioEmail };
