import { redirect } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';

import { getMyStudio } from '@/lib/provider-studio';
import { OnboardingWizard } from './onboarding-wizard';

export const dynamic = 'force-dynamic';

export default async function ProviderOnboardingPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const studio = await getMyStudio();
  if (!studio) {
    return (
      <main className="container max-w-lg pt-10">
        <div className="rounded-2xl border border-dashed border-border bg-muted/40 px-4 py-6 text-sm text-muted-foreground">
          We couldn’t find a studio for your account. If you just signed up, try reloading.
        </div>
      </main>
    );
  }

  // Already onboarded → straight to the dashboard.
  if (studio.onboarded_at) redirect(`/${locale}/provider`);

  return (
    <main className="container pt-10">
      <header className="mx-auto mb-8 w-full max-w-lg">
        <div className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
          Welcome to Heia
        </div>
        <h1 className="mt-2 text-3xl font-medium tracking-tight">Let’s set up your studio</h1>
      </header>
      <OnboardingWizard studio={studio} locale={locale} />
    </main>
  );
}
