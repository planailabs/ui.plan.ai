---
title: Schema — Acceptance
description: JSON Schema (Draft 2020-12) for the v1 Acceptance attestation.
sidebar:
  order: 3
stability: stable
last_synced_with: "folder-7"
sources:
  - "7 codex-claude-dist-feedback/01-proposed-edits.md"
  - "4 claude-dist/02-decisions.md"
---

Canonical contract for [Acceptance attestation](/specifications/acceptance/).

## JSON Schema

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "$id": "https://ui.plan.ai/schemas/acceptance-v1.json",
  "title": "Acceptance",
  "type": "object",
  "required": [
    "kind",
    "schemaVersion",
    "frameId",
    "framePackagePath",
    "acceptedBy",
    "acceptedAt",
    "licenseAsserted",
    "thirdPartyAttributionsReviewed",
    "reviewNote"
  ],
  "additionalProperties": false,
  "properties": {
    "kind": { "const": "planai-ui-acceptance" },
    "schemaVersion": { "const": "1" },
    "frameId": { "type": "string", "pattern": "^[a-z0-9-]+$" },
    "framePackagePath": { "type": "string" },
    "acceptedBy": { "type": "string", "minLength": 1 },
    "acceptedAt": { "type": "string", "format": "date-time" },
    "licenseAsserted": { "type": "string", "enum": ["CC0", "mixed"] },
    "thirdPartyAttributionsReviewed": { "type": "boolean" },
    "reviewNote": { "type": "string", "minLength": 20 }
  }
}
```

## CI checks beyond the schema

- `acceptedBy` must be in the allow-list at `promotions/team.json`.
- `acceptedAt` must be within 7 days of the merge timestamp.
- `frameId` must reference a Frame Package whose `status` is `license-reviewed`.
- `licenseAsserted` must match the projected `licenseIntent`.

## Sources

- `docs/7 codex-claude-dist-feedback/01-proposed-edits.md`
- `docs/4 claude-dist/02-decisions.md`
