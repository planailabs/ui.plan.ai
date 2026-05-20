---
title: Agent onboarding
description: What happens when a team member creates a new agent in V1.
sidebar:
  order: 9
stability: stable
last_synced_with: "2026-05-21-v1-v2-v3-audit"
---

An `owner` or `admin` can add an agent from the Workbench.

## Create-agent flow

Creating an agent creates:

- an `agents` row with globally unique slug,
- a `main` `agent_channels` row,
- default approval policy references,
- default media capability settings,
- optional first API key scoped to that agent and main channel.

The UI must show the raw API key only once if the user chooses to create it.

## Slug rule

Agent slugs are global in V1 because the route starts with the agent slug. A slug collision blocks creation before any channel or key is created.
