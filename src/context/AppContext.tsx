import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import type { CartItem, Product } from '../types'
import {
  loadAnnouncement,
  loadCart,
  loadProducts,
  saveAnnouncement,
  saveCart,
  saveProducts,
} from '../data'

interface AppState {
  products: Product[]
  cart: CartItem[]
  announcement: string
  setProducts: (p: Product[] | ((prev: Product[]) => Product[])) => void
  setAnnouncement: (s: string) => void
  addToCart: (product: Product, quantity?: number) => void
  updateCartQuantity: (productId: string, delta: number) => void
  removeFromCart: (productId: string) => void
  clearCart: () => void
}

const AppContext = createContext<AppState | null>(null)

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [products, setProductsState] = useState<Product[]>([])
  const [cart, setCart] = useState<CartItem[]>([])
  const [announcement, setAnnouncementState] = useState('')

  useEffect(() => {
    setProductsState(loadProducts())
    setCart(loadCart())
    setAnnouncementState(loadAnnouncement())
  }, [])

  useEffect(() => {
    if (products.length) saveProducts(products)
  }, [products])

  useEffect(() => {
    saveCart(cart)
  }, [cart])

  const setProducts = useCallback((p: Product[] | ((prev: Product[]) => Product[])) => {
    setProductsState((prev) => {
      const next = typeof p === 'function' ? p(prev) : p
      return next
    })
  }, [])

  const setAnnouncement = useCallback((s: string) => {
    setAnnouncementState(s)
    saveAnnouncement(s)
  }, [])

  const addToCart = useCallback((product: Product, quantity = 1) => {
    setCart((prev) => {
      const i = prev.findIndex((x) => x.productId === product.id)
      if (i >= 0) {
        const next = [...prev]
        next[i] = { ...next[i], quantity: next[i].quantity + quantity }
        return next
      }
      return [
        ...prev,
        {
          productId: product.id,
          name: product.name,
          nameHi: product.nameHi ?? product.name,
          unit: product.unit,
          price: product.sellingPrice,
          quantity,
        },
      ]
    })
  }, [])

  const updateCartQuantity = useCallback((productId: string, delta: number) => {
    setCart((prev) => {
      const i = prev.findIndex((x) => x.productId === productId)
      if (i < 0) return prev
      const next = [...prev]
      const q = next[i].quantity + delta
      if (q <= 0) return next.filter((_, idx) => idx !== i)
      next[i] = { ...next[i], quantity: q }
      return next
    })
  }, [])

  const removeFromCart = useCallback((productId: string) => {
    setCart((prev) => prev.filter((x) => x.productId !== productId))
  }, [])

  const clearCart = useCallback(() => setCart([]), [])

  const value = useMemo(
    () => ({
      products,
      cart,
      announcement,
      setProducts,
      setAnnouncement,
      addToCart,
      updateCartQuantity,
      removeFromCart,
      clearCart,
    }),
    [
      products,
      cart,
      announcement,
      setProducts,
      setAnnouncement,
      addToCart,
      updateCartQuantity,
      removeFromCart,
      clearCart,
    ]
  )

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used within AppProvider')
  return ctx
}
