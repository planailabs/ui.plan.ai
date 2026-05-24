# V1 Integration Handoff (Supabase + Cloudflare)

This repo currently runs in **local provider mode** with stable V1 contracts.

## Current contract entrypoints

- `src/lib/v1.contracts.ts` — repository interface (`V1Repository`)
- `src/lib/v1.local.ts` — local/in-memory implementation
- `src/lib/v1.supabase.stub.ts` — required Supabase adapter TODO map
- `src/pages/api/v1/frames.ts` — external API envelope and validation behavior

## Provider swap checklist

1. Keep `V1Repository` signatures unchanged.
2. Replace `v1Repository` binding in `src/lib/v1.ts` to a runtime-selected provider.
3. Implement Supabase tables/queries for:
   - tenants
   - channels
   - frames
   - api keys
4. Preserve API envelope shape:
   - success: `{ data: ... }`
   - failure: `{ error: { code, message } }`
5. Keep default tenant/channel fallback only in local/dev mode.
6. Move key prefix handling to hashed secrets at rest.

## Environment setup

Copy `.env.example` to `.env` and fill in credentials once providers switch from local mode.

## Cloudflare integration plan

- Media upload and signed delivery should sit behind a media service adapter.
- Keep frame records provider-agnostic by storing media IDs + signed URL metadata.
- Avoid embedding Cloudflare-specific payload shapes in route handlers.
