import { redirect } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';
import { Star } from 'lucide-react';

import { createClient } from '@/lib/supabase/server';
import { Link } from '@/i18n/navigation';
import { AppTopBar } from '@/components/app/app-top-bar';
import { ClientNav } from '@/components/app/client-nav';
import { SaveStudioButton } from '@/components/app/save-studio-button';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { getSavedStudios } from '@/lib/saved-studios';
import { categoryById, img, formatLei } from '@/lib/app-mock-data';

export const dynamic = 'force-dynamic';

export default async function SavedPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect(`/${locale}/login?next=/${locale}/saved`);

  const studios = await getSavedStudios();

  return (
    <div className="min-h-dvh pb-24">
      <AppTopBar title="Saved" backHref="/dashboard" />

      <main className="container space-y-6 pt-6">
        {studios.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-start gap-3 py-8">
              <p className="text-muted-foreground">
                No saved studios yet. Tap the heart on a studio page to keep it here.
              </p>
              <Button asChild>
                <Link href="/dashboard">Find a studio</Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {studios.map((s) => {
              const thumb = s.heroUrl || (s.heroSeed ? img.square(s.heroSeed) : null);
              return (
                <div
                  key={s.id}
                  className="relative flex items-center gap-3 rounded-3xl bg-card p-3 ring-1 ring-border"
                >
                  <Link href={`/studio/${s.id}`} className="flex min-w-0 flex-1 items-center gap-3">
                    {thumb ? (
                      <img src={thumb} alt="" className="size-20 shrink-0 rounded-2xl object-cover" />
                    ) : (
                      <div
                        className="grid size-20 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-accent/30 to-secondary text-lg font-medium text-foreground/60"
                        aria-hidden
                      >
                        {s.name.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <div className="min-w-0 flex-1">
                      <div className="truncate font-medium">{s.name}</div>
                      <div className="truncate text-sm text-muted-foreground">
                        {s.tagline || categoryById(s.categoryId)?.name}
                      </div>
                      <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
                        <span className="inline-flex items-center gap-1">
                          <Star className="size-3 fill-current text-accent" />{' '}
                          {s.rating > 0 ? s.rating : 'New'}
                        </span>
                        {s.city ? (
                          <>
                            <span aria-hidden>·</span>
                            <span>{s.city}</span>
                          </>
                        ) : null}
                        {s.priceFromLei > 0 ? (
                          <>
                            <span aria-hidden>·</span>
                            <span>{formatLei(s.priceFromLei)}+</span>
                          </>
                        ) : null}
                      </div>
                    </div>
                  </Link>
                  <SaveStudioButton slug={s.id} locale={locale} initialSaved signedIn />
                </div>
              );
            })}
          </div>
        )}
      </main>

      <ClientNav />
    </div>
  );
}
