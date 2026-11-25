import { useEffect, useMemo } from 'react'
import { useSearchParams } from 'react-router'
import { MAX_GUESTS } from '@/data/rooms'
import { isValidBooking, readStoredBooking, storeBooking, type BookingParams } from '@/utils/booking'

/**
 * URL'dagi bron parametrlari (checkIn, checkOut, guests).
 * URL bo'sh bo'lsa — sessiyada saqlangan oxirgi qidiruv ishlatiladi,
 * shunda sahifalar orasida yurganda sanalar yo'qolmaydi.
 */
export function useBookingParams() {
  const [params] = useSearchParams()

  const value = useMemo(() => {
    const fromUrl: Partial<BookingParams> = {
      checkIn: params.get('checkIn') ?? undefined,
      checkOut: params.get('checkOut') ?? undefined,
      guests: params.get('guests') ? Number(params.get('guests')) : undefined,
    }
    const hasUrl = !!(fromUrl.checkIn || fromUrl.checkOut || fromUrl.guests)
    const source = hasUrl ? fromUrl : readStoredBooking()
    const guests = Math.min(Math.max(Number(source.guests) || 0, 0), MAX_GUESTS)
    const merged = { checkIn: source.checkIn ?? '', checkOut: source.checkOut ?? '', guests }
    return { ...merged, valid: isValidBooking(merged), fromUrl: hasUrl }
  }, [params])

  useEffect(() => {
    if (value.valid && value.fromUrl) storeBooking({ checkIn: value.checkIn, checkOut: value.checkOut, guests: value.guests })
  }, [value])

  return value
}
