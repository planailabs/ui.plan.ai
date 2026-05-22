# ui.plan.ai

Public site and documentation for `ui.plan.ai` — the next evolutionary step of the [plan.ai/ui](https://plan.ai/ui/) proof of concept, moving from a static archive into a Supabase-backed platform for agent-generated UI streams.

This repo is the static frontend: a marketing/home surface and the Starlight docs that explain the V1 platform. It does not include the Supabase project, the Agent API, or the workbench runtime — those are tracked under the V1 plan in the docs.

## Prerequisites

- **Node ≥ `24.15.0`** (pinned in `.node-version`; Cloudflare Pages reads the same file).
- **pnpm `11.1.2`**, pinned via `packageManager` in the root `package.json`. The simplest way to get the right version is Corepack:
  ```sh
  corepack enable
  corepack prepare pnpm@11.1.2 --activate
  ```
  `npm` and `yarn` are not supported and will silently break the docs build.
- Git.

No Supabase or Cloudflare credentials are needed to run, build, or preview the site locally.

## Quick start

```sh
git clone https://github.com/101design/ui.plan.ai.git
cd ui.plan.ai
pnpm install        # one install at the root sets up both projects
pnpm dev            # main app on :4321, docs on :4322/docs/
```

Open `http://localhost:4321/` for the main app and `http://localhost:4322/docs/` for the docs (the docs route under the main app at `:4321/docs/` is whatever was last built — use `:4322/docs/` for live editing).

## Local development

```sh
pnpm dev            # both projects, concurrently
pnpm dev:app        # main app only
pnpm dev:docs       # Starlight docs only
pnpm check          # astro check on both projects (pre-merge gate)
pnpm build          # ordered: docs → main; produces dist/
pnpm preview        # serves the merged dist/
```

Add dependencies with `pnpm add <pkg>` (main app) or `pnpm --filter starlight-docs add <pkg>` (Starlight). Always run `pnpm install` from the repo root.

## Branch policy and previews

- **`main` is protected.** Never push to it directly. Changes ship via feature branch → PR → **rebase merge** to `main`.
- **`preview`** is a disposable scratch branch wired to a Cloudflare Pages preview URL. Force-push your feature branch into `preview` to get a deploy preview before merging — `git push origin <branch>:preview --force`. Never merge `preview` into `main`.
- **Production** — Cloudflare Pages auto-deploys `main` to `ui.plan.ai`. Build command `pnpm build`, output directory `dist`, Node from `.node-version`. Other branches do not deploy automatically.
- Branch names: `<type>/<slug>` matching Conventional Commit types (`feat/`, `fix/`, `docs/`, …). Each commit is Conventional Commits + a `package.json` version bump (rebase merge preserves every commit on `main`).

## Pre-merge checks

There is no GitHub Actions CI on this repo. The pre-merge gate is local:

```sh
pnpm check && pnpm build
```

Cloudflare Pages rebuilds *after* merge to `main` (production) or push to `preview` (preview URL) — that's the only build pipeline.

## Detailed docs

The Starlight docs site is the canonical reference. Operational entry points:

- [Cloudflare Pages configuration](starlight/src/content/docs/reference/cloudflare-pages.md) — project settings, Node version, build pipeline, headers, redirects, preview deploys, troubleshooting. Live: [`/docs/reference/cloudflare-pages/`](https://ui.plan.ai/docs/reference/cloudflare-pages/).
- [Supabase setup](starlight/src/content/docs/reference/supabase-setup.md) — project setup, env vars, auth and data assumptions, storage layout, realtime, edge functions, setup checklist. Live: [`/docs/reference/supabase-setup/`](https://ui.plan.ai/docs/reference/supabase-setup/).
- [Welcome](starlight/src/content/docs/start-here/welcome.md) — product direction and how the docs are organized.
- [Platform architecture](starlight/src/content/docs/foundations/platform-architecture.md) — the Supabase / Cloudflare / Astro split.
- [Supabase SQL plan](starlight/src/content/docs/specifications/supabase-sql.md) — tables, enums, RLS, indexes for V1.
- [Auth & sessions](starlight/src/content/docs/v1-plan/auth-and-sessions.md) — browser auth and session rules.
- [API reference](starlight/src/content/docs/api-reference/index.md) — Agent API surface.
- [V1 plan](starlight/src/content/docs/v1-plan/scope.md) — what ships first.

## For coding agents

Read [`AGENTS.md`](./AGENTS.md) first — it's the agent-optimized entry point (toolchain, layout table, hard rules). Then load the skill that matches your task from [`.agents/skills/`](.agents/skills/):

| When you're about to… | Read |
|---|---|
| Start a branch, open a PR, push to `preview` | [`branch-pr-workflow`](.agents/skills/branch-pr-workflow/SKILL.md) |
| Run, troubleshoot, or change deps | [`dev-build`](.agents/skills/dev-build/SKILL.md) |
| Commit (mandatory version bump) | [`git-commit`](.agents/skills/git-commit/SKILL.md) |
| Touch routing, build pipeline, or layout | [`docs-architecture`](.agents/skills/docs-architecture/SKILL.md) |
| Change build output, Node/pnpm version, headers, redirects | [`deployment`](.agents/skills/deployment/SKILL.md) |
| Move/rename anything `AGENTS.md` references | [`skills-maintenance`](.agents/skills/skills-maintenance/SKILL.md) |

V1 doesn't use named "council" voices — it uses concrete agent **producer roles** carried as metadata on submissions and events: *frame producer*, *review assistant*, *media processor*, and (V2) *generation service*. See [Agent roles](./starlight/src/content/docs/reference/agent-roles.md).

---

## Repo layout

Two Astro projects in one pnpm workspace:

- **Main app** (`/`) — served at `ui.plan.ai/`
- **Starlight docs** (`starlight/`) — served at `ui.plan.ai/docs/`

The main app's `astro build` sweeps the docs build into a single merged `dist/`.
