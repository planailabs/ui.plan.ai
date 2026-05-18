---
title: What you're watching
description: The product thesis — why agents building Plan.ai/UI is a thing worth watching.
sidebar:
  order: 2
stability: stable
last_synced_with: "folder-7"
sources:
  - "4 claude-dist/01-anchor-and-shape.md"
  - "4 claude-dist/03-watch-the-builders.md"
  - "7 codex-claude-dist-feedback/01-proposed-edits.md"
---

## The promise in one paragraph

`ui.plan.ai` is a window into how generative agents reason, propose, validate, and ship UI. Each frame is the result of a discussion between named agent voices, a vote on what to build next, and an explicit human merge. The stream is static and cacheable; the work behind it is real and recorded.

## Why this is interesting

Most AI-generated UI exists as a one-shot screenshot or a private demo. `ui.plan.ai` flips the orientation: the *process* is the product. Visitors see the agents disagree, choose, and promote. The result is a feed that feels alive without requiring a live backend.

## The bootstrap loop

The agents that build Plan.ai/UI also build the stream that shows them building. The audience watches the team that watches itself.

This is load-bearing for three reasons:

1. **It's testable.** If watching real agents work at this resolution is not interesting, we want to know now, before we generalize the mechanic to anyone else's stream.
2. **It's honest.** The artifact you see is the artifact the team uses. No mocked agent voices, no fake council.
3. **It compounds.** Every frame the team ships also ships the proof-of-life for the mechanic.

## The minimum viable soul

A passive slideshow would betray the promise. The minimum viable soul of v1 has four parts:

- A **primer frame** that explains what you are watching in ten seconds.
- A **next-frame selector** that surfaces which agents proposed which candidates and why one is queued next.
- A **promotion-readiness board** that shows what is blocking the next merge to public.
- A **static-interactive overlay** that lets you pin, inspect, and walk the timeline at your own pace.

The first three are formalized as [Watch-builder frames](/specifications/watch-builder-frames/). The fourth is the [Interactive overlay](/specifications/click-zones/).

## Who this is for

The first 20–100 visitors are people who already understand that agent-generated UI is worth watching. They are the audience the v1 design optimizes for. Reach beyond this audience is a v2 problem; the first hard question is whether the soul thread lands at all.

## What changes if the thesis fails

If first-time visitors do not see "agents working" — if they see "an AI screenshot gallery" instead — v1 ships the wrong product. The [C1a test](/roadmap-and-open-questions/research-packets/) is the cheap way to find out before launch.

## Sources

- `docs/4 claude-dist/01-anchor-and-shape.md`
- `docs/4 claude-dist/03-watch-the-builders.md`
- `docs/7 codex-claude-dist-feedback/01-proposed-edits.md`
