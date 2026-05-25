# V1 Integration Handoff (Supabase + Cloudflare)

This branch currently runs in **static fixture provider mode** with stable V1 contracts and backend source artifacts staged for the next wiring pass.

## Current contract entrypoints

- `src/lib/v1/contracts.ts` - repository interface (`V1Repository`)
- `src/lib/v1/local.ts` - static fixture implementation and stream resolver
- `src/lib/v1/supabase.stub.ts` - required Supabase adapter TODO map
- `src/pages/v1-status.json.ts` - static machine-readable integration status
- `starlight/public/specs/v1-agent-api.openapi.yaml` - Agent API contract
- `supabase/migrations/` - Postgres schema candidate and API-key view
- `supabase/functions/` - Deno Edge Function source for Agent API ingress, media uploads, Stream webhook, status polling, and team invitations

## Provider swap checklist

1. Keep `V1Repository` signatures unchanged.
2. Replace static imports from `localV1Repository` with a runtime-selected provider only after credentials and Supabase client wiring exist.
3. Implement Supabase tables/queries for:
   - tenants
   - agents
   - channels
   - frames
   - frame submissions
   - frame media
   - api keys
4. Preserve Agent API envelope shape:
   - success: `{ data: ... }`
   - failure: `{ error: { code, message } }`
5. Keep fixture data and default tenant/channel fallback only in local/static mode.
6. Move key prefix handling to hashed secrets at rest before enabling live submissions.
7. Verify `supabase/functions/` with the Supabase/Deno toolchain; root `astro check` intentionally excludes those Deno files.
8. Keep request IDs end-to-end: response header, structured logs, and `frame_events.payload.request_id`.
9. Keep team membership owner-only until the database policies and workbench UI are intentionally widened.

## Environment setup

Use `.env.example` as the local shape. `PUBLIC_*` values are safe for Astro/browser reads; service-role, pepper, and Cloudflare signing secrets belong only in Supabase Edge Function secrets.

## Cloudflare integration plan

- Media upload and signed delivery should sit behind a media service adapter.
- Keep frame records provider-agnostic by storing media IDs + signed URL metadata.
- Avoid embedding Cloudflare-specific payload shapes in route handlers.

## Operational docs now included

- `/docs/v1-plan/observability/` - request IDs, structured logs, and append-only events.
- `/docs/v1-plan/team-members/` - owner-only invitations, MFA gates, role changes, and removal behavior.
- `/docs/v1-plan/wiring-supabase-cloudflare/` - ordered wiring checklist.
- `/docs/reference/secrets-and-environments/` - public/browser values versus server-only secrets.
