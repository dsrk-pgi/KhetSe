import { useState } from 'react'
import { Link } from 'react-router-dom'
import { MessageCircle } from 'lucide-react'
import { useApp } from '../context/AppContext'
import { useLanguage } from '../context/LanguageContext'
import { Hero } from '../components/Hero'
import { ProductGrid } from '../components/ProductGrid'
import { StickyBottomBar } from '../components/StickyBottomBar'
import { CartDrawer } from '../components/CartDrawer'
import { LanguageToggle } from '../components/LanguageToggle'
import { WHATSAPP_HELP_MESSAGE } from '../i18n/translations'
import { loadWhatsAppNumber } from '../data'

export function Home() {
  const {
    products,
    cart,
    announcement,
    addToCart,
    updateCartQuantity,
    clearCart,
  } = useApp()
  const { lang, t } = useLanguage()
  const [searchQuery, setSearchQuery] = useState('')
  const [cartOpen, setCartOpen] = useState(false)

  const subtotal = cart.reduce((s, i) => s + i.price * i.quantity, 0)

  const openHelpWhatsApp = () => {
    const text = WHATSAPP_HELP_MESSAGE[lang]
    window.open(`https://wa.me/${loadWhatsAppNumber()}?text=${encodeURIComponent(text)}`, '_blank', 'noopener')
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      <LanguageToggle />
      <Hero
        announcement={announcement}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />
      <ProductGrid
        products={products}
        searchQuery={searchQuery}
        onAddToCart={(p) => addToCart(p)}
      />
      <button
        type="button"
        onClick={openHelpWhatsApp}
        className="fixed top-2 left-2 z-[100] min-h-[48px] flex items-center gap-2 px-4 rounded-full bg-white/95 shadow-md border border-neutral-200 text-neutral-700 hover:bg-neutral-50 text-sm font-medium active:scale-[0.98] active:opacity-90 transition touch-manipulation"
        aria-label={t('help')}
      >
        <MessageCircle className="size-4 shrink-0" />
        <span>{t('help')}</span>
      </button>
      <StickyBottomBar
        cart={cart}
        total={subtotal}
        onClick={() => setCartOpen(true)}
      />
      <CartDrawer
        isOpen={cartOpen}
        onClose={() => setCartOpen(false)}
        cart={cart}
        subtotal={subtotal}
        onUpdateQuantity={updateCartQuantity}
        onOrderPlaced={clearCart}
      />
      <footer className="py-4 text-center text-neutral-400 text-sm bottom-bar-spacer space-y-1">
        <p>{t('footer.about')}</p>
        <Link to="/admin" className="hover:text-neutral-600">{t('admin')}</Link>
      </footer>
    </div>
  )
}
