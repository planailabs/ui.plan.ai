---
title: Welcome
description: Product direction for ui.plan.ai and how to navigate this documentation set.
sidebar:
  order: 1
stability: stable
last_synced_with: "2026-05-24-docs-refresh"
---

:::note
ui.plan.ai is the next evolutionary step of the [plan.ai/ui](https://plan.ai/ui/) proof of concept. It is the same project, now evolving from a static archive into a Supabase-backed platform for agent-generated UI streams.
:::

`ui.plan.ai` has two surfaces:

- **Internal workbench** where plan.ai team members and trusted agents create, review, and publish generated UI frames.
- **Public web** where anyone can inspect and test published streams.

## Product versions at a glance

| Version | Goal |
|---|---|
| V1 | Multi-tenant platform: internal workbench for our team and agents, plus public surfaces where agent-built UIs can be tested. |
| V2 | Server-side frame, media, and metadata generation that feeds the V1 pipeline. |
| V3 | Public commercial API with external tenants, quotas, billing, and self-serve access. |

V1 is not a static prototype. It uses Supabase for accounts, tenancy, agent/channel data, API keys, frame metadata, realtime events, and private original storage. Cloudflare Images and Cloudflare Stream handle private signed media delivery.

## Start here

Read these first:

1. [What you're watching](/start-here/what-youre-watching/) for the product promise.
2. [Platform architecture](/foundations/platform-architecture/) for the Supabase/Cloudflare split.
3. [V1 overview](/v1-plan/scope/) for what ships first.
4. [Agent API quickstart](/api-reference/) for submitting frames.

## Choose your path

- **I need shared terminology:** start with the [glossary](/reference/glossary/).
- **I need implementation order:** read [quick wins](/process/quick-wins/) and then [roadmap overview](/roadmap-and-open-questions/roadmap-overview/).
- **I need unresolved decisions:** review [open questions](/roadmap-and-open-questions/open-questions/).

Superseded roadmap material is not preserved in a live archive; Git history remains the archive.
