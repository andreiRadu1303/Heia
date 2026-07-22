-- =============================================================
-- Heia · migration 007 · provider onboarding flag
-- =============================================================
-- Run AFTER 003_marketplace.sql. Paste into Supabase SQL Editor → Run.
-- Idempotent — re-running is safe.
--
-- Adds a timestamp that marks when an expert finished the first-run
-- onboarding wizard. NULL → they still need onboarding; the provider area
-- redirects them into it. Set once, then they're never nagged again.
-- =============================================================

alter table public.studios
  add column if not exists onboarded_at timestamptz;

comment on column public.studios.onboarded_at is
  'When the expert completed (or skipped) first-run onboarding. NULL = not yet.';

-- Existing seeded demo studios shouldn't trigger onboarding — mark them done.
update public.studios
  set onboarded_at = now()
  where onboarded_at is null
    and provider_id is null;
