import { useParams } from 'react-router'
import { useTranslation } from 'react-i18next'
import { Clock } from 'lucide-react'
import { HOTEL } from '@/data/hotel'
import { getRoom, ROOMS } from '@/data/rooms'
import { useLocalizedPath } from '@/hooks/useLang'
import { useBookingParams } from '@/hooks/useBookingParams'
import { bookingQuery } from '@/utils/booking'
import { Seo } from '@/components/seo/Seo'
import { Breadcrumbs } from '@/components/ui/Breadcrumbs'
import { ButtonLink } from '@/components/ui/Button'
import { Container } from '@/components/ui/Container'
import { DemoNotice } from '@/components/ui/DemoNotice'
import { Reveal } from '@/components/ui/Reveal'
import { RoomGallery } from '@/components/rooms/RoomGallery'
import { RoomFacts } from '@/components/rooms/RoomFacts'
import { RoomPrice } from '@/components/rooms/RoomPrice'
import { RoomCard } from '@/components/rooms/RoomCard'
import { AMENITY_ICONS } from '@/components/rooms/amenityIcons'
import { BookingSearch } from '@/components/booking/BookingSearch'
import NotFoundPage from './NotFoundPage'

export default function RoomDetailsPage() {
  const { slug } = useParams()
  const { t } = useTranslation()
  const lp = useLocalizedPath()
  const booking = useBookingParams()
  const room = getRoom(slug)

  if (!room) return <NotFoundPage message={t('room.notFound')} />

  const base = `rooms.items.${room.slug}`
  const name = t(`${base}.name`)
  const alts = room.images.map((_, i) => t(`${base}.gallery.${i}`, { defaultValue: t(`${base}.alt`) }))
  const query = booking.valid ? bookingQuery(booking) : ''
  const bookHref = `${lp('/booking')}${booking.valid ? `${bookingQuery({ ...booking, room: room.slug })}` : `?room=${room.slug}`}`
  const related = ROOMS.filter((r) => r.slug !== room.slug)
    .sort((a, b) => Number(b.type === room.type) - Number(a.type === room.type) || Math.abs(a.price - room.price) - Math.abs(b.price - room.price))
    .slice(0, 3)

  const crumbs = [
    { label: t('nav.home'), to: lp('/') },
    { label: t('nav.rooms'), to: lp('/rooms') },
    { label: name },
  ]

  return (
    <>
      <Seo
        title={t('meta.room.title', { name })}
        description={t('meta.room.description', { name, short: t(`${base}.short`) })}
        path={`/rooms/${room.slug}`}
        image={room.images[0]}
        breadcrumbs={crumbs}
        /* Room/Offer structured data ataylab yo'q — narx va ma'lumot hali namunaviy */
      />
      <div className="pt-24 md:pt-28">
        <Container wide>
          <Breadcrumbs items={crumbs} />
          <div className="mt-6 flex flex-col gap-4 md:mt-8 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="eyebrow">{t(`rooms.filters.types.${room.type}`)}</p>
              <h1 className="mt-2 text-[2.25rem] font-semibold leading-[1.05] tracking-[-0.03em] sm:text-5xl">{name}</h1>
            </div>
            <RoomFacts room={room} className="md:pb-2" />
          </div>
          <div className="mt-8">
            <RoomGallery images={room.images} alts={alts} priority />
          </div>
        </Container>

        <Container wide className="mt-12 grid gap-12 lg:grid-cols-[1fr_400px] lg:gap-16">
          <div className="min-w-0">
            {room.placeholder && <DemoNotice title={t('common.demo')}>{t('rooms.placeholderNotice')}</DemoNotice>}

            <Reveal as="section" aria-labelledby="overview" className="mt-10">
              <h2 id="overview" className="text-2xl font-semibold">
                {t('room.overview')}
              </h2>
              <p className="mt-4 max-w-2xl text-[1rem] leading-[1.75] text-ink-soft">{t(`${base}.description`)}</p>
            </Reveal>

            <Reveal as="section" aria-labelledby="facts" className="mt-12">
              <h2 id="facts" className="text-2xl font-semibold">
                {t('room.details')}
              </h2>
              <dl className="mt-6 grid grid-cols-2 gap-px overflow-hidden rounded-[var(--radius-card)] border border-line bg-line sm:grid-cols-4">
                {[
                  [t('room.facts.capacity'), t('rooms.card.guests', { count: room.capacity })],
                  [t('room.facts.bed'), t(`rooms.beds.${room.bed}`)],
                  [t('room.facts.size'), t('rooms.card.size', { value: room.size })],
                  [t('room.facts.times'), `${HOTEL.checkIn} / ${HOTEL.checkOut}`],
                ].map(([k, v]) => (
                  <div key={k} className="bg-white p-5">
                    <dt className="text-xs text-muted">{k}</dt>
                    <dd className="mt-1.5 text-[0.95rem] font-semibold">{v}</dd>
                  </div>
                ))}
              </dl>
            </Reveal>

            <Reveal as="section" aria-labelledby="amenities" className="mt-12">
              <h2 id="amenities" className="text-2xl font-semibold">
                {t('room.amenities')}
              </h2>
              <ul className="mt-6 grid gap-x-6 gap-y-4 sm:grid-cols-2">
                {room.amenities.map((a) => {
                  const Icon = AMENITY_ICONS[a]
                  return (
                    <li key={a} className="flex items-center gap-3 text-[0.95rem]">
                      <span className="grid size-10 place-items-center rounded-full bg-surface">
                        <Icon className="size-[1.125rem]" aria-hidden strokeWidth={1.6} />
                      </span>
                      {t(`rooms.amenities.${a}`)}
                    </li>
                  )
                })}
              </ul>
            </Reveal>
          </div>

          {/* Bron paneli — ko'zga tashlanadi, lekin aralashmaydi */}
          <aside aria-labelledby="book-title" className="lg:pt-10">
            <div className="sticky top-24 rounded-[var(--radius-card)] border border-line bg-white p-5 shadow-[var(--shadow-soft)] sm:p-6">
              <h2 id="book-title" className="sr-only">
                {t('room.bookTitle')}
              </h2>
              <RoomPrice room={room} size="lg" />
              <p className="mt-4 flex items-center gap-2 text-[0.8125rem] text-muted">
                <Clock className="size-4" aria-hidden strokeWidth={1.6} />
                {t('footer.times', { checkIn: HOTEL.checkIn, checkOut: HOTEL.checkOut })}
              </p>
              <div className="mt-5 border-t border-line pt-5">
                <p className="mb-3 text-sm font-semibold">{t('room.bookSubtitle')}</p>
                <BookingSearch stacked target="booking" extraQuery={{ room: room.slug }} submitLabel={t('rooms.card.book')} />
              </div>
              <ButtonLink to={bookHref} variant="secondary" block className="mt-3">
                {t('room.skipDates')}
              </ButtonLink>
            </div>
          </aside>
        </Container>

        <section aria-labelledby="related" className="pt-20 md:pt-28">
          <Container wide>
            <div className="mb-8 flex items-end justify-between gap-4">
              <h2 id="related" className="text-[1.75rem] font-semibold sm:text-4xl">
                {t('room.related')}
              </h2>
              <div className="hidden sm:block">
                <ButtonLink to={lp('/rooms') + query} variant="secondary" size="sm">
                  {t('home.featured.viewAll')}
                </ButtonLink>
              </div>
            </div>
            <ul className="no-scrollbar -mx-4 flex snap-x gap-4 overflow-x-auto px-4 sm:-mx-6 sm:px-6 lg:mx-0 lg:grid lg:grid-cols-3 lg:px-0">
              {related.map((r, i) => (
                <Reveal as="li" key={r.slug} delay={i * 0.08} className="w-[78%] shrink-0 snap-start sm:w-[46%] lg:w-auto">
                  <RoomCard room={r} query={query} sizes="(min-width: 1024px) 33vw, 78vw" />
                </Reveal>
              ))}
            </ul>
          </Container>
        </section>
      </div>
    </>
  )
}
