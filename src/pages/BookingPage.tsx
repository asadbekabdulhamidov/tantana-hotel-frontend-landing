import { useEffect, useRef, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router'
import { useTranslation } from 'react-i18next'
import { AlertCircle, Check, Pencil } from 'lucide-react'
import { getRoom, ROOMS } from '@/data/rooms'
import { useLang, useLocalizedPath } from '@/hooks/useLang'
import { useBookingParams } from '@/hooks/useBookingParams'
import { REQUEST_KEY, type DemoRequest } from '@/utils/booking'
import { formatDate } from '@/utils/date'
import { Seo } from '@/components/seo/Seo'
import { BookingSearch } from '@/components/booking/BookingSearch'
import { BookingForm, type GuestValues } from '@/components/booking/BookingForm'
import { BookingSummary } from '@/components/booking/BookingSummary'
import { StepIndicator, type BookingStep } from '@/components/booking/StepIndicator'
import { RoomFacts } from '@/components/rooms/RoomFacts'
import { RoomPrice } from '@/components/rooms/RoomPrice'
import { Breadcrumbs } from '@/components/ui/Breadcrumbs'
import { Button } from '@/components/ui/Button'
import { Container } from '@/components/ui/Container'
import { DemoNotice } from '@/components/ui/DemoNotice'
import { Img } from '@/components/ui/Img'
import { cn } from '@/utils/cn'

const DRAFT_KEY = 'tantana.guestDraft'

function readDraft(): Partial<GuestValues> | undefined {
  try {
    const raw = sessionStorage.getItem(DRAFT_KEY)
    return raw ? JSON.parse(raw) : undefined
  } catch {
    return undefined
  }
}

export default function BookingPage() {
  const { t } = useTranslation()
  const lang = useLang()
  const lp = useLocalizedPath()
  const navigate = useNavigate()
  const [params, setParams] = useSearchParams()
  const booking = useBookingParams()
  const room = getRoom(params.get('room') ?? undefined)
  const [guest, setGuest] = useState<GuestValues | undefined>(() => readDraft() as GuestValues | undefined)
  const [phase, setPhase] = useState<'details' | 'review'>('details')
  const [status, setStatus] = useState<'idle' | 'submitting' | 'error'>('idle')
  const headingRef = useRef<HTMLHeadingElement>(null)

  const step: BookingStep = !booking.valid || params.get('edit') ? 'dates' : !room ? 'room' : phase

  // Bosqich o'zgarganda fokus sarlavhaga — klaviatura va screen reader uchun
  useEffect(() => {
    headingRef.current?.focus({ preventScroll: true })
    window.scrollTo({ top: 0, behavior: 'auto' })
  }, [step])

  const selectRoom = (slug: string | null) => {
    const next = new URLSearchParams(params)
    if (booking.valid) {
      next.set('checkIn', booking.checkIn)
      next.set('checkOut', booking.checkOut)
      next.set('guests', String(booking.guests))
    }
    next.delete('edit')
    if (slug) next.set('room', slug)
    else next.delete('room')
    setParams(next)
    setPhase('details')
  }

  const editDates = () => {
    const next = new URLSearchParams(params)
    next.set('edit', '1')
    setParams(next)
  }

  const onGuest = (v: GuestValues) => {
    setGuest(v)
    try {
      sessionStorage.setItem(DRAFT_KEY, JSON.stringify(v))
    } catch {
      /* ignore */
    }
    setPhase('review')
  }

  /* Backend yo'q — demo so'rov. Haqiqiy API ulanganda shu funksiyani almashtiring. */
  const confirm = async () => {
    if (!room || !guest || !booking.valid) return
    setStatus('submitting')
    try {
      await new Promise((r) => setTimeout(r, 1200))
      const request: DemoRequest = {
        reference: `DEMO-${Math.random().toString(36).slice(2, 8).toUpperCase()}`,
        createdAt: new Date().toISOString(),
        room: room.slug,
        checkIn: booking.checkIn,
        checkOut: booking.checkOut,
        guests: booking.guests,
        guest,
      }
      sessionStorage.setItem(REQUEST_KEY, JSON.stringify(request))
      sessionStorage.removeItem(DRAFT_KEY)
      navigate(lp('/booking/confirmation'))
    } catch {
      setStatus('error')
    }
  }

  const crumbs = [{ label: t('nav.home'), to: lp('/') }, { label: t('booking.title') }]
  const eligible = ROOMS.filter((r) => r.capacity >= (booking.guests || 1))

  return (
    <>
      <Seo title={t('meta.booking.title')} description={t('meta.booking.description')} path="/booking" noindex breadcrumbs={crumbs} />
      <div className="pt-24 md:pt-28">
        <Container wide>
          <Breadcrumbs items={crumbs} />
          <div className="mt-6 flex flex-col gap-2 md:mt-8">
            <p className="eyebrow">{t('booking.eyebrow')}</p>
            <h1 ref={headingRef} tabIndex={-1} className="text-[2.25rem] font-semibold leading-[1.05] tracking-[-0.03em] outline-none sm:text-5xl">
              {t(`booking.headings.${step}`)}
            </h1>
          </div>
          <div className="mt-8">
            <StepIndicator current={step} />
          </div>
          <DemoNotice title={t('booking.demoTitle')} className="mt-8">
            {t('booking.demoBanner')}
          </DemoNotice>
        </Container>

        <Container wide className="mt-10 grid gap-8 lg:grid-cols-[1fr_380px] lg:gap-12">
          <div className="min-w-0">
            {step === 'dates' && (
              <section aria-label={t('booking.steps.dates')}>
                <BookingSearch target="booking" extraQuery={room ? { room: room.slug } : undefined} submitLabel={t('booking.continue')} />
                <p className="mt-4 text-sm text-muted">{t('booking.datesHint')}</p>
              </section>
            )}

            {step === 'room' && (
              <section aria-label={t('booking.steps.room')}>
                <fieldset>
                  <legend className="sr-only">{t('booking.selectRoom')}</legend>
                  <ul className="grid gap-4">
                    {eligible.map((r) => (
                      <li key={r.slug}>
                        <button
                          type="button"
                          onClick={() => selectRoom(r.slug)}
                          className="group flex w-full flex-col gap-4 rounded-[var(--radius-card)] border border-line bg-white p-3 text-left transition-[border-color,box-shadow] hover:border-ink/40 hover:shadow-[var(--shadow-soft)] sm:flex-row sm:items-center"
                        >
                          <Img image={r.images[0]} alt={t(`rooms.items.${r.slug}.alt`)} sizes="(min-width: 640px) 220px, 100vw" className="aspect-[16/10] shrink-0 rounded-xl sm:w-52" />
                          <div className="min-w-0 flex-1 px-1 sm:px-0">
                            <p className="text-xs text-muted">{t(`rooms.filters.types.${r.type}`)}</p>
                            <p className="mt-0.5 text-lg font-semibold">{t(`rooms.items.${r.slug}.name`)}</p>
                            <RoomFacts room={r} className="mt-2" />
                          </div>
                          <div className="flex items-center justify-between gap-4 px-1 pb-1 sm:flex-col sm:items-end sm:px-3 sm:pb-0">
                            <RoomPrice room={r} size="sm" className="sm:items-end" />
                            <span className="inline-flex h-10 items-center rounded-full bg-ink px-4 text-[0.8125rem] font-semibold text-white">{t('booking.select')}</span>
                          </div>
                        </button>
                      </li>
                    ))}
                  </ul>
                </fieldset>
                {eligible.length < ROOMS.length && <p className="mt-4 text-sm text-muted">{t('booking.capacityHint', { count: booking.guests })}</p>}
              </section>
            )}

            {step === 'details' && room && (
              <BookingForm
                defaultValues={guest}
                onSubmit={onGuest}
                onBack={() => selectRoom(null)}
              />
            )}

            {step === 'review' && room && guest && (
              <section aria-labelledby="review-title" className="rounded-[var(--radius-card)] border border-line bg-white p-5 sm:p-8">
                <h2 id="review-title" className="text-xl font-semibold">
                  {t('booking.review.title')}
                </h2>
                <p className="mt-1 text-sm text-muted">{t('booking.review.subtitle')}</p>

                <ReviewBlock title={t('booking.steps.dates')} onEdit={editDates} editLabel={t('booking.change')}>
                  {formatDate(booking.checkIn, lang, { day: 'numeric', month: 'long', year: 'numeric' })} — {formatDate(booking.checkOut, lang, { day: 'numeric', month: 'long', year: 'numeric' })} ·{' '}
                  {t('search.guestCount', { count: booking.guests })}
                </ReviewBlock>
                <ReviewBlock title={t('booking.steps.room')} onEdit={() => selectRoom(null)} editLabel={t('booking.change')}>
                  {t(`rooms.items.${room.slug}.name`)}
                </ReviewBlock>
                <ReviewBlock title={t('booking.steps.details')} onEdit={() => setPhase('details')} editLabel={t('booking.change')}>
                  <dl className="grid gap-2 sm:grid-cols-2">
                    {(
                      [
                        ['fullName', guest.fullName],
                        ['phone', guest.phone],
                        ['email', guest.email],
                        ['arrival', t(`booking.arrival.${guest.arrival}`)],
                      ] as const
                    ).map(([k, v]) => (
                      <div key={k}>
                        <dt className="text-xs text-muted">{t(`booking.guest.${k}`)}</dt>
                        <dd className="font-medium">{v}</dd>
                      </div>
                    ))}
                    {guest.requests && (
                      <div className="sm:col-span-2">
                        <dt className="text-xs text-muted">{t('booking.guest.requests')}</dt>
                        <dd className="whitespace-pre-line font-medium">{guest.requests}</dd>
                      </div>
                    )}
                  </dl>
                </ReviewBlock>

                {status === 'error' && (
                  <p role="alert" className="mt-6 flex items-center gap-2 rounded-xl bg-[#fdf1f0] p-4 text-sm font-medium text-danger">
                    <AlertCircle className="size-4" aria-hidden />
                    {t('booking.errors.submitFailed')}
                  </p>
                )}

                <div className="mt-8 flex flex-col-reverse gap-3 border-t border-line pt-6 sm:flex-row sm:justify-between">
                  <Button variant="secondary" onClick={() => setPhase('details')}>
                    {t('booking.back')}
                  </Button>
                  <Button onClick={confirm} arrow disabled={status === 'submitting'} aria-busy={status === 'submitting'}>
                    {status === 'submitting' ? (
                      <>
                        <span className="size-4 animate-spin rounded-full border-2 border-white/30 border-t-white motion-reduce:animate-none" aria-hidden />
                        {t('booking.submitting')}
                      </>
                    ) : (
                      t('booking.submit')
                    )}
                  </Button>
                </div>
              </section>
            )}
          </div>

          <div className="lg:sticky lg:top-24 lg:self-start">
            <BookingSummary room={room} params={booking.valid ? booking : {}} />
            {booking.valid && step !== 'dates' && (
              <button type="button" onClick={editDates} className="mt-3 inline-flex items-center gap-1.5 text-[0.8125rem] font-medium text-muted hover:text-ink">
                <Pencil className="size-3.5" aria-hidden />
                {t('booking.changeDates')}
              </button>
            )}
          </div>
        </Container>
      </div>
    </>
  )
}

function ReviewBlock({ title, children, onEdit, editLabel }: { title: string; children: React.ReactNode; onEdit: () => void; editLabel: string }) {
  return (
    <div className={cn('mt-6 flex items-start justify-between gap-4 border-t border-line pt-5')}>
      <div className="min-w-0">
        <p className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.12em] text-muted">
          <Check className="size-3.5 text-success" aria-hidden />
          {title}
        </p>
        <div className="mt-2 text-[0.95rem]">{children}</div>
      </div>
      <button type="button" onClick={onEdit} className="shrink-0 text-[0.8125rem] font-semibold underline-offset-4 hover:underline">
        {editLabel}
        <span className="sr-only">: {title}</span>
      </button>
    </div>
  )
}

