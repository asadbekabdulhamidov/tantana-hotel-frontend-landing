import { useTranslation } from 'react-i18next'
import { Check } from 'lucide-react'
import { cn } from '@/utils/cn'

export const BOOKING_STEPS = ['dates', 'room', 'details', 'review'] as const
export type BookingStep = (typeof BOOKING_STEPS)[number]

export function StepIndicator({ current }: { current: BookingStep }) {
  const { t } = useTranslation()
  const idx = BOOKING_STEPS.indexOf(current)
  return (
    <nav aria-label={t('booking.stepsLabel')}>
      <ol className="flex items-center gap-2 sm:gap-3">
        {BOOKING_STEPS.map((s, i) => {
          const done = i < idx
          const active = i === idx
          return (
            <li key={s} className="flex min-w-0 flex-1 items-center gap-2 sm:gap-3" aria-current={active ? 'step' : undefined}>
              <span
                className={cn(
                  'grid size-8 shrink-0 place-items-center rounded-full text-xs font-semibold transition-colors',
                  done && 'bg-ink text-white',
                  active && 'bg-ink text-white ring-4 ring-ink/10',
                  !done && !active && 'bg-surface text-muted',
                )}
              >
                {done ? <Check className="size-4" aria-hidden /> : i + 1}
              </span>
              <span className={cn('hidden truncate text-[0.8125rem] font-medium sm:block', active ? 'text-ink' : 'text-muted')}>
                {t(`booking.steps.${s}`)}
                {done && <span className="sr-only"> ({t('booking.stepDone')})</span>}
              </span>
              {i < BOOKING_STEPS.length - 1 && <span aria-hidden className={cn('h-px flex-1', done ? 'bg-ink' : 'bg-line')} />}
            </li>
          )
        })}
      </ol>
      <p className="mt-3 text-sm font-semibold sm:hidden">
        {t('booking.stepOf', { current: idx + 1, total: BOOKING_STEPS.length })}: {t(`booking.steps.${current}`)}
      </p>
    </nav>
  )
}
