'use server';

import { revalidatePath } from 'next/cache';

import { createClient } from '@/lib/supabase/server';
import type { ReviewScores, WouldReturn } from '@/lib/reviews';

export interface SubmitReviewInput {
  scores: ReviewScores;
  recommend: boolean;
  wouldReturn: WouldReturn;
  tags: string[];
  body: string;
}

export interface SubmitReviewResult {
  ok: boolean;
  error?: string;
}

/**
 * Insert a verified review. The DB's RLS insert policy independently checks
 * that `bookingId` is the author's own COMPLETED booking at this studio, and
 * the unique constraint on booking_id prevents reviewing the same booking
 * twice — so this can't be forged from the client.
 */
export async function submitReviewAction(
  locale: string,
  slug: string,
  bookingId: string,
  input: SubmitReviewInput,
): Promise<SubmitReviewResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: 'You are signed out.' };

  const { data: studio } = await supabase
    .from('studios')
    .select('id')
    .eq('slug', slug)
    .maybeSingle();
  if (!studio) return { ok: false, error: 'Studio not found.' };

  const { error } = await supabase.from('reviews').insert({
    studio_id: studio.id as string,
    booking_id: bookingId,
    author_id: user.id,
    score_quality: input.scores.quality,
    score_cleanliness: input.scores.cleanliness,
    score_value: input.scores.value,
    recommend: input.recommend,
    would_return: input.wouldReturn,
    tags: input.tags,
    body: input.body.trim() || null,
  });

  if (error) {
    console.error('submitReviewAction failed', error);
    if (error.code === '23505') return { ok: false, error: 'You already reviewed this appointment.' };
    return { ok: false, error: 'Could not submit your review. Please try again.' };
  }

  revalidatePath(`/${locale}/studio/${slug}`);
  return { ok: true };
}
