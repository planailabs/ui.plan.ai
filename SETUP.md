# ui.plan.ai · setup

> **Live site:** <https://ui.plan.ai/> · **Docs:** <https://ui.plan.ai/docs/> · **API:** `https://api.ui.plan.ai/v1`

This is the operator's quick path. The **single ordered checklist** for connecting Supabase + Cloudflare to V1 lives in [docs/v1-plan/wiring-supabase-cloudflare/](https://ui.plan.ai/docs/v1-plan/wiring-supabase-cloudflare/) — work top-to-bottom when you're ready to wire real projects.

This file:
- gets you running locally in three commands,
- enumerates env-var canonical names with the surfaces they bind to,
- points to the in-docs guide for everything else.

## Local dev (no accounts required)

```bash
pnpm install
pnpm dev
```

Open <http://localhost:4321/> (main app + workbench) and <http://localhost:4322/docs/> (Starlight, with HMR).

The `V1Repository` local provider in `src/lib/v1/local.ts` serves seed data when no Supabase URL is configured. The workbench (`/workbench/*`) will render its read-only chrome and prompt for sign-in; auth + writes activate when `PUBLIC_SUPABASE_URL` is set.

## Pre-merge gate

```bash
pnpm check && pnpm build
```

Per [branch-pr-workflow](.agents/skills/branch-pr-workflow/SKILL.md), this is the only required check before opening a PR. There is no GitHub Actions CI; Cloudflare Pages rebuilds `main`/`preview` on push.

## Production wiring

The full ordered procedure with upstream links is in [/docs/v1-plan/wiring-supabase-cloudflare/](https://ui.plan.ai/docs/v1-plan/wiring-supabase-cloudflare/) (11 phases: Supabase project → Auth → Storage → Realtime → Edge Functions → Cloudflare account → Images → Stream → Turnstile → Pages → Smoke test). The secret matrix and environment triplet (dev/preview/prod) is in [/docs/reference/secrets-and-environments/](https://ui.plan.ai/docs/reference/secrets-and-environments/). Per-host portability translation (Netlify, Vercel, Nginx, etc.) is in [/docs/reference/static-hosting/](https://ui.plan.ai/docs/reference/static-hosting/).

## Environment variables

Copy `.env.example` to `.env` for local dev. For production, set every value on the surface it binds to — never the wrong one.

| Canonical name | Browser env var | Bound to | Notes |
|---|---|---|---|
| `SUPABASE_URL` | `PUBLIC_SUPABASE_URL` | CF Pages (public) + Edge Functions | Same value on both surfaces. |
| `SUPABASE_ANON_KEY` | `PUBLIC_SUPABASE_ANON_KEY` | CF Pages (public) | RLS does the protecting. |
| `SUPABASE_SERVICE_ROLE_KEY` | — | Edge Functions only | **Never** in CF Pages env. |
| `API_KEY_PEPPER` | — | Edge Functions only | Server pepper for API-key HMAC. |
| `APP_ORIGINS` | — | Edge Functions | Comma-separated browser origins (CORS + Stream `allowedOrigins`). |
| `CF_ACCOUNT_ID` | — | Edge Functions | Cloudflare account that owns Images/Stream. |
| `CF_IMAGES_TOKEN` | — | Edge Functions | Scoped token, Images write. |
| `CF_IMAGES_SIGNING_KEY` | — | Edge Functions | Mints signed delivery URLs for private images. |
| `CF_STREAM_TOKEN` | — | Edge Functions | Scoped token, Stream write + Direct Creator Uploads. |
| `CF_STREAM_SIGNING_KEY` | — | Edge Functions | Mints Stream signed playback JWTs. |
| `CF_STREAM_WEBHOOK_SECRET` | — | Edge Functions | Verifies `webhook-signature` on Stream callbacks. |
| `TURNSTILE_SITE_KEY` | `PUBLIC_TURNSTILE_SITE_KEY` | CF Pages (public) | Login form widget. |
| `TURNSTILE_SECRET_KEY` | — | Edge Functions | Verifies Turnstile tokens server-side. |
| `PUBLIC_AGENT_API_BASE_URL` | `PUBLIC_AGENT_API_BASE_URL` | CF Pages (public) | Default `https://api.ui.plan.ai/v1`. |

Full inventory + binding rules with `_headers` baseline: [/docs/reference/secrets-and-environments/](https://ui.plan.ai/docs/reference/secrets-and-environments/).

## Per-instance project config

Copy `config/project.config.example.json` to `config/project.config.json` and edit the limits/variants for your deployment. The `.json` (no `.example`) is gitignored — it's per-instance, not source. Schema: [/docs/specs/schemas/project-config.v1.schema.json](https://ui.plan.ai/docs/specs/schemas/project-config.v1.schema.json). Field reference: [/docs/reference/config/](https://ui.plan.ai/docs/reference/config/).

## External checklist

| | Task |
|---|---|
| ☐ | Supabase project created; `supabase link` succeeds. |
| ☐ | `supabase db push` applied; tables + RLS verified. |
| ☐ | Supabase Auth: email OTP enabled, MFA enrolled, Site URL + redirects match the env. |
| ☐ | Storage bucket `frame-originals` (or your config value) created as private. |
| ☐ | Realtime publication includes only `frame_events`, `frame_submissions`, `frames`, `frame_media`. |
| ☐ | Edge Functions deployed with the right `--no-verify-jwt` flag per `supabase/config.toml`. |
| ☐ | All Edge Function secrets set via `supabase secrets set …`. |
| ☐ | Cloudflare Images enabled; scoped API token issued; signing key generated; variants declared. |
| ☐ | Cloudflare Stream enabled; scoped API token + signing key + webhook secret issued. |
| ☐ | Turnstile widget created per environment; site + secret keys captured. |
| ☐ | Cloudflare Pages project connected; public env vars set; custom domains mapped. |
| ☐ | `api.ui.plan.ai` bound to Supabase Edge Functions via Supabase custom-domain (DNS-only CNAME). |
| ☐ | Smoke test from [wiring-supabase-cloudflare Phase 11](https://ui.plan.ai/docs/v1-plan/wiring-supabase-cloudflare/#phase-11--smoke-verification) passes top to bottom. |
| ☐ | First tenant + owner row inserted; first agent + main channel seeded; first API key issued through the workbench. |

## Where things live

| Concern | Source |
|---|---|
| API contract | [/docs/api-reference/](https://ui.plan.ai/docs/api-reference/) + `starlight/public/specs/v1-agent-api.openapi.yaml` |
| Data model + SQL | [/docs/specifications/data-model/](https://ui.plan.ai/docs/specifications/data-model/) + [/docs/specifications/supabase-sql/](https://ui.plan.ai/docs/specifications/supabase-sql/) |
| Routing + tenancy | [/docs/v1-plan/routing-and-tenancy/](https://ui.plan.ai/docs/v1-plan/routing-and-tenancy/) |
| Auth model | [/docs/v1-plan/auth-and-sessions/](https://ui.plan.ai/docs/v1-plan/auth-and-sessions/) |
| Approval policy | [/docs/v1-plan/approval-and-api-keys/](https://ui.plan.ai/docs/v1-plan/approval-and-api-keys/) |
| Media + delivery | [/docs/v1-plan/media-and-delivery/](https://ui.plan.ai/docs/v1-plan/media-and-delivery/) |
| Mechanical wiring | [/docs/v1-plan/wiring-supabase-cloudflare/](https://ui.plan.ai/docs/v1-plan/wiring-supabase-cloudflare/) |
| Secret matrix | [/docs/reference/secrets-and-environments/](https://ui.plan.ai/docs/reference/secrets-and-environments/) |
| Local provider (mock data) | `src/lib/v1/local.ts` |
| Live provider boundary | `src/lib/v1/contracts.ts` (V1Repository interface) |
| Realtime layer | `src/lib/realtime.ts` (Postgres Changes subscriptions) |
