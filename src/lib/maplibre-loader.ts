/**
 * Lazily load MapLibre, with the worker URL pointed at our own copy.
 *
 * MapLibre resolves its worker from `import.meta.url`, which Next.js rewrites
 * to a path that 404s to HTML — the browser then rejects it for having a
 * non-JS MIME type and the map silently never starts. We serve the worker from
 * /public instead (see scripts/copy-maplibre-worker.mjs).
 *
 * Importing lazily also keeps MapLibre out of the server bundle: it touches
 * `window` at module scope, which would break SSR of any page holding a map.
 */
let cached: Promise<typeof import('maplibre-gl')> | null = null;

export function loadMapLibre(): Promise<typeof import('maplibre-gl')> {
  if (!cached) {
    cached = import('maplibre-gl').then((mod) => {
      mod.setWorkerUrl('/maplibre/maplibre-gl-worker.js');
      return mod;
    });
  }
  return cached;
}

/** OpenFreeMap — free OSM vector tiles, no key, no request limits. */
export const MAP_STYLE_URL = 'https://tiles.openfreemap.org/styles/dark';

/** Bucharest centre — the fallback when we have nothing better. */
export const DEFAULT_CENTER = { lat: 44.4268, lng: 26.1025 };
