/**
 * Address → coordinates, via OpenStreetMap's Nominatim.
 *
 * Nominatim's usage policy forbids bulk geocoding and requires an identifying
 * User-Agent. We stay well inside it by geocoding ONCE, when an expert saves
 * their address, and storing the result on the studio row forever — so a
 * studio is never looked up twice and volume is a handful of calls a day.
 *
 * https://operations.osmfoundation.org/policies/nominatim/
 */

const NOMINATIM = 'https://nominatim.openstreetmap.org/search';

/** Identifies Heia to Nominatim, as their policy requires. */
const USER_AGENT =
  process.env.GEOCODER_USER_AGENT ?? 'Heia/1.0 (beauty marketplace; contact@heia.ro)';

export interface GeocodeResult {
  lat: number;
  lng: number;
  displayName: string;
}

/**
 * Look up a street address in Romania. Returns null when the address is too
 * vague to place, which is a normal outcome — callers should treat the studio
 * as "not yet mapped" rather than failing the save.
 */
export async function geocodeAddress(
  address: string | null | undefined,
  city: string | null | undefined,
): Promise<GeocodeResult | null> {
  const parts = [address?.trim(), city?.trim(), 'Romania'].filter(Boolean);
  // An address with only a city is not precise enough to pin on a map.
  if (!address?.trim()) return null;

  const url = new URL(NOMINATIM);
  url.searchParams.set('q', parts.join(', '));
  url.searchParams.set('format', 'jsonv2');
  url.searchParams.set('limit', '1');
  url.searchParams.set('countrycodes', 'ro');
  url.searchParams.set('addressdetails', '0');

  try {
    const res = await fetch(url, {
      headers: { 'User-Agent': USER_AGENT, 'Accept-Language': 'ro,en' },
      // Cache at the fetch layer too, so a double-save doesn't double-call.
      next: { revalidate: 60 * 60 * 24 * 30 },
    });
    if (!res.ok) {
      console.error('geocodeAddress: Nominatim returned', res.status);
      return null;
    }

    const json = (await res.json()) as { lat: string; lon: string; display_name: string }[];
    const hit = json?.[0];
    if (!hit) return null;

    const lat = Number(hit.lat);
    const lng = Number(hit.lon);
    if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null;

    return { lat, lng, displayName: hit.display_name };
  } catch (e) {
    console.error('geocodeAddress failed', e);
    return null;
  }
}

/**
 * A `geo:` link opens whichever map app the person actually has installed
 * (Google Maps, Organic Maps, Waze, Apple Maps) — no SDK, no key.
 */
export function directionsHref(
  lat: number | null,
  lng: number | null,
  label?: string,
): string | null {
  if (lat == null || lng == null) return null;
  const q = label ? `?q=${encodeURIComponent(label)}` : '';
  return `geo:${lat},${lng}${q}`;
}
