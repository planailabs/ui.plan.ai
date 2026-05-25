# ui.plan.ai

Two Astro projects in one pnpm workspace:

- **Main app** (`/`) — served at `ui.plan.ai/`
- **Starlight docs** (`starlight/`) — served at `ui.plan.ai/docs/`

The main app's `astro build` sweeps the docs build into a single merged `dist/`.

The current V1 shell also includes:

- Public stream fixtures at `/streams/` and generated dated stream routes.
- Static workbench preview at `/workbench/`.
- Machine-readable integration status at `/v1-status.json`.
- Supabase migrations, seed data, and Deno Edge Function source under `supabase/`.

## Quickstart

```sh
pnpm install        # one install at root sets up both
pnpm dev            # main on :4321, docs on :4322/docs/
pnpm build          # ordered: docs → main; produces dist/
pnpm check          # checks docs, then app
pnpm preview        # serves merged dist/
```

Requires Node ≥24.15 (pinned to `24.15.0` in `.node-version`) and pnpm.

## Deployment

Cloudflare Pages, GitHub-connected. Build command `pnpm build`, output dir `dist`.

## For AI agents

See [`AGENTS.md`](./AGENTS.md). Detailed skills in [`.agents/skills/`](.agents/skills/).
