import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { Button } from '@/components/ui/button';
import { PageShell } from '@/components/page-shell';

export default async function NotFound() {
  const t = await getTranslations('NotFound');
  return (
    <PageShell>
      <div className="flex flex-col items-start gap-6 py-16">
        <div className="font-mono text-xs uppercase tracking-widest text-muted-foreground">404</div>
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">{t('title')}</h1>
        <p className="max-w-prose text-muted-foreground">{t('body')}</p>
        <Button asChild>
          <Link href="/">{t('backHome')}</Link>
        </Button>
      </div>
    </PageShell>
  );
}
