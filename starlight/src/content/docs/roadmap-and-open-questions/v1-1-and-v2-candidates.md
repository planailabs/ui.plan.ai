---
title: v1.1 & v2+ candidates
description: Promising-but-deferred ideas, with a target version and what makes them ready.
sidebar:
  order: 7
stability: working
last_synced_with: "folder-7"
sources:
  - "1 brainstormings/20260516 1 Handoff.md"
  - "1 brainstormings/20260516 2 MVP.md"
  - "1 brainstormings/20260518 Versions.md"
---

Everything on this page is **`future`**. It is here so the team remembers what is on deck and so contributors do not re-propose deferred ideas as new.

## v1.1 candidates

Targeted for the 2–8 weeks after v1 launch.

### Watch-builder frame set, expanded

Beyond the two mandatory v1 frames (next-frame selector, promotion-readiness board), four candidates:

- **Council discussion frame** — a transcript-style view of dissent on one decision.
- **Research-packet status frame** — packets in flight, packets closed, severity tags.
- **Blockers-and-bets frame** — escalations and open options visualized.
- **Retro frame** — what shipped this week, what slipped.

See [Watch-builder frames](/specifications/watch-builder-frames/).

### SVG-path glow (if not in v1)

Glowing button contours that follow the real button outline. Pipeline: OmniParser → SAM 2 → OpenCV → SVG path. May promote to v1 via [Research packets 5 and 6](/roadmap-and-open-questions/research-packets/); otherwise v1.1.

### In-app reduced-motion toggle

An override for `prefers-reduced-motion` that persists session-only (v1.1) or via consented localStorage (v2). See [O-007](/roadmap-and-open-questions/options-to-decide/#o-007-reduced-motion-in-app-toggle).

### Lawyer-reviewed legal model

External-contributor pathway requires the lawyer review tracked in [Research packet 10](/roadmap-and-open-questions/research-packets/#packet-10-rights-cc0-mechanics-legal-review).

### Multi-stream promotions

A single PR that promotes more than one frame, with the council ledger and acceptance evidence covering the batch.

### Open Graph variants and social cards

Per-frame OG images, Twitter cards, custom share previews. Built at generation time, not at runtime.

### Additional locales

Beyond `en` and `de`. Likely candidates: `es`, `fr`, `ja`. Adds complexity to alt text authoring.

## v2 candidates

Larger structural changes that require their own scoping.

### Multi-tenant URLs (`/u/{username}`)

Per-user streams. Requires authentication, a tenancy model, and the matrix `{public, unlisted, private, team} × {CC0, non-CC0}` that the brainstorms named.

The matrix has obvious cells (`public + CC0`, `private + non-CC0`) and strange cells (`private + CC0`, `team + non-CC0`). v2 spec needs to commit to which cells are coherent.

### Hosted backend (Supabase or equivalent)

Earns its place only when the first dynamic capability that static files cannot serve emerges. See [O-006](/roadmap-and-open-questions/options-to-decide/#o-006-first-dynamic-capability).

Brings: row-level security (RLS), authenticated API keys, signed URLs for private assets, usage events.

Carries: a leak-surface story the team has not yet budgeted.

### Public API for external agents

Agents from other teams propose frames against the shared stream. Requires the v2 acceptance model and an external-contributor legal posture.

### Video and animated frames

Image-to-video pipeline (Runway, Veo, Kling, Luma, Pika, Krea) plus FFmpeg post-processing (xfade, blend, minterpolate) for seamless loops. Adaptive Level 3.

### Livestreaming

Server-based streaming via headless browser + FFmpeg, RTMP to YouTube. Or an OBS guide for manual streaming. Folder-1 explored this; folder-4 deferred.

### Full Hub

The richer side-panel sub-component of the overlay. Categories, frame-based table of contents, social distribution, agent decision visibility. The v1 overlay is the minimal shape; full Hub is v2.

### Real multi-LLM council

In v1 the council is a logged ruleset or single-pass LLM voices. In v2, an actual multi-LLM debate may earn its place — once the cost, latency, and confidently-wrong-output risks are studied.

### Self-improving system loop

Agents not only create content but analyze feedback, test variants, score performance, and propose improvements to the overlay itself. The Hub becomes a meta-UI showing agent thinking.

### Livestream-to-YouTube + adaptive quality

A 24/7 stream of agents working, rendered server-side via headless Playwright + FFmpeg.

## How an idea moves off this page

An idea moves from `future` to `working` (and onto a non-archive page) by:

1. A [Decision log](/roadmap-and-open-questions/decision-log/) entry naming the promotion.
2. A target version.
3. The relevant spec pages updated.

## Sources

- `docs/1 brainstormings/20260516 1 Handoff.md`
- `docs/1 brainstormings/20260516 2 MVP.md`
- `docs/1 brainstormings/20260518 Versions.md`
