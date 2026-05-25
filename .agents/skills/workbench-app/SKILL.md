---
name: workbench-app
description: Conventions for the authenticated `/workbench/*` app — routing, layout, auth, and the spec-link discipline.
---

# Workbench app

The workbench is the authenticated operating surface for tenant members. It lives under `src/pages/workbench/` in the **root** Astro app (not in a separate workspace package). Pages are fully static; auth + data fetching are client-side via `@supabase/supabase-js`.

## Hard rules

- Every page uses `src/layouts/Workbench.astro` and passes a `spec` URL pointing at its source doc under `/docs/v1-plan/...`. The pill renders the link — keeps every screen one click from its source-of-truth contract.
- Every page is guarded by default. Pass `guarded={false}` only on `login.astro` and `accept-invite.astro`.
- Browser code never imports the service-role key. The browser uses anon key + RLS + Edge Functions. If you find yourself needing the service role from the browser, you need a new Edge Function instead — see `supabase-setup` skill.
- `<meta name="robots" content="noindex,nofollow">` is set by the layout. Don't override.
- CF Pages serves `/workbench/*` with `Cache-Control: private, no-store` (see `public/_headers`). Don't add per-page caching.

## Layout

```
src/
├── pages/
│   ├── index.astro                       # marketing/start; build-time platform-status detection
│   └── workbench/
│       ├── index.astro                   # / → links to inbox
│       ├── login.astro                   # email OTP → MFA TOTP
│       ├── accept-invite.astro           # ?token=… invitation redeem
│       ├── inbox.astro                   # review queue (scaffold)
│       ├── frames/[id].astro             # frame detail (scaffold; preview path emitted)
│       ├── channels.astro
│       ├── agents.astro
│       ├── api-keys.astro
│       ├── approval-settings.astro
│       ├── team.astro                    # owner-only writes via team-invitations Edge Function
│       └── settings.astro
├── layouts/Workbench.astro               # sidebar + main + auth guard
└── lib/
    ├── env.ts                            # PUBLIC_* + isPlatformWired()
    ├── supabase.ts                       # singleton browser client (null when not configured)
    └── auth-client.ts                    # sendEmailOtp / verifyEmailOtp / challengeMfa / verifyMfa / requireSession
```

## Auth flow

1. `login.astro`: email + Turnstile token → `sendEmailOtp` → 6-digit OTP form → `verifyEmailOtp` → `challengeMfa` → TOTP form → `verifyMfa` → redirect `/workbench/inbox/`.
2. Every other page mounts `requireSession()` at the bottom of the layout; it reads the session cookie and redirects to `/workbench/login/` on miss.
3. AAL2-required actions (team mutations) are enforced server-side by the `team-invitations` Edge Function, not by client code. Client UX should still gate the button on `aal === 'aal2'`.

## Adding a new screen

1. Add a page under `src/pages/workbench/<slug>.astro` using the layout with a `spec` prop.
2. If it's reachable from the sidebar, add it to the `sections` array inside `Workbench.astro`.
3. If it triggers a server mutation, add or extend an Edge Function under `supabase/functions/<name>/` — never embed write logic in the page.
4. Update `docs/v1-plan/workbench.md` if you added a screen the spec doesn't list yet.

## Anti-patterns

- Server-side rendering. Static Astro only — adding an SSR adapter requires a deployment-skill change, a council pass, and a user ask.
- `<form method="post">` to anywhere except an Edge Function. There is no server in the Pages app.
- Reading secrets at runtime in the browser. All config is `PUBLIC_*` and resolved at build time.
- Skipping the spec pill. The pill is the contract handoff.
