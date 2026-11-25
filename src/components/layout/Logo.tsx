import { Link } from 'react-router'
import { useTranslation } from 'react-i18next'
import { useLocalizedPath } from '@/hooks/useLang'
import { cn } from '@/utils/cn'

/**
 * Matnli logotip. Mehmonxonaning rasmiy logotipi (SVG) tayyor bo'lsa,
 * shu komponent ichida almashtiring.
 */
export function Logo({ tone = 'dark', className, onClick }: { tone?: 'dark' | 'light'; className?: string; onClick?: () => void }) {
  const lp = useLocalizedPath()
  const { t } = useTranslation()
  return (
    <Link
      to={lp('/')}
      onClick={onClick}
      aria-label={t('nav.logoLabel')}
      className={cn('flex items-baseline gap-2 leading-none transition-colors', tone === 'light' ? 'text-white' : 'text-ink', className)}
    >
      <span className="font-serif text-[1.75rem] font-semibold tracking-[-0.01em]">Tantana</span>
      <span className={cn('text-[0.625rem] font-semibold uppercase tracking-[0.28em]', tone === 'light' ? 'text-white/75' : 'text-muted')}>Hotel</span>
    </Link>
  )
}
