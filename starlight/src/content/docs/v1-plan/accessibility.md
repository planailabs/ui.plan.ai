---
title: Accessibility
description: WCAG AA in v1 or it's a bug — what that means concretely.
sidebar:
  order: 5
stability: stable
last_synced_with: "folder-7"
sources:
  - "3 claude/05-principles-and-non-goals.md"
  - "4 claude-dist/02-decisions.md"
  - "1 brainstormings/20260518 Versions.md"
---

Accessibility is not a v2 feature. WCAG AA ships with v1 or there is a real bug.

## The checklist

| Requirement | How it lands in v1 |
|---|---|
| Keyboard navigation reachable for every click zone | `tabIndex` is required on each click zone. CI fails the build if missing. |
| Focus visible | `:focus-visible` styles produce contrast ratio ≥ 3:1 against the underlying frame at the focus location. |
| Alt text on every frame | Required field on the Frame Package (`frame.altText`). Authored, not derived. |
| Color contrast ≥ AA | Overlay text and click-zone borders pass WCAG AA against the frame they overlay. |
| Reduced motion respected | See [Reduced-motion](/v1-plan/reduced-motion/). Strict disable. |
| Screen reader announces frame changes | `aria-live="polite"` region on the stream container. |
| Minimum hit target 44×44 CSS px | Enforced by the click-zone hitbox, not the visible stroke. |
| Mobile pressed state on `pointerdown` | Not on `click`. So press-feedback feels immediate. |
| Skip-to-content link | Present at the top of every page. |
| Page title reflects current frame | Updated when the current frame changes. |

## What "AA" includes

WCAG 2.2 Level AA, including:

- 1.4.3 Contrast (Minimum) for all text and meaningful non-text content.
- 1.4.11 Non-text Contrast for UI components and graphical objects.
- 2.1.1 Keyboard.
- 2.4.7 Focus Visible.
- 2.5.5 Target Size (Minimum), 44 CSS px.
- 3.3.2 Labels or Instructions for any input control.
- 4.1.3 Status Messages via `aria-live`.

## What "AA" does not include

We do not target Level AAA in v1. We do not target Level AAA in v1.1 either; AAA is reserved for the day private streams introduce sensitive content.

## Alt text discipline

`frame.altText` is required and must be:

- Authored by the human or the generation agent, not derived from the title.
- 5–250 characters.
- Descriptive of the *visible content*, not the *intent* (a frame titled "Cadence Console" might have alt text describing a dashboard with five panels and a radar chart).

The CI gate fails if `altText` is empty, equal to `frame.title`, or shorter than 5 characters.

## Reading order

Click zones are traversed in `tabIndex` order. The authoring agent is responsible for setting an order that matches a sighted user's natural reading flow (top-left to bottom-right, primary actions before secondary).

## Testing

| Check | When |
|---|---|
| Lighthouse a11y audit | Every PR. Must score 100. |
| `axe-core` automated scan | Every PR. Zero violations. |
| Manual keyboard walkthrough | Every newly bound frame. |
| Screen-reader smoke test (VoiceOver) | Weekly per release. |

A 100 Lighthouse score does **not** guarantee real accessibility; the manual checks remain in scope.

## What "accessibility outranks performance" means

When the performance budget conflicts with an accessibility requirement, the requirement wins. The budget cuts go to crossfade, autoplay, and click-zone glow — never to focus rings, hit targets, or alt text.

## Sources

- `docs/3 claude/05-principles-and-non-goals.md`
- `docs/4 claude-dist/02-decisions.md`
- `docs/1 brainstormings/20260518 Versions.md`
