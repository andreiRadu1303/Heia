import { Link } from '@/i18n/navigation';
import { cn } from '@/lib/utils';
import type { Variant, PreviewPage } from '@/lib/preview-mock-data';

const VARIANTS: { slug: Variant; label: string }[] = [
  { slug: 'v1', label: 'Warm' },
  { slug: 'v2', label: 'Black' },
  { slug: 'v3', label: 'Cool' },
];

const PAGES: { key: PreviewPage; slug: string; label: string }[] = [
  { key: 'landing', slug: '', label: 'Landing' },
  { key: 'categories', slug: '/categories', label: 'Categories' },
  { key: 'map', slug: '/map', label: 'Map' },
  { key: 'preferences', slug: '/preferences', label: 'Preferences' },
];

/**
 * Slim, mobile-friendly preview switcher.
 *
 * One row on small screens, content compact. Sticky to the top of the
 * viewport. Designed to take ≤ 44px so the preview pages get the rest.
 */
export function PreviewSwitcher({
  currentVariant,
  currentPage,
}: {
  currentVariant: Variant;
  currentPage: PreviewPage;
}) {
  const currentPageSlug = PAGES.find((p) => p.key === currentPage)?.slug ?? '';

  return (
    <div className="sticky top-0 z-50 border-b border-border/60 bg-background/85 backdrop-blur">
      <div className="flex h-11 items-center gap-2 overflow-x-auto px-3 sm:px-5">
        <Link
          href="/"
          className="whitespace-nowrap font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground hover:text-foreground"
          aria-label="Back to home"
        >
          ←
        </Link>
        <div className="mx-1 h-4 w-px shrink-0 bg-border" aria-hidden />
        {/* Page selector */}
        <nav className="flex items-center gap-0.5">
          {PAGES.map((p) => (
            <Link
              key={p.key}
              href={`/preview/${currentVariant}${p.slug}`}
              className={cn(
                'whitespace-nowrap rounded-md px-2 py-1 text-xs transition-colors',
                currentPage === p.key
                  ? 'bg-foreground text-background'
                  : 'text-muted-foreground hover:bg-secondary',
              )}
            >
              {p.label}
            </Link>
          ))}
        </nav>
        <div className="mx-1 h-4 w-px shrink-0 bg-border" aria-hidden />
        {/* Variant selector */}
        <nav className="flex items-center gap-0.5">
          {VARIANTS.map((v) => (
            <Link
              key={v.slug}
              href={`/preview/${v.slug}${currentPageSlug}`}
              className={cn(
                'whitespace-nowrap rounded-md px-2 py-1 font-mono text-[10px] uppercase tracking-[0.18em] transition-colors',
                currentVariant === v.slug
                  ? 'border border-foreground/40 bg-secondary text-foreground'
                  : 'border border-transparent text-muted-foreground hover:bg-secondary',
              )}
            >
              {v.slug}·{v.label}
            </Link>
          ))}
        </nav>
        <div className="ml-auto flex shrink-0 items-center">
          <Link
            href="/preview/devices"
            className="whitespace-nowrap font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground hover:text-foreground"
          >
            mobile →
          </Link>
        </div>
      </div>
    </div>
  );
}
