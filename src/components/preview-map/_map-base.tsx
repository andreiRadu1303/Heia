'use client';

import * as React from 'react';
import { APIProvider, Map, AdvancedMarker } from '@vis.gl/react-google-maps';

import { MAP_RESULTS } from '@/lib/preview-mock-data';
import { cn } from '@/lib/utils';

const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
const MAP_ID = process.env.NEXT_PUBLIC_GOOGLE_MAPS_ID ?? 'DEMO_MAP_ID';

/** Bucharest centre. */
const CENTER = { lat: 44.4268, lng: 26.1025 };

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
 * Real Google Map. Each caller supplies a `markers` array and a
 * `renderPin` callback for the marker HTML. Falls back to a stylistic
 * placeholder (with the markers positioned by normalised lat/lng) when
 * NEXT_PUBLIC_GOOGLE_MAPS_API_KEY is absent.
 */
export function MapBase<T extends BaseMarker = MapPin>({
  markers = MAP_PINS as unknown as T[],
  renderPin,
  className,
  defaultZoom = 14,
  center,
}: {
  markers?: T[];
  renderPin: (marker: T, index: number) => React.ReactNode;
  className?: string;
  defaultZoom?: number;
  center?: { lat: number; lng: number };
}) {
  const mapCenter =
    center ?? (markers.length ? { lat: markers[0].lat, lng: markers[0].lng } : CENTER);

  if (!API_KEY) {
    return <MapPlaceholder markers={markers} renderPin={renderPin} className={className} />;
  }

  return (
    <div className={cn('relative overflow-hidden', className)}>
      <APIProvider apiKey={API_KEY}>
        <Map
          defaultCenter={mapCenter}
          defaultZoom={defaultZoom}
          mapId={MAP_ID}
          disableDefaultUI
          gestureHandling="greedy"
          style={{ width: '100%', height: '100%' }}
        >
          {markers.map((m, i) => (
            <AdvancedMarker key={m.id} position={{ lat: m.lat, lng: m.lng }}>
              {renderPin(m, i)}
            </AdvancedMarker>
          ))}
        </Map>
      </APIProvider>
    </div>
  );
}

function MapPlaceholder<T extends BaseMarker>({
  markers,
  renderPin,
  className,
}: {
  markers: T[];
  renderPin: (marker: T, index: number) => React.ReactNode;
  className?: string;
}) {
  const lats = markers.map((m) => m.lat);
  const lngs = markers.map((m) => m.lng);
  const minLat = Math.min(...lats);
  const maxLat = Math.max(...lats);
  const minLng = Math.min(...lngs);
  const maxLng = Math.max(...lngs);

  const place = (m: T) => ({
    left: maxLng !== minLng ? 12 + ((m.lng - minLng) / (maxLng - minLng)) * 76 : 50,
    top: maxLat !== minLat ? 88 - ((m.lat - minLat) / (maxLat - minLat)) * 76 : 50,
  });

  return (
    <div className={cn('relative overflow-hidden bg-secondary/40', className)}>
      <div
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(180deg, hsl(var(--muted)) 0%, hsl(var(--secondary)) 100%)',
        }}
      />
      <svg className="absolute inset-0 size-full" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden>
        <path d="M -5 55 Q 30 50 50 60 T 105 50" fill="none" stroke="hsl(var(--background))" strokeOpacity="0.55" strokeWidth="1.2" />
        <path d="M -5 30 Q 40 40 60 25 T 105 22" fill="none" stroke="hsl(var(--background))" strokeOpacity="0.4" strokeWidth="0.8" />
        <path d="M 42 -5 Q 48 30 50 60 T 55 105" fill="none" stroke="hsl(var(--background))" strokeOpacity="0.55" strokeWidth="1" />
        <ellipse cx="20" cy="48" rx="14" ry="9" fill="hsl(var(--accent))" opacity="0.18" />
        <ellipse cx="78" cy="28" rx="9" ry="6" fill="hsl(var(--accent))" opacity="0.14" />
      </svg>
      {markers.map((m, i) => {
        const p = place(m);
        return (
          <div
            key={m.id}
            className="absolute -translate-x-1/2 -translate-y-full"
            style={{ left: `${p.left}%`, top: `${p.top}%` }}
          >
            {renderPin(m, i)}
          </div>
        );
      })}
      <div className="absolute bottom-2 left-2 right-2 rounded-md border border-border/60 bg-card/95 px-2.5 py-1.5 font-mono text-[9px] uppercase tracking-[0.18em] text-muted-foreground">
        Set NEXT_PUBLIC_GOOGLE_MAPS_API_KEY for live Google Maps
      </div>
    </div>
  );
}
