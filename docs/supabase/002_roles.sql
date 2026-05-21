-- =============================================================
-- Heia · migration 002 · account roles
-- =============================================================
-- Run AFTER 001_init.sql. Paste into Supabase SQL Editor → Run.
--
-- Adds a single role per account (client | provider), chosen at
-- signup, and teaches the signup trigger to capture it from the
-- auth metadata our signup form sends.
-- =============================================================

-- 1. Add the role column (idempotent) -------------------------------

alter table public.profiles
  add column if not exists role text not null default 'client'
  check (role in ('client', 'provider'));

comment on column public.profiles.role is
  'Account type chosen at signup. client books services; provider offers them.';

-- 2. Update the signup trigger to read role from metadata -----------

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
    marketing_consent_at,
    role
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
    end,
    case
      when new.raw_user_meta_data ->> 'role' = 'provider' then 'provider'
      else 'client'
    end
  );
  return new;
end;
$$;

-- The trigger on auth.users from 001 already points at this function,
-- so no need to recreate it.
