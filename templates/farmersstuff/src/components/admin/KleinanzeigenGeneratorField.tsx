'use client'

import React, { useCallback, useMemo, useState } from 'react'
import { useConfig, useDocumentInfo } from '@payloadcms/ui'
import { KLEINANZEIGEN_CATEGORIES } from '@/collections/Classifieds/categories'

type GeneratedClassified = {
  title: string
  description: string
  category: string | null
  price: number | null
  imageIds: string[]
}

export const KleinanzeigenGeneratorField: React.FC = () => {
  const { config } = useConfig()
  const apiBase = config?.routes?.api ?? '/api'

  const [targetAudience, setTargetAudience] = useState('')
  const [categorySearch, setCategorySearch] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [loading, setLoading] = useState(false)
  const [creating, setCreating] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const [generated, setGenerated] = useState<GeneratedClassified | null>(null)
  const [createdId, setCreatedId] = useState<string | null>(null)

  const filteredCategories = useMemo(() => {
    const q = categorySearch.toLowerCase()
    if (!q) return KLEINANZEIGEN_CATEGORIES
    return KLEINANZEIGEN_CATEGORIES.filter((c) => c.label.toLowerCase().includes(q))
  }, [categorySearch])

  const { id: productId } = useDocumentInfo()

  const handleGenerate = useCallback(async () => {
    if (!targetAudience.trim()) {
      setMessage({ type: 'error', text: 'Bitte eine Zielgruppe eingeben.' })
      return
    }
    if (!productId) {
      setMessage({ type: 'error', text: 'Produkt muss zuerst gespeichert werden.' })
      return
    }

    setLoading(true)
    setMessage(null)
    setGenerated(null)
    setCreatedId(null)

    try {
      const res = await fetch(`${apiBase}/products/generate-classified`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId, targetAudience }),
      })

      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: res.statusText }))
        setMessage({ type: 'error', text: err.error ?? 'Fehler bei der KI-Generierung.' })
        return
      }

      const data = (await res.json()) as GeneratedClassified
      setGenerated(data)
      if (data.category) {
        setSelectedCategory(data.category)
        setCategorySearch('')
      }
      setMessage({
        type: 'success',
        text: `Generiert${data.category ? ' – Kategorie automatisch gewählt' : ''}${data.price != null ? ` – Preis: ${data.price} €` : ''}${data.imageIds.length > 0 ? ` – ${data.imageIds.length} Bild(er) übernommen` : ''}`,
      })
    } catch (err) {
      console.error('[KleinanzeigenGeneratorField]', err)
      setMessage({ type: 'error', text: 'Netzwerkfehler bei der KI-Generierung.' })
    } finally {
      setLoading(false)
    }
  }, [targetAudience, productId, apiBase])

  const handleCreate = useCallback(async () => {
    if (!generated || !productId) return
    if (!selectedCategory) {
      setMessage({ type: 'error', text: 'Bitte eine Kategorie auswählen.' })
      return
    }

    setCreating(true)
    setMessage(null)

    try {
      const res = await fetch(`${apiBase}/classifieds`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: generated.title,
          description: generated.description,
          category: selectedCategory,
          product: productId,
          ...(generated.price != null ? { price: generated.price } : {}),
          ...(generated.imageIds.length > 0
            ? { images: generated.imageIds.map((id) => ({ image: id })) }
            : {}),
        }),
      })

      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: res.statusText }))
        setMessage({
          type: 'error',
          text: err.errors?.[0]?.message ?? err.error ?? 'Fehler beim Erstellen.',
        })
        return
      }

      const doc = await res.json()
      const id = doc?.doc?.id ?? doc?.id
      setCreatedId(id)
      setMessage({ type: 'success', text: 'Kleinanzeige erfolgreich erstellt!' })
    } catch (err) {
      console.error('[KleinanzeigenGeneratorField] create', err)
      setMessage({ type: 'error', text: 'Netzwerkfehler beim Erstellen.' })
    } finally {
      setCreating(false)
    }
  }, [generated, productId, selectedCategory, apiBase])

  const isGenerateDisabled = loading || !targetAudience.trim() || !productId

  return (
    <div style={{ maxWidth: '800px' }}>
      <h2
        style={{
          fontSize: '18px',
          fontWeight: 700,
          marginBottom: '4px',
          color: 'var(--theme-text)',
        }}
      >
        KI-Kleinanzeigen-Generator
      </h2>
      <p
        style={{
          fontSize: '13px',
          color: 'var(--theme-elevation-500)',
          margin: '0 0 20px 0',
          lineHeight: 1.5,
        }}
      >
        Zielgruppe eingeben – die KI erstellt automatisch einen optimierten Titel und eine
        zielgruppengerechte Beschreibung inkl. verwandter Produkte, Öffnungszeiten und
        Beschreibungsvorlage aus den Einstellungen.
      </p>

      {!productId && (
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
          Produkt muss zuerst gespeichert werden, bevor eine Kleinanzeige generiert werden kann.
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
        Kategorie *
      </label>
      <input
        disabled={!productId}
        onChange={(e) => setCategorySearch(e.target.value)}
        placeholder="Kategorie suchen..."
        style={{
          width: '100%',
          padding: '8px 12px',
          fontSize: '13px',
          border: '1px solid var(--theme-elevation-200)',
          borderRadius: '4px 4px 0 0',
          background: 'var(--theme-input-bg)',
          color: 'var(--theme-text)',
          boxSizing: 'border-box',
          borderBottom: 'none',
        }}
        type="text"
        value={categorySearch}
      />
      <select
        disabled={!productId}
        onChange={(e) => setSelectedCategory(e.target.value)}
        size={6}
        style={{
          width: '100%',
          padding: '4px 0',
          fontSize: '13px',
          border: '1px solid var(--theme-elevation-200)',
          borderRadius: '0 0 4px 4px',
          background: 'var(--theme-input-bg)',
          color: 'var(--theme-text)',
          boxSizing: 'border-box',
          marginBottom: '16px',
        }}
        value={selectedCategory}
      >
        <option value="">-- Bitte wählen --</option>
        {filteredCategories.map((c) => (
          <option key={c.value} value={c.value}>
            {c.label}
          </option>
        ))}
      </select>
      {selectedCategory && (
        <div
          style={{
            fontSize: '12px',
            color: 'var(--theme-success-500)',
            marginTop: '-12px',
            marginBottom: '16px',
          }}
        >
          ✓ {KLEINANZEIGEN_CATEGORIES.find((c) => c.value === selectedCategory)?.label}
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
        Zielgruppe
      </label>
      <input
        disabled={loading || !productId}
        onChange={(e) => setTargetAudience(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && !isGenerateDisabled) handleGenerate()
        }}
        placeholder='z.B. "Landwirte mit kleinem Betrieb", "Hobbylandwirte", "Lohnunternehmer"'
        style={{
          width: '100%',
          padding: '10px 12px',
          fontSize: '14px',
          border: '1px solid var(--theme-elevation-200)',
          borderRadius: '4px',
          background: 'var(--theme-input-bg)',
          color: 'var(--theme-text)',
          boxSizing: 'border-box',
          marginBottom: '12px',
        }}
        type="text"
        value={targetAudience}
      />

      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
        <button
          disabled={isGenerateDisabled}
          onClick={handleGenerate}
          style={{
            padding: '10px 20px',
            background: isGenerateDisabled
              ? 'var(--theme-elevation-200)'
              : 'var(--theme-success-500)',
            color: isGenerateDisabled ? 'var(--theme-elevation-400)' : '#fff',
            border: 'none',
            borderRadius: '4px',
            cursor: isGenerateDisabled ? 'not-allowed' : 'pointer',
            fontWeight: 600,
            fontSize: '14px',
            transition: 'background 0.2s',
          }}
          type="button"
        >
          {loading ? '⏳ KI generiert...' : '✨ Kleinanzeige generieren'}
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

      {generated && (
        <div
          style={{
            border: '1px solid var(--theme-elevation-200)',
            borderRadius: '6px',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              padding: '12px 16px',
              background: 'var(--theme-elevation-50)',
              borderBottom: '1px solid var(--theme-elevation-200)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <span style={{ fontWeight: 600, fontSize: '13px', color: 'var(--theme-text)' }}>
              Vorschau
            </span>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <button
                disabled={loading}
                onClick={handleGenerate}
                style={{
                  padding: '5px 12px',
                  background: 'transparent',
                  color: 'var(--theme-elevation-500)',
                  border: '1px solid var(--theme-elevation-300)',
                  borderRadius: '4px',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  fontSize: '12px',
                }}
                type="button"
              >
                ↻ Neu generieren
              </button>
              {createdId ? (
                <a
                  href={`/admin/collections/classifieds/${createdId}`}
                  style={{
                    padding: '5px 14px',
                    background: 'var(--theme-success-500)',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '4px',
                    fontSize: '12px',
                    fontWeight: 600,
                    textDecoration: 'none',
                    display: 'inline-block',
                  }}
                >
                  → Kleinanzeige öffnen
                </a>
              ) : (
                <button
                  disabled={creating}
                  onClick={handleCreate}
                  style={{
                    padding: '5px 14px',
                    background: creating
                      ? 'var(--theme-elevation-200)'
                      : 'var(--theme-success-500)',
                    color: creating ? 'var(--theme-elevation-400)' : '#fff',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: creating ? 'not-allowed' : 'pointer',
                    fontSize: '12px',
                    fontWeight: 600,
                  }}
                  type="button"
                >
                  {creating ? '⏳ Erstelle...' : '+ Kleinanzeige erstellen'}
                </button>
              )}
            </div>
          </div>

          <div style={{ padding: '20px' }}>
            <div style={{ marginBottom: '16px' }}>
              <div
                style={{
                  fontSize: '11px',
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  color: 'var(--theme-elevation-500)',
                  marginBottom: '6px',
                }}
              >
                Titel
              </div>
              <div
                contentEditable
                onBlur={(e) =>
                  setGenerated((prev) =>
                    prev ? { ...prev, title: e.currentTarget.textContent ?? '' } : null,
                  )
                }
                style={{
                  fontSize: '18px',
                  fontWeight: 700,
                  color: 'var(--theme-text)',
                  padding: '8px',
                  border: '1px dashed var(--theme-elevation-200)',
                  borderRadius: '4px',
                  outline: 'none',
                  minHeight: '36px',
                }}
                suppressContentEditableWarning
              >
                {generated.title}
              </div>
              <div
                style={{
                  fontSize: '11px',
                  color:
                    generated.title.length > 60
                      ? 'var(--theme-error-500)'
                      : 'var(--theme-elevation-400)',
                  marginTop: '4px',
                }}
              >
                {generated.title.length}/60 Zeichen
              </div>
            </div>

            <div>
              <div
                style={{
                  fontSize: '11px',
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  color: 'var(--theme-elevation-500)',
                  marginBottom: '6px',
                }}
              >
                Beschreibung
              </div>
              <textarea
                onChange={(e) =>
                  setGenerated((prev) => (prev ? { ...prev, description: e.target.value } : null))
                }
                rows={16}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  fontSize: '13px',
                  lineHeight: 1.6,
                  border: '1px dashed var(--theme-elevation-200)',
                  borderRadius: '4px',
                  background: 'var(--theme-input-bg)',
                  color: 'var(--theme-text)',
                  resize: 'vertical',
                  boxSizing: 'border-box',
                  fontFamily: 'inherit',
                }}
                value={generated.description}
              />
              <div
                style={{
                  fontSize: '11px',
                  color:
                    generated.description.length > 4000
                      ? 'var(--theme-error-500)'
                      : 'var(--theme-elevation-400)',
                  marginTop: '4px',
                }}
              >
                {generated.description.length}/4000 Zeichen
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
