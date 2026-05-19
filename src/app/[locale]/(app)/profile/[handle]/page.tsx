import { getTranslations } from 'next-intl/server';
import { PageShell } from '@/components/page-shell';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default async function ProfilePage({
  params,
}: {
  params: Promise<{ handle: string }>;
}) {
  const { handle } = await params;
  const t = await getTranslations('Stub');
  return (
    <PageShell>
      <div className="flex flex-col gap-8">
        <div className="flex items-start gap-6">
          <div className="size-20 rounded-full bg-muted" aria-hidden />
          <div>
            <div className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
              {t('comingSoon')} · @{handle}
            </div>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">{t('profileTitle')}</h1>
            <p className="mt-3 max-w-prose text-muted-foreground">{t('profileSubtitle')}</p>
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i} className="overflow-hidden">
              <div className="aspect-square w-full bg-muted" aria-hidden />
              <CardHeader>
                <CardTitle className="text-base">—</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-2 w-2/3 rounded bg-muted" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </PageShell>
  );
}
