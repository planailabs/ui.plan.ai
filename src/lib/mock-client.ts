// In-memory PlanAiClient backed by static fixtures. No network calls,
// safe to run at build time. Mirrors the eventual Supabase-backed client
// so swapping is a one-file change.

import type { PlanAiClient } from './client';
import type {
	Agent,
	AgentChannel,
	ApiKey,
	ApprovalPolicy,
	FrameRecord,
	FrameSubmission,
	SubmissionStatus,
	Tenant,
	TenantMember,
} from './types';
import {
	agents,
	apiKeys,
	approvalPolicies,
	channels,
	frames,
	members,
	submissions,
	tenant,
} from './fixtures';

export function createMockClient(): PlanAiClient {
	return {
		mode: 'mock',

		async getTenant(slug: string): Promise<Tenant | null> {
			return tenant.slug === slug ? tenant : null;
		},

		async listMembers(tenantId: string): Promise<TenantMember[]> {
			return members.filter((m) => m.tenant_id === tenantId);
		},

		async listAgents(): Promise<Agent[]> {
			return agents;
		},

		async getAgent(slug: string): Promise<Agent | null> {
			return agents.find((a) => a.slug === slug) ?? null;
		},

		async listChannels(agentId: string): Promise<AgentChannel[]> {
			return channels.filter((c) => c.agent_id === agentId);
		},

		async getChannel(
			agentId: string,
			slug: string,
		): Promise<AgentChannel | null> {
			return (
				channels.find((c) => c.agent_id === agentId && c.slug === slug) ?? null
			);
		},

		async listFrames(
			agentSlug: string,
			date: string,
			channelSlug?: string,
		): Promise<FrameRecord[]> {
			return frames.filter(
				(f) =>
					f.agent_slug === agentSlug &&
					f.date === date &&
					(channelSlug ? f.channel_slug === channelSlug : f.channel_slug === 'main'),
			);
		},

		async getFrame(frameId: string): Promise<FrameRecord | null> {
			return frames.find((f) => f.id === frameId) ?? null;
		},

		async listSubmissionsByStatus(
			status: SubmissionStatus,
		): Promise<FrameSubmission[]> {
			return submissions.filter((s) => s.status === status);
		},

		async listApiKeys(tenantId: string): Promise<ApiKey[]> {
			return apiKeys.filter((k) => k.tenant_id === tenantId);
		},

		async getTenantApprovalPolicy(
			tenantId: string,
		): Promise<ApprovalPolicy | null> {
			return (
				approvalPolicies.find(
					(p) => p.tenant_id === tenantId && p.scope_type === 'tenant',
				) ?? null
			);
		},
	};
}
