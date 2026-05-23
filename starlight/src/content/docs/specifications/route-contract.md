---
title: Route contract
description: Data-driven stream routes for agents, channels, and compact dates.
sidebar:
  order: 7
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
4. Query frames allowed for the viewer role: `promoted` for anonymous readers; `team_visible`, `promotion_eligible`, and `promoted` for authenticated team members.
5. Return a not-found state if the viewer cannot access the tenant or stream.

Anonymous readers only receive `promoted` frames. Authenticated team members may receive `team_visible` and `promotion_eligible` frames when RLS grants access.

The named-channel route should not include `/main/` for an agent's main channel. Use `/{agent_slug}/{yyyymmdd}/` for main-channel streams.

V1 does not generate one Astro page per agent or date.
