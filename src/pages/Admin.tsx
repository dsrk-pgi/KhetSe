import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Lock, Save, Megaphone, Settings, Phone, Truck } from 'lucide-react'
import type { Product } from '../types'
import { sellingPriceFromPurchase } from '../types'
import type { DeliverySettings } from '../data'
import {
  loadProducts,
  saveProducts,
  loadAnnouncement,
  saveAnnouncement,
  loadWhatsAppNumber,
  saveWhatsAppNumber,
  loadDeliverySettings,
  saveDeliverySettings,
  loadMargin,
  saveMargin,
  ADMIN_KEY,
  DEFAULT_ADMIN_KEY,
} from '../data'
import { useApp } from '../context/AppContext'
import { SuccessToast } from '../components/SuccessToast'

const STORAGE_ADMIN_UNLOCK = 'khetse_admin_unlocked'

export function Admin() {
  const navigate = useNavigate()
  const { setProducts: setGlobalProducts, setAnnouncement: setGlobalAnnouncement } = useApp()
  const [unlocked, setUnlocked] = useState(() => {
    try {
      return sessionStorage.getItem(STORAGE_ADMIN_UNLOCK) === '1'
    } catch {
      return false
    }
  })
  const [keyInput, setKeyInput] = useState('')
  const [error, setError] = useState('')
  const [products, setProducts] = useState<Product[]>([])
  const [announcement, setAnnouncement] = useState('')
  const [whatsappNumber, setWhatsappNumber] = useState('')
  const [deliverySettings, setDeliverySettings] = useState<DeliverySettings>({
    localFee: 15,
    outskirtsFee: 30,
    extendedFee: 50,
    freeDeliveryAbove: 150,
  })
  const [marginPercent, setMarginPercent] = useState(30)
  const [showToast, setShowToast] = useState(false)

  useEffect(() => {
    if (unlocked) {
      setProducts(loadProducts())
      setAnnouncement(loadAnnouncement())
      setWhatsappNumber(loadWhatsAppNumber())
      setDeliverySettings(loadDeliverySettings())
      setMarginPercent(loadMargin())
    }
  }, [unlocked])

  const handleUnlock = (e: React.FormEvent) => {
    e.preventDefault()
    const stored = localStorage.getItem(ADMIN_KEY) || DEFAULT_ADMIN_KEY
    if (keyInput.trim() === stored) {
      sessionStorage.setItem(STORAGE_ADMIN_UNLOCK, '1')
      setUnlocked(true)
      setError('')
    } else {
      setError('Invalid admin key.')
    }
  }

  const handleMandiPriceChange = (id: string, value: string) => {
    const num = parseInt(value, 10) || 0
    setProducts((prev) =>
      prev.map((p) =>
        p.id === id
          ? { ...p, purchasePrice: num, sellingPrice: sellingPriceFromPurchase(num, marginPercent) }
          : p
      )
    )
  }

  const handleMarginChange = (value: string) => {
    const n = parseInt(value, 10)
    const margin = Number.isNaN(n) || n < 0 ? 30 : n
    setMarginPercent(margin)
    setProducts((prev) =>
      prev.map((p) => ({ ...p, sellingPrice: sellingPriceFromPurchase(p.purchasePrice, margin) }))
    )
  }

  const handleStockToggle = (id: string) => {
    setProducts((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, inStock: !(p.inStock !== false) } : p
      )
    )
  }

  const handleSave = () => {
    saveProducts(products)
    saveAnnouncement(announcement)
    saveWhatsAppNumber(whatsappNumber)
    saveDeliverySettings(deliverySettings)
    saveMargin(marginPercent)
    setGlobalProducts(products)
    setGlobalAnnouncement(announcement)
    setShowToast(true)
    setTimeout(() => setShowToast(false), 2500)
  }

  if (!unlocked) {
    return (
      <div className="min-h-screen bg-neutral-100 flex items-center justify-center p-4 safe-area-pb">
        <div className="bg-white rounded-2xl shadow-lg p-6 w-full max-w-sm">
          <div className="flex items-center gap-2 text-neutral-700 mb-4">
            <Lock className="size-5" />
            <h1 className="font-bold text-lg">Admin</h1>
          </div>
          <p className="text-sm text-neutral-500 mb-4">Enter admin key to continue.</p>
          <form onSubmit={handleUnlock}>
            <input
              type="password"
              value={keyInput}
              onChange={(e) => setKeyInput(e.target.value)}
              placeholder="Admin key"
              className="w-full min-h-[48px] px-4 py-2.5 rounded-lg border border-neutral-200 mb-3 focus:outline-none focus:ring-2 focus:ring-[#16a34a]/30"
              autoFocus
            />
            {error && <p className="text-red-600 text-sm mb-2">{error}</p>}
            <button
              type="submit"
              className="w-full min-h-[48px] py-2.5 rounded-lg bg-[#16a34a] text-white font-semibold touch-manipulation"
            >
              Unlock
            </button>
          </form>
          <button
            type="button"
            onClick={() => navigate('/')}
            className="w-full mt-3 min-h-[48px] py-2 text-neutral-500 text-sm touch-manipulation"
          >
            Back to store
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-neutral-100 pb-8">
      <header className="sticky top-0 z-10 bg-white border-b border-neutral-200 px-4 py-3 flex items-center justify-between safe-area-pt">
        <h1 className="font-bold text-[#16a34a] text-lg">KhetSe Admin</h1>
        <button
          type="button"
          onClick={() => navigate('/')}
          className="min-h-[48px] px-3 text-sm text-neutral-600 hover:text-neutral-900 touch-manipulation"
        >
          Back to store
        </button>
      </header>

      <main className="p-4 max-w-4xl mx-auto space-y-6">
        {/* Announcement */}
        <section className="bg-white rounded-xl shadow-sm p-4">
          <h2 className="font-semibold text-neutral-900 flex items-center gap-2 mb-3">
            <Megaphone className="size-5 shrink-0" />
            Announcement Banner
          </h2>
          <p className="text-sm text-neutral-500 mb-2">Special discount or new arrival message on home screen.</p>
          <textarea
            value={announcement}
            onChange={(e) => setAnnouncement(e.target.value)}
            rows={2}
            placeholder="e.g. 🥬 New arrival: Fresh spinach! 10% off on orders above ₹200"
            className="w-full min-h-[48px] px-4 py-2.5 rounded-lg border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-[#16a34a]/30 resize-none"
          />
        </section>

        {/* Daily Price Update */}
        <section className="bg-white rounded-xl shadow-sm overflow-hidden">
          <h2 className="font-semibold text-neutral-900 p-4 pb-0">Daily Price Update</h2>
          <p className="text-sm text-neutral-500 px-4 mt-1 pb-2">
            Mandi Price → Selling price (30% margin, rounded to ₹5)
          </p>
          <div className="overflow-x-auto -mx-4 sm:mx-0">
            <table className="w-full text-left min-w-[320px]">
              <thead>
                <tr className="border-b border-neutral-200 bg-neutral-50">
                  <th className="p-3 font-medium text-neutral-700 text-sm">Item</th>
                  <th className="p-3 font-medium text-neutral-700 text-sm">Unit</th>
                  <th className="p-3 font-medium text-neutral-700 text-sm">Mandi (₹)</th>
                  <th className="p-3 font-medium text-neutral-700 text-sm">Selling (₹)</th>
                  <th className="p-3 font-medium text-neutral-700 text-sm">Stock</th>
                </tr>
              </thead>
              <tbody>
                {products.map((p) => (
                  <tr key={p.id} className="border-b border-neutral-100">
                    <td className="p-3 font-medium text-neutral-900 text-sm">{p.name}</td>
                    <td className="p-3 text-neutral-600 text-sm">{p.unit}</td>
                    <td className="p-3">
                      <input
                        type="number"
                        min={0}
                        step={1}
                        value={p.purchasePrice}
                        onChange={(e) => handleMandiPriceChange(p.id, e.target.value)}
                        className="w-16 sm:w-20 min-h-[44px] px-2 rounded border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-[#16a34a]/30 text-sm"
                      />
                    </td>
                    <td className="p-3 text-[#16a34a] font-semibold text-sm">₹{p.sellingPrice}</td>
                    <td className="p-3">
                      <button
                        type="button"
                        role="switch"
                        aria-checked={p.inStock !== false}
                        onClick={() => handleStockToggle(p.id)}
                        className={`min-h-[44px] px-3 rounded-lg text-xs font-medium touch-manipulation transition ${
                          p.inStock !== false
                            ? 'bg-[#16a34a] text-white'
                            : 'bg-neutral-200 text-neutral-600'
                        }`}
                      >
                        {p.inStock !== false ? 'In Stock' : 'Out'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Global Settings */}
        <section className="bg-white rounded-xl shadow-sm p-4">
          <h2 className="font-semibold text-neutral-900 flex items-center gap-2 mb-4">
            <Settings className="size-5 shrink-0" />
            Global Settings
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">
                Profit Margin (%)
              </label>
              <p className="text-xs text-neutral-500 mb-2">
                Selling price = Purchase price × (1 + Margin/100), rounded to ₹5.
              </p>
              <input
                type="number"
                min={0}
                max={100}
                step={1}
                value={marginPercent}
                onChange={(e) => handleMarginChange(e.target.value)}
                className="w-full min-h-[48px] px-4 py-2.5 rounded-lg border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-[#16a34a]/30"
              />
            </div>
          </div>
        </section>

        {/* Settings */}
        <section className="bg-white rounded-xl shadow-sm p-4">
          <h2 className="font-semibold text-neutral-900 flex items-center gap-2 mb-4">
            <Settings className="size-5 shrink-0" />
            Settings
          </h2>

          <div className="space-y-4">
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-neutral-700 mb-1">
                <Phone className="size-4" />
                WhatsApp Number
              </label>
              <input
                type="tel"
                value={whatsappNumber}
                onChange={(e) => setWhatsappNumber(e.target.value.replace(/\D/g, ''))}
                placeholder="e.g. 9140189586"
                className="w-full min-h-[48px] px-4 py-2.5 rounded-lg border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-[#16a34a]/30"
              />
            </div>

            <div>
              <h3 className="flex items-center gap-2 text-sm font-medium text-neutral-700 mb-2">
                <Truck className="size-4" />
                Delivery Fees (₹)
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-neutral-500 mb-1">Local (below threshold)</label>
                  <input
                    type="number"
                    min={0}
                    value={deliverySettings.localFee}
                    onChange={(e) =>
                      setDeliverySettings((s) => ({ ...s, localFee: Number(e.target.value) || 0 }))
                    }
                    className="w-full min-h-[44px] px-3 rounded-lg border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-[#16a34a]/30"
                  />
                </div>
                <div>
                  <label className="block text-xs text-neutral-500 mb-1">Free delivery above (₹)</label>
                  <input
                    type="number"
                    min={0}
                    value={deliverySettings.freeDeliveryAbove}
                    onChange={(e) =>
                      setDeliverySettings((s) => ({ ...s, freeDeliveryAbove: Number(e.target.value) || 0 }))
                    }
                    className="w-full min-h-[44px] px-3 rounded-lg border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-[#16a34a]/30"
                  />
                </div>
                <div>
                  <label className="block text-xs text-neutral-500 mb-1">Lucknow Outskirts (5–8km)</label>
                  <input
                    type="number"
                    min={0}
                    value={deliverySettings.outskirtsFee}
                    onChange={(e) =>
                      setDeliverySettings((s) => ({ ...s, outskirtsFee: Number(e.target.value) || 0 }))
                    }
                    className="w-full min-h-[44px] px-3 rounded-lg border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-[#16a34a]/30"
                  />
                </div>
                <div>
                  <label className="block text-xs text-neutral-500 mb-1">Extended (8km+)</label>
                  <input
                    type="number"
                    min={0}
                    value={deliverySettings.extendedFee}
                    onChange={(e) =>
                      setDeliverySettings((s) => ({ ...s, extendedFee: Number(e.target.value) || 0 }))
                    }
                    className="w-full min-h-[44px] px-3 rounded-lg border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-[#16a34a]/30"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        <button
          type="button"
          onClick={handleSave}
          className="w-full sm:w-auto min-h-[48px] flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[#16a34a] text-white font-semibold hover:bg-[#15803d] active:scale-[0.98] touch-manipulation"
        >
          <Save className="size-5" />
          Save Changes
        </button>
      </main>

      <SuccessToast show={showToast} message="Saved successfully!" />
    </div>
  )
}
