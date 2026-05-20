---
title: Realtime operations
description: How V1 uses Supabase Realtime without overloading events.
sidebar:
  order: 11
stability: working
last_synced_with: "2026-05-21-v1-v2-v3-reset"
---

V1 uses Supabase Realtime for Workbench awareness and stream updates.

## Events

Realtime events should be small:

- submission created,
- media upload created,
- media processing changed,
- approval state changed,
- frame promoted,
- frame rejected,
- API key used or revoked.

The event payload carries IDs, status, actor, and timestamp. The UI fetches full records from Supabase when it needs detail.

## Why small payloads

Frame metadata can be large and flexible. Broadcasting full metadata would make every update expensive and fragile. IDs and state transitions are enough for live UI updates.
