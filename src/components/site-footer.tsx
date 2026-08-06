import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';

export async function SiteFooter() {
  const t = await getTranslations('Footer');
  const tMeta = await getTranslations('Meta');
  return (
    <footer className="border-t bg-muted/30">
      <div className="container flex flex-col items-start gap-4 py-10 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="font-medium text-foreground">{tMeta('siteName')}</div>
          <div className="text-xs uppercase tracking-widest">{t('phase')}</div>
        </div>
        <div className="flex gap-4">
          <Link href="/terms" className="hover:text-foreground">
            {t('terms')}
          </Link>
          <Link href="/privacy" className="hover:text-foreground">
            {t('privacy')}
          </Link>
        </div>
      </div>
    </footer>
  );
}
