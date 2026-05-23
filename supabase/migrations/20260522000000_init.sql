-- V1 init migration. Source of truth: starlight/src/content/docs/specifications/supabase-sql.md

create extension if not exists pgcrypto;
create extension if not exists citext;

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
  label text,
  prefix text not null unique,
  hash text not null,
  hash_algorithm text not null default 'sha256',
  scopes text[] not null default '{}',
  settings jsonb not null default '{}'::jsonb,
  last_used_at timestamptz,
  revoked_at timestamptz,
  expires_at timestamptz,
  created_by uuid references auth.users(id),
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
  failure_reason text,
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
  request_id text,
  payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table tenant_invitations (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references tenants(id) on delete cascade,
  email citext not null,
  role tenant_role not null,
  token_hash text not null,
  invited_by uuid not null references auth.users(id),
  expires_at timestamptz not null,
  redeemed_at timestamptz,
  redeemed_by uuid references auth.users(id),
  created_at timestamptz not null default now()
);

create table stream_webhook_events (
  id text primary key,
  received_at timestamptz not null default now(),
  status_state text not null,
  asset_uid text not null
);

create index tenant_members_user_idx on tenant_members (user_id);
create index agents_tenant_idx on agents (tenant_id);
create index agent_channels_agent_idx on agent_channels (agent_id);
create index frame_submissions_review_idx on frame_submissions (tenant_id, status, created_at desc);
create index frames_route_idx on frames (agent_id, channel_id, date_key, status);
create index frame_media_submission_idx on frame_media (submission_id);
create index frame_events_submission_idx on frame_events (submission_id, created_at desc);
create unique index tenant_invitations_open_email_idx
  on tenant_invitations (tenant_id, email)
  where redeemed_at is null;
create index tenant_invitations_expiry_idx on tenant_invitations (expires_at);
create index stream_webhook_events_received_idx on stream_webhook_events (received_at desc);

create or replace function handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, display_name)
  values (new.id, new.email, nullif(new.raw_user_meta_data->>'display_name', ''))
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute function handle_new_user();

create or replace function enforce_last_owner()
returns trigger
language plpgsql
as $$
declare
  owner_count int;
  target_tenant uuid;
begin
  if tg_op = 'DELETE' then
    target_tenant := old.tenant_id;
  else
    target_tenant := new.tenant_id;
  end if;

  select count(*) into owner_count
  from tenant_members
  where tenant_id = target_tenant and role = 'owner';

  if tg_op = 'DELETE' and old.role = 'owner' and owner_count <= 1 then
    raise exception 'cannot remove the last owner of tenant %', target_tenant;
  end if;

  if tg_op = 'UPDATE' and old.role = 'owner' and new.role <> 'owner' and owner_count <= 1 then
    raise exception 'cannot demote the last owner of tenant %', target_tenant;
  end if;

  return coalesce(new, old);
end;
$$;

drop trigger if exists enforce_last_owner_trg on tenant_members;
create trigger enforce_last_owner_trg
before update or delete on tenant_members
for each row execute function enforce_last_owner();

create or replace function set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

create trigger tenants_updated_at before update on tenants
  for each row execute function set_updated_at();
create trigger agents_updated_at before update on agents
  for each row execute function set_updated_at();
create trigger agent_channels_updated_at before update on agent_channels
  for each row execute function set_updated_at();
create trigger approval_policies_updated_at before update on approval_policies
  for each row execute function set_updated_at();
create trigger frame_submissions_updated_at before update on frame_submissions
  for each row execute function set_updated_at();
create trigger frames_updated_at before update on frames
  for each row execute function set_updated_at();
create trigger frame_media_updated_at before update on frame_media
  for each row execute function set_updated_at();

alter table profiles enable row level security;
alter table tenants enable row level security;
alter table tenant_members enable row level security;
alter table agents enable row level security;
alter table agent_channels enable row level security;
alter table api_keys enable row level security;
alter table approval_policies enable row level security;
alter table frame_submissions enable row level security;
alter table frames enable row level security;
alter table frame_media enable row level security;
alter table frame_events enable row level security;
alter table tenant_invitations enable row level security;
alter table stream_webhook_events enable row level security;

alter table tenants force row level security;
alter table tenant_members force row level security;
alter table agents force row level security;
alter table agent_channels force row level security;
alter table api_keys force row level security;
alter table approval_policies force row level security;
alter table frame_submissions force row level security;
alter table frames force row level security;
alter table frame_media force row level security;
alter table frame_events force row level security;
alter table tenant_invitations force row level security;
alter table stream_webhook_events force row level security;

create or replace function current_tenant_role(t uuid)
returns tenant_role
language sql
stable
as $$
  select role from tenant_members
  where tenant_id = t and user_id = (select auth.uid())
  limit 1;
$$;

create or replace function is_tenant_member(t uuid)
returns boolean
language sql
stable
as $$
  select exists (
    select 1 from tenant_members
    where tenant_id = t and user_id = (select auth.uid())
  );
$$;

create policy "profiles self or shared tenant"
on profiles for select to authenticated
using (
  id = (select auth.uid())
  or exists (
    select 1 from tenant_members me
    join tenant_members them on them.tenant_id = me.tenant_id
    where me.user_id = (select auth.uid()) and them.user_id = profiles.id
  )
);

create policy "profiles self update"
on profiles for update to authenticated
using (id = (select auth.uid()))
with check (id = (select auth.uid()));

create policy "tenants member read"
on tenants for select to authenticated
using (is_tenant_member(id));

create policy "tenants owner update"
on tenants for update to authenticated
using (current_tenant_role(id) = 'owner')
with check (current_tenant_role(id) = 'owner');

create policy "tenant_members member read"
on tenant_members for select to authenticated
using (is_tenant_member(tenant_id));

create policy "tenant_members owner insert"
on tenant_members for insert to authenticated
with check (current_tenant_role(tenant_id) = 'owner');

create policy "tenant_members owner update"
on tenant_members for update to authenticated
using (current_tenant_role(tenant_id) = 'owner')
with check (current_tenant_role(tenant_id) = 'owner');

create policy "tenant_members owner delete not self"
on tenant_members for delete to authenticated
using (current_tenant_role(tenant_id) = 'owner' and user_id <> (select auth.uid()));

create policy "agents member read"
on agents for select to authenticated
using (is_tenant_member(tenant_id));

create policy "agents owner_admin write"
on agents for all to authenticated
using (current_tenant_role(tenant_id) in ('owner','admin'))
with check (current_tenant_role(tenant_id) in ('owner','admin'));

create policy "agent_channels member read"
on agent_channels for select to authenticated
using (is_tenant_member(tenant_id));

create policy "agent_channels owner_admin write"
on agent_channels for all to authenticated
using (current_tenant_role(tenant_id) in ('owner','admin'))
with check (current_tenant_role(tenant_id) in ('owner','admin'));

revoke all on api_keys from authenticated;
revoke all on api_keys from anon;

create policy "approval_policies member read"
on approval_policies for select to authenticated
using (is_tenant_member(tenant_id));

create policy "approval_policies owner_admin write"
on approval_policies for all to authenticated
using (current_tenant_role(tenant_id) in ('owner','admin'))
with check (current_tenant_role(tenant_id) in ('owner','admin'));

create policy "frame_submissions member read"
on frame_submissions for select to authenticated
using (is_tenant_member(tenant_id));

create policy "frame_submissions member update"
on frame_submissions for update to authenticated
using (current_tenant_role(tenant_id) in ('owner','admin','member'))
with check (current_tenant_role(tenant_id) in ('owner','admin','member'));

create policy "frames member read"
on frames for select to authenticated
using (is_tenant_member(tenant_id));

create policy "frames public promoted read"
on frames for select to anon
using (status in ('promotion_eligible','promoted'));

create policy "frames member update"
on frames for update to authenticated
using (current_tenant_role(tenant_id) in ('owner','admin','member'))
with check (current_tenant_role(tenant_id) in ('owner','admin','member'));

create policy "frame_media member read"
on frame_media for select to authenticated
using (is_tenant_member(tenant_id));

create policy "frame_events member read"
on frame_events for select to authenticated
using (is_tenant_member(tenant_id));

create policy "tenant_invitations owner read"
on tenant_invitations for select to authenticated
using (current_tenant_role(tenant_id) = 'owner');

create policy "tenant_invitations owner write"
on tenant_invitations for all to authenticated
using (current_tenant_role(tenant_id) = 'owner')
with check (current_tenant_role(tenant_id) = 'owner');

alter publication supabase_realtime add table frame_events;
alter publication supabase_realtime add table frame_submissions;
alter publication supabase_realtime add table frames;
alter publication supabase_realtime add table frame_media;

insert into storage.buckets (id, name, public)
values ('frame-originals', 'frame-originals', false)
on conflict (id) do nothing;

create policy "frame-originals tenant member read"
on storage.objects for select to authenticated
using (
  bucket_id = 'frame-originals'
  and exists (
    select 1 from tenant_members
    where tenant_members.user_id = (select auth.uid())
      and tenant_members.tenant_id::text = split_part(name, '/', 1)
  )
);
