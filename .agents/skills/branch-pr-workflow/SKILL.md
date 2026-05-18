---
name: branch-pr-workflow
description: How work flows from branch → preview → PR → main. Read before starting any change, opening a PR, choosing merge strategy, or pushing to the preview branch.
---

# Branch + PR workflow

GitHub Flow. One long-lived `main`; everything else short-lived.

## Branch naming

`<type>/<short-slug>` — type matches Conventional Commit types (`feat`, `fix`, `docs`, `chore`, `refactor`, `perf`, `test`, `build`, `ci`, `style`). Not enforced; consistent enough that branch listings are scannable.

```bash
git checkout -b feat/og-meta
git checkout -b fix/redirect-base
git checkout -b docs/new-skill
```

## Commit discipline

Per-commit Conventional Commits + per-commit version bump (see `git-commit` skill). **Rebase merge** preserves every commit on main, so each commit on a branch must already comply individually.

## Preview deploys

CF Pages auto-deploys main (production) and any branch named `preview` (preview URL). To preview a change before merging:

```bash
# from your feature branch:
git checkout preview
git reset --hard <feature-branch>     # or git merge --ff-only
git push origin preview               # CF deploys to the preview URL
```

Use only when needed — visual UI changes, redirect/_redirects changes, deploy-config changes. Routine code-only changes can skip preview and rely on local `pnpm preview` + CI.

The `preview` branch is disposable scratch — reset / force-push freely. Never merge `preview` into `main`.

## PR

```bash
gh pr create --base main --title "<type>: <subject>" --body "<see PR template>"
```

PR title must be a valid Conventional Commit (it ends up in main's log after rebase merge).

CI is `pull_request`-triggered — it auto-runs on every push to the PR. Branch protection requires the `build` job green before merge.

## Merge strategy: **rebase merge**

Set in repo settings → "Allow rebase merging" only. Why rebase, not squash:
- Preserves the per-commit version-bump cadence.
- Keeps Conventional Commit granularity in main's history.
- Linear history; no merge bubbles.

Before merging:
- Rebase the branch onto latest `main` locally (`git fetch && git rebase origin/main`) and re-push.
- Confirm CI is green.
- Click "Rebase and merge".
- Delete the branch (GitHub prompt does it; or `git push origin --delete <branch>`).

## CI on main

`push: branches: [main]` is **intentionally absent** from `.github/workflows/build.yml`. After a merge, click "Run workflow" on the GitHub Actions page if you want main verified. Rationale: PR CI already verified the merged content; main runs are opt-in.

If you want auto-CI on main back, add `push: branches: [main]` to the workflow's `on:`.

## Branch protection (dashboard, not in repo)

Required settings on `main`:
- Require status checks: `build` must be green.
- Require linear history (matches rebase-merge choice).
- Block direct pushes (force all changes through PR).

Enable *after* the first PR cycle has succeeded, otherwise you can lock yourself out.

## CF Pages deploy mapping (dashboard, not in repo)

- Production branch: `main` → `ui.plan.ai`.
- Preview deployments: limit to the `preview` branch (avoid burning builds on every feature branch).

## Local pre-push

```bash
pnpm check && pnpm build
```

Don't burn CI minutes on stuff that fails locally first.

## Hard rules

- Never push directly to `main` once branch protection is on.
- Never merge `preview` into `main`.
- Never `gh pr merge` without an explicit user ask — they decide when ready.
