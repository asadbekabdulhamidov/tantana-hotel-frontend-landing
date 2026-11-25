import { Link } from 'react-router'
import { useTranslation } from 'react-i18next'
import { ArrowUpRight, MapPin } from 'lucide-react'
import { DESTINATIONS } from '@/data/destinations'
import { useLocalizedPath } from '@/hooks/useLang'
import { ButtonLink } from '@/components/ui/Button'
import { Container } from '@/components/ui/Container'
import { Img } from '@/components/ui/Img'
import { Reveal } from '@/components/ui/Reveal'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { cn } from '@/utils/cn'

/** Bosh sahifadagi qisqa ko'rinish — 3 ta yo'nalish, mozaika */
export function DiscoverFergana() {
  const { t } = useTranslation()
  const lp = useLocalizedPath()
  const picks = DESTINATIONS.slice(0, 3)

  return (
    <section aria-labelledby="discover-title" className="pt-20 md:pt-28">
      <Container wide>
        <SectionHeading
          id="discover-title"
          align="left"
          eyebrow={t('home.discover.eyebrow')}
          title={t('home.discover.title')}
          subtitle={t('home.discover.subtitle')}
          action={
            <ButtonLink to={lp('/discover')} variant="secondary" arrow>
              {t('home.discover.cta')}
            </ButtonLink>
          }
        />
        <ul className="grid gap-4 md:grid-cols-2 md:grid-rows-2">
          {picks.map((d, i) => (
            <Reveal as="li" key={d.key} delay={i * 0.08} className={cn(i === 0 && 'md:row-span-2')}>
              <Link to={lp(`/discover#${d.key}`)} className="group relative block h-full overflow-hidden rounded-[var(--radius-card)]">
                <Img
                  image={d.image}
                  alt={t(`discover.items.${d.key}.alt`)}
                  sizes="(min-width: 768px) 50vw, 100vw"
                  className={cn('h-full', i === 0 ? 'aspect-[4/5] md:aspect-auto md:min-h-[560px]' : 'aspect-[16/10]')}
                  imgClassName="transition-transform duration-[1.2s] ease-[var(--ease-out-soft)] group-hover:scale-[1.05]"
                />
                <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/5 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-5 text-white sm:p-6">
                  <div>
                    <p className="inline-flex items-center gap-1 text-xs font-medium text-white/80">
                      <MapPin className="size-3.5" aria-hidden />
                      {t(`discover.items.${d.key}.place`)}
                    </p>
                    <h3 className="mt-1.5 text-xl font-semibold text-white sm:text-2xl">{t(`discover.items.${d.key}.name`)}</h3>
                  </div>
                  <span aria-hidden className="grid size-10 shrink-0 place-items-center rounded-full bg-white text-ink transition-transform duration-300 group-hover:rotate-45">
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
