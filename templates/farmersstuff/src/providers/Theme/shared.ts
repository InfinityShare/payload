import type { Theme } from './types'

export const themeLocalStorageKey = 'payload-theme'

/** FarmersStuff brand is dark industrial; default to dark when no preference is set */
export const defaultTheme = 'dark'

export const getImplicitPreference = (): Theme | null => {
  const mediaQuery = '(prefers-color-scheme: dark)'
  const mql = window.matchMedia(mediaQuery)
  const hasImplicitPreference = typeof mql.matches === 'boolean'

  if (hasImplicitPreference) {
    return mql.matches ? 'dark' : 'light'
  }

  return null
}
