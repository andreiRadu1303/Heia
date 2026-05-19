import { getTranslations } from 'next-intl/server';
import { PageShell } from '@/components/page-shell';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

export default async function DashboardPage() {
  const t = await getTranslations('Stub');
  return (
    <PageShell>
      <div className="flex flex-col gap-8">
        <div>
          <div className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
            {t('comingSoon')}
          </div>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">{t('dashboardTitle')}</h1>
          <p className="mt-3 max-w-prose text-muted-foreground">{t('dashboardSubtitle')}</p>
        </div>
        <div className="grid gap-4 sm:grid-cols-3">
          {['—', '—', '—'].map((label, i) => (
            <Card key={i}>
              <CardHeader>
                <CardDescription>{label}</CardDescription>
                <CardTitle className="text-3xl">—</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-2 w-1/2 rounded bg-muted" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </PageShell>
  );
}
