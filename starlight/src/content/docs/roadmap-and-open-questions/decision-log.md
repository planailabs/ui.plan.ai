---
title: Decision log
description: Settled decisions for the current V1/V2/V3 plan.
sidebar:
  order: 2
stability: stable
last_synced_with: "2026-05-21-v1-v2-v3-reset"
---

## D-2026-05-21-001 — Version ladder is V1, V2, V3

V1 is the internal platform. V2 is server generation. V3 is the public commercial API.

## D-2026-05-21-002 — V1 uses Supabase

V1 uses Supabase Auth, Postgres, Storage, Edge Functions, and Realtime. Static Astro routes per agent/date are not part of the plan.

## D-2026-05-21-003 — V1 is multi-tenant and multi-user

Tenancy and team roles ship from day one, even though V1 is internal.

## D-2026-05-21-004 — Agent API uses hybrid media ingest

PNG and small media use multipart frame submissions. Large video uses direct or resumable upload through Cloudflare Stream.

## D-2026-05-21-005 — API contracts are OpenAPI plus JSON schema

Starlight explains workflows. The machine-readable endpoint source lives in `starlight/public/specs/`.

## D-2026-05-21-006 — Git history replaces live archives

Old docs are replaced directly. The live docs should only describe current direction.

## D-2026-05-21-007 — Browser auth uses PKCE and sessionStorage

V1 team-member browser sessions use Supabase Auth with PKCE and `sessionStorage` as the default session store. Agents use API keys, not user sessions.

## D-2026-05-21-008 — Project limits are config-driven

Media, delivery, and API limits come from `config/project.config.json` and account-specific Supabase/Cloudflare limits, not hardcoded endpoint constants.
