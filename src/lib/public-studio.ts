import { createClient } from '@/lib/supabase/server';
import {
  CITY_CENTER,
  type Studio,
  type ServiceOffering,
} from '@/lib/app-mock-data';

interface PublicStudioRow {
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
  avatar_url: string | null;
  cover_url: string | null;
  gallery_urls: string[] | null;
}

interface ServiceRow {
  id: string;
  name: string;
  duration_min: number;
  price_lei: number;
}

/**
 * Load a studio for the public profile page, mapped into the shared `Studio`
 * shape the UI renders. RLS makes published studios visible to everyone and an
 * unpublished studio visible only to its owner — so an expert can preview their
 * own page before publishing, while clients can't.
 *
 * Returns null when no such studio exists (or it's someone else's draft).
 */
export async function getPublicStudioBySlug(slug: string): Promise<Studio | null> {
  const supabase = await createClient();

  const { data: row } = await supabase
    .from('studios')
    .select(
      'id, slug, name, category_id, tagline, bio, city, address, lat, lng, known_for, price_from_lei, rating, review_count, hero_seed, avatar_seed, gallery_seeds, avatar_url, cover_url, gallery_urls',
    )
    .eq('slug', slug)
    .maybeSingle();

  if (!row) return null;
  const studio = row as PublicStudioRow;

  const { data: svcRows } = await supabase
    .from('services')
    .select('id, name, duration_min, price_lei')
    .eq('studio_id', studio.id)
    .order('sort_order', { ascending: true });

  const services: ServiceOffering[] = ((svcRows ?? []) as ServiceRow[]).map((s) => ({
    id: s.id,
    name: s.name,
    durationMin: s.duration_min,
    priceLei: s.price_lei,
  }));

  return {
    // Links use the slug (booking + review flows resolve studios by slug).
    id: studio.slug,
    name: studio.name,
    categoryId: studio.category_id,
    tagline: studio.tagline ?? '',
    rating: Number(studio.rating ?? 0),
    reviewCount: studio.review_count ?? 0,
    priceFromLei: studio.price_from_lei ?? 0,
    city: studio.city ?? '',
    address: studio.address ?? '',
    distanceKm: 0,
    lat: studio.lat ?? CITY_CENTER.lat,
    lng: studio.lng ?? CITY_CENTER.lng,
    bio: studio.bio ?? '',
    knownFor: studio.known_for ?? [],
    services,
    reviews: [],
    gallerySeeds: studio.gallery_seeds ?? [],
    avatarSeed: studio.avatar_seed ?? studio.slug,
    heroSeed: studio.hero_seed ?? studio.slug,
    heroUrl: studio.cover_url,
    avatarUrl: studio.avatar_url,
    galleryUrls: studio.gallery_urls ?? [],
  };
}
