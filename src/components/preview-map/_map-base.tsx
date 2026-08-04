'use client';

import * as React from 'react';

import { MAP_RESULTS } from '@/lib/preview-mock-data';
import { cn } from '@/lib/utils';

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
 * Styled mockup map — no external provider, no API key. Pins are placed by
 * projecting each marker's lat/lng into the container (bounds-fit with padding).
 * The API is a drop-in replacement for the previous Google Maps component:
 * callers pass `markers` + a `renderPin` callback.
 */
export function MapBase<T extends BaseMarker = MapPin>({
  markers = MAP_PINS as unknown as T[],
  renderPin,
  className,
  center,
}: {
  markers?: T[];
  renderPin: (marker: T, index: number) => React.ReactNode;
  className?: string;
  /** Accepted for API compatibility; the mockup fits all markers in view. */
  defaultZoom?: number;
  center?: { lat: number; lng: number };
}) {
  const bounds = React.useMemo(() => {
    const lats = markers.map((m) => m.lat);
    const lngs = markers.map((m) => m.lng);
    if (center) {
      lats.push(center.lat);
      lngs.push(center.lng);
    }
    return {
      minLat: Math.min(...lats),
      maxLat: Math.max(...lats),
      minLng: Math.min(...lngs),
      maxLng: Math.max(...lngs),
    };
  }, [markers, center]);

  const place = (m: T) => {
    const { minLat, maxLat, minLng, maxLng } = bounds;
    const left = maxLng !== minLng ? 12 + ((m.lng - minLng) / (maxLng - minLng)) * 76 : 50;
    const top = maxLat !== minLat ? 88 - ((m.lat - minLat) / (maxLat - minLat)) * 76 : 50;
    return { left, top };
  };

  return (
    <div className={cn('relative overflow-hidden bg-secondary/40', className)}>
      {/* Base tint */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(160deg, hsl(var(--muted)) 0%, hsl(var(--secondary)) 100%)',
        }}
        aria-hidden
      />

      {/* Abstract streets / blocks / green space */}
      <svg
        className="absolute inset-0 size-full"
        viewBox="0 0 100 100"
        preserveAspectRatio="xMidYMid slice"
        aria-hidden
      >
        {/* City blocks */}
        <g fill="hsl(var(--background))" opacity="0.35">
          <rect x="8" y="10" width="16" height="12" rx="1.5" />
          <rect x="28" y="8" width="20" height="10" rx="1.5" />
          <rect x="66" y="12" width="18" height="14" rx="1.5" />
          <rect x="10" y="60" width="18" height="14" rx="1.5" />
          <rect x="34" y="70" width="22" height="16" rx="1.5" />
          <rect x="70" y="64" width="16" height="18" rx="1.5" />
          <rect x="60" y="40" width="14" height="12" rx="1.5" />
        </g>

        {/* Green space */}
        <ellipse cx="22" cy="42" rx="13" ry="9" fill="hsl(var(--accent))" opacity="0.16" />
        <ellipse cx="82" cy="46" rx="10" ry="7" fill="hsl(var(--accent))" opacity="0.13" />

        {/* River */}
        <path
          d="M -5 78 Q 25 66 45 74 T 105 62"
          fill="none"
          stroke="hsl(var(--accent))"
          strokeOpacity="0.28"
          strokeWidth="3.5"
          strokeLinecap="round"
        />

        {/* Roads */}
        <g stroke="hsl(var(--background))" strokeLinecap="round" fill="none">
          <path d="M -5 32 Q 40 28 70 34 T 105 30" strokeOpacity="0.6" strokeWidth="1.4" />
          <path d="M -5 54 Q 30 58 55 52 T 105 56" strokeOpacity="0.5" strokeWidth="1.1" />
          <path d="M 30 -5 Q 34 40 40 70 T 46 105" strokeOpacity="0.55" strokeWidth="1.2" />
          <path d="M 74 -5 Q 70 35 76 65 T 72 105" strokeOpacity="0.45" strokeWidth="1" />
        </g>
      </svg>

      {/* "You are here" at centre */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2" aria-hidden>
        <span className="block size-3 rounded-full bg-accent ring-4 ring-accent/25" />
      </div>

      {/* Markers */}
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
    </div>
  );
}
