# FarmersStuff Branding Implementation Plan

Date: 2026-02-24
Owner: Fellipe (PM)
Execution Lead: MetaMan (Dev)

## Locked Decisions

- Brand primary color: `#D05D29`
- Fonts: system-only, no webfonts
  - Headlines: `Arial Black, "Arial Narrow Bold", Arial, sans-serif`
  - Body/UI: `-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif`
  - Fallback: `system-ui, sans-serif`
- Assets source: `/public/assets`
- Hero images: placeholder/block-driven via Payload content

## Priority Order

1. Product Detail Page (PDP)
2. Homepage
3. Listing

---

## Phase 1 — Product Detail Page (Highest Priority)

### Scope

- Rebuild visual hierarchy to match provided design:
  - Large product image + thumbnail strip
  - Price + primary CTA block
  - Availability/check button style
  - Feature bullets and technical specs table
  - Accessory cards section
  - Video block with branded framing
  - Service/contact strip + legal footer style

### Component Targets

- `src/components/product/Gallery.tsx`
- `src/components/product/ProductDescription.tsx`
- `src/components/product/*`
- `src/components/ProductItem/*` (if shared card primitives are reused)
- `src/components/Footer/*`
- `src/app/(app)/products/[slug]/*` (or current PDP route implementation)
- shared theme tokens in `src/app/(app)/globals.css`

### Acceptance Criteria

- Brand orange (`#D05D29`) used consistently for CTA, emphasis, price markers, bullets
- No external/webfont usage
- Visual parity with reference for:
  - image gallery
  - CTA/price block
  - specs + accessories layout
- Responsive behavior verified on mobile/tablet/desktop

---

## Phase 2 — Homepage

### Scope

- Hero area with industrial visual style, strong headline/CTA
- Promotional tiles / offer sections
- Category strip + service strip
- Branded header/nav and footer

### Payload/Content Constraints

- Hero and promotion modules should be block-compatible and editable in Payload
- Use placeholders where editor-driven media is expected

### Acceptance Criteria

- Homepage can be fully managed via configured blocks/data
- Visual style and spacing match the supplied references

---

## Phase 3 — Listing Page

### Scope

- Sidebar filters (PS, drive type, gearbox, brand, availability)
- Product grid cards, sort control, pagination
- Label styles (availability, badges)

### Acceptance Criteria

- Filter/sidebar and card system align visually with design reference
- Listing remains performant and readable at responsive breakpoints

---

## Cross-Cutting Technical Tasks

- Centralize brand tokens in `globals.css`
- Define utility classes for repeated orange CTAs, badge chips, section separators
- Ensure no hardcoded one-off colors outside tokenized system
- Add visual regression checklist for PDP/Home/Listing

## QA Checklist

- Desktop: 1440, 1280
- Tablet: 1024, 768
- Mobile: 430, 390
- Browser sanity: Chrome, Safari
- Core UX: CTA visibility, typography consistency, image proportions, footer/header continuity

## Immediate Execution Queue (Start Now)

1. Token + typography hard lock (system fonts + #D05D29)
2. PDP component restyle pass
3. PDP responsive pass + QA
4. Homepage restyle pass
5. Listing restyle pass
