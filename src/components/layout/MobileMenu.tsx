import { useEffect, useRef } from 'react'
import { NavLink } from 'react-router'
import { useTranslation } from 'react-i18next'
import { AnimatePresence, motion } from 'motion/react'
import { ArrowUpRight, X } from 'lucide-react'
import { useLocalizedPath } from '@/hooks/useLang'
import { ButtonLink } from '@/components/ui/Button'
import { LanguageSwitcher } from '@/components/ui/LanguageSwitcher'
import { cn } from '@/utils/cn'
import { Logo } from './Logo'
import { NAV_ITEMS } from './navItems'
import { PhoneLink } from './PhoneLink'

export function MobileMenu({ open, onClose, bookHref }: { open: boolean; onClose: () => void; bookHref: string }) {
  const { t } = useTranslation()
  const lp = useLocalizedPath()
  const panelRef = useRef<HTMLDivElement>(null)

  // Scroll lock, Esc, fokus tuzog'i
  useEffect(() => {
    if (!open) return
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const prevFocus = document.activeElement as HTMLElement | null
    requestAnimationFrame(() => panelRef.current?.querySelector<HTMLElement>('button, a')?.focus())

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'Tab' && panelRef.current) {
        const els = panelRef.current.querySelectorAll<HTMLElement>('a[href], button:not([disabled])')
        const list = Array.from(els).filter((el) => el.offsetParent !== null)
        if (!list.length) return
        const first = list[0]
        const last = list[list.length - 1]
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault()
          last.focus()
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault()
          first.focus()
        }
      }
    }
    document.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = prevOverflow
      document.removeEventListener('keydown', onKey)
      prevFocus?.focus?.()
    }
  }, [open, onClose])

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          id="mobile-menu"
          ref={panelRef}
          role="dialog"
          aria-modal="true"
          aria-label={t('nav.menu')}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="fixed inset-0 z-50 flex flex-col bg-white lg:hidden"
        >
          <div className="flex h-16 items-center justify-between px-4 sm:px-6">
            <Logo onClick={onClose} />
            <button type="button" onClick={onClose} aria-label={t('nav.closeMenu')} className="grid size-11 place-items-center rounded-full bg-surface text-ink">
              <X className="size-5" aria-hidden />
            </button>
          </div>

          <nav aria-label={t('nav.mainNav')} className="flex-1 overflow-y-auto px-4 pt-6 sm:px-6">
            <ul className="flex flex-col">
              {[{ key: 'home', path: '/' } as const, ...NAV_ITEMS].map((item, i) => (
                <motion.li
                  key={item.key}
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.04 * i + 0.05, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                  className="border-b border-line"
                >
                  <NavLink
                    to={lp(item.path)}
                    end={item.path === '/'}
                    onClick={onClose}
                    className={({ isActive }) =>
                      cn('flex items-center justify-between py-4 text-2xl font-semibold tracking-tight', isActive ? 'text-ink' : 'text-ink/70')
                    }
                  >
                    {t(`nav.${item.key}`)}
                    <ArrowUpRight className="size-5 text-subtle" aria-hidden />
                  </NavLink>
                </motion.li>
              ))}
            </ul>
          </nav>

          <div className="flex flex-col gap-4 border-t border-line px-4 pb-[max(1.25rem,env(safe-area-inset-bottom))] pt-5 sm:px-6">
            <div className="flex items-center justify-between">
              <PhoneLink className="text-sm font-medium text-muted" />
              <LanguageSwitcher align="right" direction="up" />
            </div>
            <ButtonLink to={bookHref} onClick={onClose} size="lg" block arrow>
              {t('nav.book')}
            </ButtonLink>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
