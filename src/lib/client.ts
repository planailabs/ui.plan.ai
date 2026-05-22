// Pluggable backend client. v1 ships the mock implementation; a Supabase /
// Cloudflare-backed version will land alongside the real backend wiring.
// Route + component code should ONLY import from here, never the mock
// implementation directly — that keeps the swap surface single-file.

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
import { USE_MOCK_BACKEND } from './env';
import { createMockClient } from './mock-client';

export interface PlanAiClient {
	readonly mode: 'mock' | 'live';

	// Tenant + members (workbench shell)
	getTenant(slug: string): Promise<Tenant | null>;
	listMembers(tenantId: string): Promise<TenantMember[]>;

	// Agents + channels (public stream resolution, workbench listings)
	listAgents(): Promise<Agent[]>;
	getAgent(slug: string): Promise<Agent | null>;
	listChannels(agentId: string): Promise<AgentChannel[]>;
	getChannel(agentId: string, slug: string): Promise<AgentChannel | null>;

	// Frame timeline (public stream pages)
	listFrames(
		agentSlug: string,
		date: string,
		channelSlug?: string,
	): Promise<FrameRecord[]>;
	getFrame(frameId: string): Promise<FrameRecord | null>;

	// Submission queue (workbench review screens)
	listSubmissionsByStatus(status: SubmissionStatus): Promise<FrameSubmission[]>;

	// API keys + approval (workbench settings)
	listApiKeys(tenantId: string): Promise<ApiKey[]>;
	getTenantApprovalPolicy(tenantId: string): Promise<ApprovalPolicy | null>;
}

let cached: PlanAiClient | null = null;

export function getClient(): PlanAiClient {
	if (cached) return cached;
	if (USE_MOCK_BACKEND) {
		cached = createMockClient();
		return cached;
	}
	// Real client lands here once Supabase + Cloudflare are wired. See SETUP.md.
	throw new Error(
		'Live backend not yet implemented. Set PUBLIC_USE_MOCK_BACKEND=true or wire src/lib/client.ts to a Supabase-backed implementation. See SETUP.md.',
	);
}
