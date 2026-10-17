'use server';

import { revalidatePath } from 'next/cache';

import { createClient } from '@/lib/supabase/server';
import { geocodeAddress } from '@/lib/geocode';

/**
 * Geocode the signed-in expert's studio on demand.
 *
 * Used by the "Place me on the map" button for studios that were created
 * before geocoding existed, so their owner can fix the pin without having to
 * re-type and re-save the whole profile.
 */
export async function geocodeMyStudioAction(
  locale: string,
): Promise<{ ok?: boolean; error?: string }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: 'You are signed out.' };

  const { data: studio } = await supabase
    .from('studios')
    .select('id, address, city')
    .eq('provider_id', user.id)
    .maybeSingle();

  if (!studio) return { error: 'No studio found for your account.' };
  if (!studio.address) {
    return { error: 'Add a street address first — a city alone is not precise enough.' };
  }

  const hit = await geocodeAddress(studio.address as string, studio.city as string | null);
  if (!hit) {
    return {
      error: 'We could not find that address. Check the street name and number.',
    };
  }

  const { error } = await supabase
    .from('studios')
    .update({ lat: hit.lat, lng: hit.lng })
    .eq('id', studio.id);

  if (error) {
    console.error('geocodeMyStudioAction failed', error);
    return { error: 'Could not save the location. Please try again.' };
  }

  revalidatePath(`/${locale}/provider/profile`);
  return { ok: true };
}
