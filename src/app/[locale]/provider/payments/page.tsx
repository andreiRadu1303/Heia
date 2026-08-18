import { setRequestLocale } from 'next-intl/server';
import { CreditCard, CheckCircle2, AlertCircle, Sparkles, Receipt } from 'lucide-react';

import { createClient } from '@/lib/supabase/server';
import { getMyStudio } from '@/lib/provider-studio';
import { getStudioEarnings } from '@/lib/payments-server';
import { getStripe } from '@/lib/stripe/client';
import {
  isStripeConfigured,
  isStripeTestMode,
  feePercentLabel,
  getPlans,
} from '@/lib/stripe/config';
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

  let studio = await getMyStudio();
  const supabase = await createClient();

  // Sync payout status straight from Stripe rather than relying only on the
  // `account.updated` webhook (which can be delayed, misconfigured, or missed).
  let pendingRequirements: string[] = [];
  if (studio?.stripe_account_id && isStripeConfigured()) {
    try {
      const account = await getStripe().accounts.retrieve(studio.stripe_account_id);
      const enabled = Boolean(account.charges_enabled);
      pendingRequirements = [
        ...(account.requirements?.currently_due ?? []),
        ...(account.requirements?.past_due ?? []),
      ];
      if (enabled !== studio.stripe_charges_enabled) {
        await supabase
          .from('studios')
          .update({ stripe_charges_enabled: enabled })
          .eq('id', studio.id);
        studio = { ...studio, stripe_charges_enabled: enabled };
      }
    } catch (e) {
      // If Stripe doesn't know this account (e.g. it was created with keys from
      // a different mode — live vs test), clear it so the expert can reconnect
      // cleanly instead of being stuck against a stale id.
      const message = e instanceof Error ? e.message : '';
      if (/No such account|does not exist|similar object exists in/i.test(message)) {
        await supabase
          .from('studios')
          .update({ stripe_account_id: null, stripe_charges_enabled: false })
          .eq('id', studio.id);
        studio = { ...studio, stripe_account_id: null, stripe_charges_enabled: false };
      } else {
        console.error('Could not refresh Stripe account status', e);
      }
    }
  }

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
  const earnings = studio ? await getStudioEarnings(studio.id) : null;
  const money = (minor: number, currency: string) =>
    `${(minor / 100).toFixed(2)} ${currency.toUpperCase()}`;

  return (
    <main className="container max-w-2xl space-y-6 pt-8">
      <header>
        <h1 className="text-3xl font-medium tracking-tight sm:text-4xl">Payments</h1>
        <p className="mt-2 text-muted-foreground">Get paid for bookings and manage your plan.</p>
      </header>

      {configured ? (
        <div
          className={
            isStripeTestMode()
              ? 'rounded-xl border border-border bg-muted/40 px-3 py-2 font-mono text-xs uppercase tracking-widest text-muted-foreground'
              : 'rounded-xl border border-destructive/50 bg-destructive/10 px-3 py-2 font-mono text-xs uppercase tracking-widest text-destructive'
          }
        >
          {isStripeTestMode()
            ? 'Stripe · test mode — no real money'
            : '⚠ Stripe · LIVE mode — real cards will be charged'}
        </div>
      ) : null}

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
            <div className="space-y-3">
              {studio?.stripe_account_id && pendingRequirements.length > 0 ? (
                <div className="rounded-xl border border-border bg-background p-3 text-xs text-muted-foreground">
                  <div className="font-medium text-foreground">Stripe still needs:</div>
                  <ul className="mt-1 list-inside list-disc">
                    {pendingRequirements.slice(0, 6).map((r) => (
                      <li key={r}>{r.replace(/_/g, ' ').replace(/\./g, ' → ')}</li>
                    ))}
                  </ul>
                </div>
              ) : null}
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
            </div>
          )}
        </div>
      </section>

      {/* Earnings / transaction log */}
      {earnings ? (
        <section className="rounded-2xl border border-border bg-card p-5">
          <div className="flex items-center gap-2">
            <Receipt className="size-5 text-accent" />
            <h2 className="text-lg font-medium">Earnings</h2>
          </div>

          {earnings.count === 0 ? (
            <p className="mt-2 text-sm text-muted-foreground">
              No payments yet. Card payments for your bookings will show up here.
            </p>
          ) : (
            <>
              <div className="mt-4 grid grid-cols-3 gap-3">
                <div className="rounded-xl bg-background p-3">
                  <div className="text-xs text-muted-foreground">Collected</div>
                  <div className="mt-1 font-medium">
                    {money(earnings.grossMinor, earnings.currency)}
                  </div>
                </div>
                <div className="rounded-xl bg-background p-3">
                  <div className="text-xs text-muted-foreground">Heia fee</div>
                  <div className="mt-1 font-medium">
                    −{money(earnings.feeMinor, earnings.currency)}
                  </div>
                </div>
                <div className="rounded-xl bg-background p-3">
                  <div className="text-xs text-muted-foreground">Your net</div>
                  <div className="mt-1 font-medium text-accent">
                    {money(earnings.netMinor, earnings.currency)}
                  </div>
                </div>
              </div>

              <div className="mt-4 divide-y divide-border">
                {earnings.recent.map((p) => (
                  <div key={p.id} className="flex items-center justify-between gap-3 py-2.5">
                    <div className="min-w-0">
                      <div className="truncate text-sm font-medium">
                        {p.serviceName ?? 'Booking'}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {new Date(p.createdAt).toLocaleDateString(locale)}
                      </div>
                    </div>
                    <div className="shrink-0 text-right">
                      <div className="text-sm font-medium">
                        {money(p.amountMinor - p.feeMinor, earnings.currency)}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        of {money(p.amountMinor, earnings.currency)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </section>
      ) : null}

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
