import { useLanguage } from '../context/LanguageContext'

export function LanguageToggle() {
  const { lang, setLang } = useLanguage()
  return (
    <div className="fixed top-2 right-2 z-[110] flex rounded-full bg-white shadow-lg border border-neutral-200 overflow-hidden min-h-[48px] touch-manipulation" style={{ isolation: 'isolate' }}>
      <button
        type="button"
        onClick={() => setLang('hi')}
        className={`min-h-[48px] min-w-[48px] flex items-center justify-center px-3 text-sm font-medium transition active:scale-[0.98] active:opacity-90 ${lang === 'hi' ? 'bg-[#16a34a] text-white' : 'text-neutral-600 hover:bg-neutral-100'}`}
        aria-pressed={lang === 'hi'}
      >
        हिन्दी
      </button>
      <span className="text-neutral-300 self-center text-xs py-2">|</span>
      <button
        type="button"
        onClick={() => setLang('en')}
        className={`min-h-[48px] min-w-[48px] flex items-center justify-center px-3 text-sm font-medium transition active:scale-[0.98] active:opacity-90 ${lang === 'en' ? 'bg-[#16a34a] text-white' : 'text-neutral-600 hover:bg-neutral-100'}`}
        aria-pressed={lang === 'en'}
      >
        EN
      </button>
    </div>
  )
}
