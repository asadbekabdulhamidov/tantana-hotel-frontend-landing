import { useTranslation } from 'react-i18next'
import { useLocalizedPath } from '@/hooks/useLang'
import { ButtonLink } from '@/components/ui/Button'
import { Img } from '@/components/ui/Img'
import { Reveal } from '@/components/ui/Reveal'
import type { ImageKey } from '@/data/images'

export function CtaBanner({ image = 'exteriorNight' }: { image?: ImageKey }) {
  const { t } = useTranslation()
  const lp = useLocalizedPath()
  return (
    <section aria-labelledby="cta-title" className="px-3 pt-20 sm:px-5 md:pt-28">
      <Reveal className="relative isolate overflow-hidden rounded-[var(--radius-hero)]">
        <Img image={image} fill sizes="100vw" className="-z-10" />
        <div aria-hidden className="absolute inset-0 -z-10 bg-black/45" />
        <div className="mx-auto flex max-w-2xl flex-col items-center px-6 py-20 text-center text-white md:py-28">
          <h2 id="cta-title" className="text-[2rem] font-semibold leading-tight text-white sm:text-5xl">
            {t('home.cta.title')}
          </h2>
          <p className="mt-4 text-[0.98rem] leading-relaxed text-white/85">{t('home.cta.subtitle')}</p>
          <ButtonLink to={lp('/booking')} variant="light" size="lg" arrow className="mt-8">
            {t('home.cta.button')}
          </ButtonLink>
        </div>
      </Reveal>
    </section>
  )
}
