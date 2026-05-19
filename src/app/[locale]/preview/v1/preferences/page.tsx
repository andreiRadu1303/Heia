import { PreviewShell } from '@/components/preview-shell';
import { PreferencesContent } from '@/components/preview-pages/preferences-content';

export default function Page() {
  return (
    <PreviewShell palette="warm-premium" variant="v1" page="preferences">
      <PreferencesContent displayFont="display" />
    </PreviewShell>
  );
}
