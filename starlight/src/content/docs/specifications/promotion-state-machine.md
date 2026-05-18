---
title: Promotion state machine
description: The eight states a Frame Package moves through from proposal to public.
sidebar:
  order: 4
stability: stable
last_synced_with: "folder-7"
sources:
  - "1 brainstormings/20260517 2 Agents.md"
  - "3 claude/02-research-tasks.md"
  - "4 claude-dist/02-decisions.md"
---

A Frame Package's lifecycle is captured by its `status` field. There are eight states; transitions are one-way except for explicit `reverted` paths.

## States

| `status` value | Meaning |
|---|---|
| `metadata-only-proposal` | Package exists with prompt, council positions, and click-zone intent. No master generated yet. |
| `candidate-for-generation` | Council has approved generation. Agent may now call the image generator. |
| `asset-generated` | Master image exists at `imagePrompt.masterPath`. Derivatives not yet built. |
| `local-browser-proof` | Master and derivatives render correctly in a local browser; click zones overlay correctly. |
| `clickzone-validated` | Click-zone IoU and OCR-label checks pass. Keyboard navigation order is correct. |
| `license-reviewed` | License intent verified; third-party content (if any) attributed and within policy. |
| `route-promotion-approved` | Acceptance attestation present; PR ready to merge. |
| `public-route-bound` | PR merged. Frame is in the Stream Manifest. |

## Transition rules

```text
metadata-only-proposal
        │  council approval
        ▼
candidate-for-generation
        │  agent runs image generator
        ▼
asset-generated
        │  local browser render passes
        ▼
local-browser-proof
        │  click-zone IoU + OCR checks pass
        ▼
clickzone-validated
        │  license review complete
        ▼
license-reviewed
        │  acceptance.json committed
        ▼
route-promotion-approved
        │  PR merged by human
        ▼
public-route-bound
```

Each arrow is a separate commit. Each commit's diff names the previous and next states. No state is skipped.

## Required evidence per transition

| Transition | Evidence committed in the same PR |
|---|---|
| `metadata-only-proposal` → `candidate-for-generation` | `council.publicSummary[]` populated; council deterministic-check log file. |
| `candidate-for-generation` → `asset-generated` | Master file at `imagePrompt.masterPath`; agent-run log. |
| `asset-generated` → `local-browser-proof` | Browser-proof JSON (screenshot diff vs. expected). |
| `local-browser-proof` → `clickzone-validated` | Click-zone validation report (IoU per zone, OCR labels). |
| `clickzone-validated` → `license-reviewed` | License review checklist signed off by `humanContact`. |
| `license-reviewed` → `route-promotion-approved` | `acceptance.json` per [Acceptance](/specifications/acceptance/). |
| `route-promotion-approved` → `public-route-bound` | Merge commit. CI runs the Stream Manifest regeneration. |

The acceptance attestation is the **only** evidence that crosses the [Promotion gate](/foundations/promotion-gate/). Once present, the gate is open.

## Reversion

A `public-route-bound` frame can be reverted to `metadata-only-proposal` only by:

1. A revert PR removing the frame from the Stream Manifest.
2. A new `acceptance.json` recording the revert and the reason.
3. The Frame Package's `status` reset to `metadata-only-proposal` with a `revertedFrom` field added.

Reversion is a recorded act in the [Decision log](/roadmap-and-open-questions/decision-log/).

## CI enforcement

Each transition is enforced by CI:

- Schema validation runs on every PR that changes a Frame Package.
- Evidence files referenced in the transition table must exist; missing files fail closed.
- The `acceptance.json` must be in the PR diff if the new `status` is `route-promotion-approved` or beyond.
- Performance and accessibility budgets are checked at the `public-route-bound` transition.

## V1 cutline

Stages 1–8 are in v1. Reversion is in v1. Multi-stream promotions (one PR that promotes more than one frame) are **not** in v1 — that is a v1.1 candidate.

## Sources

- `docs/1 brainstormings/20260517 2 Agents.md`
- `docs/3 claude/02-research-tasks.md`
- `docs/4 claude-dist/02-decisions.md`
