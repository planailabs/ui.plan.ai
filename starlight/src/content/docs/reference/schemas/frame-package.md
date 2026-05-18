---
title: Schema — Frame Package
description: JSON Schema (Draft 2020-12) for the v1 Frame Package artifact.
sidebar:
  order: 1
stability: working
last_synced_with: "folder-7"
sources:
  - "1 brainstormings/20260517 2 Agents.md"
  - "4 claude-dist/02-decisions.md"
---

Canonical contract for [Frame Package](/specifications/frame-package/). The prose spec page is authoritative for *meaning*; this schema is authoritative for *shape*.

`stability: working` because the field names and the public/private projection rules are still being refined as the new project starts. Implementers should expect the JSON Schema to evolve in lockstep with code through the first few weeks of v1 build.

## JSON Schema

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "$id": "https://ui.plan.ai/schemas/frame-package-v1.json",
  "title": "Frame Package",
  "type": "object",
  "required": [
    "kind",
    "schemaVersion",
    "stream",
    "status",
    "ownership",
    "licenseIntent",
    "frame",
    "imagePrompt",
    "council",
    "clickZones",
    "routeVersionMetadata"
  ],
  "additionalProperties": false,
  "properties": {
    "kind": { "const": "planai-ui-next-frame-content-package" },
    "schemaVersion": { "const": "1" },
    "stream": {
      "type": "object",
      "required": ["id", "route", "locale"],
      "additionalProperties": false,
      "properties": {
        "id": { "type": "string", "pattern": "^[a-z0-9-]+$" },
        "route": { "type": "string", "pattern": "^/" },
        "locale": { "type": "string", "enum": ["en", "de"] }
      }
    },
    "status": {
      "type": "string",
      "enum": [
        "metadata-only-proposal",
        "candidate-for-generation",
        "asset-generated",
        "local-browser-proof",
        "clickzone-validated",
        "license-reviewed",
        "route-promotion-approved",
        "public-route-bound"
      ]
    },
    "ownership": {
      "type": "object",
      "required": ["proposedBy", "agentRunId", "humanContact"],
      "additionalProperties": false,
      "properties": {
        "proposedBy": { "type": "string" },
        "agentRunId": { "type": "string", "pattern": "^run_[0-9]+\\.[a-z]+$" },
        "humanContact": { "type": "string" }
      }
    },
    "licenseIntent": {
      "type": "object",
      "required": ["licenseDefault", "containsThirdPartyContent", "thirdPartyAttributions"],
      "additionalProperties": false,
      "properties": {
        "licenseDefault": { "const": "CC0" },
        "containsThirdPartyContent": { "type": "boolean" },
        "thirdPartyAttributions": {
          "type": "array",
          "items": {
            "type": "object",
            "required": ["source", "author", "license", "usage", "publicDomainExcluded"],
            "additionalProperties": false,
            "properties": {
              "source": { "type": "string" },
              "author": { "type": "string" },
              "license": { "type": "string" },
              "usage": { "type": "string" },
              "publicDomainExcluded": { "type": "boolean" }
            }
          }
        }
      }
    },
    "frame": {
      "type": "object",
      "required": ["id", "title", "altText", "variants"],
      "additionalProperties": false,
      "properties": {
        "id": { "type": "string", "pattern": "^[a-z0-9-]+$" },
        "title": { "type": "string", "minLength": 1, "maxLength": 80 },
        "altText": { "type": "string", "minLength": 5, "maxLength": 250 },
        "variants": {
          "type": "object",
          "required": ["desktop", "mobile"],
          "additionalProperties": false,
          "properties": {
            "desktop":   { "$ref": "#/$defs/variantDims" },
            "mobile":    { "$ref": "#/$defs/variantDims" },
            "thumbnail": { "$ref": "#/$defs/variantDims" }
          }
        }
      }
    },
    "imagePrompt": {
      "type": "object",
      "required": ["imageGenerator", "prompt"],
      "additionalProperties": false,
      "properties": {
        "imageGenerator": { "type": "string", "enum": ["openai-image", "imagen", "flux", "ideogram", "recraft"] },
        "prompt": { "type": "string", "minLength": 1 },
        "negativePrompt": { "type": "string" },
        "parameters": { "type": "object" },
        "masterPath": { "type": "string" }
      }
    },
    "videoPrompt": { "type": ["object", "null"] },
    "council": {
      "type": "object",
      "required": ["question", "publicSummary", "sourcePositions"],
      "additionalProperties": false,
      "properties": {
        "question": { "type": "string", "minLength": 1 },
        "publicSummary": {
          "type": "array",
          "items": {
            "type": "object",
            "required": ["voice", "line"],
            "additionalProperties": false,
            "properties": {
              "voice": { "type": "string", "enum": ["Architekt", "Produktherz", "Skeptiker", "Hüter", "Bauer"] },
              "line":  { "type": "string", "minLength": 1, "maxLength": 200 }
            }
          }
        },
        "sourcePositions": {
          "type": "array",
          "items": {
            "type": "object",
            "required": ["voice", "line"],
            "properties": {
              "voice": { "type": "string", "enum": ["Architekt", "Produktherz", "Skeptiker", "Hüter", "Bauer"] },
              "line":  { "type": "string" },
              "atRun": { "type": "string" }
            }
          }
        },
        "decision": { "type": "string" },
        "decisionLogEntry": { "type": "string", "pattern": "^D-\\d{4}-\\d{2}-\\d{2}-\\d{3}$" }
      }
    },
    "clickZones": {
      "type": "array",
      "items": {
        "type": "object",
        "required": ["id", "shape", "bboxNorm", "role", "label", "action", "states", "source", "tabIndex"],
        "additionalProperties": false,
        "properties": {
          "id": { "type": "string" },
          "shape": { "type": "string", "enum": ["rect", "roundedRect"] },
          "bboxNorm": {
            "type": "array",
            "items": { "type": "number", "minimum": 0, "maximum": 1 },
            "minItems": 4,
            "maxItems": 4
          },
          "cornerRadiusNorm": { "type": "number", "minimum": 0, "maximum": 1 },
          "role": { "type": "string", "enum": ["button", "card", "link", "tab", "nav", "input", "share", "connect"] },
          "label": { "type": "string", "minLength": 1 },
          "action": { "type": "string", "enum": ["advance", "inspect", "pin", "share", "open-link"] },
          "states": {
            "type": "array",
            "items": { "type": "string", "enum": ["hover", "focus", "pressed", "active", "disabled", "loading", "selected"] },
            "minItems": 3
          },
          "confidence": { "type": "number", "minimum": 0, "maximum": 1 },
          "source": { "type": "string", "enum": ["agent-authored", "vision-derived"] },
          "tabIndex": { "type": "integer", "minimum": 1 }
        }
      }
    },
    "routeVersionMetadata": {
      "type": "object",
      "required": ["appVersion", "schemaVersion", "variant"],
      "additionalProperties": false,
      "properties": {
        "appVersion": { "type": "string" },
        "schemaVersion": { "const": "1" },
        "variant": { "type": "string", "enum": ["desktop", "mobile"] }
      }
    },
    "integrationNotes": { "type": "object" },
    "watchBuilder": {
      "type": "object",
      "properties": {
        "subtype": { "type": "string", "enum": ["next-frame-selector", "promotion-readiness-board"] },
        "subjectAgentRunId": { "type": "string" },
        "sourceEventAt": { "type": "string", "format": "date-time" },
        "candidates": { "type": "array" },
        "blockers": { "type": "array" },
        "decisionLogEntry": { "type": "string" }
      }
    },
    "acceptance": {
      "type": "object",
      "required": ["acceptedBy", "acceptedAt", "licenseAsserted"],
      "additionalProperties": false,
      "properties": {
        "acceptedBy": { "type": "string" },
        "acceptedAt": { "type": "string", "format": "date-time" },
        "licenseAsserted": { "type": "string", "enum": ["CC0", "mixed"] }
      }
    }
  },
  "$defs": {
    "variantDims": {
      "type": "object",
      "required": ["width", "height"],
      "additionalProperties": false,
      "properties": {
        "width": { "type": "integer", "minimum": 1 },
        "height": { "type": "integer", "minimum": 1 }
      }
    }
  }
}
```

## Validation rules beyond the schema

CI applies these checks even when the JSON Schema passes:

- `frame.altText` must not equal `frame.title`.
- Every `clickZones[].states` array must include `"hover"`, `"focus"`, and `"pressed"`.
- `licenseIntent.thirdPartyAttributions` is non-empty if and only if `containsThirdPartyContent: true`.
- `acceptance` block is required when `status` is `route-promotion-approved` or `public-route-bound`.

## Sources

- `docs/1 brainstormings/20260517 2 Agents.md`
- `docs/4 claude-dist/02-decisions.md`
