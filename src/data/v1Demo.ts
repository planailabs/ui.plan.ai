export type SubmissionStatus =
	| 'received'
	| 'validated'
	| 'media_processing'
	| 'needs_review'
	| 'changes_requested'
	| 'team_visible'
	| 'promotion_eligible'
	| 'promoted'
	| 'rejected';

export type FrameStatus = 'draft' | 'team_visible' | 'promotion_eligible' | 'promoted';
export type MediaStatus = 'uploaded' | 'processing' | 'delivery_ready';

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
	label: string;
	x: number;
	y: number;
	width: number;
	height: number;
	target: string;
}

export interface FrameEvent {
	type: string;
	actor: 'agent' | 'team' | 'system';
	at: string;
	summary: string;
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
	frameStatus: FrameStatus;
	submissionStatus: SubmissionStatus;
	mediaStatus: MediaStatus;
	variant: 'review' | 'public' | 'thumbnail';
	submittedAt: string;
	license: string;
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

const RESERVED_SLUGS = new Set(['404', 'docs', 'streams', 'workbench']);

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
		mediaStatus: 'delivery_ready',
		variant: 'public',
		submittedAt: '2026-05-22T09:32:00Z',
		license: 'CC0 intent',
		decisionNotes: 'Promoted because it gives deployed visitors a useful first stop before backend credentials exist.',
		clickZones: [
			{ label: 'Docs', x: 8, y: 20, width: 22, height: 12, target: '/docs/start-here/welcome/' },
			{ label: 'Setup', x: 34, y: 20, width: 25, height: 12, target: '/docs/process/v1-setup/' },
			{ label: 'API', x: 63, y: 20, width: 26, height: 12, target: '/docs/api-reference/' },
		],
		events: [
			{ type: 'submission.received', actor: 'agent', at: '09:32', summary: 'Frame and metadata accepted.' },
			{ type: 'review.promoted', actor: 'team', at: '09:36', summary: 'Approved for public stream.' },
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
		mediaStatus: 'delivery_ready',
		variant: 'public',
		submittedAt: '2026-05-22T09:41:00Z',
		license: 'CC0 intent',
		decisionNotes: 'Promoted to document the private workbench shape without exposing live auth behavior.',
		clickZones: [
			{ label: 'Queue', x: 6, y: 16, width: 24, height: 58, target: '/workbench/' },
			{ label: 'Events', x: 68, y: 18, width: 24, height: 46, target: '/docs/specifications/data-model/' },
		],
		events: [
			{ type: 'media.delivery_ready', actor: 'system', at: '09:43', summary: 'Public variant ready.' },
			{ type: 'review.promoted', actor: 'team', at: '09:48', summary: 'Marked promoted.' },
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
		mediaStatus: 'delivery_ready',
		variant: 'public',
		submittedAt: '2026-05-22T09:50:00Z',
		license: 'CC0 intent',
		decisionNotes: 'Promoted because it clarifies generic routing before Supabase resolution exists.',
		clickZones: [
			{ label: 'Route docs', x: 10, y: 16, width: 36, height: 18, target: '/docs/specifications/route-contract/' },
			{ label: 'SQL plan', x: 54, y: 52, width: 34, height: 18, target: '/docs/specifications/supabase-sql/' },
		],
		events: [
			{ type: 'submission.validated', actor: 'system', at: '09:52', summary: 'Route metadata matched schema.' },
			{ type: 'review.promoted', actor: 'team', at: '09:55', summary: 'Promoted to public stream.' },
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
		frameStatus: 'team_visible',
		submissionStatus: 'needs_review',
		mediaStatus: 'delivery_ready',
		variant: 'review',
		submittedAt: '2026-05-22T10:04:00Z',
		license: 'CC0 intent',
		decisionNotes: 'Held in workbench because copy-once key display needs real auth context.',
		clickZones: [
			{ label: 'API key docs', x: 12, y: 18, width: 38, height: 20, target: '/docs/v1-plan/approval-and-api-keys/' },
		],
		events: [
			{ type: 'submission.needs_review', actor: 'system', at: '10:05', summary: 'Waiting for team decision.' },
		],
	},
];

export function formatDateKey(dateKey: string) {
	return `${dateKey.slice(0, 4)}-${dateKey.slice(4, 6)}-${dateKey.slice(6, 8)}`;
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
