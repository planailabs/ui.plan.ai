// Centralized env reads. Astro's import.meta.env is statically replaced at
// build time, so values are inlined into the bundle. `PUBLIC_` vars are
// exposed to the browser; everything else is server-only.

const TRUTHY = new Set(['true', '1', 'yes', 'on']);

function readBool(raw: unknown, fallback: boolean): boolean {
	if (typeof raw !== 'string') return fallback;
	return TRUTHY.has(raw.toLowerCase());
}

// Default: mock backend ON. Production deploys must explicitly set
// PUBLIC_USE_MOCK_BACKEND=false in the Cloudflare Pages env to enable the
// real Supabase + Cloudflare path.
export const USE_MOCK_BACKEND: boolean = readBool(
	import.meta.env.PUBLIC_USE_MOCK_BACKEND,
	true,
);

export const SITE_URL: string = import.meta.env.SITE ?? 'https://ui.plan.ai';
