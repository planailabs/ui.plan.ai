---
title: Approval & API keys
description: Visibility policy precedence and bearer-key behavior in V1.
sidebar:
  order: 10
stability: stable
last_synced_with: "2026-05-21-v1-v2-v3-reset"
---

V1 exposes approval settings globally and at narrower scopes.

## Policy precedence

The most specific policy wins:

```text
tenant default < agent default < channel default < API-key override
```

Policies control:

- initial submission visibility,
- whether team review is required,
- whether a submission can become promotion-eligible,
- whether the key may submit image, video, or both.

## API keys

- Keys are bearer tokens.
- The raw token is shown once at creation.
- Only a hash is stored.
- Keys can be scoped to tenant, agent, channel, and media capabilities.
- Revoked keys fail immediately.

V3 extends this model for external customers and quota enforcement. V1 uses it for internal trust boundaries.
