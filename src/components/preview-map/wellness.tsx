'use client';

import { Search, SlidersHorizontal } from 'lucide-react';
import { MAP_RESULTS, imageFor } from '@/lib/preview-mock-data';
import { MapBase } from './_map-base';
import { DraggableSheet } from './_draggable-sheet';

/**
 * WELLNESS — Google Map with floating pill chrome; soft drawer
 * has a curved top, rounded handle, and pill-style result cards.
 */
export function WellnessMap() {
  return (
    <div className="relative h-dvh overflow-hidden">
      <MapBase
        className="absolute inset-0"
        renderPin={(r, i) => (
          <div
            className={`-translate-y-1.5 rounded-full px-3 py-1 text-xs font-medium shadow-md ${
              i === 0
                ? 'bg-accent text-accent-foreground'
                : 'bg-card text-foreground ring-1 ring-border'
            }`}
          >
            {r.priceFrom}
          </div>
        )}
      />

      {/* Floating pill chrome */}
      <div className="pointer-events-none absolute inset-x-0 top-0 z-20 p-3">
        <div className="pointer-events-auto flex items-center gap-2">
          <div className="flex h-11 flex-1 items-center gap-2 rounded-full bg-card px-4 shadow-md ring-1 ring-border">
            <Search className="size-4 text-muted-foreground" />
            <span className="truncate text-sm text-muted-foreground">Hair · Soft Glam</span>
          </div>
          <button
            className="grid size-11 place-items-center rounded-full bg-card shadow-md ring-1 ring-border"
            aria-label="Filters"
          >
            <SlidersHorizontal className="size-4" />
          </button>
        </div>
        <div className="pointer-events-auto -mr-3 mt-2 overflow-x-auto">
          <div className="flex w-max gap-2 pb-1">
            {['Open now', 'Verified', '★ 4.5+'].map((c, i) => (
              <span
                key={c}
                className={`whitespace-nowrap rounded-full px-3.5 py-1.5 text-xs shadow-sm ${
                  i === 0
                    ? 'bg-foreground text-background'
                    : 'bg-card text-foreground/80 ring-1 ring-border'
                }`}
              >
                {c}
              </span>
            ))}
          </div>
        </div>
      </div>

      <DraggableSheet
        peekHeight={290}
        expandedHeight={620}
        className="rounded-t-3xl bg-card shadow-2xl ring-1 ring-border"
        handle={
          <div className="flex flex-col items-center gap-2 py-3">
            <div className="h-1 w-12 rounded-full bg-foreground/30" />
            <div className="text-xs font-medium text-muted-foreground">
              {MAP_RESULTS.length} near you · drag up
            </div>
          </div>
        }
      >
        <div className="space-y-3 px-4 pb-8">
          {MAP_RESULTS.map((r) => (
            <div
              key={r.id}
              className="flex items-center gap-3 rounded-3xl bg-background p-3 shadow-sm ring-1 ring-border"
            >
              <img
                src={imageFor.thumb(r.id)}
                alt=""
                className="size-16 rounded-2xl object-cover"
              />
              <div className="min-w-0 flex-1">
                <div className="text-sm font-medium">{r.name}</div>
                <div className="truncate text-xs text-muted-foreground">{r.specialty}</div>
                <div className="mt-0.5 text-xs text-muted-foreground">
                  ★ {r.rating} · {r.distance}
                </div>
              </div>
              <div className="rounded-full bg-accent/15 px-3 py-1 text-xs font-medium text-foreground">
                {r.priceFrom}
              </div>
            </div>
          ))}
        </div>
      </DraggableSheet>
    </div>
  );
}
