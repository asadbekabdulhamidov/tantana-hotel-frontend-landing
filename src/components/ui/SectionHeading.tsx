import type { ReactNode } from 'react'
import { cn } from '@/utils/cn'
import { Reveal } from './Reveal'

export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  align = 'center',
  as: Tag = 'h2',
  action,
  className,
  id,
}: {
  eyebrow?: string
  title: string
  subtitle?: string
  align?: 'center' | 'left'
  as?: 'h1' | 'h2'
  action?: ReactNode
  className?: string
  id?: string
}) {
  const center = align === 'center'
  return (
    <Reveal
      className={cn(
        'mb-10 flex flex-col gap-3 md:mb-12',
        center ? 'items-center text-center' : 'md:flex-row md:items-end md:justify-between',
        className,
      )}
    >
      <div className={cn('flex flex-col gap-3', center && 'items-center')}>
        {eyebrow && <p className="eyebrow">{eyebrow}</p>}
        <Tag
          id={id}
          className={cn(
            'font-semibold',
            Tag === 'h1' ? 'text-[2.25rem] leading-[1.08] sm:text-5xl lg:text-[3.5rem]' : 'text-[1.75rem] leading-tight sm:text-4xl',
          )}
        >
          {title}
        </Tag>
        {subtitle && <p className={cn('max-w-xl text-[0.95rem] leading-relaxed text-muted', center && 'mx-auto')}>{subtitle}</p>}
      </div>
      {action && <div className={cn(center ? 'mt-2' : 'shrink-0')}>{action}</div>}
    </Reveal>
  )
}
