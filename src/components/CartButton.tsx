import { ShoppingBag } from 'lucide-react'
import type { CartItem } from '../types'
import { useLanguage } from '../context/LanguageContext'

interface Props {
  cart: CartItem[]
  total: number
  onClick: () => void
}

export function CartButton({ cart, total, onClick }: Props) {
  const { t } = useLanguage()
  const count = cart.reduce((s, i) => s + i.quantity, 0)
  return (
    <button
      type="button"
      onClick={onClick}
      className="fixed bottom-6 left-4 right-4 z-30 flex items-center justify-between gap-3 px-5 py-3.5 rounded-xl bg-[#16a34a] text-white shadow-lg hover:bg-[#15803d] active:scale-[0.98] transition max-w-md mx-auto"
      aria-label={`${t('cart')}: ${count} items, ₹${total}`}
    >
      <span className="flex items-center gap-2">
        <ShoppingBag className="size-5" />
        <span className="font-semibold">{t('cart')}</span>
        {count > 0 && (
          <span className="bg-white/25 rounded-full px-2 py-0.5 text-sm">{count}</span>
        )}
      </span>
      <span className="font-bold">₹{total}</span>
    </button>
  )
}
