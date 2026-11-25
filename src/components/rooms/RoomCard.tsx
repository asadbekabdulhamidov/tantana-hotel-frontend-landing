import { Link } from 'react-router'
import { useTranslation } from 'react-i18next'
import { ArrowUpRight, BedDouble, Users } from 'lucide-react'
import type { Room } from '@/data/rooms'
import { CURRENCY } from '@/data/rooms'
import { useLang, useLocalizedPath } from '@/hooks/useLang'
import { formatPrice } from '@/utils/date'
import { Img } from '@/components/ui/Img'
import { cn } from '@/utils/cn'

/**
 * Staymint uslubidagi karta: to'liq balandlikdagi rasm + pastda shisha panel.
 * Bosh sahifa karuseli va "o'xshash xonalar" uchun.
 */
export function RoomCard({ room, query = '', className, sizes = '(min-width: 1024px) 25vw, 80vw' }: { room: Room; query?: string; className?: string; sizes?: string }) {
  const { t } = useTranslation()
  const lang = useLang()
  const lp = useLocalizedPath()
  const name = t(`rooms.items.${room.slug}.name`)

  return (
    <article className={cn('group relative isolate aspect-[3/4] overflow-hidden rounded-[var(--radius-card)] bg-surface-2', className)}>
      <Img image={room.images[0]} alt={t(`rooms.items.${room.slug}.alt`)} fill sizes={sizes} imgClassName="transition-transform duration-[1.2s] ease-[var(--ease-out-soft)] group-hover:scale-[1.05]" />
      <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-black/45 via-black/0 to-black/0" />
      {room.placeholder && (
        <span className="glass-light absolute left-3 top-3 rounded-full px-2.5 py-1 text-[0.6875rem] font-semibold text-ink">{t('common.sample')}</span>
      )}
      <div className="glass-light absolute inset-x-3 bottom-3 rounded-2xl p-4">
        <h3 className="text-[1.0625rem] font-semibold leading-snug">
          <Link to={lp(`/rooms/${room.slug}`) + query} className="after:absolute after:inset-0 after:content-['']">
            {name}
          </Link>
        </h3>
        <p className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted">
          <span className="inline-flex items-center gap-1 rounded-full bg-white/70 px-2 py-0.5">
            <Users className="size-3.5" aria-hidden />
            {t('rooms.card.guests', { count: room.capacity })}
          </span>
          <span className="inline-flex items-center gap-1 rounded-full bg-white/70 px-2 py-0.5">
            <BedDouble className="size-3.5" aria-hidden />
            {t(`rooms.beds.${room.bed}`)}
          </span>
        </p>
        <div className="mt-3 flex items-end justify-between gap-2">
          <p className="flex items-baseline gap-1">
            <span className="text-lg font-semibold">{formatPrice(room.price, lang, CURRENCY)}</span>
            <span className="text-[0.6875rem] text-muted">{t('rooms.card.perNight')}</span>
          </p>
          <span aria-hidden className="grid size-9 place-items-center rounded-full bg-ink text-white transition-transform duration-300 group-hover:rotate-45">
            <ArrowUpRight className="size-4" />
          </span>
        </div>
      </div>
    </article>
  )
}
