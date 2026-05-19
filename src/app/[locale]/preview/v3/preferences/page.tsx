import { PreviewShell } from '@/components/preview-shell';
import { PreferencesContent } from '@/components/preview-pages/preferences-content';

export default function Page() {
  return (
    <PreviewShell palette="cool-neutral" variant="v3" page="preferences">
      <PreferencesContent displayFont="sans" />
    </PreviewShell>
  );
}
