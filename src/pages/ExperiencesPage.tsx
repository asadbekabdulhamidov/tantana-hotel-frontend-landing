import { useTranslation } from 'react-i18next'
import { EXPERIENCES } from '@/data/experiences'
import { useLocalizedPath } from '@/hooks/useLang'
import { Seo } from '@/components/seo/Seo'
import { PageHeader } from '@/components/sections/PageHeader'
import { ExperienceRow } from '@/components/sections/ExperienceRow'
import { CtaBanner } from '@/components/sections/CtaBanner'
import { Container } from '@/components/ui/Container'
import { DemoNotice } from '@/components/ui/DemoNotice'

export default function ExperiencesPage() {
  const { t } = useTranslation()
  const lp = useLocalizedPath()
  const crumbs = [{ label: t('nav.home'), to: lp('/') }, { label: t('nav.experiences') }]
  return (
    <>
      <Seo title={t('meta.experiences.title')} description={t('meta.experiences.description')} path="/experiences" image="lobby" breadcrumbs={crumbs} />
      <PageHeader crumbs={crumbs} eyebrow={t('experiences.eyebrow')} title={t('experiences.title')} subtitle={t('experiences.subtitle')} image="lobby" />
      <Container wide className="mt-14 md:mt-20">
        <DemoNotice>{t('experiences.sourceNote')}</DemoNotice>
        <nav aria-label={t('experiences.jumpTo')} className="no-scrollbar -mx-4 mt-10 overflow-x-auto px-4 sm:-mx-6 sm:px-6 lg:mx-0 lg:px-0">
          <ul className="flex gap-2">
            {EXPERIENCES.map((e) => (
              <li key={e.key} className="shrink-0">
                <a href={`#${e.key}`} className="inline-flex h-10 items-center rounded-full border border-line px-4 text-[0.8125rem] font-medium transition-colors hover:border-ink hover:bg-ink hover:text-white">
                  {t(`experiences.items.${e.key}.title`)}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <div className="mt-16 flex flex-col gap-20 md:mt-24 md:gap-32">
          {EXPERIENCES.map((e, i) => (
            <ExperienceRow key={e.key} item={e} index={i} />
          ))}
        </div>
      </Container>
      <CtaBanner image="exteriorWide" />
    </>
  )
}
