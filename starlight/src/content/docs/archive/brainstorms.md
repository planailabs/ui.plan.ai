---
title: Brainstorm index
description: English summaries of the original brainstorming notes, with links to the source files.
sidebar:
  order: 1
stability: stable
last_synced_with: "folder-7"
sources:
  - "1 brainstormings/"
---

The brainstorming notes are the soil from which v1 grew. They are preserved as immutable source-of-truth. The team does not read them to learn what v1 *is* — that is the rest of this site. They are read to understand what was *considered* on the path here.

Some originals contain German text. The summaries below are English; the originals are linked verbatim.

## April 16, 2026 — Foundations

**File:** `docs/1 brainstormings/20260416 0.md`

Coined the Prometheus-inspired "content envelope" concept. Proposed stream IDs, parent links, depth semantics, animation frames, click maps, provenance. Established the metaphor that UI artifacts should be **observable, labeled, hierarchical, versionable, and replayable** the way Prometheus metrics are. Architectural, abstract.

Survived: the artifact-spine philosophy.
Superseded: the `depth` field (banned), `parent_id` (deferred), the Envelope name (replaced by Frame Package).

## May 16, 2026 — Handoff

**File:** `docs/1 brainstormings/20260516 1 Handoff.md`

Expanded to a fullscreen Hub concept showing frames, categories, share tools. Introduced agent roles (UI Research, Frame Generation, Asset Optimization, Social Media, Feedback, Growth, System Maintainer). Proposed self-improvement loops.

Survived: agent specialization (narrowed to two roles in v1).
Superseded: full Hub (v1 ships overlay only), seven-agent set (v1 ships two).

## May 16, 2026 — MVP

**File:** `docs/1 brainstormings/20260516 2 MVP.md`

Scoped the first deliverable: Hub element, streaming structure, asset pipeline (PNG → WebP/AVIF), CDN options (Cloudflare), ThinkPad as dedicated agent node, upscaler tooling, video loops, n8n as workflow orchestration.

Survived: PNG-master + AVIF/WebP-derivative pipeline.
Superseded: ThinkPad in production, n8n in v1, video loops in v1.

## May 17, 2026 — Addendum

**File:** `docs/1 brainstormings/20260517 -1 Ergänzung.md` (originally titled "Ergänzung" — German for "addendum")

Introduced the next-frame indicator (progress bar) and frame-hold (pin) state model. Proposed states `playing`, `paused_by_interaction`, `pinned`. Detailed upscalers in depth (Topaz Gigapixel, Krea, Magnific, etc.).

Survived: pin as the canonical verb. Progress bar with strict pause-on-interaction.
Superseded: the verb `hold` (forbidden), localStorage-persisted state in v1.

## May 17, 2026 — UI

**File:** `docs/1 brainstormings/20260517 0 UI.md`

Deep dive on button recognition, interactive overlays, visual indicators. Proposed OmniParser V2, SAM 2, OpenCV, SVG overlays for glowing button contours. Control maps, VLM verification, precise polygon masks.

Survived: SVG overlays as the rendering surface. Vision pipeline as QA.
Survives conditionally: SVG-path glow (research packet, may promote to v1).

## May 17, 2026 — Handoff (round 2)

**File:** `docs/1 brainstormings/20260517 1 Handoff.md`

Synthesized interactive frames, button overlays, shader effects, image/video generation, automation. Proposed Three.js / WebGL for GPU effects (magnifying glass, glow, distortion, ripple). Introduced adaptive quality levels based on device FPS.

Survived: adaptive Levels 0–3 (v1 supports 0–2). Performance-aware degradation order.
Superseded: WebGL shader effects in v1 (reserved for Level 3).

## May 17, 2026 — Agents

**File:** `docs/1 brainstormings/20260517 2 Agents.md`

Snapshot of the actual Astro repo at the time. Documented the 46 timestamped spec packages, the active route `/ui/20260516/`, the Frame Package contract (`schemaVersion`, `stream`, `status`, `ownership`, `licenseIntent`, `frame`, `imagePrompt`, `videoPrompt`, `councilDiscussion`, `clickZones`, `routeVersionMetadata`, `integrationNotes`).

Survived: the field set (renamed `councilDiscussion` → `council`). The eight promotion stages.
Note: the new project starts fresh. The 46 packages are not migrated; they informed the spec.

## May 18, 2026 — Versions

**File:** `docs/1 brainstormings/20260518 Versions.md`

Continuous delivery, Supabase, versioning, performance, sharing, license. Architecture proposal: Astro static shell + Supabase + Cloudflare. `ui.plan.ai/{username}` routes, RLS, CC0 default, usage-based billing, adaptive quality levels.

Survived: CC0 default. Adaptive levels. Static Astro shell. Decoupling continuous *content* delivery from continuous *deployment*.
Superseded: Supabase in v1. Multi-tenant URLs in v1. Billing.

## How to navigate the originals

The originals are the long-form record. Read them when you want:

- The motivation behind a design choice that this site presents as decided.
- Ideas the team considered and rejected (useful before re-proposing them).
- The author's voice and intent at the time.

Read the rest of this site for what v1 is. Read the brainstorms for how the team got here.

## Sources

- `docs/1 brainstormings/20260416 0.md`
- `docs/1 brainstormings/20260516 1 Handoff.md`
- `docs/1 brainstormings/20260516 2 MVP.md`
- `docs/1 brainstormings/20260517 -1 Ergänzung.md`
- `docs/1 brainstormings/20260517 0 UI.md`
- `docs/1 brainstormings/20260517 1 Handoff.md`
- `docs/1 brainstormings/20260517 2 Agents.md`
- `docs/1 brainstormings/20260518 Versions.md`
