# Backend needs — derived from the app loop UI

The UI loop (landing → services → discover → studio → book → checkout) is built with hardcoded mock data in `src/lib/app-mock-data.ts`. This document lists what each screen will need from the backend so we can migrate UI-first work onto Supabase deliberately.

Order roughly = build order.

## Tables

### `categories`
Drives the service-selection grid.

| column | type | notes |
|--------|------|-------|
| id | text PK | `hair`, `tattoo`, … |
| name | text | display name |
| tagline | text | short line |
| sort_order | int | grid order |
| icon | text | emoji or icon key |

Mostly static — could even stay in code. A table lets non-devs edit it later.

### `providers` (studios / stylists)
The core listing. Maps to the `Studio` mock type.

| column | type | notes |
|--------|------|-------|
| id | uuid PK | |
| owner_id | uuid FK → profiles | the seller who manages it |
| name | text | |
| category_id | text FK → categories | primary category (could become many-to-many later) |
| tagline | text | |
| bio | text | |
| city | text | |
| address | text | |
| location | geography(Point) | **PostGIS** — for "near me" queries |
| rating | numeric | denormalised average, updated by trigger |
| review_count | int | denormalised |
| price_from | int | minor units (bani), denormalised from cheapest service |
| known_for | text[] | tags |
| is_published | bool | moderation gate |
| created_at | timestamptz | |

RLS: public can `select` where `is_published`; only `owner_id` can update.

### `services`
Each provider's offerings.

| column | type | notes |
|--------|------|-------|
| id | uuid PK | |
| provider_id | uuid FK → providers | |
| name | text | |
| duration_min | int | |
| price | int | minor units |
| sort_order | int | |

### `reviews`
| column | type | notes |
|--------|------|-------|
| id | uuid PK | |
| provider_id | uuid FK → providers | |
| author_id | uuid FK → profiles | |
| booking_id | uuid FK → bookings | **review must reference a completed booking** (anti-fake-review) |
| rating | int (1–5) | |
| body | text | |
| created_at | timestamptz | |

RLS: insert only if the author has a `completed` booking with this provider. Trigger updates `providers.rating` + `review_count`.

### `availability` / time slots
The booking page currently shows hardcoded slots. Real version needs one of:

- **Simple**: a `provider_hours` table (weekday → open/close) + a `bookings` check to grey out taken slots.
- **Better**: a `slots` table the provider generates, or Google Calendar two-way sync (was in the original idea catalogue).

Start simple: `provider_hours` + compute free slots by subtracting existing bookings.

### `bookings`
The canonical transaction record (matches the architecture's `transactions` spine).

| column | type | notes |
|--------|------|-------|
| id | uuid PK | |
| client_id | uuid FK → profiles | who booked |
| provider_id | uuid FK → providers | |
| service_id | uuid FK → services | |
| starts_at | timestamptz | date + time from the booking page |
| status | text | `pending` → `confirmed` → `completed` / `cancelled` |
| price | int | snapshot of service price at booking time (minor units) |
| created_at | timestamptz | |

RLS: client sees own bookings; provider owner sees bookings for their providers.

### `payments` (Stripe Connect — deferred)
The checkout page is mock. Real payments via Stripe Connect:

| column | type | notes |
|--------|------|-------|
| id | uuid PK | |
| booking_id | uuid FK → bookings | |
| stripe_payment_intent_id | text | |
| amount | int | minor units |
| status | text | mirrors Stripe |

Adds: Stripe Connect onboarding for providers (carries KYC — see follow-ups), webhook handler at `/api/stripe/webhook`, deposit vs full-payment policy decision.

## Queries the UI already implies

| Screen | Query |
|--------|-------|
| Landing "featured" | `select … from providers where is_published order by rating desc limit 4` |
| Services grid counts | `select category_id, count(*) from providers group by category_id` |
| Discover map | `select … from providers where category_id = $1 and ST_DWithin(location, $userpoint, $radius)` — needs PostGIS + the user's location |
| Studio profile | provider + its services + its reviews (3 queries or one with joins) |
| Booking slots | provider_hours minus bookings for the chosen day |
| Checkout | insert booking (pending) → create Stripe intent → on webhook, set confirmed |

## Cross-cutting

### Auth gating
The loop is currently open (no login required) for easy review. In production:

- `/services`, `/discover`, `/studio/[id]/book`, `/checkout` should require a session.
- Cleanest: a `(app)` route-group `layout.tsx` that calls `getUser()` and redirects to `/login?next=…` when absent.
- `/studio/[id]` (profile) probably stays public for SEO — it's the indexable surface.

### User geolocation
The discover map centres on Bucharest. Real version needs the browser geolocation prompt (`navigator.geolocation`) with a fallback to a city picker. Store last-known location on the profile for convenience.

### Money
Everything stored as **integer minor units** (bani) + currency code, formatted at display. The mock uses whole lei for simplicity; switch to bani when the DB lands.

### Images
Mock uses Picsum/Pravatar via `<img>`. Real version: providers upload to Supabase Storage; serve via `next/image` with the storage domain in `remotePatterns`; generate transforms/thumbnails.

## Account roles (built)

Each account is **one role**, chosen at signup: `client` or `provider` (stored on `profiles.role`, migration `002_roles.sql`). The experience forks on this:

| | Client | Provider |
|---|---|---|
| Home after login | `/dashboard` (upcoming bookings + account) | `/provider` (stats, today, manage) |
| Main flow | services → discover → studio → book → checkout | manage profile / services / hours / incoming bookings |
| Nav | site header | provider bottom-nav (`ProviderNav`) |
| Guard | `/dashboard` redirects providers to `/provider` | `requireProvider()` gates the whole `/provider/*` group; clients bounce to `/dashboard` |

**What still needs the DB for the provider side:**

- The provider area currently reads a fixed mock studio (`MY_STUDIO_ID = 'andra-studio'`) and mock `INCOMING_BOOKINGS`. Real version: a provider's account links to **their** `providers` row via `providers.owner_id = profiles.id`. Each provider page queries by that.
- `/provider/services` edits are local-only — needs `services` writes (insert/update/delete) scoped to the owner via RLS.
- `/provider/availability` is local-only — needs the `provider_hours` table.
- `/provider/bookings` Accept/Decline are non-functional — need `bookings.status` updates (pending → confirmed/cancelled) with an RLS policy letting the provider update bookings for their own studio, plus a notification to the client.
- `/provider/profile` save is non-functional — needs an update on the owner's `providers` row.

**Becoming a provider later:** out of scope (we chose one-role-at-signup). If we ever allow it, it's a role change on the profile + a provider-onboarding flow. Noted, not built.

## Suggested migration order

1. `categories` + `providers` + `services` (seed with the current mock data) → wire landing, services, discover, studio profile to read from Supabase. Link `providers.owner_id` so a provider account resolves to its studio.
2. `provider_hours` + `bookings` → wire the booking page to real availability + write a pending booking; wire `/provider/bookings` accept/decline.
3. Auth-gate the client `(app)` loop (the provider area is already gated by `requireProvider`).
4. `reviews` (tied to completed bookings).
5. Stripe Connect + `payments` → replace the mock checkout + provider payouts.
6. Geolocation + PostGIS "near me".
