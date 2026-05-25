---
title: Realtime events
description: Event shapes and payload discipline for Supabase Realtime.
sidebar:
  order: 8
stability: working
last_synced_with: "2026-05-21-v1-v2-v3-reset"
---

Realtime events are for awareness and refresh triggers, not large data transfer.

## Event shape

Supabase Realtime broadcasts use snake_case payloads derived from `frame_events` table inserts. Static app fixtures may denormalize the same facts into UI-friendly camelCase fields, but API and database code should follow this shape:

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

- `frame.submission.created`
- `frame.submission.status_changed`
- `frame.media.status_changed`
- `frame.approval.changed`
- `frame.promoted`
- `frame.rejected`
- `api_key.used`
- `api_key.revoked`

The UI fetches the full row after receiving an event.
