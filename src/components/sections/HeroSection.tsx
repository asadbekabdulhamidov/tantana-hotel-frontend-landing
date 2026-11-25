import { useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react'
import { MapPin } from 'lucide-react'
import { useLocalizedPath } from '@/hooks/useLang'
import { ButtonLink } from '@/components/ui/Button'
import { BookingSearch } from '@/components/booking/BookingSearch'
import { HeroIndicators, useHeroSlider } from './HeroSlider'

const ease = [0.22, 1, 0.36, 1] as const

export function HeroSection() {
  const { t } = useTranslation()
  const lp = useLocalizedPath()
  const ref = useRef<HTMLElement>(null)
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], ['0%', reduce ? '0%' : '12%'])
  const { layer, ...slider } = useHeroSlider()

  return (
    <section ref={ref} aria-labelledby="hero-title" className="relative px-3 pt-3 sm:px-5 sm:pt-5">
      <div className="relative isolate h-[calc(100svh-1.5rem)] max-h-[940px] min-h-[600px] overflow-hidden rounded-[var(--radius-hero)] bg-ink sm:h-[calc(100svh-2.5rem)]">
        {/* Rasm: yengil "reveal" + scroll'da sekin parallaks (faqat transform) */}
        {/* Fon: sekin almashadigan suratlar + scroll'da yengil parallaks (faqat transform) */}
        <motion.div
          className="absolute inset-0 -z-10"
          style={{ y }}
          initial={{ opacity: 0.6 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2, ease }}
        >
          {layer}
        </motion.div>
        <div aria-hidden className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_center,rgb(0_0_0/0.42),rgb(0_0_0/0.18)_75%)]" />
        <div aria-hidden className="absolute inset-x-0 top-0 -z-10 h-40 bg-gradient-to-b from-black/40 to-transparent" />
        <div aria-hidden className="absolute inset-x-0 bottom-0 -z-10 h-64 bg-gradient-to-t from-black/50 to-transparent" />

        <div className="flex h-full flex-col items-center justify-center px-5 pb-28 pt-24 text-center text-white md:pb-24">
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease, delay: 0.2 }}
            className="glass inline-flex items-center gap-1.5 rounded-full border border-white/20 px-3.5 py-1.5 text-xs font-semibold tracking-wide"
          >
            <MapPin className="size-3.5" aria-hidden />
            {t('hero.eyebrow')}
          </motion.p>
          <motion.h1
            id="hero-title"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease, delay: 0.3 }}
            className="mt-6 max-w-4xl text-[2.6rem] font-semibold leading-[1.04] tracking-[-0.03em] text-white sm:text-6xl lg:text-[4.75rem]"
          >
            {t('hero.title')}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease, delay: 0.45 }}
            className="mt-5 max-w-xl text-[0.98rem] leading-relaxed text-white/85 sm:text-lg"
          >
            {t('hero.subtitle')}
          </motion.p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            {[
              <ButtonLink key="b" to={lp('/booking')} variant="light" size="lg" arrow>
                {t('hero.ctaPrimary')}
              </ButtonLink>,
              <ButtonLink key="r" to={lp('/rooms')} variant="ghost" size="lg">
                {t('hero.ctaSecondary')}
              </ButtonLink>,
            ].map((btn, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease, delay: 0.6 + i * 0.1 }}>
                {btn}
              </motion.div>
            ))}
          </div>
        </div>

        {/* Slayd indikatorlari */}
        <div className="absolute bottom-20 left-1/2 -translate-x-1/2 md:bottom-[4.5rem] lg:bottom-8 lg:left-8 lg:translate-x-0">
          <HeroIndicators {...slider} />
        </div>

        {/* Scroll indikatori */}
        <a
          href="#after-hero"
          className="absolute bottom-8 right-8 hidden flex-col items-center gap-3 text-[0.6875rem] font-semibold uppercase tracking-[0.2em] text-white/80 transition-colors hover:text-white lg:flex"
        >
          <span className="[writing-mode:vertical-rl]">{t('hero.scroll')}</span>
          <span aria-hidden className="relative h-12 w-px overflow-hidden bg-white/30">
            <motion.span
              className="absolute inset-x-0 top-0 h-4 bg-white"
              animate={{ y: [-16, 48] }}
              transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
            />
          </span>
        </a>
      </div>

      {/* Qidiruv paneli: desktop'da hero chetiga "suzib" turadi */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease, delay: 0.5 }}
        className="relative z-10 mx-auto -mt-16 max-w-[1040px] px-2 sm:px-6 md:-mt-[3.25rem]"
      >
        <BookingSearch variant="hero" />
        <p className="mt-3 text-center text-xs text-muted">{t('search.demoNote')}</p>
      </motion.div>
      <span id="after-hero" />
    </section>
  )
}
