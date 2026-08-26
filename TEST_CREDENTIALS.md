# Mocksheets — Shopify App Store Test Credentials

Paste this block into the **Test instructions** field on the Shopify Partner Dashboard when resubmitting the app.

---

## Test Shopify development store

- **Store URL:** `<FILL IN — e.g. https://mocksheets-review.myshopify.com/admin>`
- **Merchant email:** `<FILL IN>`
- **Merchant password:** `<FILL IN>`

The store is pre-loaded with a small product catalogue so reviewers can exercise sync, AI analysis, and push flows without seeding data.

## Mocksheets reviewer account

- **Email:** `reviewer@mocksheets.com`
- **Password:** `<FILL IN — paste generated password>`
- **Plan:** Pro (all features unlocked; usage limits are ceiling values, not paywalls)

The reviewer account is provisioned in Supabase and mapped to the test Shopify store above via `shopify_connections`.

---

## How to test the app end-to-end

1. Log in to the test store's Shopify admin with the merchant credentials above.
2. Open the **Mocksheets** app from the Apps menu (or use the Partner dashboard "Test on development store" link).
   - Expected: OAuth consent screen appears (first install only), then the merchant lands on `https://mocksheets.com/app` already signed in — no manual login required.
3. In the Mocksheets dashboard, confirm the connected store name appears in the top-right store switcher.
4. Click **Katalogu Senkronize Et** (Sync catalogue) — the product grid populates from the test store.
5. Click **AI Analiz** and choose "All" — Mocksheets returns SEO title / description / tag suggestions in Turkish.
6. Approve one suggestion and click **Shopify'a Gönder** (Push to Shopify) — the change is written back to the merchant store; verify by refreshing the product in Shopify admin.
7. Optional: uninstall the app from the store, then reinstall — auth flow should complete cleanly a second time (idempotent).

## Session / cookie behaviour

- Mocksheets is a **non-embedded** Shopify app; clicking the app in the admin opens `https://mocksheets.com/app` in a new tab, authenticated via a first-party `mocksheets_session` HTTP-only cookie set during the OAuth callback.
- The app also works in Chrome Incognito: because auth is carried by a first-party cookie (not localStorage or third-party cookies), the reviewer can complete the full flow in a private window.

## GDPR / compliance webhooks

The three mandatory compliance topics are subscribed via `shopify.app.toml` and served by `POST /api/shopify/webhooks`:
- `customers/data_request`
- `customers/redact`
- `shop/redact`

All are HMAC-verified against `SHOPIFY_CLIENT_SECRET`.

## Support contact for the review team

- Email: `cagancanakci3827@gmail.com`
- Response SLA during review: within 24 hours (UTC+3)
