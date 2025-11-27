import { Loader2 } from 'lucide-react'

export function LoadingSpinner() {
  return (
    <div className="flex flex-col items-center justify-center gap-md py-lg">
      <Loader2 className="w-10 h-10 text-accent animate-spin" />
      <p className="text-small text-gray-700 font-medium">Analyzing your screenshot...</p>
    </div>
  )
}
