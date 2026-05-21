'use client';

import * as React from 'react';
import { Check, CalendarCheck, Lock, PartyPopper } from 'lucide-react';

import { Link, useRouter } from '@/i18n/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { formatLei } from '@/lib/app-mock-data';

export interface CheckoutSummary {
  studioName: string;
  studioId: string;
  serviceName: string;
  priceLei: number;
  durationMin: number;
  date: string;
  time: string;
  locale: string;
}

export function CheckoutClient(props: CheckoutSummary) {
  const router = useRouter();
  const [processing, setProcessing] = React.useState(false);
  const [paid, setPaid] = React.useState(false);

  const prettyDate = props.date
    ? new Date(props.date).toLocaleDateString(props.locale, {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
      })
    : '';

  function handlePay(e: React.FormEvent) {
    e.preventDefault();
    setProcessing(true);
    // Demo only — no real charge. Simulate a network round-trip.
    setTimeout(() => {
      setProcessing(false);
      setPaid(true);
    }, 900);
  }

  if (!props.studioId || !props.serviceName) {
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

  if (paid) {
    return (
      <main className="container flex flex-col items-center pt-16 text-center">
        <div className="grid size-16 place-items-center rounded-full bg-accent/20 text-foreground">
          <PartyPopper className="size-7" />
        </div>
        <h1 className="mt-6 text-3xl font-medium tracking-tight">You’re booked!</h1>
        <p className="mt-2 max-w-sm text-muted-foreground">
          {props.serviceName} at {props.studioName}, {prettyDate} · {props.time}. A confirmation
          is on its way to your inbox.
        </p>

        <div className="mt-8 w-full max-w-sm rounded-3xl bg-card p-5 text-left ring-1 ring-border">
          <Row label="Service" value={props.serviceName} />
          <Row label="With" value={props.studioName} />
          <Row label="When" value={`${prettyDate} · ${props.time}`} />
          <Row label="Paid" value={formatLei(props.priceLei)} last />
        </div>

        <div className="mt-8 flex w-full max-w-sm flex-col gap-3">
          <Button asChild size="lg" className="h-12">
            <Link href="/">Done</Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="h-12">
            <Link href="/services">Book something else</Link>
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

      {/* Mock payment */}
      <form onSubmit={handlePay} className="space-y-4">
        <div className="flex items-center gap-2 text-sm font-medium">
          <Lock className="size-4 text-muted-foreground" /> Payment
        </div>

        <div className="space-y-1.5">
          <label htmlFor="card" className="text-sm font-medium">
            Card number
          </label>
          <Input
            id="card"
            inputMode="numeric"
            placeholder="4242 4242 4242 4242"
            className="h-12 bg-card text-base"
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <label htmlFor="exp" className="text-sm font-medium">
              Expiry
            </label>
            <Input id="exp" placeholder="MM / YY" className="h-12 bg-card text-base" />
          </div>
          <div className="space-y-1.5">
            <label htmlFor="cvc" className="text-sm font-medium">
              CVC
            </label>
            <Input id="cvc" inputMode="numeric" placeholder="123" className="h-12 bg-card text-base" />
          </div>
        </div>
        <div className="space-y-1.5">
          <label htmlFor="name" className="text-sm font-medium">
            Name on card
          </label>
          <Input id="name" placeholder="Alexandra Pop" className="h-12 bg-card text-base" />
        </div>

        <p className="rounded-2xl border border-dashed bg-muted/40 px-3 py-2 text-xs text-muted-foreground">
          Demo only — no real card is charged. Real payments will run through Stripe Connect later.
        </p>

        <Button type="submit" size="lg" disabled={processing} className="h-12 w-full gap-2">
          {processing ? (
            'Processing…'
          ) : (
            <>
              <Check className="size-4" /> Pay {formatLei(props.priceLei)}
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
