import type { CollectionConfig } from 'payload'

import { adminOnly } from '@/access/adminOnly'
import { authenticated } from '@/access/authenticated'
import { KLEINANZEIGEN_CATEGORIES } from './categories'

export const Classifieds: CollectionConfig = {
  slug: 'classifieds',
  hooks: {
    beforeChange: [
      async ({ data, operation, req }) => {
        if (operation !== 'create') return data
        if (!req.payload) return data

        let settings: Record<string, unknown> | null = null
        try {
          settings = (await req.payload.findGlobal({
            slug: 'kleinanzeigen-settings',
            req,
          })) as Record<string, unknown>
        } catch {
          return data
        }

        if (!settings) return data

        const contact = settings.contact as Record<string, unknown> | undefined
        if (contact && !data.contact) {
          data.contact = { ...contact }
        }

        const automation = settings.automation as Record<string, unknown> | undefined
        if (automation) {
          if (data.republication_interval == null && automation.republication_interval != null) {
            data.republication_interval = automation.republication_interval
          }
          const existingReduction = data.auto_price_reduction as Record<string, unknown> | undefined
          if (!existingReduction?.enabled && automation.auto_price_reduction_enabled) {
            data.auto_price_reduction = {
              enabled: automation.auto_price_reduction_enabled ?? false,
              strategy: automation.auto_price_reduction_strategy ?? null,
              amount: automation.auto_price_reduction_amount ?? null,
              min_price: automation.auto_price_reduction_min_price ?? null,
              delay_reposts: automation.auto_price_reduction_delay_reposts ?? 0,
              delay_days: automation.auto_price_reduction_delay_days ?? 0,
            }
          }
        }

        const shipping = settings.shipping as Record<string, unknown> | undefined
        if (shipping) {
          if (data.shipping_type == null && shipping.shipping_type != null) {
            data.shipping_type = shipping.shipping_type
          }
          if (data.shipping_costs == null && shipping.shipping_costs != null) {
            data.shipping_costs = shipping.shipping_costs
          }
        }

        return data
      },
    ],
  },
  admin: {
    group: 'Kleinanzeigen',
    useAsTitle: 'title',
    defaultColumns: ['title', 'articleNumber', 'active', 'price', 'updatedAt'],
    description: 'Kleinanzeigen für Kleinanzeigen.de',
  },
  access: {
    create: adminOnly,
    read: authenticated,
    update: adminOnly,
    delete: adminOnly,
  },
  fields: [
    {
      name: 'product',
      type: 'relationship',
      relationTo: 'products',
      required: false,
      admin: {
        position: 'sidebar',
        description: 'Verknüpftes Produkt (Verbindung über Artikelnummer)',
      },
    },
    {
      name: 'articleNumber',
      type: 'text',
      required: false,
      virtual: true,
      admin: {
        position: 'sidebar',
        readOnly: true,
        description: 'Artikelnummer des verknüpften Produkts (automatisch befüllt)',
      },
      hooks: {
        afterRead: [
          async ({ siblingData }) => {
            if (siblingData?.product && typeof siblingData.product === 'object') {
              return (siblingData.product as { articleNumber?: string }).articleNumber ?? null
            }
            return null
          },
        ],
      },
    },
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Anzeige',
          fields: [
            {
              name: 'title',
              type: 'text',
              required: true,
              minLength: 10,
              label: 'Titel',
            },
            {
              name: 'description',
              type: 'textarea',
              required: true,
              label: 'Beschreibung',
              defaultValue: async ({ req }) => {
                const s = await req.payload.findGlobal({ slug: 'kleinanzeigen-settings', req })
                return (s as any)?.description_template ?? null
              },
            },
            {
              name: 'description_prefix',
              type: 'textarea',
              required: false,
              label: 'Beschreibung Präfix',
              admin: {
                description: 'Wird vor der Hauptbeschreibung eingefügt',
              },
            },
            {
              name: 'description_suffix',
              type: 'textarea',
              required: false,
              label: 'Beschreibung Suffix',
              admin: {
                description: 'Wird nach der Hauptbeschreibung eingefügt',
              },
            },
            {
              name: 'category',
              type: 'select',
              required: true,
              label: 'Kategorie',
              options: KLEINANZEIGEN_CATEGORIES,
              admin: {
                description: 'Kleinanzeigen.de Kategorie (Volltext-Suche möglich)',
                isClearable: true,
              },
            },
            {
              name: 'special_attributes',
              type: 'array',
              required: false,
              label: 'Spezielle Attribute',
              admin: {
                description: 'Plattform-spezifische Attribute als Schlüssel-Wert-Paare',
              },
              fields: [
                {
                  name: 'key',
                  type: 'text',
                  required: true,
                  label: 'Schlüssel',
                },
                {
                  name: 'value',
                  type: 'text',
                  required: true,
                  label: 'Wert',
                },
              ],
            },
          ],
        },
        {
          label: 'Preis & Versand',
          fields: [
            {
              name: 'type',
              type: 'select',
              required: false,
              label: 'Anzeigentyp',
              options: [
                { label: 'Angebot', value: 'OFFER' },
                { label: 'Gesuch', value: 'WANTED' },
              ],
            },
            {
              name: 'price',
              type: 'number',
              required: false,
              label: 'Preis (in Euro)',
              admin: {
                description: 'Preis in Euro als ganzzahliger Wert (z.B. 119 = 119 €)',
                step: 1,
              },
            },
            {
              name: 'price_type',
              type: 'select',
              required: false,
              label: 'Preistyp',
              options: [
                { label: 'Festpreis', value: 'FIXED' },
                { label: 'Verhandelbar', value: 'NEGOTIABLE' },
                { label: 'Zu verschenken', value: 'GIVE_AWAY' },
                { label: 'Nicht zutreffend', value: 'NOT_APPLICABLE' },
              ],
            },
            {
              name: 'shipping_type',
              type: 'select',
              required: false,
              label: 'Versandtyp',
              options: [
                { label: 'Abholung', value: 'PICKUP' },
                { label: 'Versand', value: 'SHIPPING' },
                { label: 'Nicht zutreffend', value: 'NOT_APPLICABLE' },
              ],
              defaultValue: async ({ req }) => {
                const s = await req.payload.findGlobal({ slug: 'kleinanzeigen-settings', req })
                return (s as any)?.shipping?.shipping_type ?? null
              },
            },
            {
              name: 'shipping_costs',
              type: 'number',
              required: false,
              label: 'Versandkosten',
              defaultValue: async ({ req }) => {
                const s = await req.payload.findGlobal({ slug: 'kleinanzeigen-settings', req })
                return (s as any)?.shipping?.shipping_costs ?? null
              },
              admin: {
                step: 0.01,
              },
            },
            {
              name: 'shipping_options',
              type: 'array',
              required: false,
              label: 'Versandoptionen',
              fields: [
                {
                  name: 'option',
                  type: 'text',
                  required: true,
                  label: 'Option',
                },
              ],
            },
            {
              name: 'sell_directly',
              type: 'checkbox',
              required: false,
              label: 'Direkt kaufen',
              defaultValue: false,
            },
          ],
        },
        {
          label: 'Bilder',
          fields: [
            {
              name: 'images',
              type: 'array',
              required: false,
              label: 'Bilder',
              maxRows: 10,
              admin: {
                description: 'Maximal 10 Bilder (Limit von Kleinanzeigen.de)',
              },
              fields: [
                {
                  name: 'image',
                  type: 'upload',
                  relationTo: 'media',
                  required: true,
                  label: 'Bild',
                },
              ],
            },
          ],
        },
        {
          label: 'Kontakt',
          fields: [
            {
              name: 'contact',
              type: 'group',
              label: 'Kontaktdaten',
              fields: [
                {
                  name: 'name',
                  type: 'text',
                  required: false,
                  label: 'Name',
                  defaultValue: async ({ req }) => {
                    const s = await req.payload.findGlobal({ slug: 'kleinanzeigen-settings', req })
                    return (s as any)?.contact?.name ?? null
                  },
                },
                {
                  name: 'street',
                  type: 'text',
                  required: false,
                  label: 'Straße',
                  defaultValue: async ({ req }) => {
                    const s = await req.payload.findGlobal({ slug: 'kleinanzeigen-settings', req })
                    return (s as any)?.contact?.street ?? null
                  },
                },
                {
                  name: 'zipcode',
                  type: 'text',
                  required: false,
                  label: 'PLZ',
                  defaultValue: async ({ req }) => {
                    const s = await req.payload.findGlobal({ slug: 'kleinanzeigen-settings', req })
                    return (s as any)?.contact?.zipcode ?? null
                  },
                },
                {
                  name: 'location',
                  type: 'text',
                  required: false,
                  label: 'Ort',
                  defaultValue: async ({ req }) => {
                    const s = await req.payload.findGlobal({ slug: 'kleinanzeigen-settings', req })
                    return (s as any)?.contact?.location ?? null
                  },
                },
                {
                  name: 'phone',
                  type: 'text',
                  required: false,
                  label: 'Telefon',
                  defaultValue: async ({ req }) => {
                    const s = await req.payload.findGlobal({ slug: 'kleinanzeigen-settings', req })
                    return (s as any)?.contact?.phone ?? null
                  },
                },
              ],
            },
          ],
        },
        {
          label: 'Automatisierung',
          fields: [
            {
              name: 'republication_interval',
              type: 'number',
              required: false,
              label: 'Wiederveröffentlichungsintervall (Tage)',
              defaultValue: async ({ req }) => {
                const s = await req.payload.findGlobal({ slug: 'kleinanzeigen-settings', req })
                return (s as any)?.automation?.republication_interval ?? null
              },
              admin: {
                description: 'Anzahl der Tage zwischen automatischen Wiederveröffentlichungen',
                step: 1,
              },
            },
            {
              name: 'repost_count',
              type: 'number',
              required: false,
              label: 'Anzahl Wiederveröffentlichungen',
              defaultValue: 0,
              min: 0,
              admin: {
                description: 'Anzahl erfolgreicher Veröffentlichungen (wird automatisch gepflegt)',
                step: 1,
              },
            },
            {
              name: 'price_reduction_count',
              type: 'number',
              required: false,
              label: 'Anzahl Preisreduzierungen',
              defaultValue: 0,
              min: 0,
              admin: {
                description: 'Anzahl automatischer Preisreduzierungen (wird automatisch gepflegt)',
                step: 1,
              },
            },
            {
              name: 'auto_price_reduction',
              type: 'group',
              label: 'Automatische Preisreduzierung',
              fields: [
                {
                  name: 'enabled',
                  type: 'checkbox',
                  label: 'Aktiviert',
                  defaultValue: async ({ req }) => {
                    const s = await req.payload.findGlobal({ slug: 'kleinanzeigen-settings', req })
                    return (s as any)?.automation?.auto_price_reduction_enabled ?? false
                  },
                  admin: {
                    description: 'Preis bei Wiederveröffentlichungen automatisch senken',
                  },
                },
                {
                  name: 'strategy',
                  type: 'select',
                  required: false,
                  label: 'Strategie',
                  options: [
                    { label: 'Prozentuell', value: 'PERCENTAGE' },
                    { label: 'Fixer Betrag', value: 'FIXED' },
                  ],
                  defaultValue: async ({ req }) => {
                    const s = await req.payload.findGlobal({ slug: 'kleinanzeigen-settings', req })
                    return (s as any)?.automation?.auto_price_reduction_strategy ?? null
                  },
                  admin: {
                    description: 'PERCENTAGE = % des Preises, FIXED = absoluter Betrag',
                    condition: (_, siblingData) => siblingData?.enabled === true,
                  },
                },
                {
                  name: 'amount',
                  type: 'number',
                  required: false,
                  label: 'Betrag',
                  defaultValue: async ({ req }) => {
                    const s = await req.payload.findGlobal({ slug: 'kleinanzeigen-settings', req })
                    return (s as any)?.automation?.auto_price_reduction_amount ?? null
                  },
                  admin: {
                    description:
                      'Für PERCENTAGE: Prozentwert (z.B. 10 = 10%). Für FIXED: Währungsbetrag.',
                    step: 0.01,
                    condition: (_, siblingData) => siblingData?.enabled === true,
                  },
                },
                {
                  name: 'min_price',
                  type: 'number',
                  required: false,
                  label: 'Mindestpreis',
                  min: 0,
                  defaultValue: async ({ req }) => {
                    const s = await req.payload.findGlobal({ slug: 'kleinanzeigen-settings', req })
                    return (s as any)?.automation?.auto_price_reduction_min_price ?? null
                  },
                  admin: {
                    description: 'Preisuntergrenze (0 = kein Minimum)',
                    step: 0.01,
                    condition: (_, siblingData) => siblingData?.enabled === true,
                  },
                },
                {
                  name: 'delay_reposts',
                  type: 'number',
                  required: false,
                  label: 'Verzögerung (Wiederveröffentlichungen)',
                  defaultValue: async ({ req }) => {
                    const s = await req.payload.findGlobal({ slug: 'kleinanzeigen-settings', req })
                    return (s as any)?.automation?.auto_price_reduction_delay_reposts ?? 0
                  },
                  min: 0,
                  admin: {
                    description: 'Anzahl Wiederveröffentlichungen vor erster Preisreduzierung',
                    step: 1,
                    condition: (_, siblingData) => siblingData?.enabled === true,
                  },
                },
                {
                  name: 'delay_days',
                  type: 'number',
                  required: false,
                  label: 'Verzögerung (Tage)',
                  defaultValue: async ({ req }) => {
                    const s = await req.payload.findGlobal({ slug: 'kleinanzeigen-settings', req })
                    return (s as any)?.automation?.auto_price_reduction_delay_days ?? 0
                  },
                  min: 0,
                  admin: {
                    description: 'Tage nach Veröffentlichung vor erster Preisreduzierung',
                    step: 1,
                    condition: (_, siblingData) => siblingData?.enabled === true,
                  },
                },
              ],
            },
          ],
        },
        {
          label: 'Cover Bild',
          fields: [
            {
              name: 'cover_image_generator',
              type: 'ui',
              admin: {
                components: {
                  Field: '@/components/admin/CoverImageGeneratorField#CoverImageGeneratorField',
                },
              },
            },
          ],
        },
        {
          label: 'Plattform',
          fields: [
            {
              name: 'active',
              type: 'checkbox',
              required: false,
              label: 'Aktiv',
              defaultValue: false,
              admin: {
                description: 'Ob die Anzeige auf der Plattform aktiv ist',
              },
            },
            {
              name: 'kleinanzeigen_id',
              type: 'number',
              required: false,
              label: 'Kleinanzeigen ID',
              admin: {
                readOnly: true,
                description: 'Wird durch die externe Schnittstelle befüllt',
              },
            },
            {
              name: 'kleinanzeigen_created_on',
              type: 'text',
              required: false,
              label: 'Erstellt am (Kleinanzeigen)',
              admin: {
                readOnly: true,
                description: 'ISO-8601 Zeitstempel, wird durch die externe Schnittstelle befüllt',
              },
            },
            {
              name: 'content_hash',
              type: 'text',
              required: false,
              label: 'Content Hash',
              admin: {
                readOnly: true,
                description: 'Interner Hash zur Änderungserkennung',
              },
            },
          ],
        },
      ],
    },
  ],
}
