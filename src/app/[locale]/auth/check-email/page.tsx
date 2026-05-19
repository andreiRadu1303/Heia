import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Mail } from 'lucide-react';

import { Link } from '@/i18n/navigation';
import { PageShell } from '@/components/page-shell';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default async function CheckEmailPage({
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
          <CardHeader className="items-center text-center">
            <div className="grid size-12 place-items-center rounded-full bg-secondary text-foreground">
              <Mail className="size-5" />
            </div>
            <CardTitle className="pt-2">{t('checkEmailTitle')}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-5 text-center">
            <p className="text-sm text-muted-foreground">{t('checkEmailBody')}</p>
            <Button variant="outline" asChild className="w-full">
              <Link href="/">{t('checkEmailBackHome')}</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </PageShell>
  );
}
