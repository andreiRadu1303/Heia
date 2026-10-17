-- =============================================================
-- Heia · migration 014 · retire the demo studios
-- =============================================================
-- Run when you're ready to show only REAL specialists (i.e. before any
-- public marketing). Idempotent — re-running is safe.
--
-- The seeded studios from 004_seed_studios.sql have no owner
-- (provider_id is null). They're useful while building, but they must not
-- appear to real clients: nobody can accept or fulfil their bookings.
--
-- This unpublishes them (keeps the rows, so nothing breaks and you can
-- re-publish for demos). To bring them back:
--   update public.studios set is_published = true where provider_id is null;
-- =============================================================

update public.studios
set is_published = false
where provider_id is null;

-- Sanity check — how many published studios remain (should be real ones only):
--   select count(*) from public.studios where is_published;
