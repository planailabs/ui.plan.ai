---
title: PR & promotion workflow
description: The end-to-end PR path that promotes a Frame Package to public.
sidebar:
  order: 2
stability: stable
last_synced_with: "folder-7"
sources:
  - "1 brainstormings/20260517 2 Agents.md"
  - "4 claude-dist/02-decisions.md"
---

This page is the operational view of the [Promotion state machine](/specifications/promotion-state-machine/). It tells the team and the agents what concretely happens at each transition.

## The eight transitions, as PRs

| # | Transition | Who opens the PR | What changes in the diff |
|---|---|---|---|
| 1 | `metadata-only-proposal` → `candidate-for-generation` | Generation agent | `status` flip; `council.publicSummary[]` complete; deterministic-check log file added. |
| 2 | `candidate-for-generation` → `asset-generated` | Generation agent | `imagePrompt.masterPath` set; `master.png` committed; agent-run log added. |
| 3 | `asset-generated` → `local-browser-proof` | QA agent | Browser-proof JSON added with screenshot diff. |
| 4 | `local-browser-proof` → `clickzone-validated` | QA agent | Click-zone validation report (IoU + OCR per zone) added. |
| 5 | `clickzone-validated` → `license-reviewed` | QA agent + human | License review checklist signed by `humanContact`. |
| 6 | `license-reviewed` → `route-promotion-approved` | QA agent | `promotions/<frame-id>/acceptance.json` added by a team member's commit. |
| 7 | `route-promotion-approved` → `public-route-bound` | Human merges the PR | CI rebuilds the Stream Manifest. |

The eighth transition (revert) is human-only and runs in reverse.

## CI on every PR

CI runs the same suite on every PR, regardless of which transition it represents:

- Frame Package schema validation against [Schema — Frame Package](/reference/schemas/frame-package/).
- Acceptance schema validation (when present).
- Forbidden-term grep across `docs/8 final-docs/`.
- Link integrity across `docs/8 final-docs/`.
- Performance budget on the home route and a representative frame.
- Accessibility checks (Lighthouse, axe).
- Reduced-motion behavior tests.

A PR cannot merge while any gate fails.

## Acceptance flow

The acceptance attestation is the **only** evidence that crosses the [Promotion gate](/foundations/promotion-gate/).

```text
1. QA agent confirms all evidence files present.
2. Team member reviews:
   - The master image.
   - The rendered click zones.
   - The alt text vs. the frame.
   - The license posture.
   - The keyboard walk-through.
3. Team member commits `promotions/<frame-id>/acceptance.json` to the PR.
4. CI re-runs with the new file. All gates must still pass.
5. Team member merges.
6. CI regenerates the Stream Manifest. The frame is bound.
```

If a gate fails after acceptance lands, the merge is blocked. The team member either fixes the issue (new commit) or removes the acceptance (revert commit).

## Branch protection

- `main` is protected. No direct push.
- PRs require:
  - At least 1 review from a team member.
  - Every CI check passing.
  - Branch up-to-date with `main`.
  - Linear history (no merge commits; rebase only).

Agents do not have permission to merge or to override branch protection.

## Reverts

```text
1. Team member files a revert PR.
2. Revert PR removes the frame from the Stream Manifest input.
3. A new `acceptance.json` is added with `reviewNote` explaining the revert.
4. The Frame Package's `status` resets to `metadata-only-proposal` with `revertedFrom: "public-route-bound"` added.
5. CI passes; team member merges.
6. Revert is recorded in the [Decision log](/roadmap-and-open-questions/decision-log/).
```

A revert is not a delete. The old `acceptance.json` stays in version control as part of the audit trail.

## Sources

- `docs/1 brainstormings/20260517 2 Agents.md`
- `docs/4 claude-dist/02-decisions.md`
