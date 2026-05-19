import { EditorialLanding } from '@/components/preview-landings/editorial';
import { EngineeredLanding } from '@/components/preview-landings/engineered';
import { AtelierLanding } from '@/components/preview-landings/atelier';
import { BrutalistLanding } from '@/components/preview-landings/brutalist';
import { WellnessLanding } from '@/components/preview-landings/wellness';
import { GlassLanding } from '@/components/preview-landings/glass';

import { EditorialCategories } from '@/components/preview-categories/editorial';
import { EngineeredCategories } from '@/components/preview-categories/engineered';
import { AtelierCategories } from '@/components/preview-categories/atelier';
import { BrutalistCategories } from '@/components/preview-categories/brutalist';
import { WellnessCategories } from '@/components/preview-categories/wellness';
import { GlassCategories } from '@/components/preview-categories/glass';

import { EditorialMap } from '@/components/preview-map/editorial';
import { EngineeredMap } from '@/components/preview-map/engineered';
import { AtelierMap } from '@/components/preview-map/atelier';
import { BrutalistMap } from '@/components/preview-map/brutalist';
import { WellnessMap } from '@/components/preview-map/wellness';
import { GlassMap } from '@/components/preview-map/glass';

import { EditorialPreferences } from '@/components/preview-preferences/editorial';
import { EngineeredPreferences } from '@/components/preview-preferences/engineered';
import { AtelierPreferences } from '@/components/preview-preferences/atelier';
import { BrutalistPreferences } from '@/components/preview-preferences/brutalist';
import { WellnessPreferences } from '@/components/preview-preferences/wellness';
import { GlassPreferences } from '@/components/preview-preferences/glass';

import { PALETTES, STYLES, type PaletteId, type StyleId } from '@/lib/preview-mock-data';

const PALETTE_IDS = new Set<string>(PALETTES.map((p) => p.id));
const STYLE_IDS = new Set<string>(STYLES.map((s) => s.id));
const PAGES = new Set(['landing', 'categories', 'map', 'preferences']);

type PageKey = 'landing' | 'categories' | 'map' | 'preferences';
type ComponentFn = () => React.JSX.Element;

const COMPONENTS: Record<PageKey, Record<StyleId, ComponentFn>> = {
  landing: {
    editorial: EditorialLanding,
    'modern-geometric': EngineeredLanding,
    'boutique-classic': AtelierLanding,
    brutalist: BrutalistLanding,
    'soft-organic': WellnessLanding,
    'minimal-tech': GlassLanding,
  },
  categories: {
    editorial: EditorialCategories,
    'modern-geometric': EngineeredCategories,
    'boutique-classic': AtelierCategories,
    brutalist: BrutalistCategories,
    'soft-organic': WellnessCategories,
    'minimal-tech': GlassCategories,
  },
  map: {
    editorial: EditorialMap,
    'modern-geometric': EngineeredMap,
    'boutique-classic': AtelierMap,
    brutalist: BrutalistMap,
    'soft-organic': WellnessMap,
    'minimal-tech': GlassMap,
  },
  preferences: {
    editorial: EditorialPreferences,
    'modern-geometric': EngineeredPreferences,
    'boutique-classic': AtelierPreferences,
    brutalist: BrutalistPreferences,
    'soft-organic': WellnessPreferences,
    'minimal-tech': GlassPreferences,
  },
};

export default async function RenderPage({
  searchParams,
}: {
  searchParams: Promise<{ palette?: string; style?: string; page?: string }>;
}) {
  const sp = await searchParams;
  const palette: PaletteId = PALETTE_IDS.has(sp.palette ?? '')
    ? (sp.palette as PaletteId)
    : 'warm-premium';
  const style: StyleId = STYLE_IDS.has(sp.style ?? '') ? (sp.style as StyleId) : 'editorial';
  const page: PageKey = PAGES.has(sp.page ?? '') ? (sp.page as PageKey) : 'landing';

  const Component = COMPONENTS[page][style];

  return (
    <div
      data-palette={palette}
      data-style={style}
      className="min-h-dvh bg-background font-sans text-foreground"
    >
      <Component />
    </div>
  );
}
