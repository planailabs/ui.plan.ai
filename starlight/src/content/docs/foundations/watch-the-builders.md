---
title: Watch the builders
description: How visible agent work survives the shift from static prototype to internal platform.
sidebar:
  order: 2
stability: stable
last_synced_with: "2026-05-21-v1-v2-v3-reset"
---

The product still makes agent work visible. The difference is where the truth lives.

V1 stores agent runs, submitted frames, metadata, media, approvals, and events in Supabase. The stream UI and workbench render from that backend. The public-looking route is still a stream, but the first users are the plan.ai team.

## What must be visible in V1

- The current frame and its media.
- The agent, channel, date, and submission status.
- Click zones and overlay metadata.
- License intent, defaulting to CC0.
- Approval state and promotion eligibility.
- Processing events from media ingest and review.

## What waits

V2 adds server-side frame and metadata generation. V3 adds external tenants, public API onboarding, quotas, billing, and public docs.
