import { Plus } from 'lucide-react'
import type { Product } from '../types'
import { useLanguage } from '../context/LanguageContext'

interface Props {
  product: Product
  onAdd: () => void
}

export function ProductCard({ product, onAdd }: Props) {
  const { lang, t } = useLanguage()
  const displayName = lang === 'hi' && product.nameHi ? product.nameHi : product.name
  return (
    <article className="bg-white rounded-xl border border-neutral-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col max-[400px]:flex-row max-[400px]:gap-3 max-[400px]:p-3">
      <div className="aspect-square w-full bg-neutral-100 relative overflow-hidden max-[400px]:w-24 max-[400px]:shrink-0 max-[400px]:rounded-lg flex-none">
        <img
          src={encodeURI(product.imageUrl)}
          alt={displayName}
          className="w-full h-full min-w-0 min-h-0 object-cover object-center"
          style={{ aspectRatio: '1 / 1' }}
          loading="lazy"
        />
      </div>
      <div className="p-3 flex flex-col gap-2 flex-1 min-w-0 max-[400px]:p-0 max-[400px]:justify-center">
        <h3 className="font-semibold text-neutral-900 truncate text-base" lang={lang === 'hi' ? 'hi' : undefined}>
          {displayName}
        </h3>
        <p className="text-neutral-500 text-sm">{product.unit}</p>
        <div className="flex items-center justify-between mt-1 gap-2">
          <span className="font-bold text-[#16a34a]">₹{product.sellingPrice}</span>
          {product.inStock !== false ? (
            <button
              type="button"
              onClick={onAdd}
              className="min-h-[48px] min-w-[48px] flex items-center justify-center rounded-full bg-[#16a34a] text-white hover:bg-[#15803d] active:scale-95 active:opacity-90 transition touch-manipulation"
              aria-label={`${t('add.to.cart')} - ${displayName}`}
            >
              <Plus className="size-5" />
            </button>
          ) : (
            <span className="text-neutral-400 text-sm font-medium min-h-[48px] flex items-center">{t('out.of.stock')}</span>
          )}
        </div>
      </div>
    </article>
  )
}
