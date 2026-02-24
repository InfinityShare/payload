export type SortFilterItem = {
  reverse: boolean
  slug: null | string
  title: string
}

export const defaultSort: SortFilterItem = {
  slug: null,
  reverse: false,
  title: 'Alphabetic A-Z',
}

export const sorting: SortFilterItem[] = [
  defaultSort,
  { slug: '-createdAt', reverse: true, title: 'Latest arrivals' },
  { slug: 'priceInUSD', reverse: false, title: 'Price: Low to high' }, // asc
  { slug: '-priceInUSD', reverse: true, title: 'Price: High to low' },
]

/** Currencies for shop display; must match Shop Settings options. */
export type ShopCurrency = {
  code: string
  decimals: number
  label: string
  symbol: string
}

export const SHOP_CURRENCIES: ShopCurrency[] = [
  { code: 'EUR', decimals: 2, label: 'Euro', symbol: '€' },
  { code: 'USD', decimals: 2, label: 'US Dollar', symbol: '$' },
  { code: 'CHF', decimals: 2, label: 'Swiss Franc', symbol: 'Fr.' },
  { code: 'GBP', decimals: 2, label: 'British Pound', symbol: '£' },
]

export function getShopCurrencyByCode(code: string): ShopCurrency {
  return SHOP_CURRENCIES.find((c) => c.code === code) ?? SHOP_CURRENCIES[0]
}
