---
title: Frame Package
description: The canonical v1 source artifact — fields, contract, and example.
sidebar:
  order: 2
stability: stable
last_synced_with: "folder-7"
sources:
  - "1 brainstormings/20260517 2 Agents.md"
  - "4 claude-dist/02-decisions.md"
  - "6 codex-dist/02-decision-board.md"
  - "7 codex-claude-dist-feedback/01-proposed-edits.md"
---

The Frame Package is the canonical source artifact for one frame. It is private by default. The public-facing [Stream Manifest](/specifications/stream-manifest/) is a projection of one or more Frame Packages.

## File location

```
src/pages/<route>/<timestamp>/media-and-contents-info/next-frame.package.json
```

One Frame Package per directory. The directory's timestamp is the package's stable ID.

Validation: every Frame Package must declare `kind: "planai-ui-next-frame-content-package"`.

## Top-level fields

| Field | Type | Status | Description |
|---|---|---|---|
| `kind` | string | required | Always `"planai-ui-next-frame-content-package"`. |
| `schemaVersion` | string | required | The Frame Package shape version. v1 is `"1"`. |
| `stream` | object | required | Identifies which stream this frame belongs to. See [Stream object](#stream-object). |
| `status` | string | required | The current state in the [Promotion state machine](/specifications/promotion-state-machine/). |
| `ownership` | object | required | Who proposed and owns this package. See [Ownership object](#ownership-object). |
| `licenseIntent` | object | required | The asserted license posture for the frame's assets. See [License intent object](#license-intent-object). |
| `frame` | object | required | The frame's user-facing content: id, title, alt text, dimensions. See [Frame object](#frame-object). |
| `imagePrompt` | object | required | The prompt and parameters used (or to be used) to generate the master image. |
| `videoPrompt` | object | optional | Reserved. Not used in v1; populated for v2 video loops. |
| `council` | object | required | The agent council's discussion. See [Council fields](/specifications/council-fields/). |
| `clickZones` | array | required | The interactive regions on the frame. See [Click zones & overlays](/specifications/click-zones/). |
| `routeVersionMetadata` | object | required | The `appVersion`, `schemaVersion`, and `variant` this package targets. |
| `integrationNotes` | object | optional | Free-form notes carried with the package. Not projected to public. |
| `acceptance` | object | derived | Populated by the [Acceptance](/specifications/acceptance/) attestation. Set on transition to `route-promotion-approved`. |

The earlier brainstorm spec used `councilDiscussion`. The canonical name is `council`; the rename is a `working` migration tracked in [Quick wins](/process/quick-wins/).

## Stream object

```json
"stream": {
  "id": "ui-en-v1",
  "route": "/ui/{date}/",
  "locale": "en"
}
```

| Field | Type | Status | Description |
|---|---|---|---|
| `id` | string | required | Stable stream identifier. |
| `route` | string | required | Public route the stream binds to. |
| `locale` | string | required | BCP-47 locale code. v1 supports `en` and `de`. |

## Ownership object

```json
"ownership": {
  "proposedBy": "generationAgent",
  "agentRunId": "run_1779228000.main",
  "humanContact": "seb"
}
```

| Field | Type | Status | Description |
|---|---|---|---|
| `proposedBy` | string | required | The agent role that drafted the package. |
| `agentRunId` | string | required | The `run_<unix>.<channel>` identifier of the agent run. |
| `humanContact` | string | required | Team member responsible for promotion decisions. |

## License intent object

```json
"licenseIntent": {
  "licenseDefault": "CC0",
  "containsThirdPartyContent": false,
  "thirdPartyAttributions": []
}
```

| Field | Type | Status | Description |
|---|---|---|---|
| `licenseDefault` | string | required | The stream-level default. Always `"CC0"` in v1. |
| `containsThirdPartyContent` | boolean | required | Whether any asset on the frame is third-party. |
| `thirdPartyAttributions` | array | required | Empty if no third-party content; otherwise one entry per attribution. |

See [CC0 & human acceptance](/foundations/cc0-and-acceptance/).

## Frame object

```json
"frame": {
  "id": "ui-en-v1-low-hanging-fruit-radar",
  "title": "Low-Hanging Fruit Radar",
  "altText": "A dashboard scoring tasks by effort and reach...",
  "variants": {
    "desktop": { "width": 1672, "height": 941 },
    "mobile":  { "width": 941,  "height": 1672 },
    "thumbnail": { "width": 480, "height": 270 }
  }
}
```

| Field | Type | Status | Description |
|---|---|---|---|
| `id` | string | required | Globally unique frame ID. Pattern: `<stream-id>-<slug>`. |
| `title` | string | required | Public-safe title. Projected to Stream Manifest. |
| `altText` | string | required | WCAG-compliant alt text. Authored, not derived. |
| `variants` | object | required | At minimum `desktop` and `mobile`. Optional `thumbnail`. |

V1 dimensions: desktop `1672×941`, mobile `941×1672`, thumbnail `480×270`. Exceptions (e.g. `v0.1.20` shipped desktop `1672×940`) are tolerated but should be normalized on republication. See [Quick wins](/process/quick-wins/).

## Image prompt object

```json
"imagePrompt": {
  "imageGenerator": "openai-image",
  "prompt": "...",
  "negativePrompt": "",
  "parameters": { "style": "...", "seed": 4711 },
  "masterPath": "src/pages/.../master.png"
}
```

| Field | Type | Status | Description |
|---|---|---|---|
| `imageGenerator` | string | required | The model: `"openai-image"`, `"imagen"`, `"flux"`. |
| `prompt` | string | required | The full prompt used. |
| `negativePrompt` | string | optional | Negative prompt, if supported by the generator. |
| `parameters` | object | optional | Generator-specific knobs. |
| `masterPath` | string | required when `status` ≥ `asset-generated` | Path to the master file. |

## Public/private field split

The Stream Manifest projects only the following Frame Package fields:

- `kind`, `schemaVersion`, `stream`, `status`
- `frame.id`, `frame.title`, `frame.altText`, `frame.variants`
- `licenseIntent.licenseDefault`, `licenseIntent.containsThirdPartyContent`, `licenseIntent.thirdPartyAttributions`
- `clickZones` (always; see [Click zones & overlays](/specifications/click-zones/))
- `council.publicSummary[]` (designed-public)
- `acceptance.acceptedBy`, `acceptance.acceptedAt`, `acceptance.licenseAsserted`

Everything else stays private. See [Stream Manifest](/specifications/stream-manifest/) for the projection rules.

## Example (abridged)

```json
{
  "kind": "planai-ui-next-frame-content-package",
  "schemaVersion": "1",
  "stream": { "id": "ui-en-v1", "route": "/ui/2026-05-18/", "locale": "en" },
  "status": "public-route-bound",
  "ownership": {
    "proposedBy": "generationAgent",
    "agentRunId": "run_1779228000.main",
    "humanContact": "seb"
  },
  "licenseIntent": {
    "licenseDefault": "CC0",
    "containsThirdPartyContent": false,
    "thirdPartyAttributions": []
  },
  "frame": {
    "id": "ui-en-v1-low-hanging-fruit-radar",
    "title": "Low-Hanging Fruit Radar",
    "altText": "A dashboard...",
    "variants": {
      "desktop":   { "width": 1672, "height": 941 },
      "mobile":    { "width": 941,  "height": 1672 },
      "thumbnail": { "width": 480,  "height": 270 }
    }
  },
  "imagePrompt": { "imageGenerator": "openai-image", "prompt": "...", "masterPath": "src/pages/.../master.png" },
  "council": {
    "publicSummary": [
      { "voice": "Produktherz", "line": "This frame is the cheapest test of the soul thread." }
    ],
    "sourcePositions": [
      { "voice": "Produktherz", "line": "..." }
    ]
  },
  "clickZones": [],
  "routeVersionMetadata": { "appVersion": "1.0.0", "schemaVersion": "1", "variant": "desktop" },
  "acceptance": {
    "acceptedBy": "seb",
    "acceptedAt": "2026-05-18T12:00:00Z",
    "licenseAsserted": "CC0"
  }
}
```

The full JSON Schema lives at [Reference / Schemas / Frame Package](/reference/schemas/frame-package/).

## Sources

- `docs/1 brainstormings/20260517 2 Agents.md`
- `docs/4 claude-dist/02-decisions.md`
- `docs/6 codex-dist/02-decision-board.md`
- `docs/7 codex-claude-dist-feedback/01-proposed-edits.md`
