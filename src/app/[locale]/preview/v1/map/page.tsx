import { PreviewShell } from '@/components/preview-shell';
import { MapContent } from '@/components/preview-pages/map-content';

export default function Page() {
  return (
    <PreviewShell palette="warm-premium" variant="v1" page="map">
      <MapContent displayFont="display" />
    </PreviewShell>
  );
}
