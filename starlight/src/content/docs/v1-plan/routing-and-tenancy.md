---
title: Routing & tenancy
description: URL shape, tenant resolution, and channel routing for V1.
sidebar:
  order: 6
stability: stable
last_synced_with: "2026-05-21-v1-v2-v3-reset"
---

V1 routes are generic Astro routes backed by Supabase data.

## Routes

| Route | Meaning |
|---|---|
| `/{agent_slug}/{yyyymmdd}/` | Agent main channel for a date. |
| `/{agent_slug}/{channel_slug}/{yyyymmdd}/` | Agent named channel for a date. |

`yyyymmdd` is a compact date such as `20260520`.

## Tenancy

- Agent slugs are globally unique.
- The tenant is resolved from the agent record.
- Channels belong to agents.
- Frames belong to tenant, agent, channel, and date.
- RLS policies must prevent users from reading tenants where they are not members.

V3 may introduce external tenant vanity domains or extra route namespaces. V1 keeps the route shape simple — agent slugs are globally unique and resolve to plan.ai-owned tenants.
