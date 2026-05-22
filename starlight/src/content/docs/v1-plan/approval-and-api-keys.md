---
title: Approval & API keys
description: Visibility policy precedence and bearer-key behavior in V1.
sidebar:
  order: 13
stability: stable
last_synced_with: "2026-05-22-llm-council-v1-pass"
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
- Raw token format: `pai_live_<base32>` (`pai_test_<base32>` for non-prod).
- The raw token is shown once at creation.
- Only `prefix` (first 12 chars) and `hash` are stored.
- `hash = HMAC-SHA256(API_KEY_PEPPER, raw_token)`; the pepper is an Edge Function secret, rotatable via a versioned column.
- Lookup happens by `prefix`; verification is a constant-time compare of the full HMAC.
- Keys can be scoped to tenant, agent, channel, and media capabilities.
- Revoked keys fail immediately.
- `last_used_at` is updated asynchronously (debounced, at most once per minute per key) to avoid per-request UPDATE storms on a hot row.

The Edge Function additionally verifies that the verified key's `agent_id`/`channel_id` matches the submission target — RLS alone is not sufficient because the API path uses the service role.

### Creation & rotation UI contract

The API-keys screen in the workbench is gated on `aal2` for `owner`/`admin`. The creation flow:

1. **Form** — required: `label` (free text, ≤ 64 chars), `agent_id`, `scopes` (channels, media capabilities); optional: `expires_at` (default: never). Show inherited approval policy preview before submit.
2. **Confirm** — explicit "I understand this token is shown once" checkbox. No double-click submit.
3. **Reveal** — single-pane modal showing the raw `pai_live_<base32>` token with a copy button and a "Download as `.env` snippet" link. Modal cannot be dismissed without an explicit "I've stored this" confirmation. After dismissal the raw token is unrecoverable.
4. **Listing** — table shows `label`, `prefix` (first 12 chars), `agent`, `scopes`, `last_used_at`, `created_at`, `expires_at`, `status`. Never the raw token, never the full hash.

Rotation creates a brand-new row with a fresh prefix + hash and revokes the old row in the same transaction. There is no in-place edit of the secret. Revocation is immediate (no grace period in V1).

All create / rotate / revoke actions append a `api_key.*` event to `frame_events` carrying actor, target key, and `request_id` (see [Observability](/v1-plan/observability/)).

## Rate limiting

Per-API-key token bucket enforced inside the Edge Function:

| Bucket | Default | Burst |
|---|---|---|
| All endpoints | 60 req/min | 10 |
| `POST /v1/frame-submissions` (multipart) | 10 req/min | 3 |
| `POST /v1/media-uploads` | 20 req/min | 5 |

Over-limit responses use the canonical [error envelope](/api-reference/errors/) with top-level `code: "rate_limited"` and a `Retry-After` header. See [Limits](/api-reference/limits/) for the wire shape.

V3 extends this model for external customers and quota enforcement. V1 uses it for internal trust boundaries.
