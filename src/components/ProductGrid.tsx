import { useMemo } from 'react'
import { Package } from 'lucide-react'
import type { Product } from '../types'
import { ProductCard } from './ProductCard'
import { useLanguage } from '../context/LanguageContext'

interface Props {
  products: Product[]
  searchQuery: string
  onAddToCart: (product: Product) => void
}

export function ProductGrid({ products, searchQuery, onAddToCart }: Props) {
  const { lang, t } = useLanguage()
  const filtered = useMemo(() => {
    const q = searchQuery.trim().toLowerCase()
    if (!q) return products
    return products.filter((p) => {
      const nameEn = p.name.toLowerCase()
      const nameHi = (p.nameHi ?? '').toLowerCase()
      const unit = p.unit.toLowerCase()
      return nameEn.includes(q) || nameHi.includes(q) || unit.includes(q)
    })
  }, [products, searchQuery])

  if (filtered.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4 text-neutral-500">
        <Package className="size-12 mb-3 opacity-50" />
        <p lang={lang === 'hi' ? 'hi' : undefined}>{t('no.match')}</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 min-[400px]:grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 p-4 bottom-bar-spacer">
      {filtered.map((product) => (
        <ProductCard key={product.id} product={product} onAdd={() => onAddToCart(product)} />
      ))}
    </div>
  )
}
