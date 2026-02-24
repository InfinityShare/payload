'use client'

import React, { createContext, useCallback, useContext, useEffect, useState } from 'react'

import type { Theme, ThemeContextType } from './types'

import { canUseDOM } from '@/utilities/canUseDOM'
import { themeLocalStorageKey } from './shared'
import { themeIsValid } from './types'

const initialContext: ThemeContextType = {
  setTheme: () => null,
  theme: undefined,
}

const ThemeContext = createContext(initialContext)

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [theme, setThemeState] = useState<Theme | undefined>(
    canUseDOM ? (document.documentElement.getAttribute('data-theme') as Theme) : undefined,
  )

  const setTheme = useCallback((_themeToSet: Theme | null) => {
    window.localStorage.setItem(themeLocalStorageKey, 'dark')
    document.documentElement.setAttribute('data-theme', 'dark')
    setThemeState('dark')
  }, [])

  useEffect(() => {
    window.localStorage.setItem(themeLocalStorageKey, 'dark')
    document.documentElement.setAttribute('data-theme', 'dark')
    setThemeState('dark')
  }, [])

  return <ThemeContext.Provider value={{ setTheme, theme }}>{children}</ThemeContext.Provider>
}

export const useTheme = (): ThemeContextType => useContext(ThemeContext)
