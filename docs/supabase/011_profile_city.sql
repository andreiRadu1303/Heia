-- =============================================================
-- Heia · migration 011 · profile city
-- =============================================================
-- Run AFTER 001_init.sql. Paste into Supabase SQL Editor → Run.
-- Idempotent — re-running is safe.
--
-- (010 — provider_hours — was applied directly in the dashboard and is not
-- in this folder; this file does not depend on it.)
--
-- What it does:
--   Adds profiles.city: the city a client wants to discover and book in,
--   chosen from the picker in the app header. Values are ids from
--   src/lib/cities.ts (e.g. 'bucuresti'). NULL means "not chosen yet" and
--   the app falls back to the default city.
-- =============================================================

alter table public.profiles
  add column if not exists city text;

comment on column public.profiles.city is
  'City id from src/lib/cities.ts chosen by the user for discovery. NULL = default city.';
