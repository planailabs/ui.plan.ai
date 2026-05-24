export type Role = 'owner' | 'editor' | 'viewer';
export type FrameStatus = 'draft' | 'needs_review' | 'team_visible' | 'promoted';

export interface Tenant {
  id: string;
  slug: string;
  name: string;
}

export interface Channel {
  id: string;
  tenantId: string;
  slug: string;
  name: string;
  visibility: 'private' | 'public';
}

export interface Frame {
  id: string;
  tenantId: string;
  channelId: string;
  agent: string;
  prompt: string;
  status: FrameStatus;
  createdAt: string;
}

export interface ApiKey {
  id: string;
  tenantId: string;
  label: string;
  prefix: string;
  createdAt: string;
  revokedAt?: string;
}

const now = () => new Date().toISOString();

export const seed = {
  tenants: [{ id: 't1', slug: 'planai', name: 'plan.ai' }] as Tenant[],
  channels: [
    { id: 'c1', tenantId: 't1', slug: 'assistant-ui', name: 'Assistant UI', visibility: 'public' },
    { id: 'c2', tenantId: 't1', slug: 'ops-console', name: 'Ops Console', visibility: 'private' },
  ] as Channel[],
  frames: [
    { id: 'f1', tenantId: 't1', channelId: 'c1', agent: 'claude', prompt: 'Landing hero variation', status: 'team_visible', createdAt: now() },
    { id: 'f2', tenantId: 't1', channelId: 'c1', agent: 'codex', prompt: 'Card grid with click zones', status: 'promoted', createdAt: now() },
  ] as Frame[],
  apiKeys: [{ id: 'k1', tenantId: 't1', label: 'local-dev', prefix: 'pk_live_local', createdAt: now() }] as ApiKey[],
};

export function listPublicFrames() {
  return seed.frames.filter((f) => f.status === 'promoted' || f.status === 'team_visible');
}

export function submitFrame(input: Pick<Frame, 'tenantId'|'channelId'|'agent'|'prompt'>): Frame {
  const frame: Frame = {
    id: `f${seed.frames.length + 1}`,
    ...input,
    status: 'draft',
    createdAt: now(),
  };
  seed.frames.unshift(frame);
  return frame;
}
