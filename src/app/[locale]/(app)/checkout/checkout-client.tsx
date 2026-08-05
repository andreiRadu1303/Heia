'use client';

import * as React from 'react';
import { Check, CalendarCheck, Lock } from 'lucide-react';

import { Link } from '@/i18n/navigation';
import { Button } from '@/components/ui/button';
import { formatLei } from '@/lib/app-mock-data';
import { createBookingAction } from './actions';

export interface CheckoutSummary {
  studioName: string;
  studioSlug: string;
  serviceId: string;
  serviceName: string;
  priceLei: number;
  durationMin: number;
  date: string; // YYYY-MM-DD
  time: string; // HH:MM
  locale: string;
  /** When true, submitting sends the client to Stripe Checkout to pay by card. */
  payEnabled?: boolean;
}

export function CheckoutClient(props: CheckoutSummary) {
  const [submitting, setSubmitting] = React.useState(false);

  const prettyDate = props.date
    ? new Date(props.date).toLocaleDateString(props.locale, {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
      })
    : '';

  // scheduled_at = local date + time, sent as ISO 8601 without timezone (Postgres parses it as
  // a timestamp with current TZ on the server). Good enough for v1; we'll move to explicit TZ later.
  const scheduledAt = props.date && props.time ? `${props.date}T${props.time}:00` : '';

  if (!props.studioSlug || !props.serviceName) {
    return (
      <main className="container pt-10">
        <div className="rounded-3xl bg-card p-6 text-center ring-1 ring-border">
          <p className="text-muted-foreground">
            We lost the booking details. Start again from services.
          </p>
          <Button asChild className="mt-4">
            <Link href="/services">Back to services</Link>
          </Button>
        </div>
      </main>
    );
  }

  return (
    <main className="container space-y-6 pt-6">
      {/* Summary */}
      <section className="rounded-3xl bg-card p-5 ring-1 ring-border">
        <div className="mb-3 inline-flex items-center gap-2 text-sm font-medium">
          <CalendarCheck className="size-4 text-accent" /> Your booking
        </div>
        <Row label="Service" value={props.serviceName} />
        <Row label="With" value={props.studioName} />
        <Row label="When" value={`${prettyDate} · ${props.time}`} />
        <Row label="Duration" value={`${props.durationMin} min`} />
        <Row label="Total" value={formatLei(props.priceLei)} last />
      </section>

      {/* Submit form — real server action, no Stripe yet. */}
      <form
        action={createBookingAction}
        onSubmit={() => setSubmitting(true)}
        className="space-y-4"
      >
        {/* Hidden inputs the action reads */}
        <input type="hidden" name="locale" value={props.locale} />
        <input type="hidden" name="studioSlug" value={props.studioSlug} />
        <input type="hidden" name="serviceId" value={props.serviceId} />
        <input type="hidden" name="scheduledAt" value={scheduledAt} />

        <div className="rounded-2xl border border-border bg-card p-4">
          <div className="flex items-center gap-2 text-sm font-medium">
            <Lock className="size-4 text-muted-foreground" /> Payment
          </div>
          <p className="mt-1.5 text-sm text-muted-foreground">
            {props.payEnabled
              ? 'You’ll pay securely by card on the next step (Stripe). The studio receives the payment minus Heia’s platform fee.'
              : 'No card needed yet — your request goes to the provider as pending and they confirm it.'}
          </p>
        </div>

        <Button type="submit" size="lg" disabled={submitting} className="h-12 w-full gap-2">
          {submitting ? (
            'Sending…'
          ) : (
            <>
              <Check className="size-4" /> {props.payEnabled ? 'Pay & book' : 'Send booking request'}
            </>
          )}
        </Button>
      </form>
    </main>
  );
}

function Row({ label, value, last }: { label: string; value: string; last?: boolean }) {
  return (
    <div
      className={`flex items-baseline justify-between gap-3 py-1.5 ${
        last ? '' : 'border-b border-border/60'
      }`}
    >
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className="truncate text-sm font-medium">{value}</span>
    </div>
  );
}
