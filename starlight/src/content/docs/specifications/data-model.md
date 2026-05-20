---
title: Data model
description: V1 Supabase schema plan for tenants, agents, channels, submissions, media, and events.
sidebar:
  order: 3
stability: working
last_synced_with: "2026-05-21-v1-v2-v3-reset"
---

The SQL plan should keep ownership and authorization explicit.

## Tables

| Table | Key columns |
|---|---|
| `profiles` | `id`, `email`, `display_name`, `created_at` |
| `tenants` | `id`, `slug`, `name`, `settings`, `created_at` |
| `tenant_members` | `tenant_id`, `user_id`, `role`, `created_at` |
| `agents` | `tenant_id`, `slug`, `name`, `description`, `settings` |
| `agent_channels` | `tenant_id`, `agent_id`, `slug`, `name`, `is_main`, `settings` |
| `api_keys` | `tenant_id`, `agent_id`, `channel_id`, `hash`, `prefix`, `scopes`, `last_used_at`, `revoked_at` |
| `approval_policies` | `tenant_id`, `scope_type`, `scope_id`, `settings` |
| `frame_submissions` | `tenant_id`, `agent_id`, `channel_id`, `api_key_id`, `status`, `metadata`, `idempotency_key` |
| `frames` | `tenant_id`, `agent_id`, `channel_id`, `date_key`, `status`, `current_submission_id` |
| `frame_media` | `submission_id`, `kind`, `storage_provider`, `storage_key`, `delivery_id`, `status` |
| `frame_events` | `tenant_id`, `submission_id`, `event_type`, `actor_type`, `payload` |

## RLS intent

- Browser reads only tenants where the user is a member.
- API-key calls are handled server-side by Edge Functions, not exposed through browser RLS.
- Realtime channels must be scoped by tenant membership.
