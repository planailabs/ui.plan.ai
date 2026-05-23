import { serviceClient } from "./supabase.ts";

export interface FrameEventInput {
  tenant_id: string;
  submission_id?: string | null;
  event_type: string;
  actor_type: "agent" | "user" | "system";
  actor_id?: string | null;
  request_id?: string | null;
  payload?: Record<string, unknown>;
}

export async function appendEvent(e: FrameEventInput): Promise<void> {
  const supabase = serviceClient();
  const { error } = await supabase.from("frame_events").insert({
    tenant_id: e.tenant_id,
    submission_id: e.submission_id ?? null,
    event_type: e.event_type,
    actor_type: e.actor_type,
    actor_id: e.actor_id ?? null,
    request_id: e.request_id ?? null,
    payload: e.payload ?? {},
  });
  if (error) throw error;
}
