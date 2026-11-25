import { useTranslation } from 'react-i18next'
import { motion, AnimatePresence } from 'motion/react'
import { useLocalizedPath } from '@/hooks/useLang'
import { useBookingParams } from '@/hooks/useBookingParams'
import { useScrolled } from '@/hooks/useScrolled'
import { bookingQuery } from '@/utils/booking'
import { ButtonLink } from '@/components/ui/Button'

/** Mobil qurilmalarda doimiy bron tugmasi (hero'dan o'tgandan keyin chiqadi) */
export function MobileBookingBar() {
  const { t } = useTranslation()
  const lp = useLocalizedPath()
  const booking = useBookingParams()
  const scrolled = useScrolled(480)
  return (
    <AnimatePresence>
      {scrolled && (
        <motion.div
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          exit={{ y: 100 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-x-0 bottom-0 z-30 border-t border-line bg-white/95 px-4 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3 backdrop-blur-md sm:hidden"
        >
          <ButtonLink to={lp('/booking') + (booking.valid ? bookingQuery(booking) : '')} block size="md" arrow>
            {t('nav.book')}
          </ButtonLink>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
