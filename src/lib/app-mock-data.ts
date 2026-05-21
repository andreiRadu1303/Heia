/**
 * Mock data for the real app loop (services → discover → studio → book → pay).
 *
 * UI-first: this is hardcoded for now. The shape mirrors what the Supabase
 * tables will hold so the migration is mostly "swap the import for a query".
 * See docs/backend-needs.md for the table plan.
 *
 * Money is stored in RON minor units would be ideal, but for mock display
 * we keep whole-lei integers and format with `lei`.
 */

export const img = {
  hero: (seed: string) => `https://picsum.photos/seed/heia-${seed}/900/1100`,
  card: (seed: string) => `https://picsum.photos/seed/heia-${seed}/600/450`,
  square: (seed: string) => `https://picsum.photos/seed/heia-${seed}/600/600`,
  avatar: (seed: string) => `https://i.pravatar.cc/240?u=heia-${seed}`,
};

export interface Category {
  id: string;
  name: string;
  tagline: string;
  /** Tailwind-friendly tint used in gradients on cards. */
  tint: string;
  emoji: string;
}

export const CATEGORIES: Category[] = [
  { id: 'hair', name: 'Hair', tagline: 'Cut, colour, care', tint: '#C9A86A', emoji: '✂️' },
  { id: 'barber', name: 'Barber', tagline: 'Cuts, beards, fades', tint: '#8A7B68', emoji: '💈' },
  { id: 'tattoo', name: 'Tattoo', tagline: 'Fine-line to bold', tint: '#3D332D', emoji: '🖋️' },
  { id: 'massage', name: 'Massage', tagline: 'Tension, gone', tint: '#7A9170', emoji: '🌿' },
  { id: 'nails', name: 'Nails', tagline: 'Mani, pedi, art', tint: '#D4A7A2', emoji: '💅' },
  { id: 'makeup', name: 'Makeup', tagline: 'Everyday to event', tint: '#C9847A', emoji: '✨' },
  { id: 'brows', name: 'Brows & Lashes', tagline: 'Shape and lift', tint: '#A89D8A', emoji: '👁️' },
  { id: 'skin', name: 'Skin & Facial', tagline: 'Glow, restored', tint: '#9FB0A5', emoji: '🧖' },
];

export function categoryById(id: string): Category | undefined {
  return CATEGORIES.find((c) => c.id === id);
}

export interface ServiceOffering {
  id: string;
  name: string;
  durationMin: number;
  priceLei: number;
}

export interface Review {
  id: string;
  author: string;
  avatarSeed: string;
  rating: number;
  body: string;
  ago: string;
}

export interface Studio {
  id: string;
  name: string;
  categoryId: string;
  tagline: string;
  rating: number;
  reviewCount: number;
  priceFromLei: number;
  city: string;
  address: string;
  distanceKm: number;
  lat: number;
  lng: number;
  bio: string;
  knownFor: string[];
  services: ServiceOffering[];
  reviews: Review[];
  gallerySeeds: string[];
  avatarSeed: string;
  heroSeed: string;
}

/** Bucharest-ish centre, with small offsets per studio. */
export const CITY_CENTER = { lat: 44.4268, lng: 26.1025 };

export const STUDIOS: Studio[] = [
  {
    id: 'andra-studio',
    name: 'Andra Studio',
    categoryId: 'hair',
    tagline: 'Balayage & lived-in colour',
    rating: 4.9,
    reviewCount: 218,
    priceFromLei: 180,
    city: 'București',
    address: 'Str. Mendeleev 7',
    distanceKm: 0.8,
    lat: 44.4452,
    lng: 26.0975,
    bio: 'A small, calm studio focused on colour that grows out beautifully. We take our time — one client at a time, no rush, no upsell.',
    knownFor: ['Balayage', 'Soft glam', 'Lived-in colour'],
    services: [
      { id: 's1', name: 'Cut & finish', durationMin: 60, priceLei: 180 },
      { id: 's2', name: 'Balayage + gloss', durationMin: 180, priceLei: 520 },
      { id: 's3', name: 'Root touch-up', durationMin: 90, priceLei: 260 },
      { id: 's4', name: 'Treatment & blow-dry', durationMin: 45, priceLei: 140 },
    ],
    reviews: [
      { id: 'r1', author: 'Ioana', avatarSeed: 'ioana', rating: 5, body: 'Best balayage I’ve had in Bucharest. Felt heard about what I wanted.', ago: '2 weeks ago' },
      { id: 'r2', author: 'Carmen', avatarSeed: 'carmen', rating: 5, body: 'Calm space, zero pressure. Colour still looks great 2 months on.', ago: '1 month ago' },
    ],
    gallerySeeds: ['andra-1', 'andra-2', 'andra-3', 'andra-4'],
    avatarSeed: 'andra',
    heroSeed: 'andra-hero',
  },
  {
    id: 'salon-lumina',
    name: 'Salon Lumina',
    categoryId: 'hair',
    tagline: 'Classic cuts, modern finish',
    rating: 4.7,
    reviewCount: 142,
    priceFromLei: 120,
    city: 'București',
    address: 'Bd. Dacia 42',
    distanceKm: 1.4,
    lat: 44.4471,
    lng: 26.1102,
    bio: 'A friendly neighbourhood salon. Walk-ins welcome, but booking gets you the stylist you want.',
    knownFor: ['Cuts', 'Blowouts', 'Bridal'],
    services: [
      { id: 's1', name: 'Cut & style', durationMin: 50, priceLei: 120 },
      { id: 's2', name: 'Blow-dry', durationMin: 40, priceLei: 90 },
      { id: 's3', name: 'Bridal trial', durationMin: 90, priceLei: 320 },
    ],
    reviews: [
      { id: 'r1', author: 'Diana', avatarSeed: 'diana', rating: 5, body: 'Lovely team, great with curly hair.', ago: '3 weeks ago' },
      { id: 'r2', author: 'Raluca', avatarSeed: 'raluca', rating: 4, body: 'Solid cut, good value.', ago: '2 months ago' },
    ],
    gallerySeeds: ['lumina-1', 'lumina-2', 'lumina-3'],
    avatarSeed: 'lumina',
    heroSeed: 'lumina-hero',
  },
  {
    id: 'mihai-hair',
    name: 'Mihai · Hair',
    categoryId: 'hair',
    tagline: 'Editorial cuts & texture',
    rating: 4.95,
    reviewCount: 96,
    priceFromLei: 220,
    city: 'București',
    address: 'Str. Arthur Verona 13',
    distanceKm: 1.1,
    lat: 44.4419,
    lng: 26.0968,
    bio: 'Independent stylist working out of a shared studio. Texture, fringes, and cuts with a point of view.',
    knownFor: ['Editorial', 'Fringes', 'Texture'],
    services: [
      { id: 's1', name: 'Signature cut', durationMin: 75, priceLei: 220 },
      { id: 's2', name: 'Fringe trim', durationMin: 20, priceLei: 60 },
    ],
    reviews: [
      { id: 'r1', author: 'Alex', avatarSeed: 'alexh', rating: 5, body: 'Finally a stylist who gets texture. Worth every leu.', ago: '1 week ago' },
    ],
    gallerySeeds: ['mihai-1', 'mihai-2', 'mihai-3'],
    avatarSeed: 'mihai',
    heroSeed: 'mihai-hero',
  },
  {
    id: 'barbierie-veche',
    name: 'Bărbierie Veche',
    categoryId: 'barber',
    tagline: 'Hot towel, sharp fades',
    rating: 4.8,
    reviewCount: 173,
    priceFromLei: 80,
    city: 'București',
    address: 'Str. Franceză 30',
    distanceKm: 2.0,
    lat: 44.4301,
    lng: 26.1024,
    bio: 'Old-school barbershop energy with a clean modern finish. Espresso while you wait.',
    knownFor: ['Fades', 'Beard sculpt', 'Hot towel'],
    services: [
      { id: 's1', name: 'Haircut', durationMin: 40, priceLei: 80 },
      { id: 's2', name: 'Cut + beard', durationMin: 60, priceLei: 120 },
      { id: 's3', name: 'Hot towel shave', durationMin: 30, priceLei: 70 },
    ],
    reviews: [
      { id: 'r1', author: 'Andrei', avatarSeed: 'andreib', rating: 5, body: 'Cleanest fade in the old town. Great atmosphere.', ago: '5 days ago' },
      { id: 'r2', author: 'Vlad', avatarSeed: 'vlad', rating: 5, body: 'Beard sculpt was perfect.', ago: '3 weeks ago' },
    ],
    gallerySeeds: ['barber-1', 'barber-2', 'barber-3'],
    avatarSeed: 'barbierie',
    heroSeed: 'barber-hero',
  },
  {
    id: 'ink-and-co',
    name: 'Ink & Co.',
    categoryId: 'tattoo',
    tagline: 'Fine-line & blackwork',
    rating: 4.9,
    reviewCount: 121,
    priceFromLei: 300,
    city: 'București',
    address: 'Str. Lipscani 55',
    distanceKm: 2.3,
    lat: 44.4318,
    lng: 26.1008,
    bio: 'Private studio, by appointment only. Custom designs — bring a reference or a feeling, we’ll draw it.',
    knownFor: ['Fine-line', 'Blackwork', 'Custom'],
    services: [
      { id: 's1', name: 'Small fine-line (consult)', durationMin: 60, priceLei: 300 },
      { id: 's2', name: 'Half-day session', durationMin: 240, priceLei: 1200 },
      { id: 's3', name: 'Design consultation', durationMin: 30, priceLei: 0 },
    ],
    reviews: [
      { id: 'r1', author: 'Bianca', avatarSeed: 'bianca', rating: 5, body: 'So gentle and precise. Healed perfectly.', ago: '2 weeks ago' },
      { id: 'r2', author: 'Tudor', avatarSeed: 'tudor', rating: 5, body: 'Took my vague idea and made it better.', ago: '1 month ago' },
    ],
    gallerySeeds: ['ink-1', 'ink-2', 'ink-3', 'ink-4'],
    avatarSeed: 'inkco',
    heroSeed: 'ink-hero',
  },
  {
    id: 'fine-line-atelier',
    name: 'Fine Line Atelier',
    categoryId: 'tattoo',
    tagline: 'Delicate, minimal, intentional',
    rating: 5.0,
    reviewCount: 64,
    priceFromLei: 350,
    city: 'București',
    address: 'Str. Pictor Verona 2',
    distanceKm: 1.0,
    lat: 44.4425,
    lng: 26.0991,
    bio: 'A two-artist atelier specialising in the smallest, most delicate work. Calm, unhurried sessions.',
    knownFor: ['Micro tattoo', 'Minimal', 'Lettering'],
    services: [
      { id: 's1', name: 'Micro tattoo', durationMin: 60, priceLei: 350 },
      { id: 's2', name: 'Lettering', durationMin: 90, priceLei: 450 },
    ],
    reviews: [
      { id: 'r1', author: 'Sofia', avatarSeed: 'sofia', rating: 5, body: 'Tiniest, cleanest line work I’ve seen.', ago: '1 week ago' },
    ],
    gallerySeeds: ['fla-1', 'fla-2', 'fla-3'],
    avatarSeed: 'fineline',
    heroSeed: 'fla-hero',
  },
  {
    id: 'calm-rooms',
    name: 'Calm Rooms',
    categoryId: 'massage',
    tagline: 'Deep tissue & relaxation',
    rating: 4.85,
    reviewCount: 204,
    priceFromLei: 200,
    city: 'București',
    address: 'Calea Victoriei 101',
    distanceKm: 1.7,
    lat: 44.4389,
    lng: 26.0962,
    bio: 'Quiet treatment rooms away from the street noise. Therapists trained in deep tissue and relaxation.',
    knownFor: ['Deep tissue', 'Relaxation', 'Sports'],
    services: [
      { id: 's1', name: 'Relaxation (60 min)', durationMin: 60, priceLei: 200 },
      { id: 's2', name: 'Deep tissue (60 min)', durationMin: 60, priceLei: 240 },
      { id: 's3', name: 'Deep tissue (90 min)', durationMin: 90, priceLei: 340 },
    ],
    reviews: [
      { id: 'r1', author: 'Elena', avatarSeed: 'elenam', rating: 5, body: 'Walked out feeling brand new. So calm.', ago: '4 days ago' },
      { id: 'r2', author: 'George', avatarSeed: 'george', rating: 4, body: 'Great deep tissue, fixed my shoulder.', ago: '3 weeks ago' },
    ],
    gallerySeeds: ['calm-1', 'calm-2', 'calm-3'],
    avatarSeed: 'calmrooms',
    heroSeed: 'calm-hero',
  },
  {
    id: 'serene-touch',
    name: 'Serene Touch',
    categoryId: 'massage',
    tagline: 'Aromatherapy & lymphatic',
    rating: 4.75,
    reviewCount: 88,
    priceFromLei: 220,
    city: 'București',
    address: 'Str. Polonă 68',
    distanceKm: 2.6,
    lat: 44.4515,
    lng: 26.1066,
    bio: 'Aromatherapy-led massage in a warm, plant-filled space.',
    knownFor: ['Aromatherapy', 'Lymphatic', 'Prenatal'],
    services: [
      { id: 's1', name: 'Aromatherapy (60 min)', durationMin: 60, priceLei: 220 },
      { id: 's2', name: 'Lymphatic drainage', durationMin: 75, priceLei: 280 },
    ],
    reviews: [
      { id: 'r1', author: 'Maria', avatarSeed: 'mariam', rating: 5, body: 'The aromatherapy was heavenly.', ago: '2 weeks ago' },
    ],
    gallerySeeds: ['serene-1', 'serene-2'],
    avatarSeed: 'serene',
    heroSeed: 'serene-hero',
  },
  {
    id: 'nail-atelier',
    name: 'Nail Atelier',
    categoryId: 'nails',
    tagline: 'Clean mani, quiet luxury',
    rating: 4.9,
    reviewCount: 156,
    priceFromLei: 90,
    city: 'București',
    address: 'Str. Eminescu 120',
    distanceKm: 1.3,
    lat: 44.4458,
    lng: 26.1051,
    bio: 'Minimal nail studio. Hygiene-first, beautiful neutrals, and the occasional bit of art.',
    knownFor: ['Russian mani', 'Neutrals', 'Nail art'],
    services: [
      { id: 's1', name: 'Manicure + gel', durationMin: 75, priceLei: 130 },
      { id: 's2', name: 'Pedicure', durationMin: 60, priceLei: 120 },
      { id: 's3', name: 'Express mani', durationMin: 40, priceLei: 90 },
    ],
    reviews: [
      { id: 'r1', author: 'Ana', avatarSeed: 'anan', rating: 5, body: 'Spotless studio, mani lasted 3 weeks.', ago: '1 week ago' },
      { id: 'r2', author: 'Cristina', avatarSeed: 'cristina', rating: 5, body: 'Best neutrals in the city.', ago: '1 month ago' },
    ],
    gallerySeeds: ['nail-1', 'nail-2', 'nail-3'],
    avatarSeed: 'nailatelier',
    heroSeed: 'nail-hero',
  },
  {
    id: 'maria-mua',
    name: 'Maria · MUA',
    categoryId: 'makeup',
    tagline: 'Soft glam & bridal',
    rating: 4.95,
    reviewCount: 112,
    priceFromLei: 180,
    city: 'București',
    address: 'Mobile · comes to you',
    distanceKm: 0,
    lat: 44.4376,
    lng: 26.1095,
    bio: 'Freelance makeup artist. Soft glam for events and weddings — I come to you.',
    knownFor: ['Soft glam', 'Bridal', 'Editorial'],
    services: [
      { id: 's1', name: 'Event makeup', durationMin: 60, priceLei: 180 },
      { id: 's2', name: 'Bridal (trial + day)', durationMin: 120, priceLei: 650 },
    ],
    reviews: [
      { id: 'r1', author: 'Larisa', avatarSeed: 'larisa', rating: 5, body: 'Looked like myself but elevated. Lasted all night.', ago: '2 weeks ago' },
    ],
    gallerySeeds: ['mua-1', 'mua-2', 'mua-3'],
    avatarSeed: 'mariamua',
    heroSeed: 'mua-hero',
  },
  {
    id: 'brow-bar',
    name: 'The Brow Bar',
    categoryId: 'brows',
    tagline: 'Shape, tint, lift',
    rating: 4.8,
    reviewCount: 134,
    priceFromLei: 70,
    city: 'București',
    address: 'Str. Batiștei 14',
    distanceKm: 1.9,
    lat: 44.4395,
    lng: 26.1042,
    bio: 'Brows and lashes only — we do one thing and do it well.',
    knownFor: ['Brow lamination', 'Lash lift', 'Tint'],
    services: [
      { id: 's1', name: 'Brow shape + tint', durationMin: 40, priceLei: 90 },
      { id: 's2', name: 'Brow lamination', durationMin: 60, priceLei: 160 },
      { id: 's3', name: 'Lash lift', durationMin: 60, priceLei: 170 },
    ],
    reviews: [
      { id: 'r1', author: 'Teodora', avatarSeed: 'teodora', rating: 5, body: 'Lamination changed my mornings.', ago: '10 days ago' },
    ],
    gallerySeeds: ['brow-1', 'brow-2'],
    avatarSeed: 'browbar',
    heroSeed: 'brow-hero',
  },
  {
    id: 'glow-skin',
    name: 'Glow Skin Studio',
    categoryId: 'skin',
    tagline: 'Facials & skin health',
    rating: 4.9,
    reviewCount: 99,
    priceFromLei: 200,
    city: 'București',
    address: 'Str. Jean-Louis Calderon 40',
    distanceKm: 2.1,
    lat: 44.4361,
    lng: 26.1078,
    bio: 'Results-focused facials with a calm, spa-like feel. No gimmicks, just good skin habits.',
    knownFor: ['Hydrafacial', 'Acne care', 'Peels'],
    services: [
      { id: 's1', name: 'Signature facial', durationMin: 60, priceLei: 200 },
      { id: 's2', name: 'Hydrafacial', durationMin: 75, priceLei: 320 },
    ],
    reviews: [
      { id: 'r1', author: 'Andreea', avatarSeed: 'andreeas', rating: 5, body: 'Skin glowing for days. Very knowledgeable.', ago: '1 week ago' },
    ],
    gallerySeeds: ['glow-1', 'glow-2', 'glow-3'],
    avatarSeed: 'glowskin',
    heroSeed: 'glow-hero',
  },
];

export function studioById(id: string): Studio | undefined {
  return STUDIOS.find((s) => s.id === id);
}

export function studiosByCategory(categoryId: string): Studio[] {
  const inCategory = STUDIOS.filter((s) => s.categoryId === categoryId);
  return inCategory.length > 0 ? inCategory : STUDIOS;
}

export function formatLei(value: number): string {
  return value === 0 ? 'Free' : `${value} lei`;
}
