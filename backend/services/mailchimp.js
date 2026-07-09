'use strict';
const crypto = require('crypto');
let mailchimp = null;
try { mailchimp = require('@mailchimp/mailchimp_marketing'); } catch { /* paket kurulmadıysa no-op */ }

let _configured = false;
function configured() {
  if (_configured) return true;
  if (!mailchimp || !process.env.MAILCHIMP_API_KEY || !process.env.MAILCHIMP_SERVER_PREFIX || !process.env.MAILCHIMP_LIST_ID) {
    return false;
  }
  mailchimp.setConfig({
    apiKey: process.env.MAILCHIMP_API_KEY,
    server: process.env.MAILCHIMP_SERVER_PREFIX
  });
  _configured = true;
  return true;
}

const hash = (email) => crypto.createHash('md5').update(String(email).toLowerCase()).digest('hex');
const LIST_ID = () => process.env.MAILCHIMP_LIST_ID;

function toMergeFields(props = {}) {
  const out = {};
  for (const [k, v] of Object.entries(props)) {
    if (v === undefined || v === null) continue;
    const key = String(k).toUpperCase().slice(0, 10);
    out[key] = typeof v === 'string' ? v : String(v);
  }
  return out;
}

async function createContact(email, props = {}) {
  if (!configured() || !email) return;
  try {
    await mailchimp.lists.setListMember(LIST_ID(), hash(email), {
      email_address: email,
      status_if_new: 'subscribed',
      merge_fields: toMergeFields(props)
    });
  } catch (e) {
    console.error('[mailchimp] createContact:', e.message || e);
  }
}

async function updateContact(email, props = {}) {
  if (!configured() || !email) return;
  try {
    await mailchimp.lists.setListMember(LIST_ID(), hash(email), {
      email_address: email,
      status_if_new: 'subscribed',
      merge_fields: toMergeFields(props)
    });
  } catch (e) {
    console.error('[mailchimp] updateContact:', e.message || e);
  }
}

async function sendEvent(email, eventName, eventProperties = {}) {
  if (!configured() || !email) return;
  try {
    await mailchimp.lists.createListMemberEvent(LIST_ID(), hash(email), {
      name: String(eventName).slice(0, 30),
      properties: Object.fromEntries(
        Object.entries(eventProperties).map(([k, v]) => [k, typeof v === 'string' ? v : String(v)])
      )
    });
    console.log(`[mailchimp] ${eventName} → ${email}`);
  } catch (e) {
    console.error(`[mailchimp] sendEvent(${eventName}):`, e.message || e);
  }
}

async function sendScenarioEmail(email, scenarioKey, extraFields = {}) {
  if (!configured() || !email) return;
  try {
    const scenarios = require('../data/emailScenarios');
    const scenario = scenarios[scenarioKey];
    if (!scenario) {
      console.error(`[mailchimp] Bilinmeyen senaryo: ${scenarioKey}`);
      return;
    }

    const subscriberHash = hash(email);
    const mergeFields = {
      MAILTITLE: scenario.title,
      MAILBODY: scenario.body,
      MAILCTA: scenario.cta_text,
      MAILCTAURL: scenario.cta_url,
    };

    Object.entries(extraFields).forEach(([k, v]) => {
      const key = String(k).toUpperCase().slice(0, 10);
      mergeFields[key] = typeof v === 'string' ? v : String(v);
    });

    await mailchimp.lists.setListMember(LIST_ID(), subscriberHash, {
      email_address: email,
      status_if_new: 'subscribed',
      merge_fields: mergeFields
    });

    await mailchimp.lists.createListMemberEvent(LIST_ID(), subscriberHash, {
      name: scenarioKey.slice(0, 30),
      properties: {}
    });
    console.log(`[mailchimp] ${scenarioKey} → ${email}`);
  } catch (e) {
    console.error(`[mailchimp] sendScenarioEmail(${scenarioKey}):`, e.message || e);
  }
}

module.exports = { createContact, updateContact, sendEvent, sendScenarioEmail };
