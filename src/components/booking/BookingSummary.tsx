import { useTranslation } from 'react-i18next'
import { CalendarDays, Moon, Users } from 'lucide-react'
import { CURRENCY, type Room } from '@/data/rooms'
import { useLang } from '@/hooks/useLang'
import { formatDate, formatPrice, nightsBetween } from '@/utils/date'
import type { BookingParams } from '@/utils/booking'
import { Img } from '@/components/ui/Img'
import { cn } from '@/utils/cn'

export function BookingSummary({ room, params, className }: { room?: Room; params: Partial<BookingParams>; className?: string }) {
  const { t } = useTranslation()
  const lang = useLang()
  const nights = params.checkIn && params.checkOut ? nightsBetween(params.checkIn, params.checkOut) : 0
  const fmt = (d?: string) => (d ? formatDate(d, lang, { weekday: 'short', day: 'numeric', month: 'long', year: 'numeric' }) : '—')

  return (
    <aside aria-labelledby="summary-title" className={cn('rounded-[var(--radius-card)] border border-line bg-white p-5 sm:p-6', className)}>
      <h2 id="summary-title" className="text-lg font-semibold">
        {t('booking.summary.title')}
      </h2>

      {room ? (
        <div className="mt-5 flex gap-4">
          <Img image={room.images[0]} alt={t(`rooms.items.${room.slug}.alt`)} sizes="112px" className="aspect-square w-24 shrink-0 rounded-xl" />
          <div className="min-w-0">
            <p className="text-xs text-muted">{t(`rooms.filters.types.${room.type}`)}</p>
            <p className="mt-0.5 font-semibold leading-snug">{t(`rooms.items.${room.slug}.name`)}</p>
            <p className="mt-1 text-xs text-muted">{t(`rooms.beds.${room.bed}`)}</p>
          </div>
        </div>
      ) : (
        <p className="mt-5 rounded-xl bg-surface p-4 text-sm text-muted">{t('booking.summary.noRoom')}</p>
      )}

      <dl className="mt-6 grid gap-3.5 border-t border-line pt-5 text-sm">
        <Row icon={CalendarDays} label={t('booking.summary.checkIn')} value={fmt(params.checkIn)} />
        <Row icon={CalendarDays} label={t('booking.summary.checkOut')} value={fmt(params.checkOut)} />
        <Row icon={Moon} label={t('booking.summary.nights')} value={nights ? t('search.nights', { count: nights }) : '—'} />
        <Row icon={Users} label={t('booking.summary.guests')} value={params.guests ? t('search.guestCount', { count: params.guests }) : '—'} />
      </dl>

      {room && nights > 0 && (
        <div className="mt-6 border-t border-line pt-5">
          <div className="flex items-center justify-between text-sm text-muted">
            <span>
              {formatPrice(room.price, lang, CURRENCY)} × {t('search.nights', { count: nights })}
            </span>
            <span>{formatPrice(room.price * nights, lang, CURRENCY)}</span>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="font-semibold">{t('booking.summary.total')}</span>
            <span className="text-2xl font-semibold tracking-tight">{formatPrice(room.price * nights, lang, CURRENCY)}</span>
          </div>
          <p className="mt-2 text-xs leading-relaxed text-[#8a5300]">{t('booking.summary.sampleTotal')}</p>
        </div>
      )}
    </aside>
  )
}

function Row({ icon: Icon, label, value }: { icon: typeof Users; label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-4">
      <dt className="inline-flex items-center gap-2 text-muted">
        <Icon className="size-4" aria-hidden strokeWidth={1.6} />
        {label}
      </dt>
      <dd className="text-right font-medium text-ink">{value}</dd>
    </div>
  )
}
