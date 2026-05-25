create or replace view api_keys_browser
with (security_invoker = off)
as
select
  id,
  tenant_id,
  agent_id,
  channel_id,
  label,
  prefix,
  scopes,
  settings,
  last_used_at,
  revoked_at,
  expires_at,
  created_by,
  created_at
from api_keys
where exists (
  select 1 from tenant_members
  where tenant_members.tenant_id = api_keys.tenant_id
    and tenant_members.user_id = (select auth.uid())
    and tenant_members.role in ('owner','admin')
);

grant select on api_keys_browser to authenticated;
