'use client'

import type { StaticDescription, StaticLabel } from 'payload'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { FieldDescription, FieldLabel, useConfig, useField } from '@payloadcms/ui'

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

/** Value may be stored as full (119) or cents (11900). Display as decimal. */
function toDisplayValue(value: number | null | undefined): string {
  if (value == null || typeof value !== 'number' || Number.isNaN(value)) return ''
  if (value >= 1000 && Number.isInteger(value)) return (value / 100).toFixed(2)
  return value.toFixed(2)
}

function fromDisplayValue(displayValue: string): number | null {
  if (displayValue.trim() === '') return null
  const n = parseFloat(displayValue.replace(',', '.'))
  return Number.isNaN(n) ? null : n
}

const baseClass = 'formattedPrice'

type Props = {
  path: string
  label?: StaticLabel
  description?: StaticDescription
  readOnly?: boolean
  placeholder?: string
}

export const ShopCurrencyPriceInput: React.FC<Props> = ({
  path,
  label,
  description,
  readOnly = false,
  placeholder = '0.00',
}) => {
  const { config } = useConfig()
  const apiBase = config?.routes?.api ?? '/api'
  const { setValue, value } = useField<number>({ path })
  const [symbol, setSymbol] = useState<string>('€')
  const [displayValue, setDisplayValue] = useState<string>('')
  const isFirstRender = useRef(true)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    getShopSettings(apiBase).then((data) => {
      const code = data?.currency ?? 'EUR'
      setSymbol(CURRENCY_SYMBOLS[code] ?? code)
    })
  }, [apiBase])

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false
      setDisplayValue(toDisplayValue(value))
    }
  }, [value])

  const flushValue = useCallback(
    (inputValue: string) => {
      const next = fromDisplayValue(inputValue)
      setValue(next)
    },
    [setValue],
  )

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const inputValue = e.target.value
      if (!/^\d*[,.]?\d*$/.test(inputValue) && inputValue !== '') return
      setDisplayValue(inputValue)
      if (debounceRef.current) clearTimeout(debounceRef.current)
      debounceRef.current = setTimeout(() => flushValue(inputValue), 500)
    },
    [flushValue],
  )

  const handleBlur = useCallback(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current)
      debounceRef.current = null
    }
    flushValue(displayValue)
    const parsed = fromDisplayValue(displayValue)
    setDisplayValue(parsed != null ? Number(parsed).toFixed(2) : '')
  }, [displayValue, flushValue])

  const id = path.replace(/\./g, '-')

  return (
    <div className={`field-type number ${baseClass}`}>
      {label && <FieldLabel as="label" htmlFor={id} label={label} />}
      <div className={`${baseClass}Container`}>
        <div className={`${baseClass}CurrencySymbol`}>
          <span>{symbol}</span>
        </div>
        <input
          aria-label={typeof label === 'string' ? label : undefined}
          className={`${baseClass}Input`}
          disabled={readOnly}
          id={id}
          onBlur={handleBlur}
          onChange={handleChange}
          placeholder={placeholder}
          type="text"
          value={displayValue}
        />
      </div>
      {description && (
        <FieldDescription
          className={`${baseClass}Description`}
          description={description}
          path={path}
        />
      )}
    </div>
  )
}
