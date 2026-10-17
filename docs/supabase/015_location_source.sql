-- =============================================================
-- Heia · migration 015 · how a studio's pin was placed
-- =============================================================
-- Run after 013. Idempotent — re-running is safe.
--
-- Experts can place their pin by hand, which must outrank geocoding:
-- otherwise fixing a typo in the address would silently drag a carefully
-- placed pin somewhere else. 'manual' pins are never auto-overwritten.
--
--   null / 'geocoded' → derived from the address, safe to refresh
--   'manual'          → the expert positioned it; leave it alone
-- =============================================================

alter table public.studios
  add column if not exists location_source text
    check (location_source in ('geocoded', 'manual'));

-- Existing coordinates came from geocoding (or the old jitter fallback).
update public.studios
set location_source = 'geocoded'
where location_source is null
  and lat is not null
  and lng is not null;

comment on column public.studios.location_source is
  'How lat/lng were set: geocoded from the address, or placed manually by the expert.';
