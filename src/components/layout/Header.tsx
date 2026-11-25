import { useEffect, useState } from 'react'
import { NavLink } from 'react-router'
import { useTranslation } from 'react-i18next'
import { Menu } from 'lucide-react'
import { useLocalizedPath } from '@/hooks/useLang'
import { useScrolled } from '@/hooks/useScrolled'
import { useBookingParams } from '@/hooks/useBookingParams'
import { bookingQuery } from '@/utils/booking'
import { ButtonLink } from '@/components/ui/Button'
import { LanguageSwitcher } from '@/components/ui/LanguageSwitcher'
import { cn } from '@/utils/cn'
import { Logo } from './Logo'
import { MobileMenu } from './MobileMenu'
import { NAV_ITEMS } from './navItems'
import { PhoneLink } from './PhoneLink'

export function Header({ overHero }: { overHero: boolean }) {
  const { t } = useTranslation()
  const lp = useLocalizedPath()
  const scrolled = useScrolled(40)
  const [menuOpen, setMenuOpen] = useState(false)
  const booking = useBookingParams()
  const transparent = overHero && !scrolled && !menuOpen

  // Sahifa o'zgarganda menyu yopiladi
  useEffect(() => setMenuOpen(false), [overHero])

  const bookHref = lp('/booking') + (booking.valid ? bookingQuery(booking) : '')

  return (
    <>
      <header
        className={cn(
          'fixed inset-x-0 top-0 z-40 transition-[padding,background-color,box-shadow,border-color] duration-500 ease-[var(--ease-out-soft)]',
          transparent ? 'px-3 pt-3 sm:px-5 sm:pt-5' : 'border-b border-line bg-white/90 px-0 pt-0 backdrop-blur-md',
        )}
      >
        <div
          className={cn(
            'mx-auto flex h-16 items-center justify-between gap-4 transition-[max-width,padding,border-radius,background-color] duration-500 ease-[var(--ease-out-soft)]',
            transparent
              ? 'max-w-[1400px] rounded-full border border-white/15 bg-black/20 pl-5 pr-2 backdrop-blur-md sm:pl-7'
              : 'max-w-[1440px] px-4 sm:px-6 lg:px-8',
          )}
        >
          <Logo tone={transparent ? 'light' : 'dark'} />

          <nav aria-label={t('nav.mainNav')} className="hidden lg:block">
            <ul className="flex items-center gap-1">
              {NAV_ITEMS.map((item) => (
                <li key={item.key}>
                  <NavLink
                    to={lp(item.path)}
                    className={({ isActive }) =>
                      cn(
                        'relative inline-flex h-10 items-center px-3.5 text-[0.8125rem] font-medium transition-colors',
                        'after:absolute after:inset-x-3.5 after:bottom-1.5 after:h-px after:origin-left after:scale-x-0 after:transition-transform after:duration-300 hover:after:scale-x-100',
                        transparent ? 'text-white/85 after:bg-white hover:text-white' : 'text-muted after:bg-ink hover:text-ink',
                        isActive && (transparent ? 'text-white after:scale-x-100' : 'text-ink after:scale-x-100'),
                      )
                    }
                  >
                    {t(`nav.${item.key}`)}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex items-center gap-1 sm:gap-2">
            <div className="mr-2 hidden xl:block">
              <PhoneLink className={cn('text-[0.8125rem] font-medium', transparent ? 'text-white/85' : 'text-muted')} />
            </div>
            <div className="hidden sm:block">
              <LanguageSwitcher tone={transparent ? 'light' : 'dark'} />
            </div>
            <div className="hidden sm:block">
              <ButtonLink to={bookHref} size="sm" variant={transparent ? 'light' : 'primary'}>
                {t('nav.book')}
              </ButtonLink>
            </div>
            <button
              type="button"
              onClick={() => setMenuOpen(true)}
              aria-label={t('nav.openMenu')}
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              className={cn(
                'grid size-11 place-items-center rounded-full transition-colors lg:hidden',
                transparent ? 'bg-white text-ink' : 'bg-ink text-white',
              )}
            >
              <Menu className="size-5" aria-hidden />
            </button>
          </div>
        </div>
      </header>
      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} bookHref={bookHref} />
    </>
  )
}
