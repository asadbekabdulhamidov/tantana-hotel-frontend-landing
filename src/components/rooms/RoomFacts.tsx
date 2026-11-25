import { BedDouble, Maximize2, Users } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import type { Room } from '@/data/rooms'
import { cn } from '@/utils/cn'

export function RoomFacts({ room, className, tone = 'dark' }: { room: Room; className?: string; tone?: 'dark' | 'light' }) {
  const { t } = useTranslation()
  const items = [
    { icon: Users, label: t('rooms.card.guests', { count: room.capacity }) },
    { icon: BedDouble, label: t(`rooms.beds.${room.bed}`) },
    { icon: Maximize2, label: t('rooms.card.size', { value: room.size }) },
  ]
  return (
    <ul className={cn('flex flex-wrap items-center gap-x-4 gap-y-2 text-[0.8125rem]', tone === 'dark' ? 'text-muted' : 'text-white/85', className)}>
      {items.map(({ icon: Icon, label }) => (
        <li key={label} className="inline-flex items-center gap-1.5">
          <Icon className="size-4 shrink-0" aria-hidden strokeWidth={1.6} />
          {label}
        </li>
      ))}
    </ul>
  )
}
