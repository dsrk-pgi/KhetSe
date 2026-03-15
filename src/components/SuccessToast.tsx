import { CheckCircle } from 'lucide-react'

interface Props {
  show: boolean
  message?: string
}

export function SuccessToast({ show, message = 'Saved!' }: Props) {
  if (!show) return null
  return (
    <div
      className="fixed bottom-24 left-1/2 -translate-x-1/2 z-[60] flex items-center gap-2 px-4 py-3 rounded-xl bg-[#16a34a] text-white shadow-lg"
      role="status"
      aria-live="polite"
    >
      <CheckCircle className="size-5 shrink-0" aria-hidden />
      <span className="font-medium">{message}</span>
    </div>
  )
}
