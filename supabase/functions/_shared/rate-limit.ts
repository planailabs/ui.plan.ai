interface Bucket {
  tokens: number;
  updatedAt: number;
}

const buckets = new Map<string, Bucket>();

export interface RateLimitResult {
  allowed: boolean;
  retryAfterSeconds: number;
  limit: number;
  windowSeconds: number;
  bucket: string;
}

export function consume(
  bucketKey: string,
  limitPerMinute: number,
  burst: number,
): RateLimitResult {
  const now = Date.now();
  const ratePerMs = limitPerMinute / 60_000;
  const existing = buckets.get(bucketKey);
  let tokens = existing
    ? Math.min(burst, existing.tokens + (now - existing.updatedAt) * ratePerMs)
    : burst;

  if (tokens >= 1) {
    tokens -= 1;
    buckets.set(bucketKey, { tokens, updatedAt: now });
    return { allowed: true, retryAfterSeconds: 0, limit: limitPerMinute, windowSeconds: 60, bucket: bucketKey };
  }

  const retry = Math.ceil((1 - tokens) / ratePerMs / 1000);
  buckets.set(bucketKey, { tokens, updatedAt: now });
  return {
    allowed: false,
    retryAfterSeconds: Math.max(1, retry),
    limit: limitPerMinute,
    windowSeconds: 60,
    bucket: bucketKey,
  };
}
