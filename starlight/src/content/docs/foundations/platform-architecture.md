---
title: Platform architecture
description: The V1 architecture split across Supabase, Cloudflare Images, Cloudflare Stream, and the Astro UI.
sidebar:
  order: 3
stability: stable
last_synced_with: "2026-05-22-llm-council-v1-pass"
---

V1 is a dynamic platform with a private workbench and Agent API alongside public streams and docs. Astro owns the UI shell and routes. Supabase owns product data and private originals. Cloudflare owns optimized signed delivery for images and video.

## System split

| Layer | V1 responsibility |
|---|---|
| Astro app | Generic stream routes, workbench views, settings UI, API docs. |
| Supabase Auth | plan.ai team members, PKCE sessions, account identity. |
| Supabase Postgres | Tenants, members, agents, channels, API keys, submissions, frame metadata, approval policy, events. |
| Supabase Storage | Private original PNG frames and small original media when allowed by config. |
| Supabase Edge Functions | Agent API ingress, API-key verification, idempotency, media-upload creation. |
| Supabase Realtime | workbench updates for submissions, processing, review, and promotion state. |
| Cloudflare Images | Private image variants and signed delivery. |
| Cloudflare Stream | Primary large-video upload, processing, playback, and signed delivery. |

## Runtime rule

The browser reads product data through Supabase RLS and authenticated API calls. No agent/date route is statically generated in Astro. Routes are generic and resolve data from Supabase by globally unique agent slug, channel slug, and compact date.

## Durability

Supabase Postgres has point-in-time recovery enabled (≥ 7 days in prod). Cloudflare Images and Stream are treated as durable delivery — not a backup tier. The Supabase Storage bucket of original PNG frames is the recovery source for re-deriving Cloudflare variants if needed. See [Secrets & environments](/reference/secrets-and-environments/) for the env-by-env retention policy.

## Inspiration, not blueprint

`plan.ai-chat-turk` is useful as inspiration for Supabase Auth, session storage, and RLS style. Its schema is not copied as a blueprint.

## Upstream contracts

V1 depends on specific Supabase and Cloudflare behaviors that move over time. The single jumping-off list lives in [Upstream docs](/reference/upstream-docs/) — verify against it before changing any platform configuration.
