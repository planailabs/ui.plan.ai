import { problem, ok, requestId } from "../_shared/errors.ts";
import { serviceClient } from "../_shared/supabase.ts";
import { appendEvent } from "../_shared/events.ts";
import { verifyWebhookSignature } from "../_shared/stream.ts";

type StreamState = "ready" | "inprogress" | "queued" | "pendingupload" | "error" | string;

function mapState(state: StreamState): { mediaStatus: string; ours: "ready" | "processing" | "failed" } {
  if (state === "ready") return { mediaStatus: "ready", ours: "ready" };
  if (state === "error") return { mediaStatus: "failed", ours: "failed" };
  return { mediaStatus: "processing", ours: "processing" };
}

Deno.serve(async (req) => {
  const rid = requestId(req);

  if (req.method !== "POST") {
    return problem({
      status: 405, code: "validation_failed", title: "Method not allowed",
      detail: "POST only.", requestId: rid,
    });
  }

  const bodyText = await req.text();
  const sig = req.headers.get("webhook-signature");
  const ok_sig = await verifyWebhookSignature(sig, bodyText);
  if (!ok_sig) {
    return problem({
      status: 401, code: "unauthorized", title: "Invalid webhook signature",
      detail: "webhook-signature missing, malformed, expired, or invalid.",
      requestId: rid,
    });
  }

  const webhookId = req.headers.get("webhook-id");
  if (!webhookId) {
    return problem({
      status: 400, code: "validation_failed", title: "Missing webhook-id",
      detail: "webhook-id header is required for idempotency.",
      requestId: rid,
    });
  }

  let body: {
    uid?: string;
    status?: { state?: StreamState; errorReasonText?: string };
    meta?: { frame_submission_id?: string };
  };
  try {
    body = JSON.parse(bodyText);
  } catch (_) {
    return problem({
      status: 400, code: "validation_failed", title: "Invalid JSON body",
      detail: "Webhook body could not be parsed.", requestId: rid,
    });
  }

  const state = body.status?.state ?? "unknown";
  const uid = body.uid;
  if (!uid) {
    return problem({
      status: 400, code: "validation_failed", title: "Missing uid",
      detail: "Webhook body has no uid.", requestId: rid,
    });
  }

  const supabase = serviceClient();

  const { error: idemErr } = await supabase
    .from("stream_webhook_events")
    .insert({ id: webhookId, status_state: state, asset_uid: uid });
  if (idemErr) {
    if ((idemErr as { code?: string }).code === "23505") {
      return ok({ idempotent: true }, rid, undefined, 200);
    }
    console.error("stream-webhook idempotency insert failed", { rid, err: idemErr.message });
    return problem({
      status: 500, code: "internal_error", title: "Internal error",
      detail: "An internal error occurred.", requestId: rid,
    });
  }

  const mapping = mapState(state);
  const subId = body.meta?.frame_submission_id ?? null;
  let mediaRow;
  if (subId) {
    const { data } = await supabase
      .from("frame_media").select("id, tenant_id, submission_id")
      .eq("submission_id", subId).eq("kind", "video").maybeSingle();
    mediaRow = data;
  }
  if (!mediaRow) {
    const { data } = await supabase
      .from("frame_media").select("id, tenant_id, submission_id")
      .eq("storage_key", uid).maybeSingle();
    mediaRow = data;
  }
  if (!mediaRow) {
    return ok({ accepted: true, found: false }, rid, undefined, 200);
  }

  await supabase.from("frame_media").update({
    status: mapping.ours,
    failure_reason: body.status?.errorReasonText ?? null,
  }).eq("id", mediaRow.id);

  if (mapping.ours === "ready") {
    await supabase.from("frame_submissions").update({ status: "needs_review" })
      .eq("id", mediaRow.submission_id);
  } else if (mapping.ours === "failed") {
    await supabase.from("frame_submissions").update({
      status: "failed",
      error: { stage: "stream_processing", message: body.status?.errorReasonText ?? "" },
    }).eq("id", mediaRow.submission_id);
  }

  const eventType = mapping.ours === "ready"
    ? "frame.media.ready"
    : mapping.ours === "failed"
      ? "frame.media.failed"
      : "frame.media.status_changed";

  await appendEvent({
    tenant_id: mediaRow.tenant_id,
    submission_id: mediaRow.submission_id,
    event_type: eventType,
    actor_type: "system",
    request_id: rid,
    payload: { state, mapped: mapping.ours, stream_uid: uid },
  });

  return ok({ accepted: true, found: true, mapped: mapping.ours }, rid, undefined, 200);
});
