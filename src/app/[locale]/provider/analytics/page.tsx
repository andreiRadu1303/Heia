import { setRequestLocale } from 'next-intl/server';
import { BarChart3 } from 'lucide-react';

import { getMyStudio } from '@/lib/provider-studio';
import { getMonthlySummary } from '@/lib/provider-home';
import { MetricCard, delta } from '@/components/app/provider-stats';
import { MonthlyChart } from '@/components/app/monthly-chart';

export const dynamic = 'force-dynamic';

const MONTHS = 12;

export default async function ProviderAnalyticsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const studio = await getMyStudio();
  const summary = studio ? await getMonthlySummary(studio.id, locale, MONTHS) : null;

  return (
    <main className="container space-y-8 pt-8">
      <header>
        <div className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
          Heia for pros
        </div>
        <h1 className="mt-2 flex items-center gap-2 text-3xl font-medium tracking-tight sm:text-4xl">
          <BarChart3 className="size-7" /> Analytics
        </h1>
        <p className="mt-2 text-muted-foreground">
          Last {MONTHS} months{studio ? ` for ${studio.name}` : ''}.
        </p>
      </header>

      {!studio || !summary ? (
        <div className="rounded-2xl border border-dashed border-border bg-muted/40 px-4 py-6 text-sm text-muted-foreground">
          We couldn’t find a studio for your account. If you just signed up, try reloading.
        </div>
      ) : (
        <AnalyticsBody summary={summary} stripeConnected={studio.stripe_charges_enabled} />
      )}
    </main>
  );
}

function AnalyticsBody({
  summary,
  stripeConnected,
}: {
  summary: Awaited<ReturnType<typeof getMonthlySummary>>;
  stripeConnected: boolean;
}) {
  const { months, thisMonth: cur, lastMonth: prev } = summary;
  const totalBookings = months.reduce((s, m) => s + m.bookings, 0);
  const totalCompleted = months.reduce((s, m) => s + m.completed, 0);
  const totalBooked = months.reduce((s, m) => s + m.bookedValueLei, 0);
  const totalNet = months.reduce((s, m) => s + m.netLei, 0);

  return (
    <>
      {/* Totals over the whole window */}
      <section className="grid grid-cols-2 gap-3">
        <Total label={`Total bookings · ${MONTHS} mo`} value={String(totalBookings)} sub={`${totalCompleted} completed · ${totalBooked} lei booked`} />
        <Total label={`Total net profit · ${MONTHS} mo`} value={`${totalNet} lei`} sub="Card payments after Heia’s fee" />
      </section>

      {/* Two measures of different scale → two charts, never a dual axis. */}
      <section className="grid gap-3 sm:grid-cols-2">
        <MetricCard
          label={`Bookings · ${cur.fullLabel}`}
          value={String(cur.bookings)}
          sub={`${cur.completed} completed · ${cur.bookedValueLei} lei booked`}
          delta={delta(cur.bookings, prev.bookings)}
          deltaLabel={`vs ${prev.bookings} last month`}
        >
          <MonthlyChart
            ariaLabel={`Bookings per month, last ${months.length} months`}
            points={months.map((m) => ({
              label: m.label,
              fullLabel: m.fullLabel,
              value: m.bookings,
              detail: `${m.completed} completed · ${m.bookedValueLei} lei booked`,
            }))}
          />
        </MetricCard>
        <MetricCard
          label={`Net profit · ${cur.fullLabel}`}
          value={`${cur.netLei} lei`}
          sub={
            stripeConnected
              ? 'Card payments after Heia’s fee, refunds excluded'
              : 'Card payments only — connect payouts to track'
          }
          subHref={stripeConnected ? undefined : '/provider/payments'}
          delta={delta(cur.netLei, prev.netLei)}
          deltaLabel={`vs ${prev.netLei} lei last month`}
        >
          <MonthlyChart
            ariaLabel={`Net profit per month, last ${months.length} months`}
            unit="lei"
            points={months.map((m) => ({
              label: m.label,
              fullLabel: m.fullLabel,
              value: m.netLei,
            }))}
          />
        </MetricCard>
      </section>
    </>
  );
}

function Total({ label, value, sub }: { label: string; value: string; sub: string }) {
  return (
    <div className="rounded-3xl bg-card p-4 ring-1 ring-border">
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className="mt-1 text-3xl font-medium tracking-tight">{value}</div>
      <div className="mt-1 text-xs text-muted-foreground">{sub}</div>
    </div>
  );
}
