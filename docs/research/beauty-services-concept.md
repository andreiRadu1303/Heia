# Market Research: Beauty Services Concept

> Preliminary market research from the marketing partner. Translated from Romanian; the original document is on file. This captures the case for the **services** concept (concept (a) in [product-overview.md](../product-overview.md)) with a beauty-and-lifestyle specialisation.

## Status

This is **preliminary** research, not a final concept lock. It maps the case for a beauty-and-lifestyle services marketplace: what would differentiate it, who it serves, and a directional aesthetic. Treat it as input to the concept decision, not as committed scope. The codebase remains concept-neutral until the partner moves from *preliminary research* to *concept lock*.

## The core idea

A **beauty & lifestyle** application where users can:

- Discover specialists
- Make appointments
- Browse portfolios
- Read reviews
- Explore styles
- Receive personalised recommendations

### The important difference

Not "just another booking app." A **premium, feminine, aesthetic, highly personalised** experience.

## The real market problem

Many women:

- Already have their own hairstylist
- Are loyal to that person
- Are slow to switch the people they trust

For this reason, the app must **not** sell the idea *"leave your stylist."*

It must sell: **"Discover good people fast when you need them, wherever you need them."**

## What the app does for clients

- Find good specialists quickly
- Save time
- See the specialist's actual style
- Find services that match their vibe
- Book simply
- Find new people in new cities
- Find urgent / last-minute services
- Discover premium artists

## The differentiating idea: "Beauty Match"

Not a random list of salons. The app **reads the user's style** and recommends specialists who fit that vibe.

Aesthetic examples:

- Old money
- Clean girl
- Soft glam
- Dramatic glam
- Natural luxury
- Classy feminine
- Bridal elegance
- (and more — the taxonomy is its own design exercise)

**Tagline direction:** *"Find the beauty artist that matches YOU."*

This creates:

- A personal experience
- Attachment
- Differentiation
- A premium feel

## Acquiring clients

Not through *"Download the app!"*. Through emotional hooks:

- *"We found your beauty aesthetic."*
- *"Finding the right hairstylist feels harder than dating."*
- *"Not every beauty artist understands your face."*

These are strong starting points for TikTok and Instagram content.

## Acquiring specialists

The pitch to specialists isn't transactional. It's:

- Branding
- Image
- Exposure
- Status

## What specialists receive

**A premium profile:**

- Clean, on-aesthetic photos
- Mini portfolio
- Video showcase
- Before/after
- Specialisations

**Exposure:**

- "Featured artist" placement
- Reels on the app's social pages
- Algorithmic recommendation
- Promotion on social media

## Target audience

**Clients** — women, 18–60, interested in:

- Beauty
- Aesthetics
- Self-care
- Luxury
- Premium services
- Comfort

**Specialists:**

- Hairstylists
- Makeup artists
- Lash artists
- Brow artists
- Nail artists
- Premium salons
- Independent specialists
- Tattoo artists

## Marketing concepts (TikTok)

- *"POV: your beauty standards are impossible to satisfy."*
- *"Finding the right hairstylist is harder than dating."*
- *"This app matches you with beauty artists that fit YOUR vibe."*

## What makes the app different

It is not just appointments. It is:

- The experience
- The aesthetic
- The personalisation
- The community
- The branding
- The intelligent recommendations

## Aesthetic direction

- Very clean
- Very airy
- Very elegant
- Subtly feminine
- Never loud

## Suggested colour palette (premium variant)

| Token | Direction | Role |
|-------|-----------|------|
| Ivory / warm white | very light, slightly warm | Primary background |
| Champagne beige | soft warm | Accent |
| Mocha / taupe | warm mid-tone | Secondary text |
| Soft black | not pure black | High contrast |
| Sage grey or dusty nude | very desaturated | Optional subtle accent |

Exact hex values to be fixed during Figma work. This palette is one concrete direction to evaluate against the warm-neutral and cool-neutral candidates already in [design-brief.md](../design-brief.md). The ivory + champagne + mocha direction is a clear refinement of the **Candidate A — warm neutral** path in the design brief.

## How the app should feel

When you open it: *"Ah… it's calm here."*

Not:

- Many banners
- Promotions
- *"-20% LASHES"* shouting

## Home page

**Top:**

> *Find beauty artists that match your aesthetic.*

**Below:**

- Curated categories
- Large images
- Plenty of space
- No clutter

## Categories with personality

Not boring labels like "Hair" or "Makeup". Instead, identity-driven verticals:

- Soft Glam Artists
- Luxury Hair
- Bridal Beauty
- Natural Beauty
- Editorial Glam
- Clean Girl Specialists

## Specialist profiles

Treat each profile as a **mini brand page**:

- Aesthetic-driven feed
- "Known for" tags (e.g., *balayage expert*, *blonde specialist*)
- Transformations
- Reviews with photos

## How this maps to the foundation

This research aligns with the **services** branch of the concept question in [product-overview.md](../product-overview.md). If the partner moves from *preliminary research* to *concept lock* on this direction, the work in [architecture.md](../architecture.md) lands as follows:

- **Listing type:** `service` with `fulfillment_model = booking_required`
- **Listing attributes (JSONB):** aesthetic tags, "known for" specialities, service duration, price-per-service, location, before/after media, video showcase URL
- **Discovery surface:** aesthetic-driven categories on top of standard category filters; the "Beauty Match" feature is a layered recommendation system, not a replacement for category search
- **Trust signals:** `phone_verified` and `payment_account_connected` are particularly important for the premium positioning; `manually_reviewed` for "featured artist" slots
- **Concept-specific code:** lands in `src/concepts/services/`
- **Booking calendar:** core requirement; Google Calendar integration valuable for specialists who already run their own schedules

## Open questions raised by this research

These are decisions that the research has surfaced but not resolved. Worth flagging before concept-lock:

1. **The aesthetic taxonomy.** "Old money," "clean girl," "soft glam" etc. are useful as starting points, but the final taxonomy needs design and validation. Too few categories and it feels reductive; too many and it loses the curated feel. Likely 8–12 at launch.
2. **Onboarding to surface aesthetic preference.** How does the app *learn* a client's aesthetic? Explicit quiz, photo-based inference, or implicit signal from browsing behaviour? Has cost, accuracy, and friction trade-offs.
3. **"Beauty Match" v1 implementation.** First version is most likely tag-overlap matching (specialists tag themselves with aesthetics; clients pick or are inferred into aesthetics; match on overlap). ML-driven matching is a v2 concern.
4. **Featured artist economics.** Is "Featured Artist" purely editorial (no money changes hands) or is it sponsored? Editorial is more trustworthy; sponsored is monetisable. This connects to the monetisation question in the idea catalogue.
5. **Tattoo artists in a beauty-aesthetic frame.** The research lists tattoo artists alongside hairstylists and lash artists. The aesthetic-matching frame works well for fine-line / minimalist / illustrative tattoo styles, but the booking and trust dynamics differ from a haircut. Consider whether tattoo is in the launch set or a fast-follow vertical.
6. **Calendar integration scope.** Google Calendar two-way sync vs. in-app calendar only vs. both. Two-way sync is the better specialist experience but adds OAuth complexity.
