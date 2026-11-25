import { useEffect, useMemo, useRef } from 'react'
import { useSearchParams } from 'react-router'
import { useTranslation } from 'react-i18next'
import { SlidersHorizontal, X } from 'lucide-react'
import { ALL_AMENITIES, PRICE_MAX, ROOM_TYPES, ROOMS, type AmenityKey, type RoomType } from '@/data/rooms'
import { useLang, useLocalizedPath } from '@/hooks/useLang'
import { useBookingParams } from '@/hooks/useBookingParams'
import { bookingQuery } from '@/utils/booking'
import { formatDate, nightsBetween } from '@/utils/date'
import { Seo } from '@/components/seo/Seo'
import { PageHeader } from '@/components/sections/PageHeader'
import { BookingSearch } from '@/components/booking/BookingSearch'
import { RoomFilters, EMPTY_FILTERS, type FilterState } from '@/components/rooms/RoomFilters'
import { RoomListItem } from '@/components/rooms/RoomListItem'
import { Button } from '@/components/ui/Button'
import { Container } from '@/components/ui/Container'
import { DemoNotice } from '@/components/ui/DemoNotice'

function parseList<T extends string>(raw: string | null, allowed: readonly T[]): T[] {
  if (!raw) return []
  return raw.split(',').filter((v): v is T => (allowed as readonly string[]).includes(v))
}

export default function RoomsPage() {
  const { t } = useTranslation()
  const lang = useLang()
  const lp = useLocalizedPath()
  const [params, setParams] = useSearchParams()
  const booking = useBookingParams()
  const sheet = useRef<HTMLDialogElement>(null)

  const filters: FilterState = useMemo(
    () => ({
      guests: Number(params.get('minGuests') ?? (booking.valid ? booking.guests : 0)) || 0,
      types: parseList<RoomType>(params.get('type'), ROOM_TYPES),
      maxPrice: Number(params.get('maxPrice')) || PRICE_MAX,
      amenities: parseList<AmenityKey>(params.get('amenities'), ALL_AMENITIES),
    }),
    [params, booking.valid, booking.guests],
  )

  const setFilters = (f: FilterState) => {
    const next = new URLSearchParams(params)
    const set = (k: string, v: string | null) => (v ? next.set(k, v) : next.delete(k))
    set('minGuests', f.guests ? String(f.guests) : booking.valid ? '0' : null)
    set('type', f.types.join(',') || null)
    set('maxPrice', f.maxPrice < PRICE_MAX ? String(f.maxPrice) : null)
    set('amenities', f.amenities.join(',') || null)
    setParams(next, { replace: true, preventScrollReset: true })
  }

  const results = ROOMS.filter(
    (r) =>
      r.capacity >= filters.guests &&
      (!filters.types.length || filters.types.includes(r.type)) &&
      r.price <= filters.maxPrice &&
      filters.amenities.every((a) => r.amenities.includes(a)),
  )

  const activeCount = (filters.guests ? 1 : 0) + filters.types.length + (filters.maxPrice < PRICE_MAX ? 1 : 0) + filters.amenities.length
  const reset = () => setFilters({ ...EMPTY_FILTERS })
  const query = booking.valid ? bookingQuery(booking) : ''

  // Sahifa sarlavhasi ostidagi qidiruv natijalari matni
  const nights = booking.valid ? nightsBetween(booking.checkIn, booking.checkOut) : 0

  useEffect(() => {
    const d = sheet.current
    const close = () => document.body.style.removeProperty('overflow')
    d?.addEventListener('close', close)
    return () => d?.removeEventListener('close', close)
  }, [])

  const crumbs = [{ label: t('nav.home'), to: lp('/') }, { label: t('nav.rooms') }]

  return (
    <>
      <Seo title={t('meta.rooms.title')} description={t('meta.rooms.description')} path="/rooms" image="roomDouble" breadcrumbs={crumbs} />
      <PageHeader crumbs={crumbs} eyebrow={t('rooms.eyebrow')} title={t('rooms.title')} subtitle={t('rooms.subtitle')}>
        <div className="mt-10">
          <BookingSearch variant="panel" />
          {booking.valid && (
            <p className="mt-3 text-sm text-muted" aria-live="polite">
              {t('rooms.searchSummary', {
                from: formatDate(booking.checkIn, lang, { day: 'numeric', month: 'short' }),
                to: formatDate(booking.checkOut, lang, { day: 'numeric', month: 'short', year: 'numeric' }),
                nights: t('search.nights', { count: nights }),
                guests: t('search.guestCount', { count: booking.guests }),
              })}
            </p>
          )}
        </div>
      </PageHeader>

      <Container wide className="mt-12 md:mt-16">
        <DemoNotice title={t('common.demo')}>{t('rooms.placeholderNotice')}</DemoNotice>

        <div className="mt-10 grid gap-10 lg:grid-cols-[280px_1fr] lg:gap-14">
          {/* Desktop filtrlari */}
          <aside aria-labelledby="filters-title" className="hidden lg:block">
            <div className="sticky top-24">
              <div className="mb-6 flex items-center justify-between">
                <h2 id="filters-title" className="text-lg font-semibold">
                  {t('rooms.filters.title')}
                </h2>
                {activeCount > 0 && (
                  <button type="button" onClick={reset} className="text-[0.8125rem] font-medium text-muted underline-offset-4 hover:text-ink hover:underline">
                    {t('rooms.filters.reset')}
                  </button>
                )}
              </div>
              <RoomFilters value={filters} onChange={setFilters} />
            </div>
          </aside>

          <div>
            <div className="mb-8 flex items-center justify-between gap-4 border-b border-line pb-5">
              <p className="text-sm text-muted" aria-live="polite" role="status">
                {t('rooms.filters.results', { count: results.length })}
              </p>
              <Button
                variant="secondary"
                size="sm"
                className="lg:hidden"
                onClick={() => {
                  sheet.current?.showModal()
                  document.body.style.overflow = 'hidden'
                }}
                aria-haspopup="dialog"
              >
                <SlidersHorizontal className="size-4" aria-hidden />
                {t('rooms.filters.open')}
                {activeCount > 0 && <span className="grid size-5 place-items-center rounded-full bg-ink text-[0.6875rem] text-white">{activeCount}</span>}
              </Button>
            </div>

            {results.length ? (
              <div className="flex flex-col gap-16 md:gap-24">
                {results.map((room, i) => (
                  <RoomListItem key={room.slug} room={room} index={i} query={query} />
                ))}
              </div>
            ) : (
              <div className="rounded-[var(--radius-card)] bg-surface px-6 py-16 text-center">
                <h2 className="text-xl font-semibold">{t('rooms.empty.title')}</h2>
                <p className="mx-auto mt-2 max-w-md text-sm text-muted">{t('rooms.empty.text')}</p>
                <Button variant="primary" className="mt-6" onClick={reset}>
                  {t('rooms.empty.reset')}
                </Button>
              </div>
            )}
          </div>
        </div>
      </Container>

      {/* Mobil filtr "bottom sheet" (native dialog — fokus tuzog'i va Esc) */}
      <dialog
        ref={sheet}
        aria-labelledby="sheet-title"
        className="m-0 mt-auto max-h-[88dvh] w-full max-w-none rounded-t-[1.75rem] bg-white p-0 backdrop:bg-black/40 lg:hidden"
      >
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-line bg-white px-5 py-4">
          <h2 id="sheet-title" className="text-lg font-semibold">
            {t('rooms.filters.title')}
          </h2>
          <button type="button" onClick={() => sheet.current?.close()} aria-label={t('rooms.filters.close')} className="grid size-10 place-items-center rounded-full bg-surface">
            <X className="size-5" aria-hidden />
          </button>
        </div>
        <div className="px-5 py-6">
          <RoomFilters value={filters} onChange={setFilters} />
        </div>
        <div className="sticky bottom-0 flex gap-3 border-t border-line bg-white px-5 pb-[max(1rem,env(safe-area-inset-bottom))] pt-4">
          <Button variant="secondary" onClick={reset} className="flex-1">
            {t('rooms.filters.reset')}
          </Button>
          <Button onClick={() => sheet.current?.close()} className="flex-[2]">
            {t('rooms.filters.show', { count: results.length })}
          </Button>
        </div>
      </dialog>
    </>
  )
}
