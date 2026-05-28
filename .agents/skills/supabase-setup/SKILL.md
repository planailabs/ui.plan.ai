---
name: supabase-setup
description: Conventions for the `supabase/` directory — migrations, Edge Functions, env vars, and the rule against pushing without explicit user ask.
---

# Supabase setup

The `supabase/` directory is the source of truth for the V1 Supabase project (`ui-plan-ai` in prod, `ui-plan-ai-preview` in preview). Schema and Edge Function code live here; nothing in this directory is built by `pnpm build` — it is deployed via the Supabase CLI, run **manually by the user**.

## Hard rule

**Never run `supabase db push`, `supabase db reset`, `supabase functions deploy`, `supabase secrets set`, or `supabase link` without an explicit ask from the user.** These mutate live infrastructure. Suggest them; do not execute them.

## Verification gap (read before changing migrations or functions)

`pnpm check` + `pnpm build` — the only pre-merge gate — do **not** cover this directory. Edge Functions are Deno (excluded from the root `tsconfig`) and RLS is never executed locally by the gate. Real defects here (RLS recursion, over-permissive anon policies, unenforced API-key scopes) pass the gate silently and reach prod on the next deploy. Before changing a migration or function, verify the actual behavior against a real stack:

```bash
supabase start && supabase db reset           # apply migrations + seed locally (when the user asks)
# then exercise the path with a real anon/authenticated token, not just types:
#   - RLS: query the table as anon AND as a tenant member; confirm rows match intent
#   - recursion: a SELECT that funnels through is_tenant_member() must not error
#   - scopes: an agent-bound key must not read another agent's rows
deno check supabase/functions/**/index.ts     # type-check the Deno side the gate skips
```

Membership helper functions that read `tenant_members` MUST be `security definer` (see the `is_aal2()` precedent) or they recurse against their own RLS policy.

## Layout

```
supabase/
├── config.toml                       # project id, per-function verify_jwt, auth/storage limits
├── seed.sql                          # first-tenant bootstrap
├── migrations/
│   └── YYYYMMDDhhmmss_*.sql          # timestamp-prefixed, append-only
└── functions/
    ├── import_map.json               # std + @supabase/supabase-js pins
    ├── _shared/                      # cors, errors, auth, supabase, hash, rate-limit, events, stream, images
    ├── frame-submissions/index.ts    # POST /v1/frame-submissions  — agent ingress, API key auth
    ├── media-uploads/index.ts        # POST /v1/media-uploads      — Stream Direct Creator Upload mint
    ├── submission-status/index.ts    # GET  /v1/submission-status/:id — agent polling
    ├── stream-webhook/index.ts       # POST /v1/stream-webhook      — Cloudflare callback (HMAC + idempotency)
    └── team-invitations/index.ts     # POST /v1/team-invitations    — browser-called, JWT + AAL2 owner-only
```

## Migration naming

Timestamp prefix, then a slug: `20260522000000_init.sql`, `20260522000001_api_keys_view.sql`. **Never** edit a migration that has been applied to any project — write a new one. Migrations are append-only.

Source of truth for the schema: `starlight/src/content/docs/specifications/supabase-sql.md`. Migrations must match it; if the spec changes, write a follow-up migration in the same commit and update the doc's `last_synced_with` stamp.

## Edge Function auth modes

`config.toml` sets `verify_jwt` per function. The defaults wired today:

| Function | `verify_jwt` | Why |
|---|---|---|
| `frame-submissions` | `false` | API-key Bearer auth (custom HMAC), not Supabase JWT |
| `media-uploads` | `false` | Same — API-key auth |
| `submission-status` | `false` | Same — API-key auth |
| `stream-webhook` | `false` | Cloudflare HMAC signature, no JWT |
| `team-invitations` | `true` | Browser-called by signed-in tenant owners |

Adding a function: declare it in `config.toml` explicitly. Don't rely on the default — be explicit per the V1 council audit.

## Ingress contract invariants

Enforced in the Edge Functions + DB (migration `20260529000000`):

- **Metadata**: `frame-submissions` and `media-uploads` both validate `metadata` against `ui.plan.ai/frame-metadata.v1` via `_shared/frame-metadata.ts` before any insert. Shape is nested — `agent.slug`, `channel.slug`, `frame.{title,alt_text,date}` — not flat. No silent date defaulting.
- **Capability scopes**: `media:image` gates `frame-submissions`; `media:video` gates `media-uploads` (`hasApiScope`). Existing keys were grandfathered with both; new keys must request them explicitly.
- **Idempotency**: unique per `(api_key_id, idempotency_scope, idempotency_key)` — scoped per endpoint, not shared. The PNG fingerprint includes the image bytes.
- **`frame_media.status`**: enum `frame_media_status` (`received`, `media_processing`, `ready`, `failed`). Never write `processing`.
- **Mutations**: clients have no `UPDATE` on `frame_submissions`/`frames` (revoked). Status transitions go through a service-role Edge Function.

## Browser-called functions need CORS

Browser-called functions (`team-invitations` today; anything new the workbench fetches directly) MUST use `_shared/cors.ts` and respond to `OPTIONS` preflight. Agent/webhook endpoints (called by servers, not browsers) include CORS headers harmlessly but no preflight is involved.

The CORS allowlist is env-driven via `APP_ORIGINS` (comma-separated). Default falls back to `localhost:4321`, `localhost:4322`, `ui.plan.ai`, `preview.ui.plan.ai` when unset.

## Env vars (Edge Function secrets)

Set via `supabase secrets set KEY=value …` (do not commit). Inventory:

| Secret | Used by |
|---|---|
| `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `SUPABASE_ANON_KEY` | every function via `_shared/supabase.ts` |
| `API_KEY_PEPPER` | `_shared/auth.ts` (HMAC API keys), `team-invitations` (token hash) |
| `TURNSTILE_SECRET_KEY` | `_shared/auth.ts` |
| `CF_ACCOUNT_ID`, `CF_STREAM_TOKEN` | `_shared/stream.ts` (direct upload) |
| `CF_STREAM_WEBHOOK_SECRET` | `_shared/stream.ts` (signature verify) |
| `CF_STREAM_SIGNING_KEY` | (future) playback JWT mint |
| `CF_ACCOUNT_ID`, `CF_IMAGES_TOKEN` | `_shared/images.ts` |
| `CF_IMAGES_SIGNING_KEY` | (future) signed delivery |
| `APP_ORIGINS` | `_shared/cors.ts`, `media-uploads` (Stream `allowedOrigins`) |

Full per-surface naming map: `starlight/src/content/docs/reference/secrets-and-environments`.

## Local dev (when the user asks)

```bash
supabase start          # boots local stack (Postgres, GoTrue, Storage, Functions runtime)
supabase db reset       # re-runs migrations + seed.sql
supabase functions serve <name>
```

Browser app talks to local stack by setting `PUBLIC_SUPABASE_URL=http://127.0.0.1:54321` and `PUBLIC_SUPABASE_ANON_KEY=<value from supabase status>` in `.env.local`.

## Mechanical wiring (when the user asks)

Follow `starlight/src/content/docs/v1-plan/wiring-supabase-cloudflare.md` top to bottom. Phase 1 is `supabase link` + `supabase db push`; the Edge Function phase deploys functions with JWT settings matching `supabase/config.toml`.
