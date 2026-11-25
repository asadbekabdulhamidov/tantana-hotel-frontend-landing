import { useTranslation } from 'react-i18next'
import { motion } from 'motion/react'
import { Info } from 'lucide-react'
import type { Experience } from '@/data/experiences'
import { Img } from '@/components/ui/Img'
import { Reveal } from '@/components/ui/Reveal'
import { cn } from '@/utils/cn'

/** Experiences sahifasi uchun qayta ishlatiladigan editorial blok */
export function ExperienceRow({ item, index }: { item: Experience; index: number }) {
  const { t } = useTranslation()
  const reversed = index % 2 === 1
  const base = `experiences.items.${item.key}`
  const points = t(`${base}.points`, { returnObjects: true }) as string[]

  return (
    <article id={item.key} aria-labelledby={`${item.key}-title`} className="scroll-mt-28 grid items-center gap-8 md:grid-cols-12 md:gap-14">
      {/* Clip-path "mask" reveal */}
      <motion.div
        initial={{ clipPath: 'inset(8% 8% 8% 8% round 28px)', opacity: 0.4 }}
        whileInView={{ clipPath: 'inset(0% 0% 0% 0% round 28px)', opacity: 1 }}
        viewport={{ once: true, margin: '0px 0px -15% 0px' }}
        transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
        className={cn('md:col-span-7', reversed && 'md:order-2')}
      >
        <Img image={item.image} sizes="(min-width: 1024px) 700px, (min-width: 768px) 58vw, 100vw" className="aspect-[4/3] rounded-[var(--radius-hero)]" />
      </motion.div>
      <Reveal className={cn('md:col-span-5', reversed && 'md:order-1')}>
        <p className="eyebrow">{String(index + 1).padStart(2, '0')} — {t(`${base}.tag`)}</p>
        <h2 id={`${item.key}-title`} className="mt-3 text-[1.75rem] font-semibold leading-tight sm:text-4xl">
          {t(`${base}.title`)}
        </h2>
        <p className="mt-4 text-[0.98rem] leading-relaxed text-muted">{t(`${base}.text`)}</p>
        {Array.isArray(points) && points.length > 0 && (
          <ul className="mt-6 grid gap-2.5">
            {points.map((p) => (
              <li key={p} className="flex items-start gap-3 text-[0.9rem] text-ink-soft">
                <span aria-hidden className="mt-2 size-1.5 shrink-0 rounded-full bg-ink" />
                {p}
              </li>
            ))}
          </ul>
        )}
        {item.source === 'listing' && (
          <p className="mt-6 inline-flex items-center gap-1.5 rounded-full bg-[#fffaf0] px-3 py-1.5 text-[0.6875rem] font-medium text-[#8a5300]">
            <Info className="size-3.5" aria-hidden />
            {t('experiences.toConfirm')}
          </p>
        )}
      </Reveal>
    </article>
  )
}
