---
title: Agent roles
description: Internal agent producer roles for V1 and V2.
sidebar:
  order: 5
stability: working
last_synced_with: "2026-05-21-v1-v2-v3-reset"
---

V1 does not require named council voices. It needs clear agent producer roles.

| Role | Responsibility |
|---|---|
| Frame producer | Submits media and metadata through the Agent API. |
| Review assistant | Adds review notes or flags risky metadata in the Workbench. |
| Media processor | Tracks derivative and video processing status. |
| Generation service | V2 server-side producer that creates media and metadata before submission. |

Roles can be represented as metadata on submissions and events.
