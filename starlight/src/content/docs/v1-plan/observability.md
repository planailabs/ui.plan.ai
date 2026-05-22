---
title: Observability
description: V1 logging, request IDs, and operational visibility expectations.
sidebar:
  order: 15
stability: working
last_synced_with: "2026-05-22-llm-council-v1-pass"
---

V1 is small but multi-tenant from day one. Operators need to answer "what happened to this submission?" without grepping production.

## Request IDs

- Every Agent API request gets a server-issued `request_id` (UUIDv7) on entry.
- Edge Functions echo it as the `X-Request-Id` response header.
- Every row in `frame_events` written by an API-originated path stores `request_id` in `payload`.
- The workbench surfaces `request_id` on frame detail so an engineer can pivot from a support report straight to logs.

See the error envelope in [API errors](/api-reference/errors/).

## Structured logs

Edge Function logs are line-delimited JSON with at least:

```json
{
  "level": "info",
  "ts": "2026-05-22T13:01:14.221Z",
  "request_id": "0190fd33-...",
  "api_key_id": "ak_01H...",
  "tenant_id": "...",
  "route": "POST /v1/frame-submissions",
  "status": 202,
  "duration_ms": 41
}
```

No raw API tokens, no PII, no full metadata blobs in logs.

## Where logs go

- Supabase Edge Function logs ship to the project's [log explorer](https://supabase.com/docs/guides/functions/logging) plus a long-retention sink (Logflare or Axiom).
- Cloudflare Pages access logs ship via [Logpush](https://developers.cloudflare.com/logs/about/) to the same sink.
- One workbench operations dashboard pivots on `request_id`, `tenant_id`, and `api_key_id`.

## Realtime as audit

`frame_events` doubles as the V3 billing source. It is **append-only** in V1 — no UPDATE or DELETE policies. Anything that needs correcting writes a new compensating event.
