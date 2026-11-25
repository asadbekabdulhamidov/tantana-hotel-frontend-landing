import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ImageIcon, ImageOff } from 'lucide-react'
import { IMAGES, imageSrcSet, imageUrl, localSrcSet, localUrl, type ImageKey, type ImageSource } from '@/data/images'
import { cn } from '@/utils/cn'

interface ImgProps {
  image: ImageKey
  /** Agar berilmasa — `images.<key>` tarjimasi */
  alt?: string
  sizes?: string
  /** LCP rasm uchun: eager + fetchpriority=high */
  priority?: boolean
  className?: string
  imgClassName?: string
  /** true — ota element o'lchamini to'ldiradi (absolute) */
  fill?: boolean
}

/**
 * Responsiv rasm: <picture> (AVIF → WebP), srcset + sizes, lazy-loading,
 * width/height orqali CLS oldini olish va xatolikda zaxira blok.
 */
export function Img({ image, alt, sizes = '100vw', priority, className, imgClassName, fill }: ImgProps) {
  const { t } = useTranslation()
  const [failed, setFailed] = useState(false)
  const src: ImageSource = IMAGES[image]
  const altText = alt ?? t(`images.${image}`)
  const w = 1600
  const h = Math.round(w / src.ratio)
  const common = {
    alt: altText,
    width: w,
    height: h,
    loading: priority ? ('eager' as const) : ('lazy' as const),
    decoding: priority ? ('sync' as const) : ('async' as const),
    fetchPriority: priority ? ('high' as const) : ('auto' as const),
    onError: () => setFailed(true),
    style: src.position ? { objectPosition: src.position } : undefined,
    className: cn('h-full w-full object-cover', imgClassName),
  }
  const empty = !src.local && !src.src

  return (
    <div className={cn('overflow-hidden bg-surface-2', fill ? 'absolute inset-0' : 'relative', className)}>
      {empty ? (
        <div role="img" aria-label={altText} className="absolute inset-0 grid place-items-center bg-[radial-gradient(circle_at_30%_20%,#f3f1ec,#e2dfd7)] p-4 text-center">
          <span className="flex flex-col items-center gap-2 text-xs font-medium tracking-wide text-muted">
            <ImageIcon className="size-5" aria-hidden strokeWidth={1.5} />
            {t('common.photoSoon')}
          </span>
        </div>
      ) : failed ? (
        <div role="img" aria-label={altText} className="absolute inset-0 grid place-items-center bg-[linear-gradient(135deg,#ecebe7,#dcdad3)] p-4 text-center">
          <span className="flex flex-col items-center gap-2 text-xs font-medium text-muted">
            <ImageOff className="size-5" aria-hidden />
            {!fill && altText}
          </span>
        </div>
      ) : src.local ? (
        <picture>
          <source type="image/avif" srcSet={localSrcSet(src, 'avif')} sizes={sizes} />
          <source type="image/webp" srcSet={localSrcSet(src, 'webp')} sizes={sizes} />
          <img src={localUrl(src.local, src.widths![src.widths!.length - 1], 'webp')} {...common} />
        </picture>
      ) : (
        <img src={imageUrl(src.src!, 1440)} srcSet={imageSrcSet(src.src!)} sizes={sizes} {...common} />
      )}
    </div>
  )
}
