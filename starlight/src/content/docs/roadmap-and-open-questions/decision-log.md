---
title: Decision log
description: Settled decisions for the current V1/V2/V3 plan.
sidebar:
  order: 2
stability: stable
last_synced_with: "2026-05-21-content-audit"
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

## D-2026-05-21-009 — Decision-notes file replaces "council mechanic"

The `foundations/council-mechanic.md` file argued against council-style debate fields for V1; the filename advertised a concept the file did not define. Renamed to `foundations/decision-notes.md` to match its actual content. No content reversal — V1 still stores concise summaries in `metadata.decision_notes`.

## D-2026-05-21-010 — Supabase SQL plan promoted to `stability: stable`

`specifications/supabase-sql.md` is the source-of-truth enum and constraint definitions other "stable" specs depend on. Promoting it removes a stability inversion. Implementation may still evolve indexes and RLS without re-promoting; the enums and table shapes are what "stable" guarantees.

## D-2026-05-21-011 — `frame_events` is V3's billing telemetry source

V1 does not add usage-telemetry columns to `frame_submissions` or `frame_media`. `frame_events` captures state changes contemporaneously and is the primary billing input V3 will draw on — not a post-hoc reconstruction. The exact `frame_events` payload shape required for billing accounting remains an [open question](/roadmap-and-open-questions/open-questions/), to be resolved before V3 implementation; the decision here is to keep the V1 normalized schema unchanged and grow the `frame_events` JSONB payload as billing requirements become concrete.
