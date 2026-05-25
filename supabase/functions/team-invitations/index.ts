import { preflight, corsHeaders } from "../_shared/cors.ts";
import { problem, ok, requestId } from "../_shared/errors.ts";
import { serviceClient, userClientFromAuthHeader } from "../_shared/supabase.ts";
import { appendEvent } from "../_shared/events.ts";
import { hmacSha256Hex, timingSafeEqual } from "../_shared/hash.ts";

interface InvitePayload {
  action: "create" | "update_role" | "revoke" | "redeem";
  tenant_id?: string;
  email?: string;
  role?: "owner" | "admin" | "member" | "viewer";
  member_user_id?: string;
  invitation_id?: string;
  token?: string;
}

async function tokenHash(raw: string): Promise<string> {
  const pepper = Deno.env.get("API_KEY_PEPPER");
  if (!pepper) throw new Error("team-invitations: API_KEY_PEPPER not set");
  return await hmacSha256Hex(pepper, raw);
}

function randomToken(): string {
  const bytes = new Uint8Array(32);
  crypto.getRandomValues(bytes);
  return btoa(String.fromCharCode(...bytes)).replaceAll("+", "-").replaceAll("/", "_").replaceAll("=", "");
}

async function requireOwner(authHeader: string | null, tenantId: string): Promise<{ userId: string } | null> {
  const supabase = userClientFromAuthHeader(authHeader);
  const { data: userRes } = await supabase.auth.getUser();
  const user = userRes?.user;
  if (!user) return null;

  const { data: aalData, error: aalErr } = await supabase.auth.mfa.getAuthenticatorAssuranceLevel();
  if (aalErr || !aalData || aalData.currentLevel !== "aal2") return null;

  const service = serviceClient();
  const { data } = await service.from("tenant_members").select("role")
    .eq("tenant_id", tenantId).eq("user_id", user.id).maybeSingle();
  if (!data || data.role !== "owner") return null;
  return { userId: user.id };
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

  let payload: InvitePayload;
  try {
    payload = await req.json();
  } catch (_) {
    return problem({
      status: 400, code: "validation_failed", title: "Invalid JSON",
      detail: "Body must be a JSON object.", requestId: rid, cors,
    });
  }

  const service = serviceClient();
  const authHeader = req.headers.get("authorization");

  if (payload.action === "create") {
    if (!payload.tenant_id || !payload.email || !payload.role) {
      return problem({
        status: 400, code: "validation_failed", title: "Missing fields",
        detail: "tenant_id, email, role required.", requestId: rid, cors,
      });
    }
    const guard = await requireOwner(authHeader, payload.tenant_id);
    if (!guard) {
      return problem({
        status: 403, code: "forbidden", title: "Owner + aal2 required",
        detail: "Only tenant owners with verified MFA may invite members.",
        requestId: rid, cors,
      });
    }
    const rawToken = randomToken();
    const hash = await tokenHash(rawToken);
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();
    const { data, error } = await service.from("tenant_invitations").insert({
      tenant_id: payload.tenant_id,
      email: payload.email,
      role: payload.role,
      token_hash: hash,
      invited_by: guard.userId,
      expires_at: expiresAt,
    }).select("id").single();
    if (error) {
      return problem({
        status: 409, code: "conflict", title: "Could not create invitation",
        detail: error.message, requestId: rid, cors,
      });
    }
    await appendEvent({
      tenant_id: payload.tenant_id,
      event_type: "tenant_invitation.created",
      actor_type: "user", actor_id: guard.userId, request_id: rid,
      payload: { invitation_id: data.id, role: payload.role },
    });
    return ok({ invitation_id: data.id, token: rawToken, expires_at: expiresAt }, rid, cors, 201);
  }

  if (payload.action === "update_role") {
    if (!payload.tenant_id || !payload.member_user_id || !payload.role) {
      return problem({
        status: 400, code: "validation_failed", title: "Missing fields",
        detail: "tenant_id, member_user_id, role required.", requestId: rid, cors,
      });
    }
    const guard = await requireOwner(authHeader, payload.tenant_id);
    if (!guard) {
      return problem({
        status: 403, code: "forbidden", title: "Owner + aal2 required",
        detail: "Only tenant owners with verified MFA may change roles.",
        requestId: rid, cors,
      });
    }
    const { error } = await service.from("tenant_members")
      .update({ role: payload.role })
      .eq("tenant_id", payload.tenant_id).eq("user_id", payload.member_user_id);
    if (error) {
      return problem({
        status: 409, code: "conflict", title: "Could not change role",
        detail: error.message, requestId: rid, cors,
      });
    }
    await appendEvent({
      tenant_id: payload.tenant_id,
      event_type: "tenant_member.role_changed",
      actor_type: "user", actor_id: guard.userId, request_id: rid,
      payload: { member_user_id: payload.member_user_id, role: payload.role },
    });
    return ok({ ok: true }, rid, cors);
  }

  if (payload.action === "revoke") {
    if (!payload.tenant_id || !payload.invitation_id) {
      return problem({
        status: 400, code: "validation_failed", title: "Missing fields",
        detail: "tenant_id, invitation_id required.", requestId: rid, cors,
      });
    }
    const guard = await requireOwner(authHeader, payload.tenant_id);
    if (!guard) {
      return problem({
        status: 403, code: "forbidden", title: "Owner + aal2 required",
        detail: "Only tenant owners with verified MFA may revoke invitations.",
        requestId: rid, cors,
      });
    }
    const { error } = await service.from("tenant_invitations")
      .delete().eq("id", payload.invitation_id).eq("tenant_id", payload.tenant_id);
    if (error) {
      return problem({
        status: 409, code: "conflict", title: "Could not revoke",
        detail: error.message, requestId: rid, cors,
      });
    }
    await appendEvent({
      tenant_id: payload.tenant_id,
      event_type: "tenant_invitation.revoked",
      actor_type: "user", actor_id: guard.userId, request_id: rid,
      payload: { invitation_id: payload.invitation_id },
    });
    return ok({ ok: true }, rid, cors);
  }

  if (payload.action === "redeem") {
    if (!payload.token) {
      return problem({
        status: 400, code: "validation_failed", title: "Missing token",
        detail: "token required.", requestId: rid, cors,
      });
    }
    const userSupabase = userClientFromAuthHeader(authHeader);
    const { data: userRes } = await userSupabase.auth.getUser();
    const user = userRes?.user;
    if (!user) {
      return problem({
        status: 401, code: "unauthorized", title: "Sign-in required",
        detail: "Complete OTP login before redeeming.", requestId: rid, cors,
      });
    }
    const hash = await tokenHash(payload.token);
    const { data: invites } = await service.from("tenant_invitations")
      .select("id, tenant_id, email, role, token_hash, expires_at, redeemed_at")
      .gt("expires_at", new Date().toISOString())
      .is("redeemed_at", null);
    const inv = (invites ?? []).find((row) => timingSafeEqual(row.token_hash, hash));
    if (!inv) {
      return problem({
        status: 410, code: "not_found", title: "Invitation invalid or expired",
        detail: "Ask your team to resend.", requestId: rid, cors,
      });
    }
    if (inv.email.toLowerCase() !== (user.email ?? "").toLowerCase()) {
      return problem({
        status: 403, code: "forbidden", title: "Email mismatch",
        detail: "Sign in with the email this invitation was sent to.",
        requestId: rid, cors,
      });
    }
    const { error: insErr } = await service.from("tenant_members").insert({
      tenant_id: inv.tenant_id, user_id: user.id, role: inv.role,
    });
    if (insErr && (insErr as { code?: string }).code !== "23505") {
      return problem({
        status: 500, code: "internal_error", title: "Could not add member",
        detail: insErr.message, requestId: rid, cors,
      });
    }
    await service.from("tenant_invitations").update({
      redeemed_at: new Date().toISOString(), redeemed_by: user.id,
    }).eq("id", inv.id);
    await appendEvent({
      tenant_id: inv.tenant_id,
      event_type: "tenant_member.added",
      actor_type: "user", actor_id: user.id, request_id: rid,
      payload: { invitation_id: inv.id, role: inv.role },
    });
    return ok({ tenant_id: inv.tenant_id, role: inv.role }, rid, cors);
  }

  return problem({
    status: 400, code: "validation_failed", title: "Unknown action",
    detail: "action must be one of: create, update_role, revoke, redeem.",
    requestId: rid, cors,
  });
});
