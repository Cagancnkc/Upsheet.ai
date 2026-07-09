'use strict';
const express = require('express');
const router = express.Router();
const { createClient } = require('@supabase/supabase-js');
const { createContact, sendEvent } = require('../services/mailchimp');

function getSupabase() {
  return createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);
}

const ONBOARDING_SEQUENCE = [
  { template: 'welcome',       delayDays: 0 },
  { template: 'first_command', delayDays: 1 },
  { template: 'pdf_feature',   delayDays: 3 },
  { template: 'case_study',    delayDays: 5 },
  { template: 'pro_upgrade',   delayDays: 7 }
];

async function scheduleOnboardingEmails(userId, email) {
  const supabase = getSupabase();
  const rows = ONBOARDING_SEQUENCE.map(({ template, delayDays }) => ({
    user_id: userId || null,
    email,
    template_id: template,
    scheduled_at: new Date(Date.now() + delayDays * 86400000).toISOString()
  }));
  const { error } = await supabase.from('email_queue').insert(rows);
  if (error) console.error('[onboarding] insert error:', error.message);
}

// Supabase Auth webhook veya manuel tetikleyici: POST /api/webhooks/new-user
router.post('/new-user', async (req, res) => {
  const { email, user_id, id } = req.body?.record || req.body;
  if (!email) return res.status(400).json({ error: 'email gerekli' });

  try {
    await scheduleOnboardingEmails(user_id || id || null, email);

    const firstName = email.split('@')[0];
    createContact(email, {
      userId: user_id || id || '',
      subscriptionStatus: 'free',
      subscriptionTier: '',
      commandCount: 0,
      signupDate: new Date().toISOString(),
    }).catch(e => console.error('[loops] createContact signup:', e.message));
    sendEvent(email, 'user_signed_up', { firstName })
      .catch(e => console.error('[loops] user_signed_up:', e.message));

    res.json({ ok: true });
  } catch (err) {
    console.error('[new-user webhook]', err.message);
    res.status(500).json({ error: 'Onboarding sırası oluşturulamadı' });
  }
});

module.exports = { router, scheduleOnboardingEmails };
