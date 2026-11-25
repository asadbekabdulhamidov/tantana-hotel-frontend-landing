import { lazy, useEffect } from 'react'
import { createBrowserRouter, Navigate, Outlet, RouterProvider, useLocation, useParams } from 'react-router'
import { MotionConfig } from 'motion/react'
import { detectInitialLang, isLang, storeLang } from '@/i18n/config'
import { setLanguage } from '@/i18n'
import { Layout } from '@/components/layout/Layout'
import HomePage from '@/pages/HomePage'

/* Bosh sahifa (LCP) darhol yuklanadi, qolganlari — talab bo'yicha (code splitting) */
const RoomsPage = lazy(() => import('@/pages/RoomsPage'))
const RoomDetailsPage = lazy(() => import('@/pages/RoomDetailsPage'))
const ExperiencesPage = lazy(() => import('@/pages/ExperiencesPage'))
const AboutPage = lazy(() => import('@/pages/AboutPage'))
const DiscoverPage = lazy(() => import('@/pages/DiscoverPage'))
const ContactPage = lazy(() => import('@/pages/ContactPage'))
const BookingPage = lazy(() => import('@/pages/BookingPage'))
const ConfirmationPage = lazy(() => import('@/pages/ConfirmationPage'))
const NotFoundPage = lazy(() => import('@/pages/NotFoundPage'))

/** "/" yoki tilsiz yo'l → "/<til>/..." */
function LangRedirect() {
  const { pathname, search, hash } = useLocation()
  const lang = detectInitialLang()
  const rest = pathname === '/' ? '/' : pathname
  return <Navigate to={`/${lang}${rest}${search}${hash}`} replace />
}

/** URL'dagi til → i18n, <html lang>, localStorage */
function LangRoot() {
  const { lang } = useParams()
  const valid = isLang(lang)

  useEffect(() => {
    if (!valid) return
    document.documentElement.lang = lang
    storeLang(lang)
    void setLanguage(lang)
  }, [lang, valid])

  if (!valid) return <LangRedirect />
  return <Outlet />
}

const router = createBrowserRouter([
  { path: '/', element: <LangRedirect /> },
  {
    path: '/:lang',
    element: <LangRoot />,
    children: [
      {
        element: <Layout />,
        children: [
          { index: true, element: <HomePage /> },
          { path: 'rooms', element: <RoomsPage /> },
          { path: 'rooms/:slug', element: <RoomDetailsPage /> },
          { path: 'experiences', element: <ExperiencesPage /> },
          { path: 'about', element: <AboutPage /> },
          { path: 'discover', element: <DiscoverPage /> },
          { path: 'contact', element: <ContactPage /> },
          { path: 'booking', element: <BookingPage /> },
          { path: 'booking/confirmation', element: <ConfirmationPage /> },
          { path: '*', element: <NotFoundPage /> },
        ],
      },
    ],
  },
  { path: '*', element: <LangRedirect /> },
])

export default function App() {
  return (
    <MotionConfig reducedMotion="user">
      <RouterProvider router={router} />
    </MotionConfig>
  )
}
