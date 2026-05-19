import { getTranslations } from 'next-intl/server';
import { PageShell } from '@/components/page-shell';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default async function ListingDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const t = await getTranslations('Stub');
  return (
    <PageShell>
      <div className="flex flex-col gap-8">
        <div>
          <div className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
            {t('comingSoon')} · #{id}
          </div>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">{t('listingTitle')}</h1>
          <p className="mt-3 max-w-prose text-muted-foreground">{t('listingSubtitle')}</p>
        </div>
        <div className="grid gap-8 lg:grid-cols-[2fr_1fr]">
          <div className="aspect-video w-full rounded-lg bg-muted" aria-hidden />
          <Card>
            <CardHeader>
              <CardTitle>—</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="h-2 w-3/4 rounded bg-muted" />
              <div className="h-2 w-1/2 rounded bg-muted" />
              <div className="h-2 w-5/6 rounded bg-muted" />
              <Button className="w-full" disabled>
                —
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </PageShell>
  );
}
