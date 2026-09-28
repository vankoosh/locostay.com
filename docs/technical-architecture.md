# LocoStay — Technical Architecture

> **Status:** Draft v0.2 · **Last updated:** 2026-09-28 · **Owner:** Mario Nano
> Records LocoStay's technical decisions and their reasoning. When a decision
> changes, update the relevant section and add an entry to the Decision Log.

---

## 1. Product in one paragraph

LocoStay is a **curated, editorial, SEO-first catalog** of unusual and
work-friendly places to stay — lighthouses, Arctic igloos, treehouses, designer
cottages, tiny homes, digital-nomad bases. It is **not** an OTA: it holds no
bookings or payments and sends visitors *outward* to book (Booking.com affiliate
links or the owner's own booking engine). Solo project at launch, structured so a
small team can take it over later.

---

## 2. Guiding constraints

| # | Constraint | Consequence |
|---|-----------|-------------|
| C1 | **SEO is existential.** Organic discovery *is* the product. | Every content page is delivered as full, indexable HTML. |
| C2 | **No payments, no bookings held.** | No payment engine, no calendar-truth problem. Monetization = flags on a listing. |
| C3 | **Solo founder, near-zero budget.** | Free tiers, managed hosting, minimal moving parts. |
| C4 | **Founder is the only author.** | Content lives as Markdown in Git; no CMS. |
| C5 | **A mobile app may follow later.** | Data access goes through one typed layer so an API can be added without a rewrite. |
| C6 | **English-only at launch.** | No i18n now. |

---

## 3. Business model → data implications

All monetization is **frontmatter fields the founder edits manually** — no host
self-service, no host logins, no payments.

| Channel | Mechanism | Data impact |
|--------|-----------|-------------|
| Booking.com affiliate commission | Outbound affiliate deep link | `bookingUrl`, `bookingMode: affiliate` |
| Direct to owner's booking engine (paid) | Owner pays to bypass OTA fees | `bookingMode: direct`, `bookingUrl` = owner engine |
| Verified badge (paid) | Trust marker | `isVerified` |
| Sponsored in-depth review | Article driving traffic to a property | Article references listing `id` |
| Featured placement (paid) | Priority position | `featuredWeight` |
| One ad slot (maybe) | Single non-intrusive placement | Deferred; site config |

**Design rule:** monetization must never compromise the clean visual feel. No ad
clutter, no clickbait patterns.

---

## 4. Architecture — Angular (hybrid rendering) + Markdown content on Netlify

```
  Git repo: content/**/*.md + Angular app
        │ git push
        ▼
  Netlify build:  validate frontmatter (Zod) → content JSON → ng build (prerender)
        │
        ▼
  ┌─────────────────── Netlify ───────────────────┐
  │ CDN       prerendered HTML / JS / CSS         │ ──► browser
  │ Function  Angular SSR for dynamic routes      │
  │ Image CDN resize + WebP/AVIF  ◄───────────────┼── Cloudflare R2 (originals)
  └───────────────────────────────────────────────┘
        │ outbound links
        ▼
  Booking.com (affiliate) / owner booking engine
```

- **Rendering:** route-level render modes (`app.routes.server.ts`).
  - *Prerender* — listing, region, type and article pages (the bulk of the site).
  - *Server* — only routes that can't be enumerated at build time (e.g. filtered search).
- **Content pipeline:** a build script parses `content/**/*.md`, validates
  frontmatter with Zod (fails the build on missing fields or broken references),
  and emits typed JSON. The app, prerenderer and SSR function all read that JSON —
  no filesystem access at request time.
- **Data access:** components never touch content directly; they call a typed
  repository (`getListings(filter)`, `getListing(slug)`). Swapping files for an
  API or database later only changes the repository.

**Why:** full HTML for SEO (C1), zero database/CMS ops (C3, C4), free hosting (C3),
and a clean seam for a future API (C5).

---

## 5. Technology stack

| Layer | Choice | Notes |
|------|--------|-------|
| Framework | **Angular** (latest stable) + `@angular/ssr` | Hybrid prerender/SSR. |
| Language | **TypeScript** | |
| Styling | **SCSS**, Angular component-scoped styles | |
| Content | **Markdown + YAML frontmatter** in Git | One file per entity. |
| Validation | **Zod** | Frontmatter schemas = future API contract. |
| Hosting | **Netlify** (free tier) | Angular runtime installed automatically; deploy on push; preview deploys per branch. |
| Image storage | **Cloudflare R2** | 10 GB free, no egress fees. |
| Image delivery | **Netlify Image CDN** | On-the-fly resize/format; R2 domain allowlisted in `netlify.toml`. |
| SEO | Angular `Meta`/`Title`, JSON-LD, sitemap generated at build | Redirects via Netlify `_redirects`. |
| Search / filtering | Client-side over build-time JSON index | Dedicated engine deferred. |
| Maps *(deferred)* | **MapLibre GL + OpenStreetMap** | `lat`/`lng` stored on every listing now. |
| Analytics | **Plausible** or **Umami** | Privacy-friendly, lightweight. |

---

## 6. Content model

```
content/
  listings/{slug}.md
  regions/{slug}.md
  types/{slug}.md
  articles/{slug}.md
  owners/{slug}.md
```

Filename = slug. Every entity also has a stable `id` (slugs may change; ids never
do). References between files use `id`. Markdown body = editorial text.

### Listing (core entity)

```yaml
---
id: lst_0001
title: Lighthouse at Point X
type: lighthouse            # → types/
region: scottish-highlands  # → regions/
location: { lat: 57.12, lng: -5.43, country: GB }
priceRange: 3               # 1–5 band
amenities: [fast-wifi, desk, sea-view]
hero: listings/lighthouse-point-x/hero.jpg      # R2 path, not full URL
gallery: [listings/lighthouse-point-x/01.jpg]
bookingMode: affiliate      # affiliate | direct
bookingUrl: https://…
isVerified: false
featuredWeight: 0
owner: own_0001             # → owners/
---
Editorial description…
```

Image fields store **R2 paths**; the CDN base URL lives in config, so changing
image provider is a one-line change.

### Other entities
- **Type** — stay category; powers category landing pages (SEO).
- **Region** — destination landing pages ("stays in the Scottish Highlands").
- **Article** — long-form editorial/sponsored review; optional `listing` reference.
- **Owner** — name, contact, paid status. Internal only; never rendered.

---

## 7. Infrastructure & environments

- **Production:** Netlify, build triggered by push to `main`.
- **Previews:** Netlify deploy previews for branches/PRs.
- **Local dev:** Node LTS, `ng serve`.
- **Backups:** content is versioned in Git; R2 bucket backed up separately.
- **Cost:** Netlify free + R2 free + domain ≈ domain cost only (C3).

---

## 8. Deferred (not in v1)

- Public API (static JSON → REST) and a database — triggered by a mobile app;
  a database specifically once users write data (accounts, favourites).
- Interactive map UI.
- Availability / iCal sync (LocoStay holds no bookings, so it cannot double-book).
- Dedicated search engine.
- Payments, host self-service, owner dashboards.
- i18n.
- Ad slot.

---

## 9. Open questions / risks

| # | Item | Action |
|---|------|--------|
| Q1 | Booking.com affiliate onboarding (direct vs Travelpayouts) and link format. | Research during content-model build. |
| Q2 | Airbnb has no affiliate program — Airbnb-sourced inventory earns nothing unless the owner pays for placement. | Monitor. |
| Q3 | Netlify free-tier limits (build minutes, bandwidth, function invocations, image transforms). | Check usage monthly; mostly static traffic keeps it low. |
| Q4 | Angular ramp-up: not part of founder's prior core stack. | Keep app simple; lean on prerendering. |
| Q5 | Image setup (R2 + Netlify Image CDN) pending final confirmation vs Cloudinary. | Confirm before first listing is published. |

---

## 10. Decision Log

| Date | Decision | Rationale | Status |
|------|----------|-----------|--------|
| 2026-07-13 | Referral/discovery model, not OTA | No payments/calendar complexity; solo-viable | Accepted |
| 2026-07-13 | Curated inventory, founder-authored | Avoids two-sided cold-start; higher quality | Accepted |
| 2026-07-13 | No live availability sync in v1 | Holds no bookings → cannot double-book | Accepted |
| 2026-07-13 | SEO/editorial content is a first-class pillar | Only traffic channel in a referral model | Accepted |
| 2026-07-13 | SCSS for styling | Founder preference | Accepted |
| 2026-07-13 | English-only, i18n deferred | Simplicity at launch | Accepted |
| 2026-07-13 | Craft CMS + Twig monolith on cyon | — | Superseded 2026-09-28 |
| 2026-09-28 | Angular with hybrid prerender/SSR | Full HTML for SEO; Node hosting now allowed | Accepted |
| 2026-09-28 | Markdown files in Git, no CMS, no database | Sole author; zero ops; scale fits. SQLite rejected: binary (no Git diffs), poor for prose, no persistent writes on Netlify | Accepted |
| 2026-09-28 | Netlify hosting (free tier) | Free, commercial use allowed, native Angular SSR | Accepted |
| 2026-09-28 | Images on CDN (R2 + Netlify Image CDN) | Keeps repo light; no egress fees | Accepted (see Q5) |
| 2026-09-28 | No GraphQL; API deferred until a mobile app exists | One client, file-based content | Accepted |
| 2026-09-28 | Typed repository layer + Zod schemas | Seam for future API/database | Accepted |

---

*Next: Product Requirements (PRD) and a phased build plan.*
