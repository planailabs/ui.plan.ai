---
title: Auth & sessions
description: Browser authentication and session storage expectations for V1.
sidebar:
  order: 7
stability: stable
last_synced_with: "2026-05-21-v1-v2-v3-audit"
---

V1 browser auth uses Supabase Auth for Plan.ai team members.

## Browser session rule

- Use PKCE.
- Persist the browser session in `sessionStorage`.
- Do not use cookies as the default auth transport.
- Do not use `localStorage` as the default session store.
- Browser data access goes through Supabase RLS.

This follows the useful auth pattern from `plan.ai-chat-turk` as inspiration, while keeping the schema and product model specific to `ui.plan.ai`.

## Identity boundary

Team members authenticate as users. Agents authenticate with API keys. Agent scripts must not use team-member browser sessions.
