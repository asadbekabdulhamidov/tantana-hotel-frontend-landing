import { useTranslation } from 'react-i18next'
import { useLocalizedPath } from '@/hooks/useLang'
import { Seo } from '@/components/seo/Seo'
import { ButtonLink } from '@/components/ui/Button'
import { Container } from '@/components/ui/Container'

export default function NotFoundPage({ message }: { message?: string }) {
  const { t } = useTranslation()
  const lp = useLocalizedPath()
  return (
    <>
      <Seo title={t('meta.notFound.title')} description={t('meta.notFound.description')} path="/404" noindex />
      <Container className="flex min-h-[75vh] flex-col items-center justify-center pt-28 text-center">
        <p className="font-serif text-[7rem] font-semibold leading-none text-surface-2 sm:text-[10rem]" aria-hidden>
          404
        </p>
        <h1 className="mt-2 text-3xl font-semibold sm:text-4xl">{t('notFound.title')}</h1>
        <p className="mt-3 max-w-md text-muted">{message ?? t('notFound.text')}</p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <ButtonLink to={lp('/')} arrow>
            {t('notFound.home')}
          </ButtonLink>
          <ButtonLink to={lp('/rooms')} variant="secondary">
            {t('nav.rooms')}
          </ButtonLink>
        </div>
      </Container>
    </>
  )
}
