---
name: git-commit
description: Procedure for every commit in this repo — including the mandatory version bump in package.json. Read before staging/committing. Skipping the bump is a defect.
---

# Commit procedure

Commits happen on **feature branches**, never directly on `main` (branch protection enforces this). Rebase-merge into main preserves each commit individually — so each commit must comply with this skill on its own. See `branch-pr-workflow`.

## 1. Version bump (mandatory)

Every commit bumps `version` in the affected `package.json`(s). Pre-1.0 (`0.x.y`):

| Commit type (Conventional Commits) | Bump |
|---|---|
| `feat!:` or contains `BREAKING CHANGE:` | minor (`0.0.1 → 0.1.0`) |
| `feat:`, `fix:`, `refactor:`, `perf:` | patch (`0.0.1 → 0.0.2`) |
| `docs:`, `chore:`, `test:`, `build:`, `ci:`, `style:` | patch |

Post-1.0: `feat!`/BREAKING → major, `feat` → minor, rest → patch.

### Which `package.json` to bump

Decide from `git diff --name-only`:

| Files touched | Bump |
|---|---|
| Only under `starlight/` | `starlight/package.json` |
| Only main app (not `starlight/`, not workspace-level) | root `package.json` |
| Workspace-level (`pnpm-workspace.yaml`, `.gitignore`, `AGENTS.md`, `.agents/**`, root scripts, lockfile, CI) | **both** |

### Doing the bump

Manual edit is fine; or:

```bash
pnpm version <patch|minor|major> --no-git-tag-version          # root
pnpm --filter starlight-docs version <patch|minor|major> --no-git-tag-version
```

`--no-git-tag-version` is mandatory — we don't tag internal commits.

## 2. Commit flow

```bash
git status
git diff                  # review what's actually staged-worthy
# bump version(s) per §1, then:
git add <files>           # explicit paths; avoid -A
git commit -m "<conventional-commit message>"
git status                # confirm clean
```

Commit message format: `<type>: <subject>` (lowercase, imperative, no period). Body wrapped, explains *why* not *what*. Co-author trailer when this skill is invoked by an agent.

## 3. Hard rules

- Never `--amend` after a hook failure — fix, re-stage, new commit.
- Never `--no-verify` or skip signing without explicit user ask.
- Never commit `.env*`, credentials, or large binaries.
- Never commit `public/docs/` or `dist/` (gitignored — verify before adding).
- Never run `git push` without the user asking.
- Only commit when user explicitly asks.
