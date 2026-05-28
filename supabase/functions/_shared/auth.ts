import { serviceClient } from "./supabase.ts";
import { hmacSha256Hex, timingSafeEqual } from "./hash.ts";

export interface VerifiedApiKey {
  id: string;
  tenant_id: string;
  agent_id: string | null;
  channel_id: string | null;
  scopes: string[];
  settings: Record<string, unknown>;
  prefix: string;
}

const PREFIX_LEN = 12;

export async function verifyApiKey(authHeader: string | null): Promise<VerifiedApiKey | null> {
  if (!authHeader) return null;
  const m = authHeader.match(/^Bearer\s+(pai_(?:live|test)_[A-Za-z0-9]+)$/);
  if (!m) return null;
  const raw = m[1];
  const prefix = raw.slice(0, PREFIX_LEN);

  const pepper = Deno.env.get("API_KEY_PEPPER");
  if (!pepper) throw new Error("auth: API_KEY_PEPPER not set");

  const supabase = serviceClient();
  const { data, error } = await supabase
    .from("api_keys")
    .select("id, tenant_id, agent_id, channel_id, scopes, settings, prefix, hash, revoked_at, expires_at")
    .eq("prefix", prefix)
    .maybeSingle();

  if (error || !data) return null;
  if (data.revoked_at) return null;
  if (data.expires_at && new Date(data.expires_at) <= new Date()) return null;

  const candidate = await hmacSha256Hex(pepper, raw);
  if (!timingSafeEqual(candidate, data.hash)) return null;

  // Debounce last_used_at to at most once per minute (matches the documented
  // contract in docs/v1-plan/approval-and-api-keys). The conditional filter
  // makes the write a no-op when a recent timestamp already exists.
  queueMicrotask(async () => {
    try {
      const oneMinuteAgo = new Date(Date.now() - 60_000).toISOString();
      await supabase
        .from("api_keys")
        .update({ last_used_at: new Date().toISOString() })
        .eq("id", data.id)
        .or(`last_used_at.is.null,last_used_at.lt.${oneMinuteAgo}`);
    } catch (_) {
      /* best-effort */
    }
  });

  return {
    id: data.id,
    tenant_id: data.tenant_id,
    agent_id: data.agent_id,
    channel_id: data.channel_id,
    scopes: data.scopes ?? [],
    settings: data.settings ?? {},
    prefix: data.prefix,
  };
}

export async function verifyTurnstile(token: string | null, remoteIp: string | null): Promise<boolean> {
  if (!token) return false;
  const secret = Deno.env.get("TURNSTILE_SECRET_KEY");
  if (!secret) return false;
  const form = new FormData();
  form.append("secret", secret);
  form.append("response", token);
  if (remoteIp) form.append("remoteip", remoteIp);
  const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
    method: "POST",
    body: form,
  });
  if (!res.ok) return false;
  const body = await res.json();
  return Boolean(body?.success);
}
