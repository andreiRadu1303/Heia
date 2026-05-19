import { Link } from '@/i18n/navigation';
import { PageShell } from '@/components/page-shell';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';

const PAGES = [
  {
    key: 'landing',
    slug: '',
    title: 'Landing',
    description:
      'The pre-launch waitlist page. Hero, sub-head, three pillars, waitlist email. The variants differ in palette and layout treatment.',
  },
  {
    key: 'categories',
    slug: '/categories',
    title: 'Categories (post-login)',
    description:
      'What you see after signing in. Greeting bar, search, aesthetic chips, service grid, featured artists, recently viewed. Mobile-first, with a bottom tab bar on small screens.',
  },
  {
    key: 'map',
    slug: '/map',
    title: 'Map + filters',
    description:
      'Discovery on a map. Filter chips on top, CSS-mocked map with price-tag pins, scrolling result list. Two-column on desktop, stacked on mobile.',
  },
  {
    key: 'preferences',
    slug: '/preferences',
    title: 'Preferences (aesthetic picker)',
    description:
      'Onboarding step 2 of 3. Pick the aesthetics that match you. Eight cards, multi-select feel, sticky continue bar at the bottom.',
  },
];

const VARIANTS = [
  { slug: 'v1', label: 'v1 · Warm Premium' },
  { slug: 'v2', label: 'v2 · Soft Black' },
  { slug: 'v3', label: 'v3 · Cool Neutral' },
];

export default function PreviewIndexPage() {
  return (
    <PageShell>
      <div className="mx-auto flex max-w-4xl flex-col gap-10">
        <div>
          <div className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
            Design preview
          </div>
          <h1 className="mt-3 font-display text-4xl font-medium tracking-tight sm:text-5xl">
            All pages, all variants.
          </h1>
          <p className="mt-4 max-w-2xl text-muted-foreground">
            Four pages, three preset variants below, mobile-first throughout. For the full design playground
            with all 12 palettes and 6 styles mixable in real time, open{' '}
            <Link
              href="/preview/play"
              className="font-medium text-foreground underline-offset-4 hover:underline"
            >
              the picker
            </Link>
            . For a quick side-by-side of the three presets at phone size, open the{' '}
            <Link
              href="/preview/devices"
              className="font-medium text-foreground underline-offset-4 hover:underline"
            >
              mobile frames view
            </Link>
            .
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <Link
            href="/preview/play"
            className="group rounded-xl border bg-foreground p-6 text-background transition-opacity hover:opacity-95"
          >
            <div className="font-mono text-[10px] uppercase tracking-[0.22em] opacity-70">
              Recommended
            </div>
            <div className="mt-2 font-display text-2xl">Design picker →</div>
            <div className="mt-2 text-sm opacity-80">
              Mix 12 palettes × 6 styles in real time on a phone-sized frame.
            </div>
          </Link>
          <Link
            href="/preview/devices"
            className="group rounded-xl border bg-card p-6 transition-colors hover:bg-secondary/40"
          >
            <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
              Compare presets
            </div>
            <div className="mt-2 font-display text-2xl">Mobile frames →</div>
            <div className="mt-2 text-sm text-muted-foreground">
              Three preset variants side-by-side in phone frames.
            </div>
          </Link>
        </div>

        <div className="grid gap-4">
          {PAGES.map((p) => (
            <Card key={p.key}>
              <CardHeader>
                <CardTitle className="font-display text-2xl">{p.title}</CardTitle>
                <CardDescription>{p.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap items-center gap-2">
                  {VARIANTS.map((v) => (
                    <Link
                      key={v.slug}
                      href={`/preview/${v.slug}${p.slug}`}
                      className="inline-flex items-center gap-1.5 rounded-md border border-border bg-card px-3 py-1.5 text-sm transition-colors hover:bg-secondary"
                    >
                      <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                        {v.slug}
                      </span>
                      <span>{v.label.split(' · ')[1]}</span>
                    </Link>
                  ))}
                  <Link
                    href={`/preview/devices${p.key === 'landing' ? '' : `?page=${p.key}`}`}
                    className="inline-flex items-center gap-1.5 rounded-md bg-foreground px-3 py-1.5 text-sm text-background transition-opacity hover:opacity-90"
                  >
                    Compare on mobile →
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </PageShell>
  );
}
