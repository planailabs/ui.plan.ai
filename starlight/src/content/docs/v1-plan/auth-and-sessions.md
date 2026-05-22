---
title: Auth & sessions
description: Browser authentication and session storage expectations for V1.
sidebar:
  order: 7
stability: stable
last_synced_with: "2026-05-22-llm-council-v1-pass"
verify_against:
  - https://supabase.com/docs/guides/auth/sessions/pkce-flow
  - https://supabase.com/docs/guides/auth/auth-mfa
  - https://supabase.com/docs/guides/auth/redirect-urls
---

V1 browser auth uses Supabase Auth for plan.ai team members. The upstream contract is the source of truth for current flow defaults — see [Upstream docs](/reference/upstream-docs/) for the latest links.

## Sign-in method

V1 supports **one** browser sign-in method: magic-link email OTP. No passwords, no third-party OAuth in V1. This keeps the surface small and removes password-reset and provider-callback edge cases from the V1 plan.

OAuth providers (GitHub, Google) and passkeys are V2+ work.

## Browser session rule

- Use PKCE.
- Persist the browser session in `sessionStorage`.
- Do not use cookies as the default auth transport.
- Do not use `localStorage` as the default session store.
- Browser data access goes through Supabase RLS.

`sessionStorage` is a deliberate trade-off: a fresh tab is logged out, but a stolen disk profile cannot replay tokens. The workbench is operator software, not a consumer surface — a re-login per tab is acceptable.

This follows the useful auth pattern from `plan.ai-chat-turk` as inspiration, while keeping the schema and product model specific to `ui.plan.ai`.

## MFA

`owner` and `admin` accounts **must** enroll TOTP via Supabase MFA before creating or rotating API keys. The workbench gates the API-keys screen on `aal2`. `member` and `viewer` may enroll voluntarily.

Upstream: [MFA guide](https://supabase.com/docs/guides/auth/auth-mfa).

## Redirect allowlist

The Supabase Auth `Site URL` and `Additional Redirect URLs` are pinned per environment in [Secrets & environments](/reference/secrets-and-environments/). When a Cloudflare Pages preview domain rotates, the preview project's allowlist is updated in the same PR — never copy preview entries into prod.

## Login hardening

The browser login form embeds Cloudflare Turnstile. Edge Functions verify the Turnstile token before requesting an OTP, to keep magic-link emails from being weaponized as a spam channel.

Upstream: [Turnstile](https://developers.cloudflare.com/turnstile/).

## Identity boundary

Team members authenticate as users. Agents authenticate with API keys. Agent scripts must not use team-member browser sessions.
