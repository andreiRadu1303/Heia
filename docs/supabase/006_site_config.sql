-- =============================================================
-- Heia · migration 006 · studio site_config
-- =============================================================
-- Run AFTER 003_marketplace.sql. Paste into Supabase SQL Editor → Run.
-- Idempotent — re-running is safe.
--
-- Adds a single JSONB column that stores an expert's mini-site design
-- (template + theme + ordered sections). One column, so new templates,
-- palettes, section types and variants never require a schema change.
-- Shape mirrors `SiteConfig` in src/lib/site-config.ts.
-- =============================================================

alter table public.studios
  add column if not exists site_config jsonb;

comment on column public.studios.site_config is
  'Expert mini-site design (SiteConfig JSON): template, theme, sections. Null = use default template.';

-- Existing RLS from 003 already covers this column:
--   * "Studios: published are public" → anyone can read site_config of a
--      published studio (needed to render the public page).
--   * "Studios: providers update own" → only the owner can write it.
-- No new policies required.
