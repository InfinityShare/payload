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

export const QuickSpecsBlock: Block = {
  slug: 'quickSpecs',
  interfaceName: 'QuickSpecsBlock',
  labels: {
    plural: 'Quick Specs',
    singular: 'Quick Specs',
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
      name: 'specs',
      type: 'array',
      label: 'Specs',
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
          name: 'label',
          type: 'text',
          label: 'Bezeichnung',
          required: true,
        },
      ],
    },
  ],
}
