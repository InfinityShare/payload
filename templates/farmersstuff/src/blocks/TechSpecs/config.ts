import type { Block } from 'payload'

export const TechSpecsBlock: Block = {
  slug: 'techSpecs',
  interfaceName: 'TechSpecsBlock',
  labels: {
    plural: 'Technische Daten',
    singular: 'Technische Daten',
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
      name: 'title',
      type: 'text',
      label: 'Überschrift',
      defaultValue: 'Technische Daten',
    },
  ],
}
