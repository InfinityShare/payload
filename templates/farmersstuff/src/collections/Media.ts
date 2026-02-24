import type { CollectionConfig, PayloadRequest } from 'payload'
import type { Sharp } from 'sharp'

import {
  FixedToolbarFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'
import fs from 'fs/promises'
import path from 'path'
import { fileURLToPath } from 'url'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

/**
 * Get image settings from the global config
 */
async function getImageSettings(req: PayloadRequest) {
  try {
    const { docs } = await req.payload.findGlobal({
      slug: 'image-settings',
      overrideAccess: true,
    })
    return docs || null
  } catch {
    return null
  }
}

/**
 * Process image with Sharp using the configured filters
 */
async function processImageWithFilters(
  filePath: string,
  sharp: Sharp,
  settings: Record<string, unknown> | null,
): Promise<Buffer> {
  if (!settings?.enabled || !settings?.filters) {
    return await fs.readFile(filePath)
  }

  const filters = settings.filters as Record<string, unknown>

  let pipeline = sharp(filePath)

  // Apply brightness and contrast via modulate
  const brightness = (filters.brightness as number) ?? 100
  const saturation = (filters.saturation as number) ?? 100

  if (brightness !== 100 || saturation !== 100) {
    pipeline = pipeline.modulate({
      brightness: brightness / 100,
      saturation: saturation / 100,
    })
  }

  // Apply contrast using linear
  const contrast = (filters.contrast as number) ?? 100
  if (contrast !== 100) {
    const factor = contrast / 100
    const intercept = 128 * (1 - factor)
    pipeline = pipeline.linear(factor, intercept)
  }

  // Apply tint if enabled
  const tintConfig = filters.tint as Record<string, unknown> | undefined
  if (tintConfig?.enabled && tintConfig.color) {
    const intensity = ((tintConfig.intensity as number) ?? 10) / 100

    // Create overlay with tint color
    const metadata = await sharp(filePath).metadata()
    const width = metadata.width || 1000
    const height = metadata.height || 1000

    const tintOverlay = await sharp({
      create: {
        width,
        height,
        channels: 4,
        background: tintConfig.color as string,
      },
    })
      .png()
      .toBuffer()

    pipeline = pipeline.composite([
      {
        input: tintOverlay,
        blend: 'overlay',
        opacity: intensity,
      },
    ])
  }

  // Apply sharpening if enabled
  const sharpenConfig = filters.sharpen as Record<string, unknown> | undefined
  if (sharpenConfig?.enabled) {
    const sigma = (sharpenConfig.sigma as number) ?? 1.0
    pipeline = pipeline.sharpen({ sigma })
  }

  // Apply vignette if enabled (using radial gradient overlay)
  const vignetteConfig = filters.vignette as Record<string, unknown> | undefined
  if (vignetteConfig?.enabled) {
    const metadata = await sharp(filePath).metadata()
    const width = metadata.width || 1000
    const height = metadata.height || 1000
    const intensity = ((vignetteConfig.intensity as number) ?? 20) / 100

    // Create radial gradient for vignette
    const vignetteOverlay = await sharp({
      create: {
        width,
        height,
        channels: 4,
        background: { r: 0, g: 0, b: 0, alpha: intensity },
      },
    })
      .png()
      .toBuffer()

    pipeline = pipeline.composite([
      {
        input: vignetteOverlay,
        blend: 'multiply',
      },
    ])
  }

  return await pipeline.toBuffer()
}

/**
 * Hook to process images during upload
 */
const processImageHook = async ({
  data,
  req,
  operation,
}: {
  data: Record<string, unknown>
  req: PayloadRequest
  operation: 'create' | 'update'
}) => {
  // Only process on create/update with a file
  if (operation !== 'create' && operation !== 'update') {
    return data
  }

  // Check if applyFilter is enabled (defaults to true if not set)
  const applyFilter = data.applyFilter !== false

  if (!applyFilter) {
    return data
  }

  // Get global image settings
  const settings = await getImageSettings(req)

  if (!settings?.enabled) {
    return data
  }

  // Get the uploaded file path from the data
  const filePath = data._filePath as string | undefined
  if (!filePath) {
    return data
  }

  // Get sharp from req.payload.config (passed in payload.config.ts)
  const sharp = req.payload.config.sharp
  if (!sharp) {
    return data
  }

  try {
    // Process the image
    const processedBuffer = await processImageWithFilters(filePath, sharp, settings)

    // Write the processed image back
    await fs.writeFile(filePath, processedBuffer)

    // Update file size in data
    data.filesize = processedBuffer.length
  } catch (error) {
    console.error('Error processing image with filters:', error)
    // Continue with original file if processing fails
  }

  return data
}

export const Media: CollectionConfig = {
  admin: {
    useAsTitle: 'alt',
    group: 'Content',
  },
  slug: 'media',
  access: {
    read: () => true,
  },
  hooks: {
    beforeChange: [processImageHook],
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: true,
    },
    {
      name: 'caption',
      type: 'richText',
      editor: lexicalEditor({
        features: ({ rootFeatures }) => {
          return [...rootFeatures, FixedToolbarFeature(), InlineToolbarFeature()]
        },
      }),
    },
    {
      name: 'applyFilter',
      type: 'checkbox',
      defaultValue: true,
      admin: {
        description:
          'Apply the global image filter settings to this image. Uncheck to keep the original image.',
        position: 'sidebar',
      },
      label: 'Apply Image Filter',
    },
  ],
  upload: {
    staticDir: path.resolve(dirname, '../../public/media'),
  },
}
