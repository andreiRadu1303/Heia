'use client';

import * as React from 'react';

import { cn } from '@/lib/utils';

export interface ChartPoint {
  label: string; // axis label, e.g. "Oct"
  fullLabel: string; // tooltip / table, e.g. "October 2026"
  value: number;
  /** Extra line for the tooltip, e.g. "2 completed". */
  detail?: string;
}

/**
 * Single-series column chart (last N months). Emphasis form: the current
 * month wears the accent, earlier months the de-emphasis grey. Thin columns,
 * rounded caps, hairline baseline, hover/focus tooltip, and a table view so
 * nothing is colour- or hover-gated.
 */
export function MonthlyChart({
  points,
  unit,
  ariaLabel,
}: {
  points: ChartPoint[];
  /** Unit suffix for values, e.g. "lei"; empty for plain counts. */
  unit?: string;
  ariaLabel: string;
}) {
  const [active, setActive] = React.useState<number | null>(null);
  const format = (v: number) => (unit ? `${v} ${unit}` : String(v));

  // Geometry (viewBox units; scales with the card width).
  const W = 320;
  const H = 120;
  const PAD_TOP = 18; // room for the cap label
  const AXIS_H = 18; // x-axis band
  const plotH = H - PAD_TOP - AXIS_H;
  const n = points.length;
  const band = W / n;
  const barW = Math.min(24, band * 0.5);
  const max = Math.max(1, ...points.map((p) => p.value));
  const maxIndex = points.reduce((best, p, i) => (p.value > points[best].value ? i : best), 0);
  const last = n - 1;

  const barY = (v: number) => PAD_TOP + plotH - (v / max) * plotH;

  /** Column path: square at the baseline, 4px-ish radius on the cap. */
  const column = (x: number, v: number) => {
    const top = barY(v);
    const h = PAD_TOP + plotH - top;
    if (h <= 0) return '';
    const r = Math.min(4, h / 2, barW / 2);
    return [
      `M${x},${PAD_TOP + plotH}`,
      `V${top + r}`,
      `Q${x},${top} ${x + r},${top}`,
      `H${x + barW - r}`,
      `Q${x + barW},${top} ${x + barW},${top + r}`,
      `V${PAD_TOP + plotH}`,
      'Z',
    ].join(' ');
  };

  const shown = active ?? last;
  const shownPoint = points[shown];

  return (
    <div className="space-y-2">
      <div className="relative">
        <svg
          viewBox={`0 0 ${W} ${H}`}
          role="img"
          aria-label={ariaLabel}
          className="block h-auto w-full"
          onMouseLeave={() => setActive(null)}
        >
          {/* Baseline (hairline, one step off the surface) */}
          <line
            x1={0}
            x2={W}
            y1={PAD_TOP + plotH}
            y2={PAD_TOP + plotH}
            className="stroke-border"
            strokeWidth={1}
          />

          {points.map((p, i) => {
            const x = i * band + (band - barW) / 2;
            const current = i === last;
            const isActive = active === i;
            // Selective labels: the current month and the maximum.
            const labelled = current || (i === maxIndex && p.value > 0 && maxIndex !== last);
            return (
              <g
                key={p.fullLabel}
                tabIndex={0}
                onMouseEnter={() => setActive(i)}
                onFocus={() => setActive(i)}
                onBlur={() => setActive(null)}
                className="cursor-default outline-none"
              >
                {/* Hit target: the whole band, taller than the mark. */}
                <rect x={i * band} y={0} width={band} height={H} fill="transparent" />
                <path
                  d={column(x, p.value)}
                  className={cn(
                    'transition-opacity',
                    current ? 'fill-accent' : 'fill-muted-foreground/40',
                    isActive && 'opacity-80',
                  )}
                />
                {p.value === 0 ? (
                  // Zero months still get a mark so the band isn't empty.
                  <rect
                    x={x}
                    y={PAD_TOP + plotH - 2}
                    width={barW}
                    height={2}
                    className={current ? 'fill-accent' : 'fill-muted-foreground/40'}
                  />
                ) : null}
                {labelled ? (
                  <text
                    x={x + barW / 2}
                    y={barY(p.value) - 5}
                    textAnchor="middle"
                    className="fill-foreground text-[10px] font-medium"
                  >
                    {format(p.value)}
                  </text>
                ) : null}
                <text
                  x={i * band + band / 2}
                  y={H - 4}
                  textAnchor="middle"
                  className={cn(
                    'text-[10px] capitalize',
                    current ? 'fill-foreground font-medium' : 'fill-muted-foreground',
                  )}
                >
                  {p.label}
                </text>
              </g>
            );
          })}
        </svg>

        {/* Tooltip — the value leads, the month follows. */}
        {active !== null ? (
          <div
            role="status"
            className="pointer-events-none absolute -top-1 whitespace-nowrap rounded-lg bg-foreground px-2.5 py-1.5 text-xs text-background shadow"
            style={{
              left: `${((active + 0.5) / n) * 100}%`,
              transform: 'translate(-50%, -100%)',
            }}
          >
            <div className="font-semibold">{format(shownPoint.value)}</div>
            <div className="capitalize opacity-80">{shownPoint.fullLabel}</div>
            {shownPoint.detail ? <div className="opacity-80">{shownPoint.detail}</div> : null}
          </div>
        ) : null}
      </div>

      {/* Table view — the WCAG twin; every value reachable without hover. */}
      <details className="text-xs text-muted-foreground">
        <summary className="cursor-pointer select-none underline-offset-4 hover:underline">
          View as table
        </summary>
        <table className="mt-2 w-full tabular-nums">
          <tbody>
            {points.map((p) => (
              <tr key={p.fullLabel} className="border-t border-border/60">
                <td className="py-1 capitalize">{p.fullLabel}</td>
                <td className="py-1 text-right text-foreground">{format(p.value)}</td>
                <td className="py-1 pl-3 text-right">{p.detail ?? ''}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </details>
    </div>
  );
}
