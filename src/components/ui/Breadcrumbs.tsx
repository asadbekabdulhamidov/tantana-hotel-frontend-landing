import { Link } from 'react-router'
import { ChevronRight } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { cn } from '@/utils/cn'

export interface Crumb {
  label: string
  to?: string
}

export function Breadcrumbs({ items, className }: { items: Crumb[]; className?: string }) {
  const { t } = useTranslation()
  return (
    <nav aria-label={t('common.breadcrumbs')} className={className}>
      <ol className="flex flex-wrap items-center gap-1.5 text-[0.8125rem] text-muted">
        {items.map((c, i) => (
          <li key={i} className="flex items-center gap-1.5">
            {i > 0 && <ChevronRight className="size-3.5 text-subtle" aria-hidden />}
            {c.to ? (
              <Link to={c.to} className="transition-colors hover:text-ink">
                {c.label}
              </Link>
            ) : (
              <span aria-current="page" className={cn('font-medium text-ink')}>
                {c.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  )
}
