import { Archive } from '@/blocks/ArchiveBlock/config'
import { Banner } from '@/blocks/Banner/config'
import { CallToAction } from '@/blocks/CallToAction/config'
import { Carousel } from '@/blocks/Carousel/config'
import { ChecklistBlock } from '@/blocks/Checklist/config'
import { Content } from '@/blocks/Content/config'
import { FormBlock } from '@/blocks/Form/config'
import { IconFeaturesBlock } from '@/blocks/IconFeatures/config'
import { MediaBlock } from '@/blocks/MediaBlock/config'
import { QuickSpecsBlock } from '@/blocks/QuickSpecs/config'
import { TechSpecsBlock } from '@/blocks/TechSpecs/config'
import { ThreeItemGrid } from '@/blocks/ThreeItemGrid/config'
import { YoutubeBlock } from '@/blocks/Youtube/config'
import { generatePreviewPath } from '@/utilities/generatePreviewPath'
import { CollectionOverride } from '@payloadcms/plugin-ecommerce/types'
import {
  MetaDescriptionField,
  MetaImageField,
  MetaTitleField,
  OverviewField,
  PreviewField,
} from '@payloadcms/plugin-seo/fields'
import {
  FixedToolbarFeature,
  HeadingFeature,
  HorizontalRuleFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'
import type { Field } from 'payload'
import { DefaultDocumentIDType, slugField, Where } from 'payload'

import { computePricesHook } from './hooks/computePrices'
import { assignArticleNumberHook } from './hooks/assignArticleNumber'
import { getAllProductSpecsGroups, type ProductType } from './specs/registry'

/** Transform plugin price fields: show as "Bruttopreis", always enabled (hide checkbox) */
function mapPriceFieldsToBruttopreis(fields: Field[]): Field[] {
  return fields.map((field) => {
    const f = field as Field & { name?: string; fields?: Field[] }
    if (f.type === 'group' && Array.isArray(f.fields)) {
      const hasUSD = f.fields.some((row: Field) =>
        (row as Field & { fields?: Field[] }).fields?.some(
          (cell: Field) => (cell as Field & { name?: string }).name === 'priceInUSDEnabled',
        ),
      )
      if (hasUSD) {
        return {
          ...f,
          admin: {
            ...f.admin,
            description: 'Bruttopreis (inkl. MwSt.) für Sortierung, Filter und Checkout.',
          },
          fields: f.fields.map((row: Field) => {
            const r = row as Field & { fields?: Field[] }
            if (r.type === 'row' && Array.isArray(r.fields)) {
              return {
                ...r,
                fields: r.fields.map((cell: Field) => {
                  const c = cell as Field & { name?: string }
                  if (c.name === 'priceInUSDEnabled') {
                    return {
                      ...c,
                      defaultValue: true,
                      admin: { ...c.admin, condition: () => false },
                    }
                  }
                  if (c.name === 'priceInUSD') {
                    return {
                      ...c,
                      label: 'Bruttopreis',
                      admin: {
                        ...c.admin,
                        description: 'Preis inkl. MwSt.',
                        components: {
                          ...(c.admin as Record<string, unknown>)?.components,
                          Cell: {
                            path: '@/components/admin/ShopCurrencyPriceCell#ShopCurrencyPriceCell',
                          },
                          Field: {
                            path: '@/components/admin/ShopCurrencyPriceInput#ShopCurrencyPriceInput',
                          },
                        },
                      },
                    }
                  }
                  return cell
                }),
              }
            }
            return row
          }),
        }
      }
    }
    return field
  })
}

export const ProductsCollection: CollectionOverride = ({ defaultCollection }) => ({
  ...defaultCollection,
  hooks: {
    ...defaultCollection.hooks,
    beforeChange: [
      ...(defaultCollection.hooks?.beforeChange ?? []),
      assignArticleNumberHook,
      computePricesHook,
    ],
  },
  admin: {
    ...defaultCollection?.admin,
    defaultColumns: ['title', 'articleNumber', 'enableVariants', '_status', 'variants.variants'],
    livePreview: {
      url: ({ data, req }) =>
        generatePreviewPath({
          slug: data?.slug,
          collection: 'products',
          req,
        }),
    },
    preview: (data, { req }) =>
      generatePreviewPath({
        slug: data?.slug as string,
        collection: 'products',
        req,
      }),
    useAsTitle: 'title',
  },
  defaultPopulate: {
    ...defaultCollection?.defaultPopulate,
    title: true,
    articleNumber: true,
    slug: true,
    variantOptions: true,
    variants: true,
    enableVariants: true,
    gallery: true,
    priceInUSD: true,
    netPrice: true,
    useShopTaxRate: true,
    taxRate: true,
    inventory: true,
    meta: true,
  },
  fields: [
    { name: 'title', type: 'text', required: true },
    {
      name: 'articleNumber',
      type: 'text',
      required: false,
      admin: {
        description:
          'Article number / SKU. Left empty, it is auto-assigned from the first product category (prefix 101–126 + sequence). Can be set manually or from Lexware/sync.',
        position: 'sidebar',
      },
    },
    // Baseline ecommerce fields first to keep legacy behavior deterministic (with Bruttopreis mapping)
    ...mapPriceFieldsToBruttopreis(defaultCollection.fields),
    {
      // Optional discriminator so type-specific specs stay filterable and conditionally rendered
      name: 'productType',
      type: 'select',
      required: false,
      admin: {
        position: 'sidebar',
        description:
          'Steuert, welche technischen Felder sichtbar sind. Optional für Produkte ohne spezifische Typ-Spezifikationen.',
      },
      options: [
        { label: 'Tractor', value: 'tractor' },
        { label: 'Attachment', value: 'attachment' },
        { label: 'Construction', value: 'construction' },
        { label: 'Schlegel', value: 'schlegel' },
        { label: 'Frontlader Zubehör', value: 'frontladerZubehoer' },
        { label: 'Anhänger', value: 'anhaenger' },
        { label: 'Bagger', value: 'excavator' },
      ] as Array<{ label: string; value: ProductType }>,
    },
    {
      type: 'tabs',
      tabs: [
        {
          fields: [
            {
              name: 'description_short',
              type: 'textarea',
              label: 'Kurzbeschreibung',
              maxLength: 300,
              required: false,
              admin: {
                placeholder: 'Kurze Produktbeschreibung eingeben.',
              },
            },
            {
              name: 'description_long',
              type: 'richText',
              editor: lexicalEditor({
                features: ({ rootFeatures }) => {
                  return [
                    ...rootFeatures,
                    HeadingFeature({ enabledHeadingSizes: ['h1', 'h2', 'h3', 'h4'] }),
                    FixedToolbarFeature(),
                    InlineToolbarFeature(),
                    HorizontalRuleFeature(),
                  ]
                },
              }),
              label: 'Detailbeschreibung',
              required: false,
            },
            {
              name: 'gallery',
              type: 'array',
              minRows: 1,
              fields: [
                {
                  name: 'image',
                  type: 'upload',
                  relationTo: 'media',
                  required: true,
                },
                {
                  name: 'variantOption',
                  type: 'relationship',
                  relationTo: 'variantOptions',
                  admin: {
                    condition: (data) => {
                      return data?.enableVariants === true && data?.variantTypes?.length > 0
                    },
                  },
                  filterOptions: ({ data }) => {
                    if (data?.enableVariants && data?.variantTypes?.length) {
                      const variantTypeIDs = data.variantTypes.map(
                        (item: DefaultDocumentIDType | { id: DefaultDocumentIDType }) => {
                          if (typeof item === 'object' && item?.id) {
                            return item.id
                          }
                          return item
                        },
                      ) as DefaultDocumentIDType[]

                      if (variantTypeIDs.length === 0)
                        return {
                          variantType: {
                            in: [],
                          },
                        }

                      const query: Where = {
                        variantType: {
                          in: variantTypeIDs,
                        },
                      }

                      return query
                    }

                    return {
                      variantType: {
                        in: [],
                      },
                    }
                  },
                },
              ],
            },

            {
              name: 'layout',
              type: 'blocks',
              blocks: [
                CallToAction,
                Content,
                FormBlock,
                MediaBlock,
                Banner,
                Archive,
                Carousel,
                ThreeItemGrid,
                YoutubeBlock,
                TechSpecsBlock,
                QuickSpecsBlock,
                ChecklistBlock,
                IconFeaturesBlock,
              ],
            },
          ],
          label: 'Content',
        },
        {
          fields: [
            // Dynamically generated product spec groups from registry
            ...getAllProductSpecsGroups(),
            {
              name: 'useShopTaxRate',
              type: 'checkbox',
              defaultValue: true,
              required: false,
              admin: {
                description:
                  'Use the default tax rate from Shop Settings. Uncheck to set a product-specific tax rate.',
              },
              label: 'Use shop tax rate',
            },
            {
              name: 'taxRate',
              type: 'number',
              required: false,
              min: 0,
              max: 100,
              admin: {
                description:
                  'Tax rate in % for this product (e.g. 19 for 19%). Only used when "Use shop tax rate" is unchecked.',
                condition: (_, siblingData) => siblingData?.useShopTaxRate === false,
                step: 0.01,
              },
              label: 'Tax rate (%)',
            },
            {
              name: 'netPrice',
              type: 'number',
              required: false,
              admin: {
                description:
                  'Preis ohne MwSt. Wird aus Bruttopreis berechnet oder füllt den Bruttopreis (je nach Steuersatz).',
                step: 0.01,
                components: {
                  Cell: {
                    path: '@/components/admin/ShopCurrencyPriceCell#ShopCurrencyPriceCell',
                  },
                  Field: {
                    path: '@/components/admin/ShopCurrencyPriceInput#ShopCurrencyPriceInput',
                  },
                },
              },
              label: 'Nettopreis',
            },
            {
              name: 'relatedProducts',
              type: 'relationship',
              filterOptions: ({ id }) => {
                if (id) {
                  return {
                    id: {
                      not_in: [id],
                    },
                  }
                }

                // ID comes back as undefined during seeding so we need to handle that case
                return {
                  id: {
                    exists: true,
                  },
                }
              },
              hasMany: true,
              relationTo: 'products',
            },
          ],
          label: 'Product Details',
        },
        {
          name: 'meta',
          label: 'SEO',
          fields: [
            OverviewField({
              titlePath: 'meta.title',
              descriptionPath: 'meta.description',
              imagePath: 'meta.image',
            }),
            MetaTitleField({
              hasGenerateFn: true,
            }),
            MetaImageField({
              relationTo: 'media',
            }),

            MetaDescriptionField({}),
            PreviewField({
              // if the `generateUrl` function is configured
              hasGenerateFn: true,

              // field paths to match the target field for data
              titlePath: 'meta.title',
              descriptionPath: 'meta.description',
            }),
          ],
        },
        {
          label: 'Kleinanzeigen',
          fields: [
            {
              name: 'kleinanzeigenGenerator',
              type: 'ui',
              admin: {
                components: {
                  Field:
                    '@/components/admin/KleinanzeigenGeneratorField#KleinanzeigenGeneratorField',
                },
              },
            },
            {
              name: 'classifieds',
              type: 'join',
              collection: 'classifieds',
              on: 'product',
              admin: {
                allowCreate: false,
                defaultColumns: ['title', 'active', 'price', 'updatedAt'],
                description: 'Kleinanzeigen für dieses Produkt',
              },
            },
          ],
        },
        {
          label: 'KI-Import',
          fields: [
            {
              name: 'specImportText',
              type: 'ui',
              admin: {
                components: {
                  Field: '@/components/admin/SpecImportField#SpecImportField',
                },
              },
            },
          ],
        },
      ],
    },
    {
      name: 'categories',
      type: 'relationship',
      admin: {
        position: 'sidebar',
        sortOptions: 'title',
      },
      hasMany: true,
      relationTo: 'categories',
    },
    slugField(),
  ],
})
