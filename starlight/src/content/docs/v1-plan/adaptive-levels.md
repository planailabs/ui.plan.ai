---
title: Adaptive levels
description: Four performance tiers the runtime degrades to based on device capability.
sidebar:
  order: 7
stability: stable
last_synced_with: "folder-7"
sources:
  - "1 brainstormings/20260517 1 Handoff.md"
  - "1 brainstormings/20260518 Versions.md"
  - "4 claude-dist/02-decisions.md"
---

The runtime supports four adaptive levels. V1 supports Levels 0–2. Level 3 is reserved for v2+.

The runtime measures FPS via `requestAnimationFrame` and steps down on sustained drops. Step-ups happen only after a period of stable headroom.

## The levels

### Level 0 — static

- No animation.
- No autoplay.
- Minimal overlay (progress bar, pin, timeline).
- Click-zone states are visible but do not transition.

**Triggered by:** `prefers-reduced-motion`, measured FPS < 24 for ≥ 3s, or `navigator.deviceMemory` < 1 GB.

### Level 1 — basic

- CSS crossfade between frames (≤ 800ms).
- Simple progress bar with linear transition.
- Hover transitions on click zones (≤ 150ms).

**Default for:** mobile devices, devices reporting low memory or low CPU.

### Level 2 — enhanced

- Animated click-zone states (focus halo, pressed sink).
- Smooth transitions between adaptive levels.
- Light Canvas effects (e.g., a subtle scroll-velocity blur on the timeline).

**Default for:** desktop devices on broadband with adequate CPU and memory.

### Level 3 — high (v2+)

- WebGL glow on click-zone outlines.
- Particle aura on focus.
- Video overlays.

**Not in v1.** If shipped, the performance budget is broken.

## Detection signals

The runtime selects the initial level using:

| Signal | Effect |
|---|---|
| `prefers-reduced-motion: reduce` | Pin to Level 0. |
| `navigator.deviceMemory < 1` | Start at Level 0. |
| `navigator.deviceMemory < 4` | Start at Level 1. |
| Viewport width < 768 | Start at Level 1. |
| Otherwise | Start at Level 2. |
| Sustained FPS < 24 | Step down. |
| Sustained FPS > 50 for ≥ 30s | Step up (only between L1 ↔ L2 in v1). |

## Step-down policy

When the runtime steps down, it cuts in this order:

1. Crossfade (instant frame change instead).
2. Autoplay (visitor must advance manually).
3. Click-zone glow (static borders only).
4. Falls back to Level 0 (no animation at all).

This order matches the [Performance budgets](/v1-plan/performance-budgets/) degradation policy. The crossfade is the first thing to go because it is the most expensive and the least essential to the soul thread.

## No level 3 in v1

If the team is tempted to ship Level 3 in v1, the rule is firm: the budget is broken. Level 3 is the v2+ research surface. A research packet may pre-prototype it; that work does not ship in v1.

## Visibility to the visitor

The adaptive level is not surfaced to the visitor. The runtime adjusts silently. The exception is when `prefers-reduced-motion` is set — the overlay shows a small "reduced motion enabled" indicator near the timeline, so the visitor knows the experience is intentionally static.

## Sources

- `docs/1 brainstormings/20260517 1 Handoff.md`
- `docs/1 brainstormings/20260518 Versions.md`
- `docs/4 claude-dist/02-decisions.md`
