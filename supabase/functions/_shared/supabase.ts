import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let cached: SupabaseClient | null = null;

export function serviceClient(): SupabaseClient {
  if (cached) return cached;
  const url = Deno.env.get("SUPABASE_URL");
  const key = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  if (!url || !key) {
    throw new Error("supabase: SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY not set");
  }
  cached = createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  return cached;
}

export function userClientFromAuthHeader(authHeader: string | null): SupabaseClient {
  const url = Deno.env.get("SUPABASE_URL");
  const anon = Deno.env.get("SUPABASE_ANON_KEY");
  if (!url || !anon) {
    throw new Error("supabase: SUPABASE_URL or SUPABASE_ANON_KEY not set");
  }
  return createClient(url, anon, {
    global: { headers: authHeader ? { authorization: authHeader } : {} },
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
