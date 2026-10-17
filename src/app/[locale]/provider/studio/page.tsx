import { setRequestLocale } from 'next-intl/server';
import { ExternalLink, LayoutTemplate, ChevronRight } from 'lucide-react';

import { Link } from '@/i18n/navigation';
import { getMyStudio } from '@/lib/provider-studio';
import { StudioMediaEditor } from '@/components/media/studio-media';
// The studio form still lives under ../profile/ for now — only the page moved.
import { ProfileForm } from '../profile/profile-form';

export const dynamic = 'force-dynamic';

/**
 * Studio — everything clients see: photos, details, location, services copy.
 * The expert's own account (name, email, password) lives under Profile.
 */
export default async function ProviderStudioPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const studio = await getMyStudio();

  return (
    <main className="container max-w-2xl space-y-6 pt-8">
      <header className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-3xl font-medium tracking-tight sm:text-4xl">Studio</h1>
          <p className="mt-2 text-muted-foreground">How clients see you on Heia.</p>
        </div>
        {studio ? (
          <Link
            href={`/studio/${studio.slug}`}
            target="_blank"
            className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-2 text-sm font-medium hover:bg-secondary"
          >
            <ExternalLink className="size-4" /> View as client
          </Link>
        ) : null}
      </header>

      {studio ? (
        <>
          {/* Shortcut to the mini-site designer — separate job, separate page. */}
          <Link
            href="/provider/site"
            className="flex items-center gap-3 rounded-2xl bg-card p-4 ring-1 ring-border transition-colors hover:bg-secondary/40"
          >
            <div
              className="grid size-10 shrink-0 place-items-center rounded-full text-accent"
              style={{ background: 'hsl(var(--accent) / 0.15)' }}
            >
              <LayoutTemplate className="size-5" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="font-medium">Customise your mini-site</div>
              <div className="text-sm text-muted-foreground">
                Pick a template, colours and sections for your public page.
              </div>
            </div>
            <ChevronRight className="size-5 shrink-0 text-muted-foreground" />
          </Link>

          <StudioMediaEditor
            locale={locale}
            initialAvatar={studio.avatar_url}
            initialCover={studio.cover_url}
            initialGallery={studio.gallery_urls}
          />
          <ProfileForm studio={studio} locale={locale} />
        </>
      ) : (
        <div className="rounded-2xl border border-dashed border-border bg-muted/40 px-4 py-6 text-sm text-muted-foreground">
          We couldn’t find a studio for your account. If you just signed up, try reloading. If this
          persists, your account may not be set up as a specialist.
        </div>
      )}
    </main>
  );
}
