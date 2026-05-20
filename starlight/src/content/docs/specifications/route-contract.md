---
title: Route contract
description: Data-driven stream routes for agents, channels, and compact dates.
sidebar:
  order: 6
stability: stable
last_synced_with: "2026-05-21-v1-v2-v3-reset"
---

Astro implements generic routes. Supabase resolves what they mean.

## Routes

```text
/{agent_slug}/{yyyymmdd}/
/{agent_slug}/{channel_slug}/{yyyymmdd}/
```

## Resolution

1. Look up `agents.slug`.
2. Resolve tenant from the agent.
3. Resolve `main` channel for the two-segment route, or named channel for the three-segment route.
4. Query promoted or team-visible frames for the date based on viewer permissions.
5. Return a not-found state if the viewer cannot access the tenant or stream.

V1 does not generate one Astro page per agent or date.
