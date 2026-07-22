-- =============================================================
-- Heia · migration 008 · studio media (photo uploads)
-- =============================================================
-- Run AFTER 003_marketplace.sql. Paste into Supabase SQL Editor → Run.
-- Idempotent — re-running is safe.
--
-- What it does:
--   1. Creates a public "studio-media" storage bucket for uploaded photos.
--   2. Storage policies: anyone can read; an authenticated user can only
--      write/replace/delete files inside a folder named after their own uid.
--   3. Adds avatar_url, cover_url, gallery_urls columns to studios.
-- =============================================================

-- 1. Bucket (public read) ----------------------------------------------------

insert into storage.buckets (id, name, public)
values ('studio-media', 'studio-media', true)
on conflict (id) do nothing;

-- 2. Storage policies on storage.objects -------------------------------------
-- Files are stored at "<user-id>/<filename>", so the first path segment must
-- match the uploader's uid.

drop policy if exists "studio-media public read" on storage.objects;
create policy "studio-media public read"
  on storage.objects for select
  using (bucket_id = 'studio-media');

drop policy if exists "studio-media owner insert" on storage.objects;
create policy "studio-media owner insert"
  on storage.objects for insert to authenticated
  with check (
    bucket_id = 'studio-media'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

drop policy if exists "studio-media owner update" on storage.objects;
create policy "studio-media owner update"
  on storage.objects for update to authenticated
  using (
    bucket_id = 'studio-media'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

drop policy if exists "studio-media owner delete" on storage.objects;
create policy "studio-media owner delete"
  on storage.objects for delete to authenticated
  using (
    bucket_id = 'studio-media'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

-- 3. Studio image columns ----------------------------------------------------

alter table public.studios
  add column if not exists avatar_url   text,
  add column if not exists cover_url    text,
  add column if not exists gallery_urls text[] not null default '{}';

comment on column public.studios.cover_url is 'Uploaded hero/cover image URL. Falls back to a placeholder when null.';
comment on column public.studios.gallery_urls is 'Uploaded portfolio image URLs.';
