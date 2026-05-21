---
title: Supabase SQL plan
description: Implementation-oriented SQL, RLS, indexes, and realtime plan for V1.
sidebar:
  order: 4
stability: stable
last_synced_with: "2026-05-21-content-audit"
---

This is a SQL plan, not a copied blueprint from another repo. It defines the tables, constraints, and policies V1 needs before app implementation starts.

## Enums

```sql
create type tenant_role as enum ('owner', 'admin', 'member', 'viewer');
create type submission_status as enum (
  'received',
  'waiting_for_upload',
  'media_processing',
  'needs_review',
  'team_visible',
  'promotion_eligible',
  'promoted',
  'rejected',
  'failed'
);
create type frame_status as enum (
  'team_visible',
  'promotion_eligible',
  'promoted',
  'rejected'
);
create type media_kind as enum ('image', 'video');
create type approval_scope as enum ('tenant', 'agent', 'channel', 'api_key');
```

## Table shape

```sql
create table profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  display_name text,
  created_at timestamptz not null default now()
);

create table tenants (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  settings jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table tenant_members (
  tenant_id uuid not null references tenants(id) on delete cascade,
  user_id uuid not null references profiles(id) on delete cascade,
  role tenant_role not null,
  created_at timestamptz not null default now(),
  primary key (tenant_id, user_id)
);

create table agents (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references tenants(id) on delete cascade,
  slug text not null unique,
  name text not null,
  description text,
  settings jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table agent_channels (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references tenants(id) on delete cascade,
  agent_id uuid not null references agents(id) on delete cascade,
  slug text not null,
  name text not null,
  is_main boolean not null default false,
  settings jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (agent_id, slug)
);

create unique index agent_channels_one_main_per_agent
on agent_channels (agent_id)
where is_main;

create table api_keys (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references tenants(id) on delete cascade,
  agent_id uuid references agents(id) on delete cascade,
  channel_id uuid references agent_channels(id) on delete cascade,
  prefix text not null unique,
  hash text not null,
  hash_algorithm text not null default 'sha256',
  scopes text[] not null default '{}',
  settings jsonb not null default '{}'::jsonb,
  last_used_at timestamptz,
  revoked_at timestamptz,
  created_at timestamptz not null default now()
);

create table approval_policies (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references tenants(id) on delete cascade,
  scope_type approval_scope not null,
  scope_id uuid,
  settings jsonb not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique nulls not distinct (tenant_id, scope_type, scope_id)
);

create table frame_submissions (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references tenants(id) on delete cascade,
  agent_id uuid not null references agents(id) on delete cascade,
  channel_id uuid not null references agent_channels(id) on delete cascade,
  api_key_id uuid references api_keys(id) on delete set null,
  idempotency_key text,
  status submission_status not null default 'received',
  metadata_schema_version text not null,
  metadata jsonb not null,
  error jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create unique index frame_submissions_idempotency
on frame_submissions (api_key_id, idempotency_key)
where idempotency_key is not null;

create table frames (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references tenants(id) on delete cascade,
  agent_id uuid not null references agents(id) on delete cascade,
  channel_id uuid not null references agent_channels(id) on delete cascade,
  date_key text not null check (date_key ~ '^[0-9]{8}$'),
  status frame_status not null default 'team_visible',
  current_submission_id uuid references frame_submissions(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table frame_media (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references tenants(id) on delete cascade,
  submission_id uuid not null references frame_submissions(id) on delete cascade,
  kind media_kind not null,
  storage_provider text not null,
  storage_key text not null,
  delivery_id text,
  status text not null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table frame_events (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references tenants(id) on delete cascade,
  submission_id uuid references frame_submissions(id) on delete cascade,
  event_type text not null,
  actor_type text not null,
  actor_id uuid,
  payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);
```

Every tenant-owned table carries `tenant_id`, timestamps, and indexes on the columns used by route resolution and review queues.

## Required constraints

- `agents.slug` is globally unique.
- Each agent has one `agent_channels.is_main = true` row.
- `frame_submissions.idempotency_key` is unique per API key and endpoint.
- `api_keys` stores `hash`, `prefix`, `scopes`, and `revoked_at`, never the raw token.
- `frame_media.storage_key` stores Supabase object paths or Cloudflare asset IDs, never signed delivery URLs.

## Required indexes

```sql
create index tenant_members_user_idx on tenant_members (user_id);
create index agents_tenant_idx on agents (tenant_id);
create index agent_channels_agent_idx on agent_channels (agent_id);
create index frame_submissions_review_idx on frame_submissions (tenant_id, status, created_at desc);
create index frames_route_idx on frames (agent_id, channel_id, date_key, status);
create index frame_media_submission_idx on frame_media (submission_id);
create index frame_events_submission_idx on frame_events (submission_id, created_at desc);
```

## RLS policy intent

Browser policies are membership-based:

```sql
create policy "members can read tenant agents"
on agents for select
using (
  exists (
    select 1
    from tenant_members
    where tenant_members.tenant_id = agents.tenant_id
      and tenant_members.user_id = auth.uid()
  )
);
```

Write policies should distinguish roles:

- `owner` and `admin` manage tenants, members, agents, channels, API keys, and settings.
- `member` reviews frame submissions and changes review state where policy allows.
- `viewer` reads team-visible streams and review-safe metadata.

Agent API writes happen through Supabase Edge Functions after hashed API-key verification. Do not expose API-key writes directly through browser RLS.

## Realtime

Realtime should broadcast small events from `frame_events` or database triggers. Payloads include IDs, status, actor, and timestamp. Full metadata stays in `frame_submissions.metadata` and is fetched by ID.
