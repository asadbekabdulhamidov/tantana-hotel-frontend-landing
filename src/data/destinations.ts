import type { ImageKey } from './images'

/**
 * Farg'ona vodiysidagi diqqatga sazovor joylar.
 * Masofa, ish vaqti va yo'l vaqti ATAYLAB ko'rsatilmagan — tasdiqlangan
 * ma'lumot paydo bo'lganda qo'shing. Matnlar: `discover.items.<key>`.
 */
export interface Destination {
  key: 'ferganaPark' | 'museum' | 'margilan' | 'kumtepa' | 'rishtan' | 'kokand' | 'shohimardon'
  image: ImageKey
  /** Google Maps qidiruv so'rovi */
  mapsQuery: string
}

export const DESTINATIONS: Destination[] = [
  { key: 'shohimardon', image: 'mountains', mapsQuery: 'Shohimardon, Uzbekistan' },
  { key: 'rishtan', image: 'rishtan', mapsQuery: 'Rishtan ceramics, Rishtan, Uzbekistan' },
  { key: 'margilan', image: 'margilan', mapsQuery: 'Yodgorlik Silk Factory, Margilan' },
  { key: 'kokand', image: 'kokand', mapsQuery: 'Khudoyar Khan Palace, Kokand' },
  { key: 'ferganaPark', image: 'ferganaPark', mapsQuery: 'Al-Fergani Park, Fergana' },
  { key: 'kumtepa', image: 'bazaar', mapsQuery: 'Kumtepa Bazaar, Margilan' },
  { key: 'museum', image: 'museum', mapsQuery: 'Fergana Regional Museum of Local Lore' },
]

export function destinationMapsLink(query: string) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`
}
