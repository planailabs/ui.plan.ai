---
title: Glossary
description: Canonical terms used across all ui.plan.ai docs and specs.
sidebar:
  order: 1
stability: stable
last_synced_with: "folder-7"
sources:
  - "3 claude/04-naming-and-glossary.md"
  - "4 claude-dist/00-the-council.md"
---

This is the canonical vocabulary. Every other page on this site uses these terms. If a new term is needed, it lands here first.

For words you must **not** use, see [Forbidden terms](/reference/forbidden-terms/).

## Core artifacts

**Frame** — the static image a visitor sees as one step in the stream. User-facing unit.

**Asset** — a file on disk. Generic; an asset may be a `master` PNG, a `derivative` AVIF, an attestation JSON, etc.

**Frame Package** — the canonical JSON artifact describing one frame's full state: prompts, agent reasoning, click zones, status, license intent, council positions, internal notes. Private by default. See [Frame Package](/specifications/frame-package/).

**Stream Manifest** — the public, projected artifact derived from one or more Frame Packages. Safe for cacheable runtime; never carries source-only fields. See [Stream Manifest](/specifications/stream-manifest/).

**Master** — the image generator's output before upscaling or delivery optimization.

**Derivative** — a delivery variant of a master (AVIF, WebP, thumbnail, social card).

**Acceptance** — an attested JSON record stating that a human on the team has reviewed a frame and approved its public projection. See [Acceptance](/specifications/acceptance/).

## Surfaces

**Stream** — the user-facing series of frames. One stream per route in v1.

**Overlay** — the non-image control layer on top of the stream (progress bar, pin button, timeline strip, click-zone visuals). Always present in v1.

**Hub** — a richer side-panel sub-component of the overlay. **Not in v1**; v2+.

**Click zone** — a non-visual interactive region on a frame. JSON key: `clickZones`. CSS class: `click-zone`. Prose: "click zone."

**Interactive region** — the same concept as `click zone`, but in user-facing documentation.

## Actions and states

**Pin** (verb) / **Pinned** (state) — stop autoplay on the current frame.

**Promote** (action) / **Bound** (state) — move a Frame Package from lab to public. The promotion is gated by human merge plus signed Acceptance.

**Publish** — distribute externally (social, newsletter). Distinct from `promote`; publishing happens after a frame is bound.

## Roles and runs

**Agent** — one role doing one job (a `generationAgent`, a `researchAgent`, a `reviewerAgent`).

**Council** — a multi-agent discussion of a candidate frame. The named voices used by the planning council are listed in [Council voices](/reference/council-voices/).

**Run** — one agent doing one job. Matches the brainstorm identifier `run_123`.

**Run channel** — the work-output sub-stream of a run (e.g., `run_123.main`, `run_123.research`). Distinct from the user-facing `stream`.

## Versions

Five concepts, five names. Do not use bare `version` outside this list.

- **`schemaVersion`** — the shape of the Frame Package artifact.
- **`appVersion`** — the deployed UI generator code.
- **`runtimeVersion`** — the component bundle. v2+ only.
- **`streamRevision`** — the `/{user}/v1` suffix. v2+ only.
- **`variant`** — desktop vs. mobile rendition.

## Generators

Three concepts, three names. Do not use bare `generator`.

- **`imageGenerator`** — the model (OpenAI Image, Imagen, FLUX).
- **`generationAgent`** — the agent role that orchestrates a generation.
- **`UiGenerator`** — the Astro component symbol in code.

## Architecture terms

**Static-Interactive** — the v1 architecture pattern: the public runtime is static and cacheable and makes zero external calls; generation-time work (provider calls, OCR, vision pipelines) happens offline.

**Promotion gate** — the explicit boundary between lab (Frame Package) and public (Stream Manifest). See [Promotion gate philosophy](/foundations/promotion-gate/).

**Adaptive levels** — the four performance tiers (0–3) the runtime can degrade to depending on device capability. See [Adaptive levels](/v1-plan/adaptive-levels/).

**Reduced-motion** — when `prefers-reduced-motion` is set, the runtime strictly disables autoplay, crossfade, and click-zone pulses. Not "reduced" — off.

## Editorial terms

**Soul thread** — the running thesis "watch the builders." Anything that makes agent decision-making visible is part of the soul thread.

**Watch-builder frame** — a frame whose subject is the agents' own work (selector, readiness board, council discussion). See [Watch-builder frames](/specifications/watch-builder-frames/).

## Disambiguating "next frame"

- **`nextInStream`** — the frame queued to play next in the user-facing stream.
- **`nextCandidate`** — the Frame Package the team is currently choosing to promote next.

Never use bare `next frame`.

## Disambiguating "manifest"

- **Stream Manifest** — the public projection of one or more Frame Packages.
- **Asset manifest** — a file inventory used at build time.
- **Control manifest** — a per-frame catalog of click zones. May or may not exist as a separate file; today it is embedded in the Frame Package.

When a doc says "manifest," it must qualify which one.

## Sources

- `docs/3 claude/04-naming-and-glossary.md`
- `docs/4 claude-dist/00-the-council.md`
