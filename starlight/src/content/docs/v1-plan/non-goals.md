---
title: Non-goals
description: Twelve things v1 deliberately does not ship.
sidebar:
  order: 3
stability: stable
last_synced_with: "folder-7"
sources:
  - "3 claude/05-principles-and-non-goals.md"
---

The point of a non-goals list is to be able to say *no* without rediscussing. If you want to add something to v1 that is on this list, that is a real change of direction — not an oversight.

Everything on this list is *worth doing eventually*. None of it is v1.

1. **Multi-tenant URLs** (`/u/{username}`). v1 is single-tenant.
2. **A hosted Supabase backend.** Generation runs offline; runtime is static.
3. **A public API for external agents.** First-party only.
4. **Video or animated frames.** Stills only. Level 3 reserved.
5. **A full Hub feature.** The minimal overlay is v1; richer Hub is v2+.
6. **Livestreaming** (OBS or hosted). Static-interactive only.
7. **Billing, metering, or paid tiers.** No monetization in v1.
8. **Mobile native apps.** Web only.
9. **User-to-user comments, likes, or community.** No social layer.
10. **Stream forking, remixing, or branching.** One canonical stream.
11. **Localization beyond `en` and `de`.** Additional locales are v1.1+.
12. **Custom themes, fonts, or palettes per user.** Single visual identity.

## Why this list exists

Principle 4 says agents commit, humans promote. Without a non-goals list, every PR is a re-litigation of scope. With one, scope creep gets named the moment it appears.

## Promoting a non-goal to a goal

A non-goal becomes a goal only by:

1. A [Decision log](/roadmap-and-open-questions/decision-log/) entry naming the non-goal and the council's reasoning for promoting it.
2. A new [Research packet](/roadmap-and-open-questions/research-packets/) (if the non-goal needs investigation first).
3. A target version (v1.1, v2). Promoted non-goals never become "in flight" without a version.

## Sources

- `docs/3 claude/05-principles-and-non-goals.md`
