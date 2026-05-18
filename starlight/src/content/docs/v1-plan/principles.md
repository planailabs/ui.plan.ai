---
title: Principles
description: The ten load-bearing beliefs. When a future decision is contested, decide by these.
sidebar:
  order: 2
stability: stable
last_synced_with: "folder-7"
sources:
  - "3 claude/05-principles-and-non-goals.md"
---

When a future decision is contested, the right move is to ask which principle it touches and decide accordingly. The order matters: when two principles seem to conflict, the principle earlier in the list wins.

## The ten principles

1. **Static is the safety net.** Any dynamic feature must earn its place by passing the test *"would this break if a provider API or our database is down?"* If breaking is acceptable, build dynamic. Otherwise, ship static. See [Static-Interactive architecture](/foundations/static-interactive/).

2. **The Frame Package is the only canonical artifact.** Manifests, route bindings, social cards, search results, billing events all *derive* from it. If two artifacts disagree, the Frame Package wins by definition. See [Frame Package](/specifications/frame-package/).

3. **Two version dimensions, no more.** `appVersion` (deployed code) and `schemaVersion` (Frame Package shape). Anything else is technical debt pretending to be flexibility.

4. **Agents commit; humans promote.** No fully-autonomous changes to the public route in v1. Promotion is a deliberate, attested, human act. See [Promotion gate philosophy](/foundations/promotion-gate/).

5. **CC0 by default; third-party content is the exception.** Asset-level metadata makes this enforceable. Mixed-license frames are non-CC0 as a whole — no half-CC0 frames. See [CC0 & human acceptance](/foundations/cc0-and-acceptance/).

6. **Frames stand still by default.** A frame held long enough to read is the unit of attention. Autoplay is helpful, never aggressive. Crossfade is brief.

7. **Accessibility is not v2.** Reduce-motion, keyboard navigation, alt text, and AA contrast ship with v1 or there is a real bug. See [Accessibility](/v1-plan/accessibility/).

8. **No private data leaks via cache.** Public URLs are forever-public. Anything private goes through signed URLs with short TTL — including thumbnails and OG images.

9. **Performance over feature richness.** A janky shader is worse than no shader. The performance budget (LCP < 1.5s on 3G) is non-negotiable; any feature that pushes past it gets cut, not optimized later. See [Performance budgets](/v1-plan/performance-budgets/).

10. **One UI per frame, one question per UI.** Each generated frame should answer one question. If a frame is doing two things, it's two frames.

## Tiebreakers

When two principles seem to conflict, the order above is the priority order.

- Principle 1 (static safety) outranks principle 10 (one question per UI).
- Principle 7 (accessibility) outranks principle 9 (performance) — the performance budget already includes accessibility paths.
- Principle 4 (humans promote) outranks principle 6 (frames stand still) — a beautiful auto-promoted frame still breaks the gate.

## When a principle is wrong

Principles are revisable. To change one, file a decision-log entry with the proposed wording and the council positions for and against. See [Decision log](/roadmap-and-open-questions/decision-log/).

## Sources

- `docs/3 claude/05-principles-and-non-goals.md`
