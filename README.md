# KhetSe

A premium **Farm-to-Fork** raw vegetable delivery PWA for Mohanlalganj and Gaura. Mobile-first, no-login checkout, WhatsApp orders.

## Tech Stack

- React 19 + TypeScript
- Vite 8
- Tailwind CSS 3
- Lucide React icons
- React Router

## Setup

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

## Configure WhatsApp

Edit **`src/components/CheckoutForm.tsx`** and set your WhatsApp number:

```ts
const WHATSAPP_NUMBER = '919876543210'  // Replace with your number (no + or spaces)
```

## Admin

- **URL:** `/admin`
- **Default key:** `khetse2025`

Use the admin panel to update purchase prices (selling price auto-calculates at 30% margin, rounded to ₹5), and to edit the top announcement banner.

## Build & Deploy

```bash
npm run build
```

Output is in `dist/`. Serve with any static host. For PWA “Add to Home Screen”, serve over HTTPS.

## Payment QR

Place your UPI/PhonePe QR image as **`public/payment_qr.jpeg`** so it appears in the checkout payment section.

## Bilingual (Hindi/English)

Use the **हिन्दी | EN** toggle at the top right to switch all UI and product names. Customer details and WhatsApp order/help messages use the selected language.

## Mobile & PWA

- **Viewport:** Fixed so inputs don’t cause awkward zoom (`maximum-scale=1`, `user-scalable=0`).
- **Sticky bottom bar:** Shows item count, total price, and a large “View Cart” button.
- **Grid:** 1 column on very small screens (&lt;400px), 2 columns on mobile, 3–4 on larger screens. Product cards use a list layout on 1-column.
- **Touch:** Buttons use at least 48px height and active (tap) feedback.
- **Add to Home Screen:** `manifest.json` is set up for standalone display. For the best “Add to Home Screen” prompt on all phones, add `icon-192.png` and `icon-512.png` to `public/` and extend the `icons` array in `public/manifest.json` with those PNGs (see [web.dev](https://web.dev/add-manifest/#icons)).
