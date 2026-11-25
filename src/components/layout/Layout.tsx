import { Suspense, useEffect } from 'react'
import { Outlet, ScrollRestoration, useLocation, useParams } from 'react-router'
import { useTranslation } from 'react-i18next'
import { motion } from 'motion/react'
import { isLang } from '@/i18n/config'
import { Header } from './Header'
import { Footer } from './Footer'
import { MobileBookingBar } from './MobileBookingBar'

function PageFallback() {
  return (
    <div className="grid min-h-[70vh] place-items-center" aria-busy="true">
      <span className="size-8 animate-spin rounded-full border-2 border-line border-t-ink motion-reduce:animate-none" />
    </div>
  )
}

export function Layout() {
  const { t } = useTranslation()
  const { pathname } = useLocation()
  const { lang } = useParams()
  const rest = pathname.replace(/^\/[a-z]{2}/, '')
  const isHome = rest === '' || rest === '/'
  const isBooking = rest.startsWith('/booking')

  // Fokusni yangi sahifaga o'tkazish (screen reader uchun)
  useEffect(() => {
    document.getElementById('main')?.focus({ preventScroll: true })
  }, [pathname])

  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-full focus:bg-ink focus:px-5 focus:py-3 focus:text-sm focus:font-semibold focus:text-white"
      >
        {t('nav.skipToContent')}
      </a>
      <Header overHero={isHome} />
      <main id="main" tabIndex={-1} className="outline-none" lang={isLang(lang) ? lang : undefined}>
        <Suspense fallback={<PageFallback />}>
          <motion.div key={pathname} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.45, ease: 'easeOut' }}>
            <Outlet />
          </motion.div>
        </Suspense>
      </main>
      <Footer />
      {!isBooking && <MobileBookingBar />}
      <ScrollRestoration />
    </>
  )
}
