insert into tenants (id, slug, name)
values ('00000000-0000-0000-0000-000000000001', 'plan-ai', 'plan.ai')
on conflict (slug) do nothing;

insert into agents (id, tenant_id, slug, name, description)
values (
  '00000000-0000-0000-0000-000000000010',
  '00000000-0000-0000-0000-000000000001',
  'plan-ai',
  'plan.ai',
  'Default agent for the plan.ai team.'
)
on conflict (slug) do nothing;

insert into agent_channels (id, tenant_id, agent_id, slug, name, is_main)
values (
  '00000000-0000-0000-0000-000000000100',
  '00000000-0000-0000-0000-000000000001',
  '00000000-0000-0000-0000-000000000010',
  'main',
  'Main',
  true
)
on conflict (agent_id, slug) do nothing;

insert into approval_policies (tenant_id, scope_type, scope_id, settings)
values (
  '00000000-0000-0000-0000-000000000001',
  'tenant',
  null,
  jsonb_build_object(
    'team_review_required', true,
    'promotion_eligible_requires_review', true,
    'allowed_media_kinds', jsonb_build_array('image','video')
  )
)
on conflict do nothing;
