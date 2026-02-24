/**
 * Makes the white background of farmersstuff-1.png transparent.
 * Run from template root: node scripts/make-logo-transparent.mjs
 * Output overwrites the original; keep a backup if needed.
 */

import sharp from 'sharp'
import { dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = `${__dirname}/..`
const inputPath = `${root}/public/assets/farmersstuff-1.png`
const outputPath = inputPath

async function main() {
  const image = sharp(inputPath)
  const { data, info } = await image.ensureAlpha().raw().toBuffer({ resolveWithObject: true })
  const { width, height, channels } = info
  const threshold = 252

  for (let i = 0; i < data.length; i += channels) {
    const r = data[i]
    const g = data[i + 1]
    const b = data[i + 2]
    if (r >= threshold && g >= threshold && b >= threshold) {
      data[i + 3] = 0
    }
  }

  await sharp(data, { raw: { width, height, channels } })
    .png()
    .toFile(outputPath)

  console.log('Done: white background set to transparent in', outputPath)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
