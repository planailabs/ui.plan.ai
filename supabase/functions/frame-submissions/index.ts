import { preflight, corsHeaders } from "../_shared/cors.ts";
import { problem, ok, requestId } from "../_shared/errors.ts";
import { verifyApiKey, hasApiScope } from "../_shared/auth.ts";
import { serviceClient } from "../_shared/supabase.ts";
import { appendEvent } from "../_shared/events.ts";
import { consume } from "../_shared/rate-limit.ts";
import { uploadImage } from "../_shared/images.ts";
import { canonicalFingerprint, sha256BytesHex } from "../_shared/hash.ts";
import { validateFrameMetadata } from "../_shared/frame-metadata.ts";

const MAX_MULTIPART_BYTES = 25 * 1024 * 1024;

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
  if (!hasApiScope(key, "media:image")) {
    return problem({
      status: 403, code: "forbidden", title: "Missing scope",
      detail: "This API key lacks the required media:image scope.", requestId: rid, cors,
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
  const declaredLen = Number(req.headers.get("content-length") ?? 0);
  if (declaredLen > MAX_MULTIPART_BYTES) {
    return problem({
      status: 413, code: "validation_failed", title: "Payload too large",
      detail: `Body exceeds ${MAX_MULTIPART_BYTES} bytes.`,
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

  if (metadata.media_upload_id !== undefined || metadata.video !== undefined) {
    return problem({
      status: 415, code: "unsupported_media_type", title: "Video not accepted here",
      detail: "V1 /v1/frame-submissions accepts image only. Use POST /v1/media-uploads for video.",
      requestId: rid, cors,
    });
  }

  // Validate against ui.plan.ai/frame-metadata.v1 before anything is stored.
  // This replaces the previous silent date coercion and the flat agent_slug /
  // channel_slug reads (the schema is nested: agent.slug, channel.slug).
  const validation = validateFrameMetadata(metadata);
  if (!validation.ok) {
    return problem({
      status: 422, code: "validation_failed", title: "Invalid frame metadata",
      detail: "metadata does not satisfy ui.plan.ai/frame-metadata.v1.",
      requestId: rid, cors, extra: { errors: validation.errors },
    });
  }
  const meta = validation.value;

  const fileBytes = new Uint8Array(await file.arrayBuffer());
  if (fileBytes.byteLength > MAX_MULTIPART_BYTES) {
    return problem({
      status: 413, code: "validation_failed", title: "Image too large",
      detail: `image exceeds ${MAX_MULTIPART_BYTES} bytes.`,
      requestId: rid, cors,
    });
  }
  const fileFingerprint = await canonicalFingerprint({
    name: file.name, type: file.type, size: fileBytes.byteLength,
    sha256: await sha256BytesHex(fileBytes),
  });
  const requestFingerprint = await canonicalFingerprint({
    metadata, file: fileFingerprint,
  });

  const supabase = serviceClient();

  const { data: existing } = await supabase
    .from("frame_submissions")
    .select("id, status, created_at, agent_id, channel_id, metadata")
    .eq("api_key_id", key.id)
    .eq("idempotency_scope", "frame-submissions")
    .eq("idempotency_key", idempotencyKey)
    .maybeSingle();
  if (existing) {
    const existingFp = (existing.metadata as Record<string, unknown> | null)?._idempotency_fp as string | undefined;
    if (existingFp && existingFp !== requestFingerprint) {
      return problem({
        status: 409, code: "idempotency_conflict", title: "idempotency_conflict",
        detail: "Idempotency-Key reused with different request parameters.",
        requestId: rid, cors,
      });
    }
    const { data: ag } = await supabase.from("agents").select("slug").eq("id", existing.agent_id).maybeSingle();
    const { data: ch } = await supabase.from("agent_channels").select("slug").eq("id", existing.channel_id).maybeSingle();
    const storedDate = (existing.metadata as Record<string, unknown> | null)?.date as string | undefined;
    return ok({
      id: existing.id, status: existing.status,
      agent_slug: ag?.slug ?? null, channel_slug: ch?.slug ?? null,
      date: storedDate ?? meta.dateKey, created_at: existing.created_at,
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
  if (meta.agentSlug !== agentRow.slug) {
    return problem({
      status: 403, code: "forbidden", title: "Agent mismatch",
      detail: "metadata.agent.slug does not match the agent this API key is bound to.",
      requestId: rid, cors,
    });
  }

  let channelId = key.channel_id;
  let channelSlug: string | null = null;
  const metaChannelSlug = (metadata.channel as Record<string, unknown> | undefined)?.slug as string | undefined;
  if (metaChannelSlug) {
    const { data: chanBySlug } = await supabase
      .from("agent_channels").select("id, slug, tenant_id")
      .eq("agent_id", agentRow.id).eq("slug", metaChannelSlug).maybeSingle();
    if (!chanBySlug || chanBySlug.tenant_id !== key.tenant_id) {
      return problem({
        status: 403, code: "forbidden", title: "Channel mismatch",
        detail: "metadata.channel.slug does not belong to this agent/tenant.",
        requestId: rid, cors,
      });
    }
    channelId = chanBySlug.id;
    channelSlug = chanBySlug.slug;
  }
  if (!channelId) {
    return problem({
      status: 400, code: "validation_failed", title: "channel required",
      detail: "metadata.channel.slug required when API key is not channel-scoped.",
      requestId: rid, cors,
    });
  }
  if (!channelSlug) {
    const { data: chan } = await supabase.from("agent_channels").select("slug").eq("id", channelId).maybeSingle();
    channelSlug = chan?.slug ?? null;
  }

  const dateKey = meta.dateKey;

  const { data: sub, error: subErr } = await supabase
    .from("frame_submissions").insert({
      tenant_id: key.tenant_id,
      agent_id: agentRow.id,
      channel_id: channelId,
      api_key_id: key.id,
      idempotency_key: idempotencyKey,
      idempotency_scope: "frame-submissions",
      status: "received",
      metadata_schema_version: meta.schemaVersion,
      metadata: (() => {
        const safe: Record<string, unknown> = { ...metadata };
        delete safe._idempotency_fp;
        return { ...safe, date: dateKey, _idempotency_fp: requestFingerprint };
      })(),
    })
    .select("id, created_at")
    .single();
  if (subErr || !sub) {
    if ((subErr as { code?: string }).code === "23505") {
      return problem({
        status: 409, code: "idempotency_conflict", title: "idempotency_conflict",
        detail: "Idempotency-Key reused with different parameters.",
        requestId: rid, cors,
      });
    }
    console.error("frame-submissions insert failed", { rid, err: subErr?.message });
    return problem({
      status: 500, code: "internal_error", title: "Internal error",
      detail: "An internal error occurred.", requestId: rid, cors,
    });
  }

  const storagePath = `${key.tenant_id}/${sub.id}/original.png`;
  const { error: upErr } = await supabase.storage
    .from("frame-originals")
    .upload(storagePath, fileBytes, { contentType: "image/png", upsert: false });
  if (upErr) {
    console.error("frame-submissions storage upload failed", { rid, err: upErr.message });
    await supabase.from("frame_submissions").update({
      status: "failed",
      error: { stage: "storage_upload", message: upErr.message },
    }).eq("id", sub.id);
    return problem({
      status: 500, code: "internal_error", title: "Internal error",
      detail: "An internal error occurred.", requestId: rid, cors,
    });
  }

  let imageId: string | null = null;
  try {
    const uploaded = await uploadImage(fileBytes, "original.png", {
      tenant_id: key.tenant_id, submission_id: sub.id,
    });
    imageId = uploaded.id;
  } catch (e) {
    console.error("frame-submissions images upload failed", { rid, err: (e as Error).message });
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
    status: imageId ? "ready" : "media_processing",
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
