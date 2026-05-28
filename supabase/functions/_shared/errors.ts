export type ProblemCode =
  | "validation_failed"
  | "unauthorized"
  | "forbidden"
  | "not_found"
  | "conflict"
  | "idempotency_conflict"
  | "rate_limited"
  | "unsupported_media_type"
  | "payload_too_large"
  | "internal_error";

export interface ProblemOptions {
  status: number;
  code: ProblemCode;
  title: string;
  detail: string;
  requestId: string;
  extra?: Record<string, unknown>;
  retryAfterSeconds?: number;
  cors?: HeadersInit;
}

export function problem(opts: ProblemOptions): Response {
  const body = {
    type: `https://ui.plan.ai/docs/api-reference/errors/#${opts.code.replaceAll("_", "-")}`,
    title: opts.title,
    status: opts.status,
    detail: opts.detail,
    code: opts.code,
    request_id: opts.requestId,
    ...(opts.extra ?? {}),
  };
  const headers = new Headers(opts.cors ?? {});
  headers.set("content-type", "application/problem+json");
  headers.set("x-request-id", opts.requestId);
  if (opts.retryAfterSeconds !== undefined) {
    headers.set("retry-after", String(opts.retryAfterSeconds));
  }
  return new Response(JSON.stringify(body), { status: opts.status, headers });
}

export function ok(
  body: unknown,
  requestId: string,
  cors?: HeadersInit,
  status = 200,
): Response {
  const headers = new Headers(cors ?? {});
  headers.set("content-type", "application/json");
  headers.set("x-request-id", requestId);
  return new Response(JSON.stringify(body), { status, headers });
}

export function requestId(req: Request): string {
  return req.headers.get("x-request-id") ?? crypto.randomUUID();
}
