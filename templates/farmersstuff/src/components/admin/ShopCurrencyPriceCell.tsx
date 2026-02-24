'use client'

import type { DefaultCellComponentProps } from 'payload'
import React, { useEffect, useState } from 'react'
import { useConfig } from '@payloadcms/ui'

const CURRENCY_SYMBOLS: Record<string, string> = {
  EUR: '€',
  USD: '$',
  CHF: 'Fr.',
  GBP: '£',
}

let shopSettingsCache: { currency?: string } | null = null
let shopSettingsPromise: Promise<{ currency?: string }> | null = null

function getShopSettings(apiBase: string): Promise<{ currency?: string }> {
  if (shopSettingsCache) return Promise.resolve(shopSettingsCache)
  if (shopSettingsPromise) return shopSettingsPromise
  shopSettingsPromise = fetch(`${apiBase}/globals/shop-settings`, { credentials: 'include' })
    .then((res) => (res.ok ? res.json() : {}))
    .then((data) => {
      shopSettingsCache = data
      return data
    })
    .catch(() => ({}))
  return shopSettingsPromise
}

/** Format price. E-commerce plugin stores in base/cents (e.g. 11900 = 119.00). Lexware may store full (119). */
function formatPrice(value: number): string {
  if (typeof value !== 'number' || Number.isNaN(value)) return '0.00'
  if (value >= 1000 && Number.isInteger(value)) return (value / 100).toFixed(2)
  return value.toFixed(2)
}

export const ShopCurrencyPriceCell: React.FC<
  DefaultCellComponentProps<number> & { cellData?: number; rowData?: Record<string, unknown> }
> = ({ cellData, rowData }) => {
  const { config } = useConfig()
  const apiBase = config?.routes?.api ?? '/api'
  const [symbol, setSymbol] = useState<string>('€')

  useEffect(() => {
    getShopSettings(apiBase).then((data) => {
      const code = data?.currency ?? 'EUR'
      setSymbol(CURRENCY_SYMBOLS[code] ?? code)
    })
  }, [apiBase])

  if (
    (!cellData || typeof cellData !== 'number') &&
    rowData &&
    'enableVariants' in rowData &&
    rowData.enableVariants
  ) {
    return <span>In Varianten</span>
  }

  if (!cellData && cellData !== 0) {
    return <span>—</span>
  }

  return (
    <span>
      {symbol}
      {formatPrice(cellData)}
    </span>
  )
}
