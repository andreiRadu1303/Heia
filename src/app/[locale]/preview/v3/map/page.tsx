import { PreviewShell } from '@/components/preview-shell';
import { MapContent } from '@/components/preview-pages/map-content';

export default function Page() {
  return (
    <PreviewShell palette="cool-neutral" variant="v3" page="map">
      <MapContent displayFont="sans" />
    </PreviewShell>
  );
}
