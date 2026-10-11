/**
 * Cities a client can pick for discovery. The id is what we store on
 * `profiles.city`; `name` must match `studios.city` (and the mock data) so
 * the home list can be filtered by it. Coordinates are the map centre and
 * the origin for "distance" when studios aren't geocoded yet.
 */
export interface City {
  id: string;
  name: string;
  lat: number;
  lng: number;
}

export const CITIES: City[] = [
  { id: 'bucuresti', name: 'București', lat: 44.4268, lng: 26.1025 },
  { id: 'cluj-napoca', name: 'Cluj-Napoca', lat: 46.7712, lng: 23.6236 },
  { id: 'timisoara', name: 'Timișoara', lat: 45.7489, lng: 21.2087 },
  { id: 'iasi', name: 'Iași', lat: 47.1585, lng: 27.6014 },
  { id: 'constanta', name: 'Constanța', lat: 44.1598, lng: 28.6348 },
  { id: 'brasov', name: 'Brașov', lat: 45.6427, lng: 25.5887 },
  { id: 'craiova', name: 'Craiova', lat: 44.3302, lng: 23.7949 },
  { id: 'oradea', name: 'Oradea', lat: 47.0465, lng: 21.9189 },
  { id: 'sibiu', name: 'Sibiu', lat: 45.7983, lng: 24.1256 },
  { id: 'pitesti', name: 'Pitești', lat: 44.8565, lng: 24.8692 },
];

export const DEFAULT_CITY_ID = 'bucuresti';

export function cityById(id: string | null | undefined): City | undefined {
  return CITIES.find((c) => c.id === id);
}

/** The chosen city, or the default when unset / unknown. */
export function resolveCity(id: string | null | undefined): City {
  return cityById(id) ?? (cityById(DEFAULT_CITY_ID) as City);
}

/** Great-circle distance in km between two points, rounded to 0.1 km. */
export function distanceKm(
  a: { lat: number; lng: number },
  b: { lat: number; lng: number },
): number {
  const toRad = (d: number) => (d * Math.PI) / 180;
  const R = 6371;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.sin(dLng / 2) ** 2;
  return Math.round(2 * R * Math.asin(Math.sqrt(h)) * 10) / 10;
}

/** Normalise free-text city names: case, accents and surrounding spaces. */
export function normalizeCityName(s: string): string {
  return s
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .trim()
    .toLowerCase();
}

/** Look up a city by its display name as typed by a provider ("oradea" works). */
export function cityByName(name: string | null | undefined): City | undefined {
  if (!name) return undefined;
  const n = normalizeCityName(name);
  return CITIES.find((c) => normalizeCityName(c.name) === n);
}
