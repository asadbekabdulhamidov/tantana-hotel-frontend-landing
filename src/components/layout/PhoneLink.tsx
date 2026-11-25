import { Phone } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { HOTEL, PHONE_PLACEHOLDER } from '@/data/hotel'
import { cn } from '@/utils/cn'

/** Telefon tasdiqlanmagan bo'lsa — bosib bo'lmaydigan placeholder ko'rsatiladi */
export function PhoneLink({ className, iconClassName }: { className?: string; iconClassName?: string }) {
  const { t } = useTranslation()
  if (HOTEL.phone) {
    return (
      <a href={`tel:${HOTEL.phone}`} className={cn('inline-flex items-center gap-2', className)} aria-label={t('nav.phoneLabel', { phone: HOTEL.phoneDisplay ?? HOTEL.phone })}>
        <Phone className={cn('size-4', iconClassName)} aria-hidden strokeWidth={1.75} />
        {HOTEL.phoneDisplay ?? HOTEL.phone}
      </a>
    )
  }
  return (
    <span className={cn('inline-flex items-center gap-2', className)} title={t('common.toBeConfirmed')}>
      <Phone className={cn('size-4', iconClassName)} aria-hidden strokeWidth={1.75} />
      <span aria-hidden>{PHONE_PLACEHOLDER}</span>
      <span className="sr-only">{t('contact.phoneMissing')}</span>
    </span>
  )
}
