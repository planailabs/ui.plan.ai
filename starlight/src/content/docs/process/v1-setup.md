---
title: V1 setup checklist
description: The provisioning path for the static Astro shell, Supabase backend, Cloudflare media services, and Agent API domain.
sidebar:
  order: 5
stability: working
last_synced_with: "2026-05-22-v1-setup"
---

Use this checklist when real accounts and credentials are available. The repository can ship the static Astro shell and docs now; V1 product behavior starts when Supabase, Cloudflare media services, and `api.ui.plan.ai` are wired behind the documented contracts.

## Static Cloudflare Pages shell

- Connect the repository to Cloudflare Pages.
- Build command: `pnpm build`.
- Build output directory: `dist`.
- Root directory: `/`.
- Production branch: the repository's integration branch.
- Node version: `24.15.0` from `.node-version`.
- Keep `_redirects` in root `public/`; do not write generated docs output by hand.

The root app remains static. Browser sessions read dynamic product state through Supabase RLS and call Agent API ingress through Supabase Edge Functions.

## Supabase project

Create one Supabase project for each environment that needs isolated data.

1. Enable Supabase Auth with PKCE redirects for `https://ui.plan.ai/` and the local development origin.
2. Apply the [Supabase SQL plan](/specifications/supabase-sql/) as migrations before adding application code.
3. Create the private originals bucket named in `config/project.config.json.example`.
4. Deploy Edge Functions for Agent API ingress, API-key verification, idempotency checks, frame submissions, media-upload creation, and webhook handling.
5. Store server-only secrets in Supabase Edge Function secrets, not in client-side env variables.
6. Verify RLS policies with team member, trusted agent, and anonymous public-reader sessions.

## Cloudflare Images and Stream

Provision media delivery after Supabase Storage and the frame submission contract are in place.

- Create Cloudflare Images variants for review, public, and thumbnail views, then update the project config when final names are known.
- Create Cloudflare Stream upload and playback policy for large video.
- Generate scoped API tokens for Images and Stream; keep them server-only.
- Decide webhook endpoints for Stream processing events before enabling public video playback.
- Revisit byte, duration, and variant limits after real account limits are visible.

## Agent API domain

The public contract uses `https://api.ui.plan.ai/v1`.

- Choose whether the domain points directly at Supabase Edge Functions or through Cloudflare routing.
- Configure DNS and TLS before issuing agent API keys.
- Keep the OpenAPI server URL and docs examples aligned with the deployed domain.
- Confirm CORS for the workbench origin and trusted agent tooling.

## Environment variables

Start from `env.example`.

| Name | Scope | Notes |
|---|---|---|
| `PUBLIC_SUPABASE_URL` | Browser | Supabase project URL. |
| `PUBLIC_SUPABASE_ANON_KEY` | Browser | Public anon key used with RLS. |
| `PUBLIC_AGENT_API_BASE_URL` | Browser | Defaults to `https://api.ui.plan.ai/v1`. |
| `SUPABASE_SERVICE_ROLE_KEY` | Server only | Edge Function secret; never expose to the browser. |
| `CLOUDFLARE_ACCOUNT_ID` | Server only | Used by Edge Functions or deploy tooling. |
| `CLOUDFLARE_IMAGES_API_TOKEN` | Server only | Scoped Images token. |
| `CLOUDFLARE_STREAM_API_TOKEN` | Server only | Scoped Stream token. |

## Project config

Copy `config/project.config.json.example` when implementation begins. Keep values config-driven and validate the shape against the [project config schema](/specs/schemas/project-config.v1.schema.json).

Do not commit production secrets or account-specific private values. Public limits, bucket names, variant names, and default approval behavior may be committed once they are stable.
