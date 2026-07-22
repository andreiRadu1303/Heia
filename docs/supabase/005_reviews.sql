-- =============================================================
-- Heia · migration 005 · reviews
-- =============================================================
-- Run AFTER 003_marketplace.sql. Paste into Supabase SQL Editor → Run.
-- Idempotent — re-running is safe.
--
-- Model (mirrors src/lib/reviews.ts):
--   * three sub-scores 1..5 (quality, cleanliness, value)
--   * overall = their average (computed, not stored)
--   * recommend flag + would_return (yes|no|maybe)
--   * quick tags (text[])
--   * free-text body
--   * VERIFIED = the review references a COMPLETED booking (anti-fake-review):
--       - booking_id is required and UNIQUE (one review per booking)
--       - RLS insert policy checks the booking is the author's and completed
--   * a trigger keeps studios.rating + review_count denormalised
-- =============================================================

-- 1. would_return enum -------------------------------------------------------

do $$
begin
  if not exists (select 1 from pg_type where typname = 'would_return') then
    create type public.would_return as enum ('yes', 'no', 'maybe');
  end if;
end$$;

-- 2. reviews table -----------------------------------------------------------

create table if not exists public.reviews (
  id                uuid primary key default gen_random_uuid(),
  studio_id         uuid not null references public.studios(id) on delete cascade,
  -- One review per booking → the review is verified by construction.
  booking_id        uuid not null unique references public.bookings(id) on delete cascade,
  author_id         uuid not null references auth.users(id) on delete cascade,

  score_quality     smallint not null check (score_quality     between 1 and 5),
  score_cleanliness smallint not null check (score_cleanliness between 1 and 5),
  score_value       smallint not null check (score_value       between 1 and 5),

  recommend         boolean not null default true,
  would_return      public.would_return not null default 'maybe',
  tags              text[] not null default '{}',
  body              text,

  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);

create index if not exists reviews_studio_idx on public.reviews (studio_id, created_at desc);
create index if not exists reviews_author_idx on public.reviews (author_id);

-- Overall score as a helper (average of the three sub-scores).
create or replace function public.review_overall(r public.reviews)
returns numeric language sql immutable as $$
  select round((r.score_quality + r.score_cleanliness + r.score_value)::numeric / 3, 2)
$$;

-- updated_at
drop trigger if exists reviews_touch_updated_at on public.reviews;
create trigger reviews_touch_updated_at
  before update on public.reviews
  for each row execute function public.touch_updated_at();

-- 3. Row Level Security ------------------------------------------------------

alter table public.reviews enable row level security;

-- Anyone can read reviews of a published studio (public profile surface).
drop policy if exists "Reviews: public read" on public.reviews;
create policy "Reviews: public read"
  on public.reviews for select
  using (
    exists (
      select 1 from public.studios s
      where s.id = reviews.studio_id
        and (s.is_published = true or s.provider_id = auth.uid())
    )
  );

-- A client may insert a review ONLY for their own COMPLETED booking at this
-- studio. This is the anti-fake-review gate.
drop policy if exists "Reviews: author inserts for completed booking" on public.reviews;
create policy "Reviews: author inserts for completed booking"
  on public.reviews for insert
  with check (
    author_id = auth.uid()
    and exists (
      select 1 from public.bookings b
      where b.id = reviews.booking_id
        and b.client_id = auth.uid()
        and b.studio_id = reviews.studio_id
        and b.status = 'completed'
    )
  );

-- Authors can edit / delete their own review.
drop policy if exists "Reviews: author updates own" on public.reviews;
create policy "Reviews: author updates own"
  on public.reviews for update
  using (author_id = auth.uid())
  with check (author_id = auth.uid());

drop policy if exists "Reviews: author deletes own" on public.reviews;
create policy "Reviews: author deletes own"
  on public.reviews for delete
  using (author_id = auth.uid());

-- 4. Keep studios.rating + review_count denormalised -------------------------

create or replace function public.refresh_studio_rating()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  v_studio uuid := coalesce(new.studio_id, old.studio_id);
begin
  update public.studios s
  set
    review_count = sub.cnt,
    rating = coalesce(sub.avg_overall, 0)
  from (
    select
      count(*) as cnt,
      avg((score_quality + score_cleanliness + score_value)::numeric / 3) as avg_overall
    from public.reviews
    where studio_id = v_studio
  ) sub
  where s.id = v_studio;

  return null;
end;
$$;

drop trigger if exists reviews_refresh_rating on public.reviews;
create trigger reviews_refresh_rating
  after insert or update or delete on public.reviews
  for each row execute function public.refresh_studio_rating();

-- =============================================================
-- Done. The public profile reads: avg (studios.rating), count
-- (studios.review_count), and the individual rows for breakdown + comments.
-- =============================================================
