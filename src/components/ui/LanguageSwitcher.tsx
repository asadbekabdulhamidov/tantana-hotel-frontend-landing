import { useEffect, useId, useRef, useState } from 'react'
import { Link, useLocation } from 'react-router'
import { useTranslation } from 'react-i18next'
import { Check, ChevronDown, Globe } from 'lucide-react'
import { LANGUAGES, LANGUAGE_NAMES, storeLang, type Lang } from '@/i18n/config'
import { useLang } from '@/hooks/useLang'
import { cn } from '@/utils/cn'

/** Joriy sahifa va query parametrlarini saqlagan holda tilni almashtiradi */
export function useSwitchLangPath() {
  const { pathname, search, hash } = useLocation()
  return (target: Lang) => {
    const parts = pathname.split('/')
    parts[1] = target
    return `${parts.join('/') || `/${target}/`}${search}${hash}`
  }
}

export function LanguageSwitcher({
  tone = 'dark',
  align = 'right',
  direction = 'down',
}: {
  tone?: 'dark' | 'light'
  align?: 'left' | 'right'
  direction?: 'down' | 'up'
}) {
  const { t } = useTranslation()
  const lang = useLang()
  const toPath = useSwitchLangPath()
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const menuId = useId()

  useEffect(() => {
    if (!open) return
    const onDown = (e: PointerEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false)
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false)
        ref.current?.querySelector<HTMLButtonElement>('button')?.focus()
      }
    }
    document.addEventListener('pointerdown', onDown)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('pointerdown', onDown)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        aria-haspopup="true"
        aria-expanded={open}
        aria-controls={menuId}
        aria-label={t('nav.language', { lang: LANGUAGE_NAMES[lang] })}
        onClick={() => setOpen((o) => !o)}
        className={cn(
          'inline-flex h-10 items-center gap-1.5 rounded-full px-3 text-[0.8125rem] font-semibold uppercase transition-colors',
          tone === 'light' ? 'text-white hover:bg-white/10' : 'text-ink hover:bg-surface',
        )}
      >
        <Globe className="size-4" aria-hidden strokeWidth={1.75} />
        {lang}
        <ChevronDown className={cn('size-3.5 transition-transform', open && 'rotate-180')} aria-hidden />
      </button>
      <ul
        id={menuId}
        hidden={!open}
        className={cn(
          'absolute z-50 w-44 overflow-hidden rounded-2xl border border-line bg-white p-1.5 shadow-[var(--shadow-float)]',
          align === 'right' ? 'right-0' : 'left-0',
          direction === 'down' ? 'top-full mt-2' : 'bottom-full mb-2',
        )}
      >
        {LANGUAGES.map((l) => (
          <li key={l}>
            <Link
              to={toPath(l)}
              hrefLang={l}
              lang={l}
              aria-current={l === lang ? 'true' : undefined}
              onClick={() => {
                storeLang(l)
                setOpen(false)
              }}
              className={cn(
                'flex items-center justify-between rounded-xl px-3 py-2.5 text-sm text-ink transition-colors hover:bg-surface',
                l === lang && 'font-semibold',
              )}
            >
              {LANGUAGE_NAMES[l]}
              {l === lang && <Check className="size-4" aria-hidden />}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
