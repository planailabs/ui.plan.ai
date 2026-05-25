---
title: Team members & invitations
description: How V1 adds, removes, and changes the role of plan.ai team members in a tenant.
sidebar:
  order: 17
stability: working
last_synced_with: "2026-05-22-llm-council-v1-pass"
verify_against:
  - https://supabase.com/docs/guides/auth/auth-email-passwordless
  - https://supabase.com/docs/guides/auth/auth-mfa
---

V1 is single-tenant in practice (the plan.ai team) but the schema is multi-tenant from day one. Adding a new team member is a small, deliberate flow — not self-service signup.

## Roles

V1 ships four roles per tenant. Full role matrix lives in [Agent roles](/reference/agent-roles/) — this page covers only membership lifecycle.

Membership management is **owner-only in V1**. This is enforced at the database layer in [Supabase SQL plan](/specifications/supabase-sql/) (`tenant_members` insert/update/delete policies are `owner`-only, plus a constraint preventing non-`owner` callers from updating `tenant_members.role`). Loosening this to `admin` is V2 work — it requires a separate policy + a UI guard, neither of which V1 ships.

| Role | Can invite | Can change roles | Can create API keys |
|---|---|---|---|
| `owner` | yes | yes (incl. other owners) | yes (MFA-gated) |
| `admin` | no | no | yes (MFA-gated) |
| `member` | no | no | no |
| `viewer` | no | no | no |

## Invitation flow

1. **An `owner` opens** Team settings in the workbench and submits an invitation: target email + role.
2. **The workbench calls** an Edge Function (`team-invitations.create`) which:
   - Verifies the caller is `owner` with `aal2`.
   - Inserts a row into `tenant_invitations(id, tenant_id, email, role, token_hash, invited_by, expires_at)` with `expires_at = now() + interval '7 days'`. `token_hash` is `HMAC-SHA256(API_KEY_PEPPER, raw_token)` — the raw token only leaves the Edge Function inside the email body. `redeemed_at` / `redeemed_by` stay null until step 3.
   - Sends an OTP-style email via Supabase Auth (`inviteUserByEmail`) with the redemption link pointing at `/workbench/accept-invite?token=<token>`. The token is a one-time, server-issued opaque string stored hashed (`HMAC-SHA256(API_KEY_PEPPER, token)`) — never the raw row id.
3. **The invitee clicks the link**, completes the OTP login if no Supabase Auth user exists yet, then the redemption endpoint:
   - Verifies the token hash and `expires_at`.
   - Creates the `tenant_members(tenant_id, user_id, role)` row in a transaction with stamping `redeemed_at` on the invitation.
   - Triggers MFA enrollment immediately for `owner`/`admin` (the API-keys screen will be locked until `aal2` is set).
4. **The new member lands** in the workbench with the role they were invited at.

## Failure states

| Condition | Response |
|---|---|
| Token expired | UI shows "this invite expired — ask your team to resend." No tenant context leaked. The partial unique index on `(tenant_id, email) where redeemed_at is null` means a resend must first DELETE the expired-but-unredeemed row (or stamp it `redeemed_at` as a tombstone) before inserting the new invitation. |
| Token already redeemed | Same generic copy as expired (do not distinguish — avoids enumeration). |
| Email mismatch (signed-in user differs from invitee) | UI tells the user to sign out and complete the link in a private tab. |
| Invitation revoked (an `owner` deletes the row) | Same generic copy as expired. |
| Tenant member already exists | Redirect to workbench, no-op on the invitation, mark `redeemed_at`. |

## Role changes & removal

- Role changes go through the same Edge Function (`team-invitations.update_role`); only `owner` callers may use it, and the database `tenant_members` UPDATE policy enforces the same in case the Edge Function is bypassed.
- Removing a member deletes the `tenant_members` row. The [last-owner guard](/specifications/supabase-sql/) prevents removing or demoting the last `owner` of a tenant. API keys owned by the removed member are **not** auto-revoked — they belong to the agent, not the user — but the audit event (`tenant_member.removed`) is appended to `frame_events`.
- A removed member's existing Supabase Auth session is invalidated on next request because RLS will return no rows for that tenant.

## What V1 does not do

- No public signup form.
- No tenant-to-tenant member sharing.
- No SCIM / directory sync.
- No "request to join" flow — invitations only.

Those are V2+ work.
