# Heia

A **beauty & lifestyle services marketplace**. Clients discover specialists — hairstylists, makeup artists, lash, brow, nail and tattoo artists — browse their portfolios, and book them. Specialists get a premium profile, exposure, and a calendar. Romania-first launch, international-ready architecture.

The differentiator is **aesthetic matching**, not another list of salons: the app reads a client's style ("clean girl", "old money", "soft glam"…) and recommends specialists who fit that vibe. See [market research](docs/research/beauty-services-concept.md).

## Status

**Concept is locked** (services / beauty — the earlier goods-marketplace option is dropped). The app is a **working vertical slice**: real auth, real database, and a real client→provider booking loop running on Supabase. Discovery surfaces still read from mock data and are being migrated table by table. See ["What's real vs. mock"](#whats-real-vs-mock) below.

> **Historical note:** this repo started as a concept-neutral scaffold called *ProjectMarket*. Some of that vocabulary survives — `package.json` is still named `projectmarket`, and several docs (`product-overview.md`, `architecture.md`, `glossary.md`, `roadmap.md`) still frame the services-vs-goods decision as open. Treat those as pre-lock artefacts; this README is the current state.

## Quick start

```bash
npm install
cp .env.example .env.local     # fill in the Supabase keys
npm run dev
# open http://localhost:3000  (redirects to /ro)
```

Default locale is Romanian (`/ro`); English is at `/en`. The toggle in the header switches between them.

Without Supabase keys the public/mock pages still render, but auth, booking and checkout will fail.

### Scripts

| Command | Effect |
|---------|--------|
| `npm run dev` | Start the Next.js dev server on port 3000 |
| `npm run build` | Production build (typechecks + lints + static-generates routes) |
| `npm run start` | Run the production build |
| `npm run lint` | Lint with Next.js's ESLint config |
| `npm run docs:pdf` | Regenerate `docs/pdf/*.pdf` from the markdown sources |

## Database setup

Migrations are plain SQL, run in order in the Supabase SQL Editor. They are idempotent — re-running is safe.

| File | What it does |
|------|--------------|
| [`docs/supabase/001_init.sql`](docs/supabase/001_init.sql) | `profiles` table, `handle_new_user` signup trigger, `touch_updated_at`, RLS |
| [`docs/supabase/002_roles.sql`](docs/supabase/002_roles.sql) | Adds `profiles.role` (`client` \| `provider`), captured from signup metadata |
| [`docs/supabase/003_marketplace.sql`](docs/supabase/003_marketplace.sql) | `studios`, `services`, `bookings` + RLS; auto-creates an unpublished studio for every new provider |
| [`docs/supabase/004_seed_studios.sql`](docs/supabase/004_seed_studios.sql) | Demo studios and services |

Also set the Site URL and redirect URLs in Supabase → Authentication → URL Configuration, so confirmation and magic-link emails land back on the right origin.

## Roles

An account is **one role**, chosen at signup and stored on `profiles.role`. The experience forks on it.

| | Client | Provider |
|---|---|---|
| Home after login | `/dashboard` — upcoming bookings, account | `/provider` — stats, today, manage |
| Main flow | services → discover → studio → book → checkout | profile / services / hours / incoming bookings |
| Navigation | site header | provider bottom-nav |
| Guard | `/dashboard` bounces providers to `/provider` | `requireProvider()` gates `/provider/*`; clients bounce to `/dashboard` |

Signing up as a provider automatically creates an **unpublished** studio for that account (via the `handle_new_user` trigger). The provider edits it and publishes it themselves.

Switching roles after signup is deliberately not supported.

## Routes

**Public / marketing**

- `/` — photo-led landing page (Heia Editorial palette, brand photography in `public/brand/`)
- `/services` — category grid
- `/discover` — map + list of studios (Google Maps)
- `/studio/[id]` — studio profile: portfolio, services, reviews (public — this is the SEO surface)

**Client**

- `/studio/[id]/book` — pick a service, date and slot
- `/checkout` — confirm and create the booking
- `/dashboard` — upcoming and past bookings
- `/account` — profile

**Provider (`requireProvider`)**

- `/provider` — dashboard: today, stats
- `/provider/bookings` — incoming requests, accept / decline
- `/provider/services` — service catalogue
- `/provider/availability` — working hours
- `/provider/profile` — studio profile editing

**Auth**

- `/login`, `/signup` (email + password, magic link), `/auth/check-email`, `/auth/confirm`

**Internal tooling (noindex, not product)**

- `/plan` — interactive master planning document: scope, screens, decision log, KPIs. Editable in-browser, persists to `localStorage`, exports/imports JSON.
- `/preview/play` — design playground: **12 palettes × 6 styles × 4 pages** in a phone-sized iframe
- `/preview/v1`, `/v2`, `/v3` — three preset palette/typography variants across landing, categories, map and preferences
- `/preview/devices` — the three presets side by side in phone frames

## What's real vs. mock

**Wired to Supabase**

- Signup / login / magic link / email confirmation; session in cookies (`@supabase/ssr`)
- `profiles` with role, locale and marketing consent
- Booking creation: `/studio/[id]/book` → `/checkout` writes a `pending` booking
- `/dashboard` — reads the client's real bookings; cancellation
- `/provider` and `/provider/bookings` — read real bookings for the owner's studio; accept / decline writes `bookings.status`
- RLS on every table: clients see their own bookings, providers see bookings for studios they own

**Still on mock data** (`src/lib/app-mock-data.ts`)

- Landing page featured studios
- `/services` category grid and counts
- `/discover` map pins and list
- `/studio/[id]` profile, services and reviews
- `/provider/services`, `/provider/availability`, `/provider/profile` — edits are local-only, not persisted

**Not built**

- **Payments** — `/checkout` records a booking but takes no money. Stripe Connect is planned; deposit vs. full payment is an open decision.
- **Reviews** — rendered from mock data. The anti-fake-review rule (a review must reference a completed booking) is designed, not implemented.
- **Messaging** — `/messages` is a stub.
- **Availability engine** — no `provider_hours` table yet; booking slots are hardcoded.
- **Image uploads** — studios use seeded placeholder images; real version goes to Supabase Storage.
- Transactional email (Resend), analytics, Sentry, cookie consent, privacy policy / ToS, account deletion.
- **Client notifications** (SMS / push / email / WhatsApp) — channel not yet decided.

[`docs/backend-needs.md`](docs/backend-needs.md) is the screen-by-screen list of what each surface still needs from the backend, in build order. [`docs/follow-ups.md`](docs/follow-ups.md) tracks everything deliberately deferred, with the reason and the trigger for doing it.

## Tech stack

- **Next.js 15** (App Router) + **React 19** + **TypeScript**
- **Tailwind CSS** + **shadcn/ui** primitives + **lucide-react**
- **next-intl** — locale-prefixed routes, Romanian default, English available
- **next-themes** — system / light / dark
- **Supabase** — Postgres, auth, RLS (`@supabase/ssr` for cookie-based sessions)
- **Google Maps** via `@vis.gl/react-google-maps`
- Fonts: **Inter** (body) + **Fraunces** (display), via `next/font/google`
- Deployed on **Vercel**

## Repository layout

```
Heia/
├── docs/                    # Planning, architecture, research
│   ├── supabase/            # SQL migrations (run in order)
│   ├── pdf/                 # Generated PDFs (npm run docs:pdf)
│   ├── diagrams/            # Mermaid + Excalidraw
│   └── research/            # Market research from the marketing partner
├── tools/docs-build/        # Node script that builds the documentation PDFs
├── scripts/                 # Cost-analysis document builders
├── public/brand/            # Brand photography
├── src/
│   ├── app/[locale]/
│   │   ├── page.tsx         # Landing
│   │   ├── (auth)/          # /login, /signup
│   │   ├── (app)/           # /services, /discover, /studio, /checkout, /dashboard, /account
│   │   ├── provider/        # Provider area (requireProvider)
│   │   ├── plan/            # Internal planning document
│   │   └── preview/         # Internal design playground
│   ├── components/          # ui/ primitives, app/ shell, preview-*/ design variants
│   ├── i18n/                # next-intl routing, request config, navigation
│   ├── lib/                 # supabase/ clients, auth-guards, app-mock-data
│   ├── messages/            # ro.json (default), en.json
│   └── middleware.ts        # Locale routing
├── .env.example             # Every env var, catalogued
└── package.json
```

## Documentation

1. [Product overview](docs/product-overview.md) — *pre-lock; still frames services-vs-goods as an open decision*
2. [Tech stack](docs/tech-stack.md) — what we're building with, and why
3. [Architecture](docs/architecture.md) — system shape
4. [Backend needs](docs/backend-needs.md) — **what each screen still needs from the DB, in build order**
5. [Follow-ups](docs/follow-ups.md) — **everything deferred, with the trigger for doing it**
6. [Services and APIs](docs/services-and-apis.md) — third-party services and pricing
7. [Roadmap](docs/roadmap.md) — phased plan and idea catalogue
8. [Design brief](docs/design-brief.md) / [Design system](docs/design-system.md) — visual direction and tokens
9. [Glossary](docs/glossary.md) — terminology
10. [Market research](docs/research/beauty-services-concept.md) — the beauty concept, from the marketing partner
11. [Cost analysis](docs/heia-cost-analysis.pdf) — running-cost projection

**Diagrams:** [system architecture](docs/diagrams/architecture.excalidraw), [pipeline & journeys](docs/diagrams/pipeline.excalidraw), [core ERD](docs/diagrams/erd-core.md), [palette board](docs/diagrams/palette-board.svg).

PDFs of every document live in [docs/pdf/](docs/pdf/) for sharing outside the repo.

## Working conventions

- All code, comments, identifiers and documentation are written in **English**.
- End-user-facing UI strings are translated; **Romanian** is the launch locale.
- Money is currently stored as **integer lei** on `studios`, `services` and `bookings` (`price_lei`). The plan is to move to **minor units (bani) + an explicit currency code** before payments land.
- All timestamps are stored in **UTC** (`timestamptz`); display is localised.
- Every user-data table has **RLS enabled**. The `service_role` key is server-only — never `NEXT_PUBLIC_`, never imported from a client component.
- Bookings snapshot `service_name`, `price_lei` and `duration_min` at booking time, so they survive later edits to the service.

## Immediate next steps

1. **Migrate discovery off mock data** — seed `categories`, then wire the landing page, `/services`, `/discover` and `/studio/[id]` to read `studios` + `services` from Supabase.
2. **Make the provider area write** — `/provider/services`, `/provider/availability` and `/provider/profile` currently discard their edits.
3. **`provider_hours` + real slot computation** — replace the hardcoded booking slots.
4. **Auth-gate the client `(app)` loop** — a `layout.tsx` in the route group that calls `getUser()` and redirects to `/login?next=…`. `/studio/[id]` stays public for SEO.
5. **Decide the client notification channel** — SMS, push, email or WhatsApp, and who pays for it.
6. **Restrict the Google Maps API key** before any public marketing push (see [follow-ups](docs/follow-ups.md)).
