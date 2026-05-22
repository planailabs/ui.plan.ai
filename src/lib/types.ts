// Types mirroring the V1 Agent API + Supabase data model.
// Field casing matches the API surface (snake_case) so payloads round-trip
// without a translation layer. Sources of truth:
//   - starlight/public/specs/v1-agent-api.openapi.yaml
//   - starlight/src/content/docs/specifications/data-model.md
//   - starlight/src/content/docs/specifications/supabase-sql.md

export type SubmissionStatus =
	| 'received'
	| 'waiting_for_upload'
	| 'media_processing'
	| 'needs_review'
	| 'team_visible'
	| 'promotion_eligible'
	| 'promoted'
	| 'rejected'
	| 'failed';

export type FrameStatus =
	| 'team_visible'
	| 'promotion_eligible'
	| 'promoted'
	| 'rejected';

export type MediaKind = 'image' | 'video';

export type MediaUploadStatus =
	| 'waiting_for_upload'
	| 'media_processing'
	| 'ready'
	| 'failed';

export type FrameMediaStatus =
	| 'received'
	| 'media_processing'
	| 'ready'
	| 'failed';

export type LicenseIntent = 'cc0' | 'non_cc0' | 'third_party' | 'unknown';

export type TenantRole = 'owner' | 'admin' | 'member' | 'viewer';

export type ApprovalScope = 'tenant' | 'agent' | 'channel' | 'api_key';

export type ErrorCode =
	| 'authentication_required'
	| 'invalid_api_key'
	| 'permission_denied'
	| 'not_found'
	| 'idempotency_conflict'
	| 'media_too_large'
	| 'unsupported_media_type'
	| 'validation_failed'
	| 'rate_limited'
	| 'internal_error';

export interface Tenant {
	id: string;
	slug: string;
	name: string;
	created_at: string;
}

export interface TenantMember {
	tenant_id: string;
	user_id: string;
	display_name: string;
	role: TenantRole;
	created_at: string;
}

export interface Agent {
	id: string;
	tenant_id: string;
	slug: string;
	name: string;
	description?: string;
	created_at: string;
}

export interface AgentChannel {
	id: string;
	tenant_id: string;
	agent_id: string;
	slug: string;
	name: string;
	is_main: boolean;
	created_at: string;
}

export interface ClickZone {
	label: string;
	x: number;
	y: number;
	width: number;
	height: number;
}

export interface FrameSubmissionMetadata {
	schema_version: 'ui.plan.ai/frame-metadata.v1';
	agent: { slug: string; run_id?: string; model?: string };
	channel: { slug: string };
	frame: {
		title: string;
		alt_text: string;
		date: string;
		sequence_key?: string;
	};
	license?: { intent: LicenseIntent; attribution?: string };
	click_zones?: ClickZone[];
	media_upload_id?: string;
	metadata?: Record<string, unknown>;
}

export interface FrameMedia {
	kind: MediaKind;
	status: FrameMediaStatus;
	delivery_url?: string;
}

export interface FrameSubmission {
	id: string;
	tenant_id: string;
	agent_id: string;
	channel_id: string;
	status: SubmissionStatus;
	agent_slug: string;
	channel_slug: string;
	date: string;
	created_at: string;
	updated_at?: string;
	metadata: FrameSubmissionMetadata;
	media?: FrameMedia[];
}

// Promoted/team-visible record exposed on public + workbench timelines.
export interface FrameRecord {
	id: string;
	tenant_id: string;
	agent_id: string;
	channel_id: string;
	agent_slug: string;
	channel_slug: string;
	date: string;
	status: FrameStatus;
	current_submission_id: string;
	title: string;
	alt_text: string;
	license_intent: LicenseIntent;
	media: FrameMedia[];
	click_zones?: ClickZone[];
	created_at: string;
	updated_at: string;
}

export interface MediaUpload {
	id: string;
	status: MediaUploadStatus;
	provider: 'cloudflare_stream';
	upload_url?: string;
	expires_at?: string;
	created_at: string;
	error?: string;
}

export interface ApiKey {
	id: string;
	tenant_id: string;
	agent_id?: string;
	channel_id?: string;
	prefix: string;
	scopes: string[];
	created_at: string;
	last_used_at?: string;
	revoked_at?: string;
}

export interface ApprovalPolicy {
	id: string;
	tenant_id: string;
	scope_type: ApprovalScope;
	scope_id?: string;
	initial_visibility: 'team_visible' | 'promotion_eligible';
	requires_review: boolean;
	created_at: string;
	updated_at: string;
}

export interface Problem {
	type: string;
	title: string;
	status: number;
	code: ErrorCode;
	detail?: string;
	request_id: string;
	errors?: { pointer?: string; detail: string }[];
}
