---
title: Upstream docs
description: Deep links to the latest official Supabase and Cloudflare configuration docs that V1 depends on.
sidebar:
  order: 8
stability: stable
last_synced_with: "2026-05-22-llm-council-v1-pass"
---

This page is the canonical jumping-off point for verifying V1 configuration against current upstream behavior. The docs in this repo describe **our** contract; upstream defaults move and the linked pages are the source of truth for current platform behavior.

**Rule:** before changing any Supabase or Cloudflare configuration, re-read the linked upstream page. If upstream guidance contradicts a page in this repo, fix the repo page in the same change.

## Supabase

Authoritative docs at `supabase.com/docs`.

| Topic | V1 surface | Upstream link |
|---|---|---|
| Auth overview | [Auth & sessions](/v1-plan/auth-and-sessions/) | <https://supabase.com/docs/guides/auth> |
| PKCE flow | [Auth & sessions](/v1-plan/auth-and-sessions/) | <https://supabase.com/docs/guides/auth/sessions/pkce-flow> |
| `supabase-js` client init | [Auth & sessions](/v1-plan/auth-and-sessions/) | <https://supabase.com/docs/reference/javascript/initializing> |
| MFA (TOTP) | [Auth & sessions](/v1-plan/auth-and-sessions/) | <https://supabase.com/docs/guides/auth/auth-mfa> |
| Site URL & redirect allowlist | [Auth & sessions](/v1-plan/auth-and-sessions/) | <https://supabase.com/docs/guides/auth/redirect-urls> |
| Row Level Security | [Supabase SQL plan](/specifications/supabase-sql/) | <https://supabase.com/docs/guides/database/postgres/row-level-security> |
| RLS performance (`(select auth.uid())`) | [Supabase SQL plan](/specifications/supabase-sql/) | <https://supabase.com/docs/guides/database/postgres/row-level-security#call-functions-with-select> |
| Storage access control | [Media & delivery](/v1-plan/media-and-delivery/) | <https://supabase.com/docs/guides/storage/security/access-control> |
| Storage signed URLs | [Media & delivery](/v1-plan/media-and-delivery/) | <https://supabase.com/docs/guides/storage/serving/downloads#signed-urls> |
| Realtime authorization | [Realtime operations](/v1-plan/realtime-operations/) | <https://supabase.com/docs/guides/realtime/authorization> |
| Realtime Postgres changes | [Realtime operations](/v1-plan/realtime-operations/) | <https://supabase.com/docs/guides/realtime/postgres-changes> |
| Edge Functions | [Platform architecture](/foundations/platform-architecture/) | <https://supabase.com/docs/guides/functions> |
| Edge Function secrets | [Secrets & environments](/reference/secrets-and-environments/) | <https://supabase.com/docs/guides/functions/secrets> |
| Local dev & migrations (CLI) | [Secrets & environments](/reference/secrets-and-environments/) | <https://supabase.com/docs/guides/local-development> |
| Database migrations | [Secrets & environments](/reference/secrets-and-environments/) | <https://supabase.com/docs/guides/deployment/database-migrations> |
| Point-in-time recovery | [Platform architecture](/foundations/platform-architecture/) | <https://supabase.com/docs/guides/platform/backups> |

## Cloudflare

Authoritative docs at `developers.cloudflare.com`.

| Topic | V1 surface | Upstream link |
|---|---|---|
| Cloudflare Images overview | [Media & delivery](/v1-plan/media-and-delivery/) | <https://developers.cloudflare.com/images/> |
| Serve private images (signed URLs) | [Media & delivery](/v1-plan/media-and-delivery/) | <https://developers.cloudflare.com/images/manage-images/serve-images/serve-private-images/> |
| Image variants | [Media & delivery](/v1-plan/media-and-delivery/) | <https://developers.cloudflare.com/images/transform-images/transform-via-url/> |
| Stream overview | [Media & delivery](/v1-plan/media-and-delivery/) | <https://developers.cloudflare.com/stream/> |
| Direct creator uploads | [Media ingest](/specifications/media-ingest/) | <https://developers.cloudflare.com/stream/uploading-videos/direct-creator-uploads/> |
| Stream webhooks | [Realtime operations](/v1-plan/realtime-operations/) | <https://developers.cloudflare.com/stream/manage-video-library/using-webhooks/> |
| Stream signed playback | [Media & delivery](/v1-plan/media-and-delivery/) | <https://developers.cloudflare.com/stream/viewing-videos/securing-your-stream/> |
| Pages build configuration | [Setup & operations (README)](https://github.com/planailabs/ui.plan.ai#readme) | <https://developers.cloudflare.com/pages/configuration/build-configuration/> |
| Pages headers (`_headers`) | [Secrets & environments](/reference/secrets-and-environments/) | <https://developers.cloudflare.com/pages/configuration/headers/> |
| Pages redirects (`_redirects`) | [File & route conventions](/reference/file-and-route-conventions/) | <https://developers.cloudflare.com/pages/configuration/redirects/> |
| Pages environment variables & secrets | [Secrets & environments](/reference/secrets-and-environments/) | <https://developers.cloudflare.com/pages/configuration/build-configuration/#environment-variables> |
| Custom domains on Pages | [Secrets & environments](/reference/secrets-and-environments/) | <https://developers.cloudflare.com/pages/configuration/custom-domains/> |
| Turnstile (bot protection on login) | [Auth & sessions](/v1-plan/auth-and-sessions/) | <https://developers.cloudflare.com/turnstile/> |

## End-to-end wiring

When you're ready to actually connect Supabase + Cloudflare, walk [Wiring Supabase & Cloudflare](/v1-plan/wiring-supabase-cloudflare/) top to bottom. That page is the single ordered checklist; every step there cites the relevant upstream link from the tables above.

## How to use this page

- **Agents:** when a config field name in this repo and the linked upstream page disagree, the upstream page wins. Open an issue against the repo page and link the upstream URL you read.
- **Humans:** during a V1 audit, walk this table top-to-bottom and confirm each cross-linked V1 page still matches the upstream contract. Bump `last_synced_with` on each verified page.
