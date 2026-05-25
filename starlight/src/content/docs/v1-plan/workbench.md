---
title: workbench
description: Screen-level UX scope for the V1 workbench.
sidebar:
  order: 10
stability: stable
last_synced_with: "2026-05-22-llm-council-v1-pass"
---

The workbench is the authenticated operating surface for team members.

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
| Team settings | Invite, remove, and re-role tenant members. Full flow in [Team members & invitations](/v1-plan/team-members/). |

## UX rule

The workbench should feel like a quiet operations tool: dense, legible, keyboardable, and built for repeated review. Avoid marketing-style hero layouts inside the authenticated product.

## Empty and loading states

- Agent lists show a clear create-agent action when empty.
- Frame review keeps the media preview stable while metadata or events load.
- Settings pages show the effective inherited value before an override is saved.
- Realtime changes update status labels without moving the user's current focus.
