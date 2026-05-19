import { getTranslations, setRequestLocale } from 'next-intl/server';

import { Link } from '@/i18n/navigation';
import { PageShell } from '@/components/page-shell';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { SignupForm } from './signup-form';

export default async function SignupPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('Auth');
  return (
    <PageShell>
      <div className="mx-auto w-full max-w-md">
        <Card>
          <CardHeader>
            <CardTitle>{t('signupTitle')}</CardTitle>
            <CardDescription>{t('signupSubtitle')}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <SignupForm locale={locale} />
            <p className="text-center text-sm text-muted-foreground">
              {t('haveAccount')}{' '}
              <Link
                href="/login"
                className="font-medium text-foreground underline-offset-4 hover:underline"
              >
                {t('loginSubmit')}
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </PageShell>
  );
}
