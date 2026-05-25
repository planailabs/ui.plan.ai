# Final Branch Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use `superpowers:subagent-driven-development` or `superpowers:executing-plans` to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the final V1-ready site/app branch named `codex-final` by combining the strongest work from the Claude, Codex, Cursor, Perplexity, and Replit branches without inheriting their avoidable defects.

**Architecture:** Keep the root Astro app static and buildable first. Use local fixtures and provider interfaces for public streams and the workbench preview, then add Supabase/Cloudflare source artifacts behind clear boundaries so `pnpm check && pnpm build` remains green. Treat the current `main` branch as the base and selectively port code, not raw merge commits.

**Tech Stack:** Astro 6, Starlight, pnpm workspaces, TypeScript strict mode, optional Supabase/Cloudflare source artifacts, Cloudflare Pages static deployment.

---

## Validation Status

Validated on 2026-05-24 against the current repo rules in `AGENTS.md`, `docs-architecture`, `deployment`, `dev-build`, `skills-maintenance`, and `branch-pr-workflow`.

Validation fixes applied:

- Renamed the target branch throughout from `final` to `codex-final`.
- Removed the destructive reset step from the branch bootstrap task.
- Quoted bracketed route paths in shell commands so zsh does not treat `[agentSlug]` as a glob.
- Kept `_headers` and root `sitemap.xml` as explicit decision points because they change documented deployment invariants.
- Kept Supabase Edge Functions isolated from root Astro typechecking because the Replit branch currently fails `pnpm check` when Deno files are included.

Validated recommendations:

- Start from `origin/main`; hand-port selected branch work instead of merge-chaining branch heads.
- Use Perplexity for home/404, Cursor for static app shell/routes/status JSON, Claude for contract depth/client architecture, Codex for provider split/handoff, and Replit for backend/docs artifacts after Deno isolation.
- Maintain the repo's local gate: `pnpm check && pnpm build`.
- Do not push `codex-final` unless explicitly asked.

## Evidence Base

Inspected branches:

| Branch | Model | Commits over `main` | Changed files | Local gate |
|---|---:|---:|---:|---|
| `claude` | Claude | 5 | 27 | PASS |
| `codex` | Codex | 2 | 8 | PASS |
| `u6f3g0-codex/locate-branches-and-their-code` | Codex hardening PR | 1 over `codex` | 13 | PASS, GitHub PR #21 CLEAN |
| `cursor` | Cursor | 8 | 46 | PASS |
| `perplexity` | Perplexity | 8 | 12 | PASS |
| `replit` | Replit | 11 | 83 | FAIL |

Verification commands run:

```bash
git fetch --all --prune
for b in claude codex cursor perplexity replit; do
  git switch "$b"
  pnpm install --frozen-lockfile
  pnpm check
  pnpm build
done
git switch codex-final
```

`replit` failed `pnpm check` with 53 TypeScript errors. Main causes:

- `supabase/functions/**` is included by root `tsconfig.json` and Astro checks it as normal TypeScript, so Deno globals such as `Deno` are undefined.
- `src/pages/workbench/login.astro` has nullable DOM handles and untyped `challenge` state.
- `src/pages/workbench/frames/[id].astro` has an unused `@ts-expect-error`.

Pairwise `git merge-tree --write-tree` checks show every meaningful combination has conflicts. Common conflict files are `README.md`, `package.json`, `starlight/package.json`, `src/pages/index.astro`, `src/pages/workbench/index.astro`, `starlight/src/content/docs/start-here/welcome.md`, and `starlight/src/content/docs/api-reference/submission-status.md`. The final branch should be hand-integrated, not merge-chained.

## Council Verdict

### Claude

**Best work:** API contract depth and a clean mock-client architecture.

Claude added the strongest contract surface: a much fuller `starlight/public/specs/v1-agent-api.openapi.yaml`, error anchors, typed domain objects in `src/lib/types.ts`, a `PlanAiClient` provider boundary in `src/lib/client.ts`, mock fixtures, and dynamic public routes for `/{agent_slug}/{yyyymmdd}/` and `/{agent_slug}/{channel_slug}/{yyyymmdd}/`.

**Use in final:**

- The OpenAPI expansion and error-anchor work.
- The idea of a single client/provider boundary.
- Mock fixtures that mirror the real V1 domain.
- Dynamic public stream route behavior.
- The auth-wall concept for workbench preview pages.

**Do not copy blindly:**

- The whole homepage. It is useful but less polished than Perplexity and less complete as an app shell than Cursor.
- The production setup guide as-is. It says email plus OAuth is typical, while later Replit docs correctly narrow V1 to email OTP and MFA.
- The exact alias-heavy file layout unless the final codebase commits to those aliases in `tsconfig.json`.

### Codex

**Best work:** Minimal runnable scaffold and focused provider-contract split.

Codex made the smallest passing app addition: a local V1 data seed, `/api/v1/frames`, `/public/`, and `/workbench/`. The follow-up PR improves that into `v1.types.ts`, `v1.contracts.ts`, `v1.local.ts`, `v1.supabase.stub.ts`, and `config.ts`, plus a concise handoff document.

**Use in final:**

- The modular repository split from the hardening PR.
- The API envelope pattern: success `{ data: ... }`, failure `{ error: { code, message } }`.
- The small handoff checklist as a seed for implementation notes.

**Do not copy blindly:**

- The original `codex` branch's one-file `src/lib/v1.ts`; use the hardened PR split instead.
- Its simplified status/type vocabulary. Claude/Cursor/Replit cover the real V1 state machine better.
- The bare inline-styled pages as the final UI.

### Cursor

**Best work:** Best passing static app shell and machine-readable status.

Cursor added a coherent static V1 shell: shared `BaseLayout`, `AppNav`, `FrameCard`, `StatusPill`, `StreamHeader`, rich fixture data, `/streams/`, dynamic public stream routes, `/workbench/`, `/v1-status.json`, and root sitemap support. It also added a practical setup checklist and config examples.

**Use in final:**

- The public streams index and route implementation shape.
- `/v1-status.json` as a contract/status affordance.
- The richer fixture data and enum lists.
- The shared component/layout direction, after reducing oversized radii and aligning it with the existing visual system.
- The setup checklist structure.

**Do not copy blindly:**

- New root sitemap behavior until it is reconciled with the current repo rule that Starlight's `/docs/sitemap-index.xml` is the only sitemap.
- Agent docs/skills edits without a stale-reference audit.
- The exact `src/data/v1Demo.ts` type casing if final adopts Claude/Codex provider types.

### Perplexity

**Best work:** Strongest public-facing home/404 polish and static-hosting docs.

Perplexity focused on the public site. Its `src/pages/index.astro` has the best narrative, metadata, JSON-LD, accessibility polish, reduced-motion handling, and visual hierarchy. Its 404 page is the best recovery experience. It also added useful static-hosting and Cloudflare Pages documentation.

**Use in final:**

- Homepage narrative and metadata/JSON-LD strategy.
- 404 page recovery copy and styling.
- Static hosting and Cloudflare Pages docs, adapted to this repo's current deployment rules.
- Submission-status enum clarification.
- Optional `_headers` baseline only if AGENTS and deployment skills are updated in the same commit.

**Do not copy blindly:**

- It does not build app/product surfaces beyond home and 404.
- It adds `_headers`, while current `AGENTS.md` says no `_headers` file exists. Including it is a deployment-policy decision, not an automatic merge.
- It should not replace the dynamic stream/workbench work from Claude/Cursor.

### Replit

**Best work:** Deepest real Supabase/Cloudflare backend thinking.

Replit went farthest into production infrastructure: Supabase migrations, RLS-minded data model, seed data, Edge Functions for frame submissions/media uploads/status/webhooks/team invitations, browser Supabase auth helpers, realtime subscriptions, workbench pages, setup skills, and comprehensive wiring docs.

**Use in final:**

- Supabase migrations and seed as the strongest concrete data-model candidate.
- Wiring guide, secrets/environment matrix, upstream-docs references, and Realtime/workbench planning docs.
- Realtime event mapping concepts.
- Edge Function implementation ideas, after isolating Deno from Astro typechecking.
- Workbench IA: inbox, frame detail, API keys, team, settings.

**Do not copy blindly:**

- The branch currently fails the local gate.
- `supabase/functions/**` cannot remain inside root Astro typechecking without a Deno-specific plan.
- Workbench login script needs strict DOM typing fixes.
- The full live workbench depends on credentials and should not replace a buildable static preview in the first final pass.

## Recommended Final Direction

Use a layered final:

1. **Public site:** Perplexity homepage and 404, with Cursor/Claude links to real app surfaces.
2. **Static product shell:** Cursor routes/components/status JSON, using a provider boundary inspired by Claude and Codex.
3. **Contracts:** Claude OpenAPI and error docs, reconciled with Cursor/Replit enum docs.
4. **Workbench preview:** Cursor's passing preview plus Claude's auth-wall semantics and Replit's IA labels.
5. **Backend readiness:** Replit migrations, seed, docs, and Edge Function source included only after root check remains green by excluding or separately configuring Deno files.
6. **Docs/setup:** Merge Cursor setup checklist, Perplexity static-hosting docs, Replit wiring/secrets/upstream docs, and the Codex handoff.

No blocking question is required before drafting the plan. The main product decision is whether `codex-final` should include live Supabase browser behavior immediately. Recommendation: **not initially**. Ship a passing static shell plus backend source artifacts; wire live behavior after credentials and Deno verification are available.

## Files To Create Or Modify

Primary app:

- Modify: `src/pages/index.astro`
- Modify: `src/pages/404.astro`
- Create: `src/layouts/BaseLayout.astro`
- Create: `src/components/AppNav.astro`
- Create: `src/components/FrameCard.astro`
- Create: `src/components/StatusPill.astro`
- Create: `src/components/StreamHeader.astro`
- Create: `src/lib/v1/types.ts`
- Create: `src/lib/v1/contracts.ts`
- Create: `src/lib/v1/local.ts`
- Create: `src/lib/v1/index.ts`
- Create: `src/lib/v1/streamResolver.ts`
- Create: `src/lib/runtimeConfig.ts`
- Create: `src/pages/streams/index.astro`
- Create: `src/pages/[agentSlug]/[dateKey]/index.astro`
- Create: `src/pages/[agentSlug]/[channelSlug]/[dateKey]/index.astro`
- Create: `src/pages/workbench/index.astro`
- Create: `src/pages/v1-status.json.ts`

Optional app, only if root sitemap is approved:

- Create: `src/pages/sitemap.xml.ts`
- Modify: `public/robots.txt`
- Modify: `AGENTS.md`
- Modify: `.agents/skills/deployment/SKILL.md`

Optional deployment hardening, only if `_headers` is approved:

- Create: `public/_headers`
- Modify: `AGENTS.md`
- Modify: `.agents/skills/deployment/SKILL.md`
- Modify: `.agents/skills/docs-architecture/SKILL.md`

Contracts and docs:

- Modify: `starlight/public/specs/v1-agent-api.openapi.yaml`
- Modify: `starlight/src/content/docs/api-reference/errors.md`
- Modify: `starlight/src/content/docs/api-reference/submission-status.md`
- Modify: `starlight/src/content/docs/api-reference/realtime-events.md`
- Modify: `starlight/src/content/docs/specifications/data-model.md`
- Modify: `starlight/src/content/docs/specifications/realtime-events.md`
- Modify: `starlight/src/content/docs/specifications/supabase-sql.md`
- Modify: `starlight/src/content/docs/start-here/welcome.md`
- Create: `starlight/src/content/docs/process/v1-setup.md`
- Create: `starlight/src/content/docs/reference/cloudflare-pages.md`
- Create: `starlight/src/content/docs/reference/static-hosting.md`
- Create: `starlight/src/content/docs/reference/secrets-and-environments.md`
- Create: `starlight/src/content/docs/reference/upstream-docs.md`
- Create: `starlight/src/content/docs/v1-plan/wiring-supabase-cloudflare.md`
- Create: `docs-v1-handoff.md`
- Modify: `README.md`
- Create or modify: `.env.example`

Supabase/backend readiness:

- Create: `supabase/config.toml`
- Create: `supabase/migrations/20260522000000_init.sql`
- Create: `supabase/migrations/20260522000001_api_keys_view.sql`
- Create: `supabase/seed.sql`
- Create: `supabase/functions/**`
- Modify: `tsconfig.json`
- Modify: `package.json`
- Modify: `pnpm-lock.yaml`

Version bumps:

- Modify: `package.json`
- Modify: `starlight/package.json`

## Implementation Plan

### Task 1: Bootstrap `codex-final` From Current `main`

- [ ] Confirm no uncommitted work except this plan if the implementation is starting from scratch.

```bash
git status --short --branch
```

Expected: branch is `codex-final`; only this plan file may be modified.

- [ ] Create `codex-final` from the current remote `main` if it does not exist yet.

```bash
git fetch --all --prune
git switch -c codex-final origin/main
```

Expected: `codex-final` points at the current `origin/main` tip. If a local `final` or `codex/final` branch already exists only as an uncommitted planning branch, rename it instead:

```bash
git branch -m final codex-final
# or:
git branch -m codex/final codex-final
```

Expected: local `codex` remains the tracking branch for `origin/codex`; `codex-final` points at `main`.

### Task 2: Establish The Shared V1 Domain Boundary

- [ ] Create `src/lib/v1/types.ts` by combining Claude's API-aligned types with Cursor's richer fixture concepts.

Use snake_case for API/data-model fields and keep these enum values:

```ts
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
export type FrameMediaStatus = 'received' | 'media_processing' | 'ready' | 'failed';
export type LicenseIntent = 'cc0' | 'non_cc0' | 'third_party' | 'unknown';
export type TenantRole = 'owner' | 'admin' | 'member' | 'viewer';
```

- [ ] Create `src/lib/v1/contracts.ts` with a single provider interface inspired by Claude and Codex.

Required methods:

```ts
export interface V1Repository {
  listTenants(): Promise<Tenant[]>;
  listAgents(): Promise<Agent[]>;
  getAgent(slug: string): Promise<Agent | null>;
  listChannels(agentId: string): Promise<AgentChannel[]>;
  getChannel(agentId: string, slug: string): Promise<AgentChannel | null>;
  listPublicStreams(): Promise<ResolvedStream[]>;
  resolvePublicStream(input: {
    agentSlug: string;
    dateKey: string;
    channelSlug?: string;
  }): Promise<ResolvedStream | null>;
  listWorkbenchFrames(): Promise<FrameRecord[]>;
  listApiKeys(tenantId: string): Promise<ApiKey[]>;
}
```

- [ ] Create `src/lib/v1/local.ts` from Claude/Cursor fixtures.

Acceptance criteria:

- Fixtures include at least two agents, one main channel, one named channel, promoted frames, a `needs_review` frame, a `waiting_for_upload` frame, and a failed media example.
- Public stream resolution returns only promoted frames.
- Workbench resolution can show non-promoted submissions.

- [ ] Create `src/lib/v1/index.ts`.

```ts
import { localV1Repository } from './local';

export * from './types';
export * from './contracts';

export const v1Repository = localV1Repository;
```

- [ ] Run the app check.

```bash
pnpm check:app
```

Expected: 0 errors.

- [ ] Version bump and commit.

```bash
pnpm version patch --no-git-tag-version
git add package.json src/lib/v1
git commit -m "feat: add v1 provider boundary"
```

### Task 3: Build The Shared UI Shell

- [ ] Create `src/layouts/BaseLayout.astro` from Cursor's layout, but keep card radii at 8px or less unless an existing component requires otherwise.

Required behavior:

- `<title>`, description meta, canonical link.
- favicon links.
- dark theme tokens.
- skip link.
- noindex support for workbench preview.

- [ ] Create `src/components/AppNav.astro`, `StatusPill.astro`, `StreamHeader.astro`, and `FrameCard.astro`.

Use Cursor's component responsibilities and Claude's simpler mock-client readability. Keep `FrameCard` able to render:

- title
- summary or alt text
- submission status
- media status
- license intent
- click zones
- event history in compact mode

- [ ] Run:

```bash
pnpm check:app
pnpm build:app
```

Expected: 0 errors, app build succeeds.

- [ ] Version bump and commit.

```bash
pnpm version patch --no-git-tag-version
git add package.json src/layouts/BaseLayout.astro src/components
git commit -m "feat: add v1 app shell components"
```

### Task 4: Integrate Public Streams

- [ ] Create `src/pages/streams/index.astro` from Cursor.
- [ ] Create `src/pages/[agentSlug]/[dateKey]/index.astro` from Cursor, wired to `v1Repository`.
- [ ] Create `src/pages/[agentSlug]/[channelSlug]/[dateKey]/index.astro` from Cursor, wired to `v1Repository`.
- [ ] Preserve Claude's not-found handling for missing agents/channels where possible.
- [ ] Use trailing slashes in all hrefs.

Expected static routes after build include:

- `/streams/`
- `/{agentSlug}/{dateKey}/`
- `/{agentSlug}/{channelSlug}/{dateKey}/`

- [ ] Run:

```bash
pnpm check:app
pnpm build:app
```

Expected: 0 errors and generated stream routes.

- [ ] Version bump and commit.

```bash
pnpm version patch --no-git-tag-version
git add package.json src/pages/streams 'src/pages/[agentSlug]'
git commit -m "feat: add public v1 stream routes"
```

### Task 5: Integrate Homepage And 404

- [ ] Replace `src/pages/index.astro` with Perplexity's narrative and metadata direction.
- [ ] Add links to the final stream routes, workbench preview, V1 setup checklist, and API reference.
- [ ] Replace `src/pages/404.astro` with Perplexity's route-aware recovery page.
- [ ] Keep homepage visual palette restrained: black canvas, cyan/green accents, no decorative blobs, no marketing-card nesting.

Required homepage sections:

- Product name and literal category: `ui.plan.ai` and agent-generated UI streams.
- Submit/review/publish pipeline.
- Audience links for agents, viewers, and integrators.
- Version path: V1, V2, V3.
- Links to `/streams/`, `/workbench/`, `/docs/api-reference/`, and `/docs/start-here/welcome/`.

- [ ] Run:

```bash
pnpm check:app
pnpm build:app
```

Expected: 0 errors.

- [ ] Version bump and commit.

```bash
pnpm version patch --no-git-tag-version
git add package.json src/pages/index.astro src/pages/404.astro
git commit -m "feat: polish public home and recovery pages"
```

### Task 6: Add Workbench Preview

- [ ] Create `src/pages/workbench/index.astro` from Cursor's passing workbench preview.
- [ ] Add Claude's auth-wall semantics as a visible "preview only, auth later" state without pretending live auth is wired.
- [ ] Add Replit's IA labels as disabled or preview-only sections: Inbox, Channels, Agents, API keys, Approval, Team, Settings.
- [ ] Do not import `@supabase/supabase-js` in this task.

Acceptance criteria:

- `/workbench/` builds statically.
- It shows review queue, current frame detail, summary counts, approval-policy summary, and API-key prefix metadata.
- It links to relevant V1 docs.
- It has `noindex`.

- [ ] Run:

```bash
pnpm check:app
pnpm build:app
```

Expected: 0 errors.

- [ ] Version bump and commit.

```bash
pnpm version patch --no-git-tag-version
git add package.json src/pages/workbench/index.astro
git commit -m "feat: add v1 workbench preview"
```

### Task 7: Add Machine-Readable V1 Status

- [ ] Create `src/pages/v1-status.json.ts` from Cursor.
- [ ] Wire it to `v1Repository`.
- [ ] Include:

```json
{
  "name": "ui.plan.ai v1 static shell",
  "mode": "static-fixture",
  "status": "ready-for-backend-wiring"
}
```

- [ ] Include route links, contract links, canonical enum values, counts, public routes, and backend boundary notes.
- [ ] Do not add root `sitemap.xml` in this task unless explicitly approved.

- [ ] Run:

```bash
pnpm check:app
pnpm build:app
```

Expected: `/v1-status.json` is generated and valid JSON.

- [ ] Version bump and commit.

```bash
pnpm version patch --no-git-tag-version
git add package.json src/pages/v1-status.json.ts
git commit -m "feat: expose v1 status metadata"
```

### Task 8: Merge API Contract And Docs

- [ ] Start with Claude's `starlight/public/specs/v1-agent-api.openapi.yaml`.
- [ ] Reapply Cursor/Replit/Perplexity changes for submission-status enums and realtime naming.
- [ ] Preserve Claude's `Retry-After` response/header documentation and Problem type URL anchors.
- [ ] Update `starlight/src/content/docs/api-reference/errors.md` to include anchors matching the Problem schema type URLs.
- [ ] Update `starlight/src/content/docs/api-reference/submission-status.md` so every enum in code, OpenAPI, and docs matches:

```text
received
waiting_for_upload
media_processing
needs_review
team_visible
promotion_eligible
promoted
rejected
failed
```

- [ ] Run:

```bash
pnpm check:docs
pnpm build:docs
```

Expected: 0 errors.

- [ ] Version bump and commit.

```bash
pnpm --filter starlight-docs version patch --no-git-tag-version
git add starlight/package.json starlight/public/specs/v1-agent-api.openapi.yaml starlight/src/content/docs/api-reference/errors.md starlight/src/content/docs/api-reference/submission-status.md
git commit -m "docs: reconcile v1 api contract"
```

### Task 9: Add Setup, Handoff, And Hosting Docs

- [ ] Create `docs-v1-handoff.md` from the Codex hardening PR, expanded with Claude/Cursor/Replit source-of-truth links.
- [ ] Create `starlight/src/content/docs/process/v1-setup.md` from Cursor.
- [ ] Create `starlight/src/content/docs/reference/static-hosting.md` and `starlight/src/content/docs/reference/cloudflare-pages.md` from Perplexity.
- [ ] Create `starlight/src/content/docs/reference/secrets-and-environments.md`, `starlight/src/content/docs/reference/upstream-docs.md`, and `starlight/src/content/docs/v1-plan/wiring-supabase-cloudflare.md` from Replit.
- [ ] Use `/section/page/` links in normal docs body markdown, not `/docs/...`, unless the page uses splash-template markdown or frontmatter URL fields.
- [ ] Update README with a concise V1 section and links to the docs.

- [ ] Run:

```bash
pnpm check:docs
pnpm build:docs
```

Expected: 0 errors.

- [ ] Version bump both packages because this touches root docs and Starlight.

```bash
pnpm version patch --no-git-tag-version
pnpm --filter starlight-docs version patch --no-git-tag-version
git add package.json starlight/package.json README.md docs-v1-handoff.md starlight/src/content/docs/process/v1-setup.md starlight/src/content/docs/reference starlight/src/content/docs/v1-plan/wiring-supabase-cloudflare.md
git commit -m "docs: add v1 setup and integration handoff"
```

### Task 10: Add Supabase Source Artifacts Safely

- [ ] Copy Replit's `supabase/config.toml`, migrations, and `seed.sql`.
- [ ] Copy Replit's Edge Function source only if root typechecking is protected.
- [ ] Modify root `tsconfig.json` to exclude Deno-specific function code from Astro checks:

```json
{
  "extends": "astro/tsconfigs/strict",
  "include": [".astro/types.d.ts", "**/*"],
  "exclude": ["dist", "public/docs", "starlight", "supabase/functions"]
}
```

- [ ] Add a `supabase/functions/deno.json` file for future Deno checks:

```json
{
  "compilerOptions": {
    "strict": true,
    "lib": ["deno.ns", "deno.window", "dom", "dom.iterable", "esnext"]
  },
  "imports": {
    "@supabase/supabase-js": "npm:@supabase/supabase-js@2"
  }
}
```

- [ ] Keep `@supabase/supabase-js` out of root `package.json` unless browser workbench code imports it in this same commit.
- [ ] Run:

```bash
pnpm check
pnpm build
```

Expected: root and docs pass. Deno functions are present as source artifacts but are not claimed as verified until a Deno check is added.

- [ ] Version bump both packages if Starlight docs are touched, root only if just `supabase/**` and `tsconfig.json`.

```bash
pnpm version patch --no-git-tag-version
git add package.json tsconfig.json supabase
git commit -m "feat: add supabase v1 source artifacts"
```

### Task 11: Decide On Deployment Headers And Root Sitemap

This task needs an explicit product/deployment decision before implementation.

Recommended default:

- Include `public/_headers` from Perplexity only if the team wants security/cache headers now.
- Do not add root `sitemap.xml` until the main app has enough public route stability to justify it.

If `_headers` is approved:

- [ ] Create `public/_headers`.
- [ ] Update `AGENTS.md` to remove the "No `_headers` file" known-absent statement.
- [ ] Update `.agents/skills/deployment/SKILL.md`.
- [ ] Update `.agents/skills/docs-architecture/SKILL.md` if it mentions public output structure.
- [ ] Run:

```bash
pnpm check
pnpm build
```

Expected: `_headers` lands in `dist/_headers`, and all checks pass.

- [ ] Version bump both packages and commit:

```bash
pnpm version patch --no-git-tag-version
pnpm --filter starlight-docs version patch --no-git-tag-version
git add package.json starlight/package.json public/_headers AGENTS.md .agents/skills
git commit -m "build: add static hosting headers"
```

### Task 12: Final Reconciliation Gate

- [ ] Verify no branch conflict markers remain.

```bash
rg -n '^(<<<<<<<|=======|>>>>>>>)' .
```

Expected: no matches.

- [ ] Verify no forbidden generated docs were hand-added.

```bash
git status --ignored --short public/docs dist | sed -n '1,120p'
```

Expected: generated `public/docs/` and `dist/` are ignored, not staged.

- [ ] Run the full gate:

```bash
pnpm check && pnpm build
```

Expected: 0 errors. Existing Starlight `z` deprecation hints are acceptable only if still categorized as hints.

- [ ] Compare `codex-final` against source branches.

```bash
git diff --stat main..codex-final
git log --oneline --decorate main..codex-final
```

Expected: `codex-final` contains curated work from all branches, not raw merge commits.

- [ ] Push only when asked.

```bash
git push -u origin codex-final
```

Expected: remote `codex-final` branch exists. Do not run this without explicit user approval.

## Key Decisions To Confirm Before Implementation

1. **Live Supabase now or later:** Recommendation is later. Include Replit migrations/docs/source artifacts now, but keep the shipped app in static fixture mode until credentials and Deno verification are available.
2. **`public/_headers`:** Recommendation is yes if the team wants a security/cache baseline now; no if the current "no custom headers" repo invariant should remain.
3. **Root `sitemap.xml`:** Recommendation is no for the first final pass unless root app public routes are considered stable.
4. **Homepage source:** Recommendation is Perplexity for public narrative, with links into Cursor/Claude app surfaces.
5. **Provider boundary:** Recommendation is Claude/Codex hybrid: Codex file split, Claude method breadth, Cursor fixture richness.

## Model Awards

- **Best API contract:** Claude.
- **Best static app shell:** Cursor.
- **Best public narrative and polish:** Perplexity.
- **Best backend ambition and real platform design:** Replit.
- **Best minimal integration and handoff discipline:** Codex.
- **Best direct merge candidate:** Cursor or Claude.
- **Best final foundation:** A hand integration: Perplexity home/404 + Cursor shell/routes/status + Claude contracts/client + Codex provider split/handoff + Replit backend/docs selectively.
