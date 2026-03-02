/**
 * Category slug → article number prefix (101–126).
 * Article numbers are built as: prefix + 4-digit sequence (e.g. 1010001, 1010002).
 * Slugs must match the categories collection (same slugify as in seed).
 */
export const CATEGORY_ARTICLE_PREFIX: Record<string, number> = {
  traktoren: 101,
  frontlader: 102,
  reifen: 103,
  'farmers-stuff': 104,
  frontladeranbauten: 105,
  'ersatzteile-und-zubehoer': 106,
  bagger: 107,
  'bagger-zubehoer': 108,
  mulcher: 109,
  fraesen: 110,
  verschleissteile: 111,
  'spalter-saegen': 112,
  heckcontainer: 113,
  'anbaugeraete-sonstiges': 114,
  walzen: 115,
  wiesenschleppe: 116,
  'traktorbedarf-oberlenker-etc': 117,
  haecksler: 118,
  reitplatzplaner: 119,
  anhanger: 120,
  kompaktlader: 121,
  'kompaktlader-zubehoer': 122,
  'gebrauchte-maschinen': 123,
  'dumper-e-schubkarren': 124,
  hoflader: 125,
  'hoflader-zubehoer': 126,
}

/** Normalize category title to slug (must match seed slugify). */
export function slugifyCategory(title: string): string {
  return title
    .toLowerCase()
    .replace(/ä/g, 'ae')
    .replace(/ö/g, 'oe')
    .replace(/ü/g, 'ue')
    .replace(/ß/g, 'ss')
    .replace(/&/g, 'und')
    .replace(/\s*\/\s*/g, '-')
    .replace(/[,\s]+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
}

/**
 * Returns the article number prefix for a category (by slug or title), or null if unknown.
 */
export function getArticleNumberPrefixForCategory(categorySlugOrTitle: string): number | null {
  const slug =
    categorySlugOrTitle.includes('-') || /^[a-z0-9-]+$/.test(categorySlugOrTitle)
      ? categorySlugOrTitle
      : slugifyCategory(categorySlugOrTitle)
  return CATEGORY_ARTICLE_PREFIX[slug] ?? null
}
