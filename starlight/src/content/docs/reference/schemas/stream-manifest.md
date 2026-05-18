---
title: Schema — Stream Manifest
description: JSON Schema (Draft 2020-12) for the v1 Stream Manifest artifact.
sidebar:
  order: 2
stability: working
last_synced_with: "folder-7"
sources:
  - "7 codex-claude-dist-feedback/01-proposed-edits.md"
  - "4 claude-dist/02-decisions.md"
---

Canonical contract for [Stream Manifest](/specifications/stream-manifest/). The prose spec page is authoritative for projection rules; this schema is authoritative for shape.

## JSON Schema

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "$id": "https://ui.plan.ai/schemas/stream-manifest-v1.json",
  "title": "Stream Manifest",
  "type": "object",
  "required": ["kind", "schemaVersion", "stream", "frames", "freshness"],
  "additionalProperties": false,
  "properties": {
    "kind": { "const": "planai-ui-stream-manifest" },
    "schemaVersion": { "const": "1" },
    "stream": {
      "type": "object",
      "required": ["id", "route", "locale", "publishedAt"],
      "additionalProperties": false,
      "properties": {
        "id": { "type": "string" },
        "route": { "type": "string" },
        "locale": { "type": "string", "enum": ["en", "de"] },
        "publishedAt": { "type": "string", "format": "date-time" }
      }
    },
    "frames": {
      "type": "array",
      "items": {
        "type": "object",
        "required": ["id", "title", "altText", "variants", "license", "clickZones", "acceptance", "boundAt"],
        "additionalProperties": false,
        "properties": {
          "id": { "type": "string" },
          "title": { "type": "string" },
          "altText": { "type": "string" },
          "variants": {
            "type": "object",
            "additionalProperties": {
              "type": "object",
              "required": ["width", "height", "avif", "webp"],
              "properties": {
                "width": { "type": "integer" },
                "height": { "type": "integer" },
                "avif": { "type": "string" },
                "webp": { "type": "string" },
                "png":  { "type": "string" }
              }
            }
          },
          "license": { "type": "string", "enum": ["CC0", "mixed"] },
          "thirdPartyAttributions": { "type": "array" },
          "clickZones": { "type": "array" },
          "councilPublicSummary": {
            "type": "array",
            "items": {
              "type": "object",
              "required": ["voice", "line"],
              "properties": {
                "voice": { "type": "string" },
                "line":  { "type": "string" }
              }
            }
          },
          "acceptance": {
            "type": "object",
            "required": ["acceptedBy", "acceptedAt", "licenseAsserted"],
            "properties": {
              "acceptedBy": { "type": "string" },
              "acceptedAt": { "type": "string", "format": "date-time" },
              "licenseAsserted": { "type": "string" }
            }
          },
          "boundAt": { "type": "string", "format": "date-time" },
          "freshness": {
            "type": "object",
            "properties": {
              "sourceEventAt": { "type": "string", "format": "date-time" },
              "staleAfter": { "type": "string" },
              "visibleStaleState": { "type": "string", "enum": ["muted", "banner", "hidden"] }
            }
          },
          "watchBuilder": {
            "type": "object",
            "properties": {
              "subtype": { "type": "string" },
              "sourceEventAt": { "type": "string", "format": "date-time" }
            }
          }
        }
      }
    },
    "freshness": {
      "type": "object",
      "required": ["sourceEventAt", "publishedAt", "staleAfter", "visibleStaleState"],
      "properties": {
        "sourceEventAt": { "type": "string", "format": "date-time" },
        "publishedAt": { "type": "string", "format": "date-time" },
        "staleAfter": { "type": "string" },
        "visibleStaleState": { "type": "string", "enum": ["muted", "banner", "hidden"] }
      }
    }
  }
}
```

## Projection invariants

A re-projection of the same set of Frame Packages must produce byte-identical Manifest output. The projection function is pure and deterministic.

- No field on the Manifest exists that is not derivable from one or more Frame Packages.
- The Manifest filename includes a content hash for cache busting.
- `schemaVersion` changes require a new Manifest URL path; clients negotiate by URL, not by content.

## Sources

- `docs/7 codex-claude-dist-feedback/01-proposed-edits.md`
- `docs/4 claude-dist/02-decisions.md`
