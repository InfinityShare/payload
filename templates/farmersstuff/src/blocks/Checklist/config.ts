import type { Block } from 'payload'

export const ChecklistBlock: Block = {
  slug: 'checklist',
  interfaceName: 'ChecklistBlock',
  labels: {
    plural: 'Checklisten',
    singular: 'Checkliste',
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
      label: 'Überschrift (optional)',
    },
    {
      name: 'items',
      type: 'array',
      label: 'Einträge',
      minRows: 1,
      fields: [
        {
          name: 'text',
          type: 'text',
          label: 'Text',
          required: true,
        },
      ],
    },
  ],
}
