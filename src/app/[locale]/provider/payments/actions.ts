'use server';

import { redirect } from 'next/navigation';
import { headers } from 'next/headers';

import { createClient } from '@/lib/supabase/server';
import { getStripe } from '@/lib/stripe/client';

async function siteOrigin(): Promise<string> {
  if (process.env.NEXT_PUBLIC_SITE_URL) return process.env.NEXT_PUBLIC_SITE_URL;
  const host = (await headers()).get('host') ?? 'localhost:3000';
  return `https://${host}`;
}

/** Create/reuse the expert's Connect account and send them to onboarding. */
export async function startConnectOnboarding(formData: FormData) {
  const locale = String(formData.get('locale') ?? 'ro');
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect(`/${locale}/login`);

  const { data: studio } = await supabase
    .from('studios')
    .select('id, stripe_account_id')
    .eq('provider_id', user.id)
    .maybeSingle();
  if (!studio) redirect(`/${locale}/provider`);

  const stripe = getStripe();
  let accountId = studio.stripe_account_id as string | null;
  if (!accountId) {
    const account = await stripe.accounts.create({
      type: 'express',
      metadata: { studio_id: studio.id as string, user_id: user.id },
    });
    accountId = account.id;
    await supabase.from('studios').update({ stripe_account_id: accountId }).eq('id', studio.id);
  }

  const base = await siteOrigin();
  const link = await stripe.accountLinks.create({
    account: accountId,
    refresh_url: `${base}/${locale}/provider/payments`,
    return_url: `${base}/${locale}/provider/payments?connected=1`,
    type: 'account_onboarding',
  });
  redirect(link.url);
}

/** Open the expert's Stripe Express dashboard (view payouts). */
export async function openConnectDashboard(formData: FormData) {
  const locale = String(formData.get('locale') ?? 'ro');
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect(`/${locale}/login`);

  const { data: studio } = await supabase
    .from('studios')
    .select('stripe_account_id')
    .eq('provider_id', user.id)
    .maybeSingle();
  if (!studio?.stripe_account_id) redirect(`/${locale}/provider/payments`);

  const stripe = getStripe();
  const link = await stripe.accounts.createLoginLink(studio.stripe_account_id as string);
  redirect(link.url);
}

/** Start a subscription Checkout Session for the given price. */
export async function startSubscriptionCheckout(formData: FormData) {
  const locale = String(formData.get('locale') ?? 'ro');
  const priceId = String(formData.get('priceId') ?? '');
  if (!priceId) redirect(`/${locale}/provider/payments`);

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect(`/${locale}/login`);

  const { data: profile } = await supabase
    .from('profiles')
    .select('stripe_customer_id')
    .eq('id', user.id)
    .maybeSingle();

  const stripe = getStripe();
  let customerId = profile?.stripe_customer_id as string | null;
  if (!customerId) {
    const customer = await stripe.customers.create({
      email: user.email ?? undefined,
      metadata: { user_id: user.id },
    });
    customerId = customer.id;
    await supabase.from('profiles').update({ stripe_customer_id: customerId }).eq('id', user.id);
  }

  const base = await siteOrigin();
  const session = await stripe.checkout.sessions.create({
    mode: 'subscription',
    customer: customerId,
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: `${base}/${locale}/provider/payments?subscribed=1`,
    cancel_url: `${base}/${locale}/provider/payments`,
    metadata: { user_id: user.id, price_id: priceId },
  });

  if (session.url) redirect(session.url);
  redirect(`/${locale}/provider/payments`);
}

/** Open Stripe's billing portal so the user can manage/cancel their plan. */
export async function openBillingPortal(formData: FormData) {
  const locale = String(formData.get('locale') ?? 'ro');
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect(`/${locale}/login`);

  const { data: profile } = await supabase
    .from('profiles')
    .select('stripe_customer_id')
    .eq('id', user.id)
    .maybeSingle();
  if (!profile?.stripe_customer_id) redirect(`/${locale}/provider/payments`);

  const base = await siteOrigin();
  const stripe = getStripe();
  const portal = await stripe.billingPortal.sessions.create({
    customer: profile.stripe_customer_id as string,
    return_url: `${base}/${locale}/provider/payments`,
  });
  redirect(portal.url);
}
