import { PreviewShell } from '@/components/preview-shell';
import { MapContent } from '@/components/preview-pages/map-content';

export default function Page() {
  return (
    <PreviewShell palette="soft-black" variant="v2" page="map">
      <MapContent displayFont="display" />
    </PreviewShell>
  );
}
