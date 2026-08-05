import { getTranslations, setRequestLocale } from 'next-intl/server';

import { Link } from '@/i18n/navigation';
import { PageShell } from '@/components/page-shell';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { LoginForm } from './login-form';

export default async function LoginPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ next?: string; error?: string }>;
}) {
  const { locale } = await params;
  const { next, error } = await searchParams;
  setRequestLocale(locale);
  const t = await getTranslations('Auth');
  // Only forward a same-site relative next through to the form.
  const safeNext =
    next && next.startsWith('/') && !next.startsWith('//') && !next.includes('://')
      ? next
      : undefined;
  return (
    <PageShell>
      <div className="mx-auto w-full max-w-md">
        <Card>
          <CardHeader>
            <CardTitle>{t('loginTitle')}</CardTitle>
            <CardDescription>{t('loginSubtitle')}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {error === 'invalid_link' ? (
              <div
                role="alert"
                className="rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive"
              >
                {t('errorInvalidLink')}
              </div>
            ) : null}
            <LoginForm locale={locale} next={safeNext} />
            <p className="text-center text-sm text-muted-foreground">
              {t('noAccount')}{' '}
              <Link
                href="/signup"
                className="font-medium text-foreground underline-offset-4 hover:underline"
              >
                {t('signupSubmit')}
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </PageShell>
  );
}
