import { ThumbsUp } from 'lucide-react';

import { cn } from '@/lib/utils';
import { SUBSCORES, type ReviewAggregate } from '@/lib/reviews';
import { Stars } from './stars';

/**
 * Pure rating overview: overall average + stars, count, the three sub-score
 * bars, recommend rate, and the most-used tags. Matches the spec's profile
 * view (average, total, breakdown).
 */
export function RatingSummary({ agg }: { agg: ReviewAggregate }) {
  if (agg.count === 0) {
    return (
      <div className="rounded-3xl bg-card p-5 ring-1 ring-border">
        <p className="text-sm text-muted-foreground">
          No reviews yet — be the first after your appointment.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-3xl bg-card p-5 ring-1 ring-border">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
        {/* Overall */}
        <div className="flex shrink-0 flex-col items-center gap-1 sm:w-40">
          <div className="text-5xl font-medium tracking-tight">{agg.overall.toFixed(1)}</div>
          <Stars value={agg.overall} size="md" />
          <div className="text-xs text-muted-foreground">
            {agg.count} {agg.count === 1 ? 'review' : 'reviews'}
          </div>
          {agg.recommendPct > 0 ? (
            <div className="mt-1 inline-flex items-center gap-1 text-xs text-accent">
              <ThumbsUp className="size-3" /> {agg.recommendPct}% recommend
            </div>
          ) : null}
        </div>

        {/* Sub-score bars */}
        <div className="flex-1 space-y-2.5">
          {SUBSCORES.map(({ key, label }) => {
            const v = agg.subscores[key];
            return (
              <div key={key} className="flex items-center gap-3">
                <div className="w-28 shrink-0 text-xs text-muted-foreground">{label}</div>
                <div className="h-2 flex-1 overflow-hidden rounded-full bg-secondary">
                  <div
                    className="h-full rounded-full bg-accent"
                    style={{ width: `${(v / 5) * 100}%` }}
                  />
                </div>
                <div className="w-8 shrink-0 text-right text-xs font-medium tabular-nums">
                  {v.toFixed(1)}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Top tags */}
      {agg.topTags.length > 0 ? (
        <div className="mt-5 flex flex-wrap gap-2 border-t border-border pt-4">
          {agg.topTags.map((t) => (
            <span
              key={t.id}
              className={cn(
                'inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium',
                t.sentiment === 'positive'
                  ? 'bg-accent/10 text-accent'
                  : 'bg-destructive/10 text-destructive',
              )}
            >
              {t.label}
              <span className="opacity-60">{t.count}</span>
            </span>
          ))}
        </div>
      ) : null}
    </div>
  );
}
