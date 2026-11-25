import { useTranslation } from 'react-i18next'
import { ArrowUpRight, MapPin } from 'lucide-react'
import { DESTINATIONS, destinationMapsLink } from '@/data/destinations'
import { useLocalizedPath } from '@/hooks/useLang'
import { Seo } from '@/components/seo/Seo'
import { PageHeader } from '@/components/sections/PageHeader'
import { CtaBanner } from '@/components/sections/CtaBanner'
import { Container } from '@/components/ui/Container'
import { DemoNotice } from '@/components/ui/DemoNotice'
import { Img } from '@/components/ui/Img'
import { Reveal } from '@/components/ui/Reveal'
import { cn } from '@/utils/cn'

export default function DiscoverPage() {
  const { t } = useTranslation()
  const lp = useLocalizedPath()
  const crumbs = [{ label: t('nav.home'), to: lp('/') }, { label: t('nav.discover') }]

  return (
    <>
      <Seo title={t('meta.discover.title')} description={t('meta.discover.description')} path="/discover" image="mountains" breadcrumbs={crumbs} />
      <PageHeader crumbs={crumbs} eyebrow={t('discover.eyebrow')} title={t('discover.title')} subtitle={t('discover.subtitle')} />

      <Container wide className="mt-12 md:mt-16">
        <DemoNotice>{t('discover.note')}</DemoNotice>
        <ul className="mt-12 grid gap-x-6 gap-y-14 md:grid-cols-2 lg:grid-cols-3">
          {DESTINATIONS.map((d, i) => (
            <Reveal as="li" key={d.key} delay={(i % 3) * 0.08} id={d.key} className={cn('scroll-mt-28', i === 0 && 'md:col-span-2 lg:col-span-2')}>
              <article aria-labelledby={`${d.key}-title`} className="group flex h-full flex-col">
                <Img
                  image={d.image}
                  alt={t(`discover.items.${d.key}.alt`)}
                  sizes={i === 0 ? '(min-width: 1024px) 66vw, 100vw' : '(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw'}
                  className={cn('rounded-[var(--radius-card)]', i === 0 ? 'aspect-[16/9]' : 'aspect-[4/3]')}
                  imgClassName="transition-transform duration-[1.2s] ease-[var(--ease-out-soft)] group-hover:scale-[1.04]"
                />
                <p className="mt-5 inline-flex items-center gap-1.5 text-xs font-medium text-muted">
                  <MapPin className="size-3.5" aria-hidden />
                  {t(`discover.items.${d.key}.place`)}
                </p>
                <h2 id={`${d.key}-title`} className="mt-2 text-2xl font-semibold">
                  {t(`discover.items.${d.key}.name`)}
                </h2>
                <p className="mt-2 max-w-xl text-[0.95rem] leading-relaxed text-muted">{t(`discover.items.${d.key}.text`)}</p>
                <a
                  href={destinationMapsLink(d.mapsQuery)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group/link mt-4 inline-flex items-center gap-1.5 self-start text-[0.875rem] font-semibold underline-offset-4 hover:underline"
                >
                  {t('discover.openMap')}
                  <ArrowUpRight className="size-4 transition-transform group-hover/link:-translate-y-0.5 group-hover/link:translate-x-0.5" aria-hidden />
                  <span className="sr-only"> ({t('common.opensNewTab')})</span>
                </a>
              </article>
            </Reveal>
          ))}
        </ul>
      </Container>
      <CtaBanner image="exteriorSunset" />
    </>
  )
}
