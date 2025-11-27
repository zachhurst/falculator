import { useEffect } from 'react'
import { X, Shield, Lock, Server, Eye } from 'lucide-react'

interface SecurityInfoModalProps {
  isOpen: boolean
  onClose: () => void
}

export function SecurityInfoModal({ isOpen, onClose }: SecurityInfoModalProps) {
  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return
      if (e.key === 'Escape') {
        onClose()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <div 
      className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div className="bg-white max-w-lg w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-300">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-accent" />
            <h2 className="text-h4 uppercase-mds letter-spacing-tight">API Key Security</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-gray-100 transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5 text-black" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-4">
          {/* Main paragraph */}
          <p className="text-body text-gray-700 leading-relaxed">
            When you bring your own Gemini API key, it flows directly from your browser to Google's servers — never touching our infrastructure. Your key is transmitted via a secure HTTPS connection and our backend simply forwards it to Google's API without storing or logging it.
          </p>

          {/* Security Features */}
          <div className="space-y-3 pt-2">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-gray-100">
                <Lock className="w-4 h-4 text-accent" />
              </div>
              <div>
                <h3 className="text-small font-medium uppercase-mds text-black">End-to-End Encryption</h3>
                <p className="text-small text-gray-700 mt-1">
                  Your API key is transmitted via HTTPS in the <code className="bg-gray-100 px-1">x-gemini-key</code> header, encrypted in transit.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="p-2 bg-gray-100">
                <Server className="w-4 h-4 text-accent" />
              </div>
              <div>
                <h3 className="text-small font-medium uppercase-mds text-black">Zero Storage</h3>
                <p className="text-small text-gray-700 mt-1">
                  Your key is never saved to our databases, logs, or any persistent storage. It exists only in your browser's memory during the session.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="p-2 bg-gray-100">
                <Eye className="w-4 h-4 text-accent" />
              </div>
              <div>
                <h3 className="text-small font-medium uppercase-mds text-black">Full Transparency</h3>
                <p className="text-small text-gray-700 mt-1">
                  This is an open-source project. You can inspect our code to verify exactly how your key is handled.
                </p>
              </div>
            </div>
          </div>

          {/* Summary */}
          <div className="bg-gray-50 p-3 mt-4 border-l-2 border-accent">
            <p className="text-small text-gray-700">
              <strong className="text-black">Bottom line:</strong> You maintain complete control over your API key usage and billing. We provide only the image parsing service.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-300">
          <button
            onClick={onClose}
            className="w-full py-2 bg-black text-white text-small font-medium uppercase-mds letter-spacing-cta hover:bg-gray-800 transition-colors"
          >
            Got It
          </button>
        </div>
      </div>
    </div>
  )
}
