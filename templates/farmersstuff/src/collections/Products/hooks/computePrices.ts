import type { CollectionBeforeChangeHook } from 'payload'

const round2 = (n: number) => Math.round(n * 100) / 100

function toNumber(v: unknown): number | null {
  if (v == null) return null
  if (typeof v === 'number' && !Number.isNaN(v)) return v
  const n = Number(v)
  return Number.isNaN(n) ? null : n
}

/** priceInUSD = Bruttopreis (gross). Hook syncs net price and Bruttopreis from tax rate. */
export const computePricesHook: CollectionBeforeChangeHook = async ({ data, req }) => {
  const bruttoRaw = toNumber(data?.priceInUSD)
  const netRaw = toNumber(data?.netPrice)
  const brutto = bruttoRaw != null && bruttoRaw > 0 ? bruttoRaw : null
  const net = netRaw != null && netRaw > 0 ? netRaw : null

  const useShopTaxRate = data?.useShopTaxRate !== false
  const productTaxRate = toNumber(data?.taxRate)

  const shop = await req.payload.findGlobal({
    slug: 'shop-settings',
  })
  const shopTaxRate = typeof shop?.taxRate === 'number' ? shop.taxRate : 19
  const taxRate = useShopTaxRate ? (productTaxRate ?? shopTaxRate) : (productTaxRate ?? shopTaxRate)
  const factor = 1 + taxRate / 100

  if (brutto != null && net == null) {
    data.netPrice = round2(brutto / factor)
  } else if (net != null && brutto == null) {
    data.priceInUSD = round2(net * factor)
  }

  data.priceInUSDEnabled = true
  return data
}
