---
title: Wiring Supabase & Cloudflare
description: Ordered checklist for connecting Supabase and Cloudflare to V1 — deferred until the plan is locked.
sidebar:
  order: 16
stability: working
last_synced_with: "2026-05-22-llm-council-v1-pass"
verify_against:
  - https://supabase.com/docs/guides/local-development
  - https://supabase.com/docs/guides/deployment/database-migrations
  - https://developers.cloudflare.com/pages/configuration/build-configuration/
  - https://developers.cloudflare.com/images/manage-images/serve-images/serve-private-images/
  - https://developers.cloudflare.com/stream/uploading-videos/direct-creator-uploads/
---

This page is the single ordered checklist for connecting Supabase and Cloudflare to V1. **Wiring is deferred** — the plan is being finalized first. When the team is ready to connect real projects, work top-to-bottom; each step is small, idempotent, and has an upstream reference.

Until then, this page is the operational contract the plan is being designed against. If a step here can't be satisfied by the V1 plan as written, that's a plan bug — file it against the linked page.

## Before you start

- The full secret inventory, environment matrix, and binding rules are in [Secrets & environments](/reference/secrets-and-environments/). Don't paste secrets anywhere not listed there.
- Every config change must be re-verified against the linked upstream page at the time of change — see [Upstream docs](/reference/upstream-docs/). Upstream defaults move; this page does not.
- All three environments (dev / preview / prod) are wired with the same steps, against different projects.

## Phase 1 — Supabase project

1. **Create the Supabase project** for this environment (`ui-plan-ai-dev`, `ui-plan-ai-preview`, `ui-plan-ai`). Region: closest to the team. Upstream: [organizations & projects](https://supabase.com/docs/guides/platform).
2. **Install the Supabase CLI** locally and run `supabase init` inside `supabase/`. Upstream: [local development](https://supabase.com/docs/guides/local-development).
3. **Link** the local repo to the remote project: `supabase link --project-ref <ref>`.
4. **Apply migrations** with `supabase db push`. Schema lives in `supabase/migrations/`; never edit schema in Studio for preview or prod. Upstream: [database migrations](https://supabase.com/docs/guides/deployment/database-migrations). Schema source of truth: [Supabase SQL plan](/specifications/supabase-sql/).
5. **Seed the first tenant** from `supabase/seed.sql` (one owner, one agent `plan-ai`, one channel `main`). Local: `supabase db reset` re-runs migrations + seed.
6. **Enable point-in-time recovery** (≥ 7 days for prod). Upstream: [backups](https://supabase.com/docs/guides/platform/backups).

## Phase 2 — Supabase Auth

1. **Disable every sign-in method except email OTP** (no passwords, no OAuth in V1). See [Auth & sessions](/v1-plan/auth-and-sessions/).
2. **Set `Site URL` + `Additional Redirect URLs`** to exactly the domains in this environment's row of the [environment matrix](/reference/secrets-and-environments/#environment-matrix). Upstream: [redirect URLs](https://supabase.com/docs/guides/auth/redirect-urls).
3. **Enable MFA (TOTP)** at the project level. The workbench gates the API-keys screen on `aal2` for `owner`/`admin`. Upstream: [MFA](https://supabase.com/docs/guides/auth/auth-mfa).
4. **Confirm the `profiles` trigger** (`auth.users` insert → `public.profiles` row) is in place from the migrations — see [Supabase SQL plan](/specifications/supabase-sql/).

## Phase 3 — Supabase Storage

1. **Create the `frame-originals` bucket as private.** No public read.
2. **Apply Storage RLS policies** from [Supabase SQL plan](/specifications/supabase-sql/) — caller must be a member of the tenant prefixing the object path.
3. **Confirm** server-side signed-URL minting uses `expiresIn ≤ 300` and uploads send `x-upsert: false`. See [Media & delivery](/v1-plan/media-and-delivery/).

Upstream: [access control](https://supabase.com/docs/guides/storage/security/access-control), [signed URLs](https://supabase.com/docs/guides/storage/serving/downloads#signed-urls).

## Phase 4 — Supabase Realtime

1. **Add only these tables to the `supabase_realtime` publication:** `frame_events`, `frame_submissions`, `frames`, `frame_media`. See [Realtime operations](/v1-plan/realtime-operations/).
2. **Confirm RLS is `force`d** on every realtime-published table (RLS doubles as channel auth).
3. **Verify** that `frame_events` has no UPDATE or DELETE policies — append-only is a V1 invariant.

Upstream: [Realtime authorization](https://supabase.com/docs/guides/realtime/authorization), [Postgres changes](https://supabase.com/docs/guides/realtime/postgres-changes).

## Phase 5 — Supabase Edge Functions

1. **Deploy Edge Functions** for the Agent API ingress (`frame-submissions`, `media-uploads`), Stream webhook receiver, and signed-URL minters. Upstream: [functions](https://supabase.com/docs/guides/functions).
2. **Set Edge Function secrets** from the inventory in [Secrets & environments](/reference/secrets-and-environments/#secret-inventory): `SUPABASE_SERVICE_ROLE_KEY`, `API_KEY_PEPPER`, `CF_*`, `TURNSTILE_SECRET_KEY`. Upstream: [function secrets](https://supabase.com/docs/guides/functions/secrets).
3. **Pin the JWT verification mode** to require a verified Supabase user JWT for member-facing functions, and to accept bearer API keys only on the Agent API ingress functions.

## Phase 6 — Cloudflare account scaffolding

1. **Get `CF_ACCOUNT_ID`** from the Cloudflare dashboard.
2. **Create scoped API tokens** with the minimum permissions per row in [Secrets & environments](/reference/secrets-and-environments/#secret-inventory): one for Images write (`CF_IMAGES_TOKEN`), one for Stream write + Direct Creator Uploads (`CF_STREAM_TOKEN`). Never reuse one token across products.
3. **Store both tokens as Edge Function secrets only.** They must never reach the Astro build env or the browser.

## Phase 7 — Cloudflare Images

1. **Enable `requireSignedURLs: true`** as the account default.
2. **Generate `CF_IMAGES_SIGNING_KEY`** and add it to Edge Function secrets.
3. **Declare the V1 named variants** (`thumb-256`, `card-768`, `frame-1920`, `og-1200x630`) — declared in [project config](/reference/config/), not inferred from request shape.
4. **Confirm delivery URLs** are minted server-side with `exp ≤ 1h`. See [Media & delivery](/v1-plan/media-and-delivery/).

Upstream: [Images overview](https://developers.cloudflare.com/images/), [serve private images](https://developers.cloudflare.com/images/manage-images/serve-images/serve-private-images/), [variants](https://developers.cloudflare.com/images/transform-images/transform-via-url/).

## Phase 8 — Cloudflare Stream

1. **Generate `CF_STREAM_SIGNING_KEY`** and add it to Edge Function secrets.
2. **Generate `CF_STREAM_WEBHOOK_SECRET`** and configure the webhook target at the Supabase Edge Function URL for `stream-webhook` (e.g. `https://<project-ref>.supabase.co/functions/v1/stream-webhook`, or the `api.ui.plan.ai/webhooks/stream` alias once Phase 10 step 4 binds it). Upstream: [webhooks](https://developers.cloudflare.com/stream/manage-video-library/using-webhooks/). Payload contract: [Stream webhook payload](/v1-plan/media-and-delivery/#stream-webhook-payload).
3. **Confirm Direct Creator Uploads** are created with `requireSignedURLs: true`, configured `maxDurationSeconds`, and `allowedOrigins` matching the env's domains. Upstream: [direct creator uploads](https://developers.cloudflare.com/stream/uploading-videos/direct-creator-uploads/).
4. **Confirm playback** uses signed JWT tokens with `exp ≤ 1h`. Upstream: [securing your stream](https://developers.cloudflare.com/stream/viewing-videos/securing-your-stream/).

## Phase 9 — Cloudflare Turnstile

1. **Create a Turnstile widget** for each environment. Add `TURNSTILE_SITE_KEY` to CF Pages public env, `TURNSTILE_SECRET_KEY` to Edge Functions only.
2. **Wire the widget** into the browser login form; Edge Function verifies the token before requesting an OTP. See [Auth & sessions](/v1-plan/auth-and-sessions/).

Upstream: [Turnstile](https://developers.cloudflare.com/turnstile/).

## Phase 10 — Cloudflare Pages (the Astro app) + Agent API hostname

The Astro app and the Agent API live on **different origins**: the app is Cloudflare Pages; the Agent API is Supabase Edge Functions. Do not map `api.ui.plan.ai` as a Pages custom domain.

1. **Connect the GitHub repo** to Cloudflare Pages. Build command `pnpm build`, output dir `dist`. Node pinned via `.node-version`. Upstream: [build configuration](https://developers.cloudflare.com/pages/configuration/build-configuration/).
2. **Set public env vars** on Pages (`SUPABASE_URL`, `SUPABASE_ANON_KEY`, `TURNSTILE_SITE_KEY`) per environment. Upstream: [env vars](https://developers.cloudflare.com/pages/configuration/build-configuration/#environment-variables).
3. **Map the Pages custom domains** — `ui.plan.ai` (prod) and `preview.ui.plan.ai` (preview). Upstream: [custom domains](https://developers.cloudflare.com/pages/configuration/custom-domains/).
4. **Bind `api.ui.plan.ai` to Supabase Edge Functions** via Supabase Auth's custom-domain feature (the only Supabase-supported path for a vanity Edge Functions hostname). This is a Cloudflare **DNS-only** CNAME record at the Cloudflare zone level — never a Pages custom domain. Until that binding exists, agents and webhooks call the raw `https://<project-ref>.supabase.co/functions/v1/<fn>` URL. Upstream: [Supabase custom domains](https://supabase.com/docs/guides/platform/custom-domains).
5. **Ship the `_headers` baseline** from [Secrets & environments](/reference/secrets-and-environments/#cache--headers-cloudflare-pages). Upstream: [Pages headers](https://developers.cloudflare.com/pages/configuration/headers/).

## Phase 11 — Smoke verification

Top-to-bottom acceptance for the environment:

1. **Auth** — request OTP, complete MFA enrollment, land in the workbench.
2. **API key** — create a test key as `owner`, capture the one-time raw token, confirm only `prefix` + `hash` persisted.
3. **Frame submission** — `POST /v1/frame-submissions` with multipart PNG; receive 202; see the `frame.submission.created` row in `frame_events`; the workbench updates via Postgres Changes.
4. **Image variant** — workbench renders the frame from a signed Cloudflare Images URL (not from the Supabase original).
5. **Large video** — `POST /v1/media-uploads`; upload directly to the returned Stream URL; the Stream webhook updates `frame_media.status`; the workbench emits `frame.media.status_changed`.
6. **Rate limit** — exceed the per-key bucket; receive `429 rate_limited` with a `Retry-After` header.
7. **Observability** — every response carries `X-Request-Id`; that ID appears in Edge Function logs and on the frame detail screen.

If any step fails, the bug is upstream of this checklist — fix the V1 plan page first, then re-run.

## What you do not do during wiring

- **Do not** create OAuth providers (Google, GitHub) in Supabase Auth — V2.
- **Do not** ship `_headers` rules not listed in [Secrets & environments](/reference/secrets-and-environments/#cache--headers-cloudflare-pages).
- **Do not** add tables to the realtime publication beyond the four listed.
- **Do not** put the service role key or any signing key in CF Pages env — Edge Functions only.
- **Do not** edit schema in Supabase Studio for `preview` or `prod` — migrations only.
