import { useTranslation } from 'react-i18next'
import { Seo, hotelJsonLd } from '@/components/seo/Seo'
import { HeroSection } from '@/components/sections/HeroSection'
import { TravelStyles } from '@/components/sections/TravelStyles'
import { FeaturedRooms } from '@/components/sections/FeaturedRooms'
import { WhySection } from '@/components/sections/WhySection'
import { ExperiencesTeaser } from '@/components/sections/ExperiencesTeaser'
import { DiscoverFergana } from '@/components/sections/DiscoverFergana'
import { CtaBanner } from '@/components/sections/CtaBanner'
import { useLang } from '@/hooks/useLang'

export default function HomePage() {
  const { t } = useTranslation()
  const lang = useLang()
  return (
    <>
      <Seo title={t('meta.home.title')} description={t('meta.home.description')} path="/" jsonLd={hotelJsonLd(lang, t('meta.home.description'))} />
      <HeroSection />
      <TravelStyles />
      <FeaturedRooms />
      <WhySection />
      <ExperiencesTeaser />
      <DiscoverFergana />
      <CtaBanner />
    </>
  )
}
