import { useEffect } from 'react'
import { Shield } from 'lucide-react'

interface PrivacyPolicyModalProps {
  isOpen: boolean
  onClose: () => void
}

export function PrivacyPolicyModal({ isOpen, onClose }: PrivacyPolicyModalProps) {
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
      <div className="bg-white max-w-2xl w-full max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center p-4 border-b border-gray-300 shrink-0">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-accent" />
            <h2 className="text-h4 uppercase-mds letter-spacing-tight">Privacy Policy</h2>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          <p className="text-small text-gray-500">Last updated: November 27, 2025</p>

          <section className="space-y-2">
            <h3 className="text-body font-medium">The Short Version</h3>
            <p className="text-small text-gray-700 leading-relaxed">
              Fal-culator is a simple utility tool. We don't collect, store, or sell your data. 
              Your API keys stay in your browser. Images are processed but never stored.
            </p>
          </section>

          <section className="space-y-2">
            <h3 className="text-body font-medium">Data We Don't Collect</h3>
            <ul className="text-small text-gray-700 space-y-1 list-disc list-inside">
              <li>We don't use cookies or tracking pixels</li>
              <li>We don't use analytics services</li>
              <li>We don't collect personal information</li>
              <li>We don't store your uploaded images</li>
              <li>We don't log your API requests</li>
            </ul>
          </section>

          <section className="space-y-2">
            <h3 className="text-body font-medium">Your API Keys</h3>
            <p className="text-small text-gray-700 leading-relaxed">
              When you enter your API key (Google Gemini or Fal.ai), it is:
            </p>
            <ul className="text-small text-gray-700 space-y-1 list-disc list-inside">
              <li>Stored only in your browser's localStorage (on your device)</li>
              <li>Transmitted directly to your chosen provider via HTTPS</li>
              <li>Never stored on our servers or in any database</li>
              <li>Never logged or recorded</li>
            </ul>
            <p className="text-small text-gray-700 leading-relaxed">
              You can clear your saved key at any time using the "Clear saved key" button.
            </p>
          </section>

          <section className="space-y-2">
            <h3 className="text-body font-medium">Image Processing</h3>
            <p className="text-small text-gray-700 leading-relaxed">
              When you upload a screenshot:
            </p>
            <ul className="text-small text-gray-700 space-y-1 list-disc list-inside">
              <li>The image is converted to base64 in your browser</li>
              <li>It's sent to our Supabase Edge Function for processing</li>
              <li>The Edge Function forwards it to your chosen AI provider (Gemini or Fal.ai)</li>
              <li>Results are returned to your browser</li>
              <li>No images are stored at any point</li>
            </ul>
          </section>

          <section className="space-y-2">
            <h3 className="text-body font-medium">Third-Party Services</h3>
            <p className="text-small text-gray-700 leading-relaxed">
              We use these third-party services:
            </p>
            <ul className="text-small text-gray-700 space-y-1 list-disc list-inside">
              <li><strong>Supabase</strong> — Hosts our Edge Function (serverless processing)</li>
              <li><strong>Google Gemini</strong> — Processes images via your API key (when selected)</li>
              <li><strong>Fal.ai</strong> — Processes images via OpenRouter Vision (when selected)</li>
              <li><strong>Netlify</strong> — Hosts the website</li>
            </ul>
            <p className="text-small text-gray-700 leading-relaxed">
              Each service has their own privacy policy. Your use of API keys is governed by your chosen provider's terms.
            </p>
          </section>

          <section className="space-y-2">
            <h3 className="text-body font-medium">Open Source</h3>
            <p className="text-small text-gray-700 leading-relaxed">
              This project is open source. You can inspect exactly how your data is handled by 
              reviewing the code on GitHub.
            </p>
          </section>

          <section className="space-y-2">
            <h3 className="text-body font-medium">Contact</h3>
            <p className="text-small text-gray-700 leading-relaxed">
              Questions about this policy? The project is maintained by an individual developer. 
              Check the GitHub repository for contact information.
            </p>
          </section>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-300 shrink-0">
          <button
            onClick={onClose}
            className="w-full py-2 bg-black text-white text-small font-medium uppercase-mds letter-spacing-cta hover:bg-gray-800 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}
