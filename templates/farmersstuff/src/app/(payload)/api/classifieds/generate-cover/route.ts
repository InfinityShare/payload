import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const apiKey = process.env.OPENAI_API_KEY
    if (!apiKey) {
      return NextResponse.json({ error: 'OPENAI_API_KEY not configured' }, { status: 500 })
    }

    const formData = await req.formData()
    const imageFile = formData.get('image') as File | null
    const slogan = (formData.get('slogan') as string) ?? ''
    const special = (formData.get('special') as string) ?? ''
    const price = (formData.get('price') as string) ?? ''

    if (!imageFile) {
      return NextResponse.json({ error: 'Kein Bild übergeben' }, { status: 400 })
    }

    const imageBytes = await imageFile.arrayBuffer()
    const imageBase64 = Buffer.from(imageBytes).toString('base64')
    const mimeType = imageFile.type || 'image/jpeg'

    const textParts: string[] = []
    if (slogan) textParts.push(`Slogan: "${slogan}"`)
    if (special) textParts.push(`Special-Merkmal: "${special}"`)
    if (price) textParts.push(`Preis: "${price.includes('€') ? price : price + '€'}"`)

    const textDescription = textParts.length > 0 ? textParts.join(', ') : 'keine Textelemente'

    const prompt = `Create a professional product advertisement image in the style of a German agricultural machinery dealer called "Farmers Stuff".

The image must follow this EXACT layout:
- Dark brown/black textured background (like rough metal or dark concrete), NOT a plain color
- Orange diagonal stripes ONLY in the top-left and bottom-right corners (like hazard tape), NOT covering the whole image
- The product photo from the input image placed on the RIGHT side of the composition, displayed in a slightly tilted rectangular frame with a white border and drop shadow, as if it's a printed photo placed on the background
- On the LEFT side, from top to bottom:
  1. The "FARMERS STUFF" logo at the top left: a white circular badge with a tractor illustration and wheat/grain decorations around it, with "FARMERS STUFF" text
  2. Large bold white uppercase slogan text (Impact or similar heavy font): ${slogan || 'SONDERANGEBOT'}
  3. An orange rectangular banner/badge with white text showing the price: ${price ? (price.includes('€') ? price : price + '€') : ''}
  4. A white checkbox square followed by bold white uppercase text for the special feature: ${special || ''}
- Overall dimensions: landscape format (roughly 16:9 or 3:2 ratio)
- Color palette: dark brown/black background, orange (#E8650A) accents, white text
- Professional, high-contrast, eye-catching advertisement style

Text elements to include: ${textDescription}

Important: The product photo must be clearly visible and prominent on the right side. The left side contains all text elements. The style should look like a professional social media advertisement for agricultural equipment.`

    const response = await fetch('https://api.openai.com/v1/images/generations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'dall-e-3',
        prompt,
        n: 1,
        size: '1792x1024',
        quality: 'hd',
        response_format: 'b64_json',
      }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      return NextResponse.json({ error: `OpenAI API Fehler: ${errorText}` }, { status: 502 })
    }

    const data = await response.json()
    const b64 = data.data?.[0]?.b64_json

    if (!b64) {
      return NextResponse.json({ error: 'Keine Bilddaten von OpenAI erhalten' }, { status: 502 })
    }

    return NextResponse.json({ image: `data:image/png;base64,${b64}` })
  } catch (err) {
    console.error('[generate-cover]', err)
    return NextResponse.json({ error: 'Interner Serverfehler' }, { status: 500 })
  }
}
