'use client';

import * as React from 'react';
import { Check, Clock } from 'lucide-react';

import { useRouter } from '@/i18n/navigation';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { formatLei } from '@/lib/app-mock-data';
import { getSlotsAction } from './actions';

export interface BookingService {
  id: string;
  name: string;
  durationMin: number;
  priceLei: number;
}

function nextDays(n: number): Date[] {
  const today = new Date();
  return Array.from({ length: n }, (_, i) => {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    return d;
  });
}

export function BookingClient({
  studioSlug,
  studioName,
  services,
  locale,
}: {
  studioSlug: string;
  studioName: string;
  services: BookingService[];
  locale: string;
}) {
  const router = useRouter();
  const days = React.useMemo(() => nextDays(7), []);
  const [serviceId, setServiceId] = React.useState(services[0]?.id ?? '');
  const [dateIdx, setDateIdx] = React.useState(0);
  const [time, setTime] = React.useState<string | null>(null);

  const service = services.find((s) => s.id === serviceId);
  const canContinue = Boolean(service) && time != null;

  // Real slots from the provider's hours, minus what's already booked.
  const [slots, setSlots] = React.useState<string[]>([]);
  const [loadingSlots, setLoadingSlots] = React.useState(false);
  const dateISO = React.useMemo(
    () => days[dateIdx]?.toISOString().slice(0, 10) ?? '',
    [days, dateIdx],
  );

  React.useEffect(() => {
    if (!serviceId || !dateISO) return;
    let cancelled = false;
    setLoadingSlots(true);
    setTime(null);
    getSlotsAction(studioSlug, dateISO, serviceId)
      .then((result) => {
        if (!cancelled) setSlots(result);
      })
      .finally(() => {
        if (!cancelled) setLoadingSlots(false);
      });
    return () => {
      cancelled = true;
    };
  }, [studioSlug, dateISO, serviceId]);

  function handleContinue() {
    if (!canContinue || !service) return;
    const date = days[dateIdx].toISOString().slice(0, 10);
    const qs = new URLSearchParams({
      studio: studioSlug,
      service: service.id,
      date,
      time: time!,
    });
    router.push(`/checkout?${qs.toString()}`);
  }

  if (services.length === 0) {
    return (
      <main className="container pt-10">
        <div className="rounded-3xl bg-card p-6 text-center ring-1 ring-border">
          <p className="text-muted-foreground">
            {studioName} hasn’t added any bookable services yet.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="container space-y-8 pt-6">
      {/* Service */}
      <section>
        <h2 className="mb-3 text-lg font-medium tracking-tight">Choose a service</h2>
        <div className="space-y-2">
          {services.map((sv) => {
            const selected = sv.id === serviceId;
            return (
              <button
                key={sv.id}
                type="button"
                onClick={() => setServiceId(sv.id)}
                className={cn(
                  'flex w-full items-center justify-between gap-3 rounded-2xl border p-4 text-left transition-colors',
                  selected
                    ? 'border-foreground bg-secondary/60'
                    : 'border-border bg-card hover:bg-secondary/30',
                )}
              >
                <div className="min-w-0">
                  <div className="font-medium">{sv.name}</div>
                  <div className="mt-0.5 inline-flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="size-3" /> {sv.durationMin} min
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium">{formatLei(sv.priceLei)}</span>
                  <span
                    className={cn(
                      'grid size-5 place-items-center rounded-full border',
                      selected ? 'border-foreground bg-foreground text-background' : 'border-border',
                    )}
                  >
                    {selected ? <Check className="size-3" /> : null}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* Date */}
      <section>
        <h2 className="mb-3 text-lg font-medium tracking-tight">Pick a day</h2>
        <div className="-mr-4 overflow-x-auto">
          <div className="flex w-max gap-2 pb-1">
            {days.map((d, i) => {
              const selected = i === dateIdx;
              return (
                <button
                  key={i}
                  type="button"
                  onClick={() => setDateIdx(i)}
                  className={cn(
                    'flex w-16 shrink-0 flex-col items-center gap-1 rounded-2xl border py-3 transition-colors',
                    selected
                      ? 'border-foreground bg-foreground text-background'
                      : 'border-border bg-card hover:bg-secondary/30',
                  )}
                >
                  <span className="text-[10px] uppercase tracking-wide opacity-70">
                    {i === 0 ? 'Today' : d.toLocaleDateString(locale, { weekday: 'short' })}
                  </span>
                  <span className="text-lg font-medium leading-none">{d.getDate()}</span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Time */}
      <section>
        <h2 className="mb-3 text-lg font-medium tracking-tight">Pick a time</h2>
        {loadingSlots ? (
          <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-12 animate-pulse rounded-2xl bg-card" />
            ))}
          </div>
        ) : slots.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border bg-muted/40 px-4 py-6 text-sm text-muted-foreground">
            No free times on this day. Try another date.
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
            {slots.map((t) => {
              const selected = t === time;
              return (
                <button
                  key={t}
                  type="button"
                  onClick={() => setTime(t)}
                  className={cn(
                    'rounded-2xl border py-3 text-sm font-medium transition-colors',
                    selected
                      ? 'border-foreground bg-foreground text-background'
                      : 'border-border bg-card hover:bg-secondary/30',
                  )}
                >
                  {t}
                </button>
              );
            })}
          </div>
        )}
      </section>

      {/* Sticky continue */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background/95 pb-[env(safe-area-inset-bottom)] backdrop-blur">
        <div className="container flex items-center justify-between gap-4 py-3">
          <div className="min-w-0">
            <div className="truncate text-sm font-medium">{service?.name}</div>
            <div className="text-xs text-muted-foreground">
              {time ? `${time} · ` : 'Pick a time · '}
              {service ? formatLei(service.priceLei) : ''}
            </div>
          </div>
          <Button
            type="button"
            size="lg"
            className="h-12 px-6"
            disabled={!canContinue}
            onClick={handleContinue}
          >
            Continue
          </Button>
        </div>
      </div>
    </main>
  );
}
