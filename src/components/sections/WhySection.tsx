import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { AnimatePresence, motion } from 'motion/react'
import { ArrowRight } from 'lucide-react'
import type { ImageKey } from '@/data/images'
import { Container } from '@/components/ui/Container'
import { Img } from '@/components/ui/Img'
import { Reveal } from '@/components/ui/Reveal'
import { cn } from '@/utils/cn'

/* Faqat tasdiqlangan/ochiq e'lon qilingan faktlarga asoslangan sabablar */
const ITEMS: { key: string; image: ImageKey }[] = [
  { key: 'location', image: 'exteriorWide' },
  { key: 'rooms', image: 'roomDouble' },
  { key: 'breakfast', image: 'cafe' },
  { key: 'reception', image: 'reception' },
]

export function WhySection() {
  const { t } = useTranslation()
  const [active, setActive] = useState(0)

  return (
    <section aria-labelledby="why-title" className="pt-20 md:pt-28">
      <Container wide className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
        <div>
          <Reveal>
            <p className="eyebrow">{t('home.why.eyebrow')}</p>
            <h2 id="why-title" className="mt-3 text-[1.75rem] font-semibold leading-tight sm:text-4xl">
              {t('home.why.title')}
            </h2>
          </Reveal>
          <ul className="mt-8 flex flex-col">
            {ITEMS.map((item, i) => {
              const isActive = i === active
              return (
                <li key={item.key} className={cn('border-b border-line last:border-0', isActive && 'border-transparent')}>
                  <button
                    type="button"
                    aria-pressed={isActive}
                    onClick={() => setActive(i)}
                    onMouseEnter={() => setActive(i)}
                    className={cn('flex w-full items-start justify-between gap-4 rounded-2xl px-5 py-5 text-left transition-colors duration-300', isActive ? 'bg-accent' : 'hover:bg-surface')}
                  >
                    <span>
                      <span className="block text-[0.95rem] font-semibold text-ink">{t(`home.why.items.${item.key}.title`)}</span>
                      <span className="mt-1 block text-[0.8125rem] leading-relaxed text-muted">{t(`home.why.items.${item.key}.text`)}</span>
                    </span>
                    <span
                      aria-hidden
                      className={cn(
                        'mt-0.5 grid size-8 shrink-0 place-items-center rounded-full transition-all duration-300',
                        isActive ? 'bg-ink text-white' : 'bg-transparent text-subtle',
                      )}
                    >
                      <ArrowRight className={cn('size-4 transition-transform duration-300', !isActive && '-rotate-45')} />
                    </span>
                  </button>
                </li>
              )
            })}
          </ul>
        </div>
        <Reveal className="relative aspect-[4/3] overflow-hidden rounded-[var(--radius-hero)] lg:aspect-[5/4]">
          <AnimatePresence initial={false}>
            <motion.div
              key={active}
              initial={{ opacity: 0, scale: 1.04 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className="absolute inset-0"
            >
              <Img image={ITEMS[active].image} fill sizes="(min-width: 1024px) 50vw, 100vw" />
            </motion.div>
          </AnimatePresence>
        </Reveal>
      </Container>
    </section>
  )
}
