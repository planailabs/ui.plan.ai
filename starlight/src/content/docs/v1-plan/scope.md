---
title: Scope (the cutline)
description: What v1 ships, in one page.
sidebar:
  order: 1
stability: stable
last_synced_with: "folder-7"
sources:
  - "3 claude/06-v1-shape.md"
  - "4 claude-dist/01-anchor-and-shape.md"
---

V1 is the smallest shape that lets the team test [the thesis](/foundations/the-thesis/). The cutline below is exhaustive: anything not on this list is **not in v1**.

## One stream, one route

- Route: `/ui/{date}/`. Domain: `ui.plan.ai`.
- Locale: `en` and `de` only.
- Single-tenant. No `/u/{username}/` namespace in v1 (reserved).
- The first frame in every stream is a 10-second "what is this" primer.

## The artifact spine

- [Frame Package](/specifications/frame-package/) at `schemaVersion@1`, locked.
- [Promotion state machine](/specifications/promotion-state-machine/), 8 stages.
- [Acceptance](/specifications/acceptance/) attestation per promoted frame.
- [Stream Manifest](/specifications/stream-manifest/) as the public projection.

## The interactive overlay

Six interactions, all in v1:

1. Progress bar (top, thin).
2. Pin button (current frame).
3. Click-zone hover, focus, and pressed states.
4. Inspect mode (council summary visible).
5. Share-by-link (deep link to current frame).
6. Timeline scrub (bottom strip).

Cutting any of the six = cutting from v1, not deferring. See [First six interactions](/v1-plan/first-six-interactions/) for must / should / could tiering inside this list.

## Watch-builder frames

Two mandatory frames carry the soul thread:

- Next-frame selector.
- Promotion-readiness board.

See [Watch-builder frames](/specifications/watch-builder-frames/). Launch timing for these two is the open call escalated to Seb; see [Escalations](/roadmap-and-open-questions/escalations/).

## Media

- Stills only (PNG masters; AVIF + WebP derivatives).
- One [imageGenerator](/reference/glossary/) primary (OpenAI Image) plus one fallback (Imagen). Pick is a research packet.
- No video, no animation, no shaders in v1 (Level 3 reserved for v2+).

## Click zones

Rectangles and rounded rectangles, agent-authored, with visible hover/focus/pressed states. SVG-path glow is a parallel research packet that may promote to v1 if it lands in time. See [Click zones & overlays](/specifications/click-zones/).

## Council

- Two agent roles in v1: generation and QA/promotion.
- `council` field on every Frame Package, populated by cheap deterministic checks or single-pass LLM voice runs.
- `publicSummary[]` projected to the inspect overlay.
- Real multi-LLM debate is a separate v2 decision.

## Licensing

- CC0 default per asset.
- Acceptance attestation per frame, committed by verified GitHub identity.
- Third-party content marked at the region level; mixed-license frames are non-CC0 as a whole.
- Lawyer review before any external contributor enters the system.

## Performance and accessibility

- WCAG AA. Keyboard-reachable, focus-visible, alt text required.
- Reduced-motion: strict disable of autoplay + crossfade + pulses.
- LCP < 1.5s on simulated 3G. CLS = 0. INP < 200ms.
- Shell JS < 50kB gz. CSS < 20kB gz.
- All as fail-closed CI gates.

See [Performance budgets](/v1-plan/performance-budgets/) and [Accessibility](/v1-plan/accessibility/).

## Adaptive levels

Levels 0–2 supported in v1; Level 3 reserved for v2+. The runtime measures FPS via `requestAnimationFrame` and steps down on sustained drops in this order: crossfade → autoplay → click-zone glow → static-only. See [Adaptive levels](/v1-plan/adaptive-levels/).

## Distribution

- One social channel: LinkedIn (drafts; humans post).
- No newsletter, no Hacker News submission, no Product Hunt. v1.1+.

## Build & runtime

- Astro static shell. GitHub Pages or Cloudflare Pages for hosting.
- No Supabase, no database, no public API.
- Generation work runs locally or on GitHub Actions. Public runtime calls zero providers.
- One development node (ThinkPad) for dev; production via GitHub Actions + APIs.
- No n8n in v1; bare scripts and Actions.

## What v1 explicitly does **not** ship

See [Non-goals](/v1-plan/non-goals/).

## The shape in one sentence

A single curated static stream of generated UI frames with a six-interaction overlay, two watch-builder frames, the Frame Package as canonical source, CC0 by default, and hard performance and accessibility gates.

## Sources

- `docs/3 claude/06-v1-shape.md`
- `docs/4 claude-dist/01-anchor-and-shape.md`
