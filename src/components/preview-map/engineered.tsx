'use client';

import { MAP_RESULTS, FILTER_CHIPS, imageFor } from '@/lib/preview-mock-data';
import { MapBase } from './_map-base';
import { DraggableSheet } from './_draggable-sheet';

/**
 * ENGINEERED — Google Map under a mono status bar; sheet shows
 * a typed log table of results with a mono drag handle.
 */
export function EngineeredMap() {
  return (
    <div className="relative h-dvh overflow-hidden">
      <MapBase
        className="absolute inset-0"
        renderPin={(_, i) => (
          <div
            className={`grid size-6 -translate-y-3 place-items-center rounded-full font-mono text-[10px] shadow-sm ring-1 ${
              i === 0
                ? 'bg-foreground text-background ring-foreground'
                : 'bg-background text-foreground ring-border'
            }`}
          >
            {String(i + 1).padStart(2, '0')}
          </div>
        )}
      />

      {/* Floating mono status bar */}
      <div className="pointer-events-none absolute inset-x-0 top-0 z-20">
        <div className="pointer-events-auto m-2 grid grid-cols-3 border border-border bg-background/95 shadow backdrop-blur-sm">
          <div className="border-r border-border px-3 py-2">
            <div className="font-mono text-[9px] uppercase tracking-[0.18em] text-muted-foreground">
              View
            </div>
            <div className="font-mono text-xs">map.find</div>
          </div>
          <div className="border-r border-border px-3 py-2">
            <div className="font-mono text-[9px] uppercase tracking-[0.18em] text-muted-foreground">
              Radius
            </div>
            <div className="font-mono text-xs">3.0 km</div>
          </div>
          <div className="px-3 py-2 text-right">
            <div className="font-mono text-[9px] uppercase tracking-[0.18em] text-muted-foreground">
              Hits
            </div>
            <div className="font-mono text-xs">{MAP_RESULTS.length}</div>
          </div>
        </div>
        <div className="pointer-events-auto -mt-1 ml-2 overflow-x-auto">
          <div className="flex w-max gap-1.5 pb-1">
            {FILTER_CHIPS.map((f) => (
              <div
                key={f.id}
                className="whitespace-nowrap border border-border bg-background/95 px-2 py-0.5 font-mono text-[9px] uppercase tracking-[0.16em] shadow-sm backdrop-blur-sm"
              >
                <span className="text-muted-foreground">{f.label} =</span> {f.value}
              </div>
            ))}
          </div>
        </div>
      </div>

      <DraggableSheet
        peekHeight={290}
        expandedHeight={620}
        className="border-t border-border bg-background shadow-2xl"
        handle={
          <div className="flex items-center justify-between border-b border-border px-4 py-2">
            <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
              results.log
            </span>
            <span className="font-mono text-[10px] tracking-[0.3em] text-muted-foreground">═══</span>
          </div>
        }
      >
        <div className="grid grid-cols-[auto_1fr_auto_auto] gap-x-4 border-b border-border bg-secondary/40 px-4 py-2 font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
          <span>#</span>
          <span>name</span>
          <span>distance</span>
          <span>price</span>
        </div>
        <ul className="font-mono text-xs">
          {MAP_RESULTS.map((r, i) => (
            <li
              key={r.id}
              className="grid grid-cols-[auto_1fr_auto_auto] items-center gap-x-4 border-b border-border px-4 py-2.5"
            >
              <span className="text-muted-foreground">[{String(i + 1).padStart(2, '0')}]</span>
              <div className="flex min-w-0 items-center gap-2.5">
                <img
                  src={imageFor.thumb(r.id)}
                  alt=""
                  className="size-8 shrink-0 rounded-sm object-cover ring-1 ring-border"
                />
                <div className="min-w-0">
                  <div className="truncate">{r.name.toLowerCase()}</div>
                  <div className="truncate text-[10px] text-muted-foreground">{r.specialty}</div>
                </div>
              </div>
              <span className="text-muted-foreground">{r.distance}</span>
              <span>{r.priceFrom}</span>
            </li>
          ))}
        </ul>
      </DraggableSheet>
    </div>
  );
}
