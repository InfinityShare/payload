'use client'

import React, { useCallback, useState } from 'react'
import { useConfig, useFormFields, useForm } from '@payloadcms/ui'

export const SpecImportField: React.FC = () => {
  const { config } = useConfig()
  const apiBase = config?.routes?.api ?? '/api'

  const [text, setText] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  const productType = useFormFields(([fields]) => {
    const f = fields['productType']
    return f?.value as string | undefined
  })

  const descriptionShort = useFormFields(([fields]) => {
    const f = fields['description_short']
    return f?.value as string | undefined
  })

  const metaDescription = useFormFields(([fields]) => {
    const f = fields['meta.description']
    return f?.value as string | undefined
  })

  const descriptionLong = useFormFields(([fields]) => {
    const f = fields['description_long']
    return f?.value as unknown
  })

  const { dispatchFields } = useForm()

  const handleExtract = useCallback(async () => {
    if (!text.trim()) {
      setMessage({ type: 'error', text: 'Bitte Text eingeben.' })
      return
    }
    if (!productType) {
      setMessage({ type: 'error', text: 'Bitte zuerst den Produkttyp auswählen.' })
      return
    }

    setLoading(true)
    setMessage(null)

    try {
      const res = await fetch(`${apiBase}/products/extract-specs`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text,
          productType,
          existingDescription: descriptionShort ?? '',
          existingMetaDescription: metaDescription ?? '',
          existingDescriptionLong: descriptionLong ? JSON.stringify(descriptionLong) : '',
        }),
      })

      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: res.statusText }))
        setMessage({ type: 'error', text: err.error ?? 'Fehler bei der KI-Analyse.' })
        return
      }

      const data = await res.json()
      const { specs, description_short, meta_description, description_long } = data as {
        specs: Record<string, unknown>
        description_short?: string | null
        meta_description?: string | null
        description_long?: string | null
      }

      const specsGroupKey = `${productType}Specs`

      function flattenAndDispatch(obj: Record<string, unknown>, prefix: string) {
        for (const [key, value] of Object.entries(obj)) {
          if (value === null || value === undefined) continue
          const path = `${prefix}.${key}`
          if (typeof value === 'object' && !Array.isArray(value)) {
            flattenAndDispatch(value as Record<string, unknown>, path)
          } else {
            dispatchFields({
              type: 'UPDATE',
              path,
              value,
            })
          }
        }
      }

      if (specs && typeof specs === 'object') {
        flattenAndDispatch(specs as Record<string, unknown>, specsGroupKey)
      }

      if (description_short) {
        dispatchFields({
          type: 'UPDATE',
          path: 'description_short',
          value: description_short,
        })
      }

      if (meta_description) {
        dispatchFields({
          type: 'UPDATE',
          path: 'meta.description',
          value: meta_description,
        })
      }

      if (description_long) {
        const lexicalValue = {
          root: {
            type: 'root',
            format: '',
            indent: 0,
            version: 1,
            children: description_long
              .split(/\n\n+/)
              .map((para) => para.trim())
              .filter(Boolean)
              .map((para) => ({
                type: 'paragraph',
                format: '',
                indent: 0,
                version: 1,
                children: [
                  {
                    type: 'text',
                    format: 0,
                    style: '',
                    mode: 'normal',
                    detail: 0,
                    text: para,
                    version: 1,
                  },
                ],
                direction: 'ltr',
                textFormat: 0,
                textStyle: '',
              })),
            direction: 'ltr',
          },
        }
        dispatchFields({
          type: 'UPDATE',
          path: 'description_long',
          value: lexicalValue,
        })
      }

      setMessage({ type: 'success', text: 'Felder wurden erfolgreich befüllt.' })
    } catch (err) {
      console.error('[SpecImportField]', err)
      setMessage({ type: 'error', text: 'Netzwerkfehler bei der KI-Analyse.' })
    } finally {
      setLoading(false)
    }
  }, [
    text,
    productType,
    descriptionShort,
    metaDescription,
    descriptionLong,
    apiBase,
    dispatchFields,
  ])

  const isDisabled = loading || !productType || !text.trim()

  return (
    <div style={{ maxWidth: '720px' }}>
      <h2
        style={{
          fontSize: '18px',
          fontWeight: 700,
          marginBottom: '4px',
          color: 'var(--theme-text)',
        }}
      >
        KI-Spezifikationsimport
      </h2>
      <p
        style={{
          fontSize: '13px',
          color: 'var(--theme-elevation-500)',
          margin: '0 0 20px 0',
          lineHeight: 1.5,
        }}
      >
        Technischen Text einfügen – die KI erkennt Werte und befüllt automatisch die
        Spezifikationsfelder, Kurzbeschreibung, Detailbeschreibung (max. 800 Zeichen) und
        SEO-Beschreibung.
      </p>

      {!productType && (
        <div
          style={{
            padding: '10px 14px',
            marginBottom: '16px',
            background: 'var(--theme-error-100)',
            border: '1px solid var(--theme-error-300)',
            borderRadius: '4px',
            fontSize: '13px',
            color: 'var(--theme-error-500)',
            fontWeight: 500,
          }}
        >
          Bitte zuerst den Produkttyp in der Seitenleiste auswählen.
        </div>
      )}

      <label
        style={{
          display: 'block',
          fontSize: '12px',
          fontWeight: 600,
          marginBottom: '6px',
          color: 'var(--theme-elevation-600)',
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
        }}
      >
        Rohdaten / Datenblatt
      </label>
      <textarea
        disabled={loading}
        onChange={(e) => setText(e.target.value)}
        placeholder="Technischen Text hier einfügen (z.B. Datenblatt, Produktbeschreibung, Tabelle mit Spezifikationen)..."
        rows={16}
        style={{
          width: '100%',
          padding: '10px 12px',
          fontFamily: 'monospace',
          fontSize: '12px',
          lineHeight: 1.6,
          border: '1px solid var(--theme-elevation-200)',
          borderRadius: '4px',
          background: 'var(--theme-input-bg)',
          color: 'var(--theme-text)',
          resize: 'vertical',
          boxSizing: 'border-box',
        }}
        value={text}
      />

      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginTop: '12px' }}>
        <button
          disabled={isDisabled}
          onClick={handleExtract}
          style={{
            padding: '10px 20px',
            background: isDisabled ? 'var(--theme-elevation-200)' : 'var(--theme-success-500)',
            color: isDisabled ? 'var(--theme-elevation-400)' : '#fff',
            border: 'none',
            borderRadius: '4px',
            cursor: isDisabled ? 'not-allowed' : 'pointer',
            fontWeight: 600,
            fontSize: '14px',
            transition: 'background 0.2s',
          }}
          type="button"
        >
          {loading ? '⏳ KI analysiert...' : '✨ KI-Analyse starten'}
        </button>

        {message && (
          <span
            style={{
              fontSize: '13px',
              color:
                message.type === 'success' ? 'var(--theme-success-500)' : 'var(--theme-error-500)',
              fontWeight: 500,
            }}
          >
            {message.type === 'success' ? '✓ ' : '✗ '}
            {message.text}
          </span>
        )}
      </div>
    </div>
  )
}
