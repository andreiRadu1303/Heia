import { Star } from 'lucide-react';

import { cn } from '@/lib/utils';

/**
 * Read-only star rating. Supports fractional fill via a clipped overlay.
 */
export function Stars({
  value,
  size = 'sm',
  className,
}: {
  value: number;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}) {
  const px = size === 'lg' ? 'size-5' : size === 'md' ? 'size-4' : 'size-3.5';
  const pct = Math.max(0, Math.min(100, (value / 5) * 100));

  return (
    <span
      className={cn('relative inline-flex', className)}
      role="img"
      aria-label={`${value.toFixed(1)} out of 5`}
    >
      {/* Empty track */}
      <span className="inline-flex text-muted-foreground/40">
        {[0, 1, 2, 3, 4].map((i) => (
          <Star key={i} className={px} />
        ))}
      </span>
      {/* Filled overlay, clipped to the value */}
      <span
        className="absolute inset-0 inline-flex overflow-hidden text-accent"
        style={{ width: `${pct}%` }}
        aria-hidden
      >
        {[0, 1, 2, 3, 4].map((i) => (
          <Star key={i} className={cn(px, 'shrink-0 fill-current')} />
        ))}
      </span>
    </span>
  );
}
