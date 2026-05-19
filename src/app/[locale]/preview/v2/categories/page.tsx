import { PreviewShell } from '@/components/preview-shell';
import { CategoriesContent } from '@/components/preview-pages/categories-content';

export default function Page() {
  return (
    <PreviewShell palette="soft-black" variant="v2" page="categories">
      <CategoriesContent displayFont="display" />
    </PreviewShell>
  );
}
