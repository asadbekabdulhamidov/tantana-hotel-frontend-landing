import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/Button'
import { FieldShell, TextArea, TextField } from '@/components/ui/Field'
import { cn } from '@/utils/cn'

export const ARRIVAL_SLOTS = ['unknown', '10-12', '12-14', '14-16', '16-18', '18-20', '20-22', '22-24', 'after24'] as const

export const guestSchema = z.object({
  fullName: z.string().trim().min(1, 'booking.errors.nameRequired').min(3, 'booking.errors.nameShort').max(80, 'booking.errors.nameLong'),
  phone: z
    .string()
    .trim()
    .min(1, 'booking.errors.phoneRequired')
    .regex(/^\+?[0-9\s\-()]{7,20}$/, 'booking.errors.phoneInvalid'),
  email: z.string().trim().min(1, 'booking.errors.emailRequired').email('booking.errors.emailInvalid'),
  arrival: z.enum(ARRIVAL_SLOTS),
  requests: z.string().max(500, 'booking.errors.requestsLong').optional().or(z.literal('')),
  consent: z.literal(true, { errorMap: () => ({ message: 'booking.errors.consent' }) }),
})

export type GuestValues = z.infer<typeof guestSchema>

export function BookingForm({
  defaultValues,
  onSubmit,
  onBack,
}: {
  defaultValues?: Partial<GuestValues>
  onSubmit: (v: GuestValues) => void
  onBack: () => void
}) {
  const { t } = useTranslation()
  const {
    register,
    handleSubmit,
    setFocus,
    formState: { errors },
  } = useForm<GuestValues>({
    resolver: zodResolver(guestSchema),
    defaultValues: { arrival: 'unknown', requests: '', ...defaultValues, consent: defaultValues?.consent ?? (false as unknown as true) },
    mode: 'onTouched',
  })
  const e = (k?: string) => (k ? t(k) : undefined)

  return (
    <form
      noValidate
      onSubmit={handleSubmit(onSubmit, (errs) => {
        const first = Object.keys(errs)[0] as keyof GuestValues | undefined
        if (first) setFocus(first)
      })}
      aria-labelledby="guest-title"
      className="rounded-[var(--radius-card)] border border-line bg-white p-5 sm:p-8"
    >
      <h2 id="guest-title" className="text-xl font-semibold">
        {t('booking.guest.title')}
      </h2>
      <p className="mt-1 text-sm text-muted">{t('booking.guest.subtitle')}</p>

      <div className="mt-7 grid gap-5 sm:grid-cols-2">
        <TextField label={t('booking.guest.fullName')} required autoComplete="name" error={e(errors.fullName?.message)} className="sm:col-span-2" {...register('fullName')} />
        <TextField label={t('booking.guest.phone')} required type="tel" inputMode="tel" autoComplete="tel" placeholder="+998 90 123 45 67" error={e(errors.phone?.message)} {...register('phone')} />
        <TextField label={t('booking.guest.email')} required type="email" autoComplete="email" placeholder="name@example.com" error={e(errors.email?.message)} {...register('email')} />
        <FieldShell label={t('booking.guest.arrival')} className="sm:col-span-2" hint={t('booking.guest.arrivalHint')}>
          {({ id, describedBy }) => (
            <select
              id={id}
              aria-describedby={describedBy}
              className="h-12 w-full cursor-pointer rounded-xl border border-line bg-white px-4 text-[0.9375rem] outline-none transition-[border-color,box-shadow] hover:border-ink/25 focus:border-ink focus:ring-4 focus:ring-ink/5"
              {...register('arrival')}
            >
              {ARRIVAL_SLOTS.map((s) => (
                <option key={s} value={s}>
                  {t(`booking.arrival.${s}`)}
                </option>
              ))}
            </select>
          )}
        </FieldShell>
        <TextArea label={t('booking.guest.requests')} placeholder={t('booking.guest.requestsPlaceholder')} error={e(errors.requests?.message)} className="sm:col-span-2" {...register('requests')} />
      </div>

      <div className="mt-6">
        <label className={cn('flex cursor-pointer items-start gap-3 rounded-xl p-1 text-sm leading-relaxed text-ink-soft')}>
          <input
            type="checkbox"
            className="mt-0.5 size-5 shrink-0 cursor-pointer rounded accent-ink"
            aria-invalid={!!errors.consent}
            aria-describedby={errors.consent ? 'consent-err' : undefined}
            {...register('consent')}
          />
          <span>{t('booking.guest.consent')}</span>
        </label>
        {errors.consent && (
          <p id="consent-err" role="alert" className="mt-1.5 pl-9 text-xs font-medium text-danger">
            {t(errors.consent.message ?? '')}
          </p>
        )}
      </div>

      <div className="mt-8 flex flex-col-reverse gap-3 border-t border-line pt-6 sm:flex-row sm:justify-between">
        <Button variant="secondary" onClick={onBack}>
          {t('booking.back')}
        </Button>
        <Button type="submit" arrow>
          {t('booking.toReview')}
        </Button>
      </div>
    </form>
  )
}
