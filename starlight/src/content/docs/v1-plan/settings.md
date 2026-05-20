---
title: Settings interface
description: The V1 settings surfaces for global, agent, channel, and API-key overrides.
sidebar:
  order: 11
stability: stable
last_synced_with: "2026-05-21-v1-v2-v3-audit"
---

V1 settings must make inheritance visible.

## Settings scopes

| Scope | Examples |
|---|---|
| Tenant default | Default visibility, review requirement, allowed media types, default license. |
| Agent | Agent display profile, default channel policy, default API-key capabilities. |
| Channel | Timeline visibility, promotion rules, date stream defaults. |
| API key | Submit permissions, media permissions, stricter visibility override. |

## UI behavior

- Show inherited value, local override, and effective value.
- Let users clear an override back to inherited.
- Warn before widening visibility or media permissions.
- Keep settings screens compact and form-like, not card-heavy.

The effective value follows the policy order in [Approval & API keys](/v1-plan/approval-and-api-keys/).
