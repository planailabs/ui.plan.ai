---
title: Data model
description: V1 Supabase schema plan for tenants, agents, channels, submissions, media, and events.
sidebar:
  order: 3
stability: working
last_synced_with: "2026-05-21-content-audit"
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

## Axes of state

Status is tracked on three independent axes. They are not interchangeable — readers and implementers should always name the axis explicitly.

| Axis | Column | Enum (see [Supabase SQL plan](/specifications/supabase-sql/)) | What it describes |
|---|---|---|---|
| Submission lifecycle | `frame_submissions.status` | `submission_status` (9 values) | The ingest/processing/review/terminal journey of a single submission. See [Promotion workflow](/process/promotion-workflow/). |
| Frame gate | `frames.status` | `frame_status` (4 values) | The reviewed frame entity's visibility gate from `team_visible` onward. See [Promotion gate philosophy](/foundations/promotion-gate/). |
| Media processing | `frame_media.status` | `received`, `media_processing`, `ready`, `failed` | Per-asset processing state from upload to ready delivery. |

A submission can be `needs_review` while its media is still `media_processing` — the axes advance independently until the reviewer makes a frame `team_visible`, at which point both submission and frame share the same four terminal-or-near-terminal gate states.

## RLS intent

- Browser reads only tenants where the user is a member.
- API-key calls are handled server-side by Edge Functions, not exposed through browser RLS.
- Realtime channels must be scoped by tenant membership.
