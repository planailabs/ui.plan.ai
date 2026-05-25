---
title: Realtime operations
description: How V1 uses Supabase Realtime without overloading events.
sidebar:
  order: 14
stability: working
last_synced_with: "2026-05-22-llm-council-v1-pass"
verify_against:
  - https://supabase.com/docs/guides/realtime/authorization
  - https://supabase.com/docs/guides/realtime/postgres-changes
---

V1 uses Supabase Realtime for workbench awareness and stream updates. See [Upstream docs](/reference/upstream-docs/) for the latest Realtime contract.

## Transport

V1 uses **Postgres Changes** only, not broadcast channels. The workbench subscribes to row changes filtered by `tenant_id`, and RLS on the underlying tables enforces visibility — the channel itself does not need a separate auth model.

Only these tables are in the `supabase_realtime` publication:

- `frame_events`
- `frame_submissions`
- `frames`
- `frame_media`

Everything else (API keys, policies, members) is fetched on demand.

## Events

Realtime payloads should be small. Event names use dotted form and match the canonical list in [Realtime events](/specifications/realtime-events/):

- `frame.submission.created`
- `frame.submission.status_changed`
- `frame.media.status_changed` (intermediate transitions)
- `frame.media.ready` (terminal success)
- `frame.media.failed` (terminal failure)
- `frame.approval.changed`
- `frame.promoted`
- `frame.rejected`
- `api_key.used`
- `api_key.revoked`

The event payload carries IDs, status, actor, and timestamp — plus the originating `request_id` (see [Observability](/v1-plan/observability/)). The UI fetches full records from Supabase when it needs detail.

## Subscription discipline

- The workbench opens one subscription per active screen.
- A client holds at most a small, documented number of channels concurrently; route changes close stale subscriptions.
- Stream `ready` webhooks come from Cloudflare to an Edge Function, which writes a row and lets Postgres Changes fan it out — the workbench never subscribes to Cloudflare directly.

## Why small payloads

Frame metadata can be large and flexible. Broadcasting full metadata would make every update expensive and fragile. IDs and state transitions are enough for live UI updates.
