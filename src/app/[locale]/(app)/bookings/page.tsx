import { redirect } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';

import { createClient } from '@/lib/supabase/server';
import { Link } from '@/i18n/navigation';
import { AppTopBar } from '@/components/app/app-top-bar';
import { ClientNav } from '@/components/app/client-nav';
import { BookingCard, type BookingWithStudio } from '@/components/app/booking-card';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { BookingsTabs } from './bookings-tabs';

export const dynamic = 'force-dynamic';

export default async function BookingsPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ booked?: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const sp = await searchParams;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect(`/${locale}/login?next=/${locale}/bookings`);

  // RLS already restricts to bookings.client_id = auth.uid().
  const { data: rows } = await supabase
    .from('bookings')
    .select('id, scheduled_at, status, service_name, studios(slug, name, hero_seed, cover_url)')
    .order('scheduled_at', { ascending: true });

  const bookings = (rows ?? []) as unknown as BookingWithStudio[];

  // `scheduled_at` is a naive local datetime; compare against local "now".
  const now = new Date();
  const nowLocal = new Date(now.getTime() - now.getTimezoneOffset() * 60_000)
    .toISOString()
    .slice(0, 19);

  // Upcoming = still live (pending / confirmed) and not yet happened.
  // Everything else — done, declined, cancelled, or in the past — is history.
  const upcoming = bookings.filter(
    (b) => (b.status === 'pending' || b.status === 'confirmed') && b.scheduled_at >= nowLocal,
  );
  const past = bookings.filter((b) => !upcoming.includes(b)).reverse(); // most recent first

  return (
    <div className="min-h-dvh pb-24">
      <AppTopBar title="My Bookings" backHref="/dashboard" />

      <main className="container space-y-6 pt-6">
        {sp.booked === '1' ? (
          <div className="rounded-3xl bg-accent/15 p-4 text-sm ring-1 ring-accent/30">
            <b>Booking sent.</b> The provider will confirm or decline shortly — you’ll see the
            status update here.
          </div>
        ) : null}

        <BookingsTabs
          upcomingCount={upcoming.length}
          pastCount={past.length}
          upcoming={
            upcoming.length === 0 ? (
              <EmptyState text="No upcoming bookings." cta="Find a service" />
            ) : (
              <div className="space-y-3">
                {upcoming.map((b) => (
                  <BookingCard key={b.id} booking={b} locale={locale} />
                ))}
              </div>
            )
          }
          past={
            past.length === 0 ? (
              <EmptyState text="No past bookings yet." />
            ) : (
              <div className="space-y-3">
                {past.map((b) => (
                  <BookingCard key={b.id} booking={b} locale={locale} />
                ))}
              </div>
            )
          }
        />
      </main>

      <ClientNav />
    </div>
  );
}

function EmptyState({ text, cta }: { text: string; cta?: string }) {
  return (
    <Card>
      <CardContent className="flex flex-col items-start gap-3 py-8">
        <p className="text-muted-foreground">{text}</p>
        {cta ? (
          <Button asChild>
            <Link href="/dashboard">{cta}</Link>
          </Button>
        ) : null}
      </CardContent>
    </Card>
  );
}
