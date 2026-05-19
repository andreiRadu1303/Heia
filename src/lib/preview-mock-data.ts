/**
 * Mocked preview data — used by the /preview/* routes only.
 * None of this hits a database; it's all visual stand-in.
 *
 * Real-looking imagery is sourced from:
 *   - picsum.photos (random photographs, deterministic per seed)
 *   - i.pravatar.cc (AI-generated portrait avatars, deterministic per seed)
 */

export const imageFor = {
  /** Tall photographic image for category hero cards. */
  category: (id: string) => `https://picsum.photos/seed/cat-${id}/600/750`,
  /** Portrait avatar for an artist. */
  avatar: (id: string) => `https://i.pravatar.cc/300?u=${encodeURIComponent(id)}`,
  /** Larger editorial image for a featured artist. */
  artist: (id: string) => `https://picsum.photos/seed/art-${id}/800/1000`,
  /** Tall portrait for an aesthetic option. */
  aesthetic: (id: string) => `https://picsum.photos/seed/aes-${id}/600/800`,
  /** Square thumb for map result rows. */
  thumb: (id: string) => `https://picsum.photos/seed/m-${id}/300/300`,
};

export const AESTHETICS = [
  { id: 'soft-glam', name: 'Soft Glam', desc: 'Polished, luminous, never overdone.', color: '#E8B4A0' },
  { id: 'clean-girl', name: 'Clean Girl', desc: 'Minimal, dewy, effortless.', color: '#D9D2C6' },
  { id: 'old-money', name: 'Old Money', desc: 'Timeless. Quiet confidence.', color: '#A89D8A' },
  { id: 'natural-luxury', name: 'Natural Luxury', desc: 'Considered, understated, premium.', color: '#C9A86A' },
  { id: 'editorial-glam', name: 'Editorial Glam', desc: 'Magazine-ready, high impact.', color: '#7A4A3A' },
  { id: 'bridal-elegance', name: 'Bridal Elegance', desc: 'Romantic, timeless, photographable.', color: '#E5C9B1' },
  { id: 'dramatic-glam', name: 'Dramatic Glam', desc: 'Bold. Intentional. Statement.', color: '#3D332D' },
  { id: 'classy-feminine', name: 'Classy Feminine', desc: 'Soft strength.', color: '#D4A7A2' },
];

export const CATEGORIES = [
  { id: 'hair', name: 'Hair', count: 234, color: '#D9B677', dark: '#7A5A30' },
  { id: 'makeup', name: 'Makeup', count: 187, color: '#C9847A', dark: '#7A3A30' },
  { id: 'lashes', name: 'Lashes', count: 142, color: '#9F8F76', dark: '#544738' },
  { id: 'brows', name: 'Brows', count: 108, color: '#A89D8A', dark: '#5A4F3D' },
  { id: 'nails', name: 'Nails', count: 256, color: '#D4A7A2', dark: '#7A4A4A' },
  { id: 'tattoo', name: 'Tattoo', count: 64, color: '#3D332D', dark: '#1F1A14' },
];

export const FEATURED_ARTISTS = [
  { id: 'andra-c', name: 'Andra C.', city: 'Cluj-Napoca', specialty: 'Balayage expert', knownFor: 'Soft Glam', rating: 4.9, color: '#C9A86A' },
  { id: 'maria-b', name: 'Maria B.', city: 'București', specialty: 'Wedding makeup', knownFor: 'Bridal Elegance', rating: 4.95, color: '#E5C9B1' },
  { id: 'iulia-t', name: 'Iulia T.', city: 'Timișoara', specialty: 'Editorial nails', knownFor: 'Editorial Glam', rating: 4.8, color: '#D4A7A2' },
  { id: 'ana-p', name: 'Ana P.', city: 'Iași', specialty: 'Fine-line tattoo', knownFor: 'Natural Luxury', rating: 5.0, color: '#A89D8A' },
];

export const MAP_RESULTS = [
  { id: '1', name: 'Andra C.', specialty: 'Balayage · Soft Glam', rating: 4.9, distance: '0.8 km', priceFrom: '€60', x: 28, y: 42 },
  { id: '2', name: 'Maria B.', specialty: 'Makeup · Bridal', rating: 4.95, distance: '1.2 km', priceFrom: '€80', x: 56, y: 58 },
  { id: '3', name: 'Iulia T.', specialty: 'Nails · Editorial', rating: 4.8, distance: '1.5 km', priceFrom: '€45', x: 72, y: 34 },
  { id: '4', name: 'Ana P.', specialty: 'Tattoo · Fine-line', rating: 5.0, distance: '2.1 km', priceFrom: '€120', x: 24, y: 72 },
  { id: '5', name: 'Studio Nord', specialty: 'Full service salon', rating: 4.7, distance: '2.4 km', priceFrom: '€50', x: 62, y: 22 },
  { id: '6', name: 'Elena R.', specialty: 'Brows · Natural Lux', rating: 4.85, distance: '2.9 km', priceFrom: '€35', x: 44, y: 78 },
];

export const FILTER_CHIPS = [
  { id: 'cat', label: 'Category', value: 'Hair' },
  { id: 'aes', label: 'Aesthetic', value: 'Soft Glam' },
  { id: 'price', label: 'Price', value: '€40 – €120' },
  { id: 'rating', label: 'Rating', value: '4.5+' },
  { id: 'distance', label: 'Within', value: '3 km' },
];

/* ================================================================
 * Palette & style registries for /preview/play
 * ================================================================ */

export type PaletteMode = 'light' | 'dark';

export type PaletteId =
  | 'warm-premium'
  | 'rose-atelier'
  | 'terracotta-sun'
  | 'espresso-cream'
  | 'cool-neutral'
  | 'sage-studio'
  | 'coastal-mist'
  | 'lavender-haze'
  | 'soft-black'
  | 'midnight-garden'
  | 'forest-whisper'
  | 'onyx-editorial';

export type StyleId =
  | 'editorial'
  | 'modern-geometric'
  | 'boutique-classic'
  | 'brutalist'
  | 'soft-organic'
  | 'minimal-tech';

export interface PaletteDef {
  id: PaletteId;
  name: string;
  mode: PaletteMode;
  description: string;
  /** 4 swatches: background, surface/muted, accent, foreground. */
  swatches: [string, string, string, string];
  inspiration: string;
}

export const PALETTES: PaletteDef[] = [
  {
    id: 'warm-premium',
    name: 'Warm Premium',
    mode: 'light',
    description: 'Ivory, champagne, mocha. Calm and feminine.',
    swatches: ['#F8F4EC', '#EFE8DA', '#C9A86A', '#1F1A14'],
    inspiration: 'Aesop, Le Labo',
  },
  {
    id: 'rose-atelier',
    name: 'Rose Atelier',
    mode: 'light',
    description: 'Dusty rose, bone white, deep wine.',
    swatches: ['#FAF3F1', '#EEDFDB', '#C77878', '#3B1E20'],
    inspiration: 'Glossier, Charlotte Tilbury',
  },
  {
    id: 'terracotta-sun',
    name: 'Terracotta Sun',
    mode: 'light',
    description: 'Warm ivory, burnt terracotta, olive depth.',
    swatches: ['#F8F0E5', '#EDD9C2', '#B8623F', '#3A1F12'],
    inspiration: 'Mediterranean / boho-natural',
  },
  {
    id: 'espresso-cream',
    name: 'Espresso Cream',
    mode: 'light',
    description: 'Warm cream, caramel, deep espresso.',
    swatches: ['#F4EDE0', '#E2D8C5', '#A26538', '#241712'],
    inspiration: 'Rituals, café brand language',
  },
  {
    id: 'cool-neutral',
    name: 'Cool Neutral',
    mode: 'light',
    description: 'Pure whites, cool greys, jet black.',
    swatches: ['#FFFFFF', '#F4F4F5', '#18181B', '#09090B'],
    inspiration: 'shadcn / Linear / Notion',
  },
  {
    id: 'sage-studio',
    name: 'Sage Studio',
    mode: 'light',
    description: 'Bone, sage green, slate.',
    swatches: ['#F7F7F1', '#E3E5DA', '#7A8B6A', '#1E2620'],
    inspiration: 'Tata Harper, Scandi botanical',
  },
  {
    id: 'coastal-mist',
    name: 'Coastal Mist',
    mode: 'light',
    description: 'Pale seafoam, sand, slate-blue.',
    swatches: ['#F0F4F4', '#DAE4E5', '#5E8B8C', '#1E2A2E'],
    inspiration: 'La Mer, coastal luxury',
  },
  {
    id: 'lavender-haze',
    name: 'Lavender Haze',
    mode: 'light',
    description: 'Soft lilac, warm white, deep plum.',
    swatches: ['#F6F3F8', '#E5DEEE', '#9A87B5', '#2A1E33'],
    inspiration: 'Diptyque, modern fragrance',
  },
  {
    id: 'soft-black',
    name: 'Soft Black Luxury',
    mode: 'dark',
    description: 'Warm dark, cream text, brass accent.',
    swatches: ['#1A1614', '#332B27', '#D9B677', '#F4ECDD'],
    inspiration: 'Hermès, dark luxury editorial',
  },
  {
    id: 'midnight-garden',
    name: 'Midnight Garden',
    mode: 'dark',
    description: 'Deep navy, ivory, muted gold.',
    swatches: ['#0F1820', '#1B2A33', '#C5A668', '#F0EAD8'],
    inspiration: 'Le Labo Rose 31, midnight perfumery',
  },
  {
    id: 'forest-whisper',
    name: 'Forest Whisper',
    mode: 'dark',
    description: 'Deep forest, pale sage cream, moss.',
    swatches: ['#1A2218', '#28332C', '#7A9170', '#E8E8DA'],
    inspiration: 'Tata Harper dark, botanical wellness',
  },
  {
    id: 'onyx-editorial',
    name: 'Onyx Editorial',
    mode: 'dark',
    description: 'Pure black, white, electric blue accent.',
    swatches: ['#0A0A0A', '#1A1A1A', '#5070EE', '#FAFAFA'],
    inspiration: 'Balenciaga, high-contrast editorial',
  },
];

export interface StyleDef {
  id: StyleId;
  name: string;
  description: string;
  displayFont: string;
  bodyFont: string;
  sample: string;
  treatment: string;
  inspiration: string;
}

export const STYLES: StyleDef[] = [
  {
    id: 'editorial',
    name: 'Editorial Magazine',
    description: 'Full-bleed hero, italic serif overlap, drop cap, pull quote.',
    displayFont: 'Fraunces (italic)',
    bodyFont: 'Inter',
    sample: 'Aa Editorial',
    treatment: 'Image-led hero, numbered sections, drop cap, oversized quote marks.',
    inspiration: 'Vogue, NYT Cooking, Bon Appétit',
  },
  {
    id: 'modern-geometric',
    name: 'Modern Grid',
    description: 'Visible grid, mono labels, numbered cells, no images.',
    displayFont: 'Manrope (bold)',
    bodyFont: 'Manrope',
    sample: 'Aa Grid',
    treatment: 'Hairline borders forming bento, version/region metadata, type-driven.',
    inspiration: 'Linear, Vercel, Stripe Press, Read.cv',
  },
  {
    id: 'boutique-classic',
    name: 'Boutique Atelier',
    description: 'Asymmetric, vertical text, right-aligned, strategic empty space.',
    displayFont: 'Playfair Display',
    bodyFont: 'Inter',
    sample: 'Aa Atelier',
    treatment: 'Off-center composition, vertical brand label, long hairline separators.',
    inspiration: 'Aesop, Apartamento, Cereal, indie studios',
  },
  {
    id: 'brutalist',
    name: 'Brutalist Bold',
    description: 'Massive UPPERCASE, thick borders, hard image crop, mono.',
    displayFont: 'Inter Black (UPPERCASE)',
    bodyFont: 'Inter',
    sample: 'AA BRUTALIST',
    treatment: 'Asymmetric, 2px borders, diagonal accent stripe, clip-path crop.',
    inspiration: 'Balenciaga, Berlin galleries, Bloomberg',
  },
  {
    id: 'soft-organic',
    name: 'Soft Wellness',
    description: 'Blob backgrounds, curved dividers, pill shapes, soft shadows.',
    displayFont: 'DM Sans',
    bodyFont: 'DM Sans',
    sample: 'Aa Wellness',
    treatment: 'rounded-3xl cards, SVG wave dividers, gradient blobs, friendly.',
    inspiration: 'Headspace, Calm, BetterHelp',
  },
  {
    id: 'minimal-tech',
    name: 'Glass Modern',
    description: 'Multi-stop gradient, frosted glass cards, sparkle accents.',
    displayFont: 'Inter Light',
    bodyFont: 'Inter',
    sample: 'Aa Glass',
    treatment: 'backdrop-blur, translucent layers, glow orbs, depth via softness.',
    inspiration: 'iOS Liquid Glass, Arc Browser, modern fashion-tech',
  },
];

/* ================================================================
 * Variant constants used by existing /preview/v1, v2, v3 routes
 * ================================================================ */

export type Variant = 'v1' | 'v2' | 'v3';
export type PreviewPage = 'landing' | 'categories' | 'map' | 'preferences';
export type Palette = 'warm-premium' | 'soft-black' | 'cool-neutral';
export type DisplayFont = 'display' | 'sans';

export const VARIANT_CONFIG: Record<Variant, { palette: Palette; displayFont: DisplayFont; label: string }> = {
  v1: { palette: 'warm-premium', displayFont: 'display', label: 'Warm Premium' },
  v2: { palette: 'soft-black', displayFont: 'display', label: 'Soft Black' },
  v3: { palette: 'cool-neutral', displayFont: 'sans', label: 'Cool Neutral' },
};
