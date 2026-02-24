import type { Block } from 'payload'

const svgIcons = [
  { label: 'Motor / Engine', value: 'engine' },
  { label: 'Antrieb / Drivetrain', value: 'drivetrain' },
  { label: 'Antrieb 2', value: 'drivetrain-2' },
  { label: 'Getriebe / Mechanic', value: 'mechanic' },
  { label: 'Gewicht / Weight', value: 'weight' },
  { label: 'Ersatzteile / Spare Parts', value: 'spare-parts' },
  { label: 'Traktor', value: 'tractor' },
  { label: 'Werkzeug / Wrench', value: 'wrench' },
  { label: 'Engineering', value: 'engineering' },
  { label: 'Technischer Support', value: 'technical-support' },
  { label: 'Lieferung / Delivery', value: 'delivery' },
  { label: 'Telefon', value: 'telephone' },
  { label: 'Ersatzteil / Part', value: 'part' },
  { label: 'Reduziert / Reduced', value: 'reduced' },
  { label: 'Car Engine', value: 'car-engine' },
  { label: 'WhatsApp', value: 'whatsapp' },
  { label: 'Phone Call', value: 'phone-call' },
]

export const IconFeaturesBlock: Block = {
  slug: 'iconFeatures',
  interfaceName: 'IconFeaturesBlock',
  labels: {
    plural: 'Icon-Feature Blöcke',
    singular: 'Icon-Feature Block',
  },
  fields: [
    {
      name: 'fullWidth',
      type: 'checkbox',
      label: 'Fullwidth',
      defaultValue: false,
      admin: {
        description: 'Block über die gesamte Seitenbreite darstellen (kein Container).',
      },
    },
    {
      name: 'features',
      type: 'array',
      label: 'Features',
      minRows: 1,
      maxRows: 3,
      fields: [
        {
          name: 'icon',
          type: 'select',
          label: 'Icon',
          required: true,
          options: svgIcons,
        },
        {
          name: 'headline',
          type: 'text',
          label: 'Überschrift',
          required: true,
        },
        {
          name: 'text',
          type: 'text',
          label: 'Text (optional)',
        },
        {
          name: 'enableLink',
          type: 'checkbox',
          label: 'Link aktivieren',
          defaultValue: false,
        },
        {
          name: 'link',
          type: 'group',
          label: 'Link',
          admin: {
            condition: (_, siblingData) => Boolean(siblingData?.enableLink),
          },
          fields: [
            {
              name: 'label',
              type: 'text',
              label: 'Link-Text',
            },
            {
              name: 'url',
              type: 'text',
              label: 'URL',
            },
            {
              name: 'newTab',
              type: 'checkbox',
              label: 'In neuem Tab öffnen',
              defaultValue: false,
            },
          ],
        },
      ],
    },
  ],
}
