import type { Field } from 'payload'
import { anhaengerSpecsFields } from './anhaengerSpecs'
import { attachmentSpecsFields } from './attachmentSpecs'
import { constructionSpecsFields } from './constructionSpecs'
import { frontladerZubehoerSpecsFields } from './frontladerZubehoerSpecs'
import { schlegelSpecsFields } from './schlegelSpecs'
import { excavatorSpecsFields } from './excavatorSpecs'
import { tractorSpecsFields } from './tractorSpecs'

export type ProductType =
  | 'tractor'
  | 'attachment'
  | 'construction'
  | 'schlegel'
  | 'frontladerZubehoer'
  | 'anhaenger'
  | 'excavator'

/**
 * Central registry mapping product types to their spec field definitions.
 * To add a new product type:
 * 1. Create a new spec file (e.g., `newTypeSpecs.ts`)
 * 2. Export `newTypeSpecsFields: Field[]`
 * 3. Import and add entry here
 * 4. Add the type to `ProductType` union above
 * 5. Update `productType` select options in main collection
 */
export const productSpecsRegistry: Record<ProductType, Field[]> = {
  tractor: tractorSpecsFields,
  attachment: attachmentSpecsFields,
  construction: constructionSpecsFields,
  schlegel: schlegelSpecsFields,
  frontladerZubehoer: frontladerZubehoerSpecsFields,
  anhaenger: anhaengerSpecsFields,
  excavator: excavatorSpecsFields,
}

/**
 * Generates a group field for a given product type with conditional visibility.
 * The group is only visible in admin UI when the corresponding productType is selected.
 */
export function createProductSpecsGroup(productType: ProductType, fieldName: string): Field {
  return {
    name: fieldName,
    type: 'group',
    admin: {
      condition: (data) => data?.productType === productType,
    },
    fields: productSpecsRegistry[productType],
  }
}

/**
 * Generates all product spec group fields dynamically from the registry.
 * This allows adding new product types without modifying the main collection file.
 */
export function getAllProductSpecsGroups(): Field[] {
  return Object.entries(productSpecsRegistry).map(([productType]) => {
    const fieldName = `${productType}Specs`
    return createProductSpecsGroup(productType as ProductType, fieldName)
  })
}
