import { Grid } from '@/components/Grid'
import { ProductGridItem } from '@/components/ProductGridItem'
import { SortBar } from '@/components/layout/search/SortBar'
import { sorting } from '@/lib/constants'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import React from 'react'

export const metadata = {
  description: 'Search for products in the store.',
  title: 'Shop',
}

type SearchParams = { [key: string]: string | string[] | undefined }

type Props = {
  searchParams: Promise<SearchParams>
}

const DEFAULT_LIMIT = 9

export default async function ShopPage({ searchParams }: Props) {
  const { q: searchValue, sort, category, limit: limitParam } = await searchParams
  const payload = await getPayload({ config: configPromise })

  const limitValue = limitParam ? Number(limitParam) : DEFAULT_LIMIT
  const limit = limitValue === 0 ? 0 : limitValue

  const products = await payload.find({
    collection: 'products',
    draft: false,
    ...(limit > 0 ? { limit } : { limit: 10000 }),
    overrideAccess: false,
    select: {
      title: true,
      slug: true,
      gallery: true,
      categories: true,
      priceInUSD: true,
      tractorSpecs: true,
    },
    ...(sort ? { sort } : { sort: 'title' }),
    ...(searchValue || category
      ? {
          where: {
            and: [
              {
                _status: {
                  equals: 'published',
                },
              },
              ...(searchValue
                ? [
                    {
                      or: [
                        {
                          title: {
                            like: searchValue,
                          },
                        },
                        {
                          description: {
                            like: searchValue,
                          },
                        },
                      ],
                    },
                  ]
                : []),
              ...(category
                ? [
                    {
                      categories: {
                        contains: category,
                      },
                    },
                  ]
                : []),
            ],
          },
        }
      : {}),
  })

  return (
    <div>
      <SortBar count={products.docs.length} total={products.totalDocs} sortList={sorting} />

      {searchValue && products.docs?.length === 0 && (
        <p className="mb-4">
          {'There are no products that match '}
          <span className="font-bold">&quot;{searchValue}&quot;</span>
        </p>
      )}

      {!searchValue && products.docs?.length === 0 && (
        <p className="mb-4">Keine Produkte gefunden. Bitte andere Filter verwenden.</p>
      )}

      {products?.docs.length > 0 ? (
        <Grid className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6 mt-4">
          {products.docs.map((product) => {
            return <ProductGridItem key={product.id} product={product} />
          })}
        </Grid>
      ) : null}
    </div>
  )
}
