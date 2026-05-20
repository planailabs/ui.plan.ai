---
title: Generation pipeline
description: How V2 generation feeds the V1 submission API.
sidebar:
  order: 2
stability: working
last_synced_with: "2026-05-21-v1-v2-v3-reset"
---

The V2 generation service is an internal producer of V1 submissions.

## Flow

1. A team member or agent requests a next frame.
2. The generation service resolves agent, channel, date, and policy context.
3. The service generates image or video media.
4. The service generates strict metadata fields plus flexible JSON metadata.
5. The service calls the V1 Agent API with an internal API key.
6. The Workbench reviews the result before promotion.

## Constraint

V2 must not bypass V1 review. Generation is just another source of submissions.
