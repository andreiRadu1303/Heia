-- =============================================================
-- Heia · migration 013 · profile phone number
-- =============================================================
-- Run AFTER 001_init.sql. Paste into Supabase SQL Editor → Run.
-- Idempotent — re-running is safe.
--
-- What it does:
--   Adds profiles.phone: the user's contact number, edited on My Account.
--   Stored normalised (digits with an optional leading +, no spaces).
--   NULL = not provided.
-- =============================================================

alter table public.profiles
  add column if not exists phone text;

comment on column public.profiles.phone is
  'Contact phone, normalised to digits with optional leading +. NULL = not provided.';
