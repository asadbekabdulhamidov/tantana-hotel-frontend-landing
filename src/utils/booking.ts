import { z } from 'zod'
import { MAX_GUESTS } from '@/data/rooms'
import { nightsBetween, parseISODate, today } from './date'

export const MAX_NIGHTS = 30

export interface BookingParams {
  checkIn: string
  checkOut: string
  guests: number
}

/** Xatolik matnlari i18n kalitlari sifatida qaytadi */
export const searchSchema = z
  .object({
    checkIn: z.string().min(1, 'search.errors.checkInRequired'),
    checkOut: z.string().min(1, 'search.errors.checkOutRequired'),
    guests: z.number().int().min(1).max(MAX_GUESTS),
  })
  .superRefine((v, ctx) => {
    const ci = parseISODate(v.checkIn)
    const co = parseISODate(v.checkOut)
    if (v.checkIn && !ci) ctx.addIssue({ code: 'custom', path: ['checkIn'], message: 'search.errors.checkInRequired' })
    if (v.checkOut && !co) ctx.addIssue({ code: 'custom', path: ['checkOut'], message: 'search.errors.checkOutRequired' })
    if (ci && ci < today()) ctx.addIssue({ code: 'custom', path: ['checkIn'], message: 'search.errors.checkInPast' })
    if (ci && co && co <= ci) ctx.addIssue({ code: 'custom', path: ['checkOut'], message: 'search.errors.checkOutAfter' })
    if (ci && co && nightsBetween(v.checkIn, v.checkOut) > MAX_NIGHTS)
      ctx.addIssue({ code: 'custom', path: ['checkOut'], message: 'search.errors.maxStay' })
  })

export type SearchValues = z.infer<typeof searchSchema>

export function isValidBooking(p: Partial<BookingParams>): p is BookingParams {
  return searchSchema.safeParse({ checkIn: p.checkIn ?? '', checkOut: p.checkOut ?? '', guests: p.guests ?? 0 }).success
}

const STORAGE_KEY = 'tantana.booking'

export function storeBooking(p: BookingParams) {
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(p))
  } catch {
    /* ignore */
  }
}

export function readStoredBooking(): Partial<BookingParams> {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as Partial<BookingParams>) : {}
  } catch {
    return {}
  }
}

export function bookingQuery(p: Partial<BookingParams> & { room?: string }) {
  const q = new URLSearchParams()
  if (p.checkIn) q.set('checkIn', p.checkIn)
  if (p.checkOut) q.set('checkOut', p.checkOut)
  if (p.guests) q.set('guests', String(p.guests))
  if (p.room) q.set('room', p.room)
  const s = q.toString()
  return s ? `?${s}` : ''
}

/* ---- Demo bron so'rovi (backend ulanmaguncha faqat brauzer sessiyasida) ---- */
export const REQUEST_KEY = 'tantana.lastRequest'

export interface DemoRequest {
  reference: string
  createdAt: string
  room: string
  checkIn: string
  checkOut: string
  guests: number
  guest: {
    fullName: string
    phone: string
    email: string
    arrival: string
    requests?: string
  }
}

export function readDemoRequest(): DemoRequest | null {
  try {
    const raw = sessionStorage.getItem(REQUEST_KEY)
    return raw ? (JSON.parse(raw) as DemoRequest) : null
  } catch {
    return null
  }
}
