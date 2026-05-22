# ui.plan.ai

Two Astro projects in one pnpm workspace:

- **Main app** (`/`) — served at `ui.plan.ai/`
- **Starlight docs** (`starlight/`) — served at `ui.plan.ai/docs/`

The main app's `astro build` sweeps the docs build into a single merged `dist/`.

## Setup

### For people

1. Install [Node ≥ 24.15](https://nodejs.org/) (this repo pins `24.15.0` in `.node-version`; `nvm`/`fnm`/Volta will auto-pick it up).
2. Install pnpm (`corepack enable && corepack prepare pnpm@latest --activate`, or follow [pnpm install docs](https://pnpm.io/installation)).
3. From the repo root:

   ```sh
   pnpm install        # one install at root sets up both projects
   pnpm dev            # main on http://localhost:4321, docs on http://localhost:4322/docs/
   pnpm build          # ordered: docs → main; produces dist/
   pnpm preview        # serves merged dist/
   pnpm check          # astro check on both projects (pre-merge gate)
   ```

4. Edit docs at `:4322/docs/` (live HMR). `:4321/docs/` is whatever was last built and is stale until you re-run `pnpm build:docs`.

Configuring the platform itself (Supabase project, Cloudflare Pages, Images, Stream)? Start at the published docs:

- **[Upstream docs](https://ui.plan.ai/docs/reference/upstream-docs/)** — deep links to the latest official Supabase and Cloudflare configuration pages V1 depends on.
- **[Secrets & environments](https://ui.plan.ai/docs/reference/secrets-and-environments/)** — env matrix and where each secret is bound.
- **[Platform architecture](https://ui.plan.ai/docs/foundations/platform-architecture/)** — the Supabase + Cloudflare split.

### For agents

You are working inside this repo. Read in this order before editing:

1. [`AGENTS.md`](./AGENTS.md) — toolchain, layout, hard rules.
2. [`.agents/skills/dev-build/SKILL.md`](./.agents/skills/dev-build/SKILL.md) — how to run dev, add deps, troubleshoot.
3. [`.agents/skills/docs-architecture/SKILL.md`](./.agents/skills/docs-architecture/SKILL.md) — file layout, build pipeline, link conventions.
4. [`.agents/skills/git-commit/SKILL.md`](./.agents/skills/git-commit/SKILL.md) — commit procedure, mandatory `package.json` version bump.
5. [`.agents/skills/branch-pr-workflow/SKILL.md`](./.agents/skills/branch-pr-workflow/SKILL.md) — branches, preview, PRs, merge strategy.
6. [`.agents/skills/deployment/SKILL.md`](./.agents/skills/deployment/SKILL.md) — Cloudflare Pages build/headers/redirects.
7. [`.agents/skills/skills-maintenance/SKILL.md`](./.agents/skills/skills-maintenance/SKILL.md) — keep these docs in sync with the code.

For Agent API and platform contracts, read the docs at [ui.plan.ai/docs/](https://ui.plan.ai/docs/):

- [Agent API quickstart](https://ui.plan.ai/docs/api-reference/) → [Frame submission contract](https://ui.plan.ai/docs/specifications/frame-submission/) → [Media ingest](https://ui.plan.ai/docs/specifications/media-ingest/) → [Supabase SQL plan](https://ui.plan.ai/docs/specifications/supabase-sql/).
- [Upstream docs](https://ui.plan.ai/docs/reference/upstream-docs/) is the single jumping-off page for the latest Supabase and Cloudflare configuration references.

## Deployment

Cloudflare Pages, GitHub-connected. Build command `pnpm build`, output dir `dist`. See [`.agents/skills/deployment/SKILL.md`](./.agents/skills/deployment/SKILL.md) for the Pages config, headers, redirects, and the `site:` URL.

## Project layout

| Project | Path | URL | Dev port |
|---|---|---|---|
| Main app | `/` | `/` | `:4321` |
| Starlight docs | `/starlight/` | `/docs/` | `:4322` |
