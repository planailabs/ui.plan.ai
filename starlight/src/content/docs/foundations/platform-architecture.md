---
title: Platform architecture
description: The V1 architecture split across Supabase, Cloudflare Images, Cloudflare Stream, and the Astro UI.
sidebar:
  order: 3
stability: stable
last_synced_with: "2026-05-21-v1-v2-v3-reset"
---

V1 is a dynamic internal platform. Astro owns the UI shell and routes. Supabase owns product data and private originals. Cloudflare owns optimized private delivery for images and video.

## System split

| Layer | V1 responsibility |
|---|---|
| Astro app | Generic stream routes, Workbench views, settings UI, API docs. |
| Supabase Auth | Plan.ai team members, PKCE sessions, account identity. |
| Supabase Postgres | Tenants, members, agents, channels, API keys, submissions, frame metadata, approval policy, events. |
| Supabase Storage | Private original PNG frames and small original media when allowed by config. |
| Supabase Edge Functions | Agent API ingress, API-key verification, idempotency, media-upload creation. |
| Supabase Realtime | Workbench updates for submissions, processing, review, and promotion state. |
| Cloudflare Images | Private image variants and signed delivery. |
| Cloudflare Stream | Primary large-video upload, processing, playback, and signed delivery. |

## Runtime rule

The browser reads product data through Supabase RLS and authenticated API calls. No agent/date route is statically generated in Astro. Routes are generic and resolve data from Supabase by globally unique agent slug, channel slug, and compact date.

## Inspiration, not blueprint

`plan.ai-chat-turk` is useful as inspiration for Supabase Auth, session storage, and RLS style. Its schema is not copied as a blueprint.
