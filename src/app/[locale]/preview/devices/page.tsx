import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Link as IntlLink } from '@/i18n/navigation';

type PageKey = 'landing' | 'categories' | 'map' | 'preferences';

const PAGES: { key: PageKey; slug: string; label: string }[] = [
  { key: 'landing', slug: '', label: 'Landing' },
  { key: 'categories', slug: '/categories', label: 'Categories' },
  { key: 'map', slug: '/map', label: 'Map' },
  { key: 'preferences', slug: '/preferences', label: 'Preferences' },
];

const VARIANTS = [
  { slug: 'v1', label: 'v1 · Warm Premium' },
  { slug: 'v2', label: 'v2 · Soft Black' },
  { slug: 'v3', label: 'v3 · Cool Neutral' },
];

function isPageKey(v: string | undefined): v is PageKey {
  return v === 'landing' || v === 'categories' || v === 'map' || v === 'preferences';
}

export default async function DevicesPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ page?: string }>;
}) {
  const { locale } = await params;
  const sp = await searchParams;
  const currentPage: PageKey = isPageKey(sp.page) ? sp.page : 'landing';
  const currentSlug = PAGES.find((p) => p.key === currentPage)?.slug ?? '';

  return (
    <div className="min-h-dvh bg-background text-foreground" data-palette="cool-neutral">
      {/* Switcher chrome */}
      <header className="sticky top-0 z-50 border-b border-border bg-background/90 backdrop-blur">
        <div className="container space-y-2 py-3">
          <div className="flex items-center justify-between gap-3">
            <IntlLink
              href="/preview"
              className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground hover:text-foreground"
            >
              ← back to preview index
            </IntlLink>
            <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
              Mobile preview · 390 × 700
            </div>
          </div>
          <nav className="flex items-center gap-1 overflow-x-auto">
            {PAGES.map((p) => (
              <Link
                key={p.key}
                href={p.key === 'landing' ? '?' : `?page=${p.key}`}
                scroll={false}
                className={cn(
                  'whitespace-nowrap rounded-md px-3 py-1.5 text-sm transition-colors',
                  currentPage === p.key
                    ? 'bg-foreground text-background'
                    : 'text-muted-foreground hover:bg-secondary',
                )}
              >
                {p.label}
              </Link>
            ))}
          </nav>
        </div>
      </header>

      <main className="container py-10">
        <div className="mb-10 max-w-2xl">
          <div className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
            Mobile preview
          </div>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
            All three variants, side by side.
          </h1>
          <p className="mt-3 text-muted-foreground">
            Each frame is a real, live iframe of the variant at a phone-sized viewport (390 × 700). Click into a
            frame to interact; click a switcher inside an iframe to flip variants there too. Use the tabs above
            to change which page is shown across all three frames.
          </p>
          <p className="mt-3 text-sm text-muted-foreground">
            Tip: Chrome / Safari DevTools also have a built-in device toolbar (
            <span className="font-mono text-xs">⌘⌥M</span>) that you can use on any of the preview pages
            directly. This route is here for quick side-by-side comparison.
          </p>
        </div>

        <div className="grid gap-8 [grid-template-columns:repeat(auto-fit,minmax(360px,1fr))]">
          {VARIANTS.map((v) => (
            <div key={v.slug} className="flex flex-col gap-3">
              <div className="flex items-baseline justify-between">
                <div className="text-sm font-medium">{v.label}</div>
                <IntlLink
                  href={`/preview/${v.slug}${currentSlug}`}
                  className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground hover:text-foreground"
                >
                  open full →
                </IntlLink>
              </div>
              <div className="mx-auto w-full max-w-[412px] rounded-[36px] border-[10px] border-foreground/85 bg-foreground/85 p-0 shadow-2xl">
                <div className="overflow-hidden rounded-[26px] bg-background">
                  <iframe
                    src={`/${locale}/preview/${v.slug}${currentSlug}`}
                    title={`${v.label} — ${currentPage}`}
                    loading="lazy"
                    width={390}
                    height={700}
                    style={{ width: '100%', height: 700, border: 0, display: 'block' }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
