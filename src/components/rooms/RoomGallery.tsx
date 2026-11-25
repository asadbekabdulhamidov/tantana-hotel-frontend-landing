import { useCallback, useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { AnimatePresence, motion } from 'motion/react'
import { ChevronLeft, ChevronRight, Grid2x2, X } from 'lucide-react'
import type { ImageKey } from '@/data/images'
import { Img } from '@/components/ui/Img'
import { cn } from '@/utils/cn'

interface GalleryProps {
  images: ImageKey[]
  /** Har bir rasm uchun alt matn */
  alts: string[]
  /** Birinchi rasm LCP bo'lishi mumkin */
  priority?: boolean
}

export function RoomGallery({ images, alts, priority }: GalleryProps) {
  const { t } = useTranslation()
  const [open, setOpen] = useState<number | null>(null)
  const [mobileIndex, setMobileIndex] = useState(0)
  const scroller = useRef<HTMLDivElement>(null)

  const onScroll = () => {
    const el = scroller.current
    if (!el) return
    setMobileIndex(Math.round(el.scrollLeft / el.clientWidth))
  }

  return (
    <div>
      {/* Mobil: swipe karusel (scroll-snap) */}
      <div className="relative md:hidden">
        <div
          ref={scroller}
          onScroll={onScroll}
          className="no-scrollbar flex snap-x snap-mandatory overflow-x-auto rounded-[var(--radius-card)]"
          role="region"
          aria-roledescription="carousel"
          aria-label={t('room.gallery.label')}
        >
          {images.map((img, i) => (
            <button
              key={img + i}
              type="button"
              onClick={() => setOpen(i)}
              className="w-full shrink-0 snap-center"
              aria-label={t('room.gallery.openImage', { current: i + 1, total: images.length })}
            >
              <Img image={img} alt={alts[i]} priority={priority && i === 0} sizes="100vw" className="aspect-[4/3]" />
            </button>
          ))}
        </div>
        <span className="glass-light pointer-events-none absolute bottom-3 right-3 rounded-full px-3 py-1 text-xs font-semibold" aria-hidden>
          {mobileIndex + 1} / {images.length}
        </span>
      </div>

      {/* Desktop: editorial mozaika */}
      <div className="relative hidden md:block">
      <div className="grid h-[min(68vh,620px)] grid-cols-4 grid-rows-2 gap-2.5">
        {images.slice(0, 4).map((img, i) => (
          <button
            key={img + i}
            type="button"
            onClick={() => setOpen(i)}
            aria-label={t('room.gallery.openImage', { current: i + 1, total: images.length })}
            className={cn(
              'group relative overflow-hidden',
              i === 0 && 'col-span-2 row-span-2 rounded-l-[var(--radius-card)]',
              i === 1 && 'col-span-2 rounded-tr-[var(--radius-card)]',
              i === 3 && 'rounded-br-[var(--radius-card)]',
            )}
          >
            <Img
              image={img}
              alt={alts[i]}
              fill
              priority={priority && i === 0}
              sizes={i === 0 ? '(min-width: 1240px) 620px, 50vw' : '(min-width: 1240px) 310px, 25vw'}
              imgClassName="transition-transform duration-[1.2s] ease-[var(--ease-out-soft)] group-hover:scale-[1.04]"
            />
            <span aria-hidden className="absolute inset-0 bg-black/0 transition-colors duration-300 group-hover:bg-black/10" />
          </button>
        ))}
      </div>
        <button
          type="button"
          onClick={() => setOpen(0)}
          className="glass-light absolute bottom-4 right-4 z-10 inline-flex h-10 items-center gap-2 rounded-full px-4 text-[0.8125rem] font-semibold text-ink shadow-[var(--shadow-soft)]"
        >
          <Grid2x2 className="size-4" aria-hidden />
          {t('room.gallery.viewAll', { count: images.length })}
        </button>
      </div>

      <Lightbox images={images} alts={alts} index={open} onClose={() => setOpen(null)} onIndex={setOpen} />
    </div>
  )
}

function Lightbox({
  images,
  alts,
  index,
  onClose,
  onIndex,
}: {
  images: ImageKey[]
  alts: string[]
  index: number | null
  onClose: () => void
  onIndex: (i: number) => void
}) {
  const { t } = useTranslation()
  const ref = useRef<HTMLDialogElement>(null)
  const [dir, setDir] = useState(1)
  const isOpen = index !== null

  /* Native <dialog>: fokus tuzog'i, Esc va fon "inert" — bepul */
  useEffect(() => {
    const d = ref.current
    if (!d) return
    if (isOpen && !d.open) d.showModal()
    if (!isOpen && d.open) d.close()
  }, [isOpen])

  const go = useCallback(
    (delta: number) => {
      if (index === null) return
      setDir(delta)
      onIndex((index + delta + images.length) % images.length)
    },
    [index, images.length, onIndex],
  )

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowRight') go(1)
    if (e.key === 'ArrowLeft') go(-1)
  }

  return (
    <dialog
      ref={ref}
      onClose={onClose}
      onCancel={onClose}
      onKeyDown={onKeyDown}
      aria-label={t('room.gallery.label')}
      className="m-0 h-[100dvh] max-h-none w-screen max-w-none bg-black/95 p-0 text-white backdrop:bg-black/80"
    >
      {isOpen && (
        <div className="flex h-full flex-col">
          <div className="flex items-center justify-between px-4 py-3 sm:px-6">
            <p className="text-sm font-medium text-white/80" aria-live="polite">
              {t('room.gallery.counter', { current: index + 1, total: images.length })}
            </p>
            <button type="button" onClick={onClose} aria-label={t('room.gallery.close')} className="grid size-11 place-items-center rounded-full bg-white/10 transition-colors hover:bg-white/20">
              <X className="size-5" aria-hidden />
            </button>
          </div>

          <div className="relative flex flex-1 items-center justify-center overflow-hidden px-2 pb-4 sm:px-20">
            <AnimatePresence initial={false} custom={dir} mode="popLayout">
              <motion.div
                key={index}
                custom={dir}
                initial={{ opacity: 0, x: dir * 60 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: dir * -60 }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.4}
                onDragEnd={(_, info) => {
                  if (info.offset.x < -60 || info.velocity.x < -400) go(1)
                  else if (info.offset.x > 60 || info.velocity.x > 400) go(-1)
                }}
                className="w-full max-w-6xl cursor-grab touch-pan-y active:cursor-grabbing"
              >
                <Img image={images[index]} alt={alts[index]} sizes="(min-width: 1280px) 1150px, 100vw" className="aspect-[3/2] rounded-xl bg-white/5" imgClassName="pointer-events-none object-contain" />
              </motion.div>
            </AnimatePresence>

            <NavButton side="left" label={t('room.gallery.prev')} onClick={() => go(-1)} />
            <NavButton side="right" label={t('room.gallery.next')} onClick={() => go(1)} />
          </div>

          <ul className="no-scrollbar flex justify-center gap-2 overflow-x-auto px-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
            {images.map((img, i) => (
              <li key={img + i} className="shrink-0">
                <button
                  type="button"
                  onClick={() => {
                    setDir(i > index ? 1 : -1)
                    onIndex(i)
                  }}
                  aria-label={t('room.gallery.openImage', { current: i + 1, total: images.length })}
                  aria-current={i === index ? 'true' : undefined}
                  className={cn('block overflow-hidden rounded-lg ring-2 transition-opacity', i === index ? 'opacity-100 ring-white' : 'opacity-50 ring-transparent hover:opacity-80')}
                >
                  <Img image={img} alt="" sizes="96px" className="h-14 w-20" />
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </dialog>
  )
}

function NavButton({ side, label, onClick }: { side: 'left' | 'right'; label: string; onClick: () => void }) {
  const Icon = side === 'left' ? ChevronLeft : ChevronRight
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className={cn(
        'absolute top-1/2 hidden size-12 -translate-y-1/2 place-items-center rounded-full bg-white text-ink shadow-lg transition-transform hover:scale-105 sm:grid',
        side === 'left' ? 'left-4' : 'right-4',
      )}
    >
      <Icon className="size-5" aria-hidden />
    </button>
  )
}
