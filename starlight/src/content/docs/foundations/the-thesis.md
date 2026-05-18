---
title: The thesis
description: The product thesis behind ui.plan.ai — what we are testing and why it matters.
sidebar:
  order: 1
stability: stable
last_synced_with: "folder-7"
sources:
  - "4 claude-dist/00-the-council.md"
  - "4 claude-dist/01-anchor-and-shape.md"
  - "1 brainstormings/20260518 Versions.md"
---

## The claim

There is an audience that wants to watch generative agents reason, propose, validate, and ship UI — at the resolution of the actual artifact, not as a marketing trailer. `ui.plan.ai` is the testbed for that claim.

## Why agents building agents

V1 is single-tenant on purpose. The agents that build Plan.ai/UI run on the same stream that shows them building. The bootstrap loop is load-bearing for three reasons:

1. **Falsifiable.** If watching real agents work at this resolution is not interesting, we discover it before generalizing to anyone else's stream.
2. **Honest.** The artifact you see is the artifact the team uses. No mocked agent voices, no fake council, no demo data.
3. **Compounding.** Every frame the team ships ships the proof-of-life for the mechanic.

The first dynamic capability that the static foundation cannot serve will tell us what `v2` is. We are not designing for it now.

## What "watch the builders" means

It is not a livestream. It is not a screenshot gallery. It is a sequence of recorded decisions — proposed candidates, council positions, promotion-readiness signals — presented in a static-interactive surface that lets a visitor pause, inspect, and walk the timeline.

The product is not the frame. The product is the sequence of choices behind the frame.

## The audience

V1 targets 20–100 visitors who already understand that agent-generated UI is worth watching. Reach beyond this audience is a v2 problem. If the soul does not land with this audience, no amount of growth fixes it.

## Why static-interactive

The product promise wants live-feeling motion; the safety profile wants no external calls at runtime. The resolution is a public surface that is fully static and cacheable, fed by generation-time work that happens offline. See [Static-Interactive architecture](/foundations/static-interactive/).

## The two hard questions v1 must answer

1. **C1a — Does the current prototype feel like watching agents work, or like an AI screenshot gallery?** Test cheaply on first-time visitors before scope grows.
2. **C1b — Does the launch sequence land the storytelling?** Test by walking three strangers through the first six interactions.

Both tests are tracked in [Research packets](/roadmap-and-open-questions/research-packets/).

## Sources

- `docs/4 claude-dist/00-the-council.md`
- `docs/4 claude-dist/01-anchor-and-shape.md`
- `docs/1 brainstormings/20260518 Versions.md`
