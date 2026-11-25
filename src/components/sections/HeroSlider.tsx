import { useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { motion, useReducedMotion } from 'motion/react'
import { Pause, Play } from 'lucide-react'
import type { ImageKey } from '@/data/images'
import { Img } from '@/components/ui/Img'
import { cn } from '@/utils/cn'

/** Hero fon suratlari — birinchisi LCP, qolganlari sahifa yuklangach yuklanadi */
export const HERO_SLIDES: ImageKey[] = ['exterior', 'lobby', 'roomDouble', 'exteriorNight']
const DURATION = 6500

/**
 * Sekin "crossfade" + Ken Burns. Faqat opacity/transform animatsiya qilinadi.
 * - prefers-reduced-motion: avtomatik almashish va zoom o'chadi
 * - Tab yashirin bo'lsa to'xtaydi; pauza tugmasi (WCAG 2.2.2)
 */
export function useHeroSlider() {
  const reduce = useReducedMotion()
  const [index, setIndex] = useState(0)
  const [ready, setReady] = useState(false)
  const [paused, setPaused] = useState(false)
  const [visible, setVisible] = useState(true)

  // Qolgan suratlarni faqat sahifa to'liq yuklangandan keyin olamiz — LCP'ga ta'sir qilmaydi
  useEffect(() => {
    const go = () => window.setTimeout(() => setReady(true), 1200)
    if (document.readyState === 'complete') {
      const id = go()
      return () => clearTimeout(id)
    }
    let id = 0
    const onLoad = () => (id = go())
    window.addEventListener('load', onLoad, { once: true })
    return () => {
      window.removeEventListener('load', onLoad)
      clearTimeout(id)
    }
  }, [])

  useEffect(() => {
    const onVis = () => setVisible(document.visibilityState === 'visible')
    document.addEventListener('visibilitychange', onVis)
    return () => document.removeEventListener('visibilitychange', onVis)
  }, [])

  const running = ready && !paused && visible && !reduce

  useEffect(() => {
    if (!running) return
    const id = window.setTimeout(() => setIndex((i) => (i + 1) % HERO_SLIDES.length), DURATION)
    return () => clearTimeout(id)
  }, [running, index])

  return {
    index,
    setIndex,
    paused,
    setPaused,
    running,
    canAnimate: !reduce,
    layer: (
      <div className="absolute inset-0">
        {HERO_SLIDES.map((img, i) => {
          if (i > 0 && !ready) return null
          const active = i === index
          return (
            <motion.div
              key={img}
              className="absolute inset-0"
              initial={false}
              animate={{ opacity: active ? 1 : 0 }}
              transition={{ duration: reduce ? 0 : 1.4, ease: [0.4, 0, 0.2, 1] }}
              aria-hidden={!active}
            >
              <motion.div
                className="absolute inset-0"
                initial={false}
                animate={{ scale: active && !reduce ? 1 : 1.08 }}
                transition={{ duration: active ? (DURATION + 1400) / 1000 : 0, ease: 'linear' }}
              >
                <Img image={img} priority={i === 0} fill sizes="100vw" />
              </motion.div>
            </motion.div>
          )
        })}
      </div>
    ),
  }
}

export function HeroIndicators({
  index,
  setIndex,
  paused,
  setPaused,
  running,
  canAnimate,
}: Omit<ReturnType<typeof useHeroSlider>, 'layer'>) {
  const { t } = useTranslation()
  const goTo = useCallback((i: number) => setIndex(i), [setIndex])

  return (
    <div className="flex items-center gap-3">
      <ul className="flex items-center gap-2" aria-label={t('hero.slidesLabel')}>
        {HERO_SLIDES.map((img, i) => {
          const active = i === index
          return (
            <li key={img}>
              <button
                type="button"
                onClick={() => goTo(i)}
                aria-label={t('hero.goToSlide', { current: i + 1, total: HERO_SLIDES.length, name: t(`images.${img}`) })}
                aria-current={active ? 'true' : undefined}
                className="group relative flex h-8 items-center"
              >
                <span className={cn('relative block h-[3px] overflow-hidden rounded-full bg-white/35 transition-[width] duration-500', active ? 'w-10' : 'w-5 group-hover:bg-white/60')}>
                  {active && (
                    <motion.span
                      key={`${index}-${running}`}
                      className="absolute inset-y-0 left-0 bg-white"
                      initial={{ width: running ? '0%' : '100%' }}
                      animate={{ width: '100%' }}
                      transition={{ duration: running ? DURATION / 1000 : 0, ease: 'linear' }}
                    />
                  )}
                </span>
              </button>
            </li>
          )
        })}
      </ul>
      {canAnimate && (
        <button
          type="button"
          onClick={() => setPaused(!paused)}
          aria-label={paused ? t('hero.play') : t('hero.pause')}
          className="grid size-8 place-items-center rounded-full text-white/80 transition-colors hover:bg-white/15 hover:text-white"
        >
          {paused ? <Play className="size-3.5" aria-hidden /> : <Pause className="size-3.5" aria-hidden />}
        </button>
      )}
    </div>
  )
}
