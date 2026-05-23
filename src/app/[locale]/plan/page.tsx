import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';

import { PlanDoc } from '@/components/plan/plan-doc';

// Internal document — keep it out of search results.
export const metadata: Metadata = {
  title: 'Master plan',
  robots: { index: false, follow: false },
};

export default async function PlanPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <PlanDoc />;
}
