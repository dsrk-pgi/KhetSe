import { ShoppingBag } from 'lucide-react'
import type { CartItem } from '../types'
import { useLanguage } from '../context/LanguageContext'

interface Props {
  cart: CartItem[]
  total: number
  onClick: () => void
}

export function StickyBottomBar({ cart, total, onClick }: Props) {
  const { t } = useLanguage()
  const count = cart.reduce((s, i) => s + i.quantity, 0)

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-30 bg-white border-t border-neutral-200 shadow-[0_-4px_20px_rgba(0,0,0,0.08)] safe-area-pb"
      role="region"
      aria-label={t('cart')}
    >
      <div className="flex items-stretch gap-3 px-4 py-3 max-w-lg mx-auto">
        <div className="flex-1 flex flex-col justify-center min-w-0">
          <p className="text-neutral-600 text-sm tabular-nums">
            {count} {count === 1 ? t('item') : t('items')}
          </p>
          <p className="font-bold text-lg text-neutral-900">₹{total}</p>
        </div>
        <button
          type="button"
          onClick={onClick}
          className="min-h-[48px] flex-shrink-0 flex items-center justify-center gap-2 px-6 rounded-xl bg-[#16a34a] text-white font-semibold shadow-md active:scale-[0.98] active:bg-[#15803d] transition-transform touch-manipulation select-none"
          aria-label={`${t('view.cart')} — ${count} items, ₹${total}`}
        >
          <ShoppingBag className="size-5" aria-hidden />
          <span>{t('view.cart')}</span>
        </button>
      </div>
    </div>
  )
}
