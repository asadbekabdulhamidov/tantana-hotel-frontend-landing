import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import { LANGUAGES, type Lang } from './config'

/* Har bir til alohida chunk bo'lib yuklanadi — faqat kerakli til yuklanadi. */
const loaders: Record<Lang, () => Promise<{ default: Record<string, unknown> }>> = {
  uz: () => import('../locales/uz/translation.json'),
  ru: () => import('../locales/ru/translation.json'),
  en: () => import('../locales/en/translation.json'),
  tr: () => import('../locales/tr/translation.json'),
}

export async function loadLanguage(lang: Lang) {
  if (!i18n.hasResourceBundle(lang, 'translation')) {
    const mod = await loaders[lang]()
    i18n.addResourceBundle(lang, 'translation', mod.default, true, true)
  }
}

export async function setLanguage(lang: Lang) {
  await loadLanguage(lang)
  if (i18n.language !== lang) await i18n.changeLanguage(lang)
}

export async function initI18n(lang: Lang) {
  await i18n.use(initReactI18next).init({
    lng: lang,
    fallbackLng: false,
    supportedLngs: [...LANGUAGES],
    resources: {},
    interpolation: { escapeValue: false },
    returnNull: false,
    react: { useSuspense: false },
  })
  await loadLanguage(lang)
  return i18n
}

export default i18n
