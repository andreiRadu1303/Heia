import { redirect } from 'next/navigation';
import { getTranslations, setRequestLocale } from 'next-intl/server';

import { createClient } from '@/lib/supabase/server';
import { PageShell } from '@/components/page-shell';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { logoutAction } from './actions';

export default async function DashboardPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect(`/${locale}/login`);
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('display_name, locale, marketing_consent, created_at')
    .eq('id', user.id)
    .maybeSingle();

  const t = await getTranslations('Stub');
  const displayName = profile?.display_name ?? user.email ?? 'there';

  return (
    <PageShell>
      <div className="flex flex-col gap-8">
        <div>
          <div className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
            {t('comingSoon')}
          </div>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
            Hi, {displayName}.
          </h1>
          <p className="mt-3 max-w-prose text-muted-foreground">{t('dashboardSubtitle')}</p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <Card>
            <CardHeader>
              <CardDescription>Account</CardDescription>
              <CardTitle className="text-lg">{user.email}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <Row label="Display name" value={profile?.display_name ?? '—'} />
              <Row label="Locale" value={profile?.locale ?? locale} />
              <Row
                label="Marketing updates"
                value={profile?.marketing_consent ? 'Subscribed' : 'Off'}
              />
              <Row
                label="Member since"
                value={
                  profile?.created_at
                    ? new Date(profile.created_at).toLocaleDateString(locale)
                    : '—'
                }
              />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardDescription>Session</CardDescription>
              <CardTitle className="text-lg">Signed in</CardTitle>
            </CardHeader>
            <CardContent>
              <form action={logoutAction}>
                <input type="hidden" name="locale" value={locale} />
                <Button type="submit" variant="outline" className="w-full">
                  Sign out
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </PageShell>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-3 border-b border-border/60 pb-1.5 last:border-b-0">
      <span className="text-muted-foreground">{label}</span>
      <span className="truncate font-medium">{value}</span>
    </div>
  );
}
