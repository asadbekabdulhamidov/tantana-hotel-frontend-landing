import type { ReactNode } from 'react'
import { motion } from 'motion/react'
import type { ImageKey } from '@/data/images'
import { Breadcrumbs, type Crumb } from '@/components/ui/Breadcrumbs'
import { Container } from '@/components/ui/Container'
import { Img } from '@/components/ui/Img'

const ease = [0.22, 1, 0.36, 1] as const

/** Ichki sahifalar sarlavhasi: breadcrumb + katta sarlavha + ixtiyoriy keng rasm */
export function PageHeader({
  crumbs,
  eyebrow,
  title,
  subtitle,
  image,
  children,
}: {
  crumbs: Crumb[]
  eyebrow?: string
  title: string
  subtitle?: string
  image?: ImageKey
  children?: ReactNode
}) {
  return (
    <header className="pt-24 md:pt-28">
      <Container wide>
        <Breadcrumbs items={crumbs} />
        <div className="mt-8 grid gap-6 md:mt-10 md:grid-cols-12 md:items-end">
          <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease }} className="md:col-span-7">
            {eyebrow && <p className="eyebrow">{eyebrow}</p>}
            <h1 className="mt-3 text-[2.4rem] font-semibold leading-[1.05] tracking-[-0.03em] sm:text-5xl lg:text-[4rem]">{title}</h1>
          </motion.div>
          {subtitle && (
            <motion.p
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease, delay: 0.1 }}
              className="text-[0.98rem] leading-relaxed text-muted md:col-span-5 md:pb-2"
            >
              {subtitle}
            </motion.p>
          )}
        </div>
        {children}
      </Container>
      {image && (
        <div className="mt-10 px-3 sm:px-5 md:mt-14">
          <motion.div
            initial={{ clipPath: 'inset(6% 4% 0% 4% round 28px)' }}
            animate={{ clipPath: 'inset(0% 0% 0% 0% round 28px)' }}
            transition={{ duration: 1.2, ease }}
            className="overflow-hidden rounded-[var(--radius-hero)]"
          >
            <Img image={image} priority sizes="100vw" className="aspect-[16/10] md:aspect-[21/9]" />
          </motion.div>
        </div>
      )}
    </header>
  )
}
