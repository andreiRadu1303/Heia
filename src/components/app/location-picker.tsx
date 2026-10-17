'use client';

import * as React from 'react';
import type { Map as MlMap } from 'maplibre-gl';
import { Check, Loader2, X, Crosshair } from 'lucide-react';

import { loadMapLibre, MAP_STYLE_URL, DEFAULT_CENTER } from '@/lib/maplibre-loader';
import { Button } from '@/components/ui/button';

import 'maplibre-gl/dist/maplibre-gl.css';

export interface LatLng {
  lat: number;
  lng: number;
}

/**
 * Full-screen map for placing a studio's pin by hand.
 *
 * The marker is a fixed crosshair at the centre of the viewport and the map
 * moves underneath it — the standard ride-hailing pattern. It beats dragging a
 * marker on touch, where your finger covers the thing you're positioning.
 *
 * `initial` is a starting guess (geocoded address, or city centre). Whatever
 * the person confirms wins — geocoding is a convenience, not the authority.
 */
export function LocationPicker({
  initial,
  onConfirm,
  onCancel,
  saving = false,
}: {
  initial?: LatLng | null;
  onConfirm: (point: LatLng) => void;
  onCancel: () => void;
  saving?: boolean;
}) {
  const containerRef = React.useRef<HTMLDivElement | null>(null);
  const mapRef = React.useRef<MlMap | null>(null);
  const start = initial ?? DEFAULT_CENTER;
  const [point, setPoint] = React.useState<LatLng>(start);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    let cancelled = false;

    (async () => {
      if (!containerRef.current || mapRef.current) return;
      const maplibregl = await loadMapLibre();
      if (cancelled || !containerRef.current) return;

      const map = new maplibregl.Map({
        container: containerRef.current,
        style: MAP_STYLE_URL,
        center: [start.lng, start.lat],
        // Close in, so the person is fine-tuning rather than hunting.
        zoom: initial ? 16 : 13,
        attributionControl: { compact: true },
      });
      map.addControl(new maplibregl.NavigationControl({ showCompass: false }), 'top-right');
      map.on('load', () => {
        if (!cancelled) setLoading(false);
      });
      // The centre of the map IS the chosen point.
      map.on('move', () => {
        const c = map.getCenter();
        setPoint({ lat: c.lat, lng: c.lng });
      });
      mapRef.current = map;
    })();

    return () => {
      cancelled = true;
      mapRef.current?.remove();
      mapRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-background">
      {/* Header */}
      <div className="flex items-center gap-3 border-b border-border px-4 py-3">
        <button
          type="button"
          onClick={onCancel}
          aria-label="Close"
          className="grid size-9 shrink-0 place-items-center rounded-full hover:bg-secondary"
        >
          <X className="size-5" />
        </button>
        <div className="min-w-0">
          <div className="font-medium">Place your pin</div>
          <div className="truncate text-xs text-muted-foreground">
            Move the map so the cross sits on your door.
          </div>
        </div>
      </div>

      {/* Map */}
      <div className="relative flex-1">
        <div ref={containerRef} className="size-full" />

        {/* Fixed crosshair — the map moves, this doesn't. */}
        <div
          className="pointer-events-none absolute inset-0 grid place-items-center"
          aria-hidden
        >
          <div className="-translate-y-3">
            <Crosshair className="size-9 text-accent drop-shadow-[0_2px_6px_rgba(0,0,0,0.8)]" />
          </div>
        </div>

        {loading ? (
          <div className="pointer-events-none absolute inset-0 grid place-items-center bg-background/60">
            <Loader2 className="size-6 animate-spin text-muted-foreground" />
          </div>
        ) : null}
      </div>

      {/* Footer */}
      <div className="border-t border-border px-4 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
        <div className="mb-2 text-center font-mono text-xs text-muted-foreground">
          {point.lat.toFixed(5)}, {point.lng.toFixed(5)}
        </div>
        <Button
          type="button"
          onClick={() => onConfirm(point)}
          disabled={saving || loading}
          className="h-12 w-full gap-2"
        >
          {saving ? (
            <>
              <Loader2 className="size-4 animate-spin" /> Saving…
            </>
          ) : (
            <>
              <Check className="size-4" /> Use this location
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
