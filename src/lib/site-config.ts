/**
 * Expert mini-site configuration.
 *
 * This is the single source of truth for how an expert's public page looks.
 * It is intentionally one serialisable object so that, when the backend lands,
 * it maps to a single `studios.site_config jsonb` column — new templates,
 * palettes, section types and variants can be added without a schema change.
 *
 * Layers, from coarse to fine:
 *   1. `template` — a named preset that seeds the theme + section list.
 *   2. `theme`    — palette / style / radius / density → CSS variables.
 *   3. `sections` — ordered, toggleable blocks with per-type variants.
 *
 * The renderer (`components/studio-site`) is pure: give it a `Studio` + a
 * `SiteConfig` and it draws the page. The builder and the (future) public
 * page share it.
 */

import {
  PALETTES,
  STYLES,
  type PaletteId,
  type StyleId,
} from '@/lib/preview-mock-data';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type SectionType =
  | 'hero'
  | 'about'
  | 'services'
  | 'gallery'
  | 'reviews'
  | 'hours'
  | 'cta';

export interface SiteSection {
  /** Stable key for React + reordering. */
  key: string;
  type: SectionType;
  enabled: boolean;
  /** Per-type layout variant (see SECTION_VARIANTS). */
  variant: string;
}

export type RadiusId = 'sharp' | 'soft' | 'round';
export type DensityId = 'compact' | 'cozy' | 'airy';

export interface ThemeConfig {
  palette: PaletteId;
  style: StyleId;
  radius: RadiusId;
  density: DensityId;
}

export interface SiteConfig {
  /** Schema version — lets us migrate stored configs safely later. */
  version: 1;
  template: TemplateId;
  theme: ThemeConfig;
  sections: SiteSection[];
}

// ---------------------------------------------------------------------------
// Section catalogue — labels, available variants, defaults
// ---------------------------------------------------------------------------

export const SECTION_META: Record<
  SectionType,
  { label: string; description: string; variants: { id: string; label: string }[] }
> = {
  hero: {
    label: 'Hero',
    description: 'The first thing clients see — your name, photo and tagline.',
    variants: [
      { id: 'photo', label: 'Full photo' },
      { id: 'split', label: 'Split' },
      { id: 'minimal', label: 'Type only' },
    ],
  },
  about: {
    label: 'About',
    description: 'A short bio and what you are known for.',
    variants: [{ id: 'default', label: 'Standard' }],
  },
  services: {
    label: 'Services',
    description: 'Your offerings with prices and durations.',
    variants: [
      { id: 'list', label: 'List' },
      { id: 'cards', label: 'Cards' },
    ],
  },
  gallery: {
    label: 'Gallery',
    description: 'Portfolio images — your work speaks.',
    variants: [
      { id: 'grid', label: 'Grid' },
      { id: 'strip', label: 'Wide strip' },
    ],
  },
  reviews: {
    label: 'Reviews',
    description: 'Rating summary and a few client quotes.',
    variants: [{ id: 'default', label: 'Standard' }],
  },
  hours: {
    label: 'Hours',
    description: 'When clients can book you.',
    variants: [{ id: 'default', label: 'Standard' }],
  },
  cta: {
    label: 'Booking call-to-action',
    description: 'A prominent button that sends clients to booking.',
    variants: [{ id: 'default', label: 'Standard' }],
  },
};

export const SECTION_ORDER: SectionType[] = [
  'hero',
  'about',
  'services',
  'gallery',
  'reviews',
  'hours',
  'cta',
];

function section(type: SectionType, enabled: boolean, variant?: string): SiteSection {
  return {
    key: type,
    type,
    enabled,
    variant: variant ?? SECTION_META[type].variants[0].id,
  };
}

// ---------------------------------------------------------------------------
// Theme scales
// ---------------------------------------------------------------------------

export const RADII: Record<RadiusId, { label: string; value: string }> = {
  sharp: { label: 'Sharp', value: '2px' },
  soft: { label: 'Soft', value: '14px' },
  round: { label: 'Round', value: '26px' },
};

export const DENSITIES: Record<
  DensityId,
  { label: string; section: string; gap: string }
> = {
  compact: { label: 'Compact', section: '2.5rem', gap: '0.75rem' },
  cozy: { label: 'Cozy', section: '4rem', gap: '1.25rem' },
  airy: { label: 'Airy', section: '6rem', gap: '2rem' },
};

/**
 * Per-style font + heading treatment. Fonts are already loaded globally as
 * CSS variables in the root layout, so we just reference them.
 */
export const STYLE_PRESETS: Record<
  StyleId,
  {
    displayFont: string;
    bodyFont: string;
    /** Tailwind utility classes applied to display headings. */
    headingClass: string;
    /** Tracking for small mono/eyebrow labels. */
    eyebrowClass: string;
  }
> = {
  editorial: {
    displayFont: 'var(--font-fraunces), Georgia, serif',
    bodyFont: 'var(--font-inter), system-ui, sans-serif',
    headingClass: 'italic font-medium tracking-tight',
    eyebrowClass: 'uppercase tracking-[0.28em]',
  },
  'modern-geometric': {
    displayFont: 'var(--font-manrope), system-ui, sans-serif',
    bodyFont: 'var(--font-manrope), system-ui, sans-serif',
    headingClass: 'font-extrabold tracking-tight',
    eyebrowClass: 'uppercase tracking-[0.2em] font-mono',
  },
  'boutique-classic': {
    displayFont: 'var(--font-playfair), Georgia, serif',
    bodyFont: 'var(--font-inter), system-ui, sans-serif',
    headingClass: 'font-semibold tracking-tight',
    eyebrowClass: 'uppercase tracking-[0.32em]',
  },
  brutalist: {
    displayFont: 'var(--font-inter), system-ui, sans-serif',
    bodyFont: 'var(--font-inter), system-ui, sans-serif',
    headingClass: 'font-black uppercase tracking-tight leading-[0.95]',
    eyebrowClass: 'uppercase tracking-[0.14em] font-bold',
  },
  'soft-organic': {
    displayFont: 'var(--font-dm-sans), system-ui, sans-serif',
    bodyFont: 'var(--font-dm-sans), system-ui, sans-serif',
    headingClass: 'font-semibold tracking-tight',
    eyebrowClass: 'uppercase tracking-[0.24em]',
  },
  'minimal-tech': {
    displayFont: 'var(--font-inter), system-ui, sans-serif',
    bodyFont: 'var(--font-inter), system-ui, sans-serif',
    headingClass: 'font-light tracking-tight',
    eyebrowClass: 'uppercase tracking-[0.26em]',
  },
};

// ---------------------------------------------------------------------------
// Palette → CSS variables
// ---------------------------------------------------------------------------

function relativeLuminance(hex: string): number {
  const h = hex.replace('#', '');
  const r = parseInt(h.slice(0, 2), 16) / 255;
  const g = parseInt(h.slice(2, 4), 16) / 255;
  const b = parseInt(h.slice(4, 6), 16) / 255;
  const lin = (c: number) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
  return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
}

/** Readable text colour to sit on top of a given background. */
function contrastText(hex: string): string {
  return relativeLuminance(hex) > 0.5 ? '#0B0B0B' : '#FFFFFF';
}

/**
 * Produces the CSS custom properties the renderer reads. Returned as a plain
 * style object so it can be spread onto the site wrapper.
 */
export function themeVars(theme: ThemeConfig): React.CSSProperties {
  const palette = PALETTES.find((p) => p.id === theme.palette) ?? PALETTES[0];
  const [bg, surface, accent, fg] = palette.swatches;
  const style = STYLE_PRESETS[theme.style];

  return {
    // Colours
    '--site-bg': bg,
    '--site-surface': surface,
    '--site-accent': accent,
    '--site-accent-fg': contrastText(accent),
    '--site-fg': fg,
    '--site-fg-muted': `color-mix(in srgb, ${fg} 60%, ${bg})`,
    '--site-border': `color-mix(in srgb, ${fg} 16%, ${bg})`,
    // Shape + rhythm
    '--site-radius': RADII[theme.radius].value,
    '--site-section-y': DENSITIES[theme.density].section,
    '--site-gap': DENSITIES[theme.density].gap,
    // Type
    '--site-display-font': style.displayFont,
    '--site-body-font': style.bodyFont,
  } as React.CSSProperties;
}

// ---------------------------------------------------------------------------
// Templates (presets)
// ---------------------------------------------------------------------------

export type TemplateId =
  | 'editorial-warm'
  | 'rose-boutique'
  | 'minimal-cool'
  | 'dark-luxe'
  | 'organic-sage'
  | 'bold-onyx';

export interface TemplateDef {
  id: TemplateId;
  name: string;
  description: string;
  theme: ThemeConfig;
  sections: SiteSection[];
}

function baseSections(heroVariant = 'photo'): SiteSection[] {
  return [
    section('hero', true, heroVariant),
    section('about', true),
    section('services', true),
    section('gallery', true),
    section('reviews', true),
    section('hours', false),
    section('cta', true),
  ];
}

export const TEMPLATES: TemplateDef[] = [
  {
    id: 'editorial-warm',
    name: 'Editorial Warm',
    description: 'Ivory & mocha, italic serif. Calm, feminine, magazine-like.',
    theme: { palette: 'warm-premium', style: 'editorial', radius: 'soft', density: 'airy' },
    sections: baseSections('photo'),
  },
  {
    id: 'rose-boutique',
    name: 'Rose Boutique',
    description: 'Dusty rose & wine, classic serif. Soft-glam salon feel.',
    theme: { palette: 'rose-atelier', style: 'boutique-classic', radius: 'round', density: 'cozy' },
    sections: baseSections('split'),
  },
  {
    id: 'minimal-cool',
    name: 'Minimal Cool',
    description: 'White, grey, jet black. Clean, understated, type-forward.',
    theme: { palette: 'cool-neutral', style: 'minimal-tech', radius: 'sharp', density: 'airy' },
    sections: baseSections('minimal'),
  },
  {
    id: 'dark-luxe',
    name: 'Dark Luxe',
    description: 'Warm dark with brass. Premium, editorial, high-contrast.',
    theme: { palette: 'soft-black', style: 'editorial', radius: 'soft', density: 'airy' },
    sections: baseSections('photo'),
  },
  {
    id: 'organic-sage',
    name: 'Organic Sage',
    description: 'Bone & sage green. Botanical, wellness, unhurried.',
    theme: { palette: 'sage-studio', style: 'soft-organic', radius: 'round', density: 'cozy' },
    sections: baseSections('split'),
  },
  {
    id: 'bold-onyx',
    name: 'Bold Onyx',
    description: 'Black with electric blue. Confident, modern, grid-driven.',
    theme: { palette: 'onyx-editorial', style: 'modern-geometric', radius: 'sharp', density: 'cozy' },
    sections: baseSections('split'),
  },
];

export function templateById(id: TemplateId): TemplateDef {
  return TEMPLATES.find((t) => t.id === id) ?? TEMPLATES[0];
}

// ---------------------------------------------------------------------------
// Defaults + helpers
// ---------------------------------------------------------------------------

export const DEFAULT_TEMPLATE: TemplateId = 'editorial-warm';

export function configFromTemplate(id: TemplateId): SiteConfig {
  const tpl = templateById(id);
  return {
    version: 1,
    template: id,
    theme: { ...tpl.theme },
    // Deep copy so edits don't mutate the preset.
    sections: tpl.sections.map((s) => ({ ...s })),
  };
}

export function defaultConfig(): SiteConfig {
  return configFromTemplate(DEFAULT_TEMPLATE);
}

/** Human labels used by the theme controls. */
export const PALETTE_OPTIONS = PALETTES.map((p) => ({
  id: p.id,
  name: p.name,
  mode: p.mode,
  swatches: p.swatches,
}));

export const STYLE_OPTIONS = STYLES.map((s) => ({
  id: s.id,
  name: s.name,
  description: s.description,
}));
