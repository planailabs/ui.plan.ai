-- v1 contract-conformance follow-up to 20260522000000_init + 20260528000000.
-- Council + Codex deep-review round 2. Aligns the live schema with the
-- documented contracts and closes trust-boundary gaps. Additive and guarded.
--
-- NOTE ON LOCKS: the text->enum cast (#7) and the unique-index swap (#6) take
-- brief table locks. The v1 frame tables are near-empty, so impact is
-- negligible; if these tables ever carry volume, run during a quiet window.

------------------------------------------------------------------------------
-- #7 frame_media.status: canonicalize on the documented enum value
--    'media_processing' (the migration shipped a plain text column; functions
--    wrote 'processing'; the spec + frontend use 'media_processing').
------------------------------------------------------------------------------
do $$
begin
  if not exists (select 1 from pg_type where typname = 'frame_media_status') then
    create type frame_media_status as enum ('received', 'media_processing', 'ready', 'failed');
  end if;
end $$;

-- Fail loudly if an unexpected value exists rather than silently dropping it.
do $$
begin
  if exists (
    select 1 from frame_media
    where status not in ('received', 'processing', 'media_processing', 'ready', 'failed')
  ) then
    raise exception 'frame_media has an unmappable status value; resolve before migrating';
  end if;
end $$;

update frame_media set status = 'media_processing' where status = 'processing';

alter table frame_media
  alter column status type frame_media_status using status::frame_media_status;

------------------------------------------------------------------------------
-- #6 Idempotency keys must be scoped per endpoint, not shared across
--    frame-submissions and media-uploads.
------------------------------------------------------------------------------
alter table frame_submissions
  add column if not exists idempotency_scope text not null default 'frame-submissions';

alter table frame_submissions
  drop constraint if exists frame_submissions_idempotency_scope_check;
alter table frame_submissions
  add constraint frame_submissions_idempotency_scope_check
  check (idempotency_scope in ('frame-submissions', 'media-uploads'));

-- Backfill scope for existing rows from observable signals (the media-uploads
-- flow stores _upload_url and creates the submission in waiting_for_upload).
update frame_submissions
set idempotency_scope = 'media-uploads'
where idempotency_scope = 'frame-submissions'
  and (status = 'waiting_for_upload' or metadata ? '_upload_url');

-- The old index made (api_key_id, idempotency_key) unique. No duplicates can
-- exist today, so the scoped index is safe to create before dropping the old.
create unique index if not exists frame_submissions_idempotency_scoped
  on frame_submissions (api_key_id, idempotency_scope, idempotency_key)
  where idempotency_key is not null;
drop index if exists frame_submissions_idempotency;

------------------------------------------------------------------------------
-- #4 Grandfather media-capability scopes onto existing keys so that enabling
--    enforcement in the Edge Functions does not lock out live tokens. This
--    does not broaden behavior (scopes were unenforced until now).
------------------------------------------------------------------------------
update api_keys
set scopes = (
  select array_agg(distinct s order by s)
  from unnest(coalesce(scopes, '{}'::text[]) || array['media:image', 'media:video']) as s
)
where revoked_at is null;

------------------------------------------------------------------------------
-- #9 Revoke direct client UPDATE on frame_submissions/frames. No client write
--    path exists today, and the workbench-app skill mandates that mutations
--    go through Edge Functions (service role, which bypasses RLS). Removing an
--    unused, over-broad permission closes the tampering surface now; a
--    review/promote Edge Function will own transitions when that UI lands.
------------------------------------------------------------------------------
drop policy if exists "frame_submissions member update" on frame_submissions;
drop policy if exists "frames member update" on frames;
revoke update on frame_submissions from authenticated;
revoke update on frames from authenticated;
