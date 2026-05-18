---
title: First six interactions
description: The interaction inventory for v1, sorted into must / should / could tiers.
sidebar:
  order: 8
stability: stable
last_synced_with: "folder-7"
sources:
  - "7 codex-claude-dist-feedback/01-proposed-edits.md"
  - "4 claude-dist/02-decisions.md"
---

A visitor's first six interactions with the stream decide whether the soul thread lands. The inventory below is the v1 floor — six interactions, tiered into must / should / could so scope discipline survives sprints.

The order roughly matches a typical session: arrival → orientation → exploration → inspection → sharing → walking the timeline.

## Tier: must

Cutting any of these = cutting from v1.

### 1. Pin

Tap or click the pin button to stop autoplay on the current frame. The pin state persists across navigation within the stream. The visitor sees a clear visual signal (filled pin icon) when pinned.

### 2. Hover / focus / pressed states on click zones

Every click zone responds visibly to pointer hover, keyboard focus, and pointer press. The states are CSS-driven (Level 1 baseline) with light animation (Level 2). See [Click zones & overlays](/specifications/click-zones/).

### 3. Inspect mode

The visitor toggles an inspect overlay that surfaces:

- The frame's `title` and `altText`.
- The `council.publicSummary[]` for this frame.
- The frame's license posture and any third-party attributions.

Inspect is a separate overlay, not a replacement of the frame. The frame remains visible behind a translucent panel.

## Tier: should

Ships in v1 unless schedule pressure forces a defensible cut.

### 4. Share-by-link

The visitor copies a permalink to the current frame: `/ui/{date}/{frame-slug}`. The permalink loads directly into the frame on visit, with the same overlay state. No share modal — one click copies, a subtle toast confirms.

### 5. Timeline scrub

The visitor jumps to any frame via a timeline strip at the bottom. Each entry shows a thumbnail and the frame title. The strip is keyboard-navigable (arrow keys).

## Tier: could

If schedule permits and budgets hold.

### 6. Soul cue on watch-builder frames

When the visitor lands on a [Watch-builder frame](/specifications/watch-builder-frames/), the overlay surfaces a small "agents working" indicator. The indicator pulls from the frame's `freshness` block — not from any runtime call — and gracefully shows `stale` if outside the window.

## Why six

Folder-4 council was unanimous that six interactions is the right v1 count. Three is a slideshow; ten is a dashboard. Six is what a 90-second first session can naturally exercise.

## What is **not** in the first six

- Comments. Likes. Follows.
- Multi-tenant routes.
- User auth.
- Video controls.
- A full Hub.
- An in-app reduced-motion toggle.

All `future`. See [v1.1 & v2+ candidates](/roadmap-and-open-questions/v1-1-and-v2-candidates/).

## Test methodology

The C1b test (does the launch sequence land?) walks three first-time visitors through these six interactions in order, with light prompting. Each interaction is rated 1–3 on whether it felt like "watching the builders." See [Research packets](/roadmap-and-open-questions/research-packets/).

## Sources

- `docs/7 codex-claude-dist-feedback/01-proposed-edits.md`
- `docs/4 claude-dist/02-decisions.md`
