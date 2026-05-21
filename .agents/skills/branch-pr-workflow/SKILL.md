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

No GitHub Actions CI runs on PRs. Verification is local (see "Local pre-push" below); CF Pages builds happen on deploy to `main`/`preview`, which is *after* merge.

## Merge strategy: **rebase merge**

Set in repo settings → "Allow rebase merging" only. Why rebase, not squash:
- Preserves the per-commit version-bump cadence.
- Keeps Conventional Commit granularity in main's history.
- Linear history; no merge bubbles.

Before merging:
- Rebase the branch onto latest `main` locally (`git fetch && git rebase origin/main`) and re-push.
- Confirm `pnpm check && pnpm build` is green locally.
- Click "Rebase and merge".
- Delete the branch (GitHub prompt does it; or `git push origin --delete <branch>`).

## Branch protection (dashboard, not in repo)

Recommended settings on `main`:
- Require linear history (matches rebase-merge choice).
- Block direct pushes (force all changes through PR).

No status check requirement (no GitHub Actions CI exists). If CI is added back later, add `Require status checks: build must be green` here.

## CF Pages deploy mapping (dashboard, not in repo)

- Production branch: `main` → `ui.plan.ai`.
- Preview deployments: limit to the `preview` branch (avoid burning builds on every feature branch).

## Local pre-push

```bash
pnpm check && pnpm build
```

This is the only pre-merge verification — CF Pages only builds *after* merge, and no GitHub Actions CI runs on PRs. Run it before pushing.

## Hard rules

- Never push directly to `main` once branch protection is on.
- Never merge `preview` into `main`.
- Never `gh pr merge` without an explicit user ask — they decide when ready.
