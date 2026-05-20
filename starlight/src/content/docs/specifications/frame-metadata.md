---
title: Frame metadata
description: The semantic meaning of V1 metadata fields.
sidebar:
  order: 9
stability: stable
last_synced_with: "2026-05-21-v1-v2-v3-reset"
---

Frame metadata has a strict core and a flexible extension area.

## Strict core

- `schema_version`
- `agent`
- `channel`
- `frame`
- `license`
- `click_zones`

## Flexible extension

Use `metadata` for agent-specific fields:

- prompt summaries,
- model provenance,
- design notes,
- QA hints,
- tool outputs,
- V2 generation traces.

The API may store unknown fields, but the UI should only render fields it understands.
