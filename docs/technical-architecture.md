# LocoStay — Technical Architecture

> **Status:** Draft v0.1 · **Last updated:** 2026-07-13 · **Owner:** Mario Nano
> This document records the *technical* decisions for LocoStay and the reasoning
> behind them. It is a living record: when a decision changes, update the
> relevant section and add an entry to the Decision Log at the bottom.

---

## 1. Product in one paragraph

LocoStay is a **curated, editorial, SEO-first catalog** of unusual and
work-friendly places to stay — lighthouses, igloos above the Arctic Circle,
treehouses, designer cottages, tiny homes, and digital-nomad / work-vacation
bases. It is **not** an OTA. LocoStay does **not** process bookings or payments;
it discovers and presents properties and sends visitors *outward* to book
(Booking.com affiliate links or the owner's own booking engine). Revenue comes
from a thin stack of channels layered on top of content (see §3). It launches as
a solo project and is architected so a small team of coders can take it over
later.

---

## 2. Guiding constraints

These constraints drove every decision below.

| # | Constraint | Consequence |
|---|-----------|-------------|
| C1 | **SEO is existential.** With no owned transaction, organic discovery *is* the product. | Server-rendered, fully-indexable HTML is mandatory. |
| C2 | **No payments, no bookings held.** Money and calendars live on Booking.com / the owner's engine. | No payment engine, no escrow, no calendar-truth problem. Monetization = flags on a listing. |
| C3 | **Solo founder, months-scale timeline, ≤ a few hundred €/mo.** | Low-ops, cheap hosting; minimize moving parts. |
| C4 | **Editor-friendly content authoring** (non-technical editors, e.g. copywriter). | A real CMS admin UI is required, not a code-first content store. |
| C5 | **Founder expertise: Craft CMS, Twig, SCSS, TS/JS, Git.** | Prefer tools that reuse this skill set to ship fast solo. |
| C6 | **Host is cyon.ch** (Swiss PHP/LAMP shared hosting). | No persistent Node.js process available → **no SSR JS frontend** can run here. |
| C7 | **English-only at launch; scalable to a team later.** | No i18n now; clean, documented, conventional codebase. |

---

## 3. Business model → data implications

All monetization is realized as **fields/flags on content that the founder
toggles manually in v1** — no host self-service, no host logins, no payments.

| Channel | Mechanism | Data impact |
|--------|-----------|-------------|
| Booking.com affiliate commission | Outbound affiliate deep link | `bookingUrl`, `bookingMode = affiliate` |
| "Direct to owner's booking engine" (paid upgrade) | Owner pays to bypass OTA fees | `bookingMode = direct`, `bookingUrl` = owner engine |
| Verified badge (paid) | Trust marker on listing | `isVerified` |
| Sponsored in-depth review | Editorial article driving traffic to a property | Review/Article entry linked to Listing |
| Featured / placement (paid) | Priority position in listings | `isFeatured` / weight |
| One elegant ad slot (maybe) | Single non-intrusive placement | Deferred; global setting |

**Design rule:** the monetization model must never compromise the clean,
uncluttered visual feel. No ad clutter, no clickbait patterns.

---

## 4. Chosen architecture — Traditional Craft + Twig monolith on cyon

**Decision:** Build LocoStay as a **server-rendered Craft CMS site**, with
**Twig** templates rendering HTML directly, styled with **SCSS**, hosted on
**cyon.ch**. No decoupled/headless JS frontend.

```
                    ┌─────────────────────────────────────────┐
                    │                cyon.ch                    │
                    │            (PHP / LAMP shared)            │
                    │                                           │
   visitor ──────►  │   Craft CMS  ──►  Twig templates  ──► HTML│ ──► browser
                    │      │                                    │
                    │      ├── MySQL / MariaDB (content DB)      │
                    │      └── local assets / images            │
                    └───────────────────┬───────────────────────┘
                                        │  outbound links
                                        ▼
                        Booking.com (affiliate)  /  owner booking engine

   In front of everything:  Cloudflare (DNS, CDN, TLS, caching) — free tier
```

### Why this over a headless SPA (Angular/Next)
- **Solves C1 + C6 at once:** Craft renders full HTML server-side in PHP — perfect
  SEO, and it runs natively on cyon. A JS SPA would need SSR → a Node server cyon
  cannot provide. Static prerendering was rejected (rebuild-on-every-edit does not
  scale for a growing catalog).
- **Maximizes founder velocity (C5):** Twig + SCSS + Craft are existing expertise.
- **Fewest moving parts (C3):** one codebase, one host, one bill, one deploy.
- **A content catalog barely needs SPA interactivity.** The little that's needed
  (filters, later a map) is added with light vanilla JS / Alpine / htmx.

### Rejected alternatives
- **Angular / Next.js SPA on cyon** — impossible without a Node runtime; SSR won't run.
  Angular additionally is outside the founder's skill set. AngularJS (1.x) is EOL.
- **Headless Craft (cyon) + Next.js on Vercel** — viable and more scalable, but adds a
  second system/host for a solo dev with no v1 benefit. Kept as a **future migration
  path** if rich interactivity is ever needed.

---

## 5. Technology stack

| Layer | Choice | Notes |
|------|--------|-------|
| CMS / backend | **Craft CMS 5** (PHP 8.2+) | Editor-friendly admin (C4); founder expertise (C5). |
| Templating | **Twig** (Craft native) | Server-rendered HTML (C1). |
| Styling | **SCSS + CSS Modules-style scoping** | Founder preference; clean design system. |
| Database | **MySQL / MariaDB** | Provided by cyon. |
| SEO | **SEOmatic** (Craft plugin) | Meta tags, JSON-LD schema, sitemaps, redirects. |
| Client-side interactivity | **Vanilla JS**, optionally Alpine.js / htmx | Filters now, map later. Kept minimal. |
| Images | Craft native **asset transforms**; optional Cloudflare/R2 later | Photography-heavy; responsive transforms. |
| Maps *(deferred)* | **MapLibre GL + OpenStreetMap** tiles | Store `lat`/`lng` on every listing now. |
| Search *(deferred)* | Craft element queries now → Typesense/Meilisearch later | Not needed at tens–hundreds of listings. |
| Analytics | **Plausible** or **Umami** | Privacy-friendly, lightweight; matches clean ethos. |
| CDN / DNS / TLS | **Cloudflare** free tier | Caching, HTTPS, basic security in front of cyon. |
| Build tooling | **Vite** (for SCSS/JS bundling) | Standard Craft front-end tooling. |
| Version control | **Git** | Repo present. Deploy via SSH/Git to cyon. |

---

## 6. Content model (Craft sections & fields)

Craft terminology: **Sections** (Channel/Structure/Single) hold **Entries**;
**Categories** are taxonomies; **Fields** are reusable.

### Listing (Channel section) — the core entity
| Field | Type | Purpose |
|------|------|---------|
| `title` / `slug` | built-in | Name + URL. |
| `type` | Category (Types taxonomy) | lighthouse, igloo, treehouse, tiny home, nomad base… |
| `description` | rich text / Matrix | Editorial body. |
| `location` | lat/lng + region ref + country | Geo for map (deferred UI) + SEO. |
| `priceRange` | dropdown/number | Indicative price band. |
| `amenities` | Category/multi-select | Incl. nomad-specific: fast wifi, desk, monitor, coworking nearby. |
| `gallery` | Assets | Hero + gallery photography. |
| `bookingUrl` | URL | Outbound affiliate or direct engine link. |
| `bookingMode` | dropdown | `affiliate` \| `direct`. |
| `isVerified` | lightswitch | Paid verified badge. |
| `isFeatured` | lightswitch / weight | Paid placement. |
| `icalUrl` *(deferred)* | URL | Optional read-only availability sync, later. |
| `owner` | Entry relation | Link to Owner record. |

### Type (Category group)
Taxonomy of stay categories. Powers category landing pages (SEO).

### Destination / Region (Structure section)
Region/country pages ("stays in the Scottish Highlands") — SEO landing pages,
each listing related to one.

### Review / Article (Channel section)
Editorial, SEO-optimized long-form content (the copywriter's work). Optionally
linked to a Listing. Author field. Drives organic traffic.

### Owner (Channel section)
Light record in v1: name, contact, badge status. Grows into real accounts if the
platform ever moves to self-service / payments.

---

## 7. Infrastructure & environments

- **Production:** cyon.ch webhosting (PHP 8.2+, MySQL, SSH, Composer). Cloudflare in front.
- **Local dev:** DDEV or Laravel Herd / native PHP + MySQL. Craft project config
  (`config/project/`) tracked in Git for reproducible setup.
- **Deploy:** Git-based deploy to cyon over SSH; run `composer install` + Craft
  migrations (`craft up`) on deploy.
- **Backups:** cyon backups + periodic DB dump; assets backed up separately.
- **Estimated cost:** cyon plan + domain + Cloudflare (free) ≈ well under a few
  hundred €/mo (C3). ✅
- ✅ **cyon confirmed suitable:** founder has run Craft projects of this kind on
  cyon at a previous job. PHP 8.2+, MySQL, SSH, and Composer are available. No
  further verification needed.

---

## 8. Explicitly deferred (not in v1)

Kept out of v1 to protect the solo timeline; the data model already accommodates them.

- Interactive map UI (data captured now via `lat`/`lng`).
- Live availability / iCal sync (unnecessary — LocoStay holds no bookings, so it
  cannot double-book; purely a future UX nicety).
- Dedicated search engine (Typesense/Meilisearch).
- Payments, host self-service accounts, owner dashboards.
- Multilingual / i18n.
- Advertising slot.

---

## 9. Open questions / risks

| # | Item | Action |
|---|------|--------|
| ~~Q1~~ | ~~Does the chosen cyon plan satisfy Craft 5 requirements?~~ | **Resolved** — founder has run Craft on cyon before; requirements met. |
| Q2 | **Booking.com affiliate** onboarding (direct vs via Travelpayouts) and link format. | Research during content-model build. |
| Q3 | **Airbnb has no affiliate program** — inventory sourced from Airbnb earns nothing unless owner pays for placement. | Reflected in revenue model; monitor. |
| Q4 | Shared-hosting limits (cron, memory, no long-running processes) may constrain Craft queue jobs / image processing. | Test early; consider Cloudflare/R2 for images if needed. |
| Q5 | Rebuild path to headless (Option B) if rich interactivity is ever required. | Documented as future migration; not v1. |

---

## 10. Decision Log

| Date | Decision | Rationale | Status |
|------|----------|-----------|--------|
| 2026-07-13 | Referral/discovery model, not OTA | No payments/calendar complexity; solo-viable | Accepted |
| 2026-07-13 | Curated inventory, founder-authored | Avoids two-sided cold-start; higher quality | Accepted |
| 2026-07-13 | No live availability sync in v1 | LocoStay holds no bookings → cannot double-book | Accepted |
| 2026-07-13 | SEO/editorial content is a first-class pillar | Only traffic channel in a referral model | Accepted |
| 2026-07-13 | **Traditional Craft + Twig monolith on cyon (Option A)** | Solves SEO + host constraint; reuses founder skills; fewest moving parts | Accepted |
| 2026-07-13 | SCSS for styling | Founder preference/expertise | Accepted |
| 2026-07-13 | Rejected Angular/Next SPA on cyon | No Node runtime for SSR; SEO would break | Rejected |
| 2026-07-13 | English-only, i18n deferred | Simplicity at launch | Accepted |

---

*Next documents to produce: Product Requirements (PRD) and a phased Roadmap /
build plan. This architecture record should be revisited whenever a Decision Log
entry changes.*
