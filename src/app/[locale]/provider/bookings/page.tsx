import { redirect } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';
import { Check, X } from 'lucide-react';

import { createClient } from '@/lib/supabase/server';
import { img, formatLei, formatBookingDate } from '@/lib/app-mock-data';
import { cn } from '@/lib/utils';
import { acceptBookingAction, declineBookingAction } from './actions';

export const dynamic = 'force-dynamic';

interface BookingRow {
  id: string;
  scheduled_at: string;
  status: 'pending' | 'confirmed' | 'declined' | 'cancelled' | 'completed';
  service_name: string;
  price_lei: number;
  duration_min: number;
  client_id: string;
  studio_id: string;
}

interface ProfileRow {
  id: string;
  display_name: string | null;
}

interface BookingView {
  id: string;
  scheduledAt: string;
  status: BookingRow['status'];
  serviceName: string;
  priceLei: number;
  clientName: string;
  clientAvatarSeed: string;
}

export default async function ProviderBookingsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect(`/${locale}/login`);

  // RLS restricts to bookings whose studio is owned by this user.
  const { data: bookingsRaw } = await supabase
    .from('bookings')
    .select('id, scheduled_at, status, service_name, price_lei, duration_min, client_id, studio_id')
    .order('scheduled_at', { ascending: true });

  const bookings = (bookingsRaw ?? []) as BookingRow[];

  // Fetch client display names in one shot.
  const clientIds = Array.from(new Set(bookings.map((b) => b.client_id)));
  const profileById = new Map<string, ProfileRow>();
  if (clientIds.length > 0) {
    const { data: profilesRaw } = await supabase
      .from('profiles')
      .select('id, display_name')
      .in('id', clientIds);
    for (const p of (profilesRaw ?? []) as ProfileRow[]) profileById.set(p.id, p);
  }

  const view: BookingView[] = bookings.map((b) => {
    const p = profileById.get(b.client_id);
    return {
      id: b.id,
      scheduledAt: b.scheduled_at,
      status: b.status,
      serviceName: b.service_name,
      priceLei: b.price_lei,
      clientName: p?.display_name?.trim() || 'A client',
      clientAvatarSeed: b.client_id,
    };
  });

  const pending = view.filter((b) => b.status === 'pending');
  const confirmed = view.filter((b) => b.status === 'confirmed');
  const past = view.filter((b) => b.status === 'completed' || b.status === 'declined' || b.status === 'cancelled');

  return (
    <main className="container space-y-8 pt-8">
      <header>
        <h1 className="text-3xl font-medium tracking-tight sm:text-4xl">Bookings</h1>
        <p className="mt-2 text-muted-foreground">
          Requests to confirm, and what’s coming up.
        </p>
      </header>

      {pending.length > 0 ? (
        <section>
          <h2 className="mb-4 text-sm font-medium uppercase tracking-wide text-muted-foreground">
            Needs your response · {pending.length}
          </h2>
          <div className="space-y-3">
            {pending.map((b) => (
              <BookingCard key={b.id} booking={b} locale={locale} actionable />
            ))}
          </div>
        </section>
      ) : null}

      <section>
        <h2 className="mb-4 text-sm font-medium uppercase tracking-wide text-muted-foreground">
          Confirmed
        </h2>
        {confirmed.length === 0 ? (
          <div className="rounded-3xl bg-card p-6 text-sm text-muted-foreground ring-1 ring-border">
            Nothing on the books yet.
          </div>
        ) : (
          <div className="space-y-3">
            {confirmed.map((b) => (
              <BookingCard key={b.id} booking={b} locale={locale} />
            ))}
          </div>
        )}
      </section>

      {past.length > 0 ? (
        <section>
          <h2 className="mb-4 text-sm font-medium uppercase tracking-wide text-muted-foreground">
            Past
          </h2>
          <div className="space-y-3">
            {past.map((b) => (
              <BookingCard key={b.id} booking={b} locale={locale} muted />
            ))}
          </div>
        </section>
      ) : null}
    </main>
  );
}

function BookingCard({
  booking,
  locale,
  actionable,
  muted,
}: {
  booking: BookingView;
  locale: string;
  actionable?: boolean;
  muted?: boolean;
}) {
  const dateLabel = formatBookingDate(booking.scheduledAt.slice(0, 10), locale);
  const timeLabel = booking.scheduledAt.slice(11, 16);

  return (
    <div className={cn('rounded-3xl bg-card p-4 ring-1 ring-border', muted && 'opacity-70')}>
      <div className="flex items-center gap-3">
        <img
          src={img.avatar(booking.clientAvatarSeed)}
          alt=""
          className="size-12 shrink-0 rounded-full object-cover"
        />
        <div className="min-w-0 flex-1">
          <div className="truncate font-medium">{booking.clientName}</div>
          <div className="truncate text-sm text-muted-foreground">{booking.serviceName}</div>
          <div className="mt-0.5 text-xs text-muted-foreground">
            {dateLabel} · {timeLabel} · {formatLei(booking.priceLei)}
          </div>
        </div>
        <span
          className={cn(
            'shrink-0 rounded-full px-2.5 py-1 text-xs font-medium capitalize',
            booking.status === 'pending' && 'bg-accent/20 text-foreground',
            booking.status === 'confirmed' && 'bg-secondary text-secondary-foreground',
            booking.status === 'declined' && 'bg-muted text-muted-foreground',
            booking.status === 'cancelled' && 'bg-muted text-muted-foreground',
            booking.status === 'completed' && 'bg-foreground text-background',
          )}
        >
          {booking.status}
        </span>
      </div>

      {actionable ? (
        <div className="mt-3 grid grid-cols-2 gap-2">
          <form action={acceptBookingAction}>
            <input type="hidden" name="locale" value={locale} />
            <input type="hidden" name="bookingId" value={booking.id} />
            <button
              type="submit"
              className="inline-flex h-10 w-full items-center justify-center gap-1.5 rounded-full bg-foreground text-sm font-medium text-background"
            >
              <Check className="size-4" /> Accept
            </button>
          </form>
          <form action={declineBookingAction}>
            <input type="hidden" name="locale" value={locale} />
            <input type="hidden" name="bookingId" value={booking.id} />
            <button
              type="submit"
              className="inline-flex h-10 w-full items-center justify-center gap-1.5 rounded-full border border-border text-sm font-medium"
            >
              <X className="size-4" /> Decline
            </button>
          </form>
        </div>
      ) : null}
    </div>
  );
}
