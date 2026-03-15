/**
 * KhetSe product database.
 * Each product has id, nameEn, nameHi, image, unit, and basePrice.
 * Admin can override basePrice (Mandi price); selling price = 30% margin + round to nearest ₹5.
 */
import type { Product } from '../types'
import { sellingPriceFromPurchase } from '../types'

export interface ProductDefinition {
  id: string
  nameEn: string
  nameHi: string
  image: string
  unit: string
  basePrice: number
}

/** Product list: local images from public/images. Potatoes kept as is (user's image). */
export const PRODUCT_DEFINITIONS: ProductDefinition[] = [
  { id: '1', nameEn: 'Potatoes', nameHi: 'आलू', image: '/images/POTATOS.png', unit: '1 kg', basePrice: 28 },
  { id: '2', nameEn: 'Onions', nameHi: 'प्याज', image: '/images/Onions.jpeg', unit: '1 kg', basePrice: 30 },
  { id: '3', nameEn: 'Ginger', nameHi: 'अदरक', image: '/images/ginger.png', unit: '100g', basePrice: 40 },
  { id: '4', nameEn: 'Green Chillies', nameHi: 'हरी मिर्च', image: '/images/Green Chilies.png', unit: '100g', basePrice: 12 },
  { id: '5', nameEn: 'Coriander', nameHi: 'धनिया', image: '/images/Coriender LeaVES.png', unit: '100g (Bundle)', basePrice: 20 },
  { id: '6', nameEn: 'Ladies Finger', nameHi: 'भिंडी', image: '/images/ladies finger.jpg', unit: '500g', basePrice: 40 },
  { id: '7', nameEn: 'Beans', nameHi: 'फलियां', image: '/images/beans.jpeg', unit: '500g', basePrice: 40 },
  { id: '8', nameEn: 'Cabbage', nameHi: 'पत्तागोभी', image: '/images/cabbage.jpg', unit: '500g', basePrice: 20 },
  { id: '9', nameEn: 'Cucumber', nameHi: 'खीरा', image: '/images/fresh-cucumbers.jpg', unit: '500g', basePrice: 25 },
  { id: '10', nameEn: 'Radish', nameHi: 'मूली', image: '/images/Radish.jpg', unit: '500g', basePrice: 25 },
  { id: '11', nameEn: 'Tomatoes', nameHi: 'टमाटर', image: '/images/Tomatos.jpg', unit: '1 kg', basePrice: 35 },
  { id: '12', nameEn: 'Green Capsicum', nameHi: 'हरी शिमला मिर्च', image: '/images/Capsicum.jpg', unit: '500g', basePrice: 60 },
  { id: '13', nameEn: 'Garlic', nameHi: 'लहसुन', image: '/images/Garlic.jpg', unit: '250g', basePrice: 45 },
  { id: '14', nameEn: 'Bottle Gourd', nameHi: 'लौकी', image: '/images/Bottleguard.jpg', unit: '1 kg', basePrice: 30 },
  { id: '15', nameEn: 'Pumpkin', nameHi: 'कद्दू', image: '/images/Pumpkin.jpg', unit: '1 kg', basePrice: 25 },
]

export function getDefaultMandiPrice(id: string): number {
  const def = PRODUCT_DEFINITIONS.find((d) => d.id === id)
  return def?.basePrice ?? 30
}

export function buildProduct(def: ProductDefinition, purchasePrice: number, inStock: boolean, marginPercent: number = 30): Product {
  return {
    id: def.id,
    name: def.nameEn,
    nameHi: def.nameHi,
    imageUrl: def.image,
    unit: def.unit,
    purchasePrice,
    sellingPrice: sellingPriceFromPurchase(purchasePrice, marginPercent),
    inStock,
  }
}
