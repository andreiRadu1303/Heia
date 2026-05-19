# Glossary

Concept-neutral terminology used throughout code and documentation. The mapping to concept-specific vocabulary is documented for clarity, but the concept-specific terms must not appear in identifiers, URLs, table names, or technical documentation.

## Core terms

| Term | Definition | If concept (a) — services | If concept (b) — goods |
|------|------------|---------------------------|------------------------|
| **User** | Any authenticated account | Same | Same |
| **Client** | A User acting as a buyer | Client | Customer |
| **Seller** | A User acting as a provider | Expert / Professional | Maker / Artisan |
| **Listing** | A publishable offer that a Seller creates | Service offering | Product |
| **Listing type** | A category of Listing with a defined fulfillment model | Service / Consultation / Package | Single item / Made-to-order / Digital |
| **Transaction** | The canonical record of a buy commitment | Booking instance | Shopping order |
| **Fulfillment** | What the Seller does to honour a Transaction | Appointment | Shipment |
| **Fulfillment model** | The mechanism Fulfillment uses | `booking_required` | `shippable_product` |
| **Review** | A buyer's evaluation of a completed Transaction | Review of expert | Review of product |
| **Profile** | A public page representing a Seller | Expert profile | Maker page |
| **Portfolio** | Visual evidence on a Profile | Portfolio | Gallery / lookbook |
| **Trust tier** | A graduated verification level on a User or Listing | Same | Same |

## Auxiliary terms

| Term | Definition |
|------|------------|
| **Foundation phase** | The current pre-product phase: scaffolding, docs, architecture; no real users |
| **Seam** | The boundary in code where the domain-agnostic core meets concept-specific modules (Listing / Transaction / Fulfillment) |
| **Idea catalogue** | Future feature ideas explicitly out of current scope; recorded so the foundation does not preclude them |
| **Concept** | One of the candidate consumer-facing specialisations of the platform (services or goods) |
| **Concept lock** | The moment the marketing partner picks one concept and the platform commits to it |

## Naming rules

- Identifiers, table names, route paths, and module folders use the **left column** terminology.
- User-facing strings (UI copy, marketing pages, emails) use the **concept-specific** terminology once the concept is chosen, surfaced via the i18n layer — not by renaming code.
- A future find-and-replace pass on user-facing string keys is acceptable; one on code identifiers is not.
