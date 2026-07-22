import { setRequestLocale } from 'next-intl/server';
import { ExternalLink } from 'lucide-react';

import { Link } from '@/i18n/navigation';
import { getMyStudio } from '@/lib/provider-studio';
import { StudioMediaEditor } from '@/components/media/studio-media';
import { ProfileForm } from './profile-form';

export const dynamic = 'force-dynamic';

export default async function ProviderProfilePage({
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
          <h1 className="text-3xl font-medium tracking-tight sm:text-4xl">Studio profile</h1>
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
