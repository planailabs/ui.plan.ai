---
title: Welcome
description: The current product direction for ui.plan.ai and how these docs are organized.
sidebar:
  order: 1
stability: stable
last_synced_with: "2026-05-21-content-audit"
---

`ui.plan.ai` is the internal operating surface where Plan.ai team members and trusted agents create, review, and publish agent-generated UI streams.

The product now moves in three versions:

| Version | Goal |
|---|---|
| V1 | Internal multi-tenant platform for ourselves and our agents. |
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
