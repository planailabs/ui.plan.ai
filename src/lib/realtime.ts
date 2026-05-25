import type { RealtimeChannel, SupabaseClient } from '@supabase/supabase-js';

export type FrameSubmissionStatus =
  | 'received'
  | 'waiting_for_upload'
  | 'media_processing'
  | 'needs_review'
  | 'team_visible'
  | 'promotion_eligible'
  | 'promoted'
  | 'rejected'
  | 'failed';

export interface FrameSubmissionRow {
  id: string;
  tenant_id: string;
  agent_id: string;
  channel_id: string;
  status: FrameSubmissionStatus;
  metadata: Record<string, unknown>;
  metadata_schema_version: string;
  error: Record<string, unknown> | null;
  created_at: string;
  updated_at: string;
}

export interface FrameMediaRow {
  id: string;
  tenant_id: string;
  submission_id: string;
  kind: string;
  storage_provider: string;
  storage_key: string;
  delivery_id: string | null;
  status: string;
  failure_reason: string | null;
  metadata: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

export interface FrameEventRow {
  id: string;
  tenant_id: string;
  submission_id: string | null;
  event_type: string;
  actor_type: string;
  actor_id: string | null;
  request_id: string | null;
  payload: Record<string, unknown>;
  created_at: string;
}

/**
 * Map a frame_media row change to the documented dotted event name.
 * Per /docs/specifications/realtime-events:
 *  - status -> 'ready'  => frame.media.ready
 *  - status -> 'failed' => frame.media.failed
 *  - other transitions  => frame.media.status_changed
 */
export function mediaEventName(row: FrameMediaRow): string {
  if (row.status === 'ready') return 'frame.media.ready';
  if (row.status === 'failed') return 'frame.media.failed';
  return 'frame.media.status_changed';
}

/**
 * Map a frame_submissions row change to the documented dotted event name.
 */
export function submissionEventName(
  type: 'INSERT' | 'UPDATE' | 'DELETE',
  oldStatus: FrameSubmissionStatus | null,
  newStatus: FrameSubmissionStatus | null,
): string {
  if (type === 'INSERT') return 'frame.submission.created';
  if (newStatus === 'promoted') return 'frame.promoted';
  if (newStatus === 'rejected') return 'frame.rejected';
  if (oldStatus !== newStatus) return 'frame.submission.status_changed';
  return 'frame.submission.updated';
}

export function subscribeInbox(
  supabase: SupabaseClient,
  tenantId: string,
  handlers: {
    onSubmission?: (
      eventName: string,
      type: 'INSERT' | 'UPDATE' | 'DELETE',
      row: FrameSubmissionRow,
      old: FrameSubmissionRow | null,
    ) => void;
    onMedia?: (eventName: string, row: FrameMediaRow) => void;
    onEvent?: (row: FrameEventRow) => void;
  },
): RealtimeChannel {
  const filter = `tenant_id=eq.${tenantId}`;
  const channel = supabase.channel(`inbox:${tenantId}`, {
    config: { broadcast: { self: false } },
  });

  if (handlers.onSubmission) {
    channel.on(
      'postgres_changes' as never,
      { event: '*', schema: 'public', table: 'frame_submissions', filter },
      (payload: any) => {
        const type = payload.eventType as 'INSERT' | 'UPDATE' | 'DELETE';
        const row = (payload.new ?? payload.old) as FrameSubmissionRow;
        const old = (payload.old ?? null) as FrameSubmissionRow | null;
        const name = submissionEventName(
          type,
          old?.status ?? null,
          (payload.new as FrameSubmissionRow | null)?.status ?? null,
        );
        handlers.onSubmission!(name, type, row, old);
      },
    );
  }

  if (handlers.onMedia) {
    channel.on(
      'postgres_changes' as never,
      { event: '*', schema: 'public', table: 'frame_media', filter },
      (payload: any) => {
        const row = (payload.new ?? payload.old) as FrameMediaRow;
        handlers.onMedia!(mediaEventName(row), row);
      },
    );
  }

  if (handlers.onEvent) {
    channel.on(
      'postgres_changes' as never,
      { event: 'INSERT', schema: 'public', table: 'frame_events', filter },
      (payload: any) => {
        handlers.onEvent!(payload.new as FrameEventRow);
      },
    );
  }

  channel.subscribe();
  return channel;
}

export function subscribeFrame(
  supabase: SupabaseClient,
  submissionId: string,
  handlers: {
    onSubmission?: (eventName: string, row: FrameSubmissionRow) => void;
    onMedia?: (eventName: string, row: FrameMediaRow) => void;
    onEvent?: (row: FrameEventRow) => void;
  },
): RealtimeChannel {
  const channel = supabase.channel(`frame:${submissionId}`, {
    config: { broadcast: { self: false } },
  });

  if (handlers.onSubmission) {
    channel.on(
      'postgres_changes' as never,
      {
        event: 'UPDATE',
        schema: 'public',
        table: 'frame_submissions',
        filter: `id=eq.${submissionId}`,
      },
      (payload: any) => {
        const oldRow = payload.old as FrameSubmissionRow | null;
        const newRow = payload.new as FrameSubmissionRow;
        const name = submissionEventName(
          'UPDATE',
          oldRow?.status ?? null,
          newRow.status,
        );
        handlers.onSubmission!(name, newRow);
      },
    );
  }

  if (handlers.onMedia) {
    channel.on(
      'postgres_changes' as never,
      {
        event: '*',
        schema: 'public',
        table: 'frame_media',
        filter: `submission_id=eq.${submissionId}`,
      },
      (payload: any) => {
        const row = (payload.new ?? payload.old) as FrameMediaRow;
        handlers.onMedia!(mediaEventName(row), row);
      },
    );
  }

  if (handlers.onEvent) {
    channel.on(
      'postgres_changes' as never,
      {
        event: 'INSERT',
        schema: 'public',
        table: 'frame_events',
        filter: `submission_id=eq.${submissionId}`,
      },
      (payload: any) => {
        handlers.onEvent!(payload.new as FrameEventRow);
      },
    );
  }

  channel.subscribe();
  return channel;
}
