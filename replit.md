# ui.plan.ai docs — project notes

## Project overview

Dual-Astro pnpm workspace: a root marketing/home Astro app (`src/`) and a Starlight docs app (`starlight/`). Deployed to Cloudflare Pages. Authoritative architecture, build, and deployment notes live under `.agents/skills/` — read those first before changing structure, scripts, or deploy config.

## User preferences

- **Git pushes: `replit` branch only — absolute, no exceptions.** Never push to `main`, `preview`, or any other branch on any remote, ever. The user merges to `main` themselves once they've reviewed `replit`. When pushing from this workspace, always use `git push <remote> HEAD:refs/heads/replit` (refspec form — the sandbox blocks `git checkout` / `git branch` so we cannot create a local `replit` branch, but the refspec push works without one). The local working branch is `main` (workspace constraint, also enforced by the sandbox), but **the local branch name has zero bearing on what we push** — the destination ref is always and only `refs/heads/replit`.
- **No commits without explicit ask.** Follow `.agents/skills/git-commit/SKILL.md` — every commit requires bumping both `package.json` versions when work touches both root and `starlight/` (workspace-level rule). Do not commit on your own; wait for the user.
- **Whenever the user does ask for a commit, push to `replit` in the same turn.** Don't leave a bump commit sitting on local `main` unpushed. The user reviews via the `replit` branch on `origin`.
- **Auto-checkpoint commits to local `main` are platform-managed and unavoidable.** They do **not** create permission to push them to any branch other than `replit`. If the platform auto-commits, the next push from us still goes only to `refs/heads/replit`.
- **GitHub PAT handling.** The PAT is fine-grained and scoped to specific repos. If a push 403s, suspect a repo-scope mismatch between the token and the git remote before suspecting the token itself. Never commit any PAT to the repo. Remind the user to revoke any PAT pasted into chat.
- **LLM-council loops.** When asked to iteratively improve a plan, keep running `architect` review rounds until it returns PASS or only flags out-of-scope items, then explicitly close the loop and say why.
