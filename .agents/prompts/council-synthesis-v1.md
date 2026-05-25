# Mission: Synthesize seven council branches into `main` for v1

You are the lead synthesis agent for the `ui.plan.ai` repository — a dual-Astro site (main app at `/`, Starlight docs at `/docs/`) working toward **v1** as defined in `starlight/src/content/docs/v1-plan/`.

Seven branches have been produced in parallel by different LLMs/agents, all branched from `main`. They are intentionally divergent attempts at v1. Act as a council moderator: read all seven proposals, identify the best ideas across docs, agent skills, app code, specs, and configuration, and merge them into a single coherent update for `main`.

## Council branches (all on `origin`, all rooted in `main`)

| Branch | Files changed | Theme |
|---|---|---|
| `claude` | 27 | SETUP guide, `.env.example`, v1 app scaffold, OpenAPI polish, Problem-type anchors |
| `codex` | 8 | v1 app surfaces with local providers, welcome onboarding restructure |
| `codex-final` | 73 | Comprehensive "final codex" v1 cut |
| `cursor` | 46 | v1 shell aligned with contracts, discovery metadata, Cursor Cloud setup notes |
| `perplexity` | 12 | Home/404 polish, design tokens, JSON-LD, README synthesis, static-host portability docs |
| `replit` | 83 | Workbench inbox/frame-detail realtime, frame submission validation, role/config docs, version bumps |
| `u6f3g0-codex/locate-branches-and-their-code` | 15 | Provider contracts, handoff docs (builds on `codex`) |

For each branch, the primary inputs are:

- `git diff main..origin/<branch>`
- `git log --oneline main..origin/<branch>`
- `git diff --stat main..origin/<branch>` (overview)
- `git diff main..origin/<branch> -- <path>` (focused per area)

## Read first (non-negotiable)

Before reading any branch, read these in order:

1. `AGENTS.md`
2. `.agents/skills/branch-pr-workflow/SKILL.md`
3. `.agents/skills/git-commit/SKILL.md`
4. `.agents/skills/skills-maintenance/SKILL.md`
5. `.agents/skills/docs-architecture/SKILL.md`
6. `.agents/skills/dev-build/SKILL.md`
7. `.agents/skills/deployment/SKILL.md`
8. Every file in `starlight/src/content/docs/v1-plan/` (`scope`, `principles`, `workbench`, `data-model`, `auth-and-sessions`, `approval-and-api-keys`, `routing-and-tenancy`, `realtime-operations`, `media-and-delivery`, `settings`, `accessibility`, `performance-budgets`, `non-goals`, `agent-onboarding`).

The v1-plan files are the contract the synthesis must serve. When a branch contradicts the v1 plan, the v1 plan wins — unless the branch's idea is so clearly better that the v1 plan should be amended; in that case, amend the plan in the same commit as the implementing change.

## Hard rules (override any branch's choices)

If a branch violates these, do not adopt that part verbatim — port the underlying idea in a rule-compliant way.

- **pnpm only**, never `npm`/`yarn`. Node pinned to `24.15.0` via `.node-version`.
- **No GitHub Actions / CI** — local `pnpm check && pnpm build` is the pre-merge gate. Do not introduce workflows.
- **Do NOT run `pnpm dev` or `pnpm build`** — the user runs these.
- **Do NOT run any `git` command** — the user commits and pushes manually. Communicate proposed commits as a list of staged-file groups + commit messages; do not execute them.
- **Every commit bumps `version`** in the affected `package.json`(s) (root and/or `starlight/`). See `git-commit` skill.
- **Body markdown links use `/section/page/`** (the `remarkBaseLinks` plugin auto-prefixes to `/docs/...`). Exceptions that use the full `/docs/...` path: frontmatter URL fields (e.g. `hero.actions[].link`) and splash-template body markdown.
- **Trailing slash on all page URLs**, none on file URLs. Enforced via `trailingSlash: 'always'` and `build.format: 'directory'` in both `astro.config.mjs`.
- **`public/docs/` is generated** by `build:docs` and is `rm -rf`'d every build. Never edit by hand. Never commit it.
- **Favicons stay byte-identical** between `public/favicon.svg` and `starlight/public/favicon.svg`.
- **Astro versions pinned identically** across both `package.json`s.
- **`starlight/package.json#name = "starlight-docs"`** — the pnpm filter handle; do not rename.
- **No tests, no Prettier/ESLint, no `_headers`, no `wrangler.toml`, no root `sitemap.xml`, no `CHANGELOG.md`, no LICENSE, no CODEOWNERS** unless a branch deliberately introduces one with strong justification you choose to adopt.
- **No `/` → `/docs/` redirect**; `/docs/` 308-redirects to `/docs/start-here/welcome/`.
- After any structural change, audit `AGENTS.md` + skills for stale references **in the same commit** (`skills-maintenance` skill).

## Process

### Phase 1 — Orient

Read everything listed under "Read first". Internalize the v1 contract before opening any branch diff.

### Phase 2 — Per-branch inventory

For each of the seven branches, write a short structured note:

- **Diff scope** — file groups touched (docs / skills / `AGENTS.md` / specs / app / configs / scripts / assets).
- **Key ideas** — 3–7 bullets of what this branch contributes that `main` lacks.
- **Strengths** — what this branch does best.
- **Risks or rule violations** — what to drop or rework.
- **Reusable artifacts** — specific files or hunks worth porting verbatim.

### Phase 3 — Per-area synthesis decisions

Group all seven proposals by area and decide what `main` should adopt. For each decision record: **chosen source branch(es)**, **rejected alternatives**, **one-line reason**. Silence is not an answer — if nothing is adopted from a branch in an area, say so explicitly with one reason.

Areas:

1. **Starlight content** (`starlight/src/content/docs/**`) — welcome/onboarding, `v1-plan/*`, `foundations`, `specifications`, `api-reference`, `reference`, `roadmap-and-open-questions`. Pick the best narrative per page; reconcile overlaps.
2. **Static API contracts** (`starlight/public/specs/`) — adopt the most complete OpenAPI / Problem-type set (likely from `claude`).
3. **Agent docs** — `AGENTS.md` and `.agents/skills/**`. Adopt clarifications only where they improve agent behavior; keep wording crisp; do not bloat.
4. **Main app shell** (root `src/`, `public/`, `astro.config.mjs`) — v1 home, 404, workbench (auth-walled), public stream, providers, types, mock client. Reconcile competing scaffolds into one coherent shell honoring the v1-plan contracts.
5. **Setup surface** — `README.md`, `SETUP.md` (if introduced), `.env.example`. Land one canonical onboarding path (`claude` and `perplexity` contributed here).
6. **Design system / tokens / a11y / JSON-LD** — adopt `perplexity`'s polish where it does not fight the chosen app shell.
7. **Workbench realtime + frame submission** — adopt only the parts of `replit` that fit the v1 docs and do not introduce undocumented services or external dependencies.
8. **Provider contracts and handoff docs** — fold `u6f3g0-codex/locate-branches-and-their-code` and `cursor`'s contract alignment into the chosen app shell.

### Phase 4 — Implementation

Work on a **new branch** off `main` named `council-synthesis-v1` (do not modify `main` directly). Per `branch-pr-workflow` SKILL:

- Commit in small logical groups per area (docs, skills, specs, app shell, design tokens, env/setup, realtime, …).
- Every commit bumps the `version` in the affected `package.json`(s) per `git-commit` SKILL.
- Audit `AGENTS.md` + skills in the same commit when paths/names/scripts/ports change (`skills-maintenance` SKILL).
- Maintain favicon parity and Astro version parity.
- Obey link conventions and trailing-slash rules.
- Do not run `pnpm dev`, `pnpm build`, or any `git` command. Stage edits, prepare proposed commit messages, and hand off.

### Phase 5 — Report

Write `.agents/notes/council-synthesis-v1.md` (create the folder if needed) containing:

1. **Per-branch inventory** (Phase 2).
2. **Per-area decisions** as a bullet list, not a markdown table.
3. **Proposed commit sequence** — for each commit: branch path, files, one-line rationale, version bumps.
4. **Open questions** — anything you could not decide because of conflicting branch intent or missing information. Numbered, terse, decision-ready.
5. **Verification checklist** for the user — what to `pnpm check`, what to visually spot-check on `pnpm dev`, what to confirm in the v1-plan docs.

Then stop. The user will review, run `pnpm check && pnpm build` locally, and handle commits/PR per `branch-pr-workflow` SKILL.

## Tie-breaking criteria (when branches disagree)

Prefer the option that scores higher, in this order:

1. Faithfulness to `starlight/src/content/docs/v1-plan/`.
2. Compliance with `AGENTS.md` hard rules.
3. Clarity for both human and agent readers.
4. Cohesion — fewer competing concepts, one canonical path.
5. Minimal new dependencies and surface area.
6. Accessibility, performance, UX polish on user-facing surfaces.
7. Testability later, without introducing a test runner now.

## Output expectations

- One branch `council-synthesis-v1` with a clean sequence of staged commits (messages drafted, not executed).
- One synthesis report at `.agents/notes/council-synthesis-v1.md`.
- No `git` operations executed; no `pnpm dev`/`pnpm build` executed; no PR opened.
- A short final hand-off message summarizing: number of commits proposed, areas covered, branches that contributed substantively, open questions count.