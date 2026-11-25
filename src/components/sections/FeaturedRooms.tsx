import { useTranslation } from 'react-i18next'
import { ROOMS } from '@/data/rooms'
import { useLocalizedPath } from '@/hooks/useLang'
import { ButtonLink } from '@/components/ui/Button'
import { Container } from '@/components/ui/Container'
import { Reveal } from '@/components/ui/Reveal'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { RoomCard } from '@/components/rooms/RoomCard'
import { cn } from '@/utils/cn'

const FEATURED = ['standard-double', 'deluxe-double', 'budget-twin', 'triple']

export function FeaturedRooms() {
  const { t } = useTranslation()
  const lp = useLocalizedPath()
  const rooms = FEATURED.map((s) => ROOMS.find((r) => r.slug === s)!).filter(Boolean)

  return (
    <section aria-labelledby="featured-title" className="px-3 pt-20 sm:px-5 md:pt-28">
      <div className="rounded-[var(--radius-hero)] bg-surface py-16 md:py-20">
        <Container wide>
          <SectionHeading id="featured-title" title={t('home.featured.title')} subtitle={t('home.featured.subtitle')} />
          {/* Ikkinchi karta kengroq — Staymint'dagi editorial ritm */}
          <ul className="no-scrollbar -mx-4 flex snap-x gap-4 overflow-x-auto px-4 pb-2 sm:-mx-6 sm:px-6 lg:mx-0 lg:grid lg:grid-cols-[1fr_1.55fr_1fr_1fr] lg:overflow-visible lg:px-0">
            {rooms.map((room, i) => (
              <Reveal as="li" key={room.slug} delay={i * 0.08} className={cn('w-[78%] shrink-0 snap-start sm:w-[46%] lg:w-auto')}>
                <RoomCard room={room} className={cn(i === 1 && 'lg:aspect-auto lg:h-full')} sizes={i === 1 ? '(min-width: 1024px) 36vw, 78vw' : '(min-width: 1024px) 22vw, 78vw'} />
              </Reveal>
            ))}
          </ul>
          <p className="mt-6 text-center text-xs text-muted">{t('rooms.placeholderNotice')}</p>
          <div className="mt-6 flex justify-center">
            <ButtonLink to={lp('/rooms')} arrow>
              {t('home.featured.viewAll')}
            </ButtonLink>
          </div>
        </Container>
      </div>
    </section>
  )
}
