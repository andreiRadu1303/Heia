-- =============================================================
-- Heia · migration 010 · provider working hours
-- =============================================================
-- Run AFTER 003_marketplace.sql. Paste into Supabase SQL Editor → Run.
-- Idempotent — re-running is safe.
--
-- Replaces the hardcoded booking slots with real availability:
-- one row per studio per weekday. Bookable slots are computed as
-- (open → close, stepped by service duration) minus existing bookings.
-- =============================================================

create table if not exists public.provider_hours (
  id          uuid primary key default gen_random_uuid(),
  studio_id   uuid not null references public.studios(id) on delete cascade,
  -- 0 = Sunday … 6 = Saturday (matches JS Date.getDay()).
  weekday     smallint not null check (weekday between 0 and 6),
  is_open     boolean not null default true,
  opens_at    text not null default '09:00',   -- 'HH:MM' local time
  closes_at   text not null default '18:00',
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now(),
  unique (studio_id, weekday)
);

create index if not exists provider_hours_studio_idx on public.provider_hours (studio_id);

drop trigger if exists provider_hours_touch_updated_at on public.provider_hours;
create trigger provider_hours_touch_updated_at
  before update on public.provider_hours
  for each row execute function public.touch_updated_at();

-- RLS ---------------------------------------------------------------------
alter table public.provider_hours enable row level security;

-- Anyone can read the hours of a published studio (needed to show slots).
drop policy if exists "Hours: public read" on public.provider_hours;
create policy "Hours: public read"
  on public.provider_hours for select
  using (
    exists (
      select 1 from public.studios s
      where s.id = provider_hours.studio_id
        and (s.is_published = true or s.provider_id = auth.uid())
    )
  );

-- Only the owning provider can write them.
drop policy if exists "Hours: provider manages own" on public.provider_hours;
create policy "Hours: provider manages own"
  on public.provider_hours for all
  using (
    exists (
      select 1 from public.studios s
      where s.id = provider_hours.studio_id and s.provider_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1 from public.studios s
      where s.id = provider_hours.studio_id and s.provider_id = auth.uid()
    )
  );

-- Seed sensible defaults for existing studios (Mon–Fri 09–18, Sat 10–16, Sun closed)
insert into public.provider_hours (studio_id, weekday, is_open, opens_at, closes_at)
select s.id, d.weekday, d.is_open, d.opens_at, d.closes_at
from public.studios s
cross join (values
  (0, false, '10:00', '16:00'),
  (1, true,  '09:00', '18:00'),
  (2, true,  '09:00', '18:00'),
  (3, true,  '09:00', '18:00'),
  (4, true,  '09:00', '18:00'),
  (5, true,  '09:00', '18:00'),
  (6, true,  '10:00', '16:00')
) as d(weekday, is_open, opens_at, closes_at)
on conflict (studio_id, weekday) do nothing;
