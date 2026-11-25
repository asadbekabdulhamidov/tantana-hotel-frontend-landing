import { useTranslation } from 'react-i18next'
import { CURRENCY, type Room } from '@/data/rooms'
import { useLang } from '@/hooks/useLang'
import { formatPrice } from '@/utils/date'
import { cn } from '@/utils/cn'

/** Narx har doim "namuna" belgisi bilan — haqiqiy narx tasdiqlanmaguncha */
export function RoomPrice({ room, size = 'md', className }: { room: Room; size?: 'sm' | 'md' | 'lg'; className?: string }) {
  const { t } = useTranslation()
  const lang = useLang()
  return (
    <div className={cn('flex flex-col', className)}>
      <p className="flex items-baseline gap-1.5">
        <span className={cn('font-semibold tracking-tight text-ink', size === 'lg' ? 'text-3xl' : size === 'md' ? 'text-xl' : 'text-lg')}>
          {formatPrice(room.price, lang, CURRENCY)}
        </span>
        <span className="text-xs text-muted">{t('rooms.card.perNight')}</span>
      </p>
      {room.placeholder && <span className="mt-0.5 text-[0.6875rem] font-medium text-[#8a5300]">{t('rooms.card.sample')}</span>}
    </div>
  )
}
