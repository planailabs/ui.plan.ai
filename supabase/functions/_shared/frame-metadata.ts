// Hand-rolled validator for frame-submission metadata. Mirrors the published
// contract: starlight/public/specs/schemas/frame-submission-metadata.v1.schema.json.
// We avoid a JSON-schema library to keep the Deno edge cold start light.
//
// Both ingress endpoints (frame-submissions, media-uploads) validate the same
// nested shape, so agent/channel/date are derived from validated metadata
// rather than from loose top-level fields.

export const FRAME_METADATA_SCHEMA_VERSION = "ui.plan.ai/frame-metadata.v1";

const SLUG_RE = /^[a-z0-9][a-z0-9-]{1,62}[a-z0-9]$/;
const DATE_RE = /^\d{8}$/;
const LICENSE_INTENTS = new Set(["cc0", "non_cc0", "third_party", "unknown"]);

const TOP_KEYS = new Set(["schema_version", "agent", "channel", "frame", "license", "click_zones", "metadata"]);
const AGENT_KEYS = new Set(["slug", "run_id", "model"]);
const CHANNEL_KEYS = new Set(["slug"]);
const FRAME_KEYS = new Set(["title", "alt_text", "date", "sequence_key"]);
const LICENSE_KEYS = new Set(["intent", "attribution"]);

export interface ValidatedFrameMetadata {
  schemaVersion: string;
  agentSlug: string;
  channelSlug: string;
  dateKey: string;
  title: string;
  altText: string;
}

export interface ValidationError {
  path: string;
  message: string;
}

export type ValidationResult =
  | { ok: true; value: ValidatedFrameMetadata }
  | { ok: false; errors: ValidationError[] };

function isObject(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null && !Array.isArray(v);
}

function isRealDateKey(d: string): boolean {
  if (!DATE_RE.test(d)) return false;
  const year = Number(d.slice(0, 4));
  const month = Number(d.slice(4, 6));
  const day = Number(d.slice(6, 8));
  const date = new Date(Date.UTC(year, month - 1, day));
  return (
    date.getUTCFullYear() === year &&
    date.getUTCMonth() === month - 1 &&
    date.getUTCDate() === day
  );
}

export function validateFrameMetadata(input: unknown): ValidationResult {
  const errors: ValidationError[] = [];
  const push = (path: string, message: string) => errors.push({ path, message });

  if (!isObject(input)) {
    return { ok: false, errors: [{ path: "/", message: "metadata must be a JSON object" }] };
  }

  for (const k of Object.keys(input)) {
    if (!TOP_KEYS.has(k)) push(`/${k}`, "unknown top-level key");
  }

  if (input.schema_version !== FRAME_METADATA_SCHEMA_VERSION) {
    push("/schema_version", `must equal "${FRAME_METADATA_SCHEMA_VERSION}"`);
  }

  let agentSlug = "";
  if (!isObject(input.agent)) {
    push("/agent", "required object");
  } else {
    for (const k of Object.keys(input.agent)) {
      if (!AGENT_KEYS.has(k)) push(`/agent/${k}`, "unknown key");
    }
    const slug = input.agent.slug;
    if (typeof slug !== "string" || !SLUG_RE.test(slug)) push("/agent/slug", "required slug");
    else agentSlug = slug;
    for (const k of ["run_id", "model"] as const) {
      const v = input.agent[k];
      if (v !== undefined && (typeof v !== "string" || v.length > 160)) push(`/agent/${k}`, "string ≤160 chars");
    }
  }

  // channel.slug is documented with a "main" default; treat a missing channel
  // as the main channel rather than rejecting (docs as intent, not strict law).
  let channelSlug = "main";
  if (input.channel !== undefined) {
    if (!isObject(input.channel)) {
      push("/channel", "must be an object");
    } else {
      for (const k of Object.keys(input.channel)) {
        if (!CHANNEL_KEYS.has(k)) push(`/channel/${k}`, "unknown key");
      }
      const slug = input.channel.slug;
      if (slug === undefined) channelSlug = "main";
      else if (typeof slug !== "string" || !SLUG_RE.test(slug)) push("/channel/slug", "must match slug pattern");
      else channelSlug = slug;
    }
  }

  let dateKey = "";
  let title = "";
  let altText = "";
  if (!isObject(input.frame)) {
    push("/frame", "required object");
  } else {
    for (const k of Object.keys(input.frame)) {
      if (!FRAME_KEYS.has(k)) push(`/frame/${k}`, "unknown key");
    }
    const t = input.frame.title;
    if (typeof t !== "string" || t.length < 1 || t.length > 160) push("/frame/title", "required, 1–160 chars");
    else title = t;
    const a = input.frame.alt_text;
    if (typeof a !== "string" || a.length < 8 || a.length > 500) push("/frame/alt_text", "required, 8–500 chars");
    else altText = a;
    const d = input.frame.date;
    if (typeof d !== "string" || !isRealDateKey(d)) push("/frame/date", "required, YYYYMMDD calendar date");
    else dateKey = d;
    const seq = input.frame.sequence_key;
    if (seq !== undefined && (typeof seq !== "string" || seq.length > 160)) push("/frame/sequence_key", "string ≤160 chars");
  }

  if (input.license !== undefined) {
    if (!isObject(input.license)) {
      push("/license", "must be an object");
    } else {
      for (const k of Object.keys(input.license)) {
        if (!LICENSE_KEYS.has(k)) push(`/license/${k}`, "unknown key");
      }
      const intent = input.license.intent;
      if (intent !== undefined && (typeof intent !== "string" || !LICENSE_INTENTS.has(intent))) {
        push("/license/intent", "must be one of cc0, non_cc0, third_party, unknown");
      }
      const attribution = input.license.attribution;
      if (attribution !== undefined && (typeof attribution !== "string" || attribution.length > 1000)) {
        push("/license/attribution", "string ≤1000 chars");
      }
    }
  }

  if (input.click_zones !== undefined) {
    if (!Array.isArray(input.click_zones)) push("/click_zones", "must be an array");
    else if (input.click_zones.length > 64) push("/click_zones", "at most 64 items");
  }

  if (input.metadata !== undefined && !isObject(input.metadata)) {
    push("/metadata", "must be an object");
  }

  if (errors.length > 0) return { ok: false, errors };
  return {
    ok: true,
    value: { schemaVersion: FRAME_METADATA_SCHEMA_VERSION, agentSlug, channelSlug, dateKey, title, altText },
  };
}
