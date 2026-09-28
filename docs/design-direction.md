# LocoStay — Design Direction

> **Status:** Draft v0.1 · **Last updated:** 2026-09-27 · **Owner:** Mario Nano
> Foundation for LocoStay's visual language. Companion to
> [Product Requirements](./product-requirements.md) (§P3) and
> [Technical Architecture](./technical-architecture.md). Tokens below are
> starting values to implement in SCSS — refine during the design phase.

---

## 1. Design principles

1. **The place is the hero.** The UI is a neutral frame; the property photography
   is the only source of color and emotion.
2. **Minimalist, not stark.** Apple/Google-grade restraint — generous whitespace,
   quiet typography, no ornament — but warm enough to feel inviting, not clinical.
3. **Content-first & fast.** Design serves reading, browsing, and clicking out to
   book. Performance and legibility beat decoration (also serves SEO — arch. C1).
4. **Restraint reads as premium.** Subtle motion, hairline detailing, and a tight
   type scale signal quality without flash.
5. **Consistency over cleverness.** A small, reusable component set applied
   uniformly — this is what keeps a growing, multi-author catalog coherent.

---

## 2. Confirmed direction (P3 decisions)

| Dimension | Decision |
|-----------|----------|
| Color | **Neutral/greyscale UI; photography carries all color.** No brand accent hue. |
| Theme | **Light only at launch.** Build with CSS variables so dark mode can be added later without rework. |
| Typography | **Cormorant Garamond (serif) for all content copy.** Functional UI (buttons, links, form controls) uses a separate typeface — TBD. See §4 and §9. |
| Motion | **Subtle, refined transitions only** (Apple-style). Never flashy. |

---

## 3. Color system (neutral)

Monochromatic, very slightly **warm** neutrals to avoid a clinical feel. Pure
black is avoided for text (near-black is softer). The only chromatic color on any
page comes from imagery.

```scss
// Backgrounds
$color-bg: #FBFBFA; // page background — warm off-white
$color-surface: #FFFFFF; // cards, elevated surfaces
$color-surface-muted: #F2F2F0; // subtle fills, hover backgrounds

// Text
$color-text: #17171A; // primary (near-black, not #000)
$color-text-secondary: #5E5E63; // secondary / meta
$color-text-muted: #9A9A9E; // captions, disabled

// Lines & borders
$color-border: rgba(0, 0, 0, 0.10); // hairline dividers, card edges

// Interactive (monochrome)
$color-cta: #17171A; // primary button = near-black on light
$color-cta-text: #FFFFFF;
$color-focus: #17171A; // focus ring (2px, offset)
```

**Rules**

- No accent color; links/CTAs express state through weight, underline, and
  greyscale contrast — not hue.
- Maintain **WCAG AA** contrast: primary text ≥ 4.5:1 (met by `#17171A` on `#FBFBFA`).
- Photography provides all vibrancy; never tint or overlay images with brand color.

---

## 4. Typography

**Cormorant Garamond** (serif) is the typeface for all content copy — headings,
body text, nav labels, meta, captions, everything a visitor reads.

```scss
$font-serif: "Cormorant Garamond", Garamond, "Times New Roman", serif;
```

**Functional UI** — buttons, links, form inputs, and other interactive
controls — uses a **separate typeface, not yet decided**. Until that choice is
made, treat `$font-sans` (Inter, per the earlier draft) as the placeholder for
those elements only; do not extend Cormorant Garamond to interactive controls
in implementation ahead of that decision.

```scss
$font-sans: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI",
Roboto, Helvetica, Arial, sans-serif; // placeholder for functional UI — TBD
```

**Weights:** Cormorant Garamond ships 300–700 plus italics. Use Regular (400)
for body, Medium (500) for emphasis, Semibold (600) for headings — mirrors the
previous weight logic. Avoid the lightest (300) below `body` size; a light
serif at small sizes loses legibility fast.

**Legibility note:** Cormorant Garamond has a smaller x-height than Inter, so
sizes carried over unchanged from the old sans-only scale will read smaller
and lighter — re-check contrast and body size (likely nudge `body` up rather
than keep it exactly at 17px) once implemented.

**Type scale** (≈1.25 modular, fluid via `clamp()` for headings):

| Token | Size (desktop) | Use |
|-------|----------------|-----|
| `display` | 48–64px | Hero headline |
| `h1` | 34–40px | Page title |
| `h2` | 26–30px | Section |
| `h3` | 20–22px | Card title / subsection |
| `body` | 17px | Default reading size |
| `small` | 15px | Meta, secondary |
| `caption` | 13px | Labels, captions |

**Rules**

- Line-height ~1.5 for body, ~1.15–1.25 for headings.
- Generous measure: body text max ~68–72ch for readability.
- Tracking: slightly tighter on large headings, default on body.

---

## 5. Layout, spacing & shape

**Spacing scale** (4px base):

```
4 · 8 · 12 · 16 · 24 · 32 · 48 · 64 · 96 · 128
```

**Grid & containers**

- Content max-width 1280px; reading content narrower 720px.
- Whitespace is a primary design element — be generous; don't fill space.
- Responsive, **mobile-first** (PRD M9). 12-col grid on desktop, single column on mobile.

**Shape & elevation**

- **Soft radius** (Apple-like): `$radius: 12px` for cards/media, `$radius-sm: 8px`
  for buttons/inputs.
- Prefer **hairline borders** (`$color-border`) over shadows. Use shadows only
  when necessary, and keep them very soft and low:
  ```scss
  $shadow-sm: 0 1px 2px rgba(0,0,0,0.04);
  $shadow-md: 0 6px 24px rgba(0,0,0,0.06);
  ```
- No heavy drop shadows, no gradients, no borders-on-borders.

---

## 6. Imagery

Photography is the brand. Treat it with discipline:

- **Consistent aspect ratios**: cards 3:2 (or 4:3); hero full-bleed 16:9 or taller.
- `object-fit: cover`, focal-point aware (Craft asset focal points).
- Responsive `srcset` + lazy loading; optimized transforms (arch. §5).
- No filters, no brand-color overlays. Optional very subtle darkening gradient
  only where text overlays an image (for legibility), nothing more.
- Curation implies a quality bar — bright, high-resolution, well-composed only.

---

## 7. Motion

Subtle and purposeful. "No flashy" = no parallax circus, no bounce, no
attention-grabbing loops. Refined micro-interactions are welcome.

```scss
$ease: cubic-bezier(0.4, 0, 0.2, 1); // ease-out standard
$dur-fast: 150ms;
$dur-base: 220ms;
```

- Hover: gentle opacity/elevation change; optional **very slow, subtle image zoom**
  on card hover (scale ≤ 1.03).
- Transitions on color, opacity, transform only (cheap to render).
- Smooth scroll acceptable.
- **Always respect `prefers-reduced-motion: reduce`** — disable non-essential motion.

---

## 8. Components (tone)

- **Buttons:** primary = near-black fill, white text, soft radius; secondary =
  hairline-bordered, transparent. Minimal, clear hit areas.
- **Cards (listing):** image + title + location/type meta + optional badges
  (Verified, Featured). Hairline border or none; hover lifts subtly.
- **Nav:** slim, white/transparent, minimal items; sticky optional. No mega-menus.
- **Badges:** quiet, monochrome (Verified = subtle checkmark chip). Never loud.
- **Forms:** clean, generous padding, hairline borders, clear focus ring.

---

## 9. Logo / wordmark (confirmed)

Name is **LocoStay** / locostay.com. The wordmark is **text, not artwork** —
two typefaces, no icon:

- **"loco"** — Butterfly Kids (hand-drawn script).
- **"stay"** — Cormorant Garamond, weight 500.

"stay" now shares its typeface with body copy site-wide (§4) — the wordmark's
only remaining exception is "loco" in Butterfly Kids, reserved for the mark
itself and not used elsewhere. Monochrome only, same as the rest of the UI —
`$color-text` (#17171A) on `$color-bg`/`$color-surface`, inverted on dark
surfaces. No color, no gradients, no drop shadow on the mark itself.

**Layouts (both confirmed, used contextually):**

- **Inline** — `loco` + `stay` on one baseline, sized evenly.
- **Stacked** — `loco` above a tracked-out, uppercase `STAY`
  (`letter-spacing: 0.16em`).

**`.com` suffix:** optional per placement. When shown, set in Cormorant
Garamond regular at ~0.4–0.6em of the mark size, muted (~50% opacity of the
mark color), appended after `stay` inline or trailing the stacked `STAY` line.

**Known constraints:**

- Butterfly Kids ships one weight and sits low against the baseline by
  design — expect a manual y-offset in the header implementation, not just
  size-matching to Cormorant Garamond's cap-height.
- Favicon / app icon need a separate fixed-pixel treatment — Butterfly Kids'
  strokes don't survive shrinking to 16–32px. Likely a simplified single
  glyph (e.g. just the "l"), not the full wordmark. Not yet designed.

---

## 10. Accessibility baseline

- WCAG AA color contrast throughout.
- Visible focus states (never remove outlines without replacement).
- Semantic HTML (also SEO-positive).
- Respect reduced-motion.
- Tap targets ≥ 44px on mobile.

---

*These tokens seed the SCSS design system. Revisit and refine when building
templates; keep everything as CSS variables so a future dark theme is additive.*
