'use client';

import * as React from 'react';
import { createRoot, type Root } from 'react-dom/client';
import type { Map as MlMap, Marker as MlMarker } from 'maplibre-gl';

import { MAP_RESULTS } from '@/lib/preview-mock-data';
import { cn } from '@/lib/utils';

import 'maplibre-gl/dist/maplibre-gl.css';

/** Bucharest centre. */
const CENTER = { lat: 44.4268, lng: 26.1025 };

/**
 * OpenFreeMap — free public instance of OpenStreetMap vector tiles.
 * No API key, no registration, no request limits, commercial use allowed.
 * Attribution is added automatically by MapLibre. If we ever want zero
 * third-party calls, this URL is the only thing that changes (swap for a
 * self-hosted PMTiles file).
 */
const STYLE_URL = 'https://tiles.openfreemap.org/styles/dark';

/**
 * Default markers for the preview-map pages — derived from MAP_RESULTS
 * with x/y percentages converted to lat/lng around the centre.
 */
export const MAP_PINS = MAP_RESULTS.map((r) => ({
  ...r,
  lat: CENTER.lat + (50 - r.y) * 0.00018,
  lng: CENTER.lng + (r.x - 50) * 0.00028,
}));

export type MapPin = (typeof MAP_PINS)[number];

interface BaseMarker {
  id: string;
  lat: number;
  lng: number;
}

/**
 * Real OpenStreetMap map (MapLibre GL + OpenFreeMap tiles).
 *
 * Deliberately a drop-in replacement for the previous mockup component: the
 * props are unchanged, so callers keep passing `markers` + `renderPin` and
 * their pin design survives — each pin becomes an HTML marker anchored to its
 * real coordinates.
 *
 * MapLibre is imported lazily inside an effect because it touches `window` at
 * module scope, which would break server rendering of any page using the map.
 */
export function MapBase<T extends BaseMarker = MapPin>({
  markers = MAP_PINS as unknown as T[],
  renderPin,
  className,
  center,
  defaultZoom = 12,
}: {
  markers?: T[];
  renderPin: (marker: T, index: number) => React.ReactNode;
  className?: string;
  defaultZoom?: number;
  center?: { lat: number; lng: number };
}) {
  const containerRef = React.useRef<HTMLDivElement | null>(null);
  const mapRef = React.useRef<MlMap | null>(null);
  const libRef = React.useRef<typeof import('maplibre-gl') | null>(null);
  const markerRefs = React.useRef<{ marker: MlMarker; root: Root }[]>([]);
  const [ready, setReady] = React.useState(false);

  const startLat = center?.lat ?? CENTER.lat;
  const startLng = center?.lng ?? CENTER.lng;

  // Create the map once, client-side only.
  React.useEffect(() => {
    let cancelled = false;

    (async () => {
      if (!containerRef.current || mapRef.current) return;
      const maplibregl = await import('maplibre-gl');
      if (cancelled || !containerRef.current) return;
      libRef.current = maplibregl;

      // MapLibre derives its worker URL from `import.meta.url`, which Next.js
      // rewrites to a path that 404s to HTML — the browser then refuses it for
      // having a non-JS MIME type and the map never starts. We serve our own
      // copy from /public instead (see scripts/copy-maplibre-worker.mjs).
      maplibregl.setWorkerUrl('/maplibre/maplibre-gl-worker.js');

      const map = new maplibregl.Map({
        container: containerRef.current,
        style: STYLE_URL,
        center: [startLng, startLat],
        zoom: defaultZoom,
        attributionControl: { compact: true },
      });
      map.addControl(new maplibregl.NavigationControl({ showCompass: false }), 'top-right');
      map.on('load', () => {
        if (!cancelled) setReady(true);
      });
      mapRef.current = map;
    })();

    return () => {
      cancelled = true;
      markerRefs.current.forEach(({ marker, root }) => {
        marker.remove();
        // Unmount on a later tick — React forbids unmounting during render.
        setTimeout(() => root.unmount(), 0);
      });
      markerRefs.current = [];
      mapRef.current?.remove();
      mapRef.current = null;
    };
    // Intentionally one-shot: re-creating the map on every prop change would
    // throw away the user's pan/zoom.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Sync markers whenever they change.
  React.useEffect(() => {
    const map = mapRef.current;
    const maplibregl = libRef.current;
    if (!map || !maplibregl || !ready) return;

    markerRefs.current.forEach(({ marker, root }) => {
      marker.remove();
      setTimeout(() => root.unmount(), 0);
    });
    markerRefs.current = [];

    const points = markers.filter((m) => Number.isFinite(m.lat) && Number.isFinite(m.lng));

    points.forEach((m, i) => {
      const el = document.createElement('div');
      const root = createRoot(el);
      root.render(renderPin(m, i));
      const marker = new maplibregl.Marker({ element: el })
        .setLngLat([m.lng, m.lat])
        .addTo(map);
      markerRefs.current.push({ marker, root });
    });

    // Frame all the pins; with a single pin just centre on it.
    if (points.length > 1) {
      const bounds = new maplibregl.LngLatBounds(
        [points[0].lng, points[0].lat],
        [points[0].lng, points[0].lat],
      );
      points.forEach((m) => bounds.extend([m.lng, m.lat]));
      map.fitBounds(bounds, { padding: 72, maxZoom: 15, duration: 600 });
    } else if (points.length === 1) {
      map.easeTo({ center: [points[0].lng, points[0].lat], zoom: 14, duration: 600 });
    }
  }, [markers, renderPin, ready]);

  return (
    <div className={cn('relative overflow-hidden bg-secondary/40', className)}>
      <div ref={containerRef} className="absolute inset-0" />
    </div>
  );
}
