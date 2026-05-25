# Final Branch Diff Audit

Audited on 2026-05-24 against the current `codex-final` working tree.

Source branches checked:

| Source | Changed files vs `main` |
|---|---:|
| `claude` | 27 |
| `codex` | 8 |
| `u6f3g0-codex/locate-branches-and-their-code` | 15 |
| `cursor` | 46 |
| `perplexity` | 12 |
| `replit` | 83 |

Legend:

- **Exact**: current worktree is byte-identical to that branch at the same path.
- **Adapted**: the idea/content is included, but modified, reconciled with another branch, or moved to a different path.
- **Omitted**: intentionally not included in the final static-first branch.
- **Follow-up**: valuable source material, but outside this static-first integration or dependent on live provider wiring.

## Claude

| File | Disposition | Notes |
|---|---|---|
| `.env.example` | Adapted | Replaced with final public/private env split matching Supabase Edge Function boundaries. |
| `README.md` | Adapted | README updated with final shell/status/Supabase artifact summary, not Claude copy. |
| `SETUP.md` | Omitted | Superseded by `starlight/src/content/docs/process/v1-setup.md` and wiring docs. |
| `package.json` | Omitted | No dependency/version changes committed; package bumps are reserved for explicit commit. |
| `src/components/AuthWall.astro` | Omitted | Auth wall concept retained only as workbench copy; live auth is deferred. |
| `src/components/Footer.astro` | Omitted | Replaced by final page/layout structure. |
| `src/components/FrameCard.astro` | Adapted | Final `FrameCard` uses Cursor structure, tightened styling, and shared V1 fixtures. |
| `src/components/Header.astro` | Omitted | Replaced by `src/components/AppNav.astro`. |
| `src/components/StatusBadge.astro` | Adapted | Replaced by `src/components/StatusPill.astro`. |
| `src/layouts/Layout.astro` | Adapted | Replaced by final `src/layouts/BaseLayout.astro`. |
| `src/lib/client.ts` | Adapted | Provider-boundary idea captured in `src/lib/v1/contracts.ts` and `supabase.stub.ts`. |
| `src/lib/date.ts` | Adapted | Date formatting lives in `src/lib/v1/local.ts`. |
| `src/lib/env.ts` | Adapted | Runtime config lives in `src/lib/runtimeConfig.ts`; server env deferred to Edge Functions. |
| `src/lib/fixtures/index.ts` | Adapted | Fixture model replaced by richer Cursor fixtures in `src/lib/v1/local.ts`. |
| `src/lib/mock-client.ts` | Adapted | Mock-client role replaced by `localV1Repository`. |
| `src/lib/types.ts` | Adapted | Domain types live under `src/lib/v1/types.ts` and `local.ts`. |
| `src/pages/[agent_slug]/[channel_slug]/[date].astro` | Adapted | Route behavior included with final `[agentSlug]/[channelSlug]/[dateKey]/index.astro` convention. |
| `src/pages/[agent_slug]/[date].astro` | Adapted | Route behavior included with final `[agentSlug]/[dateKey]/index.astro` convention. |
| `src/pages/index.astro` | Adapted | Perplexity narrative plus final app links and static shell preview. |
| `src/pages/workbench/agents.astro` | Follow-up | Useful future workbench IA, but live multi-page workbench is deferred. |
| `src/pages/workbench/index.astro` | Adapted | Static workbench preview included and reconciled with Cursor/Replit concepts. |
| `src/pages/workbench/streams.astro` | Follow-up | Useful future workbench IA, but not part of static preview. |
| `src/styles/global.css` | Omitted | Styling is colocated with final Astro layout/components. |
| `starlight/package.json` | Omitted | No package/version changes committed. |
| `starlight/public/specs/v1-agent-api.openapi.yaml` | Exact | Claude OpenAPI spec copied exactly. |
| `starlight/src/content/docs/api-reference/errors.md` | Exact | Claude error reference copied exactly. |
| `tsconfig.json` | Adapted | Final change excludes Deno Edge Functions, not Claude path aliases. |

## Codex

| File | Disposition | Notes |
|---|---|---|
| `README.md` | Adapted | README includes final shell/backend artifact summary. |
| `package.json` | Omitted | No package/version changes committed. |
| `src/lib/v1.ts` | Adapted | Split into `src/lib/v1/contracts.ts`, `local.ts`, `types.ts`, `supabase.stub.ts`, and `index.ts`. |
| `src/pages/api/v1/frames.ts` | Omitted | Static-first final branch does not expose a root API route; Agent API contract is OpenAPI + Edge Functions. |
| `src/pages/public/index.astro` | Adapted | Public surface is `/streams/` plus dated stream routes. |
| `src/pages/workbench/index.astro` | Adapted | Static preview included with richer queue/status model. |
| `starlight/package.json` | Omitted | No package/version changes committed. |
| `starlight/src/content/docs/start-here/welcome.md` | Adapted | Welcome updated from Cursor/final docs direction, not raw Codex copy. |

## Codex Hardening PR

| File | Disposition | Notes |
|---|---|---|
| `.env.example` | Adapted | Expanded to final public/browser and server-only secret split. |
| `README.md` | Adapted | README updated for final integrated shell. |
| `docs-v1-handoff.md` | Adapted | Included and corrected for `src/lib/v1/` layout and static-first API boundary. |
| `package.json` | Omitted | No package/version changes committed. |
| `src/lib/config.ts` | Adapted | Public runtime config covered by `src/lib/runtimeConfig.ts`; provider selection deferred. |
| `src/lib/v1.contracts.ts` | Adapted | Moved to `src/lib/v1/contracts.ts` and expanded for streams. |
| `src/lib/v1.local.ts` | Adapted | Moved to `src/lib/v1/local.ts` and replaced with richer fixture model. |
| `src/lib/v1.supabase.stub.ts` | Adapted | Moved to `src/lib/v1/supabase.stub.ts`. |
| `src/lib/v1.ts` | Adapted | Replaced by `src/lib/v1/index.ts` barrel plus explicit modules. |
| `src/lib/v1.types.ts` | Adapted | Moved to `src/lib/v1/types.ts` and reconciled with Cursor/Claude status model. |
| `src/pages/api/v1/frames.ts` | Omitted | Static-first final branch keeps API implementation in Edge Function source and docs contract. |
| `src/pages/public/index.astro` | Adapted | Replaced by `/streams/`. |
| `src/pages/workbench/index.astro` | Adapted | Replaced by final static workbench preview. |
| `starlight/package.json` | Omitted | No package/version changes committed. |
| `starlight/src/content/docs/start-here/welcome.md` | Adapted | Welcome reflects final integrated direction. |

## Cursor

| File | Disposition | Notes |
|---|---|---|
| `.agents/skills/branch-pr-workflow/SKILL.md` | Omitted | Cursor workflow edits not needed for selected static shell changes. |
| `.agents/skills/deployment/SKILL.md` | Omitted | Deployment policy intentionally kept: no root sitemap, no `_headers`. |
| `.agents/skills/docs-architecture/SKILL.md` | Adapted | Updated only for Supabase artifacts, Deno function exclusion, and schema key. |
| `.agents/skills/skills-maintenance/SKILL.md` | Omitted | No selected invariant needed its Cursor edit. |
| `.gitignore` | Omitted | Final branch did not add Cursor config artifacts requiring gitignore changes. |
| `AGENTS.md` | Adapted | Updated docs count and Supabase/Deno note, not Cursor policy changes. |
| `README.md` | Adapted | Final README summary added. |
| `config/project.config.json.example` | Omitted | Config-file path not adopted in static-first branch. |
| `env.example` | Omitted | Replaced by root `.env.example`. |
| `package.json` | Omitted | No package/version changes committed. |
| `public/robots.txt` | Omitted | No root sitemap added, so robots stayed unchanged. |
| `src/components/AppNav.astro` | Adapted | Included with minor final styling changes. |
| `src/components/FrameCard.astro` | Adapted | Included with tightened radii/background and final imports. |
| `src/components/StatusPill.astro` | Exact | Copied exactly. |
| `src/components/StreamHeader.astro` | Adapted | Included with final typography/radius adjustments. |
| `src/data/v1Demo.ts` | Adapted | Moved to `src/lib/v1/local.ts` and extended with repository wrapper. |
| `src/env.d.ts` | Omitted | Not needed for current runtime config. |
| `src/layouts/BaseLayout.astro` | Adapted | Included with final favicon, background, and radius changes. |
| `src/lib/runtimeConfig.ts` | Exact | Copied exactly. |
| `src/lib/streamResolver.ts` | Adapted | Included and pointed at `src/lib/v1/local.ts`. |
| `src/pages/404.astro` | Adapted | Final page uses Perplexity recovery copy and shared layout. |
| `src/pages/[agentSlug]/[channelSlug]/[dateKey]/index.astro` | Adapted | Included with minor final typography change. |
| `src/pages/[agentSlug]/[dateKey]/index.astro` | Adapted | Included with minor final typography change. |
| `src/pages/index.astro` | Adapted | Final homepage combines Perplexity narrative with Cursor shell links. |
| `src/pages/sitemap.xml.ts` | Omitted | Root sitemap intentionally not introduced. |
| `src/pages/streams/index.astro` | Adapted | Included with final typography/radius changes. |
| `src/pages/v1-status.json.ts` | Adapted | Included with root sitemap references removed. |
| `src/pages/workbench/index.astro` | Adapted | Included with final styling and copy constraints. |
| `starlight/package.json` | Omitted | No package/version changes committed. |
| `starlight/public/specs/schemas/approval-policy.v1.schema.json` | Exact | Copied exactly. |
| `starlight/public/specs/v1-agent-api.openapi.yaml` | Adapted | Claude spec selected instead of Cursor spec. |
| `starlight/src/content/docs/api-reference/realtime-events.md` | Exact | Copied exactly. |
| `starlight/src/content/docs/api-reference/submission-status.md` | Adapted | Perplexity version selected. |
| `starlight/src/content/docs/foundations/watch-the-builders.md` | Omitted | Not part of selected final scope. |
| `starlight/src/content/docs/process/quick-wins.md` | Omitted | Not part of selected final scope. |
| `starlight/src/content/docs/process/v1-setup.md` | Exact | Copied exactly. |
| `starlight/src/content/docs/reference/config.md` | Omitted | Cursor config artifact was not adopted. |
| `starlight/src/content/docs/reference/file-and-route-conventions.md` | Omitted | Existing route convention docs retained. |
| `starlight/src/content/docs/roadmap-and-open-questions/open-questions.md` | Omitted | Not part of selected final scope. |
| `starlight/src/content/docs/specifications/approval-policy.md` | Omitted | Existing page retained; schema copied. |
| `starlight/src/content/docs/specifications/data-model.md` | Exact | Copied exactly. |
| `starlight/src/content/docs/specifications/realtime-events.md` | Exact | Copied exactly. |
| `starlight/src/content/docs/specifications/route-contract.md` | Omitted | Existing page retained. |
| `starlight/src/content/docs/specifications/supabase-sql.md` | Exact | Copied exactly. |
| `starlight/src/content/docs/start-here/reading-these-docs.md` | Omitted | Existing page retained. |
| `starlight/src/content/docs/start-here/welcome.md` | Exact | Copied exactly. |

## Perplexity

| File | Disposition | Notes |
|---|---|---|
| `.agents/skills/deployment/SKILL.md` | Omitted | Perplexity `_headers` policy change intentionally not adopted. |
| `AGENTS.md` | Adapted | Repo invariants kept aligned with no `_headers` and no root sitemap. |
| `README.md` | Adapted | README updated for final integrated shell. |
| `package.json` | Omitted | No package/version changes committed. |
| `public/_headers` | Omitted | Explicitly not introduced. |
| `src/pages/404.astro` | Adapted | Recovery copy and route pattern used with shared layout. |
| `src/pages/index.astro` | Adapted | Narrative/metadata strategy used, rewritten around final shell and ASCII source. |
| `starlight/package.json` | Omitted | No package/version changes committed. |
| `starlight/src/content/docs/api-reference/submission-status.md` | Exact | Copied exactly. |
| `starlight/src/content/docs/reference/cloudflare-pages.md` | Adapted | Copied then corrected for no `_headers`. |
| `starlight/src/content/docs/reference/static-hosting.md` | Adapted | Copied then corrected for no `_headers`. |
| `starlight/src/content/docs/reference/supabase-setup.md` | Omitted | Superseded by Replit/Cursor setup, secrets, upstream, and wiring docs. |

## Replit

| File | Disposition | Notes |
|---|---|---|
| `.agents/skills/deployment/SKILL.md` | Omitted | Replit deployment changes conflicted with current no `_headers` policy. |
| `.agents/skills/docs-architecture/SKILL.md` | Adapted | Updated only for final Supabase/Deno and schema changes. |
| `.agents/skills/supabase-setup/SKILL.md` | Adapted | Added in the deep audit pass with path wording corrected for this repo. |
| `.agents/skills/workbench-app/SKILL.md` | Follow-up | Useful for live workbench pass; not needed for static preview. |
| `.env.example` | Adapted | Included with final secret naming and public/private split. |
| `.gitignore` | Omitted | Replit dependency/tooling changes were not adopted. |
| `.replit` | Omitted | Replit platform file not relevant to this repo flow. |
| `AGENTS.md` | Adapted | Updated for docs count and Supabase/Deno boundaries. |
| `README.md` | Adapted | README updated for final shell and backend artifacts. |
| `attached_assets/Screenshot_2026-05-23_at_23.43.53_1779572694220.png` | Omitted | Local screenshot asset not needed in final static shell. |
| `attached_assets/Screenshot_2026-05-23_at_23.43.59_1779572694220.png` | Omitted | Local screenshot asset not needed in final static shell. |
| `package.json` | Omitted | Replit dependency additions were not adopted. |
| `pnpm-lock.yaml` | Omitted | No dependency additions were adopted. |
| `public/_headers` | Omitted | Explicitly not introduced. |
| `replit.md` | Omitted | Replit-specific workspace note not relevant to final branch. |
| `src/layouts/Workbench.astro` | Follow-up | Live workbench layout deferred. |
| `src/lib/auth-client.ts` | Follow-up | Browser Supabase auth deferred. |
| `src/lib/env.ts` | Follow-up | Live env helper deferred; static runtime config is present. |
| `src/lib/realtime.ts` | Follow-up | Live realtime client deferred. |
| `src/lib/supabase.ts` | Follow-up | Browser Supabase client deferred. |
| `src/lib/tenant.ts` | Follow-up | Live tenant resolver deferred. |
| `src/pages/index.astro` | Adapted | Final homepage uses selected Perplexity/Cursor direction. |
| `src/pages/workbench/accept-invite.astro` | Follow-up | Live auth/team flow deferred. |
| `src/pages/workbench/agents.astro` | Follow-up | Live workbench IA deferred. |
| `src/pages/workbench/api-keys.astro` | Follow-up | Live API-key UI deferred. |
| `src/pages/workbench/approval-settings.astro` | Follow-up | Live settings UI deferred. |
| `src/pages/workbench/channels.astro` | Follow-up | Live workbench IA deferred. |
| `src/pages/workbench/frames/[id].astro` | Follow-up | Live frame detail deferred; Replit version had typecheck issues. |
| `src/pages/workbench/inbox.astro` | Follow-up | Live workbench inbox deferred. |
| `src/pages/workbench/index.astro` | Adapted | Static preview uses Replit IA labels but not live implementation. |
| `src/pages/workbench/login.astro` | Follow-up | Live login deferred; Replit version had strict DOM typing issues. |
| `src/pages/workbench/settings.astro` | Follow-up | Live settings UI deferred. |
| `src/pages/workbench/team.astro` | Follow-up | Live team UI deferred. |
| `starlight/package.json` | Omitted | No package/version changes committed. |
| `starlight/public/specs/v1-agent-api.openapi.yaml` | Adapted | Claude spec selected; Replit backend concepts covered in docs/functions. |
| `starlight/src/content.config.ts` | Adapted | Added `verify_against` support required by Replit wiring doc. |
| `starlight/src/content/docs/api-reference/errors.md` | Adapted | Claude page selected. |
| `starlight/src/content/docs/api-reference/frame-submissions.md` | Follow-up | Potential API-doc detail for a later docs consolidation pass. |
| `starlight/src/content/docs/api-reference/limits.md` | Exact | Copied exactly in the deep audit pass. |
| `starlight/src/content/docs/api-reference/media-uploads.md` | Follow-up | Potential API-doc detail for a later docs consolidation pass. |
| `starlight/src/content/docs/api-reference/metadata.md` | Follow-up | Potential API-doc detail for a later docs consolidation pass. |
| `starlight/src/content/docs/api-reference/realtime-events.md` | Adapted | Cursor page selected over Replit variant. |
| `starlight/src/content/docs/api-reference/submission-status.md` | Adapted | Perplexity page selected over Replit variant. |
| `starlight/src/content/docs/foundations/platform-architecture.md` | Adapted | Replit provider details adopted, with static fixture/live provider distinction clarified. |
| `starlight/src/content/docs/reference/glossary.md` | Follow-up | Potential glossary enrichment for docs pass. |
| `starlight/src/content/docs/reference/secrets-and-environments.md` | Adapted | Copied then corrected for current no `_headers` policy. |
| `starlight/src/content/docs/reference/upstream-docs.md` | Exact | Copied exactly. |
| `starlight/src/content/docs/roadmap-and-open-questions/open-questions.md` | Omitted | Existing roadmap page retained. |
| `starlight/src/content/docs/specifications/media-ingest.md` | Follow-up | Potential detail for media-provider pass. |
| `starlight/src/content/docs/specifications/realtime-events.md` | Adapted | Cursor page selected over Replit variant. |
| `starlight/src/content/docs/specifications/supabase-sql.md` | Adapted | Cursor SQL doc selected; Replit migrations copied exactly. |
| `starlight/src/content/docs/start-here/reading-these-docs.md` | Omitted | Existing page retained. |
| `starlight/src/content/docs/start-here/welcome.md` | Adapted | Cursor welcome selected and final docs count reconciled. |
| `starlight/src/content/docs/v1-plan/approval-and-api-keys.md` | Exact | Copied exactly in the deep audit pass. |
| `starlight/src/content/docs/v1-plan/auth-and-sessions.md` | Exact | Copied exactly in the deep audit pass. |
| `starlight/src/content/docs/v1-plan/data-model.md` | Follow-up | Potential live Supabase docs enrichment. |
| `starlight/src/content/docs/v1-plan/media-and-delivery.md` | Exact | Copied exactly in the deep audit pass. |
| `starlight/src/content/docs/v1-plan/observability.md` | Exact | Copied exactly in the improvement pass after the initial audit. |
| `starlight/src/content/docs/v1-plan/realtime-operations.md` | Exact | Copied exactly in the deep audit pass. |
| `starlight/src/content/docs/v1-plan/settings.md` | Follow-up | Potential live settings docs enrichment. |
| `starlight/src/content/docs/v1-plan/team-members.md` | Exact | Copied exactly in the improvement pass after the initial audit. |
| `starlight/src/content/docs/v1-plan/wiring-supabase-cloudflare.md` | Adapted | Copied then corrected for no `_headers` policy. |
| `starlight/src/content/docs/v1-plan/workbench.md` | Follow-up | Potential live workbench docs enrichment. |
| `supabase/.gitignore` | Exact | Copied exactly. |
| `supabase/config.toml` | Exact | Copied exactly. |
| `supabase/functions/_shared/auth.ts` | Exact | Copied exactly. |
| `supabase/functions/_shared/cors.ts` | Exact | Copied exactly. |
| `supabase/functions/_shared/errors.ts` | Exact | Copied exactly. |
| `supabase/functions/_shared/events.ts` | Exact | Copied exactly. |
| `supabase/functions/_shared/hash.ts` | Exact | Copied exactly. |
| `supabase/functions/_shared/images.ts` | Exact | Copied exactly. |
| `supabase/functions/_shared/rate-limit.ts` | Exact | Copied exactly. |
| `supabase/functions/_shared/stream.ts` | Exact | Copied exactly. |
| `supabase/functions/_shared/supabase.ts` | Exact | Copied exactly. |
| `supabase/functions/frame-submissions/index.ts` | Exact | Copied exactly. |
| `supabase/functions/import_map.json` | Exact | Copied exactly. |
| `supabase/functions/media-uploads/index.ts` | Exact | Copied exactly. |
| `supabase/functions/stream-webhook/index.ts` | Exact | Copied exactly. |
| `supabase/functions/submission-status/index.ts` | Exact | Copied exactly. |
| `supabase/functions/team-invitations/index.ts` | Exact | Copied exactly. |
| `supabase/migrations/20260522000000_init.sql` | Exact | Copied exactly. |
| `supabase/migrations/20260522000001_api_keys_view.sql` | Exact | Copied exactly. |
| `supabase/seed.sql` | Exact | Copied exactly. |

## Audit Findings

No accidental branch-wide miss was found against the validated static-first plan. The final branch intentionally favors:

1. Claude for OpenAPI and errors.
2. Cursor for the buildable static app shell and status JSON.
3. Perplexity for public home/404 and static hosting docs.
4. Replit for Supabase migrations, seed, Edge Function source, and wiring/secrets/upstream docs.
5. Codex hardening for the provider-boundary shape and handoff checklist.

Intentional omissions:

- Root sitemap and `public/_headers` remain omitted to preserve current deployment invariants.
- Live Supabase browser/workbench pages remain deferred because the Replit branch failed `pnpm check` and the final plan chose static shell first.
- Dependency/package/lockfile changes remain omitted because no adopted source required new npm dependencies.
- Package version bumps remain omitted because no commit has been requested.

Follow-up candidates if the next goal is live provider wiring:

- Replit workbench pages and browser Supabase helpers.
- Replit workbench/auth/team skills.
- Replit docs for live workbench operations.
- Deno/Supabase-specific verification for `supabase/functions/`; root Astro check intentionally excludes those files.
