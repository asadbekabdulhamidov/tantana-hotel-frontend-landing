import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@fontsource-variable/manrope/wght.css'
import '@fontsource/cormorant-garamond/latin-600.css'
import './index.css'
import { detectInitialLang, isLang } from '@/i18n/config'
import { initI18n } from '@/i18n'
import App from './App'

const urlLang = window.location.pathname.split('/')[1]
const lang = isLang(urlLang) ? urlLang : detectInitialLang()
document.documentElement.lang = lang

initI18n(lang).then(() => {
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <App />
    </StrictMode>,
  )
})
