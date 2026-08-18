import { redirect } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';

import { createClient } from '@/lib/supabase/server';
import { Link } from '@/i18n/navigation';
import { AppTopBar } from '@/components/app/app-top-bar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { img, formatBookingDate } from '@/lib/app-mock-data';
import { reconcilePaidSession } from '@/lib/payments-server';
import { cn } from '@/lib/utils';
import { logoutAction, cancelMyBookingAction } from '../dashboard/actions';

export const dynamic = 'force-dynamic';

interface BookingWithStudio {
  id: string;
  scheduled_at: string;
  status: 'pending' | 'confirmed' | 'declined' | 'cancelled' | 'completed';
  service_name: string;
  studios: {
    slug: string;
    name: string;
    hero_seed: string | null;
  } | null;
}

export default async function AccountPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ booked?: string; paid?: string; session_id?: string }>;
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
    .select('display_name, role, marketing_consent, created_at')
    .eq('id', user.id)
    .maybeSingle();

  // RLS already restricts to bookings.client_id = auth.uid().
  const { data: bookingsRaw } = await supabase
    .from('bookings')
    .select('id, scheduled_at, status, service_name, studios(slug, name, hero_seed)')
    .order('scheduled_at', { ascending: true });

  const bookings = (bookingsRaw ?? []) as unknown as BookingWithStudio[];
  const justBooked = sp.booked === '1';

  return (
    <div className="min-h-dvh pb-12">
      <AppTopBar title="Account" backHref="/dashboard" />

      <main className="container space-y-8 pt-6">
        {justBooked ? (
          <div className="rounded-3xl bg-accent/15 p-4 text-sm ring-1 ring-accent/30">
            <b>Booking sent.</b> The provider will confirm or decline shortly — you’ll see the
            status update here.
          </div>
        ) : null}

        {/* Bookings */}
        <section>
          <h2 className="mb-4 text-xl font-medium tracking-tight">Your bookings</h2>
          {bookings.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-start gap-3 py-8">
                <p className="text-muted-foreground">No bookings yet.</p>
                <Button asChild>
                  <Link href="/dashboard">Find a service</Link>
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {bookings.map((b) => {
                const studio = b.studios;
                const datePart = b.scheduled_at.slice(0, 10);
                const timePart = b.scheduled_at.slice(11, 16);
                const cancellable = b.status === 'pending' || b.status === 'confirmed';
                return (
                  <div key={b.id} className="rounded-3xl bg-card ring-1 ring-border">
                  <Link
                    href={studio ? `/studio/${studio.slug}` : '/dashboard'}
                    className="flex items-center gap-3 p-3"
                  >
                    {studio?.hero_seed ? (
                      <img
                        src={img.square(studio.hero_seed)}
                        alt=""
                        className="size-16 shrink-0 rounded-2xl object-cover"
                      />
                    ) : (
                      <div
                        className="grid size-16 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-accent/30 to-secondary text-lg font-medium text-foreground/60"
                        aria-hidden
                      >
                        {(studio?.name ?? 'S').charAt(0).toUpperCase()}
                      </div>
                    )}
                    <div className="min-w-0 flex-1">
                      <div className="truncate font-medium">{studio?.name ?? 'Studio'}</div>
                      <div className="truncate text-sm text-muted-foreground">{b.service_name}</div>
                      <div className="mt-0.5 text-xs text-muted-foreground">
                        {formatBookingDate(datePart, locale)} · {timePart}
                      </div>
                    </div>
                    <span
                      className={cn(
                        'shrink-0 rounded-full px-3 py-1 text-xs font-medium capitalize',
                        b.status === 'pending' && 'bg-accent/15 text-foreground',
                        b.status === 'confirmed' && 'bg-secondary text-secondary-foreground',
                        b.status === 'declined' && 'bg-muted text-muted-foreground',
                        b.status === 'cancelled' && 'bg-muted text-muted-foreground',
                        b.status === 'completed' && 'bg-foreground text-background',
                      )}
                    >
                      {b.status}
                    </span>
                  </Link>

                  {cancellable ? (
                    <form action={cancelMyBookingAction} className="border-t border-border px-3 py-2">
                      <input type="hidden" name="locale" value={locale} />
                      <input type="hidden" name="bookingId" value={b.id} />
                      <button
                        type="submit"
                        className="text-xs font-medium text-muted-foreground hover:text-destructive"
                      >
                        Cancel booking
                      </button>
                    </form>
                  ) : null}
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* Account */}
        <section>
          <h2 className="mb-4 text-xl font-medium tracking-tight">Account</h2>
          <Card>
            <CardHeader>
              <CardDescription>Signed in as</CardDescription>
              <CardTitle className="text-lg">{user.email}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <Row label="Name" value={profile?.display_name ?? '—'} />
              <Row
                label="Account type"
                value={profile?.role === 'provider' ? 'Provider' : 'Client'}
              />
              <Row
                label="Marketing updates"
                value={profile?.marketing_consent ? 'Subscribed' : 'Off'}
              />
              <Row
                label="Member since"
                value={
                  profile?.created_at
                    ? new Date(profile.created_at).toLocaleDateString(locale)
                    : '—'
                }
              />
            </CardContent>
          </Card>
        </section>

        <form action={logoutAction}>
          <input type="hidden" name="locale" value={locale} />
          <Button type="submit" variant="outline" className="w-full">
            Sign out
          </Button>
        </form>
      </main>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-3 border-b border-border/60 pb-1.5 last:border-b-0">
      <span className="text-muted-foreground">{label}</span>
      <span className="truncate font-medium">{value}</span>
    </div>
  );
}
