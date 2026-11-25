/**
 * Mehmonxona haqidagi asosiy ma'lumotlar.
 *
 * ✅ Manzil va xonalar soni — ochiq bron platformalaridagi ma'lumotlardan olingan.
 * ⚠️ Check-in/check-out: manbalarda farq bor (14:00/12:00 va 12:30/12:30) — mehmonxona bilan tasdiqlang.
 * ⚠️ Telefon, email, domen — hali tasdiqlanmagan. Qiymat qo'yilganda sayt avtomatik ko'rsatadi.
 */
export const HOTEL = {
  name: 'Tantana Hotel',
  address: {
    street: "Al-Farg'oniy ko'chasi, 122A",
    city: "Farg'ona",
    region: "Farg'ona viloyati",
    postalCode: '150100',
    country: 'UZ',
  },
  /** Masalan: '+998731234567' */
  phone: null as string | null,
  /** Masalan: '+998 73 123 45 67' */
  phoneDisplay: null as string | null,
  email: null as string | null,
  checkIn: '14:00',
  checkOut: '12:00',
  roomCount: 64,
  mapsQuery: 'Tantana Hotel, Al-Ferganiy 122A, Fergana, Uzbekistan',
  social: {
    instagram: null as string | null,
    telegram: null as string | null,
  },
} as const

/**
 * Sayt domeni. Production'da `.env` faylida VITE_SITE_URL=https://sizning-domen.uz deb bering
 * (canonical, hreflang va Open Graph shu manzil bilan yoziladi).
 */
export const SITE_URL: string = (import.meta.env.VITE_SITE_URL as string | undefined)?.replace(/\/$/, '') || (typeof window !== 'undefined' ? window.location.origin : '')

export const PHONE_PLACEHOLDER = '+998 •• ••• •• ••'

export const mapsLink = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(HOTEL.mapsQuery)}`
export const mapsEmbed = `https://www.google.com/maps?q=${encodeURIComponent(HOTEL.mapsQuery)}&output=embed`
