import type { APIRoute } from 'astro';
import { v1Repository } from '../../../lib/v1';

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body, null, 2), {
    status,
    headers: { 'content-type': 'application/json' },
  });

export const GET: APIRoute = () => {
  return json({ data: v1Repository.listPublicFrames() });
};

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();

    if (!body?.agent || !body?.prompt) {
      return json({ error: { code: 'VALIDATION_ERROR', message: 'agent and prompt are required' } }, 400);
    }

    const frame = v1Repository.submitFrame({
      tenantId: body.tenantId ?? 't1',
      channelId: body.channelId ?? 'c1',
      agent: String(body.agent),
      prompt: String(body.prompt),
    });

    return json({ data: frame }, 201);
  } catch {
    return json({ error: { code: 'INVALID_JSON', message: 'request body must be valid JSON' } }, 400);
  }
};
