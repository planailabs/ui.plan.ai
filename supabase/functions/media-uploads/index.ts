import { preflight, corsHeaders } from "../_shared/cors.ts";
import { problem, ok, requestId } from "../_shared/errors.ts";
import { verifyApiKey, hasApiScope } from "../_shared/auth.ts";
import { serviceClient } from "../_shared/supabase.ts";
import { appendEvent } from "../_shared/events.ts";
import { consume } from "../_shared/rate-limit.ts";
import { createDirectUpload } from "../_shared/stream.ts";
import { canonicalFingerprint } from "../_shared/hash.ts";
import { validateFrameMetadata } from "../_shared/frame-metadata.ts";

const MAX_JSON_BYTES = 16 * 1024;

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
  if (!hasApiScope(key, "media:video")) {
    return problem({
      status: 403, code: "forbidden", title: "Missing scope",
      detail: "This API key lacks the required media:video scope.", requestId: rid, cors,
    });
  }

  const idempotencyKey = req.headers.get("idempotency-key");
  if (!idempotencyKey) {
    return problem({
      status: 422, code: "validation_failed", title: "Idempotency-Key required",
      detail: "POST /v1/media-uploads requires an Idempotency-Key header.",
      requestId: rid, cors,
    });
  }

  const limit = consume(`media_uploads:${key.id}`, 20, 5);
  if (!limit.allowed) {
    return problem({
      status: 429, code: "rate_limited", title: "Rate limited",
      detail: `Per-API-key bucket exhausted on POST /v1/media-uploads. Retry after ${limit.retryAfterSeconds} seconds.`,
      requestId: rid, cors, retryAfterSeconds: limit.retryAfterSeconds,
      extra: { limit: { scope: "api_key", bucket: limit.bucket, limit: limit.limit, window_seconds: limit.windowSeconds } },
    });
  }

  const declaredLen = Number(req.headers.get("content-length") ?? 0);
  if (declaredLen > MAX_JSON_BYTES) {
    return problem({
      status: 413, code: "validation_failed", title: "Payload too large",
      detail: `JSON body exceeds ${MAX_JSON_BYTES} bytes.`,
      requestId: rid, cors,
    });
  }

  let body: Record<string, unknown>;
  try {
    const raw = await req.text();
    if (raw.length > MAX_JSON_BYTES) {
      return problem({
        status: 413, code: "validation_failed", title: "Payload too large",
        detail: `JSON body exceeds ${MAX_JSON_BYTES} bytes.`,
        requestId: rid, cors,
      });
    }
    body = JSON.parse(raw);
  } catch (_) {
    return problem({
      status: 400, code: "validation_failed", title: "Invalid JSON",
      detail: "Body must be a JSON object.", requestId: rid, cors,
    });
  }

  const mediaType = body.media_type as string | undefined;
  if (mediaType !== "video") {
    return problem({
      status: 400, code: "validation_failed", title: "Only media_type=video supported",
      detail: "V1 only accepts media_type=\"video\" on this endpoint.",
      requestId: rid, cors,
    });
  }
  const filename = body.filename as string | undefined;
  const contentType = body.content_type as string | undefined;
  const byteSize = Number(body.byte_size ?? 0);
  if (!filename || !contentType || !Number.isFinite(byteSize) || byteSize <= 0) {
    return problem({
      status: 400, code: "validation_failed", title: "Missing fields",
      detail: "filename, content_type, byte_size required.",
      requestId: rid, cors,
    });
  }
  const maxDurationSeconds = Math.min(Number(body.max_duration_seconds ?? 60), 300);

  // The frame metadata travels in body.metadata and is validated against the
  // same ui.plan.ai/frame-metadata.v1 contract as the image endpoint. Agent,
  // channel, and date are derived from it (not from loose top-level fields).
  const validation = validateFrameMetadata(body.metadata);
  if (!validation.ok) {
    return problem({
      status: 422, code: "validation_failed", title: "Invalid frame metadata",
      detail: "body.metadata does not satisfy ui.plan.ai/frame-metadata.v1.",
      requestId: rid, cors, extra: { errors: validation.errors },
    });
  }
  const meta = validation.value;

  const requestFingerprint = await canonicalFingerprint({
    media_type: mediaType, filename, content_type: contentType, byte_size: byteSize,
    max_duration_seconds: maxDurationSeconds,
    agent_slug: meta.agentSlug, channel_slug: meta.channelSlug, date: meta.dateKey,
  });

  const supabase = serviceClient();

  const { data: existing } = await supabase
    .from("frame_submissions")
    .select("id, status, created_at, metadata, agent_id, channel_id")
    .eq("api_key_id", key.id)
    .eq("idempotency_scope", "media-uploads")
    .eq("idempotency_key", idempotencyKey)
    .maybeSingle();
  if (existing) {
    const existingMeta = (existing.metadata as Record<string, unknown> | null) ?? {};
    const existingFp = existingMeta._idempotency_fp as string | undefined;
    if (existingFp && existingFp !== requestFingerprint) {
      return problem({
        status: 409, code: "idempotency_conflict", title: "idempotency_conflict",
        detail: "Idempotency-Key reused with different request parameters.",
        requestId: rid, cors,
      });
    }
    return ok({
      id: existing.id, submission_id: existing.id, status: existing.status, provider: "cloudflare_stream",
      upload_url: (existingMeta._upload_url as string | undefined) ?? null,
      expires_at: (existingMeta._upload_expires_at as string | undefined) ?? null,
      idempotent: true,
    }, rid, cors, 202);
  }

  const { data: agentRow, error: agentErr } = await supabase
    .from("agents").select("id, slug, tenant_id")
    .eq("id", key.agent_id ?? "").maybeSingle();
  if (agentErr || !agentRow || agentRow.tenant_id !== key.tenant_id) {
    return problem({
      status: 403, code: "forbidden", title: "API key not bound to a valid agent",
      detail: "This API key has no usable agent binding.",
      requestId: rid, cors,
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
  const metaChannel = (body.metadata as Record<string, unknown>).channel as Record<string, unknown> | undefined;
  const metaChannelSlug = metaChannel?.slug as string | undefined;
  if (metaChannelSlug) {
    const { data: chanBySlug } = await supabase
      .from("agent_channels").select("id, agent_id, tenant_id")
      .eq("agent_id", agentRow.id).eq("slug", metaChannelSlug).maybeSingle();
    if (!chanBySlug || chanBySlug.tenant_id !== key.tenant_id) {
      return problem({
        status: 403, code: "forbidden", title: "Channel mismatch",
        detail: "metadata.channel.slug does not belong to this agent/tenant.",
        requestId: rid, cors,
      });
    }
    channelId = chanBySlug.id;
  }
  if (!channelId) {
    return problem({
      status: 400, code: "validation_failed", title: "channel required",
      detail: "metadata.channel.slug required when API key is not channel-scoped.",
      requestId: rid, cors,
    });
  }

  const allowedOrigins = (Deno.env.get("APP_ORIGINS") ?? "https://ui.plan.ai")
    .split(",").map((s) => s.trim()).filter(Boolean);

  let upload;
  const expirySeconds = 3600;
  try {
    upload = await createDirectUpload({
      maxDurationSeconds,
      allowedOrigins,
      metadata: { tenant_id: key.tenant_id, agent_id: agentRow.id, channel_id: channelId },
      expirySeconds,
    });
  } catch (e) {
    console.error("media-uploads stream direct-upload failed", { rid, err: (e as Error).message });
    return problem({
      status: 502, code: "internal_error", title: "Upstream unavailable",
      detail: "Could not create direct upload session.", requestId: rid, cors,
    });
  }
  const expiresAt = new Date(Date.now() + expirySeconds * 1000).toISOString();

  const { data: sub, error: subErr } = await supabase
    .from("frame_submissions").insert({
      tenant_id: key.tenant_id,
      agent_id: agentRow.id,
      channel_id: channelId,
      api_key_id: key.id,
      idempotency_key: idempotencyKey,
      idempotency_scope: "media-uploads",
      status: "waiting_for_upload",
      metadata_schema_version: meta.schemaVersion,
      metadata: {
        ...(body.metadata as Record<string, unknown>),
        date: meta.dateKey,
        filename, content_type: contentType, byte_size: byteSize,
        _upload_url: upload.uploadURL, _upload_expires_at: expiresAt,
        _idempotency_fp: requestFingerprint,
      },
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
    console.error("media-uploads insert failed", { rid, err: subErr?.message });
    return problem({
      status: 500, code: "internal_error", title: "Internal error",
      detail: "An internal error occurred.", requestId: rid, cors,
    });
  }

  await supabase.from("frame_media").insert({
    tenant_id: key.tenant_id,
    submission_id: sub.id,
    kind: "video",
    storage_provider: "cloudflare_stream",
    storage_key: upload.uid,
    status: "received",
    metadata: { filename, content_type: contentType, byte_size: byteSize },
  });

  await appendEvent({
    tenant_id: key.tenant_id,
    submission_id: sub.id,
    event_type: "frame.media.upload_requested",
    actor_type: "agent",
    actor_id: agentRow.id,
    request_id: rid,
    payload: { stream_uid: upload.uid, byte_size: byteSize },
  });

  return ok({
    id: sub.id,
    submission_id: sub.id,
    status: "waiting_for_upload",
    provider: "cloudflare_stream",
    upload_url: upload.uploadURL,
    expires_at: expiresAt,
  }, rid, cors, 202);
});
