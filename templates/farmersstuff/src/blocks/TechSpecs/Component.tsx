import { cn } from '@/utilities/cn'
import React from 'react'
import type { TechSpecsBlock as TechSpecsBlockProps, Product } from '@/payload-types'
import { productSpecsRegistry, type ProductType } from '@/collections/Products/specs/registry'
import type { Field } from 'payload'

function getLabel(field: Field): string {
  if ('label' in field && field.label && typeof field.label === 'string') return field.label
  if ('name' in field && typeof field.name === 'string') return field.name
  return ''
}

function formatValue(field: Field, value: unknown): string | null {
  if (value === null || value === undefined) return null

  if ('type' in field && field.type === 'checkbox') {
    return value ? 'Ja' : 'Nein'
  }

  if (
    'type' in field &&
    field.type === 'select' &&
    'options' in field &&
    Array.isArray(field.options)
  ) {
    const match = field.options.find(
      (opt) => typeof opt === 'object' && 'value' in opt && opt.value === value,
    )
    if (match && typeof match === 'object' && 'label' in match) return String(match.label)
  }

  return String(value)
}

export const TechSpecsBlockComponent: React.FC<
  TechSpecsBlockProps & {
    id?: string | number
    className?: string
    fullWidth?: boolean
    product?: Product
  }
> = ({ title, className, product }) => {
  if (!product?.productType) return null

  const productType = product.productType as ProductType
  const specFields = productSpecsRegistry[productType]
  if (!specFields) return null

  const specsKey = `${productType}Specs` as keyof Product
  const specsData = product[specsKey] as Record<string, unknown> | undefined | null
  if (!specsData) return null

  const rows = specFields
    .map((field) => {
      const name = 'name' in field ? (field.name as string) : null
      if (!name) return null
      const value = specsData[name]
      const formatted = formatValue(field, value)
      if (formatted === null) return null
      return { label: getLabel(field), value: formatted }
    })
    .filter(Boolean) as { label: string; value: string }[]

  if (rows.length === 0) return null

  return (
    <div className={cn(className)}>
      {title && <h2 className="mb-6 text-2xl font-bold">{title}</h2>}
      <div className="overflow-hidden rounded-lg border border-border">
        <table className="w-full text-sm">
          <tbody>
            {rows.map((row, index) => (
              <tr
                key={index}
                className={cn('border-b border-border last:border-0', {
                  'bg-muted/40': index % 2 === 0,
                })}
              >
                <td className="px-4 py-2.5 font-medium text-muted-foreground w-1/2">{row.label}</td>
                <td className="px-4 py-2.5 w-1/2">{row.value}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
