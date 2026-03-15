import { useState } from 'react'
import { X, Minus, Plus } from 'lucide-react'
import type { CartItem } from '../types'
import { CheckoutForm } from './CheckoutForm'
import { useLanguage } from '../context/LanguageContext'

interface Props {
  isOpen: boolean
  onClose: () => void
  cart: CartItem[]
  subtotal: number
  onUpdateQuantity: (productId: string, delta: number) => void
  onOrderPlaced: () => void
}

type View = 'cart' | 'checkout'

export function CartDrawer({
  isOpen,
  onClose,
  cart,
  subtotal,
  onUpdateQuantity,
  onOrderPlaced,
}: Props) {
  const { lang, t } = useLanguage()
  const [view, setView] = useState<View>('cart')

  if (!isOpen) return null

  const showCheckout = view === 'checkout'

  const itemDisplayName = (item: CartItem) =>
    lang === 'hi' && item.nameHi ? item.nameHi : item.name

  return (
    <>
      <div
        className="fixed inset-0 bg-black/50 z-40"
        onClick={() => {
          onClose()
          setView('cart')
        }}
        aria-hidden
      />
      <div
        className="fixed bottom-0 left-0 right-0 z-50 bg-white rounded-t-2xl shadow-2xl max-h-[90dvh] flex flex-col pb-[env(safe-area-inset-bottom)]"
        role="dialog"
        aria-label={showCheckout ? t('checkout.place.order') : t('your.cart')}
      >
        <div className="flex items-center justify-between px-4 py-3 border-b border-neutral-200">
          <h2 className="font-bold text-neutral-900">
            {showCheckout ? t('place.order') : t('your.cart')}
          </h2>
          {!showCheckout && (
            <button
              type="button"
              onClick={onClose}
              className="min-h-[48px] min-w-[48px] flex items-center justify-center rounded-full hover:bg-neutral-100 active:opacity-80 touch-manipulation"
              aria-label="Close"
            >
              <X className="size-5" />
            </button>
          )}
          {showCheckout && (
            <button
              type="button"
              onClick={() => setView('cart')}
              className="min-h-[48px] px-3 text-sm text-[#16a34a] font-medium active:opacity-80 touch-manipulation"
            >
              {t('back')}
            </button>
          )}
        </div>

        {showCheckout ? (
          <CheckoutForm
            cart={cart}
            subtotal={subtotal}
            onClose={() => {
              onClose()
              setView('cart')
            }}
            onOrderPlaced={onOrderPlaced}
          />
        ) : (
          <>
            <div className="flex-1 overflow-y-auto p-4">
              {cart.length === 0 ? (
                <p className="text-neutral-500 text-center py-8" lang={lang === 'hi' ? 'hi' : undefined}>
                  {t('cart.empty')}
                </p>
              ) : (
                <ul className="space-y-3">
                  {cart.map((item) => (
                    <li
                      key={item.productId}
                      className="flex items-center gap-3 p-3 rounded-lg bg-neutral-50"
                    >
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-neutral-900 truncate" lang={lang === 'hi' ? 'hi' : undefined}>
                          {itemDisplayName(item)}
                        </p>
                        <p className="text-sm text-neutral-500">
                          {item.unit} × ₹{item.price}
                        </p>
                      </div>
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => onUpdateQuantity(item.productId, -1)}
                          className="min-h-[48px] min-w-[48px] rounded-full border border-neutral-200 flex items-center justify-center hover:bg-neutral-100 active:scale-95 active:opacity-90 touch-manipulation"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="size-4" />
                        </button>
                        <span className="w-8 text-center font-medium">{item.quantity}</span>
                        <button
                          type="button"
                          onClick={() => onUpdateQuantity(item.productId, 1)}
                          className="min-h-[48px] min-w-[48px] rounded-full border border-neutral-200 flex items-center justify-center hover:bg-neutral-100 active:scale-95 active:opacity-90 touch-manipulation"
                          aria-label="Increase quantity"
                        >
                          <Plus className="size-4" />
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
            {cart.length > 0 && (
              <div className="p-4 border-t border-neutral-200">
                <div className="flex justify-between font-bold text-lg mb-3">
                  <span>{t('checkout.subtotal')}</span>
                  <span>₹{subtotal}</span>
                </div>
                <button
                  type="button"
                  onClick={() => setView('checkout')}
                  className="w-full min-h-[48px] py-3 rounded-xl bg-[#16a34a] text-white font-semibold hover:bg-[#15803d] active:scale-[0.98] active:opacity-90 transition touch-manipulation"
                >
                  {t('place.order')}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </>
  )
}
