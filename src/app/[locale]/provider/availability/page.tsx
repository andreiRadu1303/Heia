'use client';

import * as React from 'react';

import { WEEKLY_HOURS, type WeeklyHour } from '@/lib/app-mock-data';
import { cn } from '@/lib/utils';

const TIME_OPTIONS = Array.from({ length: 31 }, (_, i) => {
  const minutes = 7 * 60 + i * 30; // 07:00 → 22:00
  const h = String(Math.floor(minutes / 60)).padStart(2, '0');
  const m = String(minutes % 60).padStart(2, '0');
  return `${h}:${m}`;
});

export default function ProviderAvailabilityPage() {
  const [hours, setHours] = React.useState<WeeklyHour[]>(() => WEEKLY_HOURS.map((h) => ({ ...h })));

  function toggle(day: string) {
    setHours((prev) => prev.map((h) => (h.day === day ? { ...h, enabled: !h.enabled } : h)));
  }
  function setTime(day: string, field: 'open' | 'close', value: string) {
    setHours((prev) => prev.map((h) => (h.day === day ? { ...h, [field]: value } : h)));
  }

  return (
    <main className="container space-y-6 pt-8">
      <header>
        <h1 className="text-3xl font-medium tracking-tight sm:text-4xl">Hours</h1>
        <p className="mt-2 text-muted-foreground">When clients can book you.</p>
      </header>

      <div className="space-y-2">
        {hours.map((h) => (
          <div
            key={h.day}
            className="flex flex-wrap items-center gap-3 rounded-2xl bg-card p-3 ring-1 ring-border"
          >
            <button
              type="button"
              role="switch"
              aria-checked={h.enabled}
              aria-label={`Toggle ${h.day}`}
              onClick={() => toggle(h.day)}
              className={cn(
                'relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors',
                h.enabled ? 'bg-accent' : 'bg-border',
              )}
            >
              <span
                className={cn(
                  'inline-block size-5 rounded-full bg-background shadow transition-transform',
                  h.enabled ? 'translate-x-[22px]' : 'translate-x-[2px]',
                )}
              />
            </button>

            <span className="w-20 text-sm font-medium">{h.day}</span>

            {h.enabled ? (
              <div className="flex items-center gap-2">
                <TimeSelect value={h.open} onChange={(v) => setTime(h.day, 'open', v)} />
                <span className="text-muted-foreground">–</span>
                <TimeSelect value={h.close} onChange={(v) => setTime(h.day, 'close', v)} />
              </div>
            ) : (
              <span className="text-sm text-muted-foreground">Closed</span>
            )}
          </div>
        ))}
      </div>

      <p className="rounded-2xl border border-dashed bg-muted/40 px-3 py-2 text-xs text-muted-foreground">
        Demo — changes live in the browser only. Real availability syncs to your account (and
        optionally Google Calendar) with the database.
      </p>
    </main>
  );
}

function TimeSelect({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="h-9 rounded-lg border border-input bg-background px-2 text-sm"
    >
      {TIME_OPTIONS.map((t) => (
        <option key={t} value={t}>
          {t}
        </option>
      ))}
    </select>
  );
}
