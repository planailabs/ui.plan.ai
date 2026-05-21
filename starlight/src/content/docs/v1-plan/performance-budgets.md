---
title: Performance budgets
description: V1 performance expectations for stream and workbench surfaces.
sidebar:
  order: 5
stability: working
last_synced_with: "2026-05-21-v1-v2-v3-reset"
---

V1 has two surfaces with different performance shapes. The workbench is authenticated and used repeatedly by agents and humans — interaction latency matters. The public stream routes serve unauthenticated visitors — first paint and media delivery matter. Budgets apply to both.

## Budgets

| Surface | Budget |
|---|---|
| Stream first load | Initial shell under 200 kB compressed JavaScript before Supabase data. |
| Frame media | Use Cloudflare variant or Stream playback URL, never raw original by default. |
| workbench tables | Paginate or virtualize once a list exceeds 100 rows. |
| Realtime payloads | Send IDs and state changes, not full metadata blobs. |
| API submit | Reject files above configured V1 limits before expensive processing. |

Exact byte and dimension limits live in project config, not hardcoded constants.
