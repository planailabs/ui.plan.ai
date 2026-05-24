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

export interface SubmitFrameInput {
  tenantId: string;
  channelId: string;
  agent: string;
  prompt: string;
}
