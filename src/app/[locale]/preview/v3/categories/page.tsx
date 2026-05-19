import { PreviewShell } from '@/components/preview-shell';
import { CategoriesContent } from '@/components/preview-pages/categories-content';

export default function Page() {
  return (
    <PreviewShell palette="cool-neutral" variant="v3" page="categories">
      <CategoriesContent displayFont="sans" />
    </PreviewShell>
  );
}
