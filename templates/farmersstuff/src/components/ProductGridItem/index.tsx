import type { Product } from '@/payload-types'

import Link from 'next/link'
import React from 'react'
import { Media } from '@/components/Media'
import { Price } from '@/components/Price'

type Props = {
  product: Partial<Product>
}

const DRIVE_LABELS: Record<string, string> = {
  '4wd': 'Allrad',
  '2wd': 'Heckantrieb',
}

export const ProductGridItem: React.FC<Props> = ({ product }) => {
  const { gallery, priceInUSD, title, tractorSpecs } = product

  let price = priceInUSD

  const variants = product.variants?.docs

  if (variants && variants.length > 0) {
    const variant = variants[0]
    if (
      variant &&
      typeof variant === 'object' &&
      variant?.priceInUSD &&
      typeof variant.priceInUSD === 'number'
    ) {
      price = variant.priceInUSD
    }
  }

  const image =
    gallery?.[0]?.image && typeof gallery[0]?.image !== 'string' ? gallery[0]?.image : false

  const powerHp = tractorSpecs?.power_hp
  const drive = tractorSpecs?.drive
    ? (DRIVE_LABELS[tractorSpecs.drive] ?? tractorSpecs.drive)
    : null
  const gearbox = tractorSpecs?.gearbox ?? tractorSpecs?.transmission_type ?? null

  const specs = [powerHp != null ? `${powerHp} PS` : null, drive, gearbox].filter(
    Boolean,
  ) as string[]

  return (
    <div className="group flex flex-col rounded-xl border border-border bg-card overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      <Link
        href={`/products/${product.slug}`}
        className="relative block aspect-[4/3] overflow-hidden bg-muted"
      >
        {image ? (
          <Media
            className="w-full h-full"
            imgClassName="w-full h-full object-cover transition duration-300 ease-in-out group-hover:scale-105"
            resource={image}
            width={400}
            height={300}
          />
        ) : (
          <div className="w-full h-full bg-muted flex items-center justify-center p-8">
            <img
              src="/assets/farmersstuff-orange.svg"
              alt={title ?? 'Produkt'}
              className="w-full h-full object-contain opacity-30"
            />
          </div>
        )}
      </Link>

      <div className="flex flex-col gap-3 p-4 flex-1">
        <h3 className="font-bold text-base leading-tight">{title}</h3>

        {specs.length > 0 && (
          <ul className="flex flex-col gap-1">
            {specs.map((spec) => (
              <li key={spec} className="flex items-center gap-2 text-sm text-muted-foreground">
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />
                {spec}
              </li>
            ))}
          </ul>
        )}

        <div className="flex items-center justify-between mt-auto pt-2">
          {typeof price === 'number' ? (
            <Price amount={price} className="text-lg font-bold text-primary" />
          ) : (
            <span />
          )}

          <Link href={`/products/${product.slug}`}>
            <button className="rounded bg-orange-500 px-4 py-2 text-sm font-semibold text-white hover:bg-orange-600 transition-colors whitespace-nowrap">
              Zum Produkt
            </button>
          </Link>
        </div>
      </div>
    </div>
  )
}
