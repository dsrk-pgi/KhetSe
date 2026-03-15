import { createContext, useCallback, useContext, useState } from 'react'
import type { Lang } from '../i18n/translations'
import { translations } from '../i18n/translations'

const STORAGE_LANG = 'khetse_lang'

interface LanguageState {
  lang: Lang
  setLang: (lang: Lang) => void
  t: (key: string) => string
}

const LanguageContext = createContext<LanguageState | null>(null)

function getStoredLang(): Lang {
  try {
    const s = localStorage.getItem(STORAGE_LANG)
    if (s === 'hi' || s === 'en') return s
  } catch (_) {}
  return 'en'
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>(getStoredLang)

  const setLang = useCallback((l: Lang) => {
    setLangState(l)
    try {
      localStorage.setItem(STORAGE_LANG, l)
    } catch (_) {}
  }, [])

  const t = useCallback(
    (key: string) => {
      return translations[lang][key] ?? translations.en[key] ?? key
    },
    [lang]
  )

  const value: LanguageState = { lang, setLang, t }

  return (
    <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
  )
}

export function useLanguage() {
  const ctx = useContext(LanguageContext)
  if (!ctx) throw new Error('useLanguage must be used within LanguageProvider')
  return ctx
}
