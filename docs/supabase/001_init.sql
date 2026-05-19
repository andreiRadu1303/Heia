-- =============================================================
-- Heia · initial schema
-- =============================================================
-- Paste this into Supabase SQL Editor (Dashboard → SQL Editor → New query)
-- and click Run. It's idempotent for the parts it can be — re-running
-- after a fix is safe.
--
-- What it does:
--   1. Creates the public.profiles table (one row per authenticated user)
--   2. Adds Row Level Security so users can only edit their own profile
--   3. Adds a trigger that auto-inserts a profile row whenever a new
--      auth user is created (so signup never has to do two DB calls)
--   4. Adds an updated_at touch trigger
-- =============================================================

-- 1. Profiles table -------------------------------------------------

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null,
  handle text unique,
  bio text,
  avatar_url text,
  locale text not null default 'ro',
  marketing_consent boolean not null default false,
  marketing_consent_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.profiles is
  'Application-side user record. One row per auth.users entry, kept in sync via trigger.';

create index if not exists profiles_handle_idx on public.profiles (handle);

-- 2. Row Level Security ---------------------------------------------

alter table public.profiles enable row level security;

drop policy if exists "Profiles are viewable by everyone"
  on public.profiles;
create policy "Profiles are viewable by everyone"
  on public.profiles for select
  using (true);

drop policy if exists "Users can update own profile"
  on public.profiles;
create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- Inserts go through the trigger below, not through the API,
-- so we don't grant an insert policy.

-- 3. Auto-create profile on auth user signup ------------------------

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (
    id,
    display_name,
    locale,
    marketing_consent,
    marketing_consent_at
  )
  values (
    new.id,
    coalesce(
      nullif(trim(new.raw_user_meta_data ->> 'display_name'), ''),
      split_part(new.email, '@', 1)
    ),
    coalesce(new.raw_user_meta_data ->> 'locale', 'ro'),
    coalesce((new.raw_user_meta_data ->> 'marketing_consent')::boolean, false),
    case
      when (new.raw_user_meta_data ->> 'marketing_consent')::boolean = true
      then now()
      else null
    end
  );
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- 4. updated_at touch -----------------------------------------------

create or replace function public.touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists profiles_touch_updated_at on public.profiles;
create trigger profiles_touch_updated_at
  before update on public.profiles
  for each row execute function public.touch_updated_at();
