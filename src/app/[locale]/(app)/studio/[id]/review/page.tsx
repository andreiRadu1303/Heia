import { notFound } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';
import { CalendarClock, LogIn } from 'lucide-react';

import { Link } from '@/i18n/navigation';
import { AppTopBar } from '@/components/app/app-top-bar';
import { Button } from '@/components/ui/button';
import { getPublicStudioBySlug } from '@/lib/public-studio';
import { getReviewEligibility } from '@/lib/reviews-server';
import { ReviewClient } from './review-client';

export const dynamic = 'force-dynamic';

export default async function StudioReviewPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;
  setRequestLocale(locale);

  const studio = await getPublicStudioBySlug(id);
  if (!studio) notFound();

  const eligibility = await getReviewEligibility(id);

  // Eligible → show the form.
  if (eligibility.bookingId) {
    return (
      <ReviewClient
        slug={id}
        studioName={studio.name}
        bookingId={eligibility.bookingId}
        locale={locale}
      />
    );
  }

  // Not eligible → explain why.
  return (
    <div className="min-h-dvh pb-16">
      <AppTopBar title="Write a review" backHref={`/studio/${id}`} />
      <main className="container max-w-xl pt-10">
        <div className="rounded-3xl bg-card p-8 text-center ring-1 ring-border">
          {!eligibility.signedIn ? (
            <>
              <LogIn className="mx-auto size-10 text-muted-foreground" />
              <h1 className="mt-4 text-xl font-medium tracking-tight">Sign in to review</h1>
              <p className="mt-2 text-sm text-muted-foreground">
                Reviews are tied to your account and a completed appointment.
              </p>
              <Button asChild className="mt-6 h-11 px-6">
                <Link href={`/login?next=/${locale}/studio/${id}/review`} locale={locale}>
                  Sign in
                </Link>
              </Button>
            </>
          ) : (
            <>
              <CalendarClock className="mx-auto size-10 text-muted-foreground" />
              <h1 className="mt-4 text-xl font-medium tracking-tight">
                Only after a completed appointment
              </h1>
              <p className="mt-2 text-sm text-muted-foreground">
                You can review {studio.name} once you’ve had an appointment here and it’s been
                marked completed. That keeps ratings honest.
              </p>
              <Button asChild variant="outline" className="mt-6 h-11 px-6">
                <Link href={`/studio/${id}`} locale={locale}>
                  Back to {studio.name}
                </Link>
              </Button>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
