export interface RuntimeConfig {
	agentApiBaseUrl: string;
	supabase: {
		url?: string;
		anonKey?: string;
		configured: boolean;
	};
}

const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.PUBLIC_SUPABASE_ANON_KEY;

export const runtimeConfig: RuntimeConfig = {
	agentApiBaseUrl: import.meta.env.PUBLIC_AGENT_API_BASE_URL ?? 'https://api.ui.plan.ai/v1',
	supabase: {
		url: supabaseUrl,
		anonKey: supabaseAnonKey,
		configured: Boolean(supabaseUrl && supabaseAnonKey),
	},
};
