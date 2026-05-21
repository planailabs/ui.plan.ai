# starlight-docs

Starlight project for the ui.plan.ai documentation, served at `ui.plan.ai/docs/`.

See the [root README](../README.md) for full setup. This subproject is built and copied into `public/docs/` by the root `pnpm build`.

## Per-side commands

```sh
pnpm --filter starlight-docs dev      # local dev, :4322/docs/
pnpm --filter starlight-docs build    # build to starlight/dist/
pnpm --filter starlight-docs check    # astro check
```

## Content

Markdown files live under `src/content/docs/`. The sidebar autogenerates from the section directories — see `astro.config.mjs` for the ten sections.

Static API contract files (OpenAPI + JSON schemas) live under `public/specs/` and serve at `/docs/specs/`.

For docs conventions, structure, and stability tags, see [reading these docs](https://ui.plan.ai/docs/start-here/reading-these-docs/) and [stability tags](https://ui.plan.ai/docs/start-here/stability-tags/).
