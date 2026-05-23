/**
 * Master plan content for /plan.
 *
 * This is the single source of truth for the interactive plan document.
 * To change the plan, edit the data here — the page re-renders it.
 * Add a feature → push to FEATURES. Add a phase → push to ROADMAP. Etc.
 */

export const META = {
  product: 'Heia',
  subtitle: 'Master plan',
  updated: '2026-05-16',
  oneLiner: 'A calm, considered marketplace for selfcare & wellness — Romania first, built to travel.',
};

/* ---------------- Concept ---------------- */

export const CONCEPT = {
  headline: 'Find your people for whatever selfcare means to you.',
  paragraphs: [
    'Heia is a two-sided marketplace that connects people looking after themselves with the specialists who help them do it — hair, tattoo, massage, nails, makeup, brows, skin, and more.',
    'It is not “another booking app.” The frame is selfcare and wellness, not just beauty: fashion and looks are one reason someone shows up, but the deeper promise is authenticity, presence, and feeling good in your own skin.',
    'Romania-first because the market lacks a digitised, aggregated home for this. Designed for international from day one (multi-currency-ready, i18n, GDPR-by-default).',
  ],
  audience: [
    { who: 'Clients', desc: 'People with a curiosity or passion for selfcare — from casual to style-conscious. The throughline is personal perception, not a single “type.”' },
    { who: 'Providers', desc: 'Independent stylists, studios, and practitioners who want exposure and a calm way to manage bookings — branding and status, not just a calendar.' },
  ],
  differentiators: [
    'Wellness & authenticity over perfection — “wellbeing doesn’t look the same on everyone.”',
    'Discovery by aesthetic and vibe, not just category.',
    'Calm, premium, unhurried UX — no banner noise, no “-20% LASHES.”',
    'Broad selfcare scope, so one app covers many reasons to show up.',
  ],
};

/* ---------------- Brand ---------------- */

export const BRAND = {
  voice: [
    'Authentic, not aspirational-fake. Real people with a point of view.',
    'Calm and confident — present before it’s noticed.',
    'Inclusive without erasing difference. All genders, all ages.',
    'European register: refinement + freedom, never sterile.',
  ],
  hooks: [
    'Style should feel alive.',
    'Confidence is personal.',
    'Wellbeing doesn’t look the same on everyone.',
    'Find good people, when you need them.',
  ],
  // The committed direction. The /preview/play playground holds the wider exploration.
  palette: [
    { name: 'Background', hex: '#F7F7F1', role: 'Bone / page' },
    { name: 'Foreground', hex: '#1E2620', role: 'Deep slate text' },
    { name: 'Accent', hex: '#7A8B6A', role: 'Sage' },
    { name: 'Muted', hex: '#E3E5DA', role: 'Soft fills' },
    { name: 'Dark bg', hex: '#1A2218', role: 'Forest (dark mode)' },
    { name: 'Dark accent', hex: '#7A9170', role: 'Moss' },
  ],
  type: {
    family: 'DM Sans',
    note: 'Soft Wellness — rounded, friendly, gender-neutral. Larger radii, soft shadows, curved dividers.',
  },
  style: 'Soft Wellness + Sage (chosen 2026-05-16). 6 styles × 12 palettes remain explorable at /preview/play.',
};

/* ---------------- Structure ---------------- */

export const ROLES = [
  {
    role: 'Client',
    home: '/dashboard',
    journey: ['Discover (search / categories / near you)', 'Map (filtered / focused)', 'Studio profile', 'Book a service + time', 'Pay', 'Booked'],
  },
  {
    role: 'Provider',
    home: '/provider',
    journey: ['Dashboard (stats, today)', 'Manage services', 'Set availability', 'Edit studio profile', 'Accept incoming bookings', 'Get paid'],
  },
];

export interface SiteNode {
  path: string;
  label: string;
  tag?: 'client' | 'provider' | 'shared' | 'auth';
  children?: SiteNode[];
}

export const SITEMAP: SiteNode[] = [
  { path: '/', label: 'Landing (marketing)', tag: 'shared' },
  { path: '/login · /signup', label: 'Auth (email + password, magic link, role at signup)', tag: 'auth' },
  {
    path: '/dashboard',
    label: 'Client home — discovery',
    tag: 'client',
    children: [
      { path: '/discover', label: 'Map + draggable sheet (category filter, focus)', tag: 'client' },
      { path: '/studio/[id]', label: 'Studio profile', tag: 'shared' },
      { path: '/studio/[id]/book', label: 'Booking', tag: 'client' },
      { path: '/checkout', label: 'Payment + confirmation', tag: 'client' },
      { path: '/account', label: 'Bookings + account', tag: 'client' },
    ],
  },
  {
    path: '/provider',
    label: 'Provider home — dashboard',
    tag: 'provider',
    children: [
      { path: '/provider/bookings', label: 'Incoming bookings', tag: 'provider' },
      { path: '/provider/services', label: 'Manage services', tag: 'provider' },
      { path: '/provider/availability', label: 'Weekly hours', tag: 'provider' },
      { path: '/provider/profile', label: 'Edit studio profile', tag: 'provider' },
    ],
  },
  { path: '/preview/play', label: 'Design playground (12 palettes × 6 styles)', tag: 'shared' },
  { path: '/plan', label: 'This document', tag: 'shared' },
];

export const STACK = [
  { name: 'Next.js 15 (App Router)', role: 'Web framework, SSR for SEO' },
  { name: 'TypeScript + Tailwind + shadcn/ui', role: 'UI layer' },
  { name: 'next-intl', role: 'i18n — Romanian default + English' },
  { name: 'Supabase', role: 'Auth + Postgres + storage (auth live; app data next)' },
  { name: 'Google Maps', role: 'Discovery map' },
  { name: 'Vercel', role: 'Hosting + CI from GitHub' },
];

/* ---------------- Features ---------------- */

export type FeatureStatus = 'live' | 'building' | 'planned' | 'idea';

export interface Feature {
  title: string;
  area: string;
  status: FeatureStatus;
}

export const FEATURE_STATUSES: { id: FeatureStatus; label: string; hint: string }[] = [
  { id: 'live', label: 'Live', hint: 'Built and deployed' },
  { id: 'building', label: 'In progress / next', hint: 'Being worked on or up next' },
  { id: 'planned', label: 'Planned', hint: 'Committed, not started' },
  { id: 'idea', label: 'Idea catalogue', hint: 'Captured, not committed' },
];

export const FEATURES: Feature[] = [
  // Live
  { title: 'Auth — signup/login, magic link, email confirm', area: 'Accounts', status: 'live' },
  { title: 'Single role at signup (client / provider)', area: 'Accounts', status: 'live' },
  { title: 'Client discovery home — search, filter, tags, carousel', area: 'Client', status: 'live' },
  { title: 'Map discovery — Google Maps + draggable sheet', area: 'Client', status: 'live' },
  { title: 'Studio profiles, booking flow, mock checkout', area: 'Client', status: 'live' },
  { title: 'Provider area — dashboard, bookings, services, hours, profile', area: 'Provider', status: 'live' },
  { title: 'i18n (RO/EN), light/dark, design playground', area: 'Platform', status: 'live' },
  // Building / next
  { title: 'Wire app to Supabase (providers, services, bookings)', area: 'Backend', status: 'building' },
  { title: 'Real search + filter against live data', area: 'Client', status: 'building' },
  { title: 'Auth-gate the client booking loop', area: 'Backend', status: 'building' },
  // Planned
  { title: 'Reviews tied to completed bookings', area: 'Trust', status: 'planned' },
  { title: 'Graduated trust tiers + badges', area: 'Trust', status: 'planned' },
  { title: 'Notifications (email + in-app)', area: 'Platform', status: 'planned' },
  { title: 'Provider “become a provider later” path', area: 'Accounts', status: 'planned' },
  // Idea catalogue
  { title: 'Stripe Connect payments + payouts', area: 'Money', status: 'idea' },
  { title: 'Google OAuth + phone OTP signup', area: 'Accounts', status: 'idea' },
  { title: '“Style Match” aesthetic recommendations', area: 'Discovery', status: 'idea' },
  { title: 'Google Calendar two-way sync', area: 'Provider', status: 'idea' },
  { title: 'Mobile app (Expo or Flutter)', area: 'Platform', status: 'idea' },
  { title: 'Loyalty, gift cards, referrals', area: 'Growth', status: 'idea' },
];

/* ---------------- Roadmap ---------------- */

export type PhaseStatus = 'done' | 'active' | 'upcoming';

export interface Phase {
  name: string;
  status: PhaseStatus;
  items: string[];
}

export const ROADMAP: Phase[] = [
  {
    name: 'Phase 0 — Foundation',
    status: 'done',
    items: ['Repo + Next.js scaffold', 'Architecture & design docs', 'Design system + playground'],
  },
  {
    name: 'Phase 1 — Concept lock + app loop',
    status: 'done',
    items: ['Services/selfcare concept locked', 'Soft Wellness + Sage design', 'Client + provider UI on mock data', 'Auth + roles live', 'Deployed on Vercel'],
  },
  {
    name: 'Phase 2 — Backend wiring',
    status: 'active',
    items: ['Supabase tables (providers, services, bookings)', 'App reads/writes real data', 'Auth-gate client loop', 'Real search + filter'],
  },
  {
    name: 'Phase 3 — Pre-launch',
    status: 'upcoming',
    items: ['Payments (Stripe Connect)', 'Reviews + trust tiers', 'Moderation tools', 'Privacy/terms, cookie consent', 'Analytics + error monitoring'],
  },
  {
    name: 'Phase 4 — Launch (Romania)',
    status: 'upcoming',
    items: ['Open seller signup', 'Marketing push', 'Support channel', 'Metrics dashboard'],
  },
  {
    name: 'Phase 5 — Grow',
    status: 'upcoming',
    items: ['More cities / international locales', 'Multi-currency', 'Mobile app', 'Loyalty + referrals'],
  },
];
