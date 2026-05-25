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

## OTP email template

The OTP email is Supabase Auth's "Magic Link" template, customized per environment so an operator can tell at a glance which environment they just signed into.

| Field | Value |
|---|---|
| From name | `ui.plan.ai` |
| From address | `auth@ui.plan.ai` (DKIM + SPF for `plan.ai` must be configured before prod). |
| Subject (prod) | `Sign in to ui.plan.ai` |
| Subject (preview) | `[PREVIEW] Sign in to ui.plan.ai` |
| Subject (dev) | `[DEV] Sign in to ui.plan.ai` |
| Body | Single CTA button + the 6-digit code as a plain-text fallback. No marketing copy. |
| Link expiry | 10 minutes (`OTP_EXPIRY` = 600). |
| Link single-use | Yes (Supabase default). |

The redirect target on the link is always the environment's primary domain (no per-PR preview URL in the link itself). The body is plain text + minimal inline HTML — no remote images, no tracking pixels, no third-party fonts. Upstream: [Supabase email templates](https://supabase.com/docs/guides/auth/auth-email-templates).

## Identity boundary

Team members authenticate as users. Agents authenticate with API keys. Agent scripts must not use team-member browser sessions.
