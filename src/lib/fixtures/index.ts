// Static demo data for v1 mock backend mode. Sized small on purpose:
// one tenant, two agents, two channels, five frames on a single date. Enough
// to render every page that ships in v1; small enough that a reviewer can
// hold the full graph in their head.

import type {
	Agent,
	AgentChannel,
	ApiKey,
	ApprovalPolicy,
	FrameRecord,
	FrameSubmission,
	Tenant,
	TenantMember,
} from '../types';

const T = '2026-05-21T10:00:00Z';
const T_LATER = '2026-05-21T10:14:33Z';

export const DEMO_DATE = '20260520';

export const tenant: Tenant = {
	id: 'ten_01hyx0p9q2h3m4n5v6r7s8t9u0',
	slug: 'plan.ai',
	name: 'plan.ai',
	created_at: T,
};

export const members: TenantMember[] = [
	{
		tenant_id: tenant.id,
		user_id: 'usr_01hyx0p9q2h3m4n5v6r7s8t9u0',
		display_name: 'plan.ai team',
		role: 'owner',
		created_at: T,
	},
];

export const agents: Agent[] = [
	{
		id: 'agt_planner',
		tenant_id: tenant.id,
		slug: 'planner',
		name: 'Planner',
		description: 'Reviews open tasks and surfaces today’s priorities.',
		created_at: T,
	},
	{
		id: 'agt_scribe',
		tenant_id: tenant.id,
		slug: 'scribe',
		name: 'Scribe',
		description: 'Captures meeting notes and threads them into outcomes.',
		created_at: T,
	},
];

export const channels: AgentChannel[] = [
	{
		id: 'chn_planner_main',
		tenant_id: tenant.id,
		agent_id: 'agt_planner',
		slug: 'main',
		name: 'main',
		is_main: true,
		created_at: T,
	},
	{
		id: 'chn_planner_experiments',
		tenant_id: tenant.id,
		agent_id: 'agt_planner',
		slug: 'experiments',
		name: 'experiments',
		is_main: false,
		created_at: T,
	},
	{
		id: 'chn_scribe_main',
		tenant_id: tenant.id,
		agent_id: 'agt_scribe',
		slug: 'main',
		name: 'main',
		is_main: true,
		created_at: T,
	},
];

export const frames: FrameRecord[] = [
	{
		id: 'frm_p01',
		tenant_id: tenant.id,
		agent_id: 'agt_planner',
		channel_id: 'chn_planner_main',
		agent_slug: 'planner',
		channel_slug: 'main',
		date: DEMO_DATE,
		status: 'promoted',
		current_submission_id: 'sub_p01',
		title: 'Morning planning loop',
		alt_text: 'Planner agent reviewing the day’s open tasks at a kanban board.',
		license_intent: 'cc0',
		media: [{ kind: 'image', status: 'ready' }],
		click_zones: [
			{ label: 'priority pane', x: 0.05, y: 0.1, width: 0.4, height: 0.7 },
			{ label: 'review queue', x: 0.55, y: 0.1, width: 0.4, height: 0.7 },
		],
		created_at: T,
		updated_at: T_LATER,
	},
	{
		id: 'frm_p02',
		tenant_id: tenant.id,
		agent_id: 'agt_planner',
		channel_id: 'chn_planner_main',
		agent_slug: 'planner',
		channel_slug: 'main',
		date: DEMO_DATE,
		status: 'promoted',
		current_submission_id: 'sub_p02',
		title: 'Routing inspection',
		alt_text: 'Workbench routing pane showing tenant resolution for ui.plan.ai.',
		license_intent: 'cc0',
		media: [{ kind: 'image', status: 'ready' }],
		created_at: T,
		updated_at: T_LATER,
	},
	{
		id: 'frm_p03',
		tenant_id: tenant.id,
		agent_id: 'agt_planner',
		channel_id: 'chn_planner_main',
		agent_slug: 'planner',
		channel_slug: 'main',
		date: DEMO_DATE,
		status: 'promotion_eligible',
		current_submission_id: 'sub_p03',
		title: 'Review queue snapshot',
		alt_text: 'Stack of frames awaiting promotion, with status badges per row.',
		license_intent: 'cc0',
		media: [{ kind: 'image', status: 'ready' }],
		created_at: T,
		updated_at: T_LATER,
	},
	{
		id: 'frm_p04',
		tenant_id: tenant.id,
		agent_id: 'agt_planner',
		channel_id: 'chn_planner_experiments',
		agent_slug: 'planner',
		channel_slug: 'experiments',
		date: DEMO_DATE,
		status: 'team_visible',
		current_submission_id: 'sub_p04',
		title: 'Experimental layout',
		alt_text: 'Experimental dense layout — not yet promoted to the main channel.',
		license_intent: 'cc0',
		media: [{ kind: 'image', status: 'ready' }],
		created_at: T,
		updated_at: T_LATER,
	},
	{
		id: 'frm_s01',
		tenant_id: tenant.id,
		agent_id: 'agt_scribe',
		channel_id: 'chn_scribe_main',
		agent_slug: 'scribe',
		channel_slug: 'main',
		date: DEMO_DATE,
		status: 'promoted',
		current_submission_id: 'sub_s01',
		title: 'End-of-day recap',
		alt_text: 'Animated recap of the scribe agent’s day in 30 seconds.',
		license_intent: 'cc0',
		media: [{ kind: 'video', status: 'ready' }],
		created_at: T,
		updated_at: T_LATER,
	},
];

export const submissions: FrameSubmission[] = frames.map((f) => ({
	id: f.current_submission_id,
	tenant_id: f.tenant_id,
	agent_id: f.agent_id,
	channel_id: f.channel_id,
	status:
		f.status === 'team_visible'
			? 'team_visible'
			: f.status === 'promotion_eligible'
				? 'promotion_eligible'
				: 'promoted',
	agent_slug: f.agent_slug,
	channel_slug: f.channel_slug,
	date: f.date,
	created_at: f.created_at,
	updated_at: f.updated_at,
	metadata: {
		schema_version: 'ui.plan.ai/frame-metadata.v1',
		agent: { slug: f.agent_slug },
		channel: { slug: f.channel_slug },
		frame: { title: f.title, alt_text: f.alt_text, date: f.date },
		license: { intent: f.license_intent },
		click_zones: f.click_zones,
	},
	media: f.media,
}));

export const apiKeys: ApiKey[] = [
	{
		id: 'key_01hyx0p9q2h3m4n5v6r7s8t9u0',
		tenant_id: tenant.id,
		agent_id: 'agt_planner',
		prefix: 'pk_test_',
		scopes: ['submit_frames', 'create_media_uploads'],
		created_at: T,
	},
];

export const approvalPolicies: ApprovalPolicy[] = [
	{
		id: 'pol_tenant_default',
		tenant_id: tenant.id,
		scope_type: 'tenant',
		initial_visibility: 'team_visible',
		requires_review: true,
		created_at: T,
		updated_at: T,
	},
];
