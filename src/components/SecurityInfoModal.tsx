import { useEffect } from 'react'
import { Shield, Lock, Server, Eye } from 'lucide-react'

interface SecurityInfoModalProps {
  isOpen: boolean
  onClose: () => void
}

export function SecurityInfoModal({ isOpen, onClose }: SecurityInfoModalProps) {
  
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
        <div className="flex items-center p-4 border-b border-gray-300">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-accent" />
            <h2 className="text-h4 uppercase-mds letter-spacing-tight">API Key Security</h2>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 space-y-4">
          {/* Main paragraph */}
          <p className="text-body text-gray-700 leading-relaxed">
            When you bring your own API key (Google Gemini or Fal.ai), it is sent from your browser to our Supabase Edge Function over HTTPS, then immediately forwarded to your chosen provider. Your key is transmitted in a secure header and our backend does not store, log, or persist it in any way. The edge function code is open source so you can verify this behavior.
          </p>

          {/* Security Features */}
          <div className="space-y-3 pt-2">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-gray-100">
                <Lock className="w-4 h-4 text-accent" />
              </div>
              <div>
                <h3 className="text-small font-medium uppercase-mds text-black">Encrypted in Transit</h3>
                <p className="text-small text-gray-700 mt-1">
                  Your API key travels via HTTPS from your browser → our edge function → your provider. Headers (<code className="bg-gray-100 px-1">x-gemini-key</code> or <code className="bg-gray-100 px-1">x-falai-key</code>) are encrypted in transit at every hop.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="p-2 bg-gray-100">
                <Server className="w-4 h-4 text-accent" />
              </div>
              <div>
                <h3 className="text-small font-medium uppercase-mds text-black">Zero Server Storage</h3>
                <p className="text-small text-gray-700 mt-1">
                  Your key is never saved to databases or logs. It passes through our edge function in memory only, then is immediately discarded. Locally, keys are stored in your browser's localStorage for convenience—clear them anytime via Advanced Settings.
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
              <strong className="text-black">Bottom line:</strong> Your key passes through our open-source edge function but is never stored or logged. You maintain full control over your API quota and billing.
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
