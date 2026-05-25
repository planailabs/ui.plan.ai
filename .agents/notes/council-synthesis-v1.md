# Council synthesis v1 — report

Synthesis of seven LLM-produced V1 branches into a single coherent set of staged edits intended for a new `council-synthesis-v1` branch. The mission prompt is `.agents/prompts/council-synthesis-v1.md`.

The working tree on `main` currently holds the proposed final state. No git commands were executed; the user creates the branch and commits per the sequence below.

## Substrate observation

Two branches share an identical backend substrate:

- All files under `supabase/functions/_shared/`, `supabase/functions/{frame-submissions,media-uploads,stream-webhook,submission-status,team-invitations}/`, `supabase/migrations/`, and `supabase/seed.sql` are **byte-identical** between `replit` and `codex-final`. One was built on the other.
- `replit = codex-final` (backend) **+** `supabase/config.toml` **+** the full workbench frontend (10 pages, layout, realtime/auth lib).
- `codex-final` adds, on top of that shared backend: UI primitives (BaseLayout, AppNav, FrameCard, StatusPill, StreamHeader), the `V1Repository` provider abstraction (`src/lib/v1/`), the public stream route shells (`[agentSlug]/[dateKey]/`, `[agentSlug]/[channelSlug]/[dateKey]/`, `streams/`), and the bulk of the new V1 docs.

This collapsed the largest synthesis decision: take the backend once (from `replit`, which includes `config.toml`), then layer `codex-final`'s shell + docs and `replit`'s workbench on top.

## Per-branch inventory

### `claude` (27 files) — setup + scaffold + docs polish

- **Diff scope**: docs (API reference), specs (OpenAPI), app shell (auth-walled workbench stubs, public route fixtures), env, setup.
- **Key ideas**: SETUP.md, `.env.example`, demo fixtures (one tenant / two agents / two channels / five frames), pluggable backend interface (`src/lib/client.ts`), per-error-code anchors in `api-reference/errors.md`, expanded OpenAPI YAML (description, externalDocs, security tags), TypeScript types mirroring V1 API + Supabase schema.
- **Strengths**: cleanest zero-to-running-dev story; complete .env documentation; error doc anchors enable deep links from API responses.
- **Rule violations**: none observed.
- **Reusable artifacts**: `SETUP.md`, `api-reference/errors.md` (byte-identical to codex-final's), `starlight/public/specs/v1-agent-api.openapi.yaml` (byte-identical to codex-final's).
- **Skipped**: `src/lib/{types,fixtures,client,mock-client,date}.ts` and `src/components/{AuthWall,Header,Footer,FrameCard,StatusBadge}.astro` — would duplicate codex-final's `v1/types.ts`, `v1/local.ts`, and component primitives. Also `tsconfig.json` path aliases (`@lib`, `@components`, `@layouts`) — diverging convention.

### `codex` (8 files) — lean shell + welcome restructure

- **Diff scope**: app surfaces with in-memory providers, welcome onboarding rewrite, version bumps.
- **Key ideas**: provider-swap seams; restructured welcome with two-surface framing.
- **Strengths**: concise, contract-grounded.
- **Rule violations**: none observed.
- **Reusable artifacts**: none adopted verbatim — `codex-final` supersedes the provider pattern with its `V1Repository` interface, and the welcome restructure has multiple competing versions (see decision below).

### `codex-final` (73 files) — comprehensive final cut

- **Diff scope**: ~30 docs, ~22 Supabase backend files, ~10 app shell files, ~8 lib files, env, setup, OpenAPI, JSON Schemas.
- **Key ideas**: full Supabase schema + 5 Edge Functions; new v1-plan pages (`observability`, `team-members`, `wiring-supabase-cloudflare`); BaseLayout + UI primitives; `V1Repository` provider abstraction with local impl; expanded OpenAPI; supabase-setup SKILL.
- **Strengths**: most production-complete; clean separation of Astro app from Supabase project; Edge Functions are polished (CORS, rate-limit, idempotency, structured problem+json).
- **Rule violations**: none observed.
- **Reusable artifacts (adopted)**: all v1-plan additions, all Supabase backend files (modulo `config.toml` from replit), UI primitives, V1Repository abstraction, OpenAPI/JSON Schemas, supabase-setup SKILL, tsconfig.json supabase exclude, content.config.ts schema extension.
- **Skipped**: `docs/superpowers/plans/*.md` (internal planning notes — git log is the archive), `docs-v1-handoff.md` at root (content already covered by `wiring-supabase-cloudflare.md`), `src/lib/v1/supabase.stub.ts` (placeholder stub).

### `cursor` (46 files) — contract-faithful shell + Cursor Cloud notes

- **Diff scope**: v1 shell, discovery metadata, Cursor Cloud setup instructions, version bumps.
- **Key ideas**: discovery (robots/sitemap), v1-status.json endpoint (codex-final ships this too), v1 setup checklist (codex-final's `process/v1-setup.md` covers this), AppNav/FrameCard/StatusPill/StreamHeader primitives (codex-final overlaps).
- **Strengths**: contract-faithful mock data shaped exactly like Supabase rows.
- **Rule violations**: Cursor Cloud-specific tmux/portal instructions in AGENTS.md (not generic), version bumps to be reconciled.
- **Reusable artifacts**: `Disallow: /workbench/` line in `public/robots.txt` — adopted.
- **Skipped**: Cursor Cloud AGENTS.md additions (provider-specific), `Sitemap: https://ui.plan.ai/sitemap.xml` line (violates hard rule — no root sitemap). The component primitives, v1-status endpoint, and v1-setup checklist were all sourced from codex-final's equivalents which compose better with the V1Repository abstraction.

### `perplexity` (12 files) — home/404 + deployment refs + README

- **Diff scope**: home/404 design-token polish + JSON-LD, three reference deployment docs, README rewrite, deployment SKILL update.
- **Key ideas**: shared CSS-variable design tokens across home + 404; minimal JSON-LD `WebSite` schema; Cloudflare Pages / static-hosting / Supabase setup reference docs; product-led README.
- **Strengths**: only branch whose home/404 are stylistically coherent; reference docs correctly say "no `_headers` committed today" (matches hard rule).
- **Rule violations**: ships `public/_headers` (rejected, per hard rule); deployment SKILL update assumes `_headers` is shipped (rejected accordingly).
- **Reusable artifacts (adopted)**: `src/pages/index.astro`, `src/pages/404.astro`, `README.md`, `starlight/src/content/docs/reference/{cloudflare-pages,static-hosting,supabase-setup}.md` (perplexity's wording correctly reflects no-`_headers` state, where codex-final's two equivalents assume `_headers` is shipped), `starlight/src/content/docs/api-reference/submission-status.md` (adds `team_visible`/`promotion_eligible` polish).
- **Skipped**: `public/_headers`, deployment SKILL update.

### `replit` (83 files) — full workbench + observability + Supabase ⊃ codex-final

- **Diff scope**: ~13 docs, ~22 Supabase backend files (identical to codex-final), `supabase/config.toml` (replit-only), ~15 workbench app files, ~5 lib glue, 2 new skills, version bumps.
- **Key ideas**: realtime subscriptions wired to spec event names (`subscribeInbox`, `subscribeFrame`); 10 workbench pages (login, inbox, frames/[id], agents, channels, api-keys, approval-settings, team, settings, accept-invite); Workbench layout with auth guard; supabase-setup + workbench-app SKILLs; observability/team-members/secrets-and-environments docs.
- **Strengths**: only branch with live event log + Postgres Changes wiring matching the spec; idempotency fingerprinting; auth+MFA gating at the DB layer.
- **Rule violations**: ships `public/_headers` (rejected), ships `.replit` and `replit.md` (Replit-specific, rejected), two binary screenshots under `attached_assets/` (rejected — never commit binaries).
- **Reusable artifacts (adopted)**: `supabase/config.toml`, `src/layouts/Workbench.astro`, `src/lib/{auth-client,env,realtime,supabase,tenant}.ts`, all `src/pages/workbench/*.astro` plus `src/pages/workbench/frames/[id].astro`, `.agents/skills/workbench-app/SKILL.md`, `starlight/src/content/docs/{api-reference/{frame-submissions,media-uploads,metadata},reference/glossary,roadmap-and-open-questions/open-questions,specifications/media-ingest,start-here/reading-these-docs,v1-plan/{data-model,settings,workbench}}.md`, `pnpm-lock.yaml` (carries the `@supabase/supabase-js` resolution).
- **Skipped**: `public/_headers`, `.replit`, `replit.md`, `attached_assets/*.png`.

### `u6f3g0-codex/locate-branches-and-their-code` (15 files, additive on `codex`) — provider contracts

- **Diff scope vs codex**: `V1Repository` interface in `src/lib/v1.contracts.ts`, env-driven provider selection (`src/lib/config.ts`), Supabase adapter stub, `docs-v1-handoff.md`.
- **Key ideas**: clean provider boundary; environment-driven swap.
- **Strengths**: clean separation of contracts from implementation.
- **Rule violations**: `docs-v1-handoff.md` at repo root (should live in `starlight/src/content/docs/v1-plan/` — and is effectively superseded by `codex-final`'s `wiring-supabase-cloudflare.md`).
- **Reusable artifacts**: the `V1Repository` interface itself — but `codex-final` ships an equivalent at `src/lib/v1/contracts.ts` with a richer surface, so codex-final's is adopted.
- **Skipped**: all files — superseded by `codex-final`'s `src/lib/v1/` layout and `wiring-supabase-cloudflare.md` content.

## Per-area decisions

- **Starlight content / v1-plan**: primary source `codex-final` (for new pages and identical amendments); `replit`'s `v1-plan/{data-model,settings,workbench}.md` amendments adopted where they were the only edits; `wiring-supabase-cloudflare.md` taken from `codex-final` because it correctly says "Decide whether to ship a `_headers` baseline" rather than `replit`'s assertive "Ship the `_headers` baseline." Rejected: `codex`/`replit`'s competing welcome rewrites — kept `codex-final`'s version (most aligned with quiet-ops intent).
- **Starlight content / api-reference**: `errors.md` and the OpenAPI YAML from `claude` (byte-identical to `codex-final`'s); `submission-status.md` from `perplexity` (only branch that polished the enum values); `frame-submissions.md`, `media-uploads.md`, `metadata.md` from `replit` (only branch that added them); `limits.md`, `realtime-events.md` from `codex-final`.
- **Starlight content / reference**: `cloudflare-pages.md`, `static-hosting.md`, `supabase-setup.md` from `perplexity` (its wording correctly reflects no-`_headers`); `secrets-and-environments.md`, `upstream-docs.md` from `codex-final`; `glossary.md` from `replit` (only source).
- **Starlight content / specifications + process + foundations**: `codex-final` (primary), with `replit`'s `specifications/media-ingest.md` and `start-here/reading-these-docs.md` adopted as additive.
- **Static API contracts** (`starlight/public/specs/`): OpenAPI YAML and JSON Schema from `codex-final` (byte-identical to `claude` on the YAML).
- **Agent docs**: AGENTS.md from `codex-final` with a `workbench-app` SKILL pointer added and the layout table extended for `/workbench/*` and the Supabase backend row; `docs-architecture` SKILL from `codex-final` (`replit`'s version contains `_headers` references that don't apply); `supabase-setup` SKILL from `codex-final`; `workbench-app` SKILL from `replit`. Rejected: `cursor`'s Cursor Cloud AGENTS.md additions; `perplexity`'s deployment SKILL update.
- **Main app shell**: home + 404 from `perplexity` (only source with shared design tokens + JSON-LD); BaseLayout, AppNav, FrameCard, StatusPill, StreamHeader from `codex-final`; v1 dynamic routes (`[agentSlug]/[dateKey]/`, `[agentSlug]/[channelSlug]/[dateKey]/`) and `streams/`, `v1-status.json` endpoint from `codex-final`; provider abstraction (`src/lib/v1/`) from `codex-final`; `runtimeConfig.ts`, `streamResolver.ts` from `codex-final`. Skipped: `claude`'s separate `types.ts`/`fixtures/`/`client.ts`/`mock-client.ts`/`date.ts` (`codex-final`'s `v1/*` layer supersedes); `cursor`'s `v1Demo.ts` (same).
- **Setup surface**: `SETUP.md` from `claude`; `README.md` from `perplexity`; `.env.example` synthesized from `claude` (intro comments) + `codex-final` (var set) + `replit` (server-side Supabase aliases).
- **Design system / tokens / a11y / JSON-LD**: from `perplexity` (home + 404 only — the workbench keeps its own quiet-ops chrome via `codex-final`'s BaseLayout and `replit`'s Workbench layout).
- **Workbench realtime + frame submission**: from `replit`. The Edge Functions that the workbench calls are identical to `codex-final`'s, so the integration is mechanical.
- **Provider contracts and handoff docs**: `codex-final`'s `src/lib/v1/contracts.ts` is the chosen surface. `u6f3g0-codex/locate-branches-and-their-code` and `cursor`'s competing patterns were rejected in favor of this single interface.

## Proposed commit sequence

The working tree currently reflects the FINAL state (root `package.json: 0.0.26`, `starlight/package.json: 0.0.30`). On the new branch, decompose into the sequence below, bumping versions per commit per `git-commit` SKILL. Versions shown are post-commit targets; start from `main` baseline (root `0.0.20`, starlight `0.0.25`).

1. **`feat(docs): land v1-plan amendments and observability/team/wiring pages`** — starlight bump `0.0.25 → 0.0.26`. Files:
   - `starlight/src/content/docs/v1-plan/{approval-and-api-keys,auth-and-sessions,media-and-delivery,realtime-operations}.md` (amended)
   - `starlight/src/content/docs/v1-plan/{data-model,settings,workbench}.md` (amended from replit)
   - `starlight/src/content/docs/v1-plan/{observability,team-members,wiring-supabase-cloudflare}.md` (new)
   - `starlight/src/content.config.ts` (schema extension adds `verify_against`)
   - `starlight/package.json` (version)

2. **`feat(docs): land API reference enhancements and welcome+glossary polish`** — starlight bump `0.0.26 → 0.0.27`. Files:
   - `starlight/src/content/docs/api-reference/{errors,frame-submissions,media-uploads,metadata,limits,realtime-events,submission-status}.md`
   - `starlight/src/content/docs/specifications/{data-model,media-ingest,realtime-events,supabase-sql}.md`
   - `starlight/src/content/docs/foundations/platform-architecture.md`
   - `starlight/src/content/docs/start-here/{welcome,reading-these-docs}.md`
   - `starlight/src/content/docs/reference/glossary.md`
   - `starlight/src/content/docs/roadmap-and-open-questions/open-questions.md`
   - `starlight/src/content/docs/process/v1-setup.md`
   - `starlight/package.json` (version)

3. **`feat(specs): publish canonical V1 OpenAPI and JSON schemas`** — starlight bump `0.0.27 → 0.0.28`. Files:
   - `starlight/public/specs/v1-agent-api.openapi.yaml`
   - `starlight/public/specs/schemas/approval-policy.v1.schema.json`
   - `starlight/package.json` (version)

4. **`feat(docs): add deployment and hosting reference pages`** — starlight bump `0.0.28 → 0.0.29`. Files:
   - `starlight/src/content/docs/reference/{cloudflare-pages,static-hosting,supabase-setup,secrets-and-environments,upstream-docs}.md`
   - `starlight/package.json` (version)

5. **`feat(agents): add supabase-setup and workbench-app skills; update AGENTS.md`** — workspace bump root `0.0.20 → 0.0.21`, starlight `0.0.29 → 0.0.30`. Files:
   - `.agents/skills/supabase-setup/SKILL.md` (new)
   - `.agents/skills/workbench-app/SKILL.md` (new)
   - `.agents/skills/docs-architecture/SKILL.md` (updated)
   - `AGENTS.md` (layout table + skills list + Supabase context paragraph + docs file count = 72)
   - `package.json` + `starlight/package.json` (versions)

6. **`feat(setup): canonical SETUP, README, and .env.example`** — root bump `0.0.21 → 0.0.22`. Files:
   - `SETUP.md` (new — claude)
   - `README.md` (perplexity)
   - `.env.example` (new — blended)
   - `public/robots.txt` (adds `Disallow: /workbench/`)
   - `package.json` (version)

7. **`feat(app): home and 404 polish with shared design tokens and JSON-LD`** — root bump `0.0.22 → 0.0.23`. Files:
   - `src/pages/index.astro`
   - `src/pages/404.astro`
   - `package.json` (version)

8. **`feat(app): V1 stream and workbench shell scaffolding`** — root bump `0.0.23 → 0.0.24`. Files:
   - `src/layouts/BaseLayout.astro`
   - `src/components/{AppNav,FrameCard,StatusPill,StreamHeader}.astro`
   - `src/pages/[agentSlug]/[dateKey]/index.astro`
   - `src/pages/[agentSlug]/[channelSlug]/[dateKey]/index.astro`
   - `src/pages/streams/index.astro`
   - `src/pages/v1-status.json.ts`
   - `src/lib/{runtimeConfig,streamResolver}.ts`
   - `src/lib/v1/{contracts,index,local,types}.ts`
   - `tsconfig.json` (excludes `supabase/functions`)
   - `package.json` (version)

9. **`feat(workbench): authenticated workbench pages, layout, realtime`** — root bump `0.0.24 → 0.0.25`. Files:
   - `src/layouts/Workbench.astro`
   - `src/lib/{auth-client,env,realtime,supabase,tenant}.ts`
   - `src/pages/workbench/{accept-invite,agents,api-keys,approval-settings,channels,inbox,login,settings,team}.astro`
   - `src/pages/workbench/frames/[id].astro`
   - `pnpm-lock.yaml` (adds @supabase/supabase-js resolution)
   - `package.json` (adds @supabase/supabase-js dep + version)

10. **`feat(backend): Supabase migrations, edge functions, and config`** — root bump `0.0.25 → 0.0.26` (no starlight change in this commit). Files:
    - `supabase/config.toml`
    - `supabase/.gitignore`
    - `supabase/seed.sql`
    - `supabase/migrations/{20260522000000_init,20260522000001_api_keys_view}.sql`
    - `supabase/functions/import_map.json`
    - `supabase/functions/_shared/{auth,cors,errors,events,hash,images,rate-limit,stream,supabase}.ts`
    - `supabase/functions/{frame-submissions,media-uploads,stream-webhook,submission-status,team-invitations}/index.ts`
    - `package.json` (version)

Alternative if the user prefers a single commit: collapse into `feat: synthesize V1 from seven council branches` with one bump (root `0.0.20 → 0.0.21`, starlight `0.0.25 → 0.0.26`) and keep the per-area summary in the commit body. The 10-commit form preserves the rebase-merge granularity that `branch-pr-workflow` prefers.

## Open questions

1. **Should `public/_headers` ship after all?** Both `replit` and `perplexity` wrote a sensible CF Pages headers baseline (Referrer-Policy, X-Content-Type-Options, X-Frame-Options DENY, Permissions-Policy, COOP, long-lived caches on `_astro/*` and `pagefind/*`, no-store on `/workbench/`). Current synthesis rejects per hard rule. If you want it in, adopt `perplexity`'s 26-line `public/_headers` plus `perplexity`'s `deployment` SKILL update and the codex-final-version `cloudflare-pages.md` / `static-hosting.md` that assume it ships.
2. **Welcome page voice.** Three candidates: `codex-final` (versions table + start-here list — adopted), `codex` (adds "choose your path"), `replit` (problem-it-solves narrative). Adopted `codex-final`'s because it stays closest to "quiet operations tool" intent; pull the others if you want a more product-oriented landing for `/docs/start-here/welcome/`.
3. **`tsconfig.json` path aliases (`@lib`, `@components`, `@layouts`)** from `claude`. Not adopted — the staged code uses relative imports. Easy to layer in later if a convention emerges; would require touching every staged import.
4. **`docs-v1-handoff.md` from `u6f3g0-codex` and `docs/superpowers/plans/*.md` from `codex-final`** were intentionally not staged. The first is superseded by `v1-plan/wiring-supabase-cloudflare.md`; the second is internal planning material that belongs in git log, not the docs tree. Surface either if you want them.
5. **Supabase `@supabase/supabase-js@^2.45.4` dependency** is added via `package.json` and `pnpm-lock.yaml` from `replit`. The lockfile has 97 lines of changes (68/29 insertions/deletions); rerun `pnpm install` if the lockfile gets stale before merge.
6. **`v1-status.json.ts` endpoint** is shipped (`codex-final`). If you don't want a machine-readable status endpoint exposed on `/`, delete it before commit 8.
7. **Cursor Cloud setup notes** from `cursor` were rejected as provider-specific. If you want them archived, drop them under `.agents/guides/cursor-cloud-quickstart.md` rather than inside `AGENTS.md`.

## Verification checklist

Before opening a PR:

1. **`pnpm install`** — the lockfile now resolves `@supabase/supabase-js@^2.45.4`. Confirm install succeeds.
2. **`pnpm check`** — astro check on both projects. The staged code uses `@supabase/supabase-js`; this should resolve through the new dep.
3. **`pnpm build`** — docs build first, then main; confirm `dist/docs/` exists with the new v1-plan pages and `dist/docs/specs/v1-agent-api.openapi.yaml` is present.
4. **`pnpm preview`** — visit these URLs to spot-check:
   - `/` — home with design tokens, JSON-LD in `<head>` (view source for `application/ld+json`).
   - `/404` (deliberately broken URL like `/no-such-page/`) — tokens match home.
   - `/docs/start-here/welcome/` — `codex-final`'s welcome.
   - `/docs/v1-plan/observability/`, `/docs/v1-plan/team-members/`, `/docs/v1-plan/wiring-supabase-cloudflare/` — new pages render with sidebar entries.
   - `/docs/api-reference/errors/` — anchors per error code (e.g. `#validation_failed`).
   - `/docs/specs/v1-agent-api.openapi.yaml` — file served, 200, valid YAML.
   - `/docs/reference/{cloudflare-pages,static-hosting,supabase-setup}/` — render with correct no-`_headers` wording.
   - `/streams/` — public stream discovery page.
   - `/v1-status.json` — JSON status endpoint.
   - `/workbench/` (without auth) — redirects/blocks to `/workbench/login/`.
5. **`pnpm check && pnpm build`** combined — the pre-merge gate per `branch-pr-workflow` skill. Must be green before PR.
6. **Visual spot-check the workbench** (`/workbench/inbox/`, `/workbench/frames/<id>/`) — render in mock mode without Supabase configured; realtime indicator shows "disconnected" cleanly when `PUBLIC_SUPABASE_URL` is empty.
7. **`grep -nE '4321|4322|starlight-docs|/docs/|base:|outDir' AGENTS.md .agents/skills/**/SKILL.md`** per `skills-maintenance` SKILL — confirm no stale values.
8. **Favicon parity** — `cmp public/favicon.svg starlight/public/favicon.svg` should be silent.
9. **`/docs/` redirect** — `curl -sI http://localhost:4321/docs/` should still 308 to `/docs/start-here/welcome/` (no file-based `index.md` was added).
10. **Confirm `supabase/` is intentionally on disk but never built** — `pnpm build` does not enter `supabase/`. The `supabase db push` / `supabase functions deploy` flow only runs from CLI on user ask (per `supabase-setup` SKILL).
11. **Re-confirm V1 plan contract** — read `/docs/v1-plan/scope/` and `/docs/v1-plan/principles/` and verify staged code/docs do not contradict (e.g., still no public tenant signup, still no server-side frame generation).

## Hand-off notes

- **Branch**: I did not create `council-synthesis-v1`. Working tree on `main` holds the proposed state. Suggested flow:
  ```
  git checkout -b council-synthesis-v1
  # apply commits per the sequence above
  ```
  Alternatively, stash the working tree, branch from `main`, pop, and commit.
- **No git or pnpm commands were executed** by me per the mission's hard rules.
- **GateGuard** fired for the first Bash and several new-file Writes; I satisfied the gate inline each time. The recovery path documented in the gate (`ECC_GATEGUARD=off`) was not invoked.
- **Substantive contributions**: 5 of 7 branches contributed adopted artifacts (`codex-final`, `replit`, `claude`, `perplexity`, `cursor`). `codex` and `u6f3g0-codex/locate-branches-and-their-code` were superseded by larger `codex-final` artifacts that occupy the same conceptual space; their core ideas (provider abstraction, welcome restructure) survive through `codex-final`'s equivalents.
- **Open questions**: 7 items above, all decision-ready.
- **Total proposed commits**: 10 (collapsible to 1).
- **Total files added/modified vs main**: ~56 entries reported by `git status`, expanding to ~90 actual files (the workbench, supabase, lib/v1, and components directories each contain multiple new files).
