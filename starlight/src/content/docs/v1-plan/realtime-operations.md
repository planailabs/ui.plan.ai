---
title: Realtime operations
description: How V1 uses Supabase Realtime without overloading events.
sidebar:
  order: 14
stability: working
last_synced_with: "2026-05-21-content-audit"
---

V1 uses Supabase Realtime for Workbench awareness and stream updates.

## Events

Realtime events should be small. Names use dotted form and match the canonical list in [Realtime events](/specifications/realtime-events/):

- `frame.submission.created`
- `frame.submission.status_changed`
- `frame.media.status_changed`
- `frame.approval.changed`
- `frame.promoted`
- `frame.rejected`
- `api_key.used`
- `api_key.revoked`

The event payload carries IDs, status, actor, and timestamp. The UI fetches full records from Supabase when it needs detail.

## Why small payloads

Frame metadata can be large and flexible. Broadcasting full metadata would make every update expensive and fragile. IDs and state transitions are enough for live UI updates.
