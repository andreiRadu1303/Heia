-- =============================================================
-- Heia · migration 003 · marketplace (studios, services, bookings)
-- =============================================================
-- Run AFTER 001_init.sql and 002_roles.sql. Paste into Supabase
-- SQL Editor → Run. Idempotent — re-running is safe.
--
-- What it does:
--   1. studios       — one row per provider (or per seeded demo studio)
--   2. services      — what each studio offers
--   3. bookings      — client books a service at a specific time
--   4. RLS policies for all three
--   5. Auto-creates a fresh studio when a provider signs up
--   6. touch_updated_at triggers
-- =============================================================

-- 1. Studios ---------------------------------------------------------

create table if not exists public.studios (
  id              uuid primary key default gen_random_uuid(),
  slug            text not null unique,
  provider_id     uuid references auth.users(id) on delete set null,

  -- Display
  name            text not null,
  category_id     text not null,
  tagline         text,
  bio             text,

  -- Location
  city            text not null default 'București',
  address         text,
  lat             double precision,
  lng             double precision,

  -- Surface
  hero_seed       text,
  avatar_seed     text,
  gallery_seeds   text[] not null default '{}',
  known_for       text[] not null default '{}',

  -- Catalogue head (cached for listing performance; real source is services)
  price_from_lei  integer not null default 0,
  rating          numeric(3,2) not null default 0,
  review_count    integer not null default 0,

  is_published    boolean not null default false,

  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

comment on table public.studios is
  'Studio / provider profile. provider_id is nullable so seeded demo studios can exist without an owner.';

create index if not exists studios_category_idx     on public.studios (category_id);
create index if not exists studios_provider_idx     on public.studios (provider_id);
create index if not exists studios_is_published_idx on public.studios (is_published);

-- 2. Services -------------------------------------------------------

create table if not exists public.services (
  id             uuid primary key default gen_random_uuid(),
  studio_id      uuid not null references public.studios(id) on delete cascade,
  name           text not null,
  duration_min   integer not null check (duration_min > 0),
  price_lei      integer not null check (price_lei >= 0),
  sort_order     integer not null default 0,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);

create index if not exists services_studio_idx on public.services (studio_id);

-- One service name per studio (lets us seed idempotently and prevents
-- accidental duplicates when a provider edits).
do $$
begin
  if not exists (
    select 1 from pg_constraint where conname = 'services_studio_id_name_key'
  ) then
    alter table public.services
      add constraint services_studio_id_name_key unique (studio_id, name);
  end if;
end$$;

-- 3. Bookings -------------------------------------------------------

do $$
begin
  if not exists (select 1 from pg_type where typname = 'booking_status') then
    create type public.booking_status as enum
      ('pending', 'confirmed', 'declined', 'cancelled', 'completed');
  end if;
end$$;

create table if not exists public.bookings (
  id             uuid primary key default gen_random_uuid(),
  studio_id      uuid not null references public.studios(id) on delete cascade,
  service_id     uuid references public.services(id) on delete set null,
  client_id      uuid not null references auth.users(id) on delete cascade,

  -- Snapshot of what was booked (so it survives service edits/deletes)
  service_name   text not null,
  price_lei      integer not null,
  duration_min   integer not null,

  scheduled_at   timestamptz not null,
  status         public.booking_status not null default 'pending',
  notes          text,

  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);

create index if not exists bookings_client_idx    on public.bookings (client_id, scheduled_at desc);
create index if not exists bookings_studio_idx    on public.bookings (studio_id, scheduled_at desc);
create index if not exists bookings_status_idx    on public.bookings (status);

-- 4. updated_at triggers (reuse touch_updated_at from 001) ---------

drop trigger if exists studios_touch_updated_at  on public.studios;
create trigger studios_touch_updated_at
  before update on public.studios
  for each row execute function public.touch_updated_at();

drop trigger if exists services_touch_updated_at on public.services;
create trigger services_touch_updated_at
  before update on public.services
  for each row execute function public.touch_updated_at();

drop trigger if exists bookings_touch_updated_at on public.bookings;
create trigger bookings_touch_updated_at
  before update on public.bookings
  for each row execute function public.touch_updated_at();

-- 5. Row Level Security: studios -----------------------------------

alter table public.studios enable row level security;

drop policy if exists "Studios: published are public" on public.studios;
create policy "Studios: published are public"
  on public.studios for select
  using (is_published = true or provider_id = auth.uid());

drop policy if exists "Studios: providers update own" on public.studios;
create policy "Studios: providers update own"
  on public.studios for update
  using (provider_id = auth.uid())
  with check (provider_id = auth.uid());

-- Inserts of studios happen via the signup trigger below for providers.
-- Manual inserts (e.g. claiming/creating a second studio) would need a
-- policy; not in v1 scope.

-- 6. Row Level Security: services ----------------------------------

alter table public.services enable row level security;

drop policy if exists "Services: visible when studio is" on public.services;
create policy "Services: visible when studio is"
  on public.services for select
  using (
    exists (
      select 1 from public.studios s
      where s.id = services.studio_id
        and (s.is_published = true or s.provider_id = auth.uid())
    )
  );

drop policy if exists "Services: providers manage own" on public.services;
create policy "Services: providers manage own"
  on public.services for all
  using (
    exists (
      select 1 from public.studios s
      where s.id = services.studio_id
        and s.provider_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1 from public.studios s
      where s.id = services.studio_id
        and s.provider_id = auth.uid()
    )
  );

-- 7. Row Level Security: bookings ----------------------------------

alter table public.bookings enable row level security;

-- Clients read their own bookings.
drop policy if exists "Bookings: client reads own" on public.bookings;
create policy "Bookings: client reads own"
  on public.bookings for select
  using (client_id = auth.uid());

-- Providers read bookings for studios they own.
drop policy if exists "Bookings: provider reads studio" on public.bookings;
create policy "Bookings: provider reads studio"
  on public.bookings for select
  using (
    exists (
      select 1 from public.studios s
      where s.id = bookings.studio_id
        and s.provider_id = auth.uid()
    )
  );

-- Clients create their own bookings.
drop policy if exists "Bookings: client creates own" on public.bookings;
create policy "Bookings: client creates own"
  on public.bookings for insert
  with check (client_id = auth.uid());

-- Providers update status of bookings on their own studio.
drop policy if exists "Bookings: provider updates own studio" on public.bookings;
create policy "Bookings: provider updates own studio"
  on public.bookings for update
  using (
    exists (
      select 1 from public.studios s
      where s.id = bookings.studio_id
        and s.provider_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1 from public.studios s
      where s.id = bookings.studio_id
        and s.provider_id = auth.uid()
    )
  );

-- Clients can cancel their own bookings.
drop policy if exists "Bookings: client cancels own" on public.bookings;
create policy "Bookings: client cancels own"
  on public.bookings for update
  using (client_id = auth.uid())
  with check (client_id = auth.uid());

-- 8. Auto-create a studio for new providers -----------------------

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  v_role text;
  v_display_name text;
  v_studio_slug text;
begin
  v_role := case
    when new.raw_user_meta_data ->> 'role' = 'provider' then 'provider'
    else 'client'
  end;

  v_display_name := coalesce(
    nullif(trim(new.raw_user_meta_data ->> 'display_name'), ''),
    split_part(new.email, '@', 1)
  );

  -- 1) Always create a profile row.
  insert into public.profiles (
    id,
    display_name,
    locale,
    marketing_consent,
    marketing_consent_at,
    role
  )
  values (
    new.id,
    v_display_name,
    coalesce(new.raw_user_meta_data ->> 'locale', 'ro'),
    coalesce((new.raw_user_meta_data ->> 'marketing_consent')::boolean, false),
    case
      when (new.raw_user_meta_data ->> 'marketing_consent')::boolean = true
      then now()
      else null
    end,
    v_role
  );

  -- 2) If they're a provider, give them an unpublished placeholder studio
  --    so they have a workspace to edit. They publish it themselves.
  if v_role = 'provider' then
    v_studio_slug := 'studio-' || substr(replace(new.id::text, '-', ''), 1, 10);

    insert into public.studios (
      slug,
      provider_id,
      name,
      category_id,
      tagline,
      is_published
    )
    values (
      v_studio_slug,
      new.id,
      v_display_name || ' · Studio',
      'hair',
      'Edit your profile to get discovered',
      false
    )
    on conflict (slug) do nothing;
  end if;

  return new;
end;
$$;

-- Trigger on auth.users from 001 already references handle_new_user.

-- =============================================================
-- Done. After this, run 004_seed_studios.sql for the demo data.
-- =============================================================
