import { useTranslation } from 'react-i18next'
import { HOTEL } from '@/data/hotel'
import { useLocalizedPath } from '@/hooks/useLang'
import { Seo, hotelJsonLd } from '@/components/seo/Seo'
import { useLang } from '@/hooks/useLang'
import { PageHeader } from '@/components/sections/PageHeader'
import { WhySection } from '@/components/sections/WhySection'
import { CtaBanner } from '@/components/sections/CtaBanner'
import { Container } from '@/components/ui/Container'
import { DemoNotice } from '@/components/ui/DemoNotice'
import { Img } from '@/components/ui/Img'
import { Reveal } from '@/components/ui/Reveal'

export default function AboutPage() {
  const { t } = useTranslation()
  const lp = useLocalizedPath()
  const lang = useLang()
  const crumbs = [{ label: t('nav.home'), to: lp('/') }, { label: t('nav.about') }]
  const paragraphs = t('about.story.paragraphs', { returnObjects: true }) as string[]

  const facts = [
    { value: String(HOTEL.roomCount), label: t('about.facts.rooms') },
    { value: HOTEL.checkIn, label: t('about.facts.checkIn') },
    { value: HOTEL.checkOut, label: t('about.facts.checkOut') },
    { value: '24/7', label: t('about.facts.reception') },
  ]

  return (
    <>
      <Seo title={t('meta.about.title')} description={t('meta.about.description')} path="/about" image="exterior" breadcrumbs={crumbs} jsonLd={hotelJsonLd(lang, t('meta.about.description'))} />
      <PageHeader crumbs={crumbs} eyebrow={t('about.eyebrow')} title={t('about.title')} subtitle={t('about.subtitle')} image="exterior" />

      <Container wide className="mt-16 md:mt-24">
        <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-[var(--radius-card)] border border-line bg-line md:grid-cols-4">
          {facts.map((f, i) => (
            <Reveal key={f.label} delay={i * 0.06} className="bg-white p-6 md:p-8">
              <dt className="text-[0.8125rem] text-muted">{f.label}</dt>
              <dd className="mt-2 text-3xl font-semibold tracking-tight md:text-4xl">{f.value}</dd>
            </Reveal>
          ))}
        </dl>

        <section aria-labelledby="story-title" className="mt-20 grid items-center gap-10 md:mt-28 md:grid-cols-2 md:gap-16">
          <Reveal>
            <Img image="reception" sizes="(min-width: 768px) 50vw, 100vw" className="aspect-[4/5] rounded-[var(--radius-hero)]" />
          </Reveal>
          <Reveal delay={0.1}>
            <p className="eyebrow">{t('about.story.eyebrow')}</p>
            <h2 id="story-title" className="mt-3 text-[1.75rem] font-semibold leading-tight sm:text-4xl">
              {t('about.story.title')}
            </h2>
            <div className="mt-5 flex flex-col gap-4 text-[0.98rem] leading-[1.75] text-ink-soft">
              {Array.isArray(paragraphs) && paragraphs.map((p) => <p key={p}>{p}</p>)}
            </div>
            <DemoNotice className="mt-8">{t('about.missingNote')}</DemoNotice>
          </Reveal>
        </section>
      </Container>

      <WhySection />
      <CtaBanner />
    </>
  )
}
