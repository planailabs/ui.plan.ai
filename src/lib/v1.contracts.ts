import type { ApiKey, Channel, Frame, SubmitFrameInput, Tenant } from './v1.types';

export interface V1Repository {
  listTenants(): Tenant[];
  listChannels(tenantId: string): Channel[];
  listFrames(tenantId: string): Frame[];
  listPublicFrames(): Frame[];
  submitFrame(input: SubmitFrameInput): Frame;
  listApiKeys(tenantId: string): ApiKey[];
}
