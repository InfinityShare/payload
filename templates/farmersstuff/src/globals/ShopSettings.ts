import type { GlobalConfig } from 'payload'

export const ShopSettings: GlobalConfig = {
  slug: 'shop-settings',
  label: 'Shop Settings',
  admin: {
    group: 'Settings',
    description:
      'Currency and tax rate for the shop. Used to compute net/gross prices on products.',
  },
  access: {
    read: () => true,
    update: ({ req }) => Boolean(req.user),
  },
  fields: [
    {
      name: 'currency',
      type: 'select',
      required: true,
      defaultValue: 'EUR',
      options: [
        { label: 'EUR', value: 'EUR' },
        { label: 'USD', value: 'USD' },
        { label: 'CHF', value: 'CHF' },
        { label: 'GBP', value: 'GBP' },
      ],
      admin: {
        description: 'Shop display and checkout currency.',
      },
    },
    {
      name: 'taxRate',
      type: 'number',
      required: true,
      defaultValue: 19,
      min: 0,
      max: 100,
      admin: {
        description:
          'Default tax rate in percent (e.g. 19 for 19%). Used to calculate net from gross and vice versa on products.',
        step: 0.01,
      },
    },
  ],
}
