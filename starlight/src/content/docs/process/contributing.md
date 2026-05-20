---
title: Contributing
description: How team members and agents change the V1 platform docs and implementation.
sidebar:
  order: 1
stability: stable
last_synced_with: "2026-05-21-v1-v2-v3-reset"
---

Contributions should preserve the current V1/V2/V3 strategy.

## Rules

- Use feature branches and local verification before PR.
- Keep API behavior synchronized across prose docs, OpenAPI, and JSON schemas.
- Do not reintroduce retired route assumptions.
- Do not add V3 billing or public-tenant requirements to V1 implementation work.
- Do not copy `plan.ai-chat-turk` as a schema blueprint; use it only as implementation inspiration.

## Documentation changes

When a change touches data model, API shape, route shape, settings, or media limits, update the corresponding Starlight pages in the same commit.
