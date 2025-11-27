import { useState, useCallback } from 'react'
import { Calculator, Image } from 'lucide-react'
import { ImageUploader } from '@/components/ImageUploader'
import { ResultsDisplay } from '@/components/ResultsDisplay'
import { LoadingSpinner } from '@/components/LoadingSpinner'
import { ErrorMessage } from '@/components/ErrorMessage'
import { AdvancedSettings } from '@/components/AdvancedSettings'
import { Lightbox } from '@/components/Lightbox'
import { ExamplesModal } from '@/components/ExamplesModal'
import { PrivacyPolicyModal } from '@/components/PrivacyPolicyModal'
import { TermsOfServiceModal } from '@/components/TermsOfServiceModal'
import { parseImage, fileToBase64 } from '@/lib/api'
import type { AnyPriceData, ApiKeyConfig } from '@/lib/api'

type AppState = 'idle' | 'loading' | 'success' | 'error'

function App() {
  const [state, setState] = useState<AppState>('idle')
  const [result, setResult] = useState<AnyPriceData | null>(null)
  const [error, setError] = useState<string>('')
  const [apiKeyConfig, setApiKeyConfig] = useState<ApiKeyConfig | undefined>()
  const [isLightboxOpen, setIsLightboxOpen] = useState(false)
  const [isExamplesModalOpen, setIsExamplesModalOpen] = useState(false)
  const [isPrivacyModalOpen, setIsPrivacyModalOpen] = useState(false)
  const [isTermsModalOpen, setIsTermsModalOpen] = useState(false)
  const [clearTrigger, setClearTrigger] = useState(0)

  // BYOK solution - always require user key
  const isUploadDisabled = !apiKeyConfig;

  const handleImageSelect = useCallback(async (file: File) => {
    setState('loading')
    setError('')
    setResult(null)

    try {
      const base64 = await fileToBase64(file)
      const response = await parseImage(base64, apiKeyConfig)

      if (response.success && response.data) {
        setResult(response.data)
        setState('success')
      } else {
        setError(response.error || 'Failed to parse image')
        setState('error')
      }
    } catch (err) {
      setError('An unexpected error occurred')
      setState('error')
    }
  }, [apiKeyConfig])

  const handleClearResults = useCallback(() => {
    setState('idle')
    setError('')
    setResult(null)
    // Trigger image clear in ImageUploader via increment
    setClearTrigger(prev => prev + 1)
  }, [])

  const handleRetry = useCallback(() => {
    setState('idle')
    setResult(null)
    setError('')
  }, [])

  return (
    <div className="min-h-screen bg-background">
      {/* BANNER */}
      <header className="w-full bg-white border-b border-gray-300">
        <div className="max-w-5xl mx-auto px-4 py-4">
          <img 
            src="https://micxjfgioqawfvwsxqfe.supabase.co/storage/v1/object/public/images/falculator_logo_banner.jpeg"
            alt="Fal-culator Logo Banner"
            className="w-3/4 h-auto object-contain mx-auto"
          />
        </div>
      </header>

      {/* HERO SECTION - Two Column Layout */}
      <section className="flex flex-col lg:flex-row py-4 lg:py-6 max-w-5xl mx-auto px-4 justify-center">
        
        {/* LEFT COLUMN - How It Started */}
        <aside className="lg:w-[38%] bg-white text-black p-4 lg:p-6">
          <div className="flex flex-col h-full justify-center">
            <h2 className="text-h4 uppercase-mds letter-spacing-tight text-gray-900 mb-2">
              How It Started
            </h2>
            <h3 className="text-2xl font-medium text-black mb-4">
              From Tweet to Tool in 48 Hours
            </h3>
            <p className="text-small text-gray-700 mb-4 leading-relaxed">
              A Twitter conversation about confusing fal.ai pricing turned into a Thanksgiving weekend project. Two days later, Fal-culator was born.
            </p>
            <div className="border border-gray-300 cursor-pointer hover:border-gray-500 transition-colors"
                 onClick={() => setIsLightboxOpen(true)}>
              <img 
                src="https://micxjfgioqawfvwsxqfe.supabase.co/storage/v1/object/public/images/how_it_started.jpeg" 
                alt="How Fal-culator started - from a Twitter conversation to a working product"
                className="w-full h-auto"
              />
              <div className="mt-2 text-center">
                <p className="text-small text-gray-700">Click to Enlarge</p>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-gray-300">
              <p className="text-small text-gray-700">
                Supports: Images • Video • GPU Time • Mixed Models
              </p>
            </div>
          </div>
        </aside>

        {/* RIGHT COLUMN - Branding & Features */}
        <aside className="lg:w-[62%] p-4 lg:p-8 flex items-center">
          <div className="w-full">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-charcoal/10">
                <Calculator className="w-8 h-8 text-accent" />
              </div>
              <h1 className="text-3xl font-medium uppercase tracking-wide">Fal-culator</h1>
            </div>
            <h2 className="text-2xl font-medium mb-3">Stop Guessing. Start Creating.</h2>
            <p className="text-body text-gray-700 mb-6">
              Instantly calculate the *exact* cost for any fal.ai model across images, video, and GPU time. Decode complex pricing from per-megapixel to per-second billing, with full resolution breakdowns for optimal cost-performance decisions—and keep everything powered by your own API key (BYOK) with your choice of Google Gemini or Fal.ai providers.
            </p>
            
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-charcoal/10">
                  <Calculator className="w-5 h-5 text-accent" />
                </div>
                <div>
                  <h3 className="text-h4 uppercase-mds letter-spacing-tight mb-1">Decode Complex Pricing Models</h3>
                  <p className="text-small text-gray-700">We decode per-megapixel, per-second GPU time, video duration billing, and mixed pricing units into clear cost-per-generation analysis.</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="p-2 bg-charcoal/10">
                  <div className="w-5 h-5 text-accent flex items-center justify-center">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                  </div>
                </div>
                <div>
                  <h3 className="text-h4 uppercase-mds letter-spacing-tight mb-1">Complete Cost Analysis in One Shot</h3>
                  <p className="text-small text-gray-700">A single screenshot reveals full cost tables across all resolutions, video durations, and GPU configurations.</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="p-2 bg-charcoal/10">
                  <div className="w-5 h-5 text-accent flex items-center justify-center">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
                    </svg>
                  </div>
                </div>
                <div>
                  <h3 className="text-h4 uppercase-mds letter-spacing-tight mb-1">Universal fal.ai Pricing Engine</h3>
                  <p className="text-small text-gray-700">Built for the complete fal ecosystem: image generation, video processing, GPU time billing, and free tiers.</p>
                </div>
              </div>
            </div>
            
            <div className="mt-6 flex flex-col sm:flex-row gap-4">
              <a 
                href="#tool-section"
                className="btn-primary-mds inline-flex items-center justify-center gap-2 px-6 py-3 hover:opacity-90 transition-opacity font-medium"
              >
                Try Fal-culator
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
              </a>
              
              <button
                onClick={() => setIsExamplesModalOpen(true)}
                className="btn-primary-mds inline-flex items-center justify-center gap-2 px-6 py-3 hover:opacity-90 transition-opacity font-medium"
              >
                <Image className="w-4 h-4" />
                See Examples
              </button>
            </div>
          </div>
        </aside>
      </section>

      {/* TOOL SECTION - Full Width */}
      <section id="tool-section" className="py-6 px-6 lg:px-10 max-w-4xl mx-auto">
        <div className="text-center mb-6">
          <h2 className="text-h2 mb-2">Calculate Your Costs</h2>
          <p className="text-body text-gray-700 max-w-lg mx-auto">
            Upload any fal.ai pricing screenshot to get instant cost breakdowns for all resolutions and pricing models. Bring your own Gemini Flash 2.0 key to stay on your quota and bypass shared rate limits.
          </p>
        </div>

        <div className="space-y-4">
              <AdvancedSettings 
                onApiKeyChange={setApiKeyConfig}
                disabled={state === 'loading'}
                forceOpen={true}
                required={true}
              />

              <ImageUploader 
                onImageSelect={handleImageSelect}
                onImageClear={handleClearResults}
                clearTrigger={clearTrigger}
                disabled={state === 'loading' || isUploadDisabled}
              />

              {isUploadDisabled && (
                <div className="text-center">
                  <p className="text-small text-gray-700">
                    Please add your API key above to enable image uploads
                  </p>
                </div>
              )}
              {state === 'loading' && <LoadingSpinner />}
              {state === 'success' && result && (
                <ResultsDisplay data={result} onClear={handleClearResults} />
              )}
              {state === 'error' && (
                <ErrorMessage message={error} onRetry={handleRetry} />
              )}
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-8 border-t border-gray-200 text-center space-y-3">
        <p className="text-small text-gray-500">
          Upload any fal.ai pricing screenshot - images, video, GPU time, or mixed models
        </p>
        <div className="flex items-center justify-center gap-4 text-small">
          <button
            onClick={() => setIsPrivacyModalOpen(true)}
            className="text-gray-500 hover:text-black transition-colors"
          >
            Privacy Policy
          </button>
          <span className="text-gray-300">|</span>
          <button
            onClick={() => setIsTermsModalOpen(true)}
            className="text-gray-500 hover:text-black transition-colors"
          >
            Terms of Service
          </button>
        </div>
        <p className="text-xs text-gray-400 max-w-md mx-auto">
          <strong>Disclaimer:</strong> Fal-culator is an independent utility tool and is not affiliated with, endorsed by, or officially connected to fal.ai.
        </p>
      </footer>

      {/* LIGHTBOX */}
      <Lightbox
        isOpen={isLightboxOpen}
        onClose={() => setIsLightboxOpen(false)}
        imageSrc="https://micxjfgioqawfvwsxqfe.supabase.co/storage/v1/object/public/images/how_it_started.jpeg"
        imageAlt="How Fal-culator started - from a Twitter conversation to a working product"
      />

      {/* EXAMPLES MODAL */}
      <ExamplesModal
        isOpen={isExamplesModalOpen}
        onClose={() => setIsExamplesModalOpen(false)}
      />

      {/* PRIVACY POLICY MODAL */}
      <PrivacyPolicyModal
        isOpen={isPrivacyModalOpen}
        onClose={() => setIsPrivacyModalOpen(false)}
      />

      {/* TERMS OF SERVICE MODAL */}
      <TermsOfServiceModal
        isOpen={isTermsModalOpen}
        onClose={() => setIsTermsModalOpen(false)}
      />
    </div>
  )
}

export default App
// Trigger new build for env vars
