# Final Branch Deep Audit

Audited on 2026-05-24 after the first diff audit and improvement pass.

## Scope

Branches reviewed again:

- `claude`
- `codex`
- `u6f3g0-codex/locate-branches-and-their-code`
- `cursor`
- `perplexity`
- `replit`

The second pass checked each branch by subsystem, not only by changed-file list.

## Subsystem Findings

### Public App Shell

Best source remains Cursor for the app shell and Perplexity for public-facing narrative. The final branch keeps Cursor's shared `BaseLayout`, `AppNav`, stream routes, workbench preview, and `v1-status.json`, with final styling corrections for smaller radii, no root sitemap, and no decorative radial background policy changes. Perplexity's homepage/404 ideas remain adapted into the final home and recovery pages.

No further app shell code from Claude, Codex, or Replit should be copied directly. Claude's app components are coherent but less complete than Cursor's static shell. Replit's live browser Supabase pages are valuable, but they introduce dependencies and live-auth behavior beyond the static-first branch.

### Provider Boundary

Best source remains Codex hardening, adapted into `src/lib/v1/`. The final branch uses a directory split (`contracts.ts`, `local.ts`, `types.ts`, `supabase.stub.ts`, `index.ts`) instead of flat `src/lib/v1.*` files. Cursor fixture data remains the best static data model and now sits behind that provider boundary.

No root API route was added. The Agent API implementation boundary is represented by OpenAPI plus Supabase Edge Function source, which matches the static-first plan better than Codex's simple `/api/v1/frames` route.

### API Contract

Best source remains Claude for OpenAPI and errors, plus Perplexity for submission-status clarity. Final keeps Claude's OpenAPI and errors exactly, Perplexity's submission status exactly, and Cursor's realtime event docs exactly. Replit's endpoint implementation ideas are represented in Edge Function source and operational docs.

The current `frame-submissions.md` still aligns with Claude OpenAPI's large-media flow. Replit's alternate wording says the media-upload endpoint creates/finalizes the submission itself; that is useful implementation thinking but would conflict with the selected OpenAPI contract, so it was not copied.

### Deployment Policy

Best final state is the current repo policy, not Cursor/Perplexity/Replit deployment additions. `public/_headers` and root sitemap remain intentionally omitted. Cursor's root sitemap and Perplexity/Replit `_headers` are good future hardening candidates, but adding them would require an explicit deployment-policy decision and matching agent-doc updates.

### Supabase Backend

Best source remains Replit. Final includes Replit migrations, seed, Supabase config, and Edge Function source exactly. The deep pass added the Replit `supabase-setup` skill, adapted to the current repo paths and hard rule that infrastructure-mutating Supabase commands require an explicit user ask.

Root Astro typechecking still excludes `supabase/functions` because those are Deno files. Separate Supabase/Deno verification remains required before live deployment.

### Operational Docs

Best source remains Replit. The deep pass promoted additional Replit docs from follow-up to included:

- `v1-plan/auth-and-sessions.md`
- `v1-plan/approval-and-api-keys.md`
- `v1-plan/media-and-delivery.md`
- `v1-plan/realtime-operations.md`
- `api-reference/limits.md`
- `v1-plan/observability.md`
- `v1-plan/team-members.md`

`foundations/platform-architecture.md` was also improved with Replit's host/runtime detail, but adapted so it no longer implies the current static fixture shell is already the live Supabase runtime.

### Live Workbench

Best source is Replit, but it remains deferred. Directly copying the live workbench pages would require `@supabase/supabase-js`, lockfile changes, a live browser auth model, and fixes for the Replit branch's typecheck failures. The final branch instead links from the static workbench preview to the live wiring, secrets, observability, and team-member docs.

## Changes Made In This Pass

- Added `.agents/skills/supabase-setup/SKILL.md`.
- Updated `AGENTS.md` to list the Supabase setup skill.
- Copied stronger Replit docs for auth, API keys, media, realtime, and API limits.
- Clarified platform architecture so static fixture routing and future live Supabase routing are both true.
- Updated the first diff audit with the promoted dispositions.

## Remaining Explicit Non-Adoptions

- `public/_headers`: not adopted.
- Root sitemap: not adopted.
- Replit live workbench pages/browser Supabase helpers: not adopted.
- Replit workbench app skill: not adopted because it describes a live app layout and `public/_headers` policy that this branch does not include.
- Package/dependency/lockfile changes: not adopted because selected improvements did not require new dependencies.

