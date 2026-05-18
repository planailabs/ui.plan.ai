---
title: Reduced-motion
description: How v1 responds when `prefers-reduced-motion` is set. Strict, not "reduced."
sidebar:
  order: 6
stability: stable
last_synced_with: "folder-7"
sources:
  - "4 claude-dist/02-decisions.md"
  - "1 brainstormings/20260517 -1 Ergänzung.md"
---

When a visitor's OS or browser declares `prefers-reduced-motion`, the v1 runtime disables motion **strictly**. Not "reduced" — off.

## What gets disabled

| Feature | Reduced-motion behavior |
|---|---|
| Autoplay (auto-advance to next frame) | Off. The visitor advances manually. |
| Crossfade between frames | Off. Frame change is instant. |
| Click-zone pulses / glow loops | Off. Static borders only. |
| Hover-state animations | Off. State change is instant. |
| Focus-ring transitions | Off. State change is instant. |
| Timeline-strip scroll animation | Off. The strip jumps. |
| Adaptive-level upgrades | Disabled. Runtime stays at Level 0. |

## What stays on

| Feature | Reduced-motion behavior |
|---|---|
| Click-zone states (hover, focus, pressed) | On. They change instantly. |
| Frame change announcement (`aria-live`) | On. Screen readers get every frame change. |
| Frame inspection (council summary) | On. No motion involved. |
| Share-by-link | On. No motion involved. |

## Why strict

The original brainstorm proposed *reduced* motion as a softened version of the normal experience. The folder-4 council overrode this: "reduced" drifts in implementation. "Off" does not. A visitor with vestibular sensitivity gets predictable behavior across every page in the site.

The cost of strict-off is small: the static experience still surfaces the soul thread (council summaries, watch-builder frames, click zones) — just without motion. The visitor controls the pace.

## How the runtime detects

The runtime checks `window.matchMedia('(prefers-reduced-motion: reduce)').matches` at three points:

1. On first render — to set the initial adaptive level.
2. On every navigation — in case the OS setting changed.
3. On a `matchMedia` change event — for live updates.

There is **no in-app toggle** in v1. The OS setting is the only control. A v1.1 candidate is adding an in-app override.

## Adaptive-level interaction

When `prefers-reduced-motion` is set, the runtime pins to Level 0 regardless of measured FPS. The runtime does not upgrade out of Level 0 until the OS setting changes. See [Adaptive levels](/v1-plan/adaptive-levels/).

## CI gate

A CI test forces `prefers-reduced-motion: reduce` and verifies, on the home route and a representative frame route:

- No `transition` style executes for ≥ 16ms after navigation.
- No `animation` style runs.
- Autoplay does not start within 10 seconds of mount.

The test fails closed.

## Sources

- `docs/4 claude-dist/02-decisions.md`
- `docs/1 brainstormings/20260517 -1 Ergänzung.md`
