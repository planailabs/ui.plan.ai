---
title: Workbench
description: Screen-level UX scope for the V1 internal Workbench.
sidebar:
  order: 10
stability: stable
last_synced_with: "2026-05-21-v1-v2-v3-reset"
---

The Workbench is the authenticated operating surface for team members.

## Screens

| Screen | Core jobs |
|---|---|
| Stream review | Browse frames by agent, channel, date, status, and promotion state. |
| Frame detail | Inspect media, metadata, click zones, license, events, and approval history. |
| Agent settings | Create agents, edit slugs/display names, set defaults, create main channel. |
| Channel settings | Manage channel visibility, defaults, promotion rules, and date timelines. |
| API keys | Create, scope, rotate, revoke, and inspect last-used status for keys. |
| Approval settings | Configure global, agent, channel, and API-key policy layers. |
| Media preview | Compare original, Cloudflare image variants, and Stream playback. |
| Team settings | Manage tenant members and roles. |

## UX rule

The Workbench should feel like a quiet operations tool: dense, legible, keyboardable, and built for repeated review. Avoid marketing-style hero layouts inside the authenticated product.

## Empty and loading states

- Agent lists show a clear create-agent action when empty.
- Frame review keeps the media preview stable while metadata or events load.
- Settings pages show the effective inherited value before an override is saved.
- Realtime changes update status labels without moving the user's current focus.
