export interface Product {
  id: string
  name: string
  nameHi?: string
  unit: string
  imageUrl: string
  purchasePrice: number
  sellingPrice: number
  inStock?: boolean
}

export interface CartItem {
  productId: string
  name: string
  nameHi?: string
  unit: string
  price: number
  quantity: number
}

export type ZoneId = 'local' | 'outskirts' | 'extended'

export interface Zone {
  id: ZoneId
  name: string
  fee: number
  description?: string
}

export const ZONES: Zone[] = [
  { id: 'local', name: 'Local (Mohanlalganj/Gaura)', fee: 15, description: 'Free delivery on orders above ₹150' },
  { id: 'outskirts', name: 'Lucknow Outskirts (5-8km)', fee: 30 },
  { id: 'extended', name: 'Extended (8km+)', fee: 50 },
]

export function getDeliveryFee(zoneId: ZoneId, subtotal: number): number {
  if (zoneId === 'local') return subtotal >= 150 ? 0 : 15
  const zone = ZONES.find((z) => z.id === zoneId)
  return zone?.fee ?? 0
}

export function roundToNearest5(price: number): number {
  return Math.round(price / 5) * 5
}

export function sellingPriceFromPurchase(purchasePrice: number, marginPercent: number = 30): number {
  return roundToNearest5(purchasePrice * (1 + marginPercent / 100))
}
