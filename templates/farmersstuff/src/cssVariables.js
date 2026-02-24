// Keep in sync with src/theme/brand.ts and CSS variables in globals.css (FarmersStuff brand)

import { theme } from '@/theme/brand'

export const cssVariables = {
  breakpoints: {
    l: 1440,
    m: 1024,
    s: 768,
  },
  colors: {
    base0: theme.colors.text,
    base100: 'rgb(235, 235, 235)',
    base500: 'rgb(128, 128, 128)',
    base850: theme.colors.surface,
    base1000: theme.colors.background,
    error500: 'rgb(255, 111, 118)',
    primary: theme.colors.primary,
  },
}
