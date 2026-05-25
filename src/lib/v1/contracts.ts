import type { Agent, Channel, Frame, ResolvedStream, Tenant } from './types';

export interface SubmitFrameInput {
	tenantId: string;
	agentId: string;
	channelId: string;
	title: string;
	summary: string;
	dateKey: string;
}

export interface V1Repository {
	listTenants(): Tenant[];
	listAgents(): Agent[];
	listChannels(agentId?: string): Channel[];
	listFrames(): Frame[];
	listWorkbenchFrames(): Frame[];
	listPublicStreams(): ResolvedStream[];
	resolvePublicStream(agentSlug: string, dateKey: string, channelSlug?: string): ResolvedStream | undefined;
	submitFrame?(input: SubmitFrameInput): Frame;
}
