---
title: Promotion gate philosophy
description: Why the boundary between lab and public is explicit, gated, and human-signed in v1.
sidebar:
  order: 5
stability: stable
last_synced_with: "folder-7"
sources:
  - "4 claude-dist/02-decisions.md"
  - "6 codex-dist/01-council-memo.md"
  - "7 codex-claude-dist-feedback/01-proposed-edits.md"
---

## The boundary

A Frame Package lives in the lab. A Stream Manifest entry lives in public. The transition between them is the **promotion gate**, and it is explicit by design.

In v1, every crossing requires:

1. A human team member merging the PR.
2. A signed Acceptance attestation committed to the repo.
3. All pre-promotion checks (council, license, performance, accessibility) recorded as passed.

For the formal state machine, see [Promotion state machine](/specifications/promotion-state-machine/).

## Why it is explicit

Three reasons:

1. **Auditability.** Every public frame is a recorded act. We can answer "who promoted this, on what evidence, when" for any frame in the stream.
2. **Safety.** No agent can publish autonomously in v1. The leak surface for a runaway agent is bounded by the merge step.
3. **Soul-thread integrity.** The promotion-readiness board is itself a watch-builder frame. If promotion were silent and automatic, there would be nothing to watch.

## Why agents propose

The flip side of the explicit gate is that everything below it is delegated. Agents draft prompts, generate masters, refine click zones, draft council positions, propose acceptance. They do this on PR branches. Humans do not author Frame Packages by hand in v1.

The principle: **agents commit; humans promote.**

## What the gate does not require

The gate does not require:

- A human author for the frame's content.
- A human review of every agent prompt or run.
- A human sign-off on private (non-bound) Frame Packages.

The gate fires only when a Frame Package transitions to bound.

## The autonomy ladder

V1 is **stage 1**: humans approve every promotion. Future stages reduce the gate as the team gains confidence:

- **Stage 2 (`future`)** — agents may auto-promote a frame whose council position is unanimous, performance and accessibility checks pass, and content type is on a small allowlist (e.g., research-status frames).
- **Stage 3 (`future`)** — agents may auto-promote anything that passes a fixed checklist; humans review weekly.

Each stage transition requires its own [Decision log](/roadmap-and-open-questions/decision-log/) entry. The exit criteria for stage 1 → 2 are still being shaped; see [v1.1 & v2+ candidates](/roadmap-and-open-questions/v1-1-and-v2-candidates/).

## Attestation, not signature

The Acceptance artifact in v1 is **attested**, not cryptographically signed. A team member's verified GitHub identity merging a PR that includes an `acceptance.json` file is the legal record. Calling it "signed" overstates what we do today; calling it "attested" is honest.

The legal mechanics — what acceptance binds, what jurisdiction applies, how it propagates to external contributors — need a lawyer's review before any external contributor uses the system. This is tracked as a [Research packet](/roadmap-and-open-questions/research-packets/).

## Sources

- `docs/4 claude-dist/02-decisions.md`
- `docs/6 codex-dist/01-council-memo.md`
- `docs/7 codex-claude-dist-feedback/01-proposed-edits.md`
