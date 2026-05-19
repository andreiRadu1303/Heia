# ProjectMarket

Two-sided marketplace platform. Romania-first launch, international-ready architecture.

This is a **foundation-phase** repository. The product concept — services marketplace (stylists, tattoo artists, beauty, fashion consultants) vs. handmade goods marketplace — is undecided. The codebase uses concept-neutral terminology so that either can be specialised later without renaming.

## Status

**Phase 0 — Foundation.** Planning, architecture, and design documentation are in place. A Next.js application skeleton is wired with i18n, light/dark theme, shadcn/ui primitives, a concept-agnostic landing page with a waitlist UI, and stub routes for the major authenticated surfaces. No backend services are connected yet. See [docs/roadmap.md](docs/roadmap.md).

## Quick start

```bash
npm install
npm run dev
# open http://localhost:3000  (redirects to /ro)
```

Default locale is Romanian (`/ro`); English is available at `/en`. The toggle in the header switches between them.

### Scripts

| Command | Effect |
|---------|--------|
| `npm run dev` | Start the Next.js dev server on port 3000 |
| `npm run build` | Production build (typechecks + lints + static-generates routes) |
| `npm run start` | Run the production build |
| `npm run lint` | Lint with Next.js's ESLint config |
| `npm run docs:pdf` | Regenerate `docs/pdf/*.pdf` from the markdown sources |

## Repository layout

```
projectMarket/
├── README.md
├── docs/                    # Planning and architecture documentation
│   ├── pdf/                 # Generated PDFs (regenerate with npm run docs:pdf)
│   └── diagrams/            # Mermaid and Excalidraw diagrams
├── tools/
│   └── docs-build/          # Node script that builds the documentation PDFs
├── src/
│   ├── app/                 # Next.js App Router
│   │   ├── globals.css
│   │   └── [locale]/        # Locale-prefixed routes (ro, en)
│   │       ├── layout.tsx
│   │       ├── page.tsx     # Landing page
│   │       ├── not-found.tsx
│   │       ├── (auth)/      # /login, /signup
│   │       └── (app)/       # /browse, /listing/[id], /profile/[handle], /dashboard, /messages
│   ├── components/
│   │   ├── ui/              # shadcn/ui primitives (button, input, card)
│   │   └── ...              # site-header, footer, locale-switcher, theme-toggle, etc.
│   ├── i18n/                # next-intl config (routing, request, navigation)
│   ├── lib/                 # Shared utilities (cn helper)
│   ├── messages/            # Locale message bundles (ro.json, en.json)
│   └── middleware.ts        # next-intl locale routing middleware
├── next.config.mjs
├── tailwind.config.ts
├── tsconfig.json
├── components.json          # shadcn/ui configuration
├── .env.example             # All env vars catalogued (services not yet wired)
└── package.json
```

## Where to start reading

1. [Product overview](docs/product-overview.md) — what this is and who it's for
2. [Tech stack](docs/tech-stack.md) — what we're building with, and why
3. [Architecture](docs/architecture.md) — system shape and the concept-specific seam
4. [Services and APIs](docs/services-and-apis.md) — third-party services and pricing
5. [Roadmap](docs/roadmap.md) — phased plan and idea catalogue
6. [Glossary](docs/glossary.md) — concept-neutral terminology
7. [Design brief](docs/design-brief.md) — strategic direction for the visual system
8. [Design system tokens](docs/design-system.md) — Figma-ready palettes, typography, components

**Diagrams:**

- [System architecture](docs/diagrams/architecture.excalidraw) — Excalidraw, the system overview
- [Pipeline & journeys](docs/diagrams/pipeline.excalidraw) — Excalidraw, client + specialist journeys with cross-lane touchpoints
- [Core ERD](docs/diagrams/erd-core.md) — Mermaid, domain-agnostic schema
- [Palette board](docs/diagrams/palette-board.svg) — SVG reference for Figma, three candidate palettes side-by-side

**Market research:**

- [Beauty services concept](docs/research/beauty-services-concept.md) — preliminary research from the marketing partner; translated from Romanian

PDFs of every document live in [docs/pdf/](docs/pdf/) for sharing outside the repo.

## What is and isn't wired

**Wired:**

- Next.js 15 App Router + TypeScript + Tailwind CSS + shadcn/ui
- next-intl with Romanian (default) and English locales, locale-prefixed routes, locale switcher in the header
- next-themes with system / light / dark mode toggle
- Default palette: **Warm Premium** in light mode, **Soft Black Luxury** in dark mode (aligned with the partner's research direction)
- Fonts: Inter (body) + Fraunces (display headings) loaded via `next/font/google`
- Landing page with a UI-only waitlist form (shows a thank-you state on submit but does not persist anything)
- **Design playground** at [`/preview/play`](http://localhost:3000/ro/preview/play) — interactive picker that mixes **12 palettes × 6 styles × 4 pages** on a phone-sized iframe. Palette sidebar on the left, style sidebar on the right, phone preview in the middle.
- Three preset palette / typography **variants** at `/preview/v1` (warm premium), `/preview/v2` (soft black luxury), `/preview/v3` (cool neutral), each available across **four pages**: landing, categories, map, preferences. Switcher at the top of every variant flips palette or page.
- **Mobile-first** layouts throughout. Quick comparison tool at [`/preview/devices`](http://localhost:3000/ro/preview/devices) that shows the three presets side-by-side in phone-sized iframes.
- Stub routes for `/login`, `/signup`, `/browse`, `/listing/[id]`, `/profile/[handle]`, `/dashboard`, `/messages`
- 404 page

**Not wired (intentionally — see [Roadmap](docs/roadmap.md)):**

- Authentication (no Supabase project connected; auth forms are visual stubs)
- Database (no Supabase keys configured)
- Waitlist persistence (form is UI-only; real capture lands when email service is wired)
- Email / Stripe / Sentry / analytics — all listed in [`.env.example`](.env.example) but commented out
- Concept-specific code (`src/concepts/services/`, `src/concepts/goods/` — created when the concept is chosen)

## Working conventions

- All code, comments, identifiers, and documentation are written in **English**.
- End-user-facing UI strings are translated; **Romanian** is the launch locale, with i18n scaffolding from day one.
- Currency amounts are stored as integers in **minor units** with an explicit currency code.
- All timestamps are stored in **UTC**; display is localised.
- Concept-specific terminology (`Expert`, `Service`, `Artisan`, `Product`) does not appear in identifiers. See [Glossary](docs/glossary.md).

## Regenerating the documentation PDFs

PDFs are rebuilt from the markdown sources via a self-contained Node script in `tools/docs-build/`. Mermaid diagrams are rendered to SVG by a headless Chrome instance during the build.

```bash
npm run docs:pdf
```

Requires Google Chrome to be installed at the default macOS path (`/Applications/Google Chrome.app`). If you run this elsewhere, edit `tools/docs-build/build-pdf.js` and point `CHROME_PATH` at your Chrome / Chromium binary.

## Foundation phase: what's next

The next step is **concept-lock** — your partner picks services vs. goods. At that point:

1. The Listing / Transaction / Fulfillment seam in [docs/architecture.md](docs/architecture.md) gets populated in `src/concepts/<chosen>/`.
2. A real Supabase project is provisioned and `NEXT_PUBLIC_SUPABASE_*` vars filled in.
3. The auth flow is wired and the stub routes start showing real data.

Until then, everything in this repo can be iterated on without committing to a concept.
