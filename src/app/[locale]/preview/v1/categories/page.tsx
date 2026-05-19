import { PreviewShell } from '@/components/preview-shell';
import { CategoriesContent } from '@/components/preview-pages/categories-content';

export default function Page() {
  return (
    <PreviewShell palette="warm-premium" variant="v1" page="categories">
      <CategoriesContent displayFont="display" />
    </PreviewShell>
  );
}
