---
title: Public API
description: How the V1 Agent API evolves into the V3 commercial API.
sidebar:
  order: 2
stability: working
last_synced_with: "2026-05-21-v1-v2-v3-reset"
---

The V1 Agent API is private. V3 makes the hosted-stream API public.

## V3 additions

- External tenant registration and onboarding.
- Public developer docs and examples beyond curl.
- Customer-visible API versioning and changelog.
- Public key scopes and rotation.
- Support workflows for request IDs and API logs.
- Customer-safe error messages.
- SDKs only after endpoint behavior is stable.

## Compatibility

The V1 API should avoid unnecessary breaking choices so that V3 can evolve it rather than replace it.
