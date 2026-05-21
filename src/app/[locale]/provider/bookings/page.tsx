import { setRequestLocale } from 'next-intl/server';
import { Check, X } from 'lucide-react';

import {
  INCOMING_BOOKINGS,
  img,
  formatLei,
  formatBookingDate,
  type IncomingBooking,
} from '@/lib/app-mock-data';
import { cn } from '@/lib/utils';

export default async function ProviderBookingsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const pending = INCOMING_BOOKINGS.filter((b) => b.status === 'pending');
  const confirmed = INCOMING_BOOKINGS.filter((b) => b.status === 'confirmed');

  return (
    <main className="container space-y-8 pt-8">
      <header>
        <h1 className="text-3xl font-medium tracking-tight sm:text-4xl">Bookings</h1>
        <p className="mt-2 text-muted-foreground">Requests to confirm, and what’s coming up.</p>
      </header>

      {pending.length > 0 ? (
        <section>
          <h2 className="mb-4 text-sm font-medium uppercase tracking-wide text-muted-foreground">
            Needs your response
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
        <div className="space-y-3">
          {confirmed.map((b) => (
            <BookingCard key={b.id} booking={b} locale={locale} />
          ))}
        </div>
      </section>
    </main>
  );
}

function BookingCard({
  booking,
  locale,
  actionable,
}: {
  booking: IncomingBooking;
  locale: string;
  actionable?: boolean;
}) {
  return (
    <div className="rounded-3xl bg-card p-4 ring-1 ring-border">
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
            {formatBookingDate(booking.date, locale)} · {booking.time} · {formatLei(booking.priceLei)}
          </div>
        </div>
        <span
          className={cn(
            'shrink-0 rounded-full px-2.5 py-1 text-xs font-medium capitalize',
            booking.status === 'pending'
              ? 'bg-accent/20 text-foreground'
              : 'bg-secondary text-secondary-foreground',
          )}
        >
          {booking.status}
        </span>
      </div>

      {actionable ? (
        <div className="mt-3 grid grid-cols-2 gap-2">
          <button className="inline-flex h-10 items-center justify-center gap-1.5 rounded-full bg-foreground text-sm font-medium text-background">
            <Check className="size-4" /> Accept
          </button>
          <button className="inline-flex h-10 items-center justify-center gap-1.5 rounded-full border border-border text-sm font-medium">
            <X className="size-4" /> Decline
          </button>
        </div>
      ) : null}
    </div>
  );
}
