-- RLS hardening follow-up to 20260522000000_init.sql.
-- Surfaced by a code-review council (Codex deep-check). Two defects in the
-- initial policies:
--
--   1. Infinite recursion in tenant membership checks.
--      current_tenant_role() / is_tenant_member() were plain (invoker) SQL, but
--      the tenant_members SELECT policy itself calls is_tenant_member(). Under
--      RLS the helper re-queries tenant_members, which re-applies the policy,
--      which calls the helper again -> Postgres "infinite recursion detected in
--      policy for relation tenant_members". This breaks every authenticated read
--      that funnels through membership, including workbench boot
--      (src/lib/tenant.ts listMyTenants). Fix: SECURITY DEFINER with a pinned
--      search_path so the helper bypasses RLS on its own lookup. This mirrors
--      the existing is_aal2() definer in the init migration.
--
--   2. Anonymous over-exposure of pre-public frames.
--      "frames public promoted read" granted anon SELECT on BOTH
--      'promotion_eligible' and 'promoted'. promotion_eligible is a team-only
--      candidate state (see frame fixtures in src/lib/v1/local.ts and the
--      promotion-gate / glossary docs); only 'promoted' belongs in the anonymous
--      public stream. Fix: restrict the anon policy to status = 'promoted'.

-- 1. Break the RLS recursion: make the membership helpers SECURITY DEFINER.
create or replace function current_tenant_role(t uuid)
returns tenant_role
language sql
stable
security definer
set search_path = public
as $$
  select role from tenant_members
  where tenant_id = t and user_id = (select auth.uid())
  limit 1;
$$;

create or replace function is_tenant_member(t uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from tenant_members
    where tenant_id = t and user_id = (select auth.uid())
  );
$$;

-- 2. Restrict anonymous frame reads to promoted frames only.
drop policy if exists "frames public promoted read" on frames;
create policy "frames public promoted read"
on frames for select to anon
using (status = 'promoted');
