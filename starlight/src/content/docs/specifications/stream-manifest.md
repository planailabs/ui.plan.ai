---
title: Stream Manifest
description: The public projection of one or more Frame Packages — the canonical runtime artifact.
sidebar:
  order: 3
stability: stable
last_synced_with: "folder-7"
sources:
  - "7 codex-claude-dist-feedback/01-proposed-edits.md"
  - "4 claude-dist/02-decisions.md"
---

The Stream Manifest is the artifact the public runtime actually reads. It is a projection of one or more [Frame Packages](/specifications/frame-package/) into a cacheable, static, public-safe JSON file.

A Frame Package is private; a Stream Manifest is public. The two never share storage.

## File location

```
public/streams/<stream-id>/manifest.json
```

Served via CDN with long max-age and content-hash filenames for cache busting on revision.

## Top-level shape

```json
{
  "kind": "planai-ui-stream-manifest",
  "schemaVersion": "1",
  "stream": {
    "id": "ui-en-v1",
    "route": "/ui/{date}/",
    "locale": "en",
    "publishedAt": "2026-05-18T12:00:00Z"
  },
  "frames": [
    { /* projected frame entry */ }
  ],
  "freshness": {
    "sourceEventAt": "2026-05-18T11:42:00Z",
    "publishedAt": "2026-05-18T12:00:00Z",
    "staleAfter": "P7D"
  }
}
```

## Frame entry projection

A Stream Manifest frame entry contains **only** the public-projectable fields from a Frame Package:

| Field | From Frame Package | Notes |
|---|---|---|
| `id` | `frame.id` | Identical. |
| `title` | `frame.title` | Identical. |
| `altText` | `frame.altText` | Required for accessibility. |
| `variants` | `frame.variants` | Includes derivatives (AVIF/WebP paths). |
| `license` | derived from `licenseIntent` | `"CC0"` or `"mixed"`. |
| `thirdPartyAttributions` | `licenseIntent.thirdPartyAttributions` | Empty array if none. |
| `clickZones` | `clickZones` | Full projection. |
| `councilPublicSummary` | `council.publicSummary[]` | Public-designed sentences only. |
| `acceptance` | `{ acceptedBy, acceptedAt, licenseAsserted }` | Three fields only. |
| `boundAt` | derived | When the frame transitioned to `public-route-bound`. |

A field that does not appear in this table is **not** projected. The most important exclusions:

- `imagePrompt` — internal.
- `negativePrompt` — internal.
- `ownership` — internal.
- `agentRunId` — internal.
- `council.sourcePositions[]` — internal. See [Council fields](/specifications/council-fields/).
- `integrationNotes` — internal.

## Hard rule: the Frame Package wins on conflict

If a Frame Package field disagrees with what is in the Stream Manifest, the Frame Package is the source of truth. The Manifest is regenerated; the Package is not touched.

There is no field on the Manifest that exists only on the Manifest. Every field is either taken directly from the Package or derived deterministically from it.

## Derivation rules

The projection is implemented as a pure function `projectFramePackage(pkg) -> manifestEntry`. The function:

1. Selects only the fields in the table above.
2. Validates `altText` is non-empty and meets WCAG length guidance.
3. Substitutes `license: "mixed"` if `containsThirdPartyContent: true`, else `license: "CC0"`.
4. Resolves asset paths to public CDN URLs (signed-URL substitution does not apply in v1; all assets are CC0 and public).
5. Sorts `clickZones` by reading order for consistent screen-reader traversal.
6. Strips any extension field not declared in the v1 schema.

A re-projection of the same Frame Package always produces a byte-identical Manifest entry.

## Freshness block

Every Stream Manifest carries a top-level `freshness` block. The runtime uses this to surface a "stale" state in the overlay when content has not been refreshed within the declared window. See [Freshness semantics](/specifications/freshness-semantics/).

## What the manifest does not declare

- **Adaptive level capability.** The runtime picks its own level (0–3) based on device capability; the Manifest does not pin a level.
- **Reduced motion.** The runtime reads `prefers-reduced-motion` directly.
- **Pinning state.** Pinning is a runtime concern, not a manifest one.

## Versioning

A new `schemaVersion` requires a new Manifest filename so old clients do not break:

```
public/streams/ui-en-v1/manifest.v1.json
public/streams/ui-en-v1/manifest.v2.json
```

The runtime requests the highest version it can parse. There is no in-band negotiation; the URL is the contract.

## Sources

- `docs/7 codex-claude-dist-feedback/01-proposed-edits.md`
- `docs/4 claude-dist/02-decisions.md`
