---
title: Acceptance attestation
description: The attested record that gates the promotion of a Frame Package to public.
sidebar:
  order: 5
stability: stable
last_synced_with: "folder-7"
sources:
  - "7 codex-claude-dist-feedback/01-proposed-edits.md"
  - "4 claude-dist/02-decisions.md"
---

Acceptance is the attested record that a human team member has reviewed a Frame Package and approved its public projection. It is the **only** evidence that crosses the [Promotion gate](/foundations/promotion-gate/).

We call it **attested**, not signed. No cryptographic signing is involved in v1. The legal force comes from a verified GitHub identity merging a PR containing this file.

## File location

```
promotions/<frame-id>/acceptance.json
```

One file per frame, committed in the same PR that flips the Frame Package's `status` to `route-promotion-approved`.

## Shape

```json
{
  "kind": "planai-ui-acceptance",
  "schemaVersion": "1",
  "frameId": "ui-en-v1-low-hanging-fruit-radar",
  "framePackagePath": "src/pages/ui/2026-05-18/.../next-frame.package.json",
  "acceptedBy": "seb",
  "acceptedAt": "2026-05-18T12:00:00Z",
  "licenseAsserted": "CC0",
  "thirdPartyAttributionsReviewed": true,
  "reviewNote": "Looked good. Click zones all keyboard-reachable. Alt text matches the actual frame."
}
```

| Field | Type | Status | Description |
|---|---|---|---|
| `kind` | string | required | Always `"planai-ui-acceptance"`. |
| `schemaVersion` | string | required | The Acceptance shape version. v1 is `"1"`. |
| `frameId` | string | required | Must match the Frame Package's `frame.id`. |
| `framePackagePath` | string | required | Repo-relative path to the Frame Package being accepted. |
| `acceptedBy` | string | required | The team member's verified GitHub login. CI checks against an allow-list. |
| `acceptedAt` | string (ISO 8601) | required | When acceptance was committed. |
| `licenseAsserted` | string | required | `"CC0"` or `"mixed"`. Must match the projected `licenseIntent`. |
| `thirdPartyAttributionsReviewed` | boolean | required | If the frame has third-party attributions, the team member confirms they have been reviewed. |
| `reviewNote` | string | required | Short, free-form note. What the team member checked. |

## What acceptance asserts

Acceptance asserts that the team member:

- Reviewed the frame's master and the rendered click zones.
- Verified the alt text matches the visible content.
- Confirmed the license posture (CC0 default, third-party exceptions where marked).
- Walked the frame keyboard-first and confirmed focus order.
- Confirmed no private data is leaked in the visible content.

Acceptance does **not** assert:

- That the council positions are correct.
- That the prompts are reproducible.
- That the master would re-generate identically.

## What CI enforces

- `acceptedBy` must be in the allow-list at `promotions/team.json`.
- `acceptedAt` must be no more than 7 days old at the time of merge.
- `frameId` and `framePackagePath` must resolve to a real Frame Package whose `status` is `license-reviewed`.
- `licenseAsserted` must match the projected `licenseIntent`.
- `reviewNote` must be ≥ 20 characters. A blank or token note fails the build.

## Multiple acceptances

A frame may have multiple `acceptance.json` files over its lifetime — one for the original bind, one per re-bind after revert, one per substantive re-projection. Each is kept in version control; nothing is overwritten.

The most recent acceptance is the one projected into the Stream Manifest. Earlier acceptances are part of the audit trail.

## Future: cryptographic signing

If and when external contributors enter the system, attestation may need to harden into actual signing (e.g., Sigstore, signed commits). The migration path is tracked in [v1.1 & v2+ candidates](/roadmap-and-open-questions/v1-1-and-v2-candidates/).

## Sources

- `docs/7 codex-claude-dist-feedback/01-proposed-edits.md`
- `docs/4 claude-dist/02-decisions.md`
