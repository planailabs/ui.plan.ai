import { preflight, corsHeaders } from "../_shared/cors.ts";
import { problem, ok, requestId } from "../_shared/errors.ts";
import { verifyApiKey } from "../_shared/auth.ts";
import { serviceClient } from "../_shared/supabase.ts";
import { appendEvent } from "../_shared/events.ts";
import { consume } from "../_shared/rate-limit.ts";
import { uploadImage } from "../_shared/images.ts";

function deriveDateKey(metadata: Record<string, unknown>): string {
  const fromMeta = (metadata.date ?? (metadata.frame as Record<string, unknown> | undefined)?.date) as
    | string | undefined;
  if (fromMeta && /^[0-9]{8}$/.test(fromMeta)) return fromMeta;
  const now = new Date();
  const y = now.getUTCFullYear().toString();
  const m = String(now.getUTCMonth() + 1).padStart(2, "0");
  const d = String(now.getUTCDate()).padStart(2, "0");
  return `${y}${m}${d}`;
}

Deno.serve(async (req) => {
  const pre = preflight(req);
  if (pre) return pre;

  const origin = req.headers.get("origin");
  const cors = corsHeaders(origin);
  const rid = requestId(req);

  if (req.method !== "POST") {
    return problem({
      status: 405, code: "validation_failed", title: "Method not allowed",
      detail: "POST only.", requestId: rid, cors,
    });
  }

  const key = await verifyApiKey(req.headers.get("authorization"));
  if (!key) {
    return problem({
      status: 401, code: "unauthorized", title: "Invalid or missing API key",
      detail: "Provide a Bearer pai_* key.", requestId: rid, cors,
    });
  }

  const idempotencyKey = req.headers.get("idempotency-key");
  if (!idempotencyKey) {
    return problem({
      status: 422, code: "validation_failed", title: "Idempotency-Key required",
      detail: "POST /v1/frame-submissions requires an Idempotency-Key header.",
      requestId: rid, cors,
    });
  }

  const limit = consume(`frame_submissions:${key.id}`, 10, 3);
  if (!limit.allowed) {
    return problem({
      status: 429, code: "rate_limited", title: "Rate limited",
      detail: `Per-API-key bucket exhausted on POST /v1/frame-submissions. Retry after ${limit.retryAfterSeconds} seconds.`,
      requestId: rid, cors, retryAfterSeconds: limit.retryAfterSeconds,
      extra: { limit: { scope: "api_key", bucket: limit.bucket, limit: limit.limit, window_seconds: limit.windowSeconds } },
    });
  }

  if (!req.headers.get("content-type")?.startsWith("multipart/form-data")) {
    return problem({
      status: 415, code: "unsupported_media_type", title: "Multipart required",
      detail: "Body must be multipart/form-data with a PNG image and metadata JSON.",
      requestId: rid, cors,
    });
  }

  let form: FormData;
  try {
    form = await req.formData();
  } catch (_) {
    return problem({
      status: 400, code: "validation_failed", title: "Invalid multipart body",
      detail: "Could not parse multipart body.", requestId: rid, cors,
    });
  }

  const file = form.get("image");
  const metaRaw = form.get("metadata");
  if (!(file instanceof File) || typeof metaRaw !== "string") {
    return problem({
      status: 400, code: "validation_failed", title: "Missing fields",
      detail: "Expected fields: image (file), metadata (json string).",
      requestId: rid, cors,
    });
  }
  if (file.type !== "image/png") {
    return problem({
      status: 415, code: "unsupported_media_type", title: "PNG required",
      detail: "Only image/png is accepted on this endpoint; use /v1/media-uploads for video.",
      requestId: rid, cors,
    });
  }

  let metadata: Record<string, unknown>;
  try {
    metadata = JSON.parse(metaRaw);
  } catch (_) {
    return problem({
      status: 400, code: "validation_failed", title: "Metadata is not JSON",
      detail: "metadata must be a JSON object string.", requestId: rid, cors,
    });
  }

  const supabase = serviceClient();

  const { data: existing } = await supabase
    .from("frame_submissions")
    .select("id, status, created_at, agent_id, channel_id")
    .eq("api_key_id", key.id)
    .eq("idempotency_key", idempotencyKey)
    .maybeSingle();
  if (existing) {
    const { data: ag } = await supabase.from("agents").select("slug").eq("id", existing.agent_id).maybeSingle();
    const { data: ch } = await supabase.from("agent_channels").select("slug").eq("id", existing.channel_id).maybeSingle();
    return ok({
      id: existing.id, status: existing.status,
      agent_slug: ag?.slug ?? null, channel_slug: ch?.slug ?? null,
      date: deriveDateKey(metadata), created_at: existing.created_at,
      idempotent: true,
    }, rid, cors, 202);
  }

  const { data: agentRow, error: agentErr } = await supabase
    .from("agents").select("id, slug, tenant_id").eq("id", key.agent_id ?? "").maybeSingle();
  if (agentErr || !agentRow || agentRow.tenant_id !== key.tenant_id) {
    return problem({
      status: 403, code: "forbidden", title: "API key not bound to a valid agent",
      detail: "This API key has no usable agent binding.", requestId: rid, cors,
    });
  }
  const metaAgentSlug = metadata.agent_slug as string | undefined;
  if (metaAgentSlug && metaAgentSlug !== agentRow.slug) {
    return problem({
      status: 403, code: "forbidden", title: "Agent mismatch",
      detail: "metadata.agent_slug does not match the agent this API key is bound to.",
      requestId: rid, cors,
    });
  }

  let channelId = key.channel_id;
  let channelSlug: string | null = null;
  const metaChannelSlug = metadata.channel_slug as string | undefined;
  if (metaChannelSlug) {
    const { data: chanBySlug } = await supabase
      .from("agent_channels").select("id, slug, tenant_id")
      .eq("agent_id", agentRow.id).eq("slug", metaChannelSlug).maybeSingle();
    if (!chanBySlug || chanBySlug.tenant_id !== key.tenant_id) {
      return problem({
        status: 403, code: "forbidden", title: "Channel mismatch",
        detail: "metadata.channel_slug does not belong to this agent/tenant.",
        requestId: rid, cors,
      });
    }
    channelId = chanBySlug.id;
    channelSlug = chanBySlug.slug;
  }
  if (!channelId) {
    return problem({
      status: 400, code: "validation_failed", title: "channel required",
      detail: "metadata.channel_slug required when API key is not channel-scoped.",
      requestId: rid, cors,
    });
  }
  if (!channelSlug) {
    const { data: chan } = await supabase.from("agent_channels").select("slug").eq("id", channelId).maybeSingle();
    channelSlug = chan?.slug ?? null;
  }

  const dateKey = deriveDateKey(metadata);

  const { data: sub, error: subErr } = await supabase
    .from("frame_submissions").insert({
      tenant_id: key.tenant_id,
      agent_id: agentRow.id,
      channel_id: channelId,
      api_key_id: key.id,
      idempotency_key: idempotencyKey,
      status: "received",
      metadata_schema_version: (metadata.metadata_schema_version as string | undefined) ?? "2026-05-22",
      metadata: { ...metadata, date: dateKey },
    })
    .select("id, created_at")
    .single();
  if (subErr || !sub) {
    if ((subErr as { code?: string }).code === "23505") {
      return problem({
        status: 409, code: "conflict", title: "idempotency_conflict",
        detail: "Idempotency-Key reused with different parameters.",
        requestId: rid, cors,
      });
    }
    return problem({
      status: 500, code: "internal_error", title: "Could not create submission",
      detail: subErr?.message ?? "unknown", requestId: rid, cors,
    });
  }

  const bytes = new Uint8Array(await file.arrayBuffer());
  const storagePath = `${key.tenant_id}/${sub.id}/original.png`;
  const { error: upErr } = await supabase.storage
    .from("frame-originals")
    .upload(storagePath, bytes, { contentType: "image/png", upsert: false });
  if (upErr) {
    await supabase.from("frame_submissions").update({
      status: "failed",
      error: { stage: "storage_upload", message: upErr.message },
    }).eq("id", sub.id);
    return problem({
      status: 500, code: "internal_error", title: "Storage upload failed",
      detail: upErr.message, requestId: rid, cors,
    });
  }

  let imageId: string | null = null;
  try {
    const uploaded = await uploadImage(bytes, "original.png", {
      tenant_id: key.tenant_id, submission_id: sub.id,
    });
    imageId = uploaded.id;
  } catch (e) {
    await supabase.from("frame_submissions").update({
      status: "media_processing",
      error: { stage: "images_upload", message: (e as Error).message },
    }).eq("id", sub.id);
  }

  await supabase.from("frame_media").insert({
    tenant_id: key.tenant_id,
    submission_id: sub.id,
    kind: "image",
    storage_provider: "supabase_storage",
    storage_key: storagePath,
    delivery_id: imageId,
    status: imageId ? "ready" : "processing",
    metadata: {},
  });

  await supabase.from("frame_submissions").update({
    status: imageId ? "needs_review" : "media_processing",
  }).eq("id", sub.id);

  await appendEvent({
    tenant_id: key.tenant_id,
    submission_id: sub.id,
    event_type: "frame.submission.created",
    actor_type: "agent",
    actor_id: agentRow.id,
    request_id: rid,
    payload: { api_key_id: key.id, date: dateKey },
  });

  return ok({
    id: sub.id,
    status: imageId ? "needs_review" : "media_processing",
    agent_slug: agentRow.slug,
    channel_slug: channelSlug,
    date: dateKey,
    created_at: sub.created_at,
  }, rid, cors, 202);
});
