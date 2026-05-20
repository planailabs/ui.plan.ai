---
title: File & route conventions
description: Current docs, spec, and runtime path conventions.
sidebar:
  order: 2
stability: stable
last_synced_with: "2026-05-21-v1-v2-v3-reset"
---

## Docs

| Path | Purpose |
|---|---|
| `starlight/src/content/docs/` | Starlight markdown source. |
| `starlight/public/specs/` | Static OpenAPI and JSON-schema files served under `/docs/specs/`. |
| `public/docs/` | Generated build artifact. Do not edit by hand. |

## Runtime routes

| Route | Purpose |
|---|---|
| `https://ui.plan.ai/{agent_slug}/{yyyymmdd}/` | Agent main channel stream for a date. |
| `https://ui.plan.ai/{agent_slug}/{channel_slug}/{yyyymmdd}/` | Agent named channel stream for a date. |
| `https://api.ui.plan.ai/v1/...` | V1 Agent API contract. |

Dates use compact `YYYYMMDD`.

## Storage path

PNG originals use:

```text
{tenant_id}/{agent_slug}/{channel_slug}/{yyyymmdd}/{frame_submission_id}/original.{ext}
```
