import { useState, useCallback } from 'react'
import { Calculator } from 'lucide-react'
import { ImageUploader } from '@/components/ImageUploader'
import { ResultsDisplay } from '@/components/ResultsDisplay'
import { LoadingSpinner } from '@/components/LoadingSpinner'
import { ErrorMessage } from '@/components/ErrorMessage'
import { parseImage, fileToBase64 } from '@/lib/api'
import type { PriceData } from '@/lib/api'

type AppState = 'idle' | 'loading' | 'success' | 'error'

function App() {
  const [state, setState] = useState<AppState>('idle')
  const [result, setResult] = useState<PriceData | null>(null)
  const [error, setError] = useState<string>('')

  const handleImageSelect = useCallback(async (file: File) => {
    setState('loading')
    setError('')
    setResult(null)

    try {
      const base64 = await fileToBase64(file)
      const response = await parseImage(base64)

      if (response.success && response.data) {
        setResult(response.data)
        setState('success')
      } else {
        setError(response.error || 'Could not find pricing information in the image.')
        setState('error')
      }
    } catch {
      setError('An unexpected error occurred. Please try again.')
      setState('error')
    }
  }, [])

  const handleRetry = useCallback(() => {
    setState('idle')
    setResult(null)
    setError('')
  }, [])

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Header */}
        <header className="text-center mb-12">
          <div className="inline-flex items-center justify-center gap-3 mb-4">
            <div className="p-3 rounded-xl bg-primary/10">
              <Calculator className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-4xl font-bold text-foreground">Fal-culator</h1>
          </div>
          <p className="text-lg text-muted-foreground max-w-md mx-auto">
            Upload a screenshot of fal.ai pricing to instantly see the cost breakdown
          </p>
        </header>

        {/* Main Content */}
        <main>
          <ImageUploader 
            onImageSelect={handleImageSelect}
            disabled={state === 'loading'}
          />

          {state === 'loading' && <LoadingSpinner />}
          
          {state === 'success' && result && (
            <ResultsDisplay data={result} />
          )}
          
          {state === 'error' && (
            <ErrorMessage message={error} onRetry={handleRetry} />
          )}
        </main>

        {/* Footer */}
        <footer className="mt-16 text-center text-sm text-muted">
          <p>Upload a screenshot containing fal.ai model pricing information</p>
        </footer>
      </div>
    </div>
  )
}

export default App
