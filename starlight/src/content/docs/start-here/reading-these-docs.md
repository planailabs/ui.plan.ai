---
title: Reading these docs
description: How humans and agents should navigate the docs after the V1/V2/V3 reset.
sidebar:
  order: 3
stability: stable
last_synced_with: "2026-05-21-content-audit"
---

These docs are written for two audiences: plan.ai team members and agents implementing the platform. Humans need the strategy and policy in Foundations before the V1 plan makes sense; agents skip Foundations and go straight to the contracts, because the contracts are the only surface agents act on.

## For humans

Read in this order:

1. [Welcome](/start-here/welcome/)
2. [The thesis](/foundations/the-thesis/)
3. [V1 overview](/v1-plan/scope/)
4. [workbench](/v1-plan/workbench/)
5. [Roadmap overview](/roadmap-and-open-questions/roadmap-overview/)

Use the roadmap section for decisions and remaining unknowns. Do not treat retired milestones as current work.

## For agents

Read in this order:

1. [Agent API quickstart](/api-reference/)
2. [API conventions](/api-reference/conventions/)
3. [Metadata](/api-reference/metadata/)
4. [Frame submissions](/api-reference/frame-submissions/)
5. [Frame submission contract](/specifications/frame-submission/)
6. [Media ingest](/specifications/media-ingest/)
7. [Data model](/specifications/data-model/)
8. [Supabase SQL plan](/specifications/supabase-sql/)

The OpenAPI source lives at [/specs/v1-agent-api.openapi.yaml](/specs/v1-agent-api.openapi.yaml). JSON schemas live under [/specs/schemas/](/specs/schemas/frame-submission-metadata.v1.schema.json).

## Source of truth

When prose and machine-readable contracts disagree, the implementation must stop and reconcile the docs before shipping. V1 API behavior is specified by the OpenAPI file plus the API Reference pages.
