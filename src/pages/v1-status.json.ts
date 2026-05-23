import {
	FRAME_STATUSES,
	LICENSE_INTENTS,
	MEDIA_STATUSES,
	SUBMISSION_STATUSES,
	agents,
	channels,
	frames,
	getAllPublicStreams,
	resolverMode,
	tenants,
} from '../lib/streamResolver';
import { runtimeConfig } from '../lib/runtimeConfig';

export const prerender = true;

export function GET() {
	const publicStreams = getAllPublicStreams();
	const body = {
		name: 'ui.plan.ai v1 static shell',
		mode: resolverMode,
		status: 'ready-for-backend-wiring',
		self: '/v1-status.json',
		docs: '/docs/start-here/welcome/',
		setup: '/docs/process/v1-setup/',
		app_routes: {
			home: '/',
			streams_index: '/streams/',
			workbench_preview: {
				path: '/workbench/',
				mode: 'layout-preview',
				auth: 'none in static shell; Supabase Auth + RLS required for real V1 workbench',
				robots: 'noindex and disallowed in robots.txt',
			},
			sitemap: '/sitemap.xml',
		},
		sitemaps: ['/sitemap.xml', '/docs/sitemap-index.xml'],
		contracts: {
			route_contract: '/docs/specifications/route-contract/',
			state_axes: '/docs/specifications/data-model/',
			frame_submission: '/docs/specifications/frame-submission/',
			openapi: '/docs/specs/v1-agent-api.openapi.yaml',
			project_config_schema: '/docs/specs/schemas/project-config.v1.schema.json',
			approval_policy_schema: '/docs/specs/schemas/approval-policy.v1.schema.json',
			frame_submission_metadata_schema: '/docs/specs/schemas/frame-submission-metadata.v1.schema.json',
			click_zone_schema: '/docs/specs/schemas/click-zone.v1.schema.json',
			problem_schema: '/docs/specs/schemas/problem.v1.schema.json',
		},
		canonical_enums: {
			submission_status: SUBMISSION_STATUSES,
			frame_status: FRAME_STATUSES,
			frame_media_status: MEDIA_STATUSES,
			license_intent: LICENSE_INTENTS,
		},
		counts: {
			tenants: tenants.length,
			agents: agents.length,
			channels: channels.length,
			frames: frames.length,
			public_streams: publicStreams.length,
			promoted_frames: frames.filter((frame) => frame.frameStatus === 'promoted').length,
			non_promoted_fixture_items: frames.filter((frame) => frame.frameStatus !== 'promoted').length,
			pre_gate_submissions: frames.filter((frame) => !frame.frameStatus).length,
		},
		public_routes: publicStreams.map((stream) => stream.path),
		visibility_model: {
			static_shell: 'anonymous public resolution only; public streams include promoted frames.',
			future_authenticated_members: 'Supabase-backed resolution may include team_visible and promotion_eligible frames for authorized team members.',
		},
		backend_boundary: {
			product_data: 'Supabase Auth, Postgres, Storage, Realtime, and Edge Functions',
			media_delivery: 'Cloudflare Images and Cloudflare Stream',
			current_secret_policy: 'No production secrets are committed in this static shell.',
		},
		runtime_config: {
			agent_api_base_url: runtimeConfig.agentApiBaseUrl,
			supabase_public_env_configured: runtimeConfig.supabase.configured,
		},
	};

	return new Response(JSON.stringify(body, null, 2) + '\n', {
		headers: {
			'Content-Type': 'application/json; charset=utf-8',
		},
	});
}
