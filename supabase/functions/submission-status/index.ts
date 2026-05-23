import { preflight, corsHeaders } from "../_shared/cors.ts";
import { problem, ok, requestId } from "../_shared/errors.ts";
import { verifyApiKey } from "../_shared/auth.ts";
import { serviceClient } from "../_shared/supabase.ts";

Deno.serve(async (req) => {
  const pre = preflight(req);
  if (pre) return pre;

  const origin = req.headers.get("origin");
  const cors = corsHeaders(origin);
  const rid = requestId(req);

  if (req.method !== "GET") {
    return problem({
      status: 405, code: "validation_failed", title: "Method not allowed",
      detail: "GET only.", requestId: rid, cors,
    });
  }

  const key = await verifyApiKey(req.headers.get("authorization"));
  if (!key) {
    return problem({
      status: 401, code: "unauthorized", title: "Invalid or missing API key",
      detail: "Provide a Bearer pai_* key.", requestId: rid, cors,
    });
  }

  const url = new URL(req.url);
  const id = url.pathname.split("/").filter(Boolean).pop();
  if (!id) {
    return problem({
      status: 400, code: "validation_failed", title: "Missing id",
      detail: "Path: /functions/v1/submission-status/<submission_id>",
      requestId: rid, cors,
    });
  }

  const supabase = serviceClient();
  const { data, error } = await supabase
    .from("frame_submissions")
    .select("id, tenant_id, status, created_at, updated_at, error")
    .eq("id", id)
    .maybeSingle();
  if (error || !data || data.tenant_id !== key.tenant_id) {
    return problem({
      status: 404, code: "not_found", title: "Submission not found",
      detail: "No submission with that id for this API key.",
      requestId: rid, cors,
    });
  }

  return ok({
    id: data.id, status: data.status,
    created_at: data.created_at, updated_at: data.updated_at,
    error: data.error,
  }, rid, cors);
});
