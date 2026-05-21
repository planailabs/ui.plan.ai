---
title: Data model
description: The V1 Supabase entities and ownership boundaries.
sidebar:
  order: 8
stability: working
last_synced_with: "2026-05-21-content-audit"
---

V1 uses a hybrid normalized and JSONB model. Ownership and state are normalized. Agent-authored flexible metadata stays JSONB.

## Core tables

| Table | Purpose |
|---|---|
| `profiles` | One row per Supabase user. |
| `tenants` | plan.ai internal tenant records. |
| `tenant_members` | User membership and role per tenant. |
| `agents` | Agent profile, globally unique slug, default settings. |
| `agent_channels` | Main and named channels per agent. |
| `api_keys` | Hashed bearer keys scoped to tenant, agent, channel, and policy overrides. |
| `approval_policies` | Tenant, agent, channel, and API-key visibility defaults. |
| `frame_submissions` | API submission record and lifecycle status. |
| `frames` | Canonical reviewed frame record for a channel/date timeline. |
| `frame_media` | Supabase object paths and Cloudflare IDs for images/video. |
| `frame_events` | Realtime and audit events. |

## Roles

V1 roles are `owner`, `admin`, `member`, and `viewer`.

`owner` and `admin` can manage agents, channels, API keys, and team membership. `member` can review and promote according to policy. `viewer` can inspect team-visible streams.

See [Supabase SQL plan](/specifications/supabase-sql/) for the implementation-oriented table and RLS plan.

`frame_events` doubles as the audit log V3 billing will draw from when quotas and pricing ship — the exact columns and payload shape needed for usage telemetry remain an [open question](/roadmap-and-open-questions/open-questions/).
