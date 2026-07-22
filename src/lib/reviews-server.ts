import { createClient } from '@/lib/supabase/server';
import type { Review, WouldReturn } from '@/lib/reviews';

interface ReviewRow {
  id: string;
  studio_id: string;
  booking_id: string;
  author_id: string;
  score_quality: number;
  score_cleanliness: number;
  score_value: number;
  recommend: boolean;
  would_return: WouldReturn;
  tags: string[] | null;
  body: string | null;
  created_at: string;
}

async function studioIdBySlug(
  supabase: Awaited<ReturnType<typeof createClient>>,
  slug: string,
): Promise<string | null> {
  const { data } = await supabase.from('studios').select('id').eq('slug', slug).maybeSingle();
  return (data?.id as string | undefined) ?? null;
}

/** All reviews for a studio (by slug), newest first, mapped for the UI. */
export async function getStudioReviewsBySlug(slug: string): Promise<Review[]> {
  const supabase = await createClient();
  const studioId = await studioIdBySlug(supabase, slug);
  if (!studioId) return [];

  const { data: rows } = await supabase
    .from('reviews')
    .select(
      'id, studio_id, booking_id, author_id, score_quality, score_cleanliness, score_value, recommend, would_return, tags, body, created_at',
    )
    .eq('studio_id', studioId)
    .order('created_at', { ascending: false });

  const reviews = (rows ?? []) as ReviewRow[];
  if (reviews.length === 0) return [];

  // Resolve author display names in one query.
  const authorIds = Array.from(new Set(reviews.map((r) => r.author_id)));
  const nameById = new Map<string, string>();
  if (authorIds.length > 0) {
    const { data: profiles } = await supabase
      .from('profiles')
      .select('id, display_name')
      .in('id', authorIds);
    for (const p of (profiles ?? []) as { id: string; display_name: string | null }[]) {
      nameById.set(p.id, p.display_name?.trim() || 'Client');
    }
  }

  return reviews.map((r) => ({
    id: r.id,
    studioId: slug,
    bookingId: r.booking_id,
    author: nameById.get(r.author_id) ?? 'Client',
    avatarSeed: r.author_id,
    scores: {
      quality: r.score_quality,
      cleanliness: r.score_cleanliness,
      value: r.score_value,
    },
    recommend: r.recommend,
    wouldReturn: r.would_return,
    tags: r.tags ?? [],
    body: r.body ?? '',
    createdAt: r.created_at,
  }));
}

export interface ReviewEligibility {
  signedIn: boolean;
  bookingId: string | null; // a completed, not-yet-reviewed booking at this studio
}

/**
 * Whether the current user can review this studio: they must have a COMPLETED
 * booking here that they haven't already reviewed.
 */
export async function getReviewEligibility(slug: string): Promise<ReviewEligibility> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { signedIn: false, bookingId: null };

  const studioId = await studioIdBySlug(supabase, slug);
  if (!studioId) return { signedIn: true, bookingId: null };

  const { data: completed } = await supabase
    .from('bookings')
    .select('id')
    .eq('client_id', user.id)
    .eq('studio_id', studioId)
    .eq('status', 'completed');

  const { data: reviewed } = await supabase
    .from('reviews')
    .select('booking_id')
    .eq('author_id', user.id)
    .eq('studio_id', studioId);

  const reviewedSet = new Set((reviewed ?? []).map((r) => r.booking_id as string));
  const eligible = ((completed ?? []) as { id: string }[]).find((b) => !reviewedSet.has(b.id));

  return { signedIn: true, bookingId: eligible?.id ?? null };
}
