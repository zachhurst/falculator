import { AlertCircle, RefreshCw } from 'lucide-react'

interface ErrorMessageProps {
  message: string
  onRetry?: () => void
}

export function ErrorMessage({ message, onRetry }: ErrorMessageProps) {
  return (
    <div className="w-full max-w-lg mx-auto mt-lg">
      <div className="bg-white border border-gray-700 p-md">
        <div className="flex items-start gap-md">
          <AlertCircle className="w-6 h-6 text-black flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <h3 className="text-h4 uppercase-mds letter-spacing-tight text-black">Error</h3>
            <p className="mt-1 text-small text-gray-700">{message}</p>
            {onRetry && (
              <button
                onClick={onRetry}
                className="mt-md btn-secondary-mds uppercase-mds hover:opacity-90 transition-opacity inline-flex items-center gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                Try Again
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
