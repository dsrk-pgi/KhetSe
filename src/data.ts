import type { Product, CartItem, ZoneId } from './types'
import { PRODUCT_DEFINITIONS, getDefaultMandiPrice, buildProduct } from './data/products'

export interface DeliverySettings {
  localFee: number
  outskirtsFee: number
  extendedFee: number
  freeDeliveryAbove: number
}

const DEFAULT_DELIVERY: DeliverySettings = {
  localFee: 15,
  outskirtsFee: 30,
  extendedFee: 50,
  freeDeliveryAbove: 150,
}

const STORAGE_KEYS = {
  PRODUCTS: 'khetse_products',
  ANNOUNCEMENT: 'khetse_announcement',
  CART: 'khetse_cart',
  CUSTOMER_MOBILE: 'khetse_customer_mobile',
  CUSTOMER_ADDRESS: 'khetse_customer_address',
  WHATSAPP_NUMBER: 'khetse_whatsapp_number',
  DELIVERY_SETTINGS: 'khetse_delivery_settings',
  MARGIN: 'khetse_margin',
} as const

const DEFAULT_MARGIN_PERCENT = 30

export function loadMargin(): number {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.MARGIN)
    if (raw !== null) {
      const n = Number(raw)
      if (!Number.isNaN(n) && n >= 0) return n
    }
  } catch (_) {}
  return DEFAULT_MARGIN_PERCENT
}

export function saveMargin(marginPercent: number): void {
  localStorage.setItem(STORAGE_KEYS.MARGIN, String(marginPercent))
}

const DEFAULT_WHATSAPP = '9140189586'

export function loadProducts(): Product[] {
  const margin = loadMargin()
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.PRODUCTS)
    const parsed = raw ? (JSON.parse(raw) as Record<string, { purchasePrice: number; inStock?: boolean }>) : {}
    return PRODUCT_DEFINITIONS.map((def) => {
      const stored = parsed[def.id]
      const purchasePrice = stored?.purchasePrice ?? getDefaultMandiPrice(def.id)
      const inStock = stored?.inStock !== false
      return buildProduct(def, purchasePrice, inStock, margin)
    })
  } catch (_) {}
  return PRODUCT_DEFINITIONS.map((def) =>
    buildProduct(def, getDefaultMandiPrice(def.id), true, margin)
  )
}

export function saveProducts(products: Product[]): void {
  const map: Record<string, { purchasePrice: number; inStock: boolean }> = {}
  products.forEach((p) => {
    map[p.id] = { purchasePrice: p.purchasePrice, inStock: p.inStock !== false }
  })
  localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(map))
}

export function loadAnnouncement(): string {
  return localStorage.getItem(STORAGE_KEYS.ANNOUNCEMENT) ?? '🌱 Fresh from local farms — Mohanlalganj & Gaura. Order now!'
}

export function saveAnnouncement(text: string): void {
  localStorage.setItem(STORAGE_KEYS.ANNOUNCEMENT, text)
}

export function loadWhatsAppNumber(): string {
  return localStorage.getItem(STORAGE_KEYS.WHATSAPP_NUMBER) ?? DEFAULT_WHATSAPP
}

export function saveWhatsAppNumber(num: string): void {
  localStorage.setItem(STORAGE_KEYS.WHATSAPP_NUMBER, num.trim())
}

export function loadDeliverySettings(): DeliverySettings {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.DELIVERY_SETTINGS)
    if (raw) {
      const parsed = JSON.parse(raw) as Partial<DeliverySettings>
      return {
        localFee: Number(parsed.localFee) || DEFAULT_DELIVERY.localFee,
        outskirtsFee: Number(parsed.outskirtsFee) || DEFAULT_DELIVERY.outskirtsFee,
        extendedFee: Number(parsed.extendedFee) || DEFAULT_DELIVERY.extendedFee,
        freeDeliveryAbove: Number(parsed.freeDeliveryAbove) || DEFAULT_DELIVERY.freeDeliveryAbove,
      }
    }
  } catch (_) {}
  return { ...DEFAULT_DELIVERY }
}

export function saveDeliverySettings(settings: DeliverySettings): void {
  localStorage.setItem(STORAGE_KEYS.DELIVERY_SETTINGS, JSON.stringify(settings))
}

export function getDeliveryFeeFromSettings(zoneId: ZoneId, subtotal: number): number {
  const s = loadDeliverySettings()
  if (zoneId === 'local') return subtotal >= s.freeDeliveryAbove ? 0 : s.localFee
  if (zoneId === 'outskirts') return s.outskirtsFee
  if (zoneId === 'extended') return s.extendedFee
  return 0
}

export function getZonesWithFees(): { id: ZoneId; name: string; fee: number }[] {
  const s = loadDeliverySettings()
  return [
    { id: 'local', name: 'Zone 1 (Within 3km)', fee: s.localFee },
    { id: 'outskirts', name: 'Zone 2 (3km - 7km)', fee: s.outskirtsFee },
    { id: 'extended', name: 'Zone 3 (7km+)', fee: s.extendedFee },
  ]
}

export function loadCart(): CartItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.CART)
    if (raw) return JSON.parse(raw)
  } catch (_) {}
  return []
}

export function saveCart(items: CartItem[]): void {
  localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(items))
}

export function loadCustomerMobile(): string {
  return localStorage.getItem(STORAGE_KEYS.CUSTOMER_MOBILE) ?? ''
}

export function saveCustomerMobile(mobile: string): void {
  localStorage.setItem(STORAGE_KEYS.CUSTOMER_MOBILE, mobile)
}

export function loadCustomerAddress(): string {
  return localStorage.getItem(STORAGE_KEYS.CUSTOMER_ADDRESS) ?? ''
}

export function saveCustomerAddress(address: string): void {
  localStorage.setItem(STORAGE_KEYS.CUSTOMER_ADDRESS, address)
}

export const ADMIN_KEY = 'khetse_admin_key'
export const DEFAULT_ADMIN_KEY = 'RK516821rk'
