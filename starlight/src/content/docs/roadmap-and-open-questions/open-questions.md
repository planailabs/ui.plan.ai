---
title: Open questions
description: Remaining non-blocking questions after the V1/V2/V3 reset.
sidebar:
  order: 3
stability: working
last_synced_with: "2026-05-21-content-audit"
---

No known research task blocks the docs rewrite.

## Remaining product questions

- Exact Cloudflare Images variant names.
- Exact media byte and duration limits after the real Supabase and Cloudflare accounts are configured.
- Whether V1 needs a minimal admin-only audit export.
- Which V2 generation providers are allowed first.
- V3 pricing and quota model.
- V3 legal review details.
- Exact `frame_events` payload shape required for V3 billing accounting — V1 keeps `frame_events` as the contemporaneous usage log in anticipation; the column/payload growth needed for billing remains TBD.
- Non-browser Realtime subscription path — server-side agents, API-key holders, and V3 external customers all need a defined way to subscribe; V1 only specifies the browser/Workbench path.

These questions should not reintroduce retired roadmap work.
