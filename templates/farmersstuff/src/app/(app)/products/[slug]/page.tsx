import type { Media, Product } from '@/payload-types'

import { RenderBlocks } from '@/blocks/RenderBlocks'
import { GridTileImage } from '@/components/Grid/tile'
import { Gallery } from '@/components/product/Gallery'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { draftMode } from 'next/headers'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import React, { Suspense } from 'react'
import { Button } from '@/components/ui/button'
import { ChevronLeftIcon, ChevronRightIcon, Phone } from 'lucide-react'
import { Metadata } from 'next'
import { Price } from '@/components/Price'
import { RichText } from '@/components/RichText'

// Breadcrumb Component
function Breadcrumb({ items }: { items: { label: string; href?: string }[] }) {
  return (
    <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
      <ChevronRightIcon className="h-4 w-4" />
      {items.map((item, index) => (
        <React.Fragment key={index}>
          {item.href ? (
            <Link href={item.href} className="hover:text-foreground transition-colors">
              {item.label}
            </Link>
          ) : (
            <span className="text-foreground uppercase font-medium tracking-wider">
              {item.label}
            </span>
          )}
          {index < items.length - 1 && <ChevronRightIcon className="h-4 w-4" />}
        </React.Fragment>
      ))}
    </nav>
  )
}

type Args = {
  params: Promise<{
    slug: string
  }>
}

export async function generateMetadata({ params }: Args): Promise<Metadata> {
  const { slug } = await params
  const product = await queryProductBySlug({ slug })

  if (!product) return notFound()

  const gallery = product.gallery?.filter((item) => typeof item.image === 'object') || []

  const metaImage = typeof product.meta?.image === 'object' ? product.meta?.image : undefined
  const canIndex = product._status === 'published'

  const seoImage = metaImage || (gallery.length ? (gallery[0]?.image as Media) : undefined)

  return {
    description: product.meta?.description || '',
    openGraph: seoImage?.url
      ? {
          images: [
            {
              alt: seoImage?.alt,
              height: seoImage.height!,
              url: seoImage?.url,
              width: seoImage.width!,
            },
          ],
        }
      : null,
    robots: {
      follow: canIndex,
      googleBot: {
        follow: canIndex,
        index: canIndex,
      },
      index: canIndex,
    },
    title: product.meta?.title || product.title,
  }
}

export default async function ProductPage({ params }: Args) {
  const { slug } = await params
  const product = await queryProductBySlug({ slug })

  if (!product) return notFound()

  const gallery =
    product.gallery
      ?.filter((item) => typeof item.image === 'object')
      .map((item) => ({
        ...item,
        image: item.image as Media,
      })) || []

  const metaImage = typeof product.meta?.image === 'object' ? product.meta?.image : undefined

  // Hero background: prefer meta image, fall back to first gallery image
  const heroImage = metaImage || (gallery.length ? gallery[0]?.image : undefined)
  const heroImageUrl = heroImage?.url || null

  const productJsonLd = {
    name: product.title,
    '@context': 'https://schema.org',
    '@type': 'Product',
    description: product.description,
    image: metaImage?.url,
    offers: {
      '@type': 'Offer',
      price: product.priceInUSD,
      priceCurrency: 'usd',
    },
  }

  const relatedProducts =
    product.relatedProducts?.filter((relatedProduct) => typeof relatedProduct === 'object') ?? []

  return (
    <div className="relative min-h-screen">
      <script
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
        type="application/ld+json"
      />

      {/* Hero background: covers the entire page, right-aligned, height-based */}
      {heroImageUrl && (
        <div className="absolute inset-0 pointer-events-none select-none overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={heroImageUrl}
            alt=""
            className="absolute top-0 right-0 h-full w-auto max-w-[55%] object-contain object-right-top"
          />
          {/* Gradient: dark background fades to transparent right */}
          <div
            className="absolute inset-0"
            style={{
              background:
                'linear-gradient(to right, rgba(26,26,26,1) 40%, rgba(26,26,26,0.9) 55%, rgba(26,26,26,0.5) 72%, transparent 100%)',
            }}
          />
        </div>
      )}

      {/* Page content — all sits on top of the hero bg */}
      <div className="relative container py-8">
        {/* Breadcrumb */}
        <Breadcrumb
          items={[
            { label: 'Startseite', href: '/' },
            {
              label:
                product.categories?.[0] && typeof product.categories[0] === 'object'
                  ? product.categories[0].title
                  : 'Produkte',
              href: '/shop',
            },
            { label: product.title },
          ]}
        />

        {/* Back link */}
        <Button
          asChild
          variant="ghost"
          className="mt-2 mb-6 -ml-2 text-muted-foreground hover:text-foreground"
        >
          <Link href="/shop">
            <ChevronLeftIcon className="h-4 w-4 mr-1" />
            Alle Produkte
          </Link>
        </Button>

        {/* Title above the grid */}
        <h1 className="text-3xl lg:text-4xl font-bold text-foreground mb-6">{product.title}</h1>

        {/* Main grid: Gallery left | Product info right */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Left: Gallery */}
          <div>
            <Suspense
              fallback={
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-card/80 rounded-md" />
              }
            >
              {Boolean(gallery?.length) && <Gallery gallery={gallery} />}
            </Suspense>
          </div>

          {/* Right: Product info */}
          <div className="flex flex-col gap-6">
            {product.description_short && (
              <p className="text-lg text-muted-foreground">{product.description_short}</p>
            )}

            {/* Price */}
            <div>
              <span className="text-4xl lg:text-5xl font-bold text-primary">
                <Price amount={product.priceInUSD || 0} />
              </span>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Button size="lg">Anfrage senden</Button>
              <Button size="lg" variant="outline">
                Verfügbarkeit prüfen
              </Button>
            </div>

            {/* Phone */}
            <div className="flex items-center gap-2 text-muted-foreground">
              <Phone className="h-4 w-4" />
              <span className="text-sm">+49 1234-5678901</span>
            </div>

            {/* Long description */}
            {product.description_long && (
              <div className="pt-4 border-t border-border">
                <RichText data={product.description_long} enableGutter={false} />
              </div>
            )}
          </div>
        </div>

        {/* Layout blocks */}
        {product.layout?.length ? (
          <div className="mt-12">
            <RenderBlocks blocks={product.layout} product={product} />
          </div>
        ) : null}

        {/* Related products */}
        {relatedProducts.length ? (
          <div className="mt-12">
            <RelatedProducts products={relatedProducts as Product[]} />
          </div>
        ) : null}
      </div>
    </div>
  )
}

function RelatedProducts({ products }: { products: Product[] }) {
  if (!products.length) return null

  return (
    <div className="py-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold uppercase tracking-wide">Passendes Zubehör</h2>
        <Link href="/shop" className="text-primary hover:underline text-sm">
          Alle anzeigen
        </Link>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.slice(0, 3).map((product) => (
          <Link key={product.id} href={`/products/${product.slug}`} className="group">
            <div className="bg-card border border-border rounded-md overflow-hidden hover:border-primary transition-colors">
              <div className="aspect-square relative">
                <GridTileImage
                  label={{
                    amount: product.priceInUSD!,
                    title: product.title,
                  }}
                  media={product.meta?.image as Media}
                />
              </div>
              <div className="p-4">
                <h3 className="font-semibold mb-2 group-hover:text-primary transition-colors">
                  {product.title}
                </h3>
                <Button size="sm" className="w-full">
                  Zum Produkt
                </Button>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}

const queryProductBySlug = async ({ slug }: { slug: string }) => {
  const { isEnabled: draft } = await draftMode()

  const payload = await getPayload({ config: configPromise })

  const result = await payload.find({
    collection: 'products',
    depth: 3,
    draft,
    limit: 1,
    overrideAccess: draft,
    pagination: false,
    where: {
      and: [
        {
          slug: {
            equals: slug,
          },
        },
        ...(draft ? [] : [{ _status: { equals: 'published' } }]),
      ],
    },
    populate: {
      variants: {
        title: true,
        priceInUSD: true,
        inventory: true,
        options: true,
      },
    },
  })

  return result.docs?.[0] || null
}
