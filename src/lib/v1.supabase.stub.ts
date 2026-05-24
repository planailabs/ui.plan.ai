import type { V1Repository } from './v1.contracts';

export const supabaseV1RepositoryStub: V1Repository = {
  listTenants: () => { throw new Error('TODO: wire Supabase tenants table adapter'); },
  listChannels: () => { throw new Error('TODO: wire Supabase channels table adapter'); },
  listFrames: () => { throw new Error('TODO: wire Supabase frames table adapter'); },
  listPublicFrames: () => { throw new Error('TODO: wire Supabase publish visibility query'); },
  submitFrame: () => { throw new Error('TODO: wire Supabase frame insert + audit event'); },
  listApiKeys: () => { throw new Error('TODO: wire Supabase API key table adapter'); },
};
