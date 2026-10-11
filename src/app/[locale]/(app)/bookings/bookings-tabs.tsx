'use client';

import * as React from 'react';

import { cn } from '@/lib/utils';

/**
 * Upcoming / Past switcher. The lists themselves are rendered on the server
 * and passed in as children so booking cards stay server components.
 */
export function BookingsTabs({
  upcomingCount,
  pastCount,
  upcoming,
  past,
}: {
  upcomingCount: number;
  pastCount: number;
  upcoming: React.ReactNode;
  past: React.ReactNode;
}) {
  const [tab, setTab] = React.useState<'upcoming' | 'past'>('upcoming');

  return (
    <div className="space-y-5">
      <div role="tablist" aria-label="Bookings" className="grid grid-cols-2 rounded-full bg-card p-1 ring-1 ring-border">
        <Tab active={tab === 'upcoming'} onClick={() => setTab('upcoming')} label="Upcoming" count={upcomingCount} />
        <Tab active={tab === 'past'} onClick={() => setTab('past')} label="Past" count={pastCount} />
      </div>

      <div role="tabpanel">{tab === 'upcoming' ? upcoming : past}</div>
    </div>
  );
}

function Tab({
  active,
  onClick,
  label,
  count,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  count: number;
}) {
  return (
    <button
      type="button"
      role="tab"
      aria-selected={active}
      onClick={onClick}
      className={cn(
        'flex h-10 items-center justify-center gap-2 rounded-full text-sm font-medium transition-colors',
        active ? 'bg-foreground text-background' : 'text-muted-foreground hover:text-foreground',
      )}
    >
      {label}
      <span
        className={cn(
          'rounded-full px-2 py-0.5 text-[11px]',
          active ? 'bg-background/20' : 'bg-secondary text-secondary-foreground',
        )}
      >
        {count}
      </span>
    </button>
  );
}
