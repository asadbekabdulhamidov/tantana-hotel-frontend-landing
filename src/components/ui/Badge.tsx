import type { ReactNode } from 'react'
import { cn } from '@/utils/cn'

export function Badge({ children, tone = 'neutral', className }: { children: ReactNode; tone?: 'neutral' | 'accent' | 'glass' | 'warn'; className?: string }) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[0.6875rem] font-semibold leading-none tracking-wide',
        tone === 'neutral' && 'bg-surface text-muted',
        tone === 'accent' && 'bg-accent text-accent-ink',
        tone === 'glass' && 'glass-light text-ink',
        tone === 'warn' && 'bg-[#fff4e0] text-[#8a5300]',
        className,
      )}
    >
      {children}
    </span>
  )
}
