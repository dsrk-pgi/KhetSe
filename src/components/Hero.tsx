import { Search } from 'lucide-react'
import { AnnouncementBanner } from './AnnouncementBanner'
import { useLanguage } from '../context/LanguageContext'

interface Props {
  announcement: string
  searchQuery: string
  onSearchChange: (v: string) => void
}

export function Hero({ announcement, searchQuery, onSearchChange }: Props) {
  const { t } = useLanguage()
  return (
    <header className="sticky top-0 z-20 bg-white shadow-sm">
      <AnnouncementBanner message={announcement} />
      <div className="px-4 py-4">
        <h1 className="text-xl font-bold text-[#16a34a] mb-3">KhetSe</h1>
        <p className="text-neutral-600 text-sm mb-3">{t('hero.tagline')}</p>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-neutral-400" aria-hidden />
          <input
            type="search"
            placeholder={t('hero.search')}
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full min-h-[48px] pl-10 pr-4 py-2.5 rounded-lg border border-neutral-200 bg-neutral-50 text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-[#16a34a]/30 focus:border-[#16a34a]"
            aria-label={t('hero.search')}
          />
        </div>
      </div>
    </header>
  )
}
