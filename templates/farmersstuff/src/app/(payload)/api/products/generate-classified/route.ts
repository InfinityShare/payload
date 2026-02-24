import { getPayload } from 'payload'
import config from '@payload-config'
import { NextRequest, NextResponse } from 'next/server'
import { KLEINANZEIGEN_CATEGORIES } from '@/collections/Classifieds/categories'

export async function POST(req: NextRequest) {
  try {
    const apiKey = process.env.OPENAI_API_KEY
    if (!apiKey) {
      return NextResponse.json({ error: 'OPENAI_API_KEY not configured' }, { status: 500 })
    }

    const payload = await getPayload({ config })

    const { productId, targetAudience } = (await req.json()) as {
      productId: string
      targetAudience: string
    }

    if (!productId || !targetAudience?.trim()) {
      return NextResponse.json(
        { error: 'productId und targetAudience sind erforderlich' },
        { status: 400 },
      )
    }

    const product = await payload.findByID({
      collection: 'products',
      id: productId,
      depth: 2,
    })

    if (!product) {
      return NextResponse.json({ error: 'Produkt nicht gefunden' }, { status: 404 })
    }

    const settings = await payload.findGlobal({ slug: 'kleinanzeigen-settings' })
    const openingHours = (settings as any)?.opening_hours ?? null
    const descriptionTemplate = (settings as any)?.description_template ?? null

    const relatedProducts = Array.isArray((product as any).relatedProducts)
      ? (
          (product as any).relatedProducts as Array<
            { title?: string; articleNumber?: string } | string
          >
        )
          .map((rp) => {
            if (typeof rp === 'object' && rp !== null) {
              return rp.title ?? rp.articleNumber ?? null
            }
            return null
          })
          .filter(Boolean)
      : []

    const priceEuro: number | null =
      typeof (product as any).priceInUSD === 'number' ? (product as any).priceInUSD : null

    const galleryImageIds: string[] = Array.isArray((product as any).gallery)
      ? ((product as any).gallery as Array<{ image?: { id?: string } | string }>)
          .slice(0, 10)
          .map((item) => {
            if (typeof item.image === 'object' && item.image?.id) return item.image.id
            if (typeof item.image === 'string') return item.image
            return null
          })
          .filter((id): id is string => id !== null)
      : []

    const productInfo = [
      `Produktname: ${product.title}`,
      (product as any).articleNumber ? `Artikelnummer: ${(product as any).articleNumber}` : null,
      (product as any).description_short
        ? `Kurzbeschreibung: ${(product as any).description_short}`
        : null,
      (product as any).productType ? `Produkttyp: ${(product as any).productType}` : null,
      priceEuro != null ? `Preis: ${priceEuro.toFixed(2)} €` : null,
    ]
      .filter(Boolean)
      .join('\n')

    const relatedSection =
      relatedProducts.length > 0
        ? `\nPassendes Zubehör / verwandte Produkte (bei uns erhältlich):\n${relatedProducts.map((r) => `- ${r}`).join('\n')}`
        : ''

    const templateSection = descriptionTemplate
      ? `\nStandard-Beschreibungsvorlage (als Basis verwenden und anpassen):\n${descriptionTemplate}`
      : ''

    const openingHoursSection = openingHours
      ? `\nÖffnungszeiten (am Ende der Beschreibung einfügen):\n${openingHours}`
      : ''

    const categoryList = KLEINANZEIGEN_CATEGORIES.map((c) => `${c.value}: ${c.label}`).join('\n')

    const systemPrompt = `Du bist ein Experte für Kleinanzeigen-Texte auf Kleinanzeigen.de. 
Du erstellst verkaufsstarke, zielgruppengerechte Anzeigentexte auf Deutsch.
Antworte ausschließlich mit einem JSON-Objekt.`

    const userPrompt = `Erstelle eine Kleinanzeige für folgendes Produkt:

${productInfo}
${relatedSection}
${templateSection}
${openingHoursSection}

Zielgruppe: ${targetAudience}

Verfügbare Kategorien (Format: ID: Bezeichnung):
${categoryList}

Anforderungen:
- "title": Kleinanzeigen-optimierter Titel (max. 60 Zeichen), prägnant und zielgruppengerecht
- "description": Vollständige Anzeigenbeschreibung (max. 4000 Zeichen) mit:
  1. Zielgruppengerechte Produktbeschreibung (Nutzen und Vorteile für die Zielgruppe hervorheben)
  2. Falls vorhanden: Hinweis auf passendes Zubehör/verwandte Produkte ("Für die Anwendung empfehlen wir auch...")
  3. Falls vorhanden: Öffnungszeiten am Ende
  4. Kein Markdown, kein HTML – nur reiner Text mit Zeilenumbrüchen
- "category": Die ID der am besten passenden Kategorie aus der obigen Liste (nur die ID, z.B. "123")

Gib ein JSON-Objekt mit den Schlüsseln "title", "description" und "category" zurück.`

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
        temperature: 0.7,
        response_format: { type: 'json_object' },
      }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      return NextResponse.json({ error: `OpenAI API Fehler: ${errorText}` }, { status: 502 })
    }

    const data = await response.json()
    const content = data.choices?.[0]?.message?.content

    if (!content) {
      return NextResponse.json({ error: 'Keine Antwort von OpenAI' }, { status: 502 })
    }

    let parsed: { title: string; description: string; category?: string }
    try {
      parsed = JSON.parse(content)
    } catch {
      return NextResponse.json(
        { error: 'Ungültiges JSON von OpenAI', raw: content },
        { status: 502 },
      )
    }

    const validCategory =
      parsed.category && KLEINANZEIGEN_CATEGORIES.some((c) => c.value === parsed.category)
        ? parsed.category
        : null

    return NextResponse.json({
      title: parsed.title ?? '',
      description: parsed.description ?? '',
      category: validCategory,
      price: priceEuro,
      imageIds: galleryImageIds,
    })
  } catch (err) {
    console.error('[generate-classified]', err)
    return NextResponse.json({ error: 'Interner Serverfehler' }, { status: 500 })
  }
}
