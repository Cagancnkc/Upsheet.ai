# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Mocksheets** is a Turkish-first AI-powered Shopify catalog assistant — a platform that connects to Shopify stores, analyzes visitor behavior and sales data, and uses Claude + RAG to generate catalog optimization recommendations.

## Architecture

**Two-part system:**

- **Frontend** — Static HTML/CSS/JS site deployed on Vercel. No build step. Main files: `app.html` (spreadsheet UI), `index.html` (landing), `auth.html`, `js/app.js` (5K+ lines, all grid state + rendering logic).
- **Backend** — Node.js/Express server (`backend/server.js`) on port 3001. Handles AI, auth, billing, integrations.

**Core AI flow:**
```
Turkish user command
  → backend/rag/retrieval.js (vector search → 5 similar examples from dataset.js)
  → backend/rag/pipeline.js (Claude API with prompt caching: system + RAG context cached, user prompt not)
  → JSON action (sort / filter / highlight / update_cells / delete_rows / etc.)
  → js/app.js applies action to the 50×26 grid
```

**Auth:** Supabase JWT. Token stored in `localStorage`, sent as `Authorization: Bearer {token}` header. Backend middleware (`backend/middleware/limits.js`) verifies token, enforces per-plan daily/monthly limits.

**Plans:** Free (5/day, 20/month), Pro (30/day, 200/month), Business (unlimited). Tracked in `user_usage` Supabase table.

## Commands

**Backend development:**
```bash
cd backend
npm run dev        # development (node --watch server.js)
npm start          # production
npm run ingest     # seed RAG dataset into Supabase vector store
```

**Frontend:** Open `app.html` directly in browser, or use any static server. No build required.

## Required Environment Variables (`backend/.env`)

```
ANTHROPIC_API_KEY=
SUPABASE_URL=
SUPABASE_SERVICE_KEY=
PORT=3001
FRONTEND_URL=
CLIENT_URL=
```

Optional (payment):
```
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
STRIPE_PUBLISHABLE_KEY=
STRIPE_PRICE_PRO_WEEKLY= STRIPE_PRICE_PRO_MONTHLY= STRIPE_PRICE_PRO_YEARLY=
STRIPE_PRICE_BIZ_WEEKLY= STRIPE_PRICE_BIZ_MONTHLY= STRIPE_PRICE_BIZ_YEARLY=
```

## Key Files

| File | Purpose |
|------|---------|
| `backend/server.js` | Express app, route registration, middleware |
| `backend/rag/pipeline.js` | Claude API call, prompt caching, response parsing |
| `backend/rag/dataset.js` | 600+ Turkish command examples for RAG |
| `backend/rag/retrieval.js` | Embedding creation + vector search |
| `backend/middleware/limits.js` | Auth verification + usage limit enforcement |
| `backend/routes/stripe.js` | Stripe checkout + webhook handling |
| `backend/routes/integrations.js` | Google Sheets import/export |
| `backend/routes/pdf.js` | PDF upload → AI table extraction |
| `js/app.js` | All frontend grid logic, state, AI command dispatch |
| `i18n.js` | Turkish/English translations |
| `vercel.json` | Deployment config, URL rewrites, cache headers |

## AI Action Types

Claude returns one of these JSON action types: `sort`, `filter`, `remove_filter`, `delete_rows`, `remove_duplicates`, `sum`, `average`, `highlight`, `update_cells`, `transform`, `message`. The frontend `js/app.js` has a handler for each.

## Localization

All UI, AI prompts, system prompts, and example dataset are in Turkish. The app targets Turkish-speaking users with Turkish accounting concepts (KDV tax, SGK, maaş/payroll). Do not change language of prompts or dataset entries without considering this.

## Prompt Caching

`backend/rag/pipeline.js` uses Anthropic's `ephemeral` cache control. The system prompt and RAG examples block are marked cached; only the user command + sheet data is sent uncached. Do not restructure messages in a way that breaks cache hits (cached blocks must be identical across requests).
