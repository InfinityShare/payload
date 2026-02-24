import type { GlobalConfig } from 'payload'

export const ImageSettings: GlobalConfig = {
  slug: 'image-settings',
  label: 'Image Settings',
  admin: {
    group: 'Settings',
    description: 'Configure global image processing filters for consistent product image styling.',
  },
  access: {
    read: () => true,
    update: ({ req }) => Boolean(req.user),
  },
  fields: [
    {
      name: 'enabled',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        description: 'Enable automatic image processing for all uploaded images.',
      },
      label: 'Enable Image Processing',
    },
    {
      name: 'filters',
      type: 'group',
      admin: {
        condition: (data) => data?.enabled === true,
        description:
          'Adjust these settings to create a consistent visual style for all product images.',
      },
      fields: [
        {
          name: 'brightness',
          type: 'number',
          defaultValue: 100,
          min: 0,
          max: 200,
          admin: {
            description: 'Image brightness percentage (100 = original).',
            step: 1,
          },
          label: 'Brightness (%)',
        },
        {
          name: 'contrast',
          type: 'number',
          defaultValue: 100,
          min: 0,
          max: 200,
          admin: {
            description: 'Image contrast percentage (100 = original).',
            step: 1,
          },
          label: 'Contrast (%)',
        },
        {
          name: 'saturation',
          type: 'number',
          defaultValue: 100,
          min: 0,
          max: 200,
          admin: {
            description: 'Color saturation percentage (100 = original).',
            step: 1,
          },
          label: 'Saturation (%)',
        },
        {
          name: 'tint',
          type: 'group',
          admin: {
            description: 'Apply a color tint to warm up or cool down images.',
          },
          fields: [
            {
              name: 'enabled',
              type: 'checkbox',
              defaultValue: false,
              label: 'Enable Color Tint',
            },
            {
              name: 'color',
              type: 'text',
              defaultValue: '#FFAA44',
              admin: {
                condition: (_, siblingData) => siblingData?.enabled === true,
                description:
                  'Hex color code for the tint (e.g., #FFAA44 for warm, #4488FF for cool).',
              },
              label: 'Tint Color',
            },
            {
              name: 'intensity',
              type: 'number',
              defaultValue: 10,
              min: 0,
              max: 100,
              admin: {
                condition: (_, siblingData) => siblingData?.enabled === true,
                description: 'Tint intensity percentage.',
                step: 1,
              },
              label: 'Tint Intensity (%)',
            },
          ],
          label: 'Color Tint',
        },
        {
          name: 'sharpen',
          type: 'group',
          admin: {
            description: 'Apply sharpening to enhance image clarity.',
          },
          fields: [
            {
              name: 'enabled',
              type: 'checkbox',
              defaultValue: false,
              label: 'Enable Sharpening',
            },
            {
              name: 'sigma',
              type: 'number',
              defaultValue: 1.0,
              min: 0.1,
              max: 10,
              admin: {
                condition: (_, siblingData) => siblingData?.enabled === true,
                description: 'Sharpening intensity (higher = sharper).',
                step: 0.1,
              },
              label: 'Sharpen Sigma',
            },
          ],
          label: 'Sharpening',
        },
        {
          name: 'vignette',
          type: 'group',
          admin: {
            description: 'Add a subtle dark vignette to focus attention on the center.',
          },
          fields: [
            {
              name: 'enabled',
              type: 'checkbox',
              defaultValue: false,
              label: 'Enable Vignette',
            },
            {
              name: 'intensity',
              type: 'number',
              defaultValue: 20,
              min: 0,
              max: 100,
              admin: {
                condition: (_, siblingData) => siblingData?.enabled === true,
                description: 'Vignette intensity percentage.',
                step: 1,
              },
              label: 'Vignette Intensity (%)',
            },
          ],
          label: 'Vignette',
        },
      ],
      label: 'Image Filters',
    },
    {
      name: 'defaultApplyFilter',
      type: 'checkbox',
      defaultValue: true,
      admin: {
        description:
          'Default state for "Apply Filter" checkbox when users upload images. Can be disabled per-upload.',
      },
      label: 'Default Apply Filter for Uploads',
    },
  ],
}
