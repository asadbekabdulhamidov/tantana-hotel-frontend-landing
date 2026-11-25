import { useId, useRef } from 'react'
import { Controller, useForm, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate } from 'react-router'
import { useTranslation } from 'react-i18next'
import { CalendarDays, Minus, Plus, Users } from 'lucide-react'
import { MAX_GUESTS } from '@/data/rooms'
import { useLang, useLocalizedPath } from '@/hooks/useLang'
import { useBookingParams } from '@/hooks/useBookingParams'
import { bookingQuery, searchSchema, storeBooking, type SearchValues } from '@/utils/booking'
import { addDays, formatDate, parseISODate, toISODate, today } from '@/utils/date'
import { Button } from '@/components/ui/Button'
import { cn } from '@/utils/cn'

interface BookingSearchProps {
  variant?: 'hero' | 'panel'
  /** Qidiruvdan keyin qaysi sahifaga o'tish */
  target?: 'rooms' | 'booking'
  /** Qo'shimcha query (masalan, tanlangan xona) */
  extraQuery?: Record<string, string>
  className?: string
  submitLabel?: string
  /** Tor joylar uchun (masalan, xona sahifasidagi yon panel) — maydonlar ustma-ust */
  stacked?: boolean
}

export function BookingSearch({ variant = 'panel', target = 'rooms', extraQuery, className, submitLabel, stacked }: BookingSearchProps) {
  const { t } = useTranslation()
  const lang = useLang()
  const lp = useLocalizedPath()
  const navigate = useNavigate()
  const current = useBookingParams()
  const formId = useId()

  const {
    control,
    handleSubmit,
    setValue,
    getValues,
    formState: { errors, isSubmitted },
    trigger,
  } = useForm<SearchValues>({
    resolver: zodResolver(searchSchema),
    defaultValues: {
      checkIn: current.checkIn || '',
      checkOut: current.checkOut || '',
      guests: current.guests || 2,
    },
  })

  const onSubmit = (v: SearchValues) => {
    storeBooking(v)
    const q = bookingQuery(v)
    const extra = extraQuery ? new URLSearchParams(extraQuery).toString() : ''
    navigate(lp(target === 'rooms' ? '/rooms' : '/booking') + q + (extra ? `&${extra}` : ''))
  }

  const minIn = toISODate(today())
  const checkInValue = useWatch({ control, name: 'checkIn' })
  const ciDate = parseISODate(checkInValue)
  const minOut = toISODate(addDays(ciDate ?? today(), 1))
  const hero = variant === 'hero'
  const err = (key?: string) => (key ? t(key) : undefined)

  return (
    <form
      noValidate
      onSubmit={handleSubmit(onSubmit)}
      aria-label={t('search.title')}
      className={cn(
        'bg-white',
        hero
          ? 'rounded-[1.375rem] p-2 shadow-[var(--shadow-float)] md:rounded-full md:p-2'
          : 'rounded-[1.375rem] border border-line p-2',
        className,
      )}
    >
      <div className={cn('grid gap-1', !stacked && 'md:grid-cols-[1fr_auto_1fr_auto_1fr_auto] md:items-center md:gap-0', stacked && 'divide-y divide-line')}>
        <Controller
          control={control}
          name="checkIn"
          render={({ field }) => (
            <DateField
              id={`${formId}-in`}
              stacked={stacked}
              label={t('search.checkIn')}
              value={field.value}
              min={minIn}
              lang={lang}
              placeholder={t('search.addDate')}
              error={err(errors.checkIn?.message)}
              onChange={(v) => {
                field.onChange(v)
                const ci = parseISODate(v)
                const co = parseISODate(getValues('checkOut'))
                if (ci && (!co || co <= ci)) setValue('checkOut', toISODate(addDays(ci, 1)))
                if (isSubmitted) void trigger()
              }}
            />
          )}
        />
        {!stacked && <Divider />}
        <Controller
          control={control}
          name="checkOut"
          render={({ field }) => (
            <DateField
              id={`${formId}-out`}
              stacked={stacked}
              label={t('search.checkOut')}
              value={field.value}
              min={minOut}
              lang={lang}
              placeholder={t('search.addDate')}
              error={err(errors.checkOut?.message)}
              onChange={(v) => {
                field.onChange(v)
                if (isSubmitted) void trigger()
              }}
            />
          )}
        />
        {!stacked && <Divider />}
        <Controller
          control={control}
          name="guests"
          render={({ field }) => <GuestField id={`${formId}-guests`} value={field.value} onChange={field.onChange} stacked={stacked} />}
        />
        <div className={cn('p-1.5', !stacked && 'md:pl-3', hero && 'md:p-0 md:pl-3')}>
          <Button type="submit" arrow size="lg" block className={cn(!stacked && 'md:w-auto')}>
            {submitLabel ?? t('search.submit')}
          </Button>
        </div>
      </div>
      <p className="sr-only" aria-live="polite">
        {[errors.checkIn?.message, errors.checkOut?.message].filter(Boolean).map((k) => t(k!)).join('. ')}
      </p>
    </form>
  )
}

function Divider() {
  return <span aria-hidden className="mx-auto hidden h-10 w-px bg-line md:block md:mx-0" />
}

function DateField({
  id,
  stacked,
  label,
  value,
  min,
  lang,
  placeholder,
  error,
  onChange,
}: {
  id: string
  stacked?: boolean
  label: string
  value: string
  min: string
  lang: ReturnType<typeof useLang>
  placeholder: string
  error?: string
  onChange: (v: string) => void
}) {
  const ref = useRef<HTMLInputElement>(null)
  const display = value ? formatDate(value, lang, { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' }) : ''
  const open = () => {
    try {
      ref.current?.showPicker?.()
    } catch {
      /* eski brauzerlar — oddiy fokus */
    }
  }

  return (
    <div
      className={cn(
        'relative flex min-h-[4.25rem] items-center gap-3 rounded-2xl px-4 py-2 transition-colors',
        !stacked && 'md:rounded-full md:px-6',
        'focus-within:bg-surface hover:bg-surface/70',
        error && 'bg-[#fdf1f0]',
      )}
    >
      <CalendarDays className="size-5 shrink-0 text-muted" aria-hidden strokeWidth={1.6} />
      <div className="min-w-0 flex-1">
        <label htmlFor={id} className="block text-[0.75rem] font-semibold text-ink">
          {label}
        </label>
        <span id={`${id}-val`} className={cn('block truncate text-[0.8125rem]', value ? 'text-ink' : 'text-subtle')}>
          {display || placeholder}
        </span>
        {error && (
          <span id={`${id}-err`} className="mt-0.5 block text-[0.6875rem] font-medium leading-tight text-danger">
            {error}
          </span>
        )}
      </div>
      {/* Native date input: klaviatura, screen reader va mobil pickerlar bilan to'liq mos */}
      <input
        ref={ref}
        id={id}
        type="date"
        value={value}
        min={min}
        onChange={(e) => onChange(e.target.value)}
        onClick={open}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            open()
          }
        }}
        aria-invalid={!!error}
        aria-describedby={[`${id}-val`, error ? `${id}-err` : ''].filter(Boolean).join(' ')}
        className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
      />
    </div>
  )
}

function GuestField({ id, value, onChange, stacked }: { id: string; value: number; onChange: (v: number) => void; stacked?: boolean }) {
  const { t } = useTranslation()
  return (
    <div role="group" aria-labelledby={`${id}-label`} className={cn('flex min-h-[4.25rem] items-center gap-3 rounded-2xl px-4 py-2', !stacked && 'md:rounded-full md:px-6')}>
      <Users className="size-5 shrink-0 text-muted" aria-hidden strokeWidth={1.6} />
      <div className="min-w-0 flex-1">
        <span id={`${id}-label`} className="block text-[0.75rem] font-semibold text-ink">
          {t('search.guests')}
        </span>
        <output aria-live="polite" className="block text-[0.8125rem] text-ink">
          {t('search.guestCount', { count: value })}
        </output>
      </div>
      <div className="flex items-center gap-1.5">
        <StepButton label={t('search.decrease')} disabled={value <= 1} onClick={() => onChange(Math.max(1, value - 1))}>
          <Minus className="size-3.5" aria-hidden />
        </StepButton>
        <StepButton label={t('search.increase')} disabled={value >= MAX_GUESTS} onClick={() => onChange(Math.min(MAX_GUESTS, value + 1))}>
          <Plus className="size-3.5" aria-hidden />
        </StepButton>
      </div>
    </div>
  )
}

function StepButton({ label, disabled, onClick, children }: { label: string; disabled?: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      aria-label={label}
      disabled={disabled}
      onClick={onClick}
      className="grid size-9 place-items-center rounded-full border border-line text-ink transition-colors hover:border-ink disabled:cursor-not-allowed disabled:opacity-35"
    >
      {children}
    </button>
  )
}
