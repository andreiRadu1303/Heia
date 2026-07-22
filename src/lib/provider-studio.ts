import { createClient } from '@/lib/supabase/server';

/**
 * A studio row as stored in Supabase (snake_case), scoped to the columns the
 * provider area reads/writes. See migration 003 (+ 006 for site_config).
 */
export interface StudioRow {
  id: string;
  slug: string;
  name: string;
  category_id: string;
  tagline: string | null;
  bio: string | null;
  city: string | null;
  address: string | null;
  known_for: string[];
  price_from_lei: number;
  rating: number;
  review_count: number;
  is_published: boolean;
  hero_seed: string | null;
  avatar_seed: string | null;
  gallery_seeds: string[];
  avatar_url: string | null;
  cover_url: string | null;
  gallery_urls: string[];
  site_config: unknown;
  onboarded_at: string | null;
}

const STUDIO_COLUMNS =
  'id, slug, name, category_id, tagline, bio, city, address, known_for, price_from_lei, rating, review_count, is_published, hero_seed, avatar_seed, gallery_seeds, avatar_url, cover_url, gallery_urls, site_config, onboarded_at';

/**
 * The signed-in expert's own studio (created for them at signup). Returns null
 * when signed out or when no studio exists for this user.
 */
export async function getMyStudio(): Promise<StudioRow | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data } = await supabase
    .from('studios')
    .select(STUDIO_COLUMNS)
    .eq('provider_id', user.id)
    .maybeSingle();

  return (data as StudioRow | null) ?? null;
}
