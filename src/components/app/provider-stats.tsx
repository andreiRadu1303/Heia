import { TrendingUp, TrendingDown, Minus, ArrowUpRight } from 'lucide-react';

import { Link } from '@/i18n/navigation';
import { cn } from '@/lib/utils';
import type { MonthlySummary } from '@/lib/provider-home';

/** Percentage change, or null when there's nothing to compare against. */
export function delta(current: number, previous: number): number | null {
  if (previous === 0) return current === 0 ? 0 : null;
  return Math.round(((current - previous) / previous) * 100);
}

export function DeltaChip({ delta, label }: { delta: number | null; label: string }) {
  const Icon = delta === null || delta === 0 ? Minus : delta > 0 ? TrendingUp : TrendingDown;
  return (
    <div
      className={cn(
        'inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium',
        delta === null || delta === 0
          ? 'bg-secondary text-secondary-foreground'
          : delta > 0
            ? 'bg-accent/15 text-foreground'
            : 'bg-muted text-muted-foreground',
      )}
    >
      <Icon className="size-3" />
      {delta === null ? 'new' : `${delta > 0 ? '+' : ''}${delta}%`}
      <span className="font-normal text-muted-foreground">· {label}</span>
    </div>
  );
}

/** Stat tile with optional chart slot below the headline. */
export function MetricCard({
  label,
  value,
  sub,
  subHref,
  delta,
  deltaLabel,
  children,
}: {
  label: string;
  value: string;
  sub: string;
  subHref?: string;
  delta: number | null;
  deltaLabel: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="rounded-3xl bg-card p-4 ring-1 ring-border">
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className="mt-1 text-3xl font-medium tracking-tight">{value}</div>
      {children ? <div className="mt-3">{children}</div> : null}
      <div className="mt-2">
        <DeltaChip delta={delta} label={deltaLabel} />
      </div>
      {subHref ? (
        <Link
          href={subHref}
          className="mt-2 block text-xs text-muted-foreground underline-offset-4 hover:underline"
        >
          {sub}
        </Link>
      ) : (
        <div className="mt-2 text-xs text-muted-foreground">{sub}</div>
      )}
    </div>
  );
}

/**
 * Home-page widget: the current month's bookings and net profit as two
 * compact tiles side by side, linking to the full analytics page.
 */
export function MonthTotalsWidget({ summary }: { summary: MonthlySummary }) {
  const { thisMonth: cur, lastMonth: prev } = summary;
  return (
    <section>
      <div className="mb-4 flex items-baseline justify-between">
        <h2 className="flex items-center gap-2 text-xl font-medium tracking-tight">
          <TrendingUp className="size-5" /> This month
        </h2>
        <span className="text-sm capitalize text-muted-foreground">{cur.fullLabel}</span>
      </div>
      <Link
        href="/provider/analytics"
        className="grid grid-cols-2 divide-x divide-border rounded-3xl bg-card ring-1 ring-border transition-transform hover:-translate-y-0.5"
      >
        <Tile label="Bookings" value={String(cur.bookings)} delta={delta(cur.bookings, prev.bookings)} />
        <Tile label="Net profit" value={`${cur.netLei} lei`} delta={delta(cur.netLei, prev.netLei)} />
        <div className="col-span-2 flex items-center justify-end gap-1 border-t border-border px-4 py-2 text-xs font-medium text-muted-foreground">
          See analytics <ArrowUpRight className="size-3.5" />
        </div>
      </Link>
    </section>
  );
}

function Tile({ label, value, delta }: { label: string; value: string; delta: number | null }) {
  return (
    <div className="p-4">
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className="mt-1 text-3xl font-medium tracking-tight">{value}</div>
      <div className="mt-2">
        <DeltaChip delta={delta} label="vs last month" />
      </div>
    </div>
  );
}
