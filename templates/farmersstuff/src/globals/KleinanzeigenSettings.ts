import type { GlobalConfig } from 'payload'

export const KleinanzeigenSettings: GlobalConfig = {
  slug: 'kleinanzeigen-settings',
  label: 'Kleinanzeigen',
  admin: {
    group: 'Settings',
    description:
      'Standardwerte für neue Kleinanzeigen. Werden automatisch vorausgefüllt und können pro Anzeige überschrieben werden.',
  },
  access: {
    read: () => true,
    update: ({ req }) => Boolean(req.user),
  },
  fields: [
    {
      name: 'opening_hours',
      type: 'textarea',
      required: false,
      label: 'Öffnungszeiten',
      admin: {
        description: 'Wird in Anzeigen als Öffnungszeiten angezeigt (Freitext).',
      },
    },
    {
      name: 'description_template',
      type: 'textarea',
      required: false,
      label: 'Standard-Beschreibungsvorlage',
      admin: {
        description: 'Wird als Standardbeschreibung bei neuen Kleinanzeigen vorausgefüllt.',
      },
    },
    {
      name: 'contact',
      type: 'group',
      label: 'Standard-Kontaktdaten',
      fields: [
        {
          name: 'name',
          type: 'text',
          required: false,
          label: 'Name',
        },
        {
          name: 'street',
          type: 'text',
          required: false,
          label: 'Straße',
        },
        {
          name: 'zipcode',
          type: 'text',
          required: false,
          label: 'PLZ',
        },
        {
          name: 'location',
          type: 'text',
          required: false,
          label: 'Ort',
        },
        {
          name: 'phone',
          type: 'text',
          required: false,
          label: 'Telefon',
        },
      ],
    },
    {
      name: 'automation',
      type: 'group',
      label: 'Standard-Automatisierung',
      fields: [
        {
          name: 'republication_interval',
          type: 'number',
          required: false,
          label: 'Wiederveröffentlichungsintervall (Tage)',
          min: 1,
          admin: {
            description: 'Anzahl der Tage zwischen automatischen Wiederveröffentlichungen.',
            step: 1,
          },
        },
        {
          name: 'auto_price_reduction_enabled',
          type: 'checkbox',
          label: 'Automatische Preisreduzierung aktiviert',
          defaultValue: false,
        },
        {
          name: 'auto_price_reduction_strategy',
          type: 'select',
          required: false,
          label: 'Strategie',
          options: [
            { label: 'Prozentuell', value: 'PERCENTAGE' },
            { label: 'Fixer Betrag', value: 'FIXED' },
          ],
          admin: {
            condition: (_, siblingData) => siblingData?.auto_price_reduction_enabled === true,
          },
        },
        {
          name: 'auto_price_reduction_amount',
          type: 'number',
          required: false,
          label: 'Betrag',
          admin: {
            description: 'Für PERCENTAGE: Prozentwert (z.B. 10 = 10%). Für FIXED: Währungsbetrag.',
            step: 0.01,
            condition: (_, siblingData) => siblingData?.auto_price_reduction_enabled === true,
          },
        },
        {
          name: 'auto_price_reduction_min_price',
          type: 'number',
          required: false,
          label: 'Mindestpreis',
          min: 0,
          admin: {
            step: 0.01,
            condition: (_, siblingData) => siblingData?.auto_price_reduction_enabled === true,
          },
        },
        {
          name: 'auto_price_reduction_delay_reposts',
          type: 'number',
          required: false,
          label: 'Verzögerung (Wiederveröffentlichungen)',
          defaultValue: 0,
          min: 0,
          admin: {
            description: 'Anzahl Wiederveröffentlichungen vor erster Preisreduzierung.',
            step: 1,
            condition: (_, siblingData) => siblingData?.auto_price_reduction_enabled === true,
          },
        },
        {
          name: 'auto_price_reduction_delay_days',
          type: 'number',
          required: false,
          label: 'Verzögerung (Tage)',
          defaultValue: 0,
          min: 0,
          admin: {
            description: 'Tage nach Veröffentlichung vor erster Preisreduzierung.',
            step: 1,
            condition: (_, siblingData) => siblingData?.auto_price_reduction_enabled === true,
          },
        },
      ],
    },
    {
      name: 'shipping',
      type: 'group',
      label: 'Standard-Versand',
      fields: [
        {
          name: 'shipping_type',
          type: 'select',
          required: false,
          label: 'Standard-Versandtyp',
          options: [
            { label: 'Abholung', value: 'PICKUP' },
            { label: 'Versand', value: 'SHIPPING' },
            { label: 'Nicht zutreffend', value: 'NOT_APPLICABLE' },
          ],
        },
        {
          name: 'shipping_costs',
          type: 'number',
          required: false,
          label: 'Standard-Versandkosten',
          admin: {
            step: 0.01,
          },
        },
      ],
    },
  ],
}
