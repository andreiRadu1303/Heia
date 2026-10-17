'use server';

import { revalidatePath } from 'next/cache';

import { createClient } from '@/lib/supabase/server';
import { geocodeAddress } from '@/lib/geocode';

export interface LocationState {
  ok?: boolean;
  error?: string;
}

/**
 * Save a pin the expert positioned themselves.
 *
 * Marked 'manual' so a later address edit won't re-geocode over it — the
 * person standing in the building knows better than the geocoder.
 */
export async function saveStudioLocationAction(
  locale: string,
  lat: number,
  lng: number,
): Promise<LocationState> {
  if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
    return { error: 'That location looks invalid.' };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: 'You are signed out.' };

  const { error } = await supabase
    .from('studios')
    .update({ lat, lng, location_source: 'manual' })
    .eq('provider_id', user.id);

  if (error) {
    console.error('saveStudioLocationAction failed', error);
    return { error: 'Could not save your pin. Make sure migration 015 has been run.' };
  }

  revalidatePath(`/${locale}/provider/profile`);
  revalidatePath(`/${locale}/discover`);
  return { ok: true };
}

/**
 * Where the picker should open: the studio's existing pin, else a geocoded
 * guess from the address it was given, else null (the picker falls back to the
 * city centre). Only a starting point — the expert's choice is what counts.
 */
export async function suggestStudioLocationAction(
  address: string,
  city: string,
): Promise<{ lat: number; lng: number } | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: studio } = await supabase
    .from('studios')
    .select('lat, lng')
    .eq('provider_id', user.id)
    .maybeSingle();

  if (studio?.lat != null && studio?.lng != null) {
    return { lat: studio.lat as number, lng: studio.lng as number };
  }

  if (!address?.trim()) return null;
  const hit = await geocodeAddress(address, city);
  return hit ? { lat: hit.lat, lng: hit.lng } : null;
}
