interface DirectUploadOptions {
  maxDurationSeconds: number;
  allowedOrigins: string[];
  metadata: Record<string, string>;
  expirySeconds?: number;
}

export interface DirectUploadResult {
  uid: string;
  uploadURL: string;
}

export async function createDirectUpload(opts: DirectUploadOptions): Promise<DirectUploadResult> {
  const accountId = Deno.env.get("CF_ACCOUNT_ID");
  const token = Deno.env.get("CF_STREAM_TOKEN");
  if (!accountId || !token) throw new Error("stream: CF_ACCOUNT_ID or CF_STREAM_TOKEN not set");

  const expiry = new Date(Date.now() + (opts.expirySeconds ?? 3600) * 1000).toISOString();
  const res = await fetch(
    `https://api.cloudflare.com/client/v4/accounts/${accountId}/stream/direct_upload`,
    {
      method: "POST",
      headers: {
        authorization: `Bearer ${token}`,
        "content-type": "application/json",
      },
      body: JSON.stringify({
        maxDurationSeconds: opts.maxDurationSeconds,
        requireSignedURLs: true,
        allowedOrigins: opts.allowedOrigins,
        meta: opts.metadata,
        expiry,
      }),
    },
  );

  if (!res.ok) {
    throw new Error(`stream: direct_upload failed: ${res.status} ${await res.text()}`);
  }
  const body = await res.json();
  return { uid: body.result.uid, uploadURL: body.result.uploadURL };
}

export async function verifyWebhookSignature(
  signatureHeader: string | null,
  body: string,
): Promise<boolean> {
  if (!signatureHeader) return false;
  const secret = Deno.env.get("CF_STREAM_WEBHOOK_SECRET");
  if (!secret) return false;

  const parts = Object.fromEntries(signatureHeader.split(",").map((p) => p.split("=") as [string, string]));
  const time = parts["time"];
  const sig1 = parts["sig1"];
  if (!time || !sig1) return false;

  const skew = Math.abs(Date.now() / 1000 - Number(time));
  if (!Number.isFinite(skew) || skew > 300) return false;

  const { hmacSha256Hex, timingSafeEqual } = await import("./hash.ts");
  const expected = await hmacSha256Hex(secret, `${time}.${body}`);
  return timingSafeEqual(expected, sig1);
}
