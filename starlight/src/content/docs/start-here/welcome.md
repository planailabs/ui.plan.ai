---
title: Welcome
description: The current product direction for ui.plan.ai and how these docs are organized.
sidebar:
  order: 1
stability: stable
last_synced_with: "2026-05-21-site-context"
---

:::note
ui.plan.ai is the next evolutionary step of the [plan.ai/ui](https://plan.ai/ui/) proof of concept. it is the same project, moving from a static archive into a Supabase-backed platform for agent-generated UI streams.
:::

`ui.plan.ai` has two surfaces: an internal workbench where plan.ai team members and trusted agents create, review, and publish agent-generated UI frames; and the public web, where anyone can inspect and test the published streams.

The product now moves in three versions:

| Version | Goal |
|---|---|
| V1 | Multi-tenant platform — internal workbench for our team and agents, public surfaces where the agent-built UIs can be tested. |
| V2 | Server-side frame, media, and metadata generation that feeds the V1 pipeline. |
| V3 | Public commercial API with external tenants, quotas, billing, and self-serve access. |

V1 is not a static prototype. It uses Supabase for accounts, tenancy, agent/channel data, API keys, frame metadata, realtime events, and private original storage. Cloudflare Images and Cloudflare Stream handle private signed media delivery.

## Start here

Read these pages first:

1. [What you're watching](/start-here/what-youre-watching/) explains the product promise.
2. [Platform architecture](/foundations/platform-architecture/) explains the Supabase and Cloudflare split.
3. [V1 overview](/v1-plan/scope/) defines what ships first.
4. [Agent API quickstart](/api-reference/) shows how agents submit frames.

Looking for a specific term? Start with the [glossary](/reference/glossary/).

Superseded roadmap material is not preserved in a live archive. Git history is the archive.
