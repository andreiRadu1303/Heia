-- =============================================================
-- Heia · migration 009 · Stripe (commission + subscriptions)
-- =============================================================
-- Run AFTER 003_marketplace.sql. Paste into Supabase SQL Editor → Run.
-- Idempotent — re-running is safe.
--
--   * studios   → Stripe Connect account id + charges-enabled flag (payouts)
--   * profiles  → Stripe customer id + subscription status (recurring plans)
--   * bookings  → paid_at marker
--   * payments  → one row per completed Checkout payment (with platform fee)
-- =============================================================

-- Connect (expert payouts) ---------------------------------------------------
alter table public.studios
  add column if not exists stripe_account_id      text,
  add column if not exists stripe_charges_enabled boolean not null default false;

-- Subscriptions (per user) ---------------------------------------------------
alter table public.profiles
  add column if not exists stripe_customer_id               text,
  add column if not exists subscription_status              text,
  add column if not exists subscription_price_id            text,
  add column if not exists subscription_current_period_end  timestamptz;

-- Bookings paid marker -------------------------------------------------------
alter table public.bookings
  add column if not exists paid_at timestamptz;

-- Payments ledger ------------------------------------------------------------
create table if not exists public.payments (
  id                        uuid primary key default gen_random_uuid(),
  booking_id                uuid references public.bookings(id) on delete set null,
  studio_id                 uuid references public.studios(id) on delete set null,
  client_id                 uuid references auth.users(id) on delete set null,
  stripe_session_id         text,
  stripe_payment_intent_id  text,
  amount_total              integer not null default 0,  -- minor units (bani)
  application_fee           integer not null default 0,  -- platform's cut, minor units
  currency                  text not null default 'ron',
  status                    text not null default 'pending',
  created_at                timestamptz not null default now()
);

create index if not exists payments_booking_idx on public.payments (booking_id);
create index if not exists payments_studio_idx  on public.payments (studio_id);
create index if not exists payments_client_idx  on public.payments (client_id);

alter table public.payments enable row level security;

-- Clients read their own payments; providers read payments for studios they own.
-- Inserts happen only from the Stripe webhook via the service-role key, which
-- bypasses RLS — so there is no public insert/update policy on purpose.
drop policy if exists "Payments: client reads own" on public.payments;
create policy "Payments: client reads own"
  on public.payments for select
  using (client_id = auth.uid());

drop policy if exists "Payments: provider reads studio" on public.payments;
create policy "Payments: provider reads studio"
  on public.payments for select
  using (
    exists (
      select 1 from public.studios s
      where s.id = payments.studio_id and s.provider_id = auth.uid()
    )
  );
