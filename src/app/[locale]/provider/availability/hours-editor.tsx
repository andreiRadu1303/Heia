'use client';

import * as React from 'react';
import { CheckCircle2, Loader2 } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import type { DayHours } from '@/lib/availability';
import { saveHoursAction } from './actions';

const DAY_LABELS: Record<number, string> = {
  1: 'Monday',
  2: 'Tuesday',
  3: 'Wednesday',
  4: 'Thursday',
  5: 'Friday',
  6: 'Saturday',
  0: 'Sunday',
};

const TIME_OPTIONS = Array.from({ length: 33 }, (_, i) => {
  const minutes = 6 * 60 + i * 30; // 06:00 → 22:00
  return `${String(Math.floor(minutes / 60)).padStart(2, '0')}:${String(minutes % 60).padStart(2, '0')}`;
});

type Save = 'idle' | 'dirty' | 'saving' | 'saved' | 'error';

export function HoursEditor({ initial, locale }: { initial: DayHours[]; locale: string }) {
  const [hours, setHours] = React.useState<DayHours[]>(initial);
  const [save, setSave] = React.useState<Save>('idle');
  const [error, setError] = React.useState<string | null>(null);
  const [isPending, startTransition] = React.useTransition();

  const patch = (weekday: number, change: Partial<DayHours>) => {
    setHours((prev) => prev.map((h) => (h.weekday === weekday ? { ...h, ...change } : h)));
    setSave('dirty');
  };

  const persist = () => {
    setSave('saving');
    setError(null);
    startTransition(async () => {
      const res = await saveHoursAction(locale, hours);
      if (res.ok) setSave('saved');
      else {
        setSave('error');
        setError(res.error ?? 'Could not save.');
      }
    });
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        {hours.map((h) => (
          <div
            key={h.weekday}
            className="flex flex-wrap items-center gap-3 rounded-2xl bg-card p-3 ring-1 ring-border"
          >
            <button
              type="button"
              role="switch"
              aria-checked={h.isOpen}
              aria-label={`Toggle ${DAY_LABELS[h.weekday]}`}
              onClick={() => patch(h.weekday, { isOpen: !h.isOpen })}
              className={cn(
                'relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors',
                h.isOpen ? 'bg-accent' : 'bg-border',
              )}
            >
              <span
                className={cn(
                  'inline-block size-5 rounded-full bg-background shadow transition-transform',
                  h.isOpen ? 'translate-x-[22px]' : 'translate-x-[2px]',
                )}
              />
            </button>

            <span className="w-24 text-sm font-medium">{DAY_LABELS[h.weekday]}</span>

            {h.isOpen ? (
              <div className="flex items-center gap-2">
                <TimeSelect
                  value={h.opensAt}
                  onChange={(v) => patch(h.weekday, { opensAt: v })}
                />
                <span className="text-muted-foreground">–</span>
                <TimeSelect
                  value={h.closesAt}
                  onChange={(v) => patch(h.weekday, { closesAt: v })}
                />
              </div>
            ) : (
              <span className="text-sm text-muted-foreground">Closed</span>
            )}
          </div>
        ))}
      </div>

      {error ? (
        <div className="rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {error}
        </div>
      ) : null}

      <Button
        type="button"
        onClick={persist}
        disabled={isPending || save === 'idle' || save === 'saved'}
        className="h-11 w-full gap-2"
      >
        {save === 'saving' ? (
          <>
            <Loader2 className="size-4 animate-spin" /> Saving…
          </>
        ) : save === 'saved' ? (
          <>
            <CheckCircle2 className="size-4" /> Saved
          </>
        ) : (
          'Save hours'
        )}
      </Button>

      <p className="rounded-2xl border border-dashed border-border bg-muted/40 px-3 py-2 text-xs text-muted-foreground">
        Clients can only book inside these hours, and each slot disappears once it&rsquo;s taken.
      </p>
    </div>
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
