import { setRequestLocale } from 'next-intl/server';
import { CreditCard, CheckCircle2, AlertCircle, Sparkles } from 'lucide-react';

import { createClient } from '@/lib/supabase/server';
import { getMyStudio } from '@/lib/provider-studio';
import { isStripeConfigured, feePercentLabel, getPlans } from '@/lib/stripe/config';
import {
  startConnectOnboarding,
  openConnectDashboard,
  startSubscriptionCheckout,
  openBillingPortal,
} from './actions';

export const dynamic = 'force-dynamic';

export default async function ProviderPaymentsPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ err?: string; connected?: string; subscribed?: string }>;
}) {
  const { locale } = await params;
  const { err } = await searchParams;
  setRequestLocale(locale);

  const studio = await getMyStudio();
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const { data: profile } = user
    ? await supabase
        .from('profiles')
        .select('subscription_status, subscription_price_id')
        .eq('id', user.id)
        .maybeSingle()
    : { data: null };

  const configured = isStripeConfigured();
  const plans = getPlans();
  const subActive = profile?.subscription_status === 'active';

  return (
    <main className="container max-w-2xl space-y-6 pt-8">
      <header>
        <h1 className="text-3xl font-medium tracking-tight sm:text-4xl">Payments</h1>
        <p className="mt-2 text-muted-foreground">Get paid for bookings and manage your plan.</p>
      </header>

      {err ? (
        <div className="flex items-start gap-3 rounded-2xl border border-destructive/40 bg-destructive/10 p-4 text-sm text-destructive">
          <AlertCircle className="mt-0.5 size-4 shrink-0" />
          <span>
            <strong>Stripe couldn’t start onboarding.</strong>
            <br />
            {err}
          </span>
        </div>
      ) : null}

      {!configured ? (
        <div className="flex items-start gap-3 rounded-2xl border border-dashed border-border bg-muted/40 p-4 text-sm text-muted-foreground">
          <AlertCircle className="mt-0.5 size-4 shrink-0" />
          <span>
            Payments aren’t configured yet. Add your Stripe keys (see{' '}
            <code className="rounded bg-secondary px-1">docs/STRIPE_SETUP.md</code>) to enable
            payouts and subscriptions.
          </span>
        </div>
      ) : null}

      {/* Payouts (Connect) */}
      <section className="rounded-2xl border border-border bg-card p-5">
        <div className="flex items-center gap-2">
          <CreditCard className="size-5 text-accent" />
          <h2 className="text-lg font-medium">Getting paid</h2>
        </div>
        <p className="mt-1 text-sm text-muted-foreground">
          Clients pay by card at booking. Heia keeps a{' '}
          <strong className="text-foreground">{feePercentLabel()}</strong> platform fee; the rest is
          paid out to you via Stripe.
        </p>

        <div className="mt-4">
          {studio?.stripe_charges_enabled ? (
            <div className="space-y-3">
              <div className="inline-flex items-center gap-1.5 rounded-full bg-accent/10 px-3 py-1 text-sm font-medium text-accent">
                <CheckCircle2 className="size-4" /> Payouts active
              </div>
              <form action={openConnectDashboard}>
                <input type="hidden" name="locale" value={locale} />
                <button
                  type="submit"
                  disabled={!configured}
                  className="inline-flex h-10 items-center rounded-lg border border-border px-4 text-sm font-medium hover:bg-secondary disabled:opacity-50"
                >
                  Open Stripe dashboard
                </button>
              </form>
            </div>
          ) : (
            <form action={startConnectOnboarding}>
              <input type="hidden" name="locale" value={locale} />
              <button
                type="submit"
                disabled={!configured}
                className="inline-flex h-11 items-center gap-2 rounded-lg bg-foreground px-5 text-sm font-medium text-background disabled:opacity-50"
              >
                <CreditCard className="size-4" />
                {studio?.stripe_account_id ? 'Finish payout setup' : 'Connect payouts'}
              </button>
            </form>
          )}
        </div>
      </section>

      {/* Subscription plans */}
      <section className="rounded-2xl border border-border bg-card p-5">
        <div className="flex items-center gap-2">
          <Sparkles className="size-5 text-accent" />
          <h2 className="text-lg font-medium">Your plan</h2>
        </div>

        {subActive ? (
          <div className="mt-3 space-y-3">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-accent/10 px-3 py-1 text-sm font-medium text-accent">
              <CheckCircle2 className="size-4" /> Subscription active
            </div>
            <form action={openBillingPortal}>
              <input type="hidden" name="locale" value={locale} />
              <button
                type="submit"
                className="inline-flex h-10 items-center rounded-lg border border-border px-4 text-sm font-medium hover:bg-secondary"
              >
                Manage subscription
              </button>
            </form>
          </div>
        ) : plans.length === 0 ? (
          <p className="mt-2 text-sm text-muted-foreground">
            No plans configured yet. Add price ids in your env to offer subscriptions.
          </p>
        ) : (
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {plans.map((plan) => (
              <div key={plan.id} className="rounded-xl border border-border p-4">
                <div className="font-medium">{plan.name}</div>
                <p className="mt-1 text-sm text-muted-foreground">{plan.blurb}</p>
                <form action={startSubscriptionCheckout} className="mt-4">
                  <input type="hidden" name="locale" value={locale} />
                  <input type="hidden" name="priceId" value={plan.priceId} />
                  <button
                    type="submit"
                    disabled={!configured}
                    className="inline-flex h-10 w-full items-center justify-center rounded-lg bg-foreground text-sm font-medium text-background disabled:opacity-50"
                  >
                    Subscribe
                  </button>
                </form>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
