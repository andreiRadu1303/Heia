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

/* ---------------- Screens (live previews) ---------------- */

export interface Screen {
  label: string;
  /** App path (locale is added automatically). */
  path: string;
  note: string;
  /** Public pages embed as a live iframe; auth-gated ones link out. */
  embeddable: boolean;
}

export const SCREENS: Screen[] = [
  { label: 'Landing', path: '/', note: 'Marketing home', embeddable: true },
  { label: 'Discover map', path: '/discover?category=hair', note: 'Map + draggable sheet', embeddable: true },
  { label: 'Studio profile', path: '/studio/andra-studio', note: 'Provider page', embeddable: true },
  { label: 'Design playground', path: '/preview/play', note: '12 palettes × 6 styles', embeddable: true },
  { label: 'Client home', path: '/dashboard', note: 'Discovery — requires client login', embeddable: false },
  { label: 'Provider dashboard', path: '/provider', note: 'Requires provider login', embeddable: false },
];

/* ---------------- Decisions log ---------------- */

export interface Decision {
  date: string;
  title: string;
  decision: string;
  why: string;
}

export const DECISIONS: Decision[] = [
  {
    date: '2026-05',
    title: 'Web stack: Next.js, not Flutter web',
    decision: 'Server-rendered Next.js for the web app.',
    why: 'Marketplace discovery lives or dies on SEO; the indexable surface is the product surface. Flutter web renders to canvas and is invisible to search.',
  },
  {
    date: '2026-05',
    title: 'Database: Supabase (Postgres + PostGIS)',
    decision: 'Supabase over Firebase.',
    why: 'Native geo for “near me”, relational data, full-text search, predictable cost, EU hosting for GDPR.',
  },
  {
    date: '2026-05',
    title: 'Launch market: Romania first',
    decision: 'Romania-first, international-ready architecture.',
    why: 'Underserved (no digitised aggregator), less competition, room to find product-market fit before scaling.',
  },
  {
    date: '2026-05',
    title: 'Concept: services / selfcare, not handmade goods',
    decision: 'Locked the services marketplace over the goods candidate.',
    why: 'Partner research targeted beauty/wellness; the services flow (book a person’s time) is the stronger wedge.',
  },
  {
    date: '2026-05',
    title: 'Positioning: wellness & authenticity (broader than beauty)',
    decision: 'Frame as selfcare/wellness, all genders/ages.',
    why: 'Authenticity over perfection integrates more services and avoids a narrow “beauty app” box.',
  },
  {
    date: '2026-05',
    title: 'Name: Heia',
    decision: 'Working product name is Heia.',
    why: 'Short, ownable, travels internationally. Trademark/clearance still to confirm before heavy spend.',
  },
  {
    date: '2026-05',
    title: 'Design: Soft Wellness + Sage',
    decision: 'Committed the rounded, calm Soft Wellness style with the Sage palette as the app default.',
    why: 'Best fit for the wellness/inclusive brief; the 12×6 playground stays for future exploration.',
  },
  {
    date: '2026-05',
    title: 'Accounts: one role at signup',
    decision: 'Client or provider chosen at signup; not switchable for now.',
    why: 'Simpler to build and reason about for v1; “become a provider later” is parked.',
  },
  {
    date: '2026-05',
    title: 'Build order: UI first, DB right after',
    decision: 'Built the full loop on mock data, then wire Supabase.',
    why: 'Lets us validate flow and design fast before committing schema.',
  },
];

/* ---------------- KPIs / metrics ---------------- */

export interface Kpi {
  area: string;
  metric: string;
  target: string;
}

export const KPIS: Kpi[] = [
  { area: 'Pre-launch', metric: 'Waitlist signups', target: 'Build a launch list' },
  { area: 'Pre-launch', metric: 'Signup → email confirm rate', target: '> 70%' },
  { area: 'Activation', metric: 'Signup → first booking (client)', target: 'To define' },
  { area: 'Activation', metric: 'Provider onboarding completion', target: '> 60%' },
  { area: 'Marketplace', metric: 'Bookings per week', target: 'Growth MoM' },
  { area: 'Marketplace', metric: 'Active providers', target: 'To define' },
  { area: 'Marketplace', metric: 'GMV (when payments live)', target: 'Growth MoM' },
  { area: 'Retention', metric: 'Repeat booking rate (90d)', target: 'To define' },
  { area: 'Retention', metric: 'Monthly active clients', target: 'Growth MoM' },
  { area: 'Quality', metric: 'Average rating', target: '> 4.6' },
  { area: 'Quality', metric: 'Review rate (per completed booking)', target: '> 30%' },
  { area: 'Acquisition', metric: 'Organic vs paid mix', target: 'Favor organic / SEO' },
  { area: 'Acquisition', metric: 'TikTok / IG → signup conversion', target: 'To define' },
];
