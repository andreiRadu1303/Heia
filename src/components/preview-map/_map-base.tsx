'use client';

import * as React from 'react';
import { APIProvider, Map, AdvancedMarker } from '@vis.gl/react-google-maps';

import { MAP_RESULTS } from '@/lib/preview-mock-data';
import { cn } from '@/lib/utils';

const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
const MAP_ID = process.env.NEXT_PUBLIC_GOOGLE_MAPS_ID ?? 'DEMO_MAP_ID';

/** Bucharest as the demo centre. */
const CENTER = { lat: 44.4268, lng: 26.1025 };

/**
 * Mock results carry x/y as percentages (0-100). Convert to lat/lng
 * offsets around the centre so the pins land within ~1 km at zoom 14.
 */
export const MAP_PINS = MAP_RESULTS.map((r) => ({
  ...r,
  position: {
    lat: CENTER.lat + (50 - r.y) * 0.00018,
    lng: CENTER.lng + (r.x - 50) * 0.00028,
  },
}));

export type MapPin = (typeof MAP_PINS)[number];

/**
 * Real Google Map for the preview pages. Each style passes a
 * `renderPin` callback to customise the pin's HTML.
 *
 * If NEXT_PUBLIC_GOOGLE_MAPS_API_KEY is not set, falls back to a
 * stylistic placeholder that preserves the pin positions so the
 * surrounding chrome still looks complete.
 */
export function MapBase({
  renderPin,
  className,
  defaultZoom = 14,
}: {
  renderPin: (pin: MapPin, index: number) => React.ReactNode;
  className?: string;
  defaultZoom?: number;
}) {
  if (!API_KEY) {
    return <MapPlaceholder renderPin={renderPin} className={className} />;
  }

  return (
    <div className={cn('relative overflow-hidden', className)}>
      <APIProvider apiKey={API_KEY}>
        <Map
          defaultCenter={CENTER}
          defaultZoom={defaultZoom}
          mapId={MAP_ID}
          disableDefaultUI
          gestureHandling="greedy"
          style={{ width: '100%', height: '100%' }}
        >
          {MAP_PINS.map((p, i) => (
            <AdvancedMarker key={p.id} position={p.position}>
              {renderPin(p, i)}
            </AdvancedMarker>
          ))}
        </Map>
      </APIProvider>
    </div>
  );
}

function MapPlaceholder({
  renderPin,
  className,
}: {
  renderPin: (pin: MapPin, index: number) => React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn('relative overflow-hidden bg-secondary/40', className)}>
      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(180deg, hsl(var(--muted)) 0%, hsl(var(--secondary)) 100%)',
        }}
      />
      <svg
        className="absolute inset-0 size-full"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        aria-hidden
      >
        <path
          d="M -5 55 Q 30 50 50 60 T 105 50"
          fill="none"
          stroke="hsl(var(--background))"
          strokeOpacity="0.55"
          strokeWidth="1.2"
        />
        <path
          d="M -5 30 Q 40 40 60 25 T 105 22"
          fill="none"
          stroke="hsl(var(--background))"
          strokeOpacity="0.4"
          strokeWidth="0.8"
        />
        <path
          d="M 42 -5 Q 48 30 50 60 T 55 105"
          fill="none"
          stroke="hsl(var(--background))"
          strokeOpacity="0.55"
          strokeWidth="1"
        />
        <ellipse cx="20" cy="48" rx="14" ry="9" fill="hsl(var(--accent))" opacity="0.18" />
        <ellipse cx="78" cy="28" rx="9" ry="6" fill="hsl(var(--accent))" opacity="0.14" />
      </svg>
      {MAP_PINS.map((p, i) => (
        <div
          key={p.id}
          className="absolute -translate-x-1/2 -translate-y-full"
          style={{ left: `${p.x}%`, top: `${p.y}%` }}
        >
          {renderPin(p, i)}
        </div>
      ))}
      <div className="absolute bottom-2 left-2 right-2 rounded-md border border-border/60 bg-card/95 px-2.5 py-1.5 font-mono text-[9px] uppercase tracking-[0.18em] text-muted-foreground">
        Set NEXT_PUBLIC_GOOGLE_MAPS_API_KEY for live Google Maps
      </div>
    </div>
  );
}
