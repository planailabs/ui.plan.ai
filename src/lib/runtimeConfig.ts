export interface RuntimeConfig {
	agentApiBaseUrl: string;
	supabase: {
		url?: string;
		anonKey?: string;
		configured: boolean;
	};
}

import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from './env';

export const runtimeConfig: RuntimeConfig = {
	agentApiBaseUrl: import.meta.env.PUBLIC_AGENT_API_BASE_URL ?? 'https://api.ui.plan.ai/v1',
	supabase: {
		url: PUBLIC_SUPABASE_URL,
		anonKey: PUBLIC_SUPABASE_ANON_KEY,
		configured: Boolean(PUBLIC_SUPABASE_URL && PUBLIC_SUPABASE_ANON_KEY),
	},
};
