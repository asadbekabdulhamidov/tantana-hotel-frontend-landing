import { Link } from 'react-router'
import { useTranslation } from 'react-i18next'
import { ArrowUpRight } from 'lucide-react'
import type { ImageKey } from '@/data/images'
import { useLocalizedPath } from '@/hooks/useLang'
import { Container } from '@/components/ui/Container'
import { Img } from '@/components/ui/Img'
import { Reveal } from '@/components/ui/Reveal'
import { SectionHeading } from '@/components/ui/SectionHeading'

const STYLES: { key: string; image: ImageKey; to: string }[] = [
  { key: 'couples', image: 'roomDeluxe', to: '/rooms?type=standard,deluxe' },
  { key: 'twin', image: 'roomTwin', to: '/rooms?type=twin' },
  { key: 'family', image: 'roomTriple', to: '/rooms?type=triple' },
  { key: 'business', image: 'conference', to: '/experiences#events' },
]

export function TravelStyles() {
  const { t } = useTranslation()
  const lp = useLocalizedPath()
  return (
    <section aria-labelledby="styles-title" className="pt-20 md:pt-28">
      <Container wide>
        <SectionHeading id="styles-title" title={t('home.styles.title')} subtitle={t('home.styles.subtitle')} />
        <ul className="no-scrollbar -mx-4 flex snap-x gap-4 overflow-x-auto px-4 pb-2 sm:-mx-6 sm:px-6 lg:mx-0 lg:grid lg:grid-cols-4 lg:overflow-visible lg:px-0">
          {STYLES.map((s, i) => (
            <Reveal as="li" key={s.key} delay={i * 0.08} className="w-[72%] shrink-0 snap-start sm:w-[44%] lg:w-auto">
              <Link to={lp(s.to)} className="group block">
                <Img
                  image={s.image}
                  alt={t(`home.styles.items.${s.key}.alt`)}
                  sizes="(min-width: 1024px) 25vw, 72vw"
                  className="aspect-[4/5] rounded-[var(--radius-card)]"
                  imgClassName="transition-transform duration-[1.2s] ease-[var(--ease-out-soft)] group-hover:scale-[1.05]"
                />
                <div className="mt-4 flex items-start justify-between gap-3">
                  <div>
                    <h3 className="text-base font-semibold">{t(`home.styles.items.${s.key}.title`)}</h3>
                    <p className="mt-1 text-[0.8125rem] leading-relaxed text-muted">{t(`home.styles.items.${s.key}.text`)}</p>
                  </div>
                  <span aria-hidden className="grid size-9 shrink-0 place-items-center rounded-full border border-line transition-colors duration-300 group-hover:border-ink group-hover:bg-ink group-hover:text-white">
                    <ArrowUpRight className="size-4" />
                  </span>
                </div>
              </Link>
            </Reveal>
          ))}
        </ul>
      </Container>
    </section>
  )
}
