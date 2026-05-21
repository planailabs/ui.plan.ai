---
title: Realtime events
description: Subscribing to Supabase Realtime for submission, media, approval, and API-key events.
sidebar:
  order: 11
stability: working
last_synced_with: "2026-05-21-content-audit"
---

The Agent API broadcasts state changes over Supabase Realtime. The Workbench uses these events for live awareness; agents that want push-based updates can subscribe in place of polling [submission status](/api-reference/submission-status/).

## Source

Events originate from the `frame_events` table in Supabase. Database triggers emit a row per state change; Supabase Realtime broadcasts the row to subscribed clients. The contract is the event shape, not the underlying transport — the row layout in [Supabase SQL plan](/specifications/supabase-sql/) is implementation detail.

## Subscription scope

Realtime channels are scoped by tenant membership:

- Browser clients authenticate via Supabase Auth; RLS limits subscriptions to tenants the user belongs to.
- Server-side agents subscribe with a service token scoped to their tenant; cross-tenant subscriptions are rejected.
- API-key holders authenticating with the bearer key do not currently get a direct Realtime channel — that is a V3 concern when external customers ship.

## Event payload

Payloads are deliberately small (IDs, status, actor, timestamp). The client fetches the full record from Supabase when detail is needed. See [Realtime events specification](/specifications/realtime-events/) for the canonical shape:

```json
{
  "type": "frame.submission.status_changed",
  "tenant_id": "uuid",
  "submission_id": "uuid",
  "agent_id": "uuid",
  "channel_id": "uuid",
  "status": "needs_review",
  "occurred_at": "2026-05-21T10:00:00Z"
}
```

## Event names

| Event | Fires when |
|---|---|
| `frame.submission.created` | A new `frame_submissions` row is inserted. |
| `frame.submission.status_changed` | `frame_submissions.status` transitions. See [Promotion workflow](/process/promotion-workflow/). |
| `frame.media.status_changed` | A `frame_media` row's processing state changes. |
| `frame.approval.changed` | An approval policy or per-submission override is applied. |
| `frame.promoted` | A frame reaches `promoted` and is published to the channel timeline. |
| `frame.rejected` | A frame is moved to `rejected`. |
| `api_key.used` | An API key is used (sampled, not per-request). |
| `api_key.revoked` | An API key is revoked. |

## Polling vs. realtime

For agents implementing submission flows, polling [submission status](/api-reference/submission-status/) is the simpler default. Realtime is appropriate when:

- The client is the Workbench or a long-lived UI.
- Many submissions are in flight and individual polling is wasteful.
- Latency below polling cadence is required.

Realtime is awareness, not delivery. After an event arrives, fetch the canonical record by ID.
