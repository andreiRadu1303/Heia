import { getTranslations, setRequestLocale } from 'next-intl/server';
import { CalendarHeart, Sparkles, ArrowRight } from 'lucide-react';

import { Link } from '@/i18n/navigation';
import { PageShell } from '@/components/page-shell';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { SignupForm } from './signup-form';

type Role = 'client' | 'provider';

function parseRole(value: string | string[] | undefined): Role | null {
  if (value === 'provider' || value === 'client') return value;
  return null;
}

export default async function SignupPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ role?: string | string[] }>;
}) {
  const { locale } = await params;
  const { role: roleParam } = await searchParams;
  setRequestLocale(locale);
  const t = await getTranslations('Auth');

  const role = parseRole(roleParam);

  // ---- Gateway: no role chosen yet → show the Client / Expert choice ----
  if (!role) {
    return (
      <PageShell>
        <div className="mx-auto w-full max-w-lg">
          <div className="mb-8 text-center">
            <h1 className="text-2xl font-medium tracking-tight sm:text-3xl">{t('chooseTitle')}</h1>
            <p className="mt-2 text-sm text-muted-foreground">{t('chooseSubtitle')}</p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <ChoiceCard
              href={{ pathname: '/signup', query: { role: 'client' } }}
              icon={<CalendarHeart className="size-6" />}
              title={t('chooseClientTitle')}
              desc={t('chooseClientDesc')}
              cta={t('chooseCta')}
            />
            <ChoiceCard
              href={{ pathname: '/signup', query: { role: 'provider' } }}
              icon={<Sparkles className="size-6" />}
              title={t('chooseProviderTitle')}
              desc={t('chooseProviderDesc')}
              cta={t('chooseCta')}
              accent
            />
          </div>

          <p className="mt-8 text-center text-sm text-muted-foreground">
            {t('haveAccount')}{' '}
            <Link
              href="/login"
              className="font-medium text-foreground underline-offset-4 hover:underline"
            >
              {t('loginSubmit')}
            </Link>
          </p>
        </div>
      </PageShell>
    );
  }

  // ---- Role chosen → tailored signup form ----
  const title = role === 'provider' ? t('signupProviderTitle') : t('signupClientTitle');
  const subtitle = role === 'provider' ? t('signupProviderSubtitle') : t('signupClientSubtitle');

  return (
    <PageShell>
      <div className="mx-auto w-full max-w-md">
        <Card>
          <CardHeader>
            <CardTitle>{title}</CardTitle>
            <CardDescription>{subtitle}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <SignupForm locale={locale} role={role} />

            <p className="text-center text-sm">
              <Link
                href="/signup"
                className="text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
              >
                {t('changeRole')}
              </Link>
            </p>

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

function ChoiceCard({
  href,
  icon,
  title,
  desc,
  cta,
  accent = false,
}: {
  href: React.ComponentProps<typeof Link>['href'];
  icon: React.ReactNode;
  title: string;
  desc: string;
  cta: string;
  accent?: boolean;
}) {
  return (
    <Link
      href={href}
      className="group flex flex-col rounded-2xl border border-border bg-card p-5 transition-colors hover:border-foreground hover:bg-secondary/40"
    >
      <span
        className={
          accent
            ? 'grid size-11 place-items-center rounded-full bg-foreground text-background'
            : 'grid size-11 place-items-center rounded-full bg-secondary text-foreground'
        }
      >
        {icon}
      </span>
      <span className="mt-4 text-base font-medium leading-tight">{title}</span>
      <span className="mt-1.5 text-sm text-muted-foreground">{desc}</span>
      <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-foreground">
        {cta}
        <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
      </span>
    </Link>
  );
}
