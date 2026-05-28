export const SUBMISSION_STATUSES = [
	'received',
	'waiting_for_upload',
	'media_processing',
	'needs_review',
	'team_visible',
	'promotion_eligible',
	'promoted',
	'rejected',
	'failed',
] as const;

export const FRAME_STATUSES = ['team_visible', 'promotion_eligible', 'promoted', 'rejected'] as const;
export const MEDIA_STATUSES = ['received', 'media_processing', 'ready', 'failed'] as const;
export const LICENSE_INTENTS = ['cc0', 'non_cc0', 'third_party', 'unknown'] as const;

export type SubmissionStatus = (typeof SUBMISSION_STATUSES)[number];
export type FrameStatus = (typeof FRAME_STATUSES)[number];
export type MediaStatus = (typeof MEDIA_STATUSES)[number];
export type LicenseIntent = (typeof LICENSE_INTENTS)[number];

export interface Tenant {
	id: string;
	slug: string;
	name: string;
}

export interface Agent {
	id: string;
	tenantId: string;
	slug: string;
	name: string;
	description: string;
}

export interface Channel {
	id: string;
	tenantId: string;
	agentId: string;
	slug: string;
	name: string;
	isMain: boolean;
	visibility: 'private' | 'public';
}

export interface ClickZone {
	id: string;
	label: string;
	kind?: 'link' | 'button' | 'inspection' | 'navigation' | 'other';
	bounds: {
		x: number;
		y: number;
		width: number;
		height: number;
	};
	target?: string;
}

export interface FrameEvent {
	type: string;
	actor: 'agent' | 'team' | 'system';
	occurredAt: string;
	summary: string;
}

export interface License {
	intent: LicenseIntent;
	attribution?: string;
}

export interface Frame {
	id: string;
	tenantId: string;
	agentId: string;
	channelId: string;
	dateKey: string;
	title: string;
	summary: string;
	altText: string;
	frameStatus?: FrameStatus;
	submissionStatus: SubmissionStatus;
	mediaStatus: MediaStatus;
	variant: 'review' | 'public' | 'thumbnail';
	submittedAt: string;
	license: License;
	decisionNotes: string;
	clickZones: ClickZone[];
	events: FrameEvent[];
}

export interface ResolvedStream {
	tenant: Tenant;
	agent: Agent;
	channel: Channel;
	dateKey: string;
	frames: Frame[];
	path: string;
}

const RESERVED_SLUGS = new Set(['404', 'api', 'assets', 'docs', 'favicon.ico', 'favicon.svg', 'sitemap.xml', 'streams', 'v1-status.json', 'workbench']);

export const tenants: Tenant[] = [
	{
		id: 'tenant_planai',
		slug: 'plan-ai',
		name: 'plan.ai',
	},
];

export const agents: Agent[] = [
	{
		id: 'agent_planner',
		tenantId: 'tenant_planai',
		slug: 'planner',
		name: 'Planner',
		description: 'Turns implementation goals into reviewable interface frames.',
	},
	{
		id: 'agent_atlas',
		tenantId: 'tenant_planai',
		slug: 'atlas',
		name: 'Atlas',
		description: 'Explores navigation, context, and project documentation surfaces.',
	},
];

export const channels: Channel[] = [
	{
		id: 'channel_planner_main',
		tenantId: 'tenant_planai',
		agentId: 'agent_planner',
		slug: 'main',
		name: 'Main',
		isMain: true,
		visibility: 'public',
	},
	{
		id: 'channel_planner_review',
		tenantId: 'tenant_planai',
		agentId: 'agent_planner',
		slug: 'review',
		name: 'Review',
		isMain: false,
		visibility: 'public',
	},
	{
		id: 'channel_atlas_main',
		tenantId: 'tenant_planai',
		agentId: 'agent_atlas',
		slug: 'main',
		name: 'Main',
		isMain: true,
		visibility: 'public',
	},
];

export const frames: Frame[] = [
	{
		id: 'frame_planner_20260522_home',
		tenantId: 'tenant_planai',
		agentId: 'agent_planner',
		channelId: 'channel_planner_main',
		dateKey: '20260522',
		title: 'Setup-aware home shell',
		summary: 'Public landing page with docs, setup, API quickstart, and stream links.',
		altText: 'Dark homepage concept showing a large headline, setup links, and three workflow cards.',
		frameStatus: 'promoted',
		submissionStatus: 'promoted',
		mediaStatus: 'ready',
		variant: 'public',
		submittedAt: '2026-05-22T09:32:00Z',
		license: { intent: 'cc0' },
		decisionNotes: 'Promoted because it gives deployed visitors a useful first stop before backend credentials exist.',
		clickZones: [
			{ id: 'docs', label: 'Docs', kind: 'navigation', bounds: { x: 0.08, y: 0.2, width: 0.22, height: 0.12 }, target: '/docs/start-here/welcome/' },
			{ id: 'setup', label: 'Setup', kind: 'navigation', bounds: { x: 0.34, y: 0.2, width: 0.25, height: 0.12 }, target: '/docs/process/v1-setup/' },
			{ id: 'api', label: 'API', kind: 'navigation', bounds: { x: 0.63, y: 0.2, width: 0.26, height: 0.12 }, target: '/docs/api-reference/' },
		],
		events: [
			{ type: 'frame.submission.created', actor: 'agent', occurredAt: '2026-05-22T09:32:00Z', summary: 'Frame and metadata accepted.' },
			{ type: 'frame.promoted', actor: 'team', occurredAt: '2026-05-22T09:36:00Z', summary: 'Approved for public stream.' },
		],
	},
	{
		id: 'frame_planner_20260522_workbench',
		tenantId: 'tenant_planai',
		agentId: 'agent_planner',
		channelId: 'channel_planner_review',
		dateKey: '20260522',
		title: 'Workbench review queue',
		summary: 'Dense operator view for frame status, media processing, and approval decisions.',
		altText: 'Operations dashboard with review queue, frame detail, event log, and policy cards.',
		frameStatus: 'promoted',
		submissionStatus: 'promoted',
		mediaStatus: 'ready',
		variant: 'public',
		submittedAt: '2026-05-22T09:41:00Z',
		license: { intent: 'cc0' },
		decisionNotes: 'Promoted to document the private workbench shape without exposing live auth behavior.',
		clickZones: [
			{ id: 'queue', label: 'Queue', kind: 'inspection', bounds: { x: 0.06, y: 0.16, width: 0.24, height: 0.58 }, target: '/workbench/' },
			{ id: 'events', label: 'Events', kind: 'inspection', bounds: { x: 0.68, y: 0.18, width: 0.24, height: 0.46 }, target: '/docs/specifications/data-model/' },
		],
		events: [
			{ type: 'frame.media.status_changed', actor: 'system', occurredAt: '2026-05-22T09:43:00Z', summary: 'Public variant ready.' },
			{ type: 'frame.promoted', actor: 'team', occurredAt: '2026-05-22T09:48:00Z', summary: 'Marked promoted.' },
		],
	},
	{
		id: 'frame_atlas_20260522_routes',
		tenantId: 'tenant_planai',
		agentId: 'agent_atlas',
		channelId: 'channel_atlas_main',
		dateKey: '20260522',
		title: 'Route contract map',
		summary: 'Agent/date and agent/channel/date routes resolve through the same data model.',
		altText: 'Route map showing agent slug, main channel, named channel, date key, and public frame filters.',
		frameStatus: 'promoted',
		submissionStatus: 'promoted',
		mediaStatus: 'ready',
		variant: 'public',
		submittedAt: '2026-05-22T09:50:00Z',
		license: { intent: 'cc0' },
		decisionNotes: 'Promoted because it clarifies generic routing before Supabase resolution exists.',
		clickZones: [
			{ id: 'route-docs', label: 'Route docs', kind: 'navigation', bounds: { x: 0.1, y: 0.16, width: 0.36, height: 0.18 }, target: '/docs/specifications/route-contract/' },
			{ id: 'sql-plan', label: 'SQL plan', kind: 'navigation', bounds: { x: 0.54, y: 0.52, width: 0.34, height: 0.18 }, target: '/docs/specifications/supabase-sql/' },
		],
		events: [
			{ type: 'frame.submission.status_changed', actor: 'system', occurredAt: '2026-05-22T09:52:00Z', summary: 'Route metadata matched schema.' },
			{ type: 'frame.promoted', actor: 'team', occurredAt: '2026-05-22T09:55:00Z', summary: 'Promoted to public stream.' },
		],
	},
	{
		id: 'frame_planner_20260522_pending',
		tenantId: 'tenant_planai',
		agentId: 'agent_planner',
		channelId: 'channel_planner_main',
		dateKey: '20260522',
		title: 'API key rotation panel',
		summary: 'Private review item for scoped API-key status and last-used metadata.',
		altText: 'Workbench settings concept showing API key prefixes, scopes, and revoke actions.',
		submissionStatus: 'needs_review',
		mediaStatus: 'ready',
		variant: 'review',
		submittedAt: '2026-05-22T10:04:00Z',
		license: { intent: 'cc0' },
		decisionNotes: 'Held in workbench because copy-once key display needs real auth context.',
		clickZones: [
			{ id: 'api-key-docs', label: 'API key docs', kind: 'navigation', bounds: { x: 0.12, y: 0.18, width: 0.38, height: 0.2 }, target: '/docs/v1-plan/approval-and-api-keys/' },
		],
		events: [
			{ type: 'frame.submission.status_changed', actor: 'system', occurredAt: '2026-05-22T10:05:00Z', summary: 'Waiting for team decision.' },
		],
	},
	{
		id: 'frame_planner_20260522_upload',
		tenantId: 'tenant_planai',
		agentId: 'agent_planner',
		channelId: 'channel_planner_main',
		dateKey: '20260522',
		title: 'Large media upload session',
		summary: 'Workbench-only submission waiting for Cloudflare Stream direct upload completion.',
		altText: 'Upload status panel showing a direct upload session, expiration timer, and media placeholder.',
		submissionStatus: 'waiting_for_upload',
		mediaStatus: 'received',
		variant: 'review',
		submittedAt: '2026-05-22T10:10:00Z',
		license: { intent: 'unknown' },
		decisionNotes: 'No frame gate exists yet; media must arrive before review can begin.',
		clickZones: [
			{ id: 'media-upload-docs', label: 'Media uploads', kind: 'navigation', bounds: { x: 0.16, y: 0.22, width: 0.42, height: 0.18 }, target: '/docs/api-reference/media-uploads/' },
		],
		events: [
			{ type: 'frame.submission.created', actor: 'agent', occurredAt: '2026-05-22T10:10:00Z', summary: 'Direct upload session created.' },
		],
	},
	{
		id: 'frame_atlas_20260522_candidate',
		tenantId: 'tenant_planai',
		agentId: 'agent_atlas',
		channelId: 'channel_atlas_main',
		dateKey: '20260522',
		title: 'Documentation route candidate',
		summary: 'Team-visible candidate that has not yet been promoted to the anonymous stream.',
		altText: 'Review card showing route conventions, sitemap links, and status badges.',
		frameStatus: 'promotion_eligible',
		submissionStatus: 'promotion_eligible',
		mediaStatus: 'ready',
		variant: 'review',
		submittedAt: '2026-05-22T10:14:00Z',
		license: { intent: 'cc0' },
		decisionNotes: 'Eligible for promotion after final copy review.',
		clickZones: [
			{ id: 'route-conventions', label: 'Route conventions', kind: 'navigation', bounds: { x: 0.14, y: 0.2, width: 0.44, height: 0.2 }, target: '/docs/reference/file-and-route-conventions/' },
		],
		events: [
			{ type: 'frame.approval.changed', actor: 'team', occurredAt: '2026-05-22T10:14:00Z', summary: 'Marked promotion eligible.' },
		],
	},
	{
		id: 'frame_atlas_20260522_failed',
		tenantId: 'tenant_planai',
		agentId: 'agent_atlas',
		channelId: 'channel_atlas_main',
		dateKey: '20260522',
		title: 'Failed media derivative',
		summary: 'Failed workbench item used to exercise failed media and pre-gate failure states.',
		altText: 'Error state panel showing a failed derivative job and reviewer rejection.',
		submissionStatus: 'failed',
		mediaStatus: 'failed',
		variant: 'review',
		submittedAt: '2026-05-22T10:18:00Z',
		license: { intent: 'unknown' },
		decisionNotes: 'No frame gate exists because media processing failed before review.',
		clickZones: [
			{ id: 'problem-schema', label: 'Problem schema', kind: 'navigation', bounds: { x: 0.2, y: 0.28, width: 0.36, height: 0.18 }, target: '/docs/specs/schemas/problem.v1.schema.json' },
		],
		events: [
			{ type: 'frame.media.status_changed', actor: 'system', occurredAt: '2026-05-22T10:18:00Z', summary: 'Derivative processing failed before review.' },
		],
	},
	{
		id: 'frame_planner_20260522_rejected',
		tenantId: 'tenant_planai',
		agentId: 'agent_planner',
		channelId: 'channel_planner_review',
		dateKey: '20260522',
		title: 'Rejected interaction pattern',
		summary: 'Reviewed frame rejected after media was ready and the team inspected the interaction pattern.',
		altText: 'Review panel showing a rejected interaction pattern and reviewer notes.',
		frameStatus: 'rejected',
		submissionStatus: 'rejected',
		mediaStatus: 'ready',
		variant: 'review',
		submittedAt: '2026-05-22T10:22:00Z',
		license: { intent: 'cc0' },
		decisionNotes: 'Rejected after review because the proposed interaction duplicated existing navigation.',
		clickZones: [
			{ id: 'approval-policy', label: 'Approval policy', kind: 'navigation', bounds: { x: 0.18, y: 0.18, width: 0.42, height: 0.2 }, target: '/docs/specifications/approval-policy/' },
		],
		events: [
			{ type: 'frame.approval.changed', actor: 'team', occurredAt: '2026-05-22T10:22:00Z', summary: 'Reviewer inspected the ready frame.' },
			{ type: 'frame.rejected', actor: 'team', occurredAt: '2026-05-22T10:24:00Z', summary: 'Reviewer rejected the frame.' },
		],
	},
];

export function formatDateKey(dateKey: string) {
	return `${dateKey.slice(0, 4)}-${dateKey.slice(4, 6)}-${dateKey.slice(6, 8)}`;
}

export function formatEventTime(occurredAt: string) {
	return new Intl.DateTimeFormat('en', {
		hour: '2-digit',
		minute: '2-digit',
		timeZone: 'UTC',
		timeZoneName: 'short',
	}).format(new Date(occurredAt));
}

export function getFrameStatusLabel(frame: Frame) {
	return frame.frameStatus ?? 'pre_gate';
}

export function getLicenseLabel(license: License) {
	const labels: Record<LicenseIntent, string> = {
		cc0: 'CC0 intent',
		non_cc0: 'Non-CC0',
		third_party: 'Third party',
		unknown: 'Unknown',
	};
	return license.attribution ? `${labels[license.intent]} — ${license.attribution}` : labels[license.intent];
}

export function isValidDateKey(dateKey: string) {
	if (!/^\d{8}$/.test(dateKey)) return false;
	const year = Number(dateKey.slice(0, 4));
	const month = Number(dateKey.slice(4, 6));
	const day = Number(dateKey.slice(6, 8));
	const date = new Date(Date.UTC(year, month - 1, day));
	return (
		date.getUTCFullYear() === year &&
		date.getUTCMonth() === month - 1 &&
		date.getUTCDate() === day
	);
}

export function getAgentBySlug(slug: string) {
	if (RESERVED_SLUGS.has(slug)) return undefined;
	return agents.find((agent) => agent.slug === slug);
}

export function getTenant(id: string) {
	return tenants.find((tenant) => tenant.id === id);
}

export function getChannel(agentId: string, channelSlug = 'main') {
	return channels.find((channel) => channel.agentId === agentId && channel.slug === channelSlug);
}

export function resolvePublicStream(agentSlug: string, dateKey: string, channelSlug = 'main'): ResolvedStream | undefined {
	if (!isValidDateKey(dateKey)) return undefined;
	const agent = getAgentBySlug(agentSlug);
	if (!agent) return undefined;
	const tenant = getTenant(agent.tenantId);
	const channel = getChannel(agent.id, channelSlug);
	if (!tenant || !channel || channel.visibility !== 'public') return undefined;
	const streamFrames = frames.filter(
		(frame) =>
			frame.agentId === agent.id &&
			frame.channelId === channel.id &&
			frame.dateKey === dateKey &&
			frame.frameStatus === 'promoted',
	);
	if (streamFrames.length === 0) return undefined;
	const path = channel.isMain ? `/${agent.slug}/${dateKey}/` : `/${agent.slug}/${channel.slug}/${dateKey}/`;
	return { tenant, agent, channel, dateKey, frames: streamFrames, path };
}

export function getPublicMainStreams() {
	return agents.flatMap((agent) => {
		const mainChannel = getChannel(agent.id, 'main');
		if (!mainChannel) return [];
		const dateKeys = [...new Set(frames.filter((frame) => frame.agentId === agent.id && frame.channelId === mainChannel.id).map((frame) => frame.dateKey))];
		return dateKeys
			.map((dateKey) => resolvePublicStream(agent.slug, dateKey))
			.filter((stream): stream is ResolvedStream => Boolean(stream));
	});
}

export function getPublicChannelStreams() {
	return channels
		.filter((channel) => !channel.isMain)
		.flatMap((channel) => {
			const agent = agents.find((candidate) => candidate.id === channel.agentId);
			if (!agent) return [];
			const dateKeys = [...new Set(frames.filter((frame) => frame.channelId === channel.id).map((frame) => frame.dateKey))];
			return dateKeys
				.map((dateKey) => resolvePublicStream(agent.slug, dateKey, channel.slug))
				.filter((stream): stream is ResolvedStream => Boolean(stream));
		});
}

export function getAllPublicStreams() {
	return [...getPublicMainStreams(), ...getPublicChannelStreams()].sort((a, b) => b.dateKey.localeCompare(a.dateKey));
}

export function getWorkbenchFrames() {
	return frames.slice().sort((a, b) => b.submittedAt.localeCompare(a.submittedAt));
}

export function getFrameContext(frame: Frame) {
	const agent = agents.find((candidate) => candidate.id === frame.agentId);
	const channel = channels.find((candidate) => candidate.id === frame.channelId);
	const tenant = tenants.find((candidate) => candidate.id === frame.tenantId);
	if (!agent || !channel || !tenant) {
		throw new Error(`Incomplete fixture context for ${frame.id}`);
	}
	return { agent, channel, tenant };
}
