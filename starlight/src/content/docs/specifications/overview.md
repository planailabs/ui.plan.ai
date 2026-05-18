---
title: Specifications overview
description: How the canonical artifacts fit together and where to start reading.
sidebar:
  order: 1
stability: stable
last_synced_with: "folder-7"
sources:
  - "4 claude-dist/02-decisions.md"
  - "1 brainstormings/20260517 2 Agents.md"
---

This section is the canonical contract layer. Agents implement against these pages. Humans on the team use them to settle disagreements about field meaning, projection rules, and state transitions.

## The artifact spine

Three artifacts and two transitions describe v1 end-to-end.

```text
                  ┌──────────────────┐
                  │  Frame Package   │ ← source artifact (private)
                  └──────────────────┘
                           │
                           │  promotion gate
                           │  (PR merge + acceptance)
                           ▼
        ┌──────────────────┐     ┌──────────────────┐
        │   Acceptance     │     │ Stream Manifest  │ ← public projection
        └──────────────────┘     └──────────────────┘
```

- The **Frame Package** is the only canonical source. Everything else derives.
- **Acceptance** is the attestation that gates the transition.
- The **Stream Manifest** is the public projection — what visitors actually see.

## Where to start reading

In implementation order:

1. [Frame Package](/specifications/frame-package/) — the field-level contract for the source artifact.
2. [Promotion state machine](/specifications/promotion-state-machine/) — how a Frame Package moves from proposal to bound.
3. [Acceptance](/specifications/acceptance/) — the attestation that gates the boundary.
4. [Stream Manifest](/specifications/stream-manifest/) — the public projection rules.
5. [Click zones & overlays](/specifications/click-zones/) — interactive regions on each frame.
6. [Watch-builder frames](/specifications/watch-builder-frames/) — the special frame subtype that surfaces agent decision-making.
7. [Council fields](/specifications/council-fields/) — the public/private split for council content.
8. [Assets & derivatives](/specifications/assets-and-derivatives/) — masters, derivatives, and the naming contract.
9. [Freshness semantics](/specifications/freshness-semantics/) — how the runtime declares the recency of "agents working now" surfaces.

JSON Schemas live under [Reference / Schemas](/reference/schemas/frame-package/).

## Stability of the spec

Every spec page declares a stability tag in frontmatter. As of folder-7:

- `stable` — the contract is locked enough for implementation.
- `working` — drafted; expect changes before implementation commitment.
- `proposed` — not yet ratified.

When a spec page lists fields, the field-level annotation is more specific:

```
fieldName: type (required | optional | derived) — description
```

- **required** — the field must be present and non-null.
- **optional** — the field may be omitted.
- **derived** — the field is computed from other fields; do not author it directly.

## What this section is not

This section is not narrative. For *why* a contract is shaped the way it is, go to [Foundations](/foundations/the-thesis/). For *what we are shipping vs. not*, go to [The v1 Plan](/v1-plan/scope/).

## Sources

- `docs/4 claude-dist/02-decisions.md`
- `docs/1 brainstormings/20260517 2 Agents.md`
