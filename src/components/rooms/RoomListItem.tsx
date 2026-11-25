import { Link } from 'react-router'
import { useTranslation } from 'react-i18next'
import type { Room } from '@/data/rooms'
import { useLocalizedPath } from '@/hooks/useLang'
import { ButtonLink } from '@/components/ui/Button'
import { Img } from '@/components/ui/Img'
import { Reveal } from '@/components/ui/Reveal'
import { cn } from '@/utils/cn'
import { AMENITY_ICONS } from './amenityIcons'
import { RoomFacts } from './RoomFacts'
import { RoomPrice } from './RoomPrice'

/** Xonalar ro'yxati uchun editorial qator — rasm va matn navbatma-navbat */
export function RoomListItem({ room, index, query }: { room: Room; index: number; query: string }) {
  const { t } = useTranslation()
  const lp = useLocalizedPath()
  const reversed = index % 2 === 1
  const shown = room.amenities.slice(0, 5)
  const more = room.amenities.length - shown.length
  const detailsHref = lp(`/rooms/${room.slug}`) + query
  const bookingQ = new URLSearchParams(query.replace(/^\?/, ''))
  bookingQ.set('room', room.slug)

  return (
    <Reveal as="article" className="grid items-center gap-6 md:grid-cols-12 md:gap-10" aria-labelledby={`room-${room.slug}`}>
      <Link to={detailsHref} tabIndex={-1} aria-hidden className={cn('group block overflow-hidden rounded-[var(--radius-card)] md:col-span-7', reversed && 'md:order-2')}>
        <Img
          image={room.images[0]}
          alt={t(`rooms.items.${room.slug}.alt`)}
          sizes="(min-width: 1024px) 680px, (min-width: 768px) 58vw, 100vw"
          className="aspect-[4/3] rounded-[var(--radius-card)]"
          imgClassName="transition-transform duration-[1.2s] ease-[var(--ease-out-soft)] group-hover:scale-[1.04]"
        />
      </Link>
      <div className={cn('md:col-span-5', reversed && 'md:order-1')}>
        <p className="eyebrow">{t(`rooms.filters.types.${room.type}`)}</p>
        <h2 id={`room-${room.slug}`} className="mt-3 text-[1.75rem] font-semibold leading-tight sm:text-[2rem]">
          <Link to={detailsHref} className="transition-colors hover:text-ink-soft">
            {t(`rooms.items.${room.slug}.name`)}
          </Link>
        </h2>
        <p className="mt-3 text-[0.9375rem] leading-relaxed text-muted">{t(`rooms.items.${room.slug}.short`)}</p>
        <RoomFacts room={room} className="mt-5" />
        <ul className="mt-5 flex flex-wrap gap-2" aria-label={t('room.amenities')}>
          {shown.map((a) => {
            const Icon = AMENITY_ICONS[a]
            return (
              <li key={a} className="inline-flex items-center gap-1.5 rounded-full bg-surface px-3 py-1.5 text-xs font-medium text-ink-soft">
                <Icon className="size-3.5" aria-hidden strokeWidth={1.75} />
                {t(`rooms.amenities.${a}`)}
              </li>
            )
          })}
          {more > 0 && <li className="inline-flex items-center rounded-full bg-surface px-3 py-1.5 text-xs font-medium text-muted">+{more}</li>}
        </ul>
        <div className="mt-7 flex flex-wrap items-end justify-between gap-5 border-t border-line pt-6">
          <RoomPrice room={room} />
          <div className="flex flex-wrap gap-2">
            <ButtonLink to={detailsHref} variant="secondary" size="md">
              {t('rooms.card.details')}
            </ButtonLink>
            <ButtonLink to={`${lp('/booking')}?${bookingQ.toString()}`} size="md" arrow>
              {t('rooms.card.book')}
            </ButtonLink>
          </div>
        </div>
      </div>
    </Reveal>
  )
}
