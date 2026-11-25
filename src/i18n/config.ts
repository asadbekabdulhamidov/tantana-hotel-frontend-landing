export const LANGUAGES = ['uz', 'ru', 'en', 'tr'] as const
export type Lang = (typeof LANGUAGES)[number]
export const DEFAULT_LANG: Lang = 'uz'
export const LANG_STORAGE_KEY = 'tantana.lang'

/** Intl / BCP-47 teglari — sana va raqam formatlash uchun */
export const LOCALE_TAGS: Record<Lang, string> = {
  uz: 'uz-Latn-UZ',
  ru: 'ru-RU',
  en: 'en-US',
  tr: 'tr-TR',
}

/** Open Graph og:locale */
export const OG_LOCALES: Record<Lang, string> = {
  uz: 'uz_UZ',
  ru: 'ru_RU',
  en: 'en_US',
  tr: 'tr_TR',
}

/** Har bir til o'z nomida ko'rsatiladi */
export const LANGUAGE_NAMES: Record<Lang, string> = {
  uz: "O'zbekcha",
  ru: 'Русский',
  en: 'English',
  tr: 'Türkçe',
}

export function isLang(value: string | undefined | null): value is Lang {
  return !!value && (LANGUAGES as readonly string[]).includes(value)
}

export function getStoredLang(): Lang | null {
  try {
    const v = localStorage.getItem(LANG_STORAGE_KEY)
    return isLang(v) ? v : null
  } catch {
    return null
  }
}

export function storeLang(lang: Lang) {
  try {
    localStorage.setItem(LANG_STORAGE_KEY, lang)
  } catch {
    /* private mode — e'tiborsiz */
  }
}

/** Birinchi tashrif: saqlangan til → brauzer tili → standart (uz) */
export function detectInitialLang(): Lang {
  const stored = getStoredLang()
  if (stored) return stored
  if (typeof navigator !== 'undefined') {
    for (const l of navigator.languages ?? [navigator.language]) {
      const short = l?.slice(0, 2).toLowerCase()
      if (isLang(short)) return short
    }
  }
  return DEFAULT_LANG
}
