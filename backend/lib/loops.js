'use strict';
const LOOPS_API = 'https://app.loops.so/api/v1';

function getHeaders() {
  return {
    'Authorization': `Bearer ${process.env.LOOPS_API_KEY}`,
    'Content-Type': 'application/json'
  };
}

async function createContact(email, props = {}) {
  if (!process.env.LOOPS_API_KEY) return;
  try {
    await fetch(`${LOOPS_API}/contacts/create`, {
      method: 'POST', headers: getHeaders(),
      body: JSON.stringify({ email, ...props })
    });
  } catch (e) { console.error('[loops] createContact:', e.message); }
}

async function updateContact(email, props = {}) {
  if (!process.env.LOOPS_API_KEY || !email) return;
  try {
    await fetch(`${LOOPS_API}/contacts/update`, {
      method: 'PUT', headers: getHeaders(),
      body: JSON.stringify({ email, ...props })
    });
  } catch (e) { console.error('[loops] updateContact:', e.message); }
}

async function sendEvent(email, eventName, eventProperties = {}) {
  if (!process.env.LOOPS_API_KEY || !email) return;
  try {
    await fetch(`${LOOPS_API}/events/send`, {
      method: 'POST', headers: getHeaders(),
      body: JSON.stringify({ email, eventName, eventProperties })
    });
    console.log(`[loops] ${eventName} → ${email}`);
  } catch (e) { console.error(`[loops] sendEvent(${eventName}):`, e.message); }
}

module.exports = { createContact, updateContact, sendEvent };
