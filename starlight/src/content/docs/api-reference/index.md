---
title: API Reference
description: Placeholder. Populated as agents implement.
sidebar:
  order: 1
stability: working
last_synced_with: "folder-7"
sources:
  - "v1-plan/non-goals.md"
---

V1 has no public API. The runtime is static-interactive — no agents from outside the team can call into the system. See [Static-Interactive architecture](/foundations/static-interactive/) and [Non-goals](/v1-plan/non-goals/) item 3.

## What lives here when it lives here

When v2 introduces a public API for external agents (see [v1.1 & v2+ candidates](/roadmap-and-open-questions/v1-1-and-v2-candidates/)), this section grows to hold:

- Endpoint reference.
- Authentication / API key model.
- Request and response schemas.
- Rate limits and quotas.
- SDK examples in TypeScript and Python.

For now, the section is a placeholder so the sidebar reflects the project's planned shape.

## Internal CLI commands (working draft)

The new project will likely ship a CLI for the team's own use (generating Frame Packages, running validation, regenerating the Stream Manifest). Once the CLI exists, its reference pages will live here. Until then, this is `future`.

## Sources

- See [Non-goals](/v1-plan/non-goals/) and [v1.1 & v2+ candidates](/roadmap-and-open-questions/v1-1-and-v2-candidates/) for context on why this section is empty in v1.
