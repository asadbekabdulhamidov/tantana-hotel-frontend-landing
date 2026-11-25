import type { ElementType, ReactNode } from 'react'
import { cn } from '@/utils/cn'

export function Container({
  as: Tag = 'div',
  className,
  children,
  wide,
}: {
  as?: ElementType
  className?: string
  children: ReactNode
  wide?: boolean
}) {
  return <Tag className={cn('mx-auto w-full px-4 sm:px-6 lg:px-8', wide ? 'max-w-[1440px]' : 'max-w-[1240px]', className)}>{children}</Tag>
}
