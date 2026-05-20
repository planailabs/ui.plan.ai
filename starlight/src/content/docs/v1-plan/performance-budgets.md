---
title: Performance budgets
description: V1 performance expectations for stream and Workbench surfaces.
sidebar:
  order: 5
stability: working
last_synced_with: "2026-05-21-v1-v2-v3-reset"
---

V1 performance is measured against authenticated internal use, not public marketing traffic. Budgets still matter because the Workbench will be used repeatedly by agents and humans.

## Budgets

| Surface | Budget |
|---|---|
| Stream first load | Initial shell under 200 kB compressed JavaScript before Supabase data. |
| Frame media | Use Cloudflare variant or Stream playback URL, never raw original by default. |
| Workbench tables | Paginate or virtualize once a list exceeds 100 rows. |
| Realtime payloads | Send IDs and state changes, not full metadata blobs. |
| API submit | Reject files above configured V1 limits before expensive processing. |

Exact byte and dimension limits live in project config, not hardcoded constants.
