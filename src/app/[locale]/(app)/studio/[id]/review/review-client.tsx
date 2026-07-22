'use client';

import * as React from 'react';
import { CheckCircle2 } from 'lucide-react';

import { Link } from '@/i18n/navigation';
import { AppTopBar } from '@/components/app/app-top-bar';
import { Button } from '@/components/ui/button';
import { ReviewForm, type ReviewDraft } from '@/components/reviews/review-form';
import { submitReviewAction } from './actions';

export function ReviewClient({
  slug,
  studioName,
  bookingId,
  locale,
}: {
  slug: string;
  studioName: string;
  bookingId: string;
  locale: string;
}) {
  const [done, setDone] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [isPending, startTransition] = React.useTransition();

  const handleSubmit = (draft: ReviewDraft) => {
    setError(null);
    startTransition(async () => {
      const res = await submitReviewAction(locale, slug, bookingId, {
        scores: draft.scores,
        recommend: draft.recommend,
        wouldReturn: draft.wouldReturn,
        tags: draft.tags,
        body: draft.body,
      });
      if (res.ok) setDone(true);
      else setError(res.error ?? 'Could not submit.');
    });
  };

  return (
    <div className="min-h-dvh pb-16">
      <AppTopBar title="Write a review" backHref={`/studio/${slug}`} />

      <main className="container max-w-xl pt-6">
        {done ? (
          <div className="rounded-3xl bg-card p-8 text-center ring-1 ring-border">
            <CheckCircle2 className="mx-auto size-12 text-accent" />
            <h1 className="mt-4 text-2xl font-medium tracking-tight">Thank you</h1>
            <p className="mt-2 text-muted-foreground">Your review of {studioName} is live.</p>
            <Button asChild className="mt-6 h-11 px-6">
              <Link href={`/studio/${slug}`} locale={locale}>
                Back to {studioName}
              </Link>
            </Button>
          </div>
        ) : (
          <>
            <h1 className="text-2xl font-medium tracking-tight">Review {studioName}</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Verified review — it’s tied to your completed appointment.
            </p>
            {error ? (
              <div className="mt-4 rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive">
                {error}
              </div>
            ) : null}
            <div className={isPending ? 'mt-6 pointer-events-none opacity-70' : 'mt-6'}>
              <ReviewForm studioName={studioName} onSubmit={handleSubmit} />
            </div>
          </>
        )}
      </main>
    </div>
  );
}
