---
title: Performance budgets
description: The hard numbers — what v1 must hit on first paint, layout shift, interaction, and bundle size.
sidebar:
  order: 4
stability: stable
last_synced_with: "folder-7"
sources:
  - "3 claude/05-principles-and-non-goals.md"
  - "4 claude-dist/02-decisions.md"
  - "1 brainstormings/20260518 Versions.md"
---

These are fail-closed CI gates. Anything that pushes past these gets cut from v1, not optimized later.

## Core Web Vitals

| Metric | Budget | Measured on |
|---|---|---|
| LCP (Largest Contentful Paint) | **< 1.5s** | Simulated Moto G + 3G. |
| CLS (Cumulative Layout Shift) | **= 0** | Same. |
| INP (Interaction to Next Paint) | **< 200ms** | Same. |

LCP < 1.5s on 3G is the hard line. Everything else flows from it.

## Bundle size

| Asset class | Budget (gzipped) |
|---|---|
| Shell JS | **< 50kB** |
| CSS | **< 20kB** |
| Above-the-fold images (combined) | < 200kB |
| Below-the-fold images (per frame) | < 150kB |

The shell JS budget is what makes the overlay viable; exceeding it forces a degraded interaction model.

## Imagery

| Format | Use |
|---|---|
| AVIF | Primary delivery. |
| WebP | Fallback. |
| PNG | Master only; not delivered to clients. |

Masters are kept at full resolution. Derivatives are built at AVIF q=50 and WebP q=78, tuned per frame if needed.

## When budgets conflict with features

The order of degradation when budget pressure rises (the cuts, in order):

1. Crossfade.
2. Autoplay.
3. Click-zone glow.
4. Falls back to Level 0 (static-only).

Reduced-motion behavior is **always strict**, even on devices with budget headroom. See [Reduced-motion](/v1-plan/reduced-motion/).

## CI gates

The performance budget is enforced by CI on every PR via Lighthouse-CI plus a custom budget checker that fails the build if any metric exceeds the threshold. A budget exceedance **blocks the merge**; it does not produce a warning.

The CI gate runs on:

- The home route (`/ui/{date}/`).
- A representative frame route (the most recently bound frame).
- A representative watch-builder frame.

If any of the three fails, the PR cannot merge.

## What "Moto G + 3G" means

The exact configuration:

- Throttling: Fast 3G profile (1.6 Mbps down, 750 Kbps up, 562ms RTT).
- CPU: 4× slowdown vs. Lighthouse defaults.
- Viewport: 360×640.
- Cache: cold (every run starts with empty cache).

A measurement on a real device or a different config does not satisfy the gate.

## Reporting

Each PR comment from CI includes:

- The three metrics with current values and budgets.
- The bundle-size table with current and budget values.
- A diff vs. main.
- The Lighthouse run URL.

## Sources

- `docs/3 claude/05-principles-and-non-goals.md`
- `docs/4 claude-dist/02-decisions.md`
- `docs/1 brainstormings/20260518 Versions.md`
