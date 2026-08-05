/**
 * Review system.
 *
 * Model follows the product spec: an overall score is the average of THREE
 * sub-scores (service quality, cleanliness, value-for-money). A review may
 * also carry quick tags, a recommend flag, a "would return" answer, and free
 * text. A review is "verified" when it references a completed booking made
 * through the app (anti-fake-review).
 *
 * This mirrors a future `reviews` table 1:1, so the front-end and the backend
 * share one shape:
 *
 *   reviews(
 *     id, studio_id, booking_id unique, author_id,
 *     score_quality, score_cleanliness, score_value,   -- 1..5
 *     recommend bool, would_return text,               -- 'yes'|'no'|'maybe'
 *     tags text[], body text, created_at
 *   )
 *   -- overall = (quality + cleanliness + value) / 3  (computed)
 *   -- RLS: insert only if author has a COMPLETED booking with this studio
 *   -- trigger: refresh studios.rating + review_count
 */

export type WouldReturn = 'yes' | 'no' | 'maybe';

export interface ReviewScores {
  /** Calitatea serviciului */
  quality: number;
  /** Curățenie */
  cleanliness: number;
  /** Raport calitate-preț */
  value: number;
}

export interface Review {
  id: string;
  studioId: string;
  /** Present → the review is tied to a real booking → verified. */
  bookingId?: string;
  author: string;
  avatarSeed: string;
  scores: ReviewScores;
  recommend: boolean;
  wouldReturn: WouldReturn;
  /** Tag ids from TAGS. */
  tags: string[];
  body: string;
  /** ISO timestamp. */
  createdAt: string;
}

export const SUBSCORES: { key: keyof ReviewScores; label: string }[] = [
  { key: 'quality', label: 'Service quality' },
  { key: 'cleanliness', label: 'Cleanliness' },
  { key: 'value', label: 'Value for money' },
];

export interface TagDef {
  id: string;
  label: string;
  sentiment: 'positive' | 'negative';
}

/** Quick tags from the spec (translated from the Romanian source). */
export const TAGS: TagDef[] = [
  { id: 'clean', label: 'Clean', sentiment: 'positive' },
  { id: 'friendly', label: 'Friendly atmosphere', sentiment: 'positive' },
  { id: 'value', label: 'Good value', sentiment: 'positive' },
  { id: 'recommend', label: 'Would recommend', sentiment: 'positive' },
  { id: 'professional', label: 'Professional', sentiment: 'positive' },
  { id: 'hygiene', label: 'Poor hygiene', sentiment: 'negative' },
  { id: 'overpriced', label: 'Overpriced', sentiment: 'negative' },
  { id: 'rude', label: 'Rude staff', sentiment: 'negative' },
  { id: 'mismatch', label: "Result didn't match request", sentiment: 'negative' },
];

export function tagById(id: string): TagDef | undefined {
  return TAGS.find((t) => t.id === id);
}

// ---------------------------------------------------------------------------
// Scoring
// ---------------------------------------------------------------------------

export function overall(scores: ReviewScores): number {
  return (scores.quality + scores.cleanliness + scores.value) / 3;
}

export interface ReviewAggregate {
  count: number;
  overall: number;
  subscores: ReviewScores;
  recommendPct: number;
  topTags: { id: string; label: string; sentiment: TagDef['sentiment']; count: number }[];
}

export function aggregate(reviews: Review[]): ReviewAggregate {
  if (reviews.length === 0) {
    return {
      count: 0,
      overall: 0,
      subscores: { quality: 0, cleanliness: 0, value: 0 },
      recommendPct: 0,
      topTags: [],
    };
  }

  const n = reviews.length;
  const sum = reviews.reduce(
    (acc, r) => ({
      quality: acc.quality + r.scores.quality,
      cleanliness: acc.cleanliness + r.scores.cleanliness,
      value: acc.value + r.scores.value,
    }),
    { quality: 0, cleanliness: 0, value: 0 },
  );
  const subscores: ReviewScores = {
    quality: sum.quality / n,
    cleanliness: sum.cleanliness / n,
    value: sum.value / n,
  };

  const recommendPct = Math.round(
    (reviews.filter((r) => r.recommend).length / n) * 100,
  );

  const tagCounts = new Map<string, number>();
  for (const r of reviews) {
    for (const id of r.tags) tagCounts.set(id, (tagCounts.get(id) ?? 0) + 1);
  }
  const topTags = [...tagCounts.entries()]
    .map(([id, count]) => {
      const def = tagById(id);
      return { id, label: def?.label ?? id, sentiment: def?.sentiment ?? 'positive', count };
    })
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  return {
    count: n,
    overall: overall(subscores),
    subscores,
    recommendPct,
    topTags,
  };
}

// Reviews are read from the database via `reviews-server.ts`. The former
// localStorage-based seed/persistence helpers were removed after that wiring.
