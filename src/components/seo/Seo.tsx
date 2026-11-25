import { useTranslation } from 'react-i18next'
import { HOTEL, SITE_URL } from '@/data/hotel'
import { IMAGES, ogImagePath, type ImageKey } from '@/data/images'
import { DEFAULT_LANG, LANGUAGES, OG_LOCALES } from '@/i18n/config'
import { useLang } from '@/hooks/useLang'
import type { Crumb } from '@/components/ui/Breadcrumbs'

interface SeoProps {
  title: string
  description: string
  /** Til prefiksisiz yo'l: "/rooms" */
  path: string
  image?: ImageKey
  noindex?: boolean
  /** BreadcrumbList structured data uchun */
  breadcrumbs?: Crumb[]
  jsonLd?: Record<string, unknown> | Record<string, unknown>[]
}

/**
 * React 19 <title>, <meta>, <link> teglarini avtomatik <head> ga ko'taradi —
 * qo'shimcha kutubxona (react-helmet-async) kerak emas.
 */
export function Seo({ title, description, path, image = 'exterior', noindex, breadcrumbs, jsonLd }: SeoProps) {
  const lang = useLang()
  const { t } = useTranslation()
  const clean = path === '/' ? '/' : path.replace(/\/$/, '')
  const url = (l: string) => `${SITE_URL}/${l}${clean}`
  const canonical = url(lang)
  const ogRaw = ogImagePath(IMAGES[image])
  const ogImage = ogRaw.startsWith('/') ? `${SITE_URL}${ogRaw}` : ogRaw
  const fullTitle = title.includes(HOTEL.name) ? title : `${title} | ${HOTEL.name}`

  const crumbLd = breadcrumbs?.length
    ? {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: breadcrumbs.map((c, i) => ({
          '@type': 'ListItem',
          position: i + 1,
          name: c.label,
          item: c.to ? `${SITE_URL}${c.to}` : canonical,
        })),
      }
    : null

  const ld = [crumbLd, ...(Array.isArray(jsonLd) ? jsonLd : jsonLd ? [jsonLd] : [])].filter(Boolean)

  return (
    <>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={canonical} />
      {noindex && <meta name="robots" content="noindex, follow" />}
      {LANGUAGES.map((l) => (
        <link key={l} rel="alternate" hrefLang={l} href={url(l)} />
      ))}
      <link rel="alternate" hrefLang="x-default" href={url(DEFAULT_LANG)} />

      <meta property="og:type" content="website" />
      <meta property="og:site_name" content={HOTEL.name} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={canonical} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:image:alt" content={t(`images.${image}`)} />
      <meta property="og:locale" content={OG_LOCALES[lang]} />
      {LANGUAGES.filter((l) => l !== lang).map((l) => (
        <meta key={l} property="og:locale:alternate" content={OG_LOCALES[l]} />
      ))}

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />

      {ld.map((item, i) => (
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(item) }} />
      ))}
    </>
  )
}

/** Hotel structured data — faqat tasdiqlangan maydonlar */
export function hotelJsonLd(lang: string, description: string) {
  const ld: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Hotel',
    '@id': `${SITE_URL}/#hotel`,
    name: HOTEL.name,
    description,
    url: `${SITE_URL}/${lang}/`,
    image: `${SITE_URL}${ogImagePath(IMAGES.exterior)}`,
    address: {
      '@type': 'PostalAddress',
      streetAddress: HOTEL.address.street,
      addressLocality: HOTEL.address.city,
      addressRegion: HOTEL.address.region,
      postalCode: HOTEL.address.postalCode,
      addressCountry: HOTEL.address.country,
    },
    checkinTime: HOTEL.checkIn,
    checkoutTime: HOTEL.checkOut,
    numberOfRooms: HOTEL.roomCount,
    availableLanguage: ['uz', 'ru', 'en', 'tr'],
  }
  if (HOTEL.phone) ld.telephone = HOTEL.phone
  if (HOTEL.email) ld.email = HOTEL.email
  return ld
}
