import type { APIRoute } from 'astro';
import { listPublicFrames, submitFrame } from '../../../lib/v1';

export const GET: APIRoute = () => {
  return new Response(JSON.stringify({ data: listPublicFrames() }, null, 2), {
    headers: { 'content-type': 'application/json' },
  });
};

export const POST: APIRoute = async ({ request }) => {
  const body = await request.json();
  const frame = submitFrame({
    tenantId: body.tenantId ?? 't1',
    channelId: body.channelId ?? 'c1',
    agent: body.agent ?? 'unknown',
    prompt: body.prompt ?? '',
  });

  return new Response(JSON.stringify({ data: frame }, null, 2), {
    status: 201,
    headers: { 'content-type': 'application/json' },
  });
};
