# Sprint 01 — PDP Branding Implementation

Status: In Progress
Owner: MetaMan (Execution) / Fellipe (Coordination)
Date: 2026-02-24

## Sprint Goal

Deliver full branded Product Detail Page (PDP) aligned with approved style references.

## Constraints (Locked)

- Primary color: `#D05D29`
- System fonts only (no webfonts)
- Assets from `/public/assets`
- Payload-compatible content behavior

## Ticket Breakdown

### T1 — Design Tokens Hard Lock

- Scope:
  - Apply final font stacks globally.
  - Enforce `#D05D29` as primary signal color.
  - Add reusable utility classes for CTA, badge, price highlight.
- Files:
  - `src/app/(app)/globals.css`
  - `tailwind.config.mjs`
- Acceptance:
  - No webfont imports.
  - CTA and highlights render consistently across PDP components.

### T2 — PDP Hero + Gallery Layout

- Scope:
  - Main product image + thumbnail rail.
  - Structured right-side purchase panel and key bullet specs.
- Files:
  - `src/components/product/Gallery.tsx`
  - PDP route component in `src/app/(app)/products/*`
- Acceptance:
  - Visual hierarchy matches reference.
  - Responsive gallery behavior works desktop/mobile.

### T3 — Price / CTA / Availability Block

- Scope:
  - High-emphasis price typography.
  - Primary action button + secondary availability action.
  - Contact row in branded style.
- Files:
  - PDP route + shared product components
- Acceptance:
  - CTA contrast + spacing + click targets are production-ready.

### T4 — Technical Specs & Feature Blocks

- Scope:
  - Table-like technical data section.
  - Feature bullets with clear icon/text rhythm.
- Files:
  - `src/components/product/ProductDescription.tsx`
- Acceptance:
  - Structured data readability equal to reference hierarchy.

### T5 — Accessories + Embedded Video

- Scope:
  - Related accessories cards with branded mini-CTA.
  - Video module framed in branded container.
- Files:
  - `src/components/product/*`
- Acceptance:
  - Accessory cards support variable item count cleanly.

### T6 — Footer Service Bar Styling (PDP scope)

- Scope:
  - Service/contact strip + legal footer line in brand look.
- Files:
  - `src/components/Footer/*`
- Acceptance:
  - Footer tone and spacing visually consistent with references.

### T7 — Responsive + QA Pass

- Scope:
  - Desktop/tablet/mobile polish and regressions.
- Breakpoints:
  - 1440 / 1280 / 1024 / 768 / 430 / 390
- Acceptance:
  - No layout breaks; CTA and pricing remain prominent.

## Definition of Done

- PDP merged in branded state with visual parity for structure and tone.
- No webfont usage.
- Brand orange and system font stack consistent.
- QA checklist completed and documented.
