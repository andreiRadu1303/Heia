import { createClient } from '@/lib/supabase/server';
import { CITY_CENTER, type Studio } from '@/lib/app-mock-data';

interface StudioListRow {
  id: string;
  slug: string;
  name: string;
  category_id: string;
  tagline: string | null;
  bio: string | null;
  city: string | null;
  address: string | null;
  lat: number | null;
  lng: number | null;
  known_for: string[] | null;
  price_from_lei: number | null;
  rating: number | null;
  review_count: number | null;
  hero_seed: string | null;
  avatar_seed: string | null;
  gallery_seeds: string[] | null;
  cover_url: string | null;
  avatar_url: string | null;
  gallery_urls: string[] | null;
}

const LIST_COLUMNS =
  'id, slug, name, category_id, tagline, bio, city, address, lat, lng, known_for, price_from_lei, rating, review_count, hero_seed, avatar_seed, gallery_seeds, cover_url, avatar_url, gallery_urls';

function hash(str: string): number {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) | 0;
  return Math.abs(h);
}

/**
 * When a studio has no stored coordinates (addresses aren't geocoded yet), we
 * place it near the city centre with a small deterministic offset so the map
 * still shows distinct pins. Real geocoding on save is a follow-up (see
 * qa-and-roadmap.md); the mockup map doesn't need precise coordinates.
 */
function fallbackPoint(id: string): { lat: number; lng: number } {
  const h = hash(id);
  const latOffset = ((h % 1000) / 1000 - 0.5) * 0.04; // ~±2 km
  const lngOffset = (((h >> 10) % 1000) / 1000 - 0.5) * 0.06;
  return { lat: CITY_CENTER.lat + latOffset, lng: CITY_CENTER.lng + lngOffset };
}

function mapRow(row: StudioListRow): Studio {
  const point =
    row.lat != null && row.lng != null ? { lat: row.lat, lng: row.lng } : fallbackPoint(row.id);
  return {
    id: row.slug,
    name: row.name,
    categoryId: row.category_id,
    tagline: row.tagline ?? '',
    rating: Number(row.rating ?? 0),
    reviewCount: row.review_count ?? 0,
    priceFromLei: row.price_from_lei ?? 0,
    city: row.city ?? '',
    address: row.address ?? '',
    distanceKm: 0,
    lat: point.lat,
    lng: point.lng,
    bio: row.bio ?? '',
    knownFor: row.known_for ?? [],
    services: [],
    reviews: [],
    gallerySeeds: row.gallery_seeds ?? [],
    avatarSeed: row.avatar_seed ?? '',
    heroSeed: row.hero_seed ?? '',
    heroUrl: row.cover_url,
    avatarUrl: row.avatar_url,
    galleryUrls: row.gallery_urls ?? [],
  };
}

/** Published studios, optionally filtered by category, best-rated first. */
export async function getPublishedStudios(opts?: {
  categoryId?: string;
  limit?: number;
}): Promise<Studio[]> {
  const supabase = await createClient();
  let query = supabase
    .from('studios')
    .select(LIST_COLUMNS)
    .eq('is_published', true)
    .order('rating', { ascending: false });

  if (opts?.categoryId) query = query.eq('category_id', opts.categoryId);
  if (opts?.limit) query = query.limit(opts.limit);

  const { data } = await query;
  return ((data ?? []) as StudioListRow[]).map(mapRow);
}

/** Count of published studios per category id. */
export async function getPublishedCategoryCounts(): Promise<Record<string, number>> {
  const supabase = await createClient();
  const { data } = await supabase
    .from('studios')
    .select('category_id')
    .eq('is_published', true);

  const counts: Record<string, number> = {};
  for (const row of (data ?? []) as { category_id: string }[]) {
    counts[row.category_id] = (counts[row.category_id] ?? 0) + 1;
  }
  return counts;
}
