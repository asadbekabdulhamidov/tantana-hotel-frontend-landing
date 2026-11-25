import { useRef } from 'react'
import { Link } from 'react-router'
import { useTranslation } from 'react-i18next'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { EXPERIENCES } from '@/data/experiences'
import { useLocalizedPath } from '@/hooks/useLang'
import { Container } from '@/components/ui/Container'
import { Img } from '@/components/ui/Img'
import { Reveal } from '@/components/ui/Reveal'

export function ExperiencesTeaser() {
  const { t } = useTranslation()
  const lp = useLocalizedPath()
  const rail = useRef<HTMLUListElement>(null)
  const scrollBy = (dir: number) => {
    const el = rail.current
    if (!el) return
    el.scrollBy({ left: dir * el.clientWidth * 0.8, behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' })
  }

  return (
    <section aria-labelledby="exp-title" className="pt-20 md:pt-28">
      <Container wide>
        <Reveal className="mb-10 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div className="max-w-xl">
            <p className="eyebrow">{t('home.experiences.eyebrow')}</p>
            <h2 id="exp-title" className="mt-3 text-[1.75rem] font-semibold leading-tight sm:text-4xl">
              {t('home.experiences.title')}
            </h2>
            <p className="mt-3 text-[0.95rem] leading-relaxed text-muted">{t('home.experiences.subtitle')}</p>
          </div>
          <div className="flex items-center gap-2">
            <button type="button" onClick={() => scrollBy(-1)} aria-label={t('common.previous')} className="grid size-11 place-items-center rounded-full border border-line transition-colors hover:border-ink">
              <ArrowLeft className="size-4" aria-hidden />
            </button>
            <button type="button" onClick={() => scrollBy(1)} aria-label={t('common.next')} className="grid size-11 place-items-center rounded-full bg-ink text-white transition-colors hover:bg-ink-soft">
              <ArrowRight className="size-4" aria-hidden />
            </button>
          </div>
        </Reveal>
        <ul ref={rail} className="no-scrollbar -mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-px-4 px-4 pb-2 sm:-mx-6 sm:scroll-px-6 sm:px-6 lg:mx-0 lg:scroll-px-0 lg:px-0">
          {EXPERIENCES.map((e) => (
            <li key={e.key} className="w-[82%] shrink-0 snap-start sm:w-[48%] lg:w-[calc((100%-2rem)/3)]">
              <Link to={lp(`/experiences#${e.key}`)} className="group flex h-full gap-4 rounded-[var(--radius-card)] border border-line bg-white p-3 transition-shadow duration-300 hover:shadow-[var(--shadow-soft)]">
                <Img image={e.image} sizes="160px" className="aspect-square w-28 shrink-0 rounded-xl sm:w-36" imgClassName="transition-transform duration-700 group-hover:scale-[1.06]" />
                <div className="flex min-w-0 flex-col py-1 pr-1">
                  <h3 className="text-[0.98rem] font-semibold">{t(`experiences.items.${e.key}.title`)}</h3>
                  <p className="mt-1.5 line-clamp-3 text-[0.8125rem] leading-relaxed text-muted">{t(`experiences.items.${e.key}.short`)}</p>
                  <span className="mt-auto inline-flex items-center gap-1 pt-3 text-[0.8125rem] font-semibold">
                    {t('common.learnMore')}
                    <ArrowRight className="size-3.5 transition-transform duration-300 group-hover:translate-x-1" aria-hidden />
                  </span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  )
}
