---
title: Secrets & environments
description: Environment matrix and where each Supabase/Cloudflare secret is bound for V1.
sidebar:
  order: 7
stability: working
last_synced_with: "2026-05-22-llm-council-v1-pass"
---

V1 runs three environments. Every secret is bound on the smallest set of surfaces it needs — server-only secrets (service role, signing keys, peppers) live in exactly one surface and never reach the browser. Public values (`SUPABASE_URL`, anon key, Turnstile site key) are intentionally available in both the build env and at runtime.

## Environment matrix

| Environment | Astro app | Supabase project | Domains |
|---|---|---|---|
| **dev** | `pnpm dev` on localhost | Local CLI (`supabase start`) or a personal Supabase project | `localhost:4321`, `localhost:4322` |
| **preview** | Cloudflare Pages `preview` branch | Shared `ui-plan-ai-preview` Supabase project | `preview.ui.plan.ai` (+ per-PR `*.pages.dev`) |
| **prod** | Cloudflare Pages `main` branch | `ui-plan-ai` Supabase project | `ui.plan.ai`, `api.ui.plan.ai` |

The Supabase Auth **Site URL** and **Additional Redirect URLs** for each project must list exactly the domains in that environment's row. CF Pages preview URLs change per build, so add the wildcard `https://*.ui-plan-ai.pages.dev` to preview, never to prod.

Upstream reference: [Pages env vars](https://developers.cloudflare.com/pages/configuration/build-configuration/#environment-variables), [Supabase redirect URLs](https://supabase.com/docs/guides/auth/redirect-urls).

## Secret inventory

| Secret | Bound to | Notes |
|---|---|---|
| `SUPABASE_URL` | CF Pages env (public), Edge Functions, agents | Same value in browser and server. |
| `SUPABASE_ANON_KEY` | CF Pages env (public) | Browser-only key; RLS does the protecting. |
| `SUPABASE_SERVICE_ROLE_KEY` | Edge Functions only | **Never** in the Astro build env. |
| `API_KEY_PEPPER` | Edge Functions only | Server pepper for API-key HMAC; rotatable, versioned. |
| `CF_ACCOUNT_ID` | Edge Functions | Identifies the Cloudflare account for Images/Stream API calls. |
| `CF_IMAGES_TOKEN` | Edge Functions | Scoped API token, Images write. |
| `CF_IMAGES_SIGNING_KEY` | Edge Functions | Mints signed delivery URLs for private images. |
| `CF_STREAM_TOKEN` | Edge Functions | Scoped API token, Stream write + Direct Creator Uploads. |
| `CF_STREAM_SIGNING_KEY` | Edge Functions | Mints Stream signed playback JWTs. |
| `CF_STREAM_WEBHOOK_SECRET` | Edge Functions | Verifies `webhook-signature` on Stream callbacks. |
| `TURNSTILE_SITE_KEY` | CF Pages env (public) | Login form widget. |
| `TURNSTILE_SECRET_KEY` | Edge Functions | Verifies Turnstile tokens server-side. |

Upstream references: [Supabase Edge Function secrets](https://supabase.com/docs/guides/functions/secrets), [Pages env vars](https://developers.cloudflare.com/pages/configuration/build-configuration/#environment-variables).

## Migrations & schema flow

- Schema lives in `supabase/migrations/` as timestamped SQL files.
- Apply via `supabase db push` from CI; never edit schema in the Supabase Studio in `preview` or `prod`.
- Local dev: `supabase start` boots a containerized stack; `supabase db reset` re-runs migrations + seed.
- Seed data for first tenant (one owner, one agent `plan-ai`, `main` channel) lives in `supabase/seed.sql`.

Upstream: [database migrations](https://supabase.com/docs/guides/deployment/database-migrations), [local development](https://supabase.com/docs/guides/local-development).

## Cache & headers (Cloudflare Pages)

A future `_headers` file (not yet shipped — tracked in [open questions](/roadmap-and-open-questions/open-questions/)) must set, at minimum:

```text
/*
  Strict-Transport-Security: max-age=31536000; includeSubDomains; preload
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin
  Permissions-Policy: camera=(), microphone=(), geolocation=()

/docs/_astro/*
  Cache-Control: public, max-age=31536000, immutable

/workbench/*
  Cache-Control: private, no-store
```

Upstream: [Pages headers](https://developers.cloudflare.com/pages/configuration/headers/).

## Backup & restore

- Supabase Postgres: PITR enabled, retention ≥ 7 days in `prod`.
- Cloudflare Images + Stream: treated as durable delivery; not a backup tier.
- Original PNG frames in Supabase Storage are the recovery source for re-deriving Cloudflare variants if needed.

Upstream: [Supabase backups](https://supabase.com/docs/guides/platform/backups).
