'use server';

import { revalidatePath } from 'next/cache';

import { createClient } from '@/lib/supabase/server';
import { geocodeAddress } from '@/lib/geocode';

export interface ProfileState {
  ok?: boolean;
  error?: string;
  /** How the address fared on the map, so the form can tell the expert. */
  located?: 'pinned' | 'not-found' | 'no-address' | 'unchanged' | 'stale-manual';
}

/**
 * Save the signed-in expert's studio profile. RLS ("Studios: providers update
 * own") guarantees the update only touches their own row.
 */
export async function saveProfileAction(
  _prev: ProfileState,
  formData: FormData,
): Promise<ProfileState> {
  const locale = String(formData.get('locale') ?? 'ro');
  const name = String(formData.get('name') ?? '').trim();
  const tagline = String(formData.get('tagline') ?? '').trim();
  const categoryId = String(formData.get('category_id') ?? '').trim();
  const city = String(formData.get('city') ?? '').trim();
  const address = String(formData.get('address') ?? '').trim();
  const bio = String(formData.get('bio') ?? '').trim();
  const knownForRaw = String(formData.get('known_for') ?? '');
  const isPublished = formData.get('is_published') === 'on';

  if (!name) return { error: 'Studio name is required.' };

  const knownFor = knownForRaw
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: 'You are signed out. Please sign in again.' };

  // Only re-geocode when the address actually changed — keeps Nominatim calls
  // to roughly one per studio, as their usage policy requires.
  const { data: current } = await supabase
    .from('studios')
    .select('address, city, lat, lng, location_source')
    .eq('provider_id', user.id)
    .maybeSingle();

  // A pin the expert placed by hand outranks the geocoder — otherwise fixing a
  // typo in the address would silently drag their pin somewhere else.
  const pinnedByHand = current?.location_source === 'manual';

  const addressChanged =
    (current?.address ?? '') !== address || (current?.city ?? '') !== city;
  const needsCoords = current?.lat == null || current?.lng == null;

  let coords: { lat: number; lng: number } | null = null;
  let located: ProfileState['located'] = 'unchanged';

  if (pinnedByHand) {
    // Their pin stays put — but if the address moved, it's now pointing at the
    // old place and they need to know, because nothing on screen would show it.
    located = addressChanged ? 'stale-manual' : 'pinned';
  } else if (!address) {
    located = 'no-address';
  } else if (addressChanged || needsCoords) {
    const hit = await geocodeAddress(address, city);
    if (hit) {
      coords = { lat: hit.lat, lng: hit.lng };
      located = 'pinned';
    } else {
      located = 'not-found';
    }
  } else {
    located = 'pinned'; // already had coordinates and the address didn't change
  }

  const { error } = await supabase
    .from('studios')
    .update({
      name,
      tagline: tagline || null,
      category_id: categoryId || 'hair',
      city: city || null,
      address: address || null,
      bio: bio || null,
      known_for: knownFor,
      is_published: isPublished,
      // Clearing the address clears the pin, so we never show a stale
      // location — unless the expert placed that pin themselves.
      ...(coords
        ? { ...coords, location_source: 'geocoded' as const }
        : !pinnedByHand && addressChanged && !address
          ? { lat: null, lng: null, location_source: null }
          : {}),
    })
    .eq('provider_id', user.id);

  if (error) {
    console.error('saveProfileAction failed', error);
    return { error: 'Could not save. Please try again.' };
  }

  revalidatePath(`/${locale}/provider/profile`);
  revalidatePath(`/${locale}/provider`);
  return { ok: true, located };
}
