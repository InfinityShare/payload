import type { Block } from 'payload'

export const YoutubeBlock: Block = {
  slug: 'youtube',
  interfaceName: 'YoutubeBlock',
  labels: {
    plural: 'YouTube Videos',
    singular: 'YouTube Video',
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
      name: 'url',
      type: 'text',
      label: 'YouTube URL',
      required: true,
      admin: {
        description: 'z.B. https://www.youtube.com/watch?v=... oder https://youtu.be/...',
      },
    },
    {
      name: 'title',
      type: 'text',
      label: 'Titel (optional)',
    },
  ],
}
