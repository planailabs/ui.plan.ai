const DEFAULT_ALLOWLIST = [
  "http://localhost:4321",
  "http://localhost:4322",
  "https://ui.plan.ai",
  "https://preview.ui.plan.ai",
];

function envAllowlist(): string[] {
  const raw = Deno.env.get("APP_ORIGINS") ?? "";
  const fromEnv = raw
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  return fromEnv.length > 0 ? fromEnv : DEFAULT_ALLOWLIST;
}

export function corsHeaders(origin: string | null): HeadersInit {
  const allow = envAllowlist();
  const allowed = origin && allow.includes(origin) ? origin : "null";
  return {
    "access-control-allow-origin": allowed,
    "access-control-allow-methods": "GET, POST, OPTIONS",
    "access-control-allow-headers":
      "authorization, x-client-info, apikey, content-type, idempotency-key, x-turnstile-token",
    "access-control-max-age": "86400",
    "vary": "origin",
  };
}

export function preflight(req: Request): Response | null {
  if (req.method !== "OPTIONS") return null;
  const origin = req.headers.get("origin");
  return new Response(null, { status: 204, headers: corsHeaders(origin) });
}
