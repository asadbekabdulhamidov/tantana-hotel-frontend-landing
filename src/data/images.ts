import { HOTEL_PHOTOS } from './hotelPhotos.gen'

/**
 * Rasm manbalari.
 *
 * 1) Mehmonxona suratlari — `src/images/` dagi asl fayllar. Yangi surat qo'shish:
 *    faylni `src/images/` ga tashlang, `src/data/hotelPhotos.json` ga kalit qo'shing
 *    va `npm run images` ni ishga tushiring.
 * 2) Farg'ona bo'limi — vaqtinchalik illyustrativ Unsplash rasmlari.
 * `src: ''` — surat hali yo'q, chiroyli placeholder ko'rsatiladi.
 * `alt` matnlari tarjima fayllarida: `images.<kalit>`.
 */
export interface ImageSource {
  /** Mahalliy surat kaliti (public/images/hotel/<local>-<w>.avif|webp) */
  local?: string
  /** Mahalliy suratning mavjud kengliklari */
  widths?: readonly number[]
  /** Unsplash ID yoki to'liq URL; '' — surat yo'q */
  src?: string
  ratio: number
  position?: string
}

type HotelPhotoKey = keyof typeof HOTEL_PHOTOS

const hotel = Object.fromEntries(
  Object.entries(HOTEL_PHOTOS).map(([key, m]) => [key, { local: key, widths: m.widths, ratio: m.ratio, position: 'position' in m ? m.position : undefined }]),
) as unknown as Record<HotelPhotoKey, ImageSource>

const external = {
  // Discover Fergana — illyustrativ rasmlar; '' = haqiqiy surat hali yo'q
  mountains: { src: 'photo-1464822759023-fed622ff2c3b', ratio: 1.33 },
  rishtan: { src: 'photo-1565193566173-7a0ee3dbe261', ratio: 1.33 },
  margilan: { src: 'photo-1528459801416-a9e53bbf4e17', ratio: 1.33 },
  kokand: { src: '', ratio: 1.33 },
  ferganaPark: { src: '', ratio: 1.33 },
  bazaar: { src: '', ratio: 1.33 },
  museum: { src: '', ratio: 1.33 },
} satisfies Record<string, ImageSource>

export const IMAGES: Record<HotelPhotoKey | keyof typeof external, ImageSource> = { ...hotel, ...external }

export type ImageKey = keyof typeof IMAGES

const UNSPLASH_WIDTHS = [480, 768, 1080, 1440, 1920]

export function localUrl(key: string, width: number, ext: 'avif' | 'webp') {
  return `/images/hotel/${key}-${width}.${ext}`
}

export function localSrcSet(img: ImageSource, ext: 'avif' | 'webp') {
  return (img.widths ?? []).map((w) => `${localUrl(img.local!, w, ext)} ${w}w`).join(', ')
}

export function imageUrl(src: string, width: number, quality = 70) {
  if (src.startsWith('/') || src.startsWith('http')) return src
  return `https://images.unsplash.com/${src}?auto=format&fit=crop&w=${width}&q=${quality}`
}

export function imageSrcSet(src: string) {
  if (src.startsWith('/') || src.startsWith('http')) return undefined
  return UNSPLASH_WIDTHS.map((w) => `${imageUrl(src, w)} ${w}w`).join(', ')
}

/** OG / JSON-LD uchun mutlaq yoki nisbiy URL */
export function ogImagePath(img: ImageSource) {
  if (img.local) return localUrl(img.local, img.widths?.[img.widths.length - 1] ?? 1024, 'webp')
  return img.src ? imageUrl(img.src, 1200) : ''
}
