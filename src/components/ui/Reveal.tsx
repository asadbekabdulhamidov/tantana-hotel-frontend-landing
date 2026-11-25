import { motion, type HTMLMotionProps } from 'motion/react'
import type { ReactNode } from 'react'

/**
 * Scroll'da paydo bo'lish: faqat opacity + transform (arzon xususiyatlar).
 * prefers-reduced-motion — App darajasidagi <MotionConfig reducedMotion="user"> orqali.
 */
export function Reveal({
  children,
  delay = 0,
  y = 22,
  className,
  as = 'div',
  ...rest
}: { children: ReactNode; delay?: number; y?: number; className?: string; as?: 'div' | 'li' | 'section' | 'article' } & Omit<
  HTMLMotionProps<'div'>,
  'children'
>) {
  const Comp = motion[as] as typeof motion.div
  return (
    <Comp
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '0px 0px -12% 0px' }}
      transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1], delay }}
      className={className}
      {...rest}
    >
      {children}
    </Comp>
  )
}
