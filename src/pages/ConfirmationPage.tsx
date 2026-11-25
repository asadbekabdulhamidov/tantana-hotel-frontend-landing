import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { motion } from 'motion/react'
import { CheckCircle2 } from 'lucide-react'
import { getRoom } from '@/data/rooms'
import { useLocalizedPath } from '@/hooks/useLang'
import { readDemoRequest } from '@/utils/booking'
import { Seo } from '@/components/seo/Seo'
import { BookingSummary } from '@/components/booking/BookingSummary'
import { PhoneLink } from '@/components/layout/PhoneLink'
import { ButtonLink } from '@/components/ui/Button'
import { Container } from '@/components/ui/Container'
import { DemoNotice } from '@/components/ui/DemoNotice'

export default function ConfirmationPage() {
  const { t } = useTranslation()
  const lp = useLocalizedPath()
  const request = useMemo(readDemoRequest, [])
  const room = getRoom(request?.room)
  const steps = t('confirmation.nextSteps', { returnObjects: true }) as string[]

  return (
    <>
      <Seo title={t('meta.confirmation.title')} description={t('meta.confirmation.description')} path="/booking/confirmation" noindex />
      <Container className="pt-28 md:pt-36">
        {!request ? (
          <div className="mx-auto max-w-lg py-20 text-center">
            <h1 className="text-3xl font-semibold">{t('confirmation.emptyTitle')}</h1>
            <p className="mt-3 text-muted">{t('confirmation.emptyText')}</p>
            <ButtonLink to={lp('/booking')} arrow className="mt-8">
              {t('nav.book')}
            </ButtonLink>
          </div>
        ) : (
          <div className="grid gap-10 lg:grid-cols-[1fr_380px] lg:gap-14">
            <div>
              <motion.span
                initial={{ scale: 0.6, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: 'spring', stiffness: 260, damping: 18 }}
                className="grid size-14 place-items-center rounded-full bg-ink text-white"
              >
                <CheckCircle2 className="size-7" aria-hidden />
              </motion.span>
              <h1 className="mt-6 text-[2.25rem] font-semibold leading-[1.05] tracking-[-0.03em] sm:text-5xl">{t('confirmation.title')}</h1>
              <p className="mt-4 max-w-xl text-[0.98rem] leading-relaxed text-muted">{t('confirmation.text', { name: request.guest.fullName })}</p>

              <DemoNotice title={t('confirmation.demoTitle')} className="mt-8">
                {t('confirmation.demoText')}
              </DemoNotice>

              <div className="mt-8 inline-flex flex-col rounded-2xl border border-line px-5 py-4">
                <span className="text-xs text-muted">{t('confirmation.reference')}</span>
                <span className="mt-1 font-mono text-lg font-semibold tracking-wider">{request.reference}</span>
              </div>

              <section aria-labelledby="next-title" className="mt-10">
                <h2 id="next-title" className="text-xl font-semibold">
                  {t('confirmation.nextTitle')}
                </h2>
                <ol className="mt-5 grid gap-4">
                  {Array.isArray(steps) &&
                    steps.map((s, i) => (
                      <li key={s} className="flex gap-4">
                        <span className="grid size-8 shrink-0 place-items-center rounded-full bg-surface text-sm font-semibold">{i + 1}</span>
                        <span className="pt-1 text-[0.95rem] leading-relaxed text-ink-soft">{s}</span>
                      </li>
                    ))}
                </ol>
                <PhoneLink className="mt-6 text-sm font-semibold" />
              </section>

              <div className="mt-10 flex flex-wrap gap-3">
                <ButtonLink to={lp('/')} arrow>
                  {t('confirmation.home')}
                </ButtonLink>
                <ButtonLink to={lp('/discover')} variant="secondary">
                  {t('nav.discover')}
                </ButtonLink>
              </div>
            </div>
            <BookingSummary room={room} params={request} className="lg:mt-20" />
          </div>
        )}
      </Container>
    </>
  )
}
