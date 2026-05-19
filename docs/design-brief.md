# Design brief

Direction for the visual and interaction design of the platform. This document is the input to Figma work. It is opinionated where opinions help, and open where opinions would constrain prematurely.

## Brand voice

- Modern, approachable, trustworthy.
- Romanian-launched but not visually Romanian — the design system should travel to other locales without rework.
- Lean toward confidence, not whimsy. Marketplace participants need to trust the platform with their time and money.

## Visual direction — two candidate palettes

The final palette will be picked once the concept is chosen, since palettes carry concept signal (warm tones cue services and crafts; cooler neutrals cue marketplaces and tools). Two starting points:

### Candidate A — Warm neutral

- Primary text / structure: `#1E1A17` (near-black, warm cast)
- Accent: `#D97757` (terracotta)
- Background: `#FAF7F2` (warm off-white)
- Surface: `#FFFFFF`
- Muted text: `#7A6F66`
- Success: `#3F8F4F`
- Danger: `#B23B3B`

### Candidate B — Cool neutral

- Primary text / structure: `#0F1419` (near-black, cool cast)
- Accent: `#3B7BC2` (steel blue)
- Background: `#F5F7FA`
- Surface: `#FFFFFF`
- Muted text: `#6B7280`
- Success: `#2F855A`
- Danger: `#C53030`

Dark-mode variants will be derived from the chosen palette. The foundation scaffolds both light and dark; final tuning happens at concept-lock.

## Typography

- **Headlines and body:** a clean geometric sans (Inter, Geist, or Manrope). Avoid display serifs in the foundation.
- **Single family** for headlines and body keeps a small marketplace looking cohesive. Specimens at 12 / 14 / 16 / 18 / 24 / 32 / 48 px should be drawn.
- **Monospace** for any code-adjacent UI: JetBrains Mono or Geist Mono.

## Spacing scale

Tailwind's default scale. Strong preference for `4 / 8 / 12 / 16 / 24 / 32 / 48 / 64`. No magic spacing values.

## Component inventory (Figma starter)

- Logo + wordmark exploration
- Buttons: primary, secondary, ghost, destructive — default, hover, focused, disabled, loading
- Inputs: text, email, password, search, textarea — default, focused, error, disabled
- Select / Combobox
- Checkbox / Radio
- Toggle / Switch
- Date and time picker (services flows)
- Card: listing card, profile card, message card
- Avatar with a trust-tier badge slot
- Dialog / Modal
- Toast / Inline notification
- Empty state pattern
- Loading state (skeletons)
- Breadcrumb / Tabs
- Pagination / Infinite-scroll cue

## Screen list (Figma starter)

**Public:**

- Landing page (waitlist teaser — foundation phase)
- Sign up
- Log in
- Browse / search results
- Listing detail
- Profile / portfolio detail

**Authenticated:**

- Dashboard (Seller and Client variants)
- Listing editor (Seller)
- Messages
- Transaction detail (booking or order)
- Settings: profile, account, notifications, privacy
- Admin moderation queue (out of foundation scope, listed for completeness)

## Accessibility targets

- WCAG 2.1 AA throughout.
- Keyboard navigation on every interactive element.
- Visible focus rings; do not suppress browser focus.
- Form labels always present; placeholder is never the only label.
- Colour contrast ≥ 4.5:1 for body text, ≥ 3:1 for large text.
- `prefers-reduced-motion` honoured for animations.

## Mobile-web priority

The web client is the launch surface. A meaningful share of traffic will be mobile-web. Design **mobile-first**; desktop is a wider variant, not the canonical layout.

## What the partner needs from this brief

- A Figma file built around the chosen palette (or both, side by side, to compare).
- The component inventory above, drawn as a small design system.
- Hi-fi mockups of the priority screens (start with: landing, browse, listing detail, profile).
- Specimens for typography and spacing.
- Logo and wordmark exploration.

## What this brief intentionally does not specify

- Final logo direction. Pick once the concept is chosen.
- Iconography style (line vs. filled vs. duotone). Decide alongside palette.
- Photography style (high-contrast vs. soft-light). Concept-dependent.
- Illustration system, if any. Defer until concept-lock.
