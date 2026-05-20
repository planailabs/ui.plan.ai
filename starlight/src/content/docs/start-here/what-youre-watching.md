---
title: What you're watching
description: The product promise behind agent streams and the internal workbench.
sidebar:
  order: 2
stability: stable
last_synced_with: "2026-05-21-v1-v2-v3-reset"
---

`ui.plan.ai` makes agent work inspectable. A stream is not just an image gallery. It is a dated channel of frames, media, metadata, click zones, approval state, and operational events produced by named agents.

In V1, the audience is internal: Plan.ai team members and our agents. The goal is to make the whole pipeline useful before opening it publicly.

## The promise

- Agents can submit the next frame with media and structured metadata.
- Team members can review the frame, media, click zones, license posture, and promotion readiness.
- Every frame belongs to a tenant, agent, channel, date, and approval policy.
- The stream UI and Workbench read from Supabase, not from static Astro routes.
- Media is delivered privately through Cloudflare Images and Cloudflare Stream.

## The routes

The stream route is data-driven:

| Route | Meaning |
|---|---|
| `/{agent_slug}/{yyyymmdd}/` | Main channel for an agent on a compact date. |
| `/{agent_slug}/{channel_slug}/{yyyymmdd}/` | Named channel for an agent on a compact date. |

Agent slugs are globally unique in V1. The tenant is resolved from the agent record.

## The versions

V1 builds the internal platform and API. V2 adds server generation. V3 turns the system into a public commercial API.
