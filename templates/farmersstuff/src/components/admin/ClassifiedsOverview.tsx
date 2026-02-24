import type { AdminViewProps } from 'payload'
import { getPayload } from 'payload'
import config from '@payload-config'
import Link from 'next/link'

export default async function ClassifiedsOverview({ initPageResult }: AdminViewProps) {
  const payload = await getPayload({ config })

  const productsResult = await payload.find({
    collection: 'products',
    limit: 200,
    select: {
      title: true,
      articleNumber: true,
    },
    sort: 'title',
  })

  const products = productsResult.docs

  const classifiedsCounts = await Promise.all(
    products.map(async (product) => {
      const result = await payload.count({
        collection: 'classifieds',
        where: {
          product: {
            equals: product.id,
          },
        },
      })
      return { productId: product.id, count: result.totalDocs }
    }),
  )

  const countMap = new Map(classifiedsCounts.map((c) => [c.productId, c.count]))

  return (
    <div
      style={{
        padding: '2rem',
        fontFamily: 'var(--font-body)',
      }}
    >
      <div style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: '0.25rem' }}>
          Kleinanzeigen Übersicht
        </h1>
        <p style={{ color: 'var(--theme-text)', opacity: 0.7, fontSize: '0.875rem' }}>
          Alle Produkte mit Anzahl der verknüpften Kleinanzeigen
        </p>
      </div>

      <table
        style={{
          width: '100%',
          borderCollapse: 'collapse',
          fontSize: '0.875rem',
        }}
      >
        <thead>
          <tr
            style={{
              borderBottom: '2px solid var(--theme-border-color)',
              textAlign: 'left',
            }}
          >
            <th style={{ padding: '0.75rem 1rem', fontWeight: 600 }}>Artikelnummer</th>
            <th style={{ padding: '0.75rem 1rem', fontWeight: 600 }}>Produktname</th>
            <th style={{ padding: '0.75rem 1rem', fontWeight: 600, textAlign: 'center' }}>
              Kleinanzeigen
            </th>
            <th style={{ padding: '0.75rem 1rem', fontWeight: 600 }}>Aktionen</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product, index) => {
            const count = countMap.get(product.id) ?? 0
            const hasClassifieds = count > 0

            return (
              <tr
                key={product.id}
                style={{
                  borderBottom: '1px solid var(--theme-border-color)',
                  backgroundColor: index % 2 === 0 ? 'transparent' : 'var(--theme-bg)',
                }}
              >
                <td style={{ padding: '0.75rem 1rem', color: 'var(--theme-text)', opacity: 0.7 }}>
                  {(product as { articleNumber?: string }).articleNumber ?? '—'}
                </td>
                <td style={{ padding: '0.75rem 1rem' }}>
                  <Link
                    href={`/admin/collections/products/${product.id}`}
                    style={{ color: 'var(--theme-text)', textDecoration: 'none' }}
                  >
                    {product.title}
                  </Link>
                </td>
                <td style={{ padding: '0.75rem 1rem', textAlign: 'center' }}>
                  <span
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: '2rem',
                      height: '2rem',
                      borderRadius: '50%',
                      backgroundColor: hasClassifieds
                        ? 'var(--theme-success-500, #22c55e)'
                        : 'var(--theme-error-500, #ef4444)',
                      color: '#fff',
                      fontWeight: 600,
                      fontSize: '0.75rem',
                    }}
                  >
                    {count}
                  </span>
                </td>
                <td style={{ padding: '0.75rem 1rem' }}>
                  <Link
                    href={`/admin/collections/classifieds?where[product][equals]=${product.id}`}
                    style={{
                      color: 'var(--theme-text)',
                      textDecoration: 'none',
                      marginRight: '1rem',
                      fontSize: '0.8125rem',
                    }}
                  >
                    Anzeigen anzeigen
                  </Link>
                  <Link
                    href={`/admin/collections/classifieds/create?product=${product.id}`}
                    style={{
                      color: 'var(--theme-success-500, #22c55e)',
                      textDecoration: 'none',
                      fontSize: '0.8125rem',
                    }}
                  >
                    + Neue Anzeige
                  </Link>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>

      {products.length === 0 && (
        <p style={{ textAlign: 'center', padding: '2rem', opacity: 0.5 }}>
          Keine Produkte gefunden.
        </p>
      )}
    </div>
  )
}
