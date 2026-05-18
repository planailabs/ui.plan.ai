---
title: How agents propose changes
description: The agent's path from idea to a PR that humans can promote.
sidebar:
  order: 1
stability: stable
last_synced_with: "folder-7"
sources:
  - "4 claude-dist/02-decisions.md"
  - "1 brainstormings/20260517 2 Agents.md"
---

V1 uses two agent roles. Both produce PRs. Neither merges. The merge is the human's job.

## The two v1 roles

### Generation agent

Drafts Frame Packages. Calls the image generator. Writes the master, the prompt, the alt text, the council positions, and the click-zone JSON. Opens a PR that proposes a new Frame Package at `status: metadata-only-proposal` or moves an existing one toward generation.

### QA / promotion agent

Validates schema. Runs deterministic checks (vision IoU, OCR labels, performance budget on the generated master). Drafts the `acceptance.json`. Opens the PR that proposes the transition through `local-browser-proof` → `clickzone-validated` → `license-reviewed` → `route-promotion-approved`.

The agent never opens the merge. A team member with a verified GitHub identity does that.

## Agent → PR workflow

```text
1. Agent reads the spec.                                 ← read-only
2. Agent drafts the change on a feature branch.          ← repo write
3. Agent commits the diff with a structured message.     ← repo write
4. Agent opens a PR.                                     ← repo write, no merge
5. CI runs all gates (schema, perf, a11y, links).        ← automated
6. Team member reviews; merges if happy.                 ← human only
```

Step 6 is the [Promotion gate](/foundations/promotion-gate/). Everything below it is fully delegated.

## Commit message structure

Agents commit using:

```
<role>: <action> <frame-id> → <new-status>

<why, in one short paragraph>

run-id: run_1779228000.main
generation-agent-version: 1.2.0
```

Example:

```
generation: propose ui-en-v1-cadence-console → metadata-only-proposal

A first draft of the cadence-console frame. Council positions populated with
deterministic checks; alt text authored, click zones agent-rectangles.

run-id: run_1779228000.main
generation-agent-version: 1.2.0
```

The structure is enforced by a CI parser. Non-conforming commits are flagged in the PR.

## What an agent must not do

- Open a PR that mutates `public/streams/` or `public/assets/` directly. These are CI-generated; agents commit the source, not the projection.
- Merge any PR. Even on the agent's own branch.
- Push to `main`. The branch is protected.
- Edit `promotions/team.json` (the acceptance allow-list).
- Write to folders 1–7 in `docs/`. They are the immutable audit trail.

## What an agent should do

- Cite the [Spec page](/specifications/overview/) the change targets in the PR description.
- List the [Decision log](/roadmap-and-open-questions/decision-log/) entries the change relies on.
- If the change introduces a new option not yet recorded, add an entry to [Options to decide](/roadmap-and-open-questions/options-to-decide/) in the same PR.
- Run the consistency audit (forbidden terms, link integrity, ## Sources blocks) locally before opening the PR.

## Multi-agent runs

A complex frame may involve multiple agents on the same proposal:

- Generation agent drafts the package.
- A research agent generates the council positions.
- The QA agent validates.

All three contribute to the same PR. The branch carries all their commits. The `run_<unix>.<channel>` identifier distinguishes their work.

## The new project starts fresh

The 46 Frame Packages in the abandoned prototype are not migrated. New project, new packages. Patterns may be informed by the old; structure is not.

The [`sync-docs-with-code`](/process/promotion-workflow/) skill is the bridge that keeps these docs in sync as new code lands.

## Sources

- `docs/4 claude-dist/02-decisions.md`
- `docs/1 brainstormings/20260517 2 Agents.md`
