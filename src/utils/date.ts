import { LOCALE_TAGS, type Lang } from '@/i18n/config'

/** Mahalliy vaqt bo'yicha YYYY-MM-DD (UTC siljishisiz) */
export function toISODate(d: Date) {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

export function parseISODate(value: string | null | undefined): Date | null {
  if (!value || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return null
  const [y, m, d] = value.split('-').map(Number)
  const date = new Date(y, m - 1, d)
  return date.getFullYear() === y && date.getMonth() === m - 1 && date.getDate() === d ? date : null
}

export function addDays(date: Date, days: number) {
  const d = new Date(date)
  d.setDate(d.getDate() + days)
  return d
}

export function today() {
  const d = new Date()
  d.setHours(0, 0, 0, 0)
  return d
}

export function nightsBetween(checkIn: string, checkOut: string) {
  const a = parseISODate(checkIn)
  const b = parseISODate(checkOut)
  if (!a || !b) return 0
  return Math.round((b.getTime() - a.getTime()) / 86_400_000)
}

export function formatDate(value: string, lang: Lang, opts: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'short', year: 'numeric' }) {
  const d = parseISODate(value)
  if (!d) return ''
  try {
    return new Intl.DateTimeFormat(LOCALE_TAGS[lang], opts).format(d)
  } catch {
    return value
  }
}

export function formatPrice(amount: number, lang: Lang, currency = 'USD') {
  try {
    return new Intl.NumberFormat(LOCALE_TAGS[lang], { style: 'currency', currency, maximumFractionDigits: 0 }).format(amount)
  } catch {
    return `$${amount}`
  }
}
