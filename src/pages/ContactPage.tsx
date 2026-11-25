import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useTranslation } from 'react-i18next'
import { ArrowUpRight, CheckCircle2, Clock, Mail, MapPin, Phone } from 'lucide-react'
import { HOTEL, mapsEmbed, mapsLink } from '@/data/hotel'
import { useLocalizedPath } from '@/hooks/useLang'
import { Seo } from '@/components/seo/Seo'
import { PageHeader } from '@/components/sections/PageHeader'
import { PhoneLink } from '@/components/layout/PhoneLink'
import { Button } from '@/components/ui/Button'
import { Container } from '@/components/ui/Container'
import { DemoNotice } from '@/components/ui/DemoNotice'
import { TextArea, TextField } from '@/components/ui/Field'
import { Reveal } from '@/components/ui/Reveal'

const schema = z.object({
  name: z.string().trim().min(1, 'booking.errors.nameRequired').min(2, 'booking.errors.nameShort'),
  email: z.string().trim().min(1, 'booking.errors.emailRequired').email('booking.errors.emailInvalid'),
  message: z.string().trim().min(1, 'contact.form.errors.messageRequired').min(10, 'contact.form.errors.messageShort').max(1000, 'booking.errors.requestsLong'),
})
type Values = z.infer<typeof schema>

export default function ContactPage() {
  const { t } = useTranslation()
  const lp = useLocalizedPath()
  const [sent, setSent] = useState(false)
  const crumbs = [{ label: t('nav.home'), to: lp('/') }, { label: t('nav.contact') }]
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<Values>({ resolver: zodResolver(schema), mode: 'onTouched' })

  /* Backend ulanmagan — demo: hech narsa yuborilmaydi */
  const onSubmit = async () => {
    await new Promise((r) => setTimeout(r, 800))
    setSent(true)
    reset()
  }

  const e = (k?: string) => (k ? t(k) : undefined)

  return (
    <>
      <Seo title={t('meta.contact.title')} description={t('meta.contact.description')} path="/contact" image="reception" breadcrumbs={crumbs} />
      <PageHeader crumbs={crumbs} eyebrow={t('contact.eyebrow')} title={t('contact.title')} subtitle={t('contact.subtitle')} />

      <Container wide className="mt-12 grid gap-10 md:mt-16 lg:grid-cols-[1fr_1.1fr] lg:gap-16">
        <Reveal className="flex flex-col gap-4">
          <InfoCard icon={MapPin} label={t('contact.address')}>
            <a href={mapsLink} target="_blank" rel="noopener noreferrer" className="group inline-flex items-center gap-1 hover:underline">
              {t('contact.addressValue')}
              <ArrowUpRight className="size-4 opacity-60" aria-hidden />
              <span className="sr-only"> ({t('common.opensNewTab')})</span>
            </a>
          </InfoCard>
          <InfoCard icon={Phone} label={t('contact.phone')}>
            <PhoneLink className="[&_svg]:hidden" />
            {!HOTEL.phone && <span className="mt-1 block text-xs font-normal text-[#8a5300]">{t('common.toBeConfirmed')}</span>}
          </InfoCard>
          <InfoCard icon={Mail} label={t('contact.email')}>
            {HOTEL.email ? (
              <a href={`mailto:${HOTEL.email}`} className="hover:underline">
                {HOTEL.email}
              </a>
            ) : (
              <span className="text-sm font-normal text-[#8a5300]">{t('common.toBeConfirmed')}</span>
            )}
          </InfoCard>
          <InfoCard icon={Clock} label={t('contact.hours')}>
            {t('footer.times', { checkIn: HOTEL.checkIn, checkOut: HOTEL.checkOut })}
            <span className="mt-1 block text-sm font-normal text-muted">{t('contact.reception')}</span>
          </InfoCard>
          <div className="mt-2 overflow-hidden rounded-[var(--radius-card)] border border-line">
            <iframe
              title={t('contact.mapTitle')}
              src={mapsEmbed}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="block aspect-[4/3] w-full border-0 grayscale-[0.3]"
            />
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <form noValidate onSubmit={handleSubmit(onSubmit)} aria-labelledby="contact-form-title" className="rounded-[var(--radius-card)] bg-surface p-5 sm:p-8">
            <h2 id="contact-form-title" className="text-xl font-semibold">
              {t('contact.form.title')}
            </h2>
            <DemoNotice className="mt-4">{t('contact.form.demo')}</DemoNotice>
            <div className="mt-6 grid gap-5">
              <TextField label={t('contact.form.name')} required autoComplete="name" error={e(errors.name?.message)} {...register('name')} />
              <TextField label={t('contact.form.email')} required type="email" autoComplete="email" error={e(errors.email?.message)} {...register('email')} />
              <TextArea label={t('contact.form.message')} required rows={6} error={e(errors.message?.message)} {...register('message')} />
            </div>
            <Button type="submit" arrow className="mt-7" disabled={isSubmitting} aria-busy={isSubmitting}>
              {isSubmitting ? t('contact.form.sending') : t('contact.form.submit')}
            </Button>
            <div aria-live="polite">
              {sent && (
                <p className="mt-5 flex items-start gap-2 rounded-xl bg-white p-4 text-sm text-success">
                  <CheckCircle2 className="mt-0.5 size-4 shrink-0" aria-hidden />
                  {t('contact.form.success')}
                </p>
              )}
            </div>
          </form>
        </Reveal>
      </Container>
    </>
  )
}

function InfoCard({ icon: Icon, label, children }: { icon: typeof MapPin; label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-4 rounded-[var(--radius-card)] border border-line p-5">
      <span className="grid size-11 shrink-0 place-items-center rounded-full bg-surface">
        <Icon className="size-5" aria-hidden strokeWidth={1.6} />
      </span>
      <div className="min-w-0">
        <p className="text-xs text-muted">{label}</p>
        <div className="mt-1 text-[0.98rem] font-semibold">{children}</div>
      </div>
    </div>
  )
}
