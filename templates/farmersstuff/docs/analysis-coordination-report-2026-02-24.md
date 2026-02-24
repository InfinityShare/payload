# PayloadCommerce / farmersstuff — Feature Analysis & Coordination Plan

Date: 2026-02-24
Owner: Fellipe (Project Manager)
Scope: `/Users/timoklein/Development/PayloadCommerce/payload/templates/farmersstuff`

## 1) Current Feature Baseline

### Platform & Stack

- Payload CMS + Next.js (App Router) in one project.
- MongoDB adapter (`@payloadcms/db-mongodb`).
- Stripe integration and ecommerce plugin enabled.
- Lexical editor enabled with AI feature (`@ai-stack/payloadcms`).
- Test setup: Vitest (integration), Playwright (E2E).

### Core Product Capabilities

- Authentication and role-based access model.
- CMS collections: Users, Pages, Categories, Media, Classifieds.
- Globals: Header, Footer, ShopSettings, ImageSettings, KleinanzeigenSettings.
- Draft/preview/live-preview + on-demand revalidation patterns.
- Commerce flows present in app routes:
  - product browsing (`/products`, `/shop`)
  - account/login/create-account/forgot-password
  - checkout and order finding

### Custom Domain Capability (Marketplace / Kleinanzeigen)

Custom `classifieds` collection includes:

- listing content model (title, description, category, attributes)
- price + shipping model
- contact profile defaults from global settings
- automation parameters:
  - republication interval
  - auto price reduction (strategy, amount, min-price, delays)
  - repost and reduction counters
- platform mapping fields:
  - `active`, `kleinanzeigen_id`, `kleinanzeigen_created_on`, `content_hash`
- product-link support (`relationship` to products) and derived article number.
- admin custom view: `classifieds-overview`.

### Plugin-Level Extensions

- local plugin `payload-bulkimageimport`
- local plugin `payload-lexwareapi`

## 2) Architectural Assessment (What’s strong)

- Good separation of content collections vs global operational settings.
- Automation-ready model for classifieds (repost + dynamic repricing).
- Production-oriented quality controls already present (tests + typed setup).
- Clear runway for catalog + content + transactional behavior in one stack.

## 3) Gaps / Risks

- No explicit operations dashboard for automation health (failed reposts, pricing events, sync errors).
- Unknown idempotency/observability guarantees for external platform sync.
- No explicit KPI layer visible for conversion funnel, listing velocity, repricing impact.
- Not yet documented integration contracts for `payload-lexwareapi` and `payload-bulkimageimport`.

## 4) Coordination Plan (Developers)

### Workstream A — Discovery & Hardening

Owner: MetaMan (Developer Lead)

- Map current endpoint and hook flow for classifieds publication lifecycle.
- Validate error handling for external sync fields (`kleinanzeigen_*`).
- Define idempotent update strategy and retry semantics.

### Workstream B — Product Requirements Backlog

Owner: Fellipe + MetaMan

- Convert identified gaps into implementation tickets with acceptance criteria.
- Prioritize by business impact: listing reliability > analytics > UX improvements.

### Workstream C — Visibility & Control

Owner: MetaMan

- Implement admin diagnostics panel for classifieds automation:
  - last sync status
  - retry count / failure reason
  - next scheduled republish
  - price reduction history timeline

### Workstream D — Future Commercial Readiness

Owner: Fellipe (planning) + dev team (execution)

- KPI instrumentation (CTR, conversion, listing performance, margin after repricing).
- Multi-channel listing abstraction (if expansion beyond Kleinanzeigen is planned).

## 5) Planned Tasks (Near/Mid-Term)

### Next 2 weeks

1. Technical deep dive of classifieds lifecycle and external sync path.
2. Implement observability primitives for automation state.
3. Add regression tests around republish + price reduction logic.

### Next 30–60 days

1. Build operator dashboard for listing operations.
2. Add event log model for pricing and publication changes.
3. Harden plugin contracts and document sync behaviors.

### Next 90+ days

1. Multi-platform listing abstraction strategy.
2. Intelligence layer for pricing recommendations.
3. Executive reporting view (business + ops metrics).

## 6) Decision Requests for Timo

- Confirm priority order:
  1. Reliability/automation hardening
  2. Operational observability
  3. Analytics/KPI instrumentation
- Confirm whether multi-platform listing is in-scope for this quarter.

---

This document is the baseline for team coordination and implementation tracking.
