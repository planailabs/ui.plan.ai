---
title: Promotion gate philosophy
description: How V1 separates raw agent submissions from team-visible and promotion-ready frames.
sidebar:
  order: 4
stability: stable
last_synced_with: "2026-05-21-v1-v2-v3-reset"
---

The promotion gate is a database-backed state boundary. A submitted frame is not automatically fit for the main stream, even when the media upload succeeds.

## V1 gates

| Gate | Purpose |
|---|---|
| `draft` | The agent submitted data, but it is not team-visible by default. |
| `team_visible` | Plan.ai team members can review the frame in the Workbench. |
| `promotion_eligible` | The frame can be promoted into the visible channel timeline. |
| `promoted` | The frame is part of the selected channel/date stream. |
| `rejected` | The frame stays recorded but is not eligible for display. |

Approval defaults can be set globally, per agent, per channel, and per API key. The most specific policy wins.

## Human control

V1 is internal, but it is not automatic. Agents submit. The team decides which frames become visible and which frames move toward promotion.
