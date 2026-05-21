'use client';

import * as React from 'react';
import { Star } from 'lucide-react';

import { Link } from '@/i18n/navigation';
import { cn } from '@/lib/utils';
import { MapBase } from '@/components/preview-map/_map-base';
import { DraggableSheet } from '@/components/preview-map/_draggable-sheet';
import { img, formatLei, type Studio } from '@/lib/app-mock-data';

export function DiscoverClient({
  studios,
  focusId,
}: {
  studios: Studio[];
  focusId?: string;
}) {
  // If focusing a specific studio, surface it first + centre the map on it.
  const ordered = React.useMemo(() => {
    if (!focusId) return studios;
    const focused = studios.find((s) => s.id === focusId);
    if (!focused) return studios;
    return [focused, ...studios.filter((s) => s.id !== focusId)];
  }, [studios, focusId]);

  const focused = focusId ? studios.find((s) => s.id === focusId) : undefined;

  return (
    <div className="relative h-full">
      <MapBase
        markers={ordered}
        center={focused ? { lat: focused.lat, lng: focused.lng } : undefined}
        defaultZoom={focused ? 15 : 14}
        className="absolute inset-0"
        renderPin={(s, i) => {
          const highlight = focusId ? s.id === focusId : i === 0;
          return (
            <div
              className={cn(
                '-translate-y-1.5 whitespace-nowrap rounded-full px-3 py-1 text-xs font-medium shadow-md',
                highlight
                  ? 'bg-accent text-accent-foreground'
                  : 'bg-card text-foreground ring-1 ring-border',
              )}
            >
              {s.priceFromLei === 0 ? 'Free' : `${s.priceFromLei} lei`}
            </div>
          );
        }}
      />

      <DraggableSheet
        peekHeight={300}
        expandedHeight={560}
        className="rounded-t-3xl bg-card shadow-2xl ring-1 ring-border"
        handle={
          <div className="flex flex-col items-center gap-2 py-3">
            <div className="h-1 w-12 rounded-full bg-foreground/30" aria-hidden />
            <div className="text-xs font-medium text-muted-foreground">
              {ordered.length} nearby · drag up for more
            </div>
          </div>
        }
      >
        <div className="space-y-3 px-4 pb-10">
          {ordered.map((s) => {
            const isFocused = focusId === s.id;
            return (
              <Link
                key={s.id}
                href={`/studio/${s.id}`}
                className={cn(
                  'flex items-center gap-3 rounded-3xl p-3 shadow-sm ring-1 transition-transform hover:-translate-y-0.5',
                  isFocused ? 'bg-accent/10 ring-accent/40' : 'bg-background ring-border',
                )}
              >
                <img
                  src={img.square(s.heroSeed)}
                  alt=""
                  className="size-16 shrink-0 rounded-2xl object-cover"
                />
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm font-medium">{s.name}</div>
                  <div className="truncate text-xs text-muted-foreground">{s.tagline}</div>
                  <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
                    <span className="inline-flex items-center gap-1">
                      <Star className="size-3 fill-current text-accent" /> {s.rating}
                    </span>
                    <span aria-hidden>·</span>
                    <span>{s.distanceKm === 0 ? 'Mobile' : `${s.distanceKm} km`}</span>
                  </div>
                </div>
                <div className="rounded-full bg-accent/15 px-3 py-1 text-xs font-medium text-foreground">
                  {formatLei(s.priceFromLei)}+
                </div>
              </Link>
            );
          })}
        </div>
      </DraggableSheet>
    </div>
  );
}
