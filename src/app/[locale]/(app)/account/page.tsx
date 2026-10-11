import { redirect } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';

import { createClient } from '@/lib/supabase/server';
import { Link } from '@/i18n/navigation';
import { AppTopBar } from '@/components/app/app-top-bar';
import { ClientNav } from '@/components/app/client-nav';
import { Button } from '@/components/ui/button';
import { reconcilePaidSession } from '@/lib/payments-server';
import { logoutAction } from '../dashboard/actions';
import { AccountCard, type AccountProfile } from './account-card';
import { PasswordCard } from './password-card';

export const dynamic = 'force-dynamic';

export default async function AccountPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ booked?: string; paid?: string; session_id?: string; reset?: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const sp = await searchParams;

  // Safety net: record the payment ourselves if the webhook hasn't (idempotent).
  if (sp.session_id) {
    await reconcilePaidSession(sp.session_id);
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect(`/${locale}/login`);

  const { data: profile } = await supabase
    .from('profiles')
    .select('display_name, role, marketing_consent, created_at, avatar_url')
    .eq('id', user.id)
    .maybeSingle();

  // Separate query so a not-yet-applied migration 011 only loses the city.
  const { data: cityRow } = await supabase
    .from('profiles')
    .select('city')
    .eq('id', user.id)
    .maybeSingle();

  const justBooked = sp.booked === '1';

  return (
    <div className="min-h-dvh pb-24">
      <AppTopBar title="My Account" backHref="/dashboard" />

      <main className="container space-y-8 pt-6">
        {justBooked ? (
          <div className="rounded-3xl bg-accent/15 p-4 text-sm ring-1 ring-accent/30">
            <b>Booking sent.</b> The provider will confirm or decline shortly — follow the status
            in{' '}
            <Link href="/bookings" className="font-medium underline underline-offset-4">
              My Bookings
            </Link>
            .
          </div>
        ) : null}

        <section>
          <AccountCard
            email={user.email ?? ''}
            locale={locale}
            profile={{
              display_name: profile?.display_name ?? '',
              role: (profile?.role as AccountProfile['role']) ?? null,
              marketing_consent: profile?.marketing_consent ?? false,
              created_at: profile?.created_at ?? null,
              avatar_url: profile?.avatar_url ?? null,
              city: cityRow?.city ?? null,
            }}
          />
        </section>

        <section>
          <PasswordCard locale={locale} openByDefault={sp.reset === '1'} />
        </section>

        <form action={logoutAction}>
          <input type="hidden" name="locale" value={locale} />
          <Button type="submit" variant="outline" className="w-full">
            Sign out
          </Button>
        </form>
      </main>

      <ClientNav />
    </div>
  );
}
