/**
 * FarmersStuff Brand Design Tokens
 * Single source of truth for color, radius, and shadow.
 * Use these tokens in CSS (via globals.css) and in JS (e.g. Stripe, charts).
 *
 * Brand: Compact tractor & equipment dealer. Tone: Tough, direct, industrial.
 * Orange = CTA, highlights, hover, icons only. Never large background fills.
 */

export const theme = {
  colors: {
    /** Signal Orange – CTAs, highlights, hover, icons only */
    primary: '#FF5A00',
    /** Deep Anthracite – main background */
    background: '#1A1A1A',
    /** Graphite – cards, surfaces */
    surface: '#242424',
    /** Industrial Gray – alternate surfaces */
    surfaceAlt: '#2E2E2E',
    /** White – primary text and on-orange text */
    text: '#FFFFFF',
    /** Subtle borders */
    border: '#3A3A3A',
  },
  /** Sharp industrial; max 4px */
  radius: '4px',
  /** Very subtle elevation only */
  shadow: '0 2px 8px rgba(0,0,0,0.35)',
} as const

/** Hex values for use in JS (Stripe, etc.) */
export const brandColors = theme.colors
