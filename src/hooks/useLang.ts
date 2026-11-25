import { useCallback } from 'react'
import { useParams } from 'react-router'
import { DEFAULT_LANG, isLang, type Lang } from '@/i18n/config'

export function useLang(): Lang {
  const { lang } = useParams()
  return isLang(lang) ? lang : DEFAULT_LANG
}

/** "/rooms" → "/uz/rooms" */
export function useLocalizedPath() {
  const lang = useLang()
  return useCallback((path = '/') => `/${lang}${path === '/' ? '/' : path}`, [lang])
}
