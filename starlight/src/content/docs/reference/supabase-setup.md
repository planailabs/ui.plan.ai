---
title: Supabase setup
description: Project setup, environment variables, auth and data assumptions for the V1 Supabase backend.
sidebar:
  order: 8
stability: working
last_synced_with: "2026-05-22-infra-docs"
---

V1 runs on a single Supabase project: Postgres, Auth, Storage, Realtime, and Edge Functions. This page covers what must exist before app implementation lands. The schema-level plan (tables, RLS, indexes) is the authoritative source for table shape — see [Supabase SQL plan](/specifications/supabase-sql/).

This site (the public Astro app + docs) does **not** consume Supabase at build time. Supabase is consumed at runtime by the future workbench and Agent API. No Supabase secret is ever shipped into the static build.

## Project setup

| Setting | Value |
|---|---|
| Project hosting | Supabase Cloud |
| Region | one region close to plan.ai team operations; pick once and document in the project's deploy log |
| Postgres major | tracked from Supabase default at project creation |
| Auth providers | email magic link + (optional) GitHub OAuth for plan.ai team members |
| Storage buckets | one private bucket for original PNG frames and small original media (see below) |
| Realtime | enabled on `frame_events` and on `frame_submissions` status changes |
| Edge Functions | host the Agent API ingress (`/v1/frame-submissions`, `/v1/media-uploads`, status endpoints) |

There is no external sign-up in V1. plan.ai team membership is managed by inserting rows into `tenant_members` after a user is created in Supabase Auth.

## Environment variables

Variables are split by surface. **Browser** vars are public and ship to the client; **server** vars are only used by Edge Functions or server-side build steps and must never be exposed.

### Browser (workbench / future authenticated UI)

| Variable | Purpose | Notes |
|---|---|---|
| `PUBLIC_SUPABASE_URL` | Project URL (`https://<ref>.supabase.co`). | Public by definition. |
| `PUBLIC_SUPABASE_ANON_KEY` | Anon key, RLS-gated. | Public by definition; all access is enforced by RLS. |

The `PUBLIC_` prefix is the Astro convention for client-exposed env vars. These are safe to commit to deploy environment configuration but must not be confused with the service-role key.

### Server (Edge Functions, never client)

| Variable | Purpose | Where used |
|---|---|---|
| `SUPABASE_URL` | Project URL. | Edge Functions, scripts. |
| `SUPABASE_SERVICE_ROLE_KEY` | Bypasses RLS. | Edge Functions only. **Never** ship to the browser or to CF Pages env. |
| `SUPABASE_DB_URL` | Direct Postgres connection string. | Migrations and one-off scripts. |
| `SUPABASE_JWT_SECRET` | Verifies Auth-issued JWTs. | Edge Functions that need to validate user sessions independently. |

### Cloudflare media (used by Edge Functions when finalizing submissions)

| Variable | Purpose |
|---|---|
| `CLOUDFLARE_ACCOUNT_ID` | Identifies the CF account that owns Images/Stream. |
| `CLOUDFLARE_IMAGES_API_TOKEN` | Scoped token for Images uploads and signed-URL generation. |
| `CLOUDFLARE_STREAM_API_TOKEN` | Scoped token for Stream direct-upload creation. |
| `CLOUDFLARE_IMAGES_KEY_ID` / `CLOUDFLARE_IMAGES_KEY` | Signing keys for private image variant URLs. |
| `CLOUDFLARE_STREAM_SIGNING_KEY_ID` / `CLOUDFLARE_STREAM_SIGNING_KEY_PEM` | Signing keys for Stream playback tokens. |

These belong to the Edge Functions runtime, not to the static site.

### This repo (`ui.plan.ai`)

This static-site repo currently uses **no** environment variables — neither at build time on Cloudflare Pages, nor in local development. The CF Pages dashboard environment variables list is intentionally empty. If a future change introduces one, document it here in the same commit and add it to the CF dashboard explicitly.

## Auth assumptions

V1 browser auth uses Supabase Auth (PKCE) for plan.ai team members.

- **Session transport**: `sessionStorage`. Not cookies, not `localStorage`.
- **Identity boundary**: team members authenticate as users; agents authenticate with API keys. Agent scripts must not reuse browser sessions.
- **Data access**: browser reads go through Supabase RLS; agent writes go through Edge Functions after API-key verification.

See [Auth & sessions](/v1-plan/auth-and-sessions/) for the V1 contract.

## Data assumptions

The V1 Postgres schema is hybrid normalized + JSONB:

- **Normalized**: ownership and state (`tenants`, `tenant_members`, `agents`, `agent_channels`, `api_keys`, `frame_submissions`, `frames`, `frame_media`, `frame_events`, `approval_policies`).
- **JSONB**: agent-authored flexible metadata on `frame_submissions.metadata`, plus `settings` on most tables.

Every tenant-owned table carries `tenant_id` and is RLS-gated by `tenant_members` membership. The full table list and constraints are in [Data model](/v1-plan/data-model/) and the SQL is in [Supabase SQL plan](/specifications/supabase-sql/).

API keys are stored as `(prefix, hash, hash_algorithm)`; raw tokens are never persisted.

## Storage

One private bucket holds original PNG frames and (when policy allows) other small original media. Layout:

```text
{tenant_id}/{agent_slug}/{channel_slug}/{yyyymmdd}/{frame_submission_id}/original.{ext}
```

Originals are private. Public/team delivery goes through Cloudflare Images (signed variants) or Cloudflare Stream (signed playback). The app stores Cloudflare IDs in `frame_media`; do not infer them from storage paths.

See [Media & delivery](/v1-plan/media-and-delivery/) for ingest paths and the small-vs-large media split.

## Realtime

Subscribe the workbench to small events emitted from `frame_events` (or from database triggers on `frame_submissions`). Payloads are IDs + status + actor + timestamp; full metadata is fetched by ID. The canonical event names are listed in [Realtime events](/specifications/realtime-events/).

## Edge Functions

The Agent API ingress runs in Supabase Edge Functions:

- Verifies bearer API keys against the hashed value in `api_keys`.
- Enforces idempotency by `(api_key_id, idempotency_key)`.
- Creates `frame_submissions` rows and (for large video) Cloudflare Stream direct-upload sessions.
- Writes `frame_events` for audit and Realtime fan-out.

Browser RLS does **not** expose API-key writes — those are server-only.

## Setup checklist

When standing up a fresh Supabase project for V1:

1. Create the Supabase project; record region.
2. Apply the schema from [Supabase SQL plan](/specifications/supabase-sql/) (enums → tables → indexes → RLS policies, in that order).
3. Create the private storage bucket; mirror the path layout above.
4. Enable Realtime on `frame_events` (and on `frame_submissions` if status-changed events are pushed from triggers).
5. Configure Auth: enable email magic link; add GitHub OAuth if used; restrict sign-up if external sign-up should be off.
6. Create Edge Functions for the Agent API endpoints; populate the **server** env vars listed above in the Edge Functions runtime.
7. Insert the plan.ai tenant row, then `tenant_members` rows for each team member after they sign in once.
8. Generate API keys via the workbench (when it ships) — never by hand-inserting into `api_keys` outside the hashing flow.

## Troubleshooting

### Browser query returns empty results that should exist

Almost always RLS. Confirm the requesting user has a `tenant_members` row for the tenant that owns the data, and that the policy on the queried table matches on `tenant_id`. The `auth.uid()` function returns `null` for unauthenticated requests — silent empty results are the expected RLS behavior.

### Realtime channel never fires

Check the publication: Realtime requires the table to be in the `supabase_realtime` publication and Realtime enabled on the project. Status-changed events from `frame_submissions` need either Realtime on that table or a trigger that inserts into `frame_events`.

### Edge Function 401s a valid API key

Verify the function is hashing the inbound bearer with the same algorithm stored on `api_keys.hash_algorithm` (default `sha256`). The raw key is never compared; only `hash(prefix + secret)` is.

### Idempotency replays return a new submission

The unique index `frame_submissions_idempotency` is partial — it only applies when `idempotency_key is not null`. If the function is omitting the key, every retry creates a new row by design.

### `service_role` key leaked into the browser bundle

Stop. Rotate the key in the Supabase dashboard immediately. Audit any commit that may have referenced it. Service-role bypasses RLS entirely.

## Absent in V1

- External (non-plan.ai) sign-up.
- Multi-region Supabase replicas.
- Database webhooks fanning out to non-Supabase services (the Agent API is the integration surface).
- Any Supabase-hosted secret consumed by this static site at build time.
