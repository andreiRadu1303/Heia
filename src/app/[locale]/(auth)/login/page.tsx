import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';

import { PageShell } from '@/components/page-shell';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

export default async function LoginPage() {
  const t = await getTranslations('Auth');
  return (
    <PageShell>
      <div className="mx-auto w-full max-w-md">
        <Card>
          <CardHeader>
            <CardTitle>{t('loginTitle')}</CardTitle>
            <CardDescription>{t('loginSubtitle')}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="rounded-md border border-dashed bg-muted/40 p-3 text-xs text-muted-foreground">
              {t('stubNotice')}
            </p>
            <form className="space-y-3">
              <div className="space-y-1.5">
                <label htmlFor="email" className="text-sm font-medium">
                  {t('emailLabel')}
                </label>
                <Input id="email" type="email" placeholder={t('emailPlaceholder')} autoComplete="email" />
              </div>
              <div className="space-y-1.5">
                <label htmlFor="password" className="text-sm font-medium">
                  {t('passwordLabel')}
                </label>
                <Input id="password" type="password" placeholder={t('passwordPlaceholder')} autoComplete="current-password" />
              </div>
              <Button type="button" className="w-full" disabled>
                {t('loginSubmit')}
              </Button>
            </form>
            <p className="text-center text-sm text-muted-foreground">
              {t('noAccount')}{' '}
              <Link href="/signup" className="font-medium text-foreground underline-offset-4 hover:underline">
                {t('signupSubmit')}
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </PageShell>
  );
}
