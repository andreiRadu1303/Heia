# Design system tokens

A token reference for the Figma board. Every value here is final-enough to paste into a Figma variable or style. Treat the palettes as **candidates to compare**, not as a committed pick.

This document is paired with the strategic [design brief](design-brief.md). The brief tells you *why*; this document tells you *what hex code*.

The accompanying palette board is at [diagrams/palette-board.svg](diagrams/palette-board.svg) — drag that into Figma as a reference image while you build the variables.

## Palettes

Three directional candidates. Each carries a different brand promise. They all share the same structural tokens (background, foreground, accent, success, danger) so the design system stays consistent regardless of which one wins.

### Palette A — Warm Premium (research direction)

Aligns with the partner's market-research direction (ivory / champagne / mocha / soft black). Reads as calm, feminine, premium.

| Token | Hex | HSL | Role |
|-------|-----|-----|------|
| `background` | `#F8F4EC` | `36 33% 95%` | Page background (warm ivory) |
| `surface` | `#FFFFFF` | `0 0% 100%` | Cards, sheets |
| `surface-muted` | `#EFE8DA` | `38 28% 90%` | Subtle fills |
| `foreground` | `#1F1A14` | `30 18% 10%` | Primary text (soft black) |
| `foreground-muted` | `#6A5F50` | `30 14% 37%` | Secondary text (mocha) |
| `border` | `#E4DBC8` | `40 28% 84%` | Hairlines |
| `accent` | `#C9A86A` | `38 47% 60%` | CTA accent (champagne) |
| `accent-foreground` | `#1F1A14` | `30 18% 10%` | Text on accent |
| `success` | `#5E7A4E` | `100 22% 39%` | Subtle olive |
| `danger` | `#A8443A` | `5 49% 44%` | Muted terracotta-red |

### Palette B — Cool Neutral (current scaffold default)

The shadcn/ui "zinc" baseline. Reads as modern, neutral, tool-like. Useful as a control.

| Token | Hex | HSL | Role |
|-------|-----|-----|------|
| `background` | `#FFFFFF` | `0 0% 100%` | Page background |
| `surface` | `#FFFFFF` | `0 0% 100%` | Cards |
| `surface-muted` | `#F4F4F5` | `240 5% 96%` | Subtle fills |
| `foreground` | `#09090B` | `240 10% 4%` | Primary text |
| `foreground-muted` | `#71717A` | `240 4% 46%` | Secondary text |
| `border` | `#E4E4E7` | `240 6% 90%` | Hairlines |
| `accent` | `#18181B` | `240 6% 10%` | CTA accent (matches primary) |
| `accent-foreground` | `#FAFAFA` | `0 0% 98%` | Text on accent |
| `success` | `#16A34A` | `142 76% 36%` | — |
| `danger` | `#DC2626` | `0 84% 51%` | — |

### Palette C — Soft Black Luxury

Dark variant of the warm-premium direction. Editorial, dramatic, high-fashion. The natural dark-mode partner for Palette A.

| Token | Hex | HSL | Role |
|-------|-----|-----|------|
| `background` | `#1A1614` | `20 13% 9%` | Page background (soft black, warm cast) |
| `surface` | `#26201D` | `20 14% 13%` | Cards |
| `surface-muted` | `#332B27` | `20 14% 17%` | Subtle fills |
| `foreground` | `#F4ECDD` | `40 47% 91%` | Primary text (warm cream) |
| `foreground-muted` | `#A89D8A` | `38 16% 60%` | Secondary text |
| `border` | `#3D332D` | `20 14% 21%` | Hairlines |
| `accent` | `#D9B677` | `36 56% 66%` | CTA accent (lighter champagne) |
| `accent-foreground` | `#1A1614` | `20 13% 9%` | Text on accent |
| `success` | `#7FA070` | `100 20% 53%` | Soft olive |
| `danger` | `#C77268` | `8 47% 59%` | Soft terracotta |

## Typography

Two candidate pairings. The pairing must be picked **before** Figma component work; everything that follows is opinionated by the typeface choice.

### Pairing 1 — Inter for everything

Modern, neutral, exceptional screen rendering, free.

- **Display & headings:** Inter, weights 600–700, tight letter-spacing (`-0.02em` for the largest, `-0.01em` for h2)
- **Body:** Inter, weight 400, line-height 1.55
- **Monospace:** Geist Mono (for "known for" tags, codes, technical UI)

### Pairing 2 — Fraunces + Inter

Editorial serif headlines on a clean sans body. Matches the "premium, feminine, aesthetic" tone of the research.

- **Display & headings:** Fraunces, weight 400 italic for hero headlines (light + cursive), weight 600 for h2 (substantial), `-0.02em`
- **Body:** Inter, weight 400, line-height 1.55
- **Monospace:** Geist Mono

Pairing 2 is the **bolder** choice and the better match for the beauty-services direction. Pairing 1 is the **safer** choice — better for an SEO-driven launch where the typeface needs to render consistently across every device.

### Scale (both pairings)

| Token | Size | Line height | Role |
|-------|------|-------------|------|
| `display-xl` | 64 / 72 px | 1.05 | Hero |
| `display-lg` | 48 / 56 px | 1.10 | Section opener |
| `display-md` | 36 / 40 px | 1.15 | Page title |
| `h1` | 28 px | 1.20 | — |
| `h2` | 22 px | 1.25 | — |
| `h3` | 18 px | 1.30 | — |
| `body-lg` | 18 px | 1.55 | Hero subhead |
| `body` | 16 px | 1.55 | — |
| `body-sm` | 14 px | 1.50 | Captions, meta |
| `mono-sm` | 12 px | 1.40 | Tags, eyebrows |

Larger sizes scale up at the `md` breakpoint and above.

## Spacing scale

Tailwind defaults with explicit favourites. No magic spacing values.

| Token | Value (rem) | Pixels | Use |
|-------|-------------|--------|-----|
| `space-1` | 0.25 | 4 | Tight gaps |
| `space-2` | 0.5 | 8 | — |
| `space-3` | 0.75 | 12 | — |
| `space-4` | 1 | 16 | Default gap |
| `space-6` | 1.5 | 24 | Section padding |
| `space-8` | 2 | 32 | — |
| `space-12` | 3 | 48 | Hero sections |
| `space-16` | 4 | 64 | Major separators |
| `space-24` | 6 | 96 | Above-the-fold breathing room |

## Border radius

| Token | Value | Use |
|-------|-------|-----|
| `radius-sm` | 4 px | Pills, tags |
| `radius-md` | 8 px | Inputs, buttons |
| `radius-lg` | 12 px | Cards |
| `radius-xl` | 16 px | Feature cards, modals |
| `radius-pill` | 9999 px | Avatars, badges |

## Component variants

Worth drawing in Figma so the design system is concrete.

### Button

- **Primary** — solid accent background, accent-foreground text
- **Secondary** — outlined, foreground border, foreground text
- **Ghost** — no border, no fill, foreground text on hover-fill
- **Destructive** — solid danger background, white text
- **Link** — underline on hover, accent colour

States: default, hover, focused (with visible ring), disabled, loading (spinner).

### Input

- **Default** — surface background, border hairline, foreground text
- **Focused** — accent border, subtle ring
- **Error** — danger border, danger helper text below
- **Disabled** — surface-muted background, 50% opacity

### Card (Listing card)

- **Default** — surface background, radius-lg, border, image at top
- **Featured** — accent border or subtle accent-tinted background (for "Featured Artist")
- **Hover** — lift (shadow), no scale (scale is too playful for this brand)

### Avatar

- Always rounded (`radius-pill`)
- Trust-tier badge slot at the bottom-right, with palette accent

### Aesthetic tag (chip)

For the "Soft Glam Artists", "Luxury Hair" style categories. Should feel curated, not gamified.

- **Default** — surface-muted background, foreground-muted text, `radius-pill`, mono font (small)
- **Active** — accent background, accent-foreground text
- **Hover** — subtle border accent

## Accessibility targets

- Contrast: ≥ 4.5:1 body text, ≥ 3:1 large text. Verify Palettes A and C against WCAG 2.1 AA.
- Focus rings must be visible on every interactive element. Never `outline: none` without a replacement.
- Form labels always present; placeholders are not labels.
- Reduced-motion media query honoured.
- All icons used for meaning have `aria-label` or accompanying text.

## Notes for the Figma board

- Build palettes as Figma **variables** (not styles), one collection per palette. Then swap collections to instantly re-skin every frame. This is the cleanest way to A/B the three palettes without duplicating frames.
- Drop the [palette-board.svg](diagrams/palette-board.svg) onto the canvas as a reference image while you set up variables — saves typing every hex.
- Set up text styles for each typography token (`display-xl`, `body`, etc.). Use the same names as this document so future "make this text body-lg" instructions translate cleanly.
- The three palettes share the **same token names** — so a button styled with `bg-accent text-accent-foreground` works correctly under all three.
- The strategic brief stays at [design-brief.md](design-brief.md) — voice, tone, what the brand should *feel* like. Use this document for the *what*, the brief for the *why*.
