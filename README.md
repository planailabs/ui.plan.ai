# ui.plan.ai

Two Astro projects in one pnpm workspace:

- **Main app** (`/`) — served at `ui.plan.ai/`
- **Starlight docs** (`starlight/`) — served at `ui.plan.ai/docs/`

The main app's `astro build` sweeps the docs build into a single merged `dist/`.

## Quickstart

```sh
pnpm install        # one install at root sets up both
pnpm dev            # main on :4321, docs on :4322/docs/
pnpm build          # ordered: docs → main; produces dist/
pnpm preview        # serves merged dist/
```

Requires Node ≥24.15 (pinned to `24.15.0` in `.node-version`) and pnpm.

## Deployment

Cloudflare Pages serves the static Astro output from `dist`.

| Setting | Value |
|---|---|
| Build command | `pnpm build` |
| Build output directory | `dist` |
| Root directory | `/` |
| Node version | `24.15.0` from `.node-version` |

The V1 product backend is planned for Supabase Auth, Postgres, Storage, Realtime, and Edge Functions, with Cloudflare Images/Stream for media delivery. Start from `env.example`, `config/project.config.json.example`, and the [V1 setup checklist](./starlight/src/content/docs/process/v1-setup.md) when those accounts are available.

The root app emits `/sitemap.xml` for public app routes and `/v1-status.json` as a machine-readable snapshot of the current static shell.

## For AI agents

See [`AGENTS.md`](./AGENTS.md). Detailed skills in [`.agents/skills/`](.agents/skills/).
