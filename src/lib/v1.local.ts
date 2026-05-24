import type { ApiKey, Channel, Frame, SubmitFrameInput, Tenant } from './v1.types';
import type { V1Repository } from './v1.contracts';

const now = () => new Date().toISOString();

const tenants: Tenant[] = [{ id: 't1', slug: 'planai', name: 'plan.ai' }];
const channels: Channel[] = [
  { id: 'c1', tenantId: 't1', slug: 'assistant-ui', name: 'Assistant UI', visibility: 'public' },
  { id: 'c2', tenantId: 't1', slug: 'ops-console', name: 'Ops Console', visibility: 'private' },
];
const frames: Frame[] = [
  { id: 'f1', tenantId: 't1', channelId: 'c1', agent: 'claude', prompt: 'Landing hero variation', status: 'team_visible', createdAt: now() },
  { id: 'f2', tenantId: 't1', channelId: 'c1', agent: 'codex', prompt: 'Card grid with click zones', status: 'promoted', createdAt: now() },
];
const apiKeys: ApiKey[] = [{ id: 'k1', tenantId: 't1', label: 'local-dev', prefix: 'pk_live_local', createdAt: now() }];

export const localV1Repository: V1Repository = {
  listTenants: () => tenants,
  listChannels: (tenantId) => channels.filter((c) => c.tenantId === tenantId),
  listFrames: (tenantId) => frames.filter((f) => f.tenantId === tenantId),
  listPublicFrames: () => frames.filter((f) => f.status === 'promoted' || f.status === 'team_visible'),
  submitFrame: (input: SubmitFrameInput) => {
    const frame: Frame = { id: `f${frames.length + 1}`, ...input, status: 'draft', createdAt: now() };
    frames.unshift(frame);
    return frame;
  },
  listApiKeys: (tenantId) => apiKeys.filter((k) => k.tenantId === tenantId),
};
