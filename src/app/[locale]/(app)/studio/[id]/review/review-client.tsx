'use client';

import * as React from 'react';
import { CheckCircle2 } from 'lucide-react';

import { Link } from '@/i18n/navigation';
import { AppTopBar } from '@/components/app/app-top-bar';
import { Button } from '@/components/ui/button';
import { ReviewForm, type ReviewDraft } from '@/components/reviews/review-form';
import { saveLocalReview, type Review } from '@/lib/reviews';

export function ReviewClient({
  studioId,
  studioName,
  locale,
}: {
  studioId: string;
  studioName: string;
  locale: string;
}) {
  const [done, setDone] = React.useState(false);

  const handleSubmit = (draft: ReviewDraft) => {
    const review: Review = {
      id:
        typeof crypto !== 'undefined' && 'randomUUID' in crypto
          ? crypto.randomUUID()
          : `local-${Date.now()}`,
      studioId,
      // In the real flow this is the completed booking's id (→ verified).
      bookingId: `local-${Date.now()}`,
      author: 'You',
      avatarSeed: 'you',
      scores: draft.scores,
      recommend: draft.recommend,
      wouldReturn: draft.wouldReturn,
      tags: draft.tags,
      body: draft.body,
      createdAt: new Date().toISOString(),
    };
    saveLocalReview(review);
    setDone(true);
  };

  return (
    <div className="min-h-dvh pb-16">
      <AppTopBar title="Write a review" backHref={`/studio/${studioId}`} />

      <main className="container max-w-xl pt-6">
        {done ? (
          <div className="rounded-3xl bg-card p-8 text-center ring-1 ring-border">
            <CheckCircle2 className="mx-auto size-12 text-accent" />
            <h1 className="mt-4 text-2xl font-medium tracking-tight">Thank you</h1>
            <p className="mt-2 text-muted-foreground">
              Your review of {studioName} is saved.
            </p>
            <Button asChild className="mt-6 h-11 px-6">
              <Link href={`/studio/${studioId}`} locale={locale}>
                Back to {studioName}
              </Link>
            </Button>
          </div>
        ) : (
          <>
            <h1 className="text-2xl font-medium tracking-tight">Review {studioName}</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Only people who booked here can review — that keeps ratings honest.
            </p>
            <div className="mt-6">
              <ReviewForm studioName={studioName} onSubmit={handleSubmit} />
            </div>
          </>
        )}
      </main>
    </div>
  );
}
