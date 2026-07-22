'use client';

import * as React from 'react';
import { BadgeCheck, PenLine } from 'lucide-react';

import { Link } from '@/i18n/navigation';
import { img } from '@/lib/app-mock-data';
import {
  seedReviews,
  allReviews,
  aggregate,
  overall,
  tagById,
  type Review,
} from '@/lib/reviews';
import { Stars } from './stars';
import { RatingSummary } from './rating-summary';

export function StudioReviews({ studioId, locale }: { studioId: string; locale: string }) {
  // SSR-safe initial state = deterministic seeds; merge local reviews on mount.
  const [reviews, setReviews] = React.useState<Review[]>(() => seedReviews(studioId));

  React.useEffect(() => {
    setReviews(allReviews(studioId));
  }, [studioId]);

  const agg = aggregate(reviews);

  return (
    <section>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-medium tracking-tight">Reviews</h2>
        <Link
          href={`/studio/${studioId}/review`}
          locale={locale}
          className="inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5 text-sm font-medium hover:bg-secondary"
        >
          <PenLine className="size-4" /> Write a review
        </Link>
      </div>

      <RatingSummary agg={agg} />

      <div className="mt-4 space-y-3">
        {reviews.map((r) => (
          <ReviewCard key={r.id} review={r} />
        ))}
      </div>
    </section>
  );
}

function ReviewCard({ review }: { review: Review }) {
  return (
    <div className="rounded-3xl bg-card p-4 ring-1 ring-border">
      <div className="flex items-center gap-3">
        <img src={img.avatar(review.avatarSeed)} alt="" className="size-9 rounded-full object-cover" />
        <div className="flex-1">
          <div className="flex items-center gap-1.5 text-sm font-medium">
            {review.author}
            {review.bookingId ? (
              <span
                className="inline-flex items-center gap-0.5 text-xs font-normal text-accent"
                title="Verified — tied to a real booking"
              >
                <BadgeCheck className="size-3.5" /> Verified
              </span>
            ) : null}
          </div>
          <div className="text-xs text-muted-foreground">{timeAgo(review.createdAt)}</div>
        </div>
        <div className="flex items-center gap-1.5">
          <Stars value={overall(review.scores)} />
          <span className="text-xs font-medium tabular-nums">
            {overall(review.scores).toFixed(1)}
          </span>
        </div>
      </div>

      {review.body ? (
        <p className="mt-2.5 text-sm leading-relaxed text-foreground/90">{review.body}</p>
      ) : null}

      {review.tags.length > 0 ? (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {review.tags.map((id) => {
            const def = tagById(id);
            if (!def) return null;
            return (
              <span
                key={id}
                className={
                  def.sentiment === 'positive'
                    ? 'rounded-full bg-accent/10 px-2.5 py-1 text-xs text-accent'
                    : 'rounded-full bg-destructive/10 px-2.5 py-1 text-xs text-destructive'
                }
              >
                {def.label}
              </span>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}

function timeAgo(iso: string): string {
  const then = new Date(iso).getTime();
  const days = Math.floor((Date.now() - then) / 86400000);
  if (days <= 0) return 'Today';
  if (days === 1) return 'Yesterday';
  if (days < 30) return `${days} days ago`;
  const months = Math.floor(days / 30);
  return months === 1 ? '1 month ago' : `${months} months ago`;
}
