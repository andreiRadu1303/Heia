import { getTranslations } from 'next-intl/server';
import { PageShell } from '@/components/page-shell';
import { Card, CardContent } from '@/components/ui/card';

export default async function MessagesPage() {
  const t = await getTranslations('Stub');
  return (
    <PageShell>
      <div className="flex flex-col gap-8">
        <div>
          <div className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
            {t('comingSoon')}
          </div>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">{t('messagesTitle')}</h1>
          <p className="mt-3 max-w-prose text-muted-foreground">{t('messagesSubtitle')}</p>
        </div>
        <Card>
          <CardContent className="grid divide-y p-0 sm:grid-cols-[260px_1fr] sm:divide-x sm:divide-y-0">
            <div className="p-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex items-center gap-3 rounded-md p-3 hover:bg-muted/40">
                  <div className="size-9 rounded-full bg-muted" aria-hidden />
                  <div className="flex-1 space-y-1.5">
                    <div className="h-2 w-2/3 rounded bg-muted" />
                    <div className="h-2 w-1/2 rounded bg-muted" />
                  </div>
                </div>
              ))}
            </div>
            <div className="flex min-h-[300px] items-center justify-center p-6 text-sm text-muted-foreground">
              —
            </div>
          </CardContent>
        </Card>
      </div>
    </PageShell>
  );
}
