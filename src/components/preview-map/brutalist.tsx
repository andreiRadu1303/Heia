'use client';

import { MAP_RESULTS, imageFor } from '@/lib/preview-mock-data';
import { MapBase } from './_map-base';
import { DraggableSheet } from './_draggable-sheet';

/**
 * BRUTALIST — Google Map under a hard black top bar and UPPERCASE
 * filter blocks. Sheet has a 2px black border, thick UPPERCASE
 * drag handle, and hard-bordered result rows.
 */
export function BrutalistMap() {
  return (
    <div className="relative h-dvh overflow-hidden [&_*]:rounded-none">
      <MapBase
        className="absolute inset-0"
        renderPin={(r, i) => (
          <div
            className={`-translate-y-2 border-[2px] border-foreground px-2 py-0.5 font-mono text-[10px] font-bold shadow ${
              i === 0 ? 'bg-foreground text-background' : 'bg-background text-foreground'
            }`}
          >
            {r.priceFrom}
          </div>
        )}
      />

      {/* Floating top: hard bar + filter blocks */}
      <div className="pointer-events-none absolute inset-x-0 top-0 z-20">
        <div className="pointer-events-auto border-b-[2px] border-foreground bg-foreground text-background">
          <div className="grid grid-cols-[1fr_auto]">
            <div className="px-4 py-2.5 font-mono text-xs uppercase tracking-[0.18em]">
              Map / Find
            </div>
            <div className="border-l-[2px] border-background/30 px-4 py-2.5 font-mono text-xs uppercase tracking-[0.18em]">
              {MAP_RESULTS.length} hits
            </div>
          </div>
        </div>
        <div className="pointer-events-auto grid grid-cols-3 border-b-[2px] border-foreground bg-background">
          {['HAIR', 'SOFT GLAM', '3 KM'].map((f, i) => (
            <div
              key={f}
              className={`px-3 py-2.5 text-center font-mono text-[10px] uppercase tracking-[0.2em] ${
                i === 0
                  ? 'bg-foreground text-background'
                  : 'border-l-[2px] border-foreground bg-background text-foreground'
              }`}
            >
              {f}
            </div>
          ))}
        </div>
      </div>

      <DraggableSheet
        peekHeight={300}
        expandedHeight={620}
        className="border-t-[2px] border-foreground bg-background"
        handle={
          <div className="grid grid-cols-[1fr_auto] items-stretch border-b-[2px] border-foreground bg-foreground text-background">
            <div className="px-5 py-3 font-mono text-xs uppercase tracking-[0.18em]">
              Results / {MAP_RESULTS.length}
            </div>
            <div className="border-l-[2px] border-background/30 px-5 py-3 font-mono text-xs uppercase tracking-[0.18em]">
              ▲▼ drag
            </div>
          </div>
        }
      >
        <ul>
          {MAP_RESULTS.map((r, i) => (
            <li
              key={r.id}
              className="grid grid-cols-[auto_auto_1fr_auto] items-center gap-3 border-b-[2px] border-foreground px-5 py-3"
            >
              <div className="grid size-9 place-items-center bg-foreground font-mono text-xs font-black text-background">
                {String(i + 1).padStart(2, '0')}
              </div>
              <img
                src={imageFor.thumb(r.id)}
                alt=""
                className="size-12 object-cover ring-[2px] ring-foreground"
              />
              <div className="min-w-0">
                <div className="truncate text-base font-bold uppercase leading-tight tracking-[-0.02em]">
                  {r.name}
                </div>
                <div className="truncate font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                  {r.distance} · ★ {r.rating}
                </div>
              </div>
              <div className="font-mono text-sm font-black">{r.priceFrom}</div>
            </li>
          ))}
        </ul>
      </DraggableSheet>
    </div>
  );
}
