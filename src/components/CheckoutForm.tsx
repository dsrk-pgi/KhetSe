import { useState, useEffect } from 'react'
import { Loader2 } from 'lucide-react'
import type { CartItem, ZoneId } from '../types'
import {
  loadCustomerMobile,
  loadCustomerAddress,
  saveCustomerMobile,
  saveCustomerAddress,
  loadWhatsAppNumber,
  getDeliveryFeeFromSettings,
  getZonesWithFees,
  loadDeliverySettings,
} from '../data'
import { useLanguage } from '../context/LanguageContext'
import type { Lang } from '../i18n/translations'
import { WHATSAPP_ORDER_GREETING, zoneNameHi } from '../i18n/translations'


export type PaymentMethod = 'cod' | 'upi'

function buildWhatsAppMessage(
  lang: Lang,
  items: CartItem[],
  subtotal: number,
  deliveryFee: number,
  zoneName: string,
  mobile: string,
  address: string,
  paymentMethod: PaymentMethod
): string {
  const total = subtotal + deliveryFee
  const greeting = WHATSAPP_ORDER_GREETING[lang]
  const itemName = (i: CartItem) => (lang === 'hi' && i.nameHi ? i.nameHi : i.name)
  const paymentLine = paymentMethod === 'cod' ? 'Payment: COD' : 'Payment: UPI'
  const paymentLineHi = paymentMethod === 'cod' ? 'भुगतान: COD' : 'भुगतान: UPI'
  const lines =
    lang === 'hi'
      ? [
          greeting,
          '',
          '📦 नया ऑर्डर - KHETSE',
          '',
          'आइटम:',
          ...items.map((i) => `• ${itemName(i)} (${i.unit}) x${i.quantity} = ₹${i.price * i.quantity}`),
          '',
          `उप-योग: ₹${subtotal}`,
          `डिलीवरी शुल्क: ₹${deliveryFee} (ज़ोन: ${zoneName})`,
          `कुल देय: ₹${total}`,
          '',
          paymentLineHi,
          `ग्राहक मोबाइल: ${mobile}`,
          `पता: ${address}`,
        ]
      : [
          greeting,
          '',
          '📦 NEW ORDER - KHETSE',
          '',
          'Items:',
          ...items.map((i) => `• ${itemName(i)} (${i.unit}) x${i.quantity} = ₹${i.price * i.quantity}`),
          '',
          `Subtotal: ₹${subtotal}`,
          `Delivery Fee: ₹${deliveryFee} (Zone: ${zoneName})`,
          `Total Payable: ₹${total}`,
          '',
          paymentLine,
          `Customer Mobile: ${mobile}`,
          `Address: ${address}`,
        ]
  return lines.join('\n')
}

interface Props {
  cart: CartItem[]
  subtotal: number
  onClose: () => void
  onOrderPlaced: () => void
}

export function CheckoutForm({ cart, subtotal, onClose, onOrderPlaced }: Props) {
  const { lang, t } = useLanguage()
  const [mobile, setMobile] = useState('')
  const [address, setAddress] = useState('')
  const [zoneId, setZoneId] = useState<ZoneId>('local')
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod | null>(null)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    setMobile(loadCustomerMobile())
    setAddress(loadCustomerAddress())
  }, [])

  const zones = getZonesWithFees()
  const deliveryFee = getDeliveryFeeFromSettings(zoneId, subtotal)
  const total = subtotal + deliveryFee
  const zone = zones.find((z) => z.id === zoneId)
  const zoneDisplayName = lang === 'hi' ? (zoneNameHi[zoneId] ?? zone?.name) : (zone?.name ?? zoneId)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!paymentMethod) return
    const m = mobile.trim()
    if (!m || m.length < 10) {
      alert(t('alert.invalid.mobile'))
      return
    }
    if (!address.trim()) {
      alert(t('alert.enter.address'))
      return
    }
    setSubmitting(true)
    saveCustomerMobile(m)
    saveCustomerAddress(address)
    const text = buildWhatsAppMessage(
      lang,
      cart,
      subtotal,
      deliveryFee,
      zoneDisplayName,
      m,
      address.trim(),
      paymentMethod
    )
    const url = `https://wa.me/${loadWhatsAppNumber()}?text=${encodeURIComponent(text)}`
    window.open(url, '_blank', 'noopener')
    onOrderPlaced()
    setSubmitting(false)
    onClose()
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <h2 className="text-lg font-bold text-neutral-900">{t('checkout.place.order')}</h2>

        <div>
          <label htmlFor="checkout-mobile" className="block text-sm font-medium text-neutral-700 mb-1">
            {t('checkout.mobile')} <span className="text-red-500">*</span>
          </label>
          <input
            id="checkout-mobile"
            type="tel"
            inputMode="numeric"
            maxLength={10}
            placeholder={t('checkout.mobile.placeholder')}
            value={mobile}
            onChange={(e) => setMobile(e.target.value.replace(/\D/g, ''))}
            className="w-full min-h-[48px] px-4 py-2.5 rounded-lg border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-[#16a34a]/30 focus:border-[#16a34a]"
            required
          />
        </div>

        <div>
          <label htmlFor="checkout-address" className="block text-sm font-medium text-neutral-700 mb-1">
            {t('checkout.address')} <span className="text-red-500">*</span>
          </label>
          <textarea
            id="checkout-address"
            rows={3}
            placeholder={t('checkout.address.placeholder')}
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="w-full min-h-[48px] px-4 py-2.5 rounded-lg border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-[#16a34a]/30 focus:border-[#16a34a] resize-none"
            required
          />
        </div>

        <div>
          <label htmlFor="checkout-zone" className="block text-sm font-medium text-neutral-700 mb-1">
            {t('checkout.zone')}
          </label>
          <select
            id="checkout-zone"
            value={zoneId}
            onChange={(e) => setZoneId(e.target.value as ZoneId)}
            className="w-full min-h-[48px] px-4 py-2.5 rounded-lg border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-[#16a34a]/30 focus:border-[#16a34a] bg-white"
          >
            {zones.map((z) => (
              <option key={z.id} value={z.id}>
                {lang === 'hi' ? (zoneNameHi[z.id] ?? z.name) : z.name} — ₹
                {z.id === 'local' ? (getDeliveryFeeFromSettings('local', subtotal) === 0 ? '0' : z.fee) : z.fee}
              </option>
            ))}
          </select>
          {zoneId === 'local' && subtotal >= loadDeliverySettings().freeDeliveryAbove && (
            <p className="text-xs text-[#16a34a] mt-1" lang={lang === 'hi' ? 'hi' : undefined}>
              {t('checkout.free.delivery')}
            </p>
          )}
        </div>

        {/* Payment Method: COD or UPI */}
        <div className="rounded-xl border-2 border-neutral-200 bg-white shadow-md p-4 space-y-3">
          <h3 className="font-semibold text-neutral-900 text-sm">
            {t('checkout.payment.method.select')}
          </h3>
          <div className="space-y-2" role="radiogroup" aria-label={t('checkout.payment.method.select')}>
            <label className="flex items-center gap-3 min-h-[48px] px-3 rounded-lg border-2 border-neutral-200 cursor-pointer touch-manipulation has-[:checked]:border-[#16a34a] has-[:checked]:bg-[#16a34a]/5">
              <input
                type="radio"
                name="payment-method"
                value="cod"
                checked={paymentMethod === 'cod'}
                onChange={() => setPaymentMethod('cod')}
                className="size-5 text-[#16a34a] border-neutral-300 focus:ring-[#16a34a]"
              />
              <span className="font-medium text-neutral-900">{t('checkout.payment.cod')}</span>
            </label>
            <label className="flex items-center gap-3 min-h-[48px] px-3 rounded-lg border-2 border-neutral-200 cursor-pointer touch-manipulation has-[:checked]:border-[#16a34a] has-[:checked]:bg-[#16a34a]/5">
              <input
                type="radio"
                name="payment-method"
                value="upi"
                checked={paymentMethod === 'upi'}
                onChange={() => setPaymentMethod('upi')}
                className="size-5 text-[#16a34a] border-neutral-300 focus:ring-[#16a34a]"
              />
              <span className="font-medium text-neutral-900">{t('checkout.payment.upi')}</span>
            </label>
          </div>

          {/* Show QR only when Online Payment (UPI) is selected */}
          {paymentMethod === 'upi' && (
            <>
              <p className="text-neutral-600 text-sm pt-1">{t('checkout.scan.pay')}</p>
              <div className="flex justify-center">
                <div className="rounded-lg border-4 border-white bg-white shadow-md p-2.5 max-w-[200px] aspect-square ring-2 ring-neutral-100">
                  <img
                    src="/payment_qr.jpeg"
                    alt="UPI QR Code"
                    className="w-full h-full object-contain rounded bg-white"
                  />
                </div>
              </div>
              <p className="text-center font-semibold text-neutral-800">PRIYANKA KUMARI</p>
              <p className="text-xs text-neutral-600 text-center" lang={lang === 'hi' ? 'hi' : undefined}>
                {t('checkout.payment.note')}
              </p>
            </>
          )}
        </div>

        <div className="bg-neutral-50 rounded-lg p-3 text-sm">
          <div className="flex justify-between text-neutral-600">
            <span>{t('checkout.subtotal')}</span>
            <span>₹{subtotal}</span>
          </div>
          <div className="flex justify-between text-neutral-600 mt-1">
            <span>{t('checkout.delivery')} ({zoneDisplayName})</span>
            <span>₹{deliveryFee}</span>
          </div>
          <div className="flex justify-between font-bold text-neutral-900 mt-2 pt-2 border-t border-neutral-200">
            <span>{t('checkout.total')}</span>
            <span>₹{total}</span>
          </div>
        </div>
      </div>

      <div className="p-4 border-t border-neutral-200 flex gap-3">
        <button
          type="button"
          onClick={onClose}
          className="flex-1 min-h-[48px] py-2.5 rounded-lg border border-neutral-200 text-neutral-700 font-medium active:scale-[0.98] active:opacity-90 touch-manipulation"
        >
          {t('back')}
        </button>
        <button
          type="submit"
          disabled={submitting || !paymentMethod}
          className="flex-1 min-h-[48px] py-2.5 rounded-lg bg-[#16a34a] text-white font-semibold hover:bg-[#15803d] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 active:scale-[0.98] active:opacity-90 touch-manipulation"
        >
          {submitting ? <Loader2 className="size-5 animate-spin" /> : null}
          {t('checkout.confirm')}
        </button>
      </div>
    </form>
  )
}
