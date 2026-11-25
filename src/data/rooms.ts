import type { ImageKey } from './images'

/**
 * Xona toifalari.
 * ✅ Suratlar — mehmonxonaning haqiqiy suratlari.
 * ✅ "Budget Twin" va "Deluxe Double" toifalari bron platformalarida e'lon qilingan.
 * ⚠️ Standart va uch kishilik toifalar suratlarga qarab ajratilgan; maydon (m²) va
 *    narxlar NAMUNA — mehmonxona tasdiqlaguncha UI'da "Namunaviy" deb ko'rsatiladi
 *    va ular uchun Offer structured data yaratilmaydi.
 * Matnlar: `rooms.items.<slug>` tarjimalarida.
 */
export type RoomType = 'standard' | 'deluxe' | 'twin' | 'triple'

export type BedType = 'double' | 'twin' | 'doublePlusSingle'

export type AmenityKey =
  | 'wifi'
  | 'ac'
  | 'heating'
  | 'tv'
  | 'desk'
  | 'wardrobe'
  | 'hairdryer'
  | 'toiletries'
  | 'roomService'
  | 'nonSmoking'

export interface Room {
  slug: string
  type: RoomType
  capacity: number
  bed: BedType
  /** m² — namuna */
  size: number
  /** USD / kecha — namuna */
  price: number
  amenities: AmenityKey[]
  images: ImageKey[]
  /** true — maydon va narx hali tasdiqlanmagan */
  placeholder: boolean
}

const BASE: AmenityKey[] = ['wifi', 'ac', 'heating', 'tv', 'desk', 'wardrobe', 'hairdryer', 'toiletries', 'nonSmoking']

export const ROOMS: Room[] = [
  {
    slug: 'standard-double',
    type: 'standard',
    capacity: 2,
    bed: 'double',
    size: 22,
    price: 45,
    amenities: BASE,
    images: ['roomDouble', 'roomDouble2', 'roomDouble3', 'bathroom'],
    placeholder: true,
  },
  {
    slug: 'deluxe-double',
    type: 'deluxe',
    capacity: 2,
    bed: 'double',
    size: 26,
    price: 60,
    amenities: [...BASE, 'roomService'],
    images: ['roomDeluxe', 'roomDeluxe2', 'roomDouble3', 'bathroom2'],
    placeholder: true,
  },
  {
    slug: 'budget-twin',
    type: 'twin',
    capacity: 2,
    bed: 'twin',
    size: 22,
    price: 40,
    amenities: BASE,
    images: ['roomTwin', 'roomTwin2', 'bathroom', 'corridor'],
    placeholder: true,
  },
  {
    slug: 'triple',
    type: 'triple',
    capacity: 3,
    bed: 'doublePlusSingle',
    size: 30,
    price: 70,
    amenities: [...BASE, 'roomService'],
    images: ['roomTriple', 'roomTriple2', 'bathroom2', 'bathroom'],
    placeholder: true,
  },
]

export const ROOM_TYPES: RoomType[] = ['standard', 'deluxe', 'twin', 'triple']
export const ALL_AMENITIES: AmenityKey[] = ['wifi', 'ac', 'heating', 'tv', 'desk', 'wardrobe', 'hairdryer', 'toiletries', 'roomService', 'nonSmoking']
export const PRICE_MIN = Math.min(...ROOMS.map((r) => r.price))
export const PRICE_MAX = Math.max(...ROOMS.map((r) => r.price))
export const MAX_GUESTS = 6
export const CURRENCY = 'USD'

export function getRoom(slug: string | undefined) {
  return ROOMS.find((r) => r.slug === slug)
}
