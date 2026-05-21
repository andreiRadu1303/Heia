import { setRequestLocale } from 'next-intl/server';

import { requireProvider } from '@/lib/auth-guards';

// Auth-gated: always run the guard per request, never statically cache.
export const dynamic = 'force-dynamic';
import { ProviderNav } from '@/components/app/provider-nav';

export default async function ProviderLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  // Gate the whole provider area to provider accounts.
  await requireProvider(locale);

  return (
    <div className="min-h-dvh pb-20">
      {children}
      <ProviderNav />
    </div>
  );
}
