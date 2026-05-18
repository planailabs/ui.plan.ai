---
title: Performance & accessibility checklist
description: One-page lookup for every CI gate v1 enforces.
sidebar:
  order: 4
stability: stable
last_synced_with: "folder-7"
sources:
  - "3 claude/05-principles-and-non-goals.md"
  - "4 claude-dist/02-decisions.md"
---

Print this. Pin it.

## Performance gates (every PR)

- [ ] LCP < 1.5s on simulated Moto G + 3G.
- [ ] CLS = 0.
- [ ] INP < 200ms.
- [ ] Shell JS < 50kB gzipped.
- [ ] CSS < 20kB gzipped.
- [ ] Above-the-fold images combined < 200kB.
- [ ] Per-frame below-the-fold images < 150kB.
- [ ] AVIF + WebP derivatives present for every variant.
- [ ] No PNG in delivery (except social-share fallback).

## Accessibility gates (every PR)

- [ ] WCAG AA contrast for overlay text and click-zone borders.
- [ ] Every click zone is keyboard-reachable.
- [ ] `tabIndex` set on every click zone (no zero-tabIndex implicit ordering).
- [ ] `:focus-visible` produces ≥ 3:1 contrast.
- [ ] Every frame has `altText`; `altText` ≠ `title`; 5–250 chars.
- [ ] `aria-live="polite"` on the stream container.
- [ ] Hit targets ≥ 44×44 CSS px.
- [ ] Mobile pressed state fires on `pointerdown`.
- [ ] Skip-to-content link present.
- [ ] Page title updates with current frame.
- [ ] Lighthouse a11y score = 100.
- [ ] `axe-core` zero violations.

## Reduced-motion gates (every PR)

- [ ] Under `prefers-reduced-motion: reduce`, no `transition` runs for ≥ 16ms after navigation.
- [ ] Under `prefers-reduced-motion: reduce`, no `animation` runs.
- [ ] Under `prefers-reduced-motion: reduce`, autoplay does not start within 10s of mount.
- [ ] Adaptive level pins to 0 under `prefers-reduced-motion: reduce`.

## Schema gates (every PR)

- [ ] Frame Package validates against [Schema — Frame Package](/reference/schemas/frame-package/).
- [ ] Stream Manifest validates against [Schema — Stream Manifest](/reference/schemas/stream-manifest/).
- [ ] Acceptance validates against [Schema — Acceptance](/reference/schemas/acceptance/).
- [ ] No forbidden term appears outside `archive/` (see [Forbidden terms](/reference/forbidden-terms/)).
- [ ] Every page has a `## Sources` block.

## Promotion gates (only at `route-promotion-approved`)

- [ ] `acceptance.json` present.
- [ ] `acceptedBy` is on the team allow-list.
- [ ] `licenseAsserted` matches `licenseIntent`.
- [ ] `reviewNote` ≥ 20 characters.
- [ ] All previous-stage evidence files present and referenced.

A single unchecked box on a v1-bound PR is a failed build.

## Sources

- `docs/3 claude/05-principles-and-non-goals.md`
- `docs/4 claude-dist/02-decisions.md`
