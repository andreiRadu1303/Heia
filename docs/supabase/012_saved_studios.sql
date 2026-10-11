-- =============================================================
-- Heia · migration 012 · saved studios (client favourites)
-- =============================================================
-- Run AFTER 003_marketplace.sql. Paste into Supabase SQL Editor → Run.
-- Idempotent — re-running is safe.
--
-- What it does:
--   1. saved_studios: one row per (user, studio) the client has saved.
--   2. RLS: a user can read, add and remove only their own saves.
-- =============================================================

create table if not exists public.saved_studios (
  user_id    uuid not null references auth.users(id) on delete cascade,
  studio_id  uuid not null references public.studios(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (user_id, studio_id)
);

comment on table public.saved_studios is
  'Studios a client has saved (hearted). Shown on /saved.';

create index if not exists saved_studios_user_idx
  on public.saved_studios (user_id, created_at desc);

alter table public.saved_studios enable row level security;

drop policy if exists "Saved: user reads own" on public.saved_studios;
create policy "Saved: user reads own"
  on public.saved_studios for select
  using (auth.uid() = user_id);

drop policy if exists "Saved: user adds own" on public.saved_studios;
create policy "Saved: user adds own"
  on public.saved_studios for insert
  with check (auth.uid() = user_id);

drop policy if exists "Saved: user removes own" on public.saved_studios;
create policy "Saved: user removes own"
  on public.saved_studios for delete
  using (auth.uid() = user_id);
