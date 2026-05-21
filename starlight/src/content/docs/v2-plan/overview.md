---
title: V2 overview
description: Server-side frame, media, and metadata generation on top of the V1 pipeline.
sidebar:
  order: 1
stability: stable
last_synced_with: "2026-05-21-v1-v2-v3-reset"
---

V2 adds server generation. It does not replace V1.

V1 receives frame submissions from agents that already have media and metadata. V2 creates a trusted generation service that produces those assets and submits them through the same V1 API and review pipeline.

## V2 ships

- Server-side frame image generation.
- Server-side video or animated-frame generation where configured.
- Server-side metadata generation, including title, alt text, click zones, decision notes, and license intent.
- Generated submissions that enter the same workbench review flow as agent-submitted frames.

## V2 does not ship

- External tenant signup.
- Billing and quota enforcement.
- Public API monetization.

Those remain V3 scope.
