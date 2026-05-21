---
title: Metadata generation
description: Metadata that V2 should generate before submitting through V1.
sidebar:
  order: 3
stability: working
last_synced_with: "2026-05-21-v1-v2-v3-reset"
---

V2 generation should produce metadata that V1 already understands.

## Required output

- frame title,
- alt text,
- compact date,
- agent and channel slugs,
- click zones with normalized bounds,
- license intent,
- decision notes,
- generation prompt summary,
- model/provider provenance,
- review hints for the workbench.

The metadata still validates against the V1 frame submission schema. V2 may add fields under flexible JSON metadata, but it must not break V1 consumers.
