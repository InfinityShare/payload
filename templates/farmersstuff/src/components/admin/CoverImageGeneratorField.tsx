'use client'

import React, { useCallback, useEffect, useRef, useState } from 'react'
import { useConfig, useDocumentInfo, useFormFields } from '@payloadcms/ui'
import heic2any from 'heic2any'

// ─── Types ────────────────────────────────────────────────────────────────────

type MediaImage = {
  id: string
  url: string
  filename: string
}

type ImageItem = {
  image: MediaImage | string | null
}

// ─── Canvas constants ─────────────────────────────────────────────────────────

const CW = 1200
const CH = 800

/** Selectable canvas backgrounds: generated texture or image assets */
export const CANVAS_BACKGROUND_OPTIONS = [
  { value: 'generated', label: 'Generiert (Textur)', description: 'Standard-Textur' },
  { value: 'bg_1', label: 'Canvas 1', description: 'Dunkle Oberfläche' },
  { value: 'bg_2', label: 'Canvas 2', description: 'Orange Streifen' },
  { value: 'bg_3', label: 'Canvas 3', description: 'Grunge Oberfläche' },
] as const

export type CanvasBackgroundId = (typeof CANVAS_BACKGROUND_OPTIONS)[number]['value']

const BG_IMAGE_PATHS: Record<Exclude<CanvasBackgroundId, 'generated'>, string> = {
  bg_1: '/assets/bg_1.jpg',
  bg_2: '/assets/bg_2.jpg',
  bg_3: '/assets/bg_3.jpg',
}

/** Selectable logo assets (all with transparent background) */
export const LOGO_OPTIONS = [
  { value: 'white', label: 'Weiß (Standard)', path: '/assets/farmersstuff-white.svg' },
  { value: 'orange', label: 'Orange', path: '/assets/farmersstuff-orange.svg' },
  { value: 'original', label: 'Original (PNG)', path: '/assets/farmersstuff-1.png' },
] as const

export type LogoId = (typeof LOGO_OPTIONS)[number]['value']

/** Detect HEIC/HEIF file for conversion (e.g. iPhone photos with transparency) */
function isHeicFile(file: File): boolean {
  const t = file.type?.toLowerCase()
  const name = file.name?.toLowerCase() ?? ''
  return (
    t === 'image/heic' || t === 'image/heif' || name.endsWith('.heic') || name.endsWith('.heif')
  )
}

function isHeicUrl(url: string): boolean {
  if (!url || url.startsWith('data:')) return false
  const u = url.toLowerCase()
  return u.includes('.heic') || u.includes('.heif')
}

/** Make black/near-black pixels transparent in a PNG blob (e.g. after HEIC conversion) so canvas has no black background */
async function makeBlackTransparentPng(blob: Blob): Promise<Blob> {
  const url = URL.createObjectURL(blob)
  try {
    const img = await new Promise<HTMLImageElement>((resolve, reject) => {
      const el = new window.Image()
      el.onload = () => resolve(el)
      el.onerror = reject
      el.src = url
    })
    const w = img.naturalWidth
    const h = img.naturalHeight
    const canvas = document.createElement('canvas')
    canvas.width = w
    canvas.height = h
    const ctx = canvas.getContext('2d')!
    ctx.drawImage(img, 0, 0)
    const imageData = ctx.getImageData(0, 0, w, h)
    const d = imageData.data
    const threshold = 40 // pixels with r,g,b all below this become transparent
    for (let i = 0; i < d.length; i += 4) {
      const r = d[i]
      const g = d[i + 1]
      const b = d[i + 2]
      if (r <= threshold && g <= threshold && b <= threshold) {
        d[i + 3] = 0
      }
    }
    ctx.putImageData(imageData, 0, 0)
    return await new Promise<Blob>((resolve, reject) => {
      canvas.toBlob((b) => (b ? resolve(b) : reject(new Error('toBlob failed'))), 'image/png', 1)
    })
  } finally {
    URL.revokeObjectURL(url)
  }
}

// ─── Canvas helpers ───────────────────────────────────────────────────────────

function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number,
): number {
  const words = text.split(' ')
  let line = ''
  let cy = y
  for (let n = 0; n < words.length; n++) {
    const test = line + words[n] + ' '
    if (ctx.measureText(test).width > maxWidth && n > 0) {
      ctx.fillText(line.trim(), x, cy)
      line = words[n] + ' '
      cy += lineHeight
    } else {
      line = test
    }
  }
  if (line.trim()) {
    ctx.fillText(line.trim(), x, cy)
    cy += lineHeight
  }
  return cy
}

function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
) {
  ctx.beginPath()
  ctx.moveTo(x + r, y)
  ctx.lineTo(x + w - r, y)
  ctx.quadraticCurveTo(x + w, y, x + w, y + r)
  ctx.lineTo(x + w, y + h - r)
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h)
  ctx.lineTo(x + r, y + h)
  ctx.quadraticCurveTo(x, y + h, x, y + h - r)
  ctx.lineTo(x, y + r)
  ctx.quadraticCurveTo(x, y, x + r, y)
  ctx.closePath()
}

/** Asphalt-like noise texture for the dark background */
function drawAsphaltTexture(ctx: CanvasRenderingContext2D, w: number, h: number) {
  // Base noise
  const id = ctx.createImageData(w, h)
  const d = id.data
  for (let i = 0; i < d.length; i += 4) {
    const v = (Math.random() * 45) | 0
    const warm = (Math.random() * 8) | 0
    d[i] = v + warm
    d[i + 1] = v
    d[i + 2] = v
    d[i + 3] = 30
  }
  ctx.putImageData(id, 0, 0)

  // Subtle scratch lines
  ctx.save()
  ctx.globalAlpha = 0.04
  ctx.strokeStyle = '#ffffff'
  ctx.lineWidth = 1
  for (let i = 0; i < 18; i++) {
    const x1 = Math.random() * w
    const y1 = Math.random() * h
    const len = 40 + Math.random() * 120
    const angle = Math.random() * Math.PI * 2
    ctx.beginPath()
    ctx.moveTo(x1, y1)
    ctx.lineTo(x1 + Math.cos(angle) * len, y1 + Math.sin(angle) * len)
    ctx.stroke()
  }
  ctx.restore()
}

// ─── Main draw function ───────────────────────────────────────────────────────

function drawCoverCanvas(
  canvas: HTMLCanvasElement,
  productImg: HTMLImageElement,
  logoImg: HTMLImageElement | null,
  slogan: string,
  special: string,
  price: string,
  priceLabel: string,
  backgroundId: CanvasBackgroundId = 'generated',
  bgImage: HTMLImageElement | null = null,
  miniHeadline: string = '',
  textBlock: string = '',
) {
  canvas.width = CW
  canvas.height = CH
  const ctx = canvas.getContext('2d')!

  // 1. Background: image (cover) or generated gradient + texture
  if (backgroundId !== 'generated' && bgImage && bgImage.complete && bgImage.naturalWidth) {
    // Draw image to cover full canvas (cover fit)
    const imgAspect = bgImage.width / bgImage.height
    const canvasAspect = CW / CH
    let sx = 0,
      sy = 0,
      sw = bgImage.width,
      sh = bgImage.height
    if (imgAspect > canvasAspect) {
      sw = bgImage.height * canvasAspect
      sx = (bgImage.width - sw) / 2
    } else {
      sh = bgImage.width / canvasAspect
      sy = (bgImage.height - sh) / 2
    }
    ctx.drawImage(bgImage, sx, sy, sw, sh, 0, 0, CW, CH)
  } else {
    // Generated: texture only, no solid background (canvas stays transparent)
    drawAsphaltTexture(ctx, CW, CH)
  }

  // 2. Product photo — right side, NO frame, fills the area
  const photoX = Math.round(CW * 0.42)
  const photoY = 20
  const photoW = CW - photoX - 20
  const photoH = CH - 40

  const scale = Math.min(photoW / productImg.width, photoH / productImg.height)
  const drawW = Math.round(productImg.width * scale)
  const drawH = Math.round(productImg.height * scale)
  const drawX = photoX + Math.round((photoW - drawW) / 2)
  const drawY = photoY + Math.round((photoH - drawH) / 2)

  // Subtle drop shadow only (no white frame)
  ctx.save()
  ctx.shadowColor = 'rgba(0,0,0,0.85)'
  ctx.shadowBlur = 50
  ctx.shadowOffsetX = -6
  ctx.shadowOffsetY = 10
  ctx.drawImage(productImg, drawX, drawY, drawW, drawH)
  ctx.restore()

  // 4. Left panel text
  const lx = 44
  const maxW = CW * 0.42 - lx - 12
  let cy = 28

  // Logo — large, use the white version for visibility
  if (logoImg) {
    const lh = 160
    const lw = Math.round((logoImg.width / logoImg.height) * lh)
    ctx.drawImage(logoImg, lx, cy, lw, lh)
    cy += lh + 16
  }

  // Mini Headline — smaller line above main slogan (e.g. "SAISONSTART!")
  if (miniHeadline.trim()) {
    ctx.font = `bold 38px Impact, 'Arial Black', sans-serif`
    ctx.fillStyle = '#ffffff'
    ctx.textBaseline = 'top'
    ctx.fillText(miniHeadline.toUpperCase(), lx, cy)
    cy += 46
  }

  // Slogan — large bold white, wraps properly
  if (slogan.trim()) {
    ctx.font = `bold 86px Impact, 'Arial Black', sans-serif`
    ctx.fillStyle = '#ffffff'
    ctx.textBaseline = 'top'
    cy = wrapText(ctx, slogan.toUpperCase(), lx, cy, maxW, 90)
    cy += 8
  }

  // Text block — 3 lines (Line1 / Line2 big / Line3) on orange background
  // Line 1: full opacity; lines 2+3: 80% opacity. Tighter spacing, line 2 centered in its block.
  const textLines = textBlock.trim()
    ? textBlock
        .split(/\n/)
        .map((s) => s.trim())
        .filter(Boolean)
    : []
  if (textLines.length > 0) {
    const line1 = textLines[0]?.toUpperCase() ?? ''
    const line2 = textLines[1]?.toUpperCase() ?? ''
    const line3 = textLines[2]?.toUpperCase() ?? ''
    const smallFont = "bold 36px Impact, 'Arial Black', sans-serif"
    const bigFont = "bold 78px Impact, 'Arial Black', sans-serif"
    const pad = 10
    const lineGap = 3
    const pad23 = 10
    const padBottom23 = 14
    const line2TopPad = 6
    const smallLineH = 36
    const bigLineH = 80
    ctx.font = smallFont
    const w1 = line1 ? ctx.measureText(line1).width : 0
    ctx.font = bigFont
    const w2 = line2 ? ctx.measureText(line2).width : 0
    ctx.font = smallFont
    const w3 = line3 ? ctx.measureText(line3).width : 0
    ctx.font = bigFont
    const blockW = Math.min(maxW, Math.max(w1, w2, w3) + pad * 2)
    const hasLines23 = !!(line2 || line3)
    const line1H = line1 ? pad + smallLineH + (hasLines23 ? lineGap : 0) : 0
    const lines23H = hasLines23
      ? line2 && line3
        ? line2TopPad + bigLineH + lineGap + smallLineH + padBottom23
        : (line2 ? bigLineH : 0) + (line3 ? lineGap + smallLineH + padBottom23 : 0) + pad23
      : 0
    const blockH = line1H + lines23H

    // Line 1 area: orange at full opacity
    if (line1) {
      roundRect(ctx, lx, cy, blockW, line1H, 0)
      ctx.fillStyle = '#e8650a'
      ctx.fill()
    }
    // Lines 2+3 area: orange at 80% opacity
    if (hasLines23) {
      const y23 = cy + line1H
      roundRect(ctx, lx, y23, blockW, lines23H, 0)
      ctx.save()
      ctx.globalAlpha = 0.8
      ctx.fillStyle = '#e8650a'
      ctx.fill()
      ctx.restore()
    }

    ctx.fillStyle = '#ffffff'
    ctx.textBaseline = 'top'
    let blockCy = cy + pad
    if (line1) {
      ctx.font = smallFont
      ctx.fillText(line1, lx + pad, blockCy)
      blockCy += smallLineH + lineGap
    }
    if (line2) {
      ctx.font = bigFont
      const y23 = cy + line1H
      const line2Y = y23 + line2TopPad
      ctx.textBaseline = 'top'
      ctx.fillText(line2, lx + pad, line2Y)
      ctx.textBaseline = 'top'
      blockCy = line2Y + bigLineH + lineGap
    }
    if (line3) {
      ctx.font = smallFont
      ctx.fillText(line3, lx + pad, blockCy)
    }
    cy += blockH + 22
  }

  // Special-Merkmal: nur Checkbox + Text (keine Überschrift/Banner)
  if (special.trim()) {
    const specialUpper = special.toUpperCase()
    ctx.font = `bold 48px Impact, 'Arial Black', sans-serif`
    const checkSize = 54
    const bh = checkSize
    const by = cy

    roundRect(ctx, lx, by, checkSize, bh, 5)
    ctx.fillStyle = '#ffffff'
    ctx.fill()

    ctx.strokeStyle = '#e8650a'
    ctx.lineWidth = 6
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'
    ctx.beginPath()
    ctx.moveTo(lx + 11, by + bh / 2 + 1)
    ctx.lineTo(lx + 21, by + bh / 2 + 12)
    ctx.lineTo(lx + 43, by + bh / 2 - 12)
    ctx.stroke()

    ctx.fillStyle = '#ffffff'
    ctx.textBaseline = 'middle'
    ctx.fillText(specialUpper, lx + checkSize + 12, by + bh / 2)
    cy += bh + 18
  }

  // Price label (customizable) + large price badge
  if (price.trim()) {
    const priceText = price.includes('€') ? price : `${price}€`
    const labelText = (priceLabel || 'Für').toUpperCase()

    ctx.font = `bold 26px Impact, 'Arial Black', sans-serif`
    ctx.fillStyle = '#cccccc'
    ctx.textBaseline = 'top'
    ctx.fillText(labelText, lx, cy)
    cy += 32

    ctx.font = `bold 104px Impact, 'Arial Black', sans-serif`
    const pw = ctx.measureText(priceText).width
    const ph = 108
    const pp = 20
    const badgeW = Math.min(pw + pp * 2, maxW)
    roundRect(ctx, lx, cy, badgeW, ph, 8)
    ctx.save()
    ctx.globalAlpha = 0.8
    ctx.fillStyle = '#e8650a'
    ctx.fill()
    ctx.restore()
    ctx.fillStyle = '#ffffff'
    ctx.textBaseline = 'middle'
    ctx.fillText(priceText, lx + pp, cy + ph / 2)
  }
}

// ─── Component ────────────────────────────────────────────────────────────────

export const CoverImageGeneratorField: React.FC = () => {
  const { config } = useConfig()
  const { id: classifiedId } = useDocumentInfo()
  const apiBase = config?.routes?.api ?? '/api'

  const canvasRef = useRef<HTMLCanvasElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [slogan, setSlogan] = useState('')
  const [miniHeadline, setMiniHeadline] = useState('')
  const [textBlock, setTextBlock] = useState('')
  const [special, setSpecial] = useState('')
  const [price, setPrice] = useState('')
  const [priceLabel, setPriceLabel] = useState('Für')
  const [selectedImageUrl, setSelectedImageUrl] = useState<string | null>(null)
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null)
  const [productImg, setProductImg] = useState<HTMLImageElement | null>(null)
  const [resolvedProductUrl, setResolvedProductUrl] = useState<string | null>(null)
  const resolvedProductUrlRef = useRef<string | null>(null)
  const [canvasRendered, setCanvasRendered] = useState(false)
  const [aiImageUrl, setAiImageUrl] = useState<string | null>(null)
  const [aiLoading, setAiLoading] = useState(false)
  const [aiError, setAiError] = useState<string | null>(null)
  const [saveToGalleryLoading, setSaveToGalleryLoading] = useState(false)
  const [saveToGalleryMessage, setSaveToGalleryMessage] = useState<{
    type: 'success' | 'error'
    text: string
  } | null>(null)
  const [activeTab, setActiveTab] = useState<'canvas' | 'ai'>('canvas')
  const [existingImages, setExistingImages] = useState<MediaImage[]>([])
  const [canvasBackground, setCanvasBackground] = useState<CanvasBackgroundId>('generated')
  const [bgImages, setBgImages] = useState<
    Record<Exclude<CanvasBackgroundId, 'generated'>, HTMLImageElement | null>
  >({
    bg_1: null,
    bg_2: null,
    bg_3: null,
  })
  const [selectedLogo, setSelectedLogo] = useState<LogoId>('white')
  const [logoImages, setLogoImages] = useState<Record<LogoId, HTMLImageElement | null>>({
    white: null,
    orange: null,
    original: null,
  })

  const imagesField = useFormFields(([fields]) => {
    const f = fields['images']
    return f?.value as ImageItem[] | undefined
  })
  const formPrice = useFormFields(([fields]) => {
    const p = fields['price']?.value
    if (typeof p === 'number' && !Number.isNaN(p)) return p
    return null
  }) as number | null | undefined
  const formTitle = useFormFields(([fields]) => fields['title']?.value as string | undefined)

  useEffect(() => {
    const imgs: MediaImage[] = []
    if (Array.isArray(imagesField)) {
      for (const item of imagesField) {
        if (item?.image && typeof item.image === 'object' && 'id' in item.image) {
          const img = item.image as MediaImage
          if (img.url) imgs.push(img)
        }
      }
    }
    setExistingImages(imgs)
  }, [imagesField])

  // Preload all logo variants for selection
  useEffect(() => {
    LOGO_OPTIONS.forEach((opt) => {
      const img = new window.Image()
      img.crossOrigin = 'anonymous'
      img.onload = () => setLogoImages((prev) => ({ ...prev, [opt.value]: img }))
      img.onerror = () => setLogoImages((prev) => ({ ...prev, [opt.value]: null }))
      img.src = opt.path
    })
  }, [])

  // Preload canvas background images
  useEffect(() => {
    const load = (key: 'bg_1' | 'bg_2' | 'bg_3') => {
      const img = new window.Image()
      img.crossOrigin = 'anonymous'
      img.onload = () => setBgImages((prev) => ({ ...prev, [key]: img }))
      img.onerror = () => setBgImages((prev) => ({ ...prev, [key]: null }))
      img.src = BG_IMAGE_PATHS[key]
    }
    load('bg_1')
    load('bg_2')
    load('bg_3')
  }, [])

  const activeImageUrl = uploadedImageUrl ?? selectedImageUrl

  // Resolve HEIC URLs to PNG blob URLs so canvas can load them (browsers often don't support HEIC in img)
  useEffect(() => {
    if (!activeImageUrl) {
      if (resolvedProductUrlRef.current) {
        URL.revokeObjectURL(resolvedProductUrlRef.current)
        resolvedProductUrlRef.current = null
      }
      setResolvedProductUrl(null)
      return
    }
    if (!isHeicUrl(activeImageUrl)) {
      if (resolvedProductUrlRef.current) {
        URL.revokeObjectURL(resolvedProductUrlRef.current)
        resolvedProductUrlRef.current = null
      }
      setResolvedProductUrl(activeImageUrl)
      return
    }
    let cancelled = false
    ;(async () => {
      try {
        const res = await fetch(activeImageUrl)
        const blob = await res.blob()
        if (cancelled) return
        const result = await heic2any({ blob, toType: 'image/png' })
        const out = Array.isArray(result) ? result[0] : result
        if (!out || cancelled) return
        const pngWithTransparency = await makeBlackTransparentPng(out as Blob)
        if (cancelled) return
        const url = URL.createObjectURL(pngWithTransparency)
        if (resolvedProductUrlRef.current) URL.revokeObjectURL(resolvedProductUrlRef.current)
        resolvedProductUrlRef.current = url
        setResolvedProductUrl(url)
      } catch (err) {
        if (!cancelled) setResolvedProductUrl(activeImageUrl)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [activeImageUrl])

  useEffect(() => {
    return () => {
      if (resolvedProductUrlRef.current) {
        URL.revokeObjectURL(resolvedProductUrlRef.current)
        resolvedProductUrlRef.current = null
      }
    }
  }, [])

  useEffect(() => {
    if (!resolvedProductUrl) {
      setProductImg(null)
      return
    }
    const img = new window.Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => setProductImg(img)
    img.onerror = () => setProductImg(null)
    img.src = resolvedProductUrl
  }, [resolvedProductUrl])

  const handleFileUpload = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setSelectedImageUrl(null)

    if (isHeicFile(file)) {
      try {
        const result = await heic2any({ blob: file, toType: 'image/png' })
        const blob = Array.isArray(result) ? result[0] : result
        if (!blob) return
        const pngWithTransparency = await makeBlackTransparentPng(blob as Blob)
        const url = URL.createObjectURL(pngWithTransparency)
        setUploadedImageUrl(url)
        setUploadedFile(
          new File([pngWithTransparency], file.name.replace(/\.(heic|heif)$/i, '.png'), {
            type: 'image/png',
          }),
        )
      } catch (err) {
        console.error('HEIC conversion failed:', err)
        setUploadedImageUrl(null)
        setUploadedFile(null)
      }
      return
    }

    setUploadedFile(file)
    const reader = new FileReader()
    reader.onload = (ev) => {
      setUploadedImageUrl(ev.target?.result as string)
    }
    reader.readAsDataURL(file)
  }, [])

  const handleSelectExisting = useCallback((url: string) => {
    setSelectedImageUrl(url)
    setUploadedImageUrl(null)
    setUploadedFile(null)
  }, [])

  const handleDrawCanvas = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas || !productImg) return
    const bgImg = canvasBackground !== 'generated' ? bgImages[canvasBackground] : null
    const logoImg = logoImages[selectedLogo] ?? null
    const priceForCanvas = formPrice != null ? String(formPrice) : price
    drawCoverCanvas(
      canvas,
      productImg,
      logoImg,
      slogan,
      special,
      priceForCanvas,
      priceLabel,
      canvasBackground,
      bgImg,
      miniHeadline,
      textBlock,
    )
    setCanvasRendered(true)
    setActiveTab('canvas')
  }, [
    productImg,
    logoImages,
    selectedLogo,
    slogan,
    miniHeadline,
    textBlock,
    special,
    price,
    formPrice,
    priceLabel,
    canvasBackground,
    bgImages,
  ])

  const handleDownloadCanvas = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const a = document.createElement('a')
    a.download = `cover-canvas-${Date.now()}.png`
    a.href = canvas.toDataURL('image/png')
    a.click()
  }, [])

  const handleGenerateAI = useCallback(async () => {
    if (!activeImageUrl) return
    setAiLoading(true)
    setAiError(null)
    setActiveTab('ai')

    try {
      let imageFile: File
      if (uploadedFile) {
        imageFile = uploadedFile
      } else {
        const res = await fetch(activeImageUrl)
        const blob = await res.blob()
        imageFile = new File([blob], 'product.jpg', { type: blob.type || 'image/jpeg' })
      }

      const fd = new FormData()
      fd.append('image', imageFile)
      fd.append('slogan', slogan)
      fd.append('miniHeadline', miniHeadline)
      fd.append('textBlock', textBlock)
      fd.append('special', special)
      fd.append('price', price)
      fd.append('priceLabel', priceLabel)

      const res = await fetch('/api/classifieds/generate-cover', {
        method: 'POST',
        body: fd,
      })

      const data = await res.json()
      if (!res.ok || data.error) {
        setAiError(data.error ?? 'Unbekannter Fehler')
      } else {
        setAiImageUrl(data.image)
      }
    } catch (err) {
      setAiError(err instanceof Error ? err.message : 'Netzwerkfehler')
    } finally {
      setAiLoading(false)
    }
  }, [activeImageUrl, uploadedFile, slogan, miniHeadline, textBlock, special, price, priceLabel])

  const handleDownloadAI = useCallback(() => {
    if (!aiImageUrl) return
    const a = document.createElement('a')
    a.download = `cover-ai-${Date.now()}.png`
    a.href = aiImageUrl
    a.click()
  }, [aiImageUrl])

  const handleSaveToGallery = useCallback(async () => {
    if (!classifiedId) {
      setSaveToGalleryMessage({
        type: 'error',
        text: 'Kleinanzeige muss zuerst gespeichert werden.',
      })
      return
    }
    setSaveToGalleryMessage(null)
    setSaveToGalleryLoading(true)
    try {
      let blob: Blob
      if (activeTab === 'canvas' && canvasRef.current) {
        blob = await new Promise<Blob>((resolve, reject) => {
          canvasRef.current!.toBlob(
            (b) => (b ? resolve(b) : reject(new Error('toBlob failed'))),
            'image/png',
            1,
          )
        })
      } else if (activeTab === 'ai' && aiImageUrl) {
        const res = await fetch(aiImageUrl)
        blob = await res.blob()
      } else {
        setSaveToGalleryMessage({
          type: 'error',
          text: 'Bitte zuerst eine Vorschau generieren (Canvas oder KI).',
        })
        return
      }
      const file = new File([blob], `cover-${Date.now()}.png`, { type: 'image/png' })
      const altText =
        typeof formTitle === 'string' && formTitle.trim()
          ? `Cover: ${formTitle.trim()}`
          : 'Cover-Bild für Kleinanzeige'
      const fd = new FormData()
      fd.append('_payload', JSON.stringify({ alt: String(altText) }))
      fd.append('file', file)
      const uploadRes = await fetch(`${apiBase}/media`, {
        method: 'POST',
        credentials: 'include',
        body: fd,
      })
      if (!uploadRes.ok) {
        const err = await uploadRes.json().catch(() => ({ message: uploadRes.statusText }))
        throw new Error(err.message ?? err.error ?? 'Upload fehlgeschlagen')
      }
      const uploadData = await uploadRes.json()
      const newMediaId = uploadData.doc?.id ?? uploadData.id
      if (!newMediaId) throw new Error('Keine Medien-ID erhalten')
      const existingIds: string[] = []
      if (Array.isArray(imagesField)) {
        for (const item of imagesField) {
          if (item?.image) {
            const id =
              typeof item.image === 'object' && item.image !== null && 'id' in item.image
                ? (item.image as { id: string }).id
                : String(item.image)
            if (id) existingIds.push(id)
          }
        }
      }
      const imagesPayload = [{ image: newMediaId }, ...existingIds.map((id) => ({ image: id }))]
      const patchRes = await fetch(`${apiBase}/classifieds/${classifiedId}`, {
        method: 'PATCH',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ images: imagesPayload }),
      })
      if (!patchRes.ok) {
        const err = await patchRes.json().catch(() => ({ message: patchRes.statusText }))
        throw new Error(err.message ?? err.error ?? 'Aktualisierung fehlgeschlagen')
      }
      setSaveToGalleryMessage({
        type: 'success',
        text: 'Cover wurde als erstes Bild in der Galerie gespeichert. Tab "Bilder" ggf. wechseln zum Anzeigen.',
      })
    } catch (err) {
      setSaveToGalleryMessage({
        type: 'error',
        text: err instanceof Error ? err.message : 'Speichern fehlgeschlagen',
      })
    } finally {
      setSaveToGalleryLoading(false)
    }
  }, [classifiedId, activeTab, aiImageUrl, apiBase, imagesField, formTitle])

  const isReady = !!activeImageUrl

  // ── Styles ────────────────────────────────────────────────────────────────

  const labelStyle: React.CSSProperties = {
    display: 'block',
    fontSize: '11px',
    fontWeight: 700,
    marginBottom: '5px',
    color: 'var(--theme-elevation-500)',
    textTransform: 'uppercase',
    letterSpacing: '0.06em',
  }

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '9px 12px',
    fontSize: '14px',
    border: '1px solid var(--theme-elevation-200)',
    borderRadius: '4px',
    background: 'var(--theme-input-bg)',
    color: 'var(--theme-text)',
    boxSizing: 'border-box',
    marginBottom: '14px',
  }

  const btnStyle = (color: string, disabled = false): React.CSSProperties => ({
    padding: '10px 18px',
    background: disabled ? 'var(--theme-elevation-150)' : color,
    color: disabled ? 'var(--theme-elevation-400)' : '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: disabled ? 'not-allowed' : 'pointer',
    fontWeight: 700,
    fontSize: '13px',
    whiteSpace: 'nowrap',
  })

  const tabBtnStyle = (active: boolean): React.CSSProperties => ({
    padding: '7px 18px',
    background: active ? '#e8650a' : 'var(--theme-elevation-100)',
    color: active ? '#fff' : 'var(--theme-elevation-600)',
    border: active ? 'none' : '1px solid var(--theme-elevation-200)',
    borderRadius: '4px',
    cursor: 'pointer',
    fontWeight: 600,
    fontSize: '13px',
  })

  return (
    <div style={{ maxWidth: '980px' }}>
      <h2
        style={{
          fontSize: '18px',
          fontWeight: 700,
          marginBottom: '4px',
          color: 'var(--theme-text)',
        }}
      >
        Cover Bild Generator
      </h2>
      <p
        style={{
          fontSize: '13px',
          color: 'var(--theme-elevation-500)',
          margin: '0 0 24px 0',
          lineHeight: 1.5,
        }}
      >
        Erstelle ein Cover-Bild im FarmersStuff-Design — als sofortige Canvas-Vorschau oder mit KI
        (DALL-E 3).
      </p>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '320px 1fr',
          gap: '32px',
          alignItems: 'start',
        }}
      >
        {/* ── Controls ── */}
        <div>
          <label style={labelStyle}>Produktbild</label>
          {existingImages.length > 0 ? (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '12px' }}>
              {existingImages.map((img) => (
                <button
                  key={img.id}
                  onClick={() => handleSelectExisting(img.url)}
                  type="button"
                  title={img.filename}
                  style={{
                    padding: 0,
                    border:
                      selectedImageUrl === img.url && !uploadedImageUrl
                        ? '3px solid #e8650a'
                        : '3px solid transparent',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    background: 'none',
                    overflow: 'hidden',
                    width: '68px',
                    height: '68px',
                    flexShrink: 0,
                  }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    alt={img.filename}
                    src={img.url}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                  />
                </button>
              ))}
            </div>
          ) : (
            <p
              style={{
                fontSize: '12px',
                color: 'var(--theme-elevation-400)',
                marginBottom: '10px',
              }}
            >
              Keine Bilder im Tab Bilder vorhanden.
            </p>
          )}

          <div style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
            <button
              onClick={() => fileInputRef.current?.click()}
              type="button"
              style={btnStyle('var(--theme-elevation-300)')}
            >
              {uploadedImageUrl ? '✓ Eigenes Bild' : '+ Eigenes Bild'}
            </button>
            {uploadedImageUrl && (
              <button
                onClick={() => {
                  setUploadedImageUrl(null)
                  setUploadedFile(null)
                }}
                type="button"
                style={{
                  ...btnStyle('transparent'),
                  color: 'var(--theme-elevation-500)',
                  border: '1px solid var(--theme-elevation-200)',
                }}
              >
                ✕
              </button>
            )}
            <input
              accept="image/*,image/heic,image/heif,.heic,.heif"
              onChange={handleFileUpload}
              ref={fileInputRef}
              style={{ display: 'none' }}
              type="file"
            />
          </div>

          <label style={labelStyle}>Slogan</label>
          <input
            style={inputStyle}
            type="text"
            value={slogan}
            onChange={(e) => setSlogan(e.target.value)}
            placeholder='z.B. "DER KNALLER" oder "FRÜHLINGSANGEBOT"'
          />

          <label style={labelStyle}>Mini-Headline</label>
          <input
            style={inputStyle}
            type="text"
            value={miniHeadline}
            onChange={(e) => setMiniHeadline(e.target.value)}
            placeholder='z.B. "SAISONSTART!" (klein über dem Slogan)'
          />

          <label style={labelStyle}>Text-Block (3 Zeilen, 2. Zeile groß)</label>
          <textarea
            style={{ ...inputStyle, minHeight: '72px', resize: 'vertical' }}
            value={textBlock}
            onChange={(e) => setTextBlock(e.target.value)}
            placeholder={'Zeile 1\nZeile 2 (wird groß dargestellt)\nZeile 3'}
            rows={3}
          />

          <label style={labelStyle}>Special-Merkmal (mit Haken)</label>
          <input
            style={inputStyle}
            type="text"
            value={special}
            onChange={(e) => setSpecial(e.target.value)}
            placeholder='z.B. "26PS STARK" oder "450KG"'
          />

          <label style={labelStyle}>Preis-Label</label>
          <input
            style={inputStyle}
            type="text"
            value={priceLabel}
            onChange={(e) => setPriceLabel(e.target.value)}
            placeholder='z.B. "Für" oder "NUR NOCH HEUTE"'
          />

          <label style={labelStyle}>Preis (auf dem Cover)</label>
          <input
            style={inputStyle}
            type="text"
            value={formPrice != null ? String(formPrice) : price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder={
              formPrice != null ? `Aus Anzeige: ${formPrice} €` : 'z.B. "11900" oder "1749"'
            }
            readOnly={formPrice != null}
          />
          {formPrice != null && (
            <p
              style={{
                fontSize: '11px',
                color: 'var(--theme-elevation-500)',
                marginTop: '-8px',
                marginBottom: '14px',
              }}
            >
              Kommt aus dem Feld „Preis (in Euro)“ der Kleinanzeige (Tab „Preis & Versand“).
            </p>
          )}

          <label style={labelStyle}>Hintergrund (Canvas)</label>
          <div
            style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '20px' }}
          >
            {CANVAS_BACKGROUND_OPTIONS.map((opt) => (
              <label
                key={opt.value}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  cursor: 'pointer',
                  padding: '8px 10px',
                  borderRadius: '4px',
                  border:
                    canvasBackground === opt.value
                      ? '2px solid #e8650a'
                      : '1px solid var(--theme-elevation-200)',
                  background:
                    canvasBackground === opt.value ? 'var(--theme-elevation-100)' : 'transparent',
                }}
              >
                <input
                  type="radio"
                  name="canvasBackground"
                  checked={canvasBackground === opt.value}
                  onChange={() => setCanvasBackground(opt.value)}
                  style={{ accentColor: '#e8650a' }}
                />
                <span style={{ fontWeight: 600, color: 'var(--theme-text)', fontSize: '13px' }}>
                  {opt.label}
                </span>
                <span style={{ color: 'var(--theme-elevation-500)', fontSize: '12px' }}>
                  — {opt.description}
                </span>
              </label>
            ))}
          </div>

          <label style={labelStyle}>Logo</label>
          <div
            style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '20px' }}
          >
            {LOGO_OPTIONS.map((opt) => (
              <label
                key={opt.value}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  cursor: 'pointer',
                  padding: '8px 10px',
                  borderRadius: '4px',
                  border:
                    selectedLogo === opt.value
                      ? '2px solid #e8650a'
                      : '1px solid var(--theme-elevation-200)',
                  background:
                    selectedLogo === opt.value ? 'var(--theme-elevation-100)' : 'transparent',
                }}
              >
                <input
                  type="radio"
                  name="logo"
                  checked={selectedLogo === opt.value}
                  onChange={() => setSelectedLogo(opt.value)}
                  style={{ accentColor: '#e8650a' }}
                />
                <span style={{ fontWeight: 600, color: 'var(--theme-text)', fontSize: '13px' }}>
                  {opt.label}
                </span>
              </label>
            ))}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <button
              onClick={handleDrawCanvas}
              type="button"
              disabled={!isReady}
              style={btnStyle('#444', !isReady)}
            >
              🖼 Canvas-Vorschau generieren
            </button>
            <button
              onClick={handleGenerateAI}
              type="button"
              disabled={!isReady || aiLoading}
              style={btnStyle('#e8650a', !isReady || aiLoading)}
            >
              {aiLoading ? '⏳ KI generiert...' : '✨ Mit KI generieren (DALL-E 3)'}
            </button>
          </div>

          {!isReady && (
            <p style={{ fontSize: '12px', color: 'var(--theme-elevation-400)', marginTop: '10px' }}>
              Bitte zuerst ein Produktbild auswählen.
            </p>
          )}
        </div>

        {/* ── Preview ── */}
        <div>
          {(canvasRendered || aiImageUrl) && (
            <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
              <button
                onClick={() => setActiveTab('canvas')}
                type="button"
                style={tabBtnStyle(activeTab === 'canvas')}
              >
                Canvas
              </button>
              <button
                onClick={() => setActiveTab('ai')}
                type="button"
                style={tabBtnStyle(activeTab === 'ai')}
              >
                KI-Bild
              </button>
            </div>
          )}

          <label style={labelStyle}>
            {activeTab === 'canvas'
              ? `Vorschau (${CW} × ${CH} px)`
              : 'KI-generiertes Bild (1792 × 1024 px)'}
          </label>

          <div
            style={{
              border: '1px solid var(--theme-elevation-200)',
              borderRadius: '6px',
              overflow: 'hidden',
              background: 'transparent',
              aspectRatio: activeTab === 'canvas' ? `${CW} / ${CH}` : '1792 / 1024',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {activeTab === 'canvas' && !canvasRendered && (
              <span style={{ color: 'var(--theme-elevation-400)', fontSize: '13px' }}>
                Noch keine Vorschau
              </span>
            )}
            <canvas
              ref={canvasRef}
              style={{
                display: activeTab === 'canvas' && canvasRendered ? 'block' : 'none',
                width: '100%',
                height: 'auto',
              }}
            />

            {activeTab === 'ai' && aiLoading && (
              <div style={{ textAlign: 'center', color: '#fff', padding: '40px' }}>
                <div style={{ fontSize: '32px', marginBottom: '12px' }}>⏳</div>
                <p style={{ fontSize: '14px', margin: 0 }}>
                  DALL-E 3 generiert…
                  <br />
                  Ca. 15–30 Sekunden.
                </p>
              </div>
            )}
            {activeTab === 'ai' && !aiLoading && aiError && (
              <div style={{ textAlign: 'center', color: '#ff6b6b', padding: '24px' }}>
                <p style={{ fontSize: '13px', margin: 0 }}>Fehler: {aiError}</p>
              </div>
            )}
            {activeTab === 'ai' && !aiLoading && aiImageUrl && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                alt="KI-generiertes Cover"
                src={aiImageUrl}
                style={{ width: '100%', height: 'auto', display: 'block' }}
              />
            )}
            {activeTab === 'ai' && !aiLoading && !aiImageUrl && !aiError && (
              <span style={{ color: 'var(--theme-elevation-400)', fontSize: '13px' }}>
                Noch kein KI-Bild
              </span>
            )}
          </div>

          <div
            style={{
              display: 'flex',
              gap: '10px',
              marginTop: '12px',
              flexWrap: 'wrap',
              alignItems: 'center',
            }}
          >
            {canvasRendered && activeTab === 'canvas' && (
              <button onClick={handleDownloadCanvas} type="button" style={btnStyle('#2d8a4e')}>
                ⬇ Canvas PNG herunterladen
              </button>
            )}
            {aiImageUrl && activeTab === 'ai' && (
              <button onClick={handleDownloadAI} type="button" style={btnStyle('#2d8a4e')}>
                ⬇ KI-Bild herunterladen
              </button>
            )}
            {(canvasRendered || aiImageUrl) && (
              <button
                onClick={handleSaveToGallery}
                type="button"
                disabled={saveToGalleryLoading || !classifiedId}
                style={btnStyle('#e8650a', saveToGalleryLoading || !classifiedId)}
              >
                {saveToGalleryLoading ? '⏳ Speichern…' : '💾 In Galerie speichern (als 1. Bild)'}
              </button>
            )}
          </div>
          {saveToGalleryMessage && (
            <p
              style={{
                marginTop: '10px',
                fontSize: '13px',
                color:
                  saveToGalleryMessage.type === 'success'
                    ? 'var(--theme-success)'
                    : 'var(--theme-error)',
              }}
            >
              {saveToGalleryMessage.text}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
