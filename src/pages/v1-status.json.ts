import { agents, channels, frames, getAllPublicStreams, tenants } from '../data/v1Demo';

export const prerender = true;

export function GET() {
	const publicStreams = getAllPublicStreams();
	const body = {
		name: 'ui.plan.ai v1 static shell',
		mode: 'static-fixture',
		status: 'ready-for-backend-wiring',
		docs: '/docs/start-here/welcome/',
		setup: '/docs/process/v1-setup/',
		contracts: {
			route_contract: '/docs/specifications/route-contract/',
			frame_submission: '/docs/specifications/frame-submission/',
			openapi: '/docs/specs/v1-agent-api.openapi.yaml',
			project_config_schema: '/docs/specs/schemas/project-config.v1.schema.json',
		},
		counts: {
			tenants: tenants.length,
			agents: agents.length,
			channels: channels.length,
			frames: frames.length,
			public_streams: publicStreams.length,
			promoted_frames: frames.filter((frame) => frame.frameStatus === 'promoted').length,
			workbench_only_frames: frames.filter((frame) => frame.frameStatus !== 'promoted').length,
		},
		public_routes: publicStreams.map((stream) => stream.path),
		backend_boundary: {
			product_data: 'Supabase Auth, Postgres, Storage, Realtime, and Edge Functions',
			media_delivery: 'Cloudflare Images and Cloudflare Stream',
			current_secret_policy: 'No production secrets are committed in this static shell.',
		},
	};

	return new Response(JSON.stringify(body, null, 2) + '\n', {
		headers: {
			'Content-Type': 'application/json; charset=utf-8',
		},
	});
}
