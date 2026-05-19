import { getTranslations } from 'next-intl/server';
import { PageShell } from '@/components/page-shell';
import { StubPage } from './_stub';

export default async function BrowsePage() {
  const t = await getTranslations('Stub');
  return (
    <PageShell>
      <StubPage title={t('browseTitle')} subtitle={t('browseSubtitle')} eyebrow={t('comingSoon')} />
    </PageShell>
  );
}
