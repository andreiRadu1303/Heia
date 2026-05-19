import { PreviewShell } from '@/components/preview-shell';
import { PreferencesContent } from '@/components/preview-pages/preferences-content';

export default function Page() {
  return (
    <PreviewShell palette="soft-black" variant="v2" page="preferences">
      <PreferencesContent displayFont="display" />
    </PreviewShell>
  );
}
