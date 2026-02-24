'use client'

import { Price } from '@/components/Price'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { useCart } from '@payloadcms/plugin-ecommerce/client/react'
import { ArrowRight, Lock, ShoppingCart, Truck, X } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React, { useEffect, useMemo, useState } from 'react'

import { DeleteItemButton } from './DeleteItemButton'
import { EditItemQuantityButton } from './EditItemQuantityButton'
import { OpenCartButton } from './OpenCart'
import { Button } from '@/components/ui/button'
import { Product } from '@/payload-types'

export function CartModal() {
  const { cart } = useCart()
  const [isOpen, setIsOpen] = useState(false)

  const pathname = usePathname()

  useEffect(() => {
    setIsOpen(false)
  }, [pathname])

  const totalQuantity = useMemo(() => {
    if (!cart || !cart.items || !cart.items.length) return undefined
    return cart.items.reduce((quantity, item) => (item.quantity || 0) + quantity, 0)
  }, [cart])

  const isEmpty = !cart || !cart.items || cart.items.length === 0

  return (
    <Sheet onOpenChange={setIsOpen} open={isOpen}>
      <SheetTrigger asChild>
        <OpenCartButton quantity={totalQuantity} />
      </SheetTrigger>

      <SheetContent className="flex flex-col w-full sm:max-w-md p-0 gap-0">
        {/* Header */}
        <SheetHeader className="flex flex-row items-center justify-between px-6 py-4 border-b border-border shrink-0">
          <div className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5 text-primary" />
            <SheetTitle className="text-lg font-bold">
              Warenkorb
              {totalQuantity ? (
                <span className="ml-2 text-sm font-normal text-muted-foreground">
                  ({totalQuantity} {totalQuantity === 1 ? 'Artikel' : 'Artikel'})
                </span>
              ) : null}
            </SheetTitle>
          </div>
        </SheetHeader>

        {isEmpty ? (
          /* Empty state */
          <div className="flex flex-col items-center justify-center flex-1 gap-6 px-6 py-16 text-center">
            <div className="rounded-full bg-muted p-6">
              <ShoppingCart className="h-10 w-10 text-muted-foreground" />
            </div>
            <div>
              <p className="text-xl font-bold mb-1">Ihr Warenkorb ist leer</p>
              <p className="text-sm text-muted-foreground">
                Entdecken Sie unsere Produkte und fügen Sie Artikel hinzu.
              </p>
            </div>
            <Button asChild size="lg" onClick={() => setIsOpen(false)}>
              <Link href="/shop">
                Zum Shop
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        ) : (
          <>
            {/* Item list */}
            <ul className="flex-1 overflow-y-auto divide-y divide-border px-6">
              {cart?.items?.map((item, i) => {
                const product = item.product
                const variant = item.variant

                if (typeof product !== 'object' || !item || !product || !product.slug)
                  return <React.Fragment key={i} />

                const metaImage =
                  product.meta?.image && typeof product.meta?.image === 'object'
                    ? product.meta.image
                    : undefined

                const firstGalleryImage =
                  typeof product.gallery?.[0]?.image === 'object'
                    ? product.gallery?.[0]?.image
                    : undefined

                let image = firstGalleryImage || metaImage
                let price = product.priceInUSD

                const isVariant = Boolean(variant) && typeof variant === 'object'

                if (isVariant) {
                  price = variant?.priceInUSD

                  const imageVariant = product.gallery?.find((galleryItem) => {
                    if (!galleryItem.variantOption) return false
                    const variantOptionID =
                      typeof galleryItem.variantOption === 'object'
                        ? galleryItem.variantOption.id
                        : galleryItem.variantOption

                    return variant?.options?.some((option) => {
                      if (typeof option === 'object') return option.id === variantOptionID
                      return option === variantOptionID
                    })
                  })

                  if (imageVariant && typeof imageVariant.image === 'object') {
                    image = imageVariant.image
                  }
                }

                return (
                  <li key={i} className="py-4">
                    <div className="flex gap-4">
                      {/* Product image */}
                      <Link
                        href={`/products/${(item.product as Product)?.slug}`}
                        className="shrink-0"
                      >
                        <div className="relative h-20 w-20 overflow-hidden rounded-md border border-border bg-[#f5f5f5]">
                          {image?.url ? (
                            <Image
                              alt={image?.alt || product?.title || ''}
                              className="h-full w-full object-cover"
                              height={80}
                              src={image.url}
                              width={80}
                            />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center">
                              <ShoppingCart className="h-6 w-6 text-muted-foreground" />
                            </div>
                          )}
                        </div>
                      </Link>

                      {/* Info + controls */}
                      <div className="flex flex-1 flex-col gap-2 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0">
                            <Link href={`/products/${(item.product as Product)?.slug}`}>
                              <p className="font-medium text-sm leading-snug truncate hover:text-primary transition-colors">
                                {product?.title}
                              </p>
                            </Link>
                            {isVariant && variant ? (
                              <p className="text-xs text-muted-foreground capitalize mt-0.5">
                                {variant.options
                                  ?.map((option) =>
                                    typeof option === 'object' ? option.label : null,
                                  )
                                  .filter(Boolean)
                                  .join(', ')}
                              </p>
                            ) : null}
                          </div>
                          {/* Remove button */}
                          <DeleteItemButton item={item} />
                        </div>

                        <div className="flex items-center justify-between mt-auto">
                          {/* Quantity stepper */}
                          <div className="flex h-8 items-center rounded-md border border-border overflow-hidden">
                            <EditItemQuantityButton item={item} type="minus" />
                            <span className="w-8 text-center text-sm font-medium">
                              {item.quantity}
                            </span>
                            <EditItemQuantityButton item={item} type="plus" />
                          </div>

                          {/* Line price */}
                          {typeof price === 'number' && (
                            <Price
                              amount={price * (item.quantity ?? 1)}
                              className="text-sm font-semibold"
                            />
                          )}
                        </div>
                      </div>
                    </div>
                  </li>
                )
              })}
            </ul>

            {/* Footer */}
            <div className="shrink-0 border-t border-border bg-background px-6 py-5 flex flex-col gap-4">
              {/* Subtotal */}
              {typeof cart?.subtotal === 'number' && (
                <div className="flex flex-col gap-2 text-sm">
                  <div className="flex items-center justify-between text-muted-foreground">
                    <span>Zwischensumme</span>
                    <Price amount={cart.subtotal} />
                  </div>
                  <div className="flex items-center justify-between text-muted-foreground">
                    <span>Versand</span>
                    <span className="text-green-600 font-medium">Auf Anfrage</span>
                  </div>
                  <div className="flex items-center justify-between font-bold text-base border-t border-border pt-2 mt-1">
                    <span>Gesamt</span>
                    <Price amount={cart.subtotal} className="text-primary" />
                  </div>
                </div>
              )}

              {/* CTA */}
              <Button asChild size="lg" className="w-full text-base font-semibold">
                <Link href="/checkout">
                  Zur Kasse
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>

              <Button
                variant="outline"
                size="sm"
                className="w-full"
                onClick={() => setIsOpen(false)}
              >
                Weiter einkaufen
              </Button>

              {/* Trust signals */}
              <div className="flex items-center justify-center gap-6 text-xs text-muted-foreground pt-1">
                <span className="flex items-center gap-1">
                  <Lock className="h-3 w-3" />
                  Sicher bezahlen
                </span>
                <span className="flex items-center gap-1">
                  <Truck className="h-3 w-3" />
                  Versand auf Anfrage
                </span>
              </div>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  )
}
