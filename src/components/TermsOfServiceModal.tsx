import { useEffect } from 'react'
import { FileText } from 'lucide-react'

interface TermsOfServiceModalProps {
  isOpen: boolean
  onClose: () => void
}

export function TermsOfServiceModal({ isOpen, onClose }: TermsOfServiceModalProps) {
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
            <FileText className="w-5 h-5 text-accent" />
            <h2 className="text-h4 uppercase-mds letter-spacing-tight">Terms of Service</h2>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          <p className="text-small text-gray-500">Last updated: November 27, 2024</p>

          <section className="space-y-2">
            <h3 className="text-body font-medium">The Short Version</h3>
            <p className="text-small text-gray-700 leading-relaxed">
              Fal-culator is a free utility tool provided as-is. You bring your own API key, 
              you're responsible for your usage. We don't guarantee accuracy. Be reasonable.
            </p>
          </section>

          <section className="space-y-2">
            <h3 className="text-body font-medium">What This Tool Does</h3>
            <p className="text-small text-gray-700 leading-relaxed">
              Fal-culator parses screenshots of fal.ai pricing pages and extracts cost information. 
              It uses your chosen AI provider (Google Gemini or Fal.ai) to analyze images and return structured pricing data.
            </p>
          </section>

          <section className="space-y-2">
            <h3 className="text-body font-medium">Your Responsibilities</h3>
            <ul className="text-small text-gray-700 space-y-1 list-disc list-inside">
              <li>You must provide your own API key (BYOK) - Gemini or Fal.ai</li>
              <li>You are responsible for your API usage and any associated costs</li>
              <li>You agree to use this tool for lawful purposes only</li>
              <li>You won't attempt to abuse, overload, or exploit the service</li>
              <li>You won't use this tool to process inappropriate or harmful content</li>
            </ul>
          </section>

          <section className="space-y-2">
            <h3 className="text-body font-medium">No Warranties</h3>
            <p className="text-small text-gray-700 leading-relaxed">
              This tool is provided "as is" without any warranties. We don't guarantee:
            </p>
            <ul className="text-small text-gray-700 space-y-1 list-disc list-inside">
              <li>Accuracy of parsed pricing information</li>
              <li>Availability or uptime of the service</li>
              <li>Compatibility with all fal.ai pricing formats</li>
              <li>That the tool will meet your specific needs</li>
            </ul>
            <p className="text-small text-gray-700 leading-relaxed">
              Always verify pricing directly with fal.ai before making decisions based on this tool's output.
            </p>
          </section>

          <section className="space-y-2">
            <h3 className="text-body font-medium">Limitation of Liability</h3>
            <p className="text-small text-gray-700 leading-relaxed">
              To the maximum extent permitted by law, we are not liable for any damages arising from:
            </p>
            <ul className="text-small text-gray-700 space-y-1 list-disc list-inside">
              <li>Use or inability to use this tool</li>
              <li>Inaccurate pricing information</li>
              <li>API costs incurred through your chosen provider</li>
              <li>Any decisions made based on this tool's output</li>
            </ul>
          </section>

          <section className="space-y-2">
            <h3 className="text-body font-medium">Intellectual Property</h3>
            <p className="text-small text-gray-700 leading-relaxed">
              "fal.ai" is a trademark of fal.ai. This tool is not affiliated with, endorsed by, 
              or officially connected to fal.ai. It's an independent utility created to help 
              users understand fal.ai pricing.
            </p>
          </section>

          <section className="space-y-2">
            <h3 className="text-body font-medium">Changes to Terms</h3>
            <p className="text-small text-gray-700 leading-relaxed">
              We may update these terms occasionally. Continued use of the tool after changes 
              constitutes acceptance of the new terms.
            </p>
          </section>

          <section className="space-y-2">
            <h3 className="text-body font-medium">Open Source</h3>
            <p className="text-small text-gray-700 leading-relaxed">
              This project is open source and available on GitHub. You're welcome to fork, 
              modify, or contribute to the project under its license terms.
            </p>
          </section>

          <section className="space-y-2">
            <h3 className="text-body font-medium">Contact</h3>
            <p className="text-small text-gray-700 leading-relaxed">
              This project is maintained by an individual developer. For questions or concerns, 
              please check the GitHub repository.
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
