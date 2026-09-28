# LocoStay — Product Requirements Document (PRD)

> **Status:** Draft v0.1 · **Last updated:** 2026-07-13 · **Owner:** Mario Nano
> Companion to [Technical Architecture](./technical-architecture.md). This
> document defines *what* LocoStay does and *why*. It is technology-agnostic
> where possible; implementation lives in the architecture record.

---

## 1. Vision

LocoStay is the go-to discovery destination for **unusual and work-friendly
places to stay** — lighthouses, lake houses, igloos above the Arctic Circle, treehouses, designer cottages, tiny homes in the middle of nowhere, and digital-nomad
work-vacation bases. Where Booking.com and Airbnb are broad and generic,
LocoStay is **narrow, curated, and editorial**: every listing is hand-picked and
written up with care, in a clean, uncluttered interface free of ad clutter and
clickbait.

LocoStay does not handle bookings or payments. It **inspires and routes**:
visitors discover a place, then click out to book it on Booking.com or the
owner's own booking engine.

---

## 2. Goals & non-goals

### Goals (v1)

- G1 — Present a **curated catalog of ≥ 20 bookable listings** at launch.
- G2 — Rank in organic search for niche queries ("lighthouse stay Scotland",
  "igloo hotel arctic circle", "tiny home workation") — SEO is the growth engine.
- G3 — Route visitors outward to book (affiliate or owner-direct) cleanly.
- G4 — Give a non-technical editor a friendly workflow to author listings + reviews.
- G5 — Establish revenue-channel hooks (affiliate links, verified badge, featured,
  direct-booking upgrade) as simple manual flags.
- G6 — Deliver a **clean, elegant, fast, mobile-first** experience.

### Non-goals (v1) . for now. These should come later

- Not an OTA: no on-site booking, payments, escrow, or cancellations.
- No host self-service accounts or dashboards.
- No live availability / calendar sync.
- No multilingual UI (English only).
- No user accounts, wishlists, or reviews-by-guests.
- No interactive map yet (data captured; UI later).

---

## 3. Target users (personas)

| Persona | Who | Needs | v1 relevance |
|--------|-----|-------|--------------|
| **The Explorer** | Leisure traveler seeking a memorable, unusual stay | Inspiration, trustworthy curation, easy path to book | Primary |
| **The Workationer** | Digital nomad / remote coder wanting to work somewhere extraordinary | Reliable wifi, a real desk, quiet, stay-length suitability | Primary |
| **The Property Owner** | Owner of an unusual property wanting exposure | Traffic, a credible write-up, badge/placement, fee savings via direct booking | Secondary (manual, via founder) |
| **The Editor** | Copywriter/journalist authoring content | Friendly CMS, clear content model | Internal |
| **The Admin** | Founder curating + monetizing | Fast listing entry, monetization toggles | Internal |

---

## 4. Key user journeys

### J1 — Search-driven discovery (the dominant path)

Google "unusual stay Lapland" → lands on a **destination or category page** →
browses curated listings → opens a **listing detail** → reads write-up, views
photos → clicks **"Book on Booking.com"** / **"Book direct"** → leaves to book.

### J2 — Editorial to listing

Reads an **in-depth review article** (found via search or internal link) →
in-context link to the reviewed **listing** → clicks out to book.

### J3 — Browse by intent

Enters via home or nav → filters by **type** (treehouse, igloo…), **destination**,
or **amenity** (fast wifi, desk — the workationer filters) → listing → book out.

### J4 — Owner inbound (lead, not transaction)

Owner finds "List your property" page → submits interest via a **contact form**
→ founder follows up manually, creates the listing, arranges any paid placement.

---

## 5. Information architecture (page inventory)

| Page | Purpose | Priority |
|------|---------|----------|
| **Home** | Positioning, featured listings, entry to browse | Must |
| **Listing detail** | The core page: photos, write-up, amenities, book-out CTAs | Must |
| **Category / Type page** | All listings of a type (SEO landing) | Must |
| **Destination / Region page** | All listings in a region (SEO landing) | Must |
| **Browse / search results** | Filterable listing grid | Must |
| **Review / Article detail** | Long-form editorial (SEO) | Should |
| **Reviews / Journal index** | Index of articles | Should |
| **List your property** | Owner lead-capture form | Should |
| **About** | Trust, story, curation ethos | Should |
| **Contact** | General contact | Must |
| **Legal: Privacy + Impressum + Affiliate disclosure** | Compliance (CH/EU) | Must |

---

## 6. Feature requirements (MoSCoW)

### Must have (v1 launch)

- M1 — Listing detail page: gallery, description, type, location (text), amenities,
  price band, **outbound booking CTA** honoring `bookingMode` (affiliate | direct).
- M2 — Category/Type landing pages (one per stay type).
- M3 — Destination/Region landing pages.
- M4 — Browse page with **filtering** by type, destination, and amenity
  (incl. workationer filters: fast wifi, desk, monitor, coworking nearby).
- M5 — Home page with featured/curated listings.
- M6 — **SEO baseline:** clean semantic HTML, unique titles/meta, JSON-LD
  (`LodgingBusiness`/`Article`), XML sitemap, canonical URLs, OG tags, fast load.
- M7 — **Verified badge** + **Featured** display driven by listing flags.
- M8 — **Affiliate disclosure** + Privacy + Impressum (CH/EU compliance).
- M9 — Responsive, mobile-first, clean visual design; cookieless analytics.
- M10 — Editor workflow in Craft to create listings with minimal friction.

### Should have (soon after launch)

- S1 — Review/Article content type + index, linkable to listings.
- S2 — "List your property" lead form.
- S3 — About page.
- S4 — Related-listings / cross-linking for SEO and discovery.

### Could have (later)

- C1 — Interactive **map** view (data already captured).
- C2 — Dedicated search engine (Typesense/Meilisearch) as catalog grows.
- C3 — Optional read-only availability display via iCal.
- C4 — Single elegant ad slot.
- C5 — Newsletter capture.

### Won't have (v1) — see Non-goals

On-site booking/payments, host accounts, guest accounts/reviews, i18n, calendar sync.

---

## 7. Content requirements

- Every listing needs: **hero + gallery photography**, a written description, a
  type, a destination, amenities, a price band, and a valid booking URL.
- Photography quality is a brand pillar — curation implies visual standards.
- Reviews are long-form, original, SEO-structured (the copywriter's remit).
- Tone: editorial, trustworthy, aspirational but honest.

---

## 8. SEO requirements (business-critical — see architecture C1)

- Server-rendered HTML for all public pages (guaranteed by Craft/Twig).
- One indexable, canonical URL per listing / category / destination / article.
- Structured data (JSON-LD) on listings and articles.
- Auto-generated XML sitemap; clean human-readable URL slugs.
- Fast Core Web Vitals: optimized responsive images, minimal JS.
- Internal linking: listings ↔ destinations ↔ types ↔ reviews.
- Managed via **SEOmatic** (see architecture §5).

---

## 9. Success metrics & launch criteria

### Launch criteria (definition of v1 done)

- [ ] ≥ 20 curated listings published, each with photos, write-up, and a working
  booking-out link.
- [ ] Category, destination, browse/filter, and home pages live.
- [ ] SEO baseline (M6) verified: sitemap submitted, schema validates, all pages
  have unique meta.
- [ ] Legal pages live (privacy, Impressum, affiliate disclosure).
- [ ] Responsive + passes a Lighthouse pass (perf/SEO/a11y) at a good threshold.
- [ ] Analytics live.

### Post-launch signals (what "working" looks like)

- Organic impressions/clicks growing (Search Console).
- Outbound booking-CTA click-through rate per listing.
- Affiliate referral conversions (Booking.com dashboard).
- Owner inbound leads via the form.

---

## 10. Constraints & assumptions

- Booking.com affiliate is accessed **via Travelpayouts** (P5); **Airbnb has no
  affiliate program**, so Airbnb-sourced listings monetize only via paid
  placement/badge (owner-side).
- Single operator authoring content initially; editor (copywriter) joins for reviews.
- Budget ≤ a few hundred €/mo; months-scale timeline.

---

## 11. Open questions

| # | Question | Needs |
|---|----------|-------|
| ~~P1~~ | ~~Taxonomy of stay types for launch?~~ | **Resolved** — see §12.1. |
| ~~P2~~ | ~~Which amenity filters are v1?~~ | **Resolved** — see §12.2. |
| ~~P3~~ | ~~Brand & visual direction?~~ | **Resolved** — name **LocoStay**; visual direction in [Design Direction](./design-direction.md). Logo mark still TBD. |
| ~~P4~~ | ~~Initial geographic focus for first 20 listings?~~ | **Resolved** — see §12.3. |
| ~~P5~~ | ~~Booking.com affiliate: direct or Travelpayouts?~~ | **Resolved** — via **Travelpayouts**. |
| ~~P6~~ | ~~Legal/compliance scope?~~ | **Resolved (stance)** — pragmatic minimum; see §13. |

---

---

## 12. Launch taxonomy, filters & geography

### 12.1 Stay-type taxonomy (categories)

**Guiding definition:** LocoStay lists *any unusual stay imaginable* — anything
beyond the ordinary generic hotel, house, or flat, made attractive by its
unusualness and its departure from the everyday. The taxonomy below is the
**launch set** and is intentionally **open/extensible** — new types are added as
inventory demands.

Launch categories:

1. Lighthouse
2. Igloo / glass cabin (aurora stays)
3. Treehouse
4. Tiny home
5. Designer cottage / architectural
6. Cave / earth house
7. Boat / houseboat
8. Windmill / watertower (converted)
9. Dome / yurt
10. Off-grid cabin
11. Nomad base / coliving (purpose-built work-friendly)

**Category vs. trait decision:** "Nomad base / coliving" is a **category** (for
places purpose-built for remote work). Separately, **"workation-ready" is a
trait/filter** (§12.2) that *any* category can carry — so a lighthouse or
treehouse can also surface for the Workationer. This serves both primary
personas across the whole catalog.

### 12.2 Amenity / filter set (v1)

Both buckets ship at launch — LocoStay serves the affluent unusualness-seeker
**and** the workationer.

**General amenities**

- Secluded / remote
- Waterfront / sea view
- Hot tub / sauna
- Fireplace / wood stove
- Pet-friendly
- Family-friendly
- Accessible
- Parking
- Self check-in

**Workationer filters** (the differentiator, = the "workation-ready" trait)

- Fast / reliable wifi
- Dedicated desk
- External monitor available
- Ergonomic chair
- Reliable power / backup
- Mobile signal
- Coworking nearby
- Long-stay friendly (weekly / monthly)

### 12.3 Geographic focus (first ~20 listings)

Launch inventory is seeded in **two focus regions**, chosen for strong niche
identity, mature bookable inventory, and guests with the right spending power:

- **A — Nordics / Arctic** (Norway, Sweden, Finland, Iceland) — igloos, aurora
  cabins, lighthouses.
- **B — UK & Ireland** — lighthouses, converted follies, remote cottages;
  English-language SEO advantage.

Other regions are added post-launch as the catalog grows.

---

## 13. Compliance stance (pragmatic minimum)

> **Not legal advice.** No lawyer is engaged; the stance is "as compliant as
> necessary, as little as possible." The items below are the low-effort essentials
> that keep a CH-based affiliate site out of obvious trouble. Revisit if the site
> grows or takes on payments.

- **Impressum** — Switzerland requires commercial websites to publish operator
  identity/contact. One static page. Low effort, do it.
- **Privacy policy** — EU visitors + Swiss revDSG mean a basic privacy page is
  expected. One static page describing analytics and outbound links.
- **Affiliate / advertising disclosure** — required by Travelpayouts/Booking.com
  terms and consumer law: a clear statement that LocoStay earns commissions on
  outbound bookings. A short disclosure line + a section in the privacy/about page.
- **Cookie consent — avoided by design.** Using **cookieless analytics**
  (Plausible/Umami) and no tracking cookies means **no cookie-consent banner is
  needed** — the single biggest compliance simplification. Keep it this way.
- **Do not** collect personal data beyond the owner lead-form (name, email,
  message) — minimal data = minimal obligation.

**Net effect:** three static legal pages + one disclosure line + cookieless
analytics. No lawyer, no banner, minimal data.

---

*A phased **Roadmap / build plan** is intentionally left open for now — timeline
is hard to commit to as a solo founder. The PRD + architecture are sufficient to
begin building when ready.*
