import { Megaphone } from 'lucide-react'

interface Props {
  message: string
}

export function AnnouncementBanner({ message }: Props) {
  if (!message.trim()) return null
  return (
    <div className="bg-[#16a34a] text-white px-4 py-2.5 flex items-center gap-2 text-sm font-medium">
      <Megaphone className="shrink-0 size-4" aria-hidden />
      <span className="truncate">{message}</span>
    </div>
  )
}
