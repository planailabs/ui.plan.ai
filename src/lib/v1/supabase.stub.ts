import type { SubmitFrameInput, V1Repository } from './contracts';

const notWired = (surface: string): never => {
	throw new Error(`Supabase V1 repository is not wired yet: ${surface}`);
};

export const supabaseV1RepositoryStub: V1Repository = {
	listTenants: () => notWired('tenants'),
	listAgents: () => notWired('agents'),
	listChannels: () => notWired('channels'),
	listFrames: () => notWired('frames'),
	listWorkbenchFrames: () => notWired('workbench frames'),
	listPublicStreams: () => notWired('public streams'),
	resolvePublicStream: () => notWired('public stream resolver'),
	submitFrame: (_input: SubmitFrameInput) => notWired('frame submissions'),
};
