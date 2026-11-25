import { Link } from 'react-router'
import { useTranslation } from 'react-i18next'
import { ArrowUpRight, Clock, Mail, MapPin } from 'lucide-react'
import { HOTEL, mapsLink } from '@/data/hotel'
import { useLocalizedPath } from '@/hooks/useLang'
import { Container } from '@/components/ui/Container'
import { LanguageSwitcher } from '@/components/ui/LanguageSwitcher'
import { Logo } from './Logo'
import { NAV_ITEMS } from './navItems'
import { PhoneLink } from './PhoneLink'

export function Footer() {
  const { t } = useTranslation()
  const lp = useLocalizedPath()
  const year = new Date().getFullYear()

  return (
    <footer className="mt-24 bg-ink text-white/80 md:mt-32">
      <Container wide className="py-14 md:py-20">
        <div className="grid gap-12 md:grid-cols-12">
          <div className="md:col-span-5">
            <Logo tone="light" />
            <p className="mt-5 max-w-sm text-[0.9375rem] leading-relaxed text-white/60">{t('footer.tagline')}</p>
          </div>

          <div className="md:col-span-3">
            <h2 className="text-xs font-semibold uppercase tracking-[0.16em] text-white/45">{t('footer.explore')}</h2>
            <ul className="mt-5 grid gap-3 text-[0.9375rem]">
              {NAV_ITEMS.map((item) => (
                <li key={item.key}>
                  <Link to={lp(item.path)} className="transition-colors hover:text-white">
                    {t(`nav.${item.key}`)}
                  </Link>
                </li>
              ))}
              <li>
                <Link to={lp('/booking')} className="transition-colors hover:text-white">
                  {t('nav.book')}
                </Link>
              </li>
            </ul>
          </div>

          <div className="md:col-span-4">
            <h2 className="text-xs font-semibold uppercase tracking-[0.16em] text-white/45">{t('footer.contact')}</h2>
            <address className="mt-5 grid gap-4 text-[0.9375rem] not-italic">
              <a href={mapsLink} target="_blank" rel="noopener noreferrer" className="group inline-flex items-start gap-3 transition-colors hover:text-white">
                <MapPin className="mt-0.5 size-4 shrink-0" aria-hidden strokeWidth={1.75} />
                <span>
                  {t('contact.addressValue')}
                  <ArrowUpRight className="ml-1 inline size-3.5 opacity-60 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden />
                  <span className="sr-only"> ({t('common.opensNewTab')})</span>
                </span>
              </a>
              <PhoneLink className="gap-3" />
              {HOTEL.email && (
                <a href={`mailto:${HOTEL.email}`} className="inline-flex items-center gap-3 transition-colors hover:text-white">
                  <Mail className="size-4" aria-hidden strokeWidth={1.75} />
                  {HOTEL.email}
                </a>
              )}
              <span className="inline-flex items-center gap-3">
                <Clock className="size-4" aria-hidden strokeWidth={1.75} />
                {t('footer.times', { checkIn: HOTEL.checkIn, checkOut: HOTEL.checkOut })}
              </span>
            </address>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-5 border-t border-white/10 pt-8 text-[0.8125rem] text-white/50 md:flex-row md:items-center md:justify-between">
          <p>
            © {year} {HOTEL.name}. {t('footer.rights')}
          </p>
          <p className="max-w-xl md:text-right">{t('footer.placeholderNote')}</p>
          <div className="[&_button]:text-white/80 [&_button:hover]:bg-white/10">
            <LanguageSwitcher tone="light" direction="up" />
          </div>
        </div>
      </Container>
    </footer>
  )
}
