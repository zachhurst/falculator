import { useEffect, useState, useCallback, useRef } from 'react'
import { X, Play, ExternalLink } from 'lucide-react'

interface VideoPlayerModalProps {
  isOpen: boolean
  onClose: () => void
  videoId?: string
}

export function VideoPlayerModal({ 
  isOpen, 
  onClose, 
  videoId = 'oFBCk4kd8MA' 
}: VideoPlayerModalProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [isVisible, setIsVisible] = useState(false)
  const [isExiting, setIsExiting] = useState(false)
  const exitTimeoutRef = useRef<number | null>(null)

  // Handle entrance animation
  useEffect(() => {
    if (isOpen) {
      setIsVisible(true)
      setIsExiting(false)
      setIsLoading(true)

      if (exitTimeoutRef.current !== null) {
        window.clearTimeout(exitTimeoutRef.current)
        exitTimeoutRef.current = null
      }
      return
    }

    if (!isOpen && isVisible) {
      setIsExiting(true)
      exitTimeoutRef.current = window.setTimeout(() => {
        setIsVisible(false)
        setIsExiting(false)
        exitTimeoutRef.current = null
      }, 300)
    }

    return () => {
      if (exitTimeoutRef.current !== null) {
        window.clearTimeout(exitTimeoutRef.current)
        exitTimeoutRef.current = null
      }
    }
  }, [isOpen, isVisible])

  // Handle exit animation
  const handleClose = useCallback(() => {
    onClose()
  }, [onClose])

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
        handleClose()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, handleClose])

  if (!isOpen && !isVisible) return null

  return (
    <div 
      role="dialog"
      aria-modal="true"
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-8 overflow-y-auto transition-all duration-300 ${
        isExiting ? 'opacity-0' : 'opacity-100'
      }`}
      onClick={(e) => {
        if (e.target === e.currentTarget) handleClose()
      }}
    >
      {/* Cinematic backdrop with blur */}
      <div 
        className={`absolute inset-0 transition-all duration-500 ${
          isExiting ? 'opacity-0 backdrop-blur-none' : 'opacity-100 backdrop-blur-md'
        }`}
        style={{ 
          backgroundColor: 'rgba(0, 0, 0, 0.85)',
        }}
      />

      {/* Animated gradient orbs for visual interest */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div 
          className={`absolute -top-1/4 -left-1/4 w-1/2 h-1/2 rounded-full transition-all duration-1000 ${
            isExiting ? 'opacity-0 scale-50' : 'opacity-30 scale-100'
          }`}
          style={{ 
            background: 'radial-gradient(circle, #BF572A 0%, transparent 70%)',
            filter: 'blur(60px)',
          }}
        />
        <div 
          className={`absolute -bottom-1/4 -right-1/4 w-1/2 h-1/2 rounded-full transition-all duration-1000 delay-100 ${
            isExiting ? 'opacity-0 scale-50' : 'opacity-20 scale-100'
          }`}
          style={{ 
            background: 'radial-gradient(circle, #BF572A 0%, transparent 70%)',
            filter: 'blur(80px)',
          }}
        />
      </div>

      {/* Main content container */}
      <div 
        className={`relative w-full max-w-5xl transition-all duration-500 ease-out ${
          isExiting 
            ? 'opacity-0 scale-95 translate-y-4' 
            : 'opacity-100 scale-100 translate-y-0'
        }`}
      >
        {/* Header bar */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div 
              className="w-10 h-10 flex items-center justify-center"
              style={{ backgroundColor: '#BF572A' }}
            >
              <Play className="w-5 h-5 text-white ml-0.5" fill="white" />
            </div>
            <div>
              <h2 
                className="text-lg font-medium tracking-wide uppercase"
                style={{ color: '#FFFFFF' }}
              >
                Demo Video
              </h2>
              <p 
                className="text-xs tracking-wide"
                style={{ color: 'rgba(255,255,255,0.6)' }}
              >
                See Fal-culator in action
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <a
              href={`https://youtu.be/${videoId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-3 py-2 text-xs font-medium tracking-wide uppercase transition-all duration-200 hover:opacity-80"
              style={{ 
                color: '#BF572A',
                border: '1px solid #BF572A',
              }}
            >
              <ExternalLink className="w-3.5 h-3.5" />
              YouTube
            </a>
            <button
              onClick={handleClose}
              className="w-10 h-10 flex items-center justify-center transition-all duration-200 hover:opacity-80"
              style={{ 
                backgroundColor: 'rgba(255,255,255,0.1)',
                border: '1px solid rgba(255,255,255,0.2)',
              }}
              aria-label="Close video player"
            >
              <X className="w-5 h-5" style={{ color: '#FFFFFF' }} />
            </button>
          </div>
        </div>

        {/* Video container with cinematic frame */}
        <div 
          className="relative overflow-hidden"
          style={{ 
            border: '1px solid rgba(255,255,255,0.1)',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(191, 87, 42, 0.2)',
          }}
        >
          {/* Accent corner accents */}
          <div 
            className="absolute top-0 left-0 w-16 h-1 z-10"
            style={{ backgroundColor: '#BF572A' }}
          />
          <div 
            className="absolute top-0 left-0 w-1 h-16 z-10"
            style={{ backgroundColor: '#BF572A' }}
          />
          <div 
            className="absolute bottom-0 right-0 w-16 h-1 z-10"
            style={{ backgroundColor: '#BF572A' }}
          />
          <div 
            className="absolute bottom-0 right-0 w-1 h-16 z-10"
            style={{ backgroundColor: '#BF572A' }}
          />

          {/* Loading state */}
          {isLoading && (
            <div 
              className="absolute inset-0 flex items-center justify-center z-20"
              style={{ backgroundColor: '#000000' }}
            >
              <div className="relative">
                {/* Pulsing play button */}
                <div 
                  className="w-20 h-20 flex items-center justify-center animate-pulse"
                  style={{ backgroundColor: '#BF572A' }}
                >
                  <Play className="w-10 h-10 text-white ml-1" fill="white" />
                </div>
                {/* Loading ring */}
                <div 
                  className="absolute inset-0 animate-spin"
                  style={{ 
                    border: '2px solid transparent',
                    borderTopColor: '#BF572A',
                    animationDuration: '1s',
                  }}
                />
              </div>
              <p 
                className="absolute bottom-8 text-xs tracking-widest uppercase"
                style={{ color: 'rgba(255,255,255,0.5)' }}
              >
                Loading demo...
              </p>
            </div>
          )}

          {/* YouTube embed with 16:9 aspect ratio */}
          <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
            <iframe
              className="absolute inset-0 w-full h-full"
              src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1&color=white`}
              title="Fal-culator Demo Video"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              onLoad={() => setIsLoading(false)}
              style={{ border: 'none' }}
            />
          </div>
        </div>

        {/* Footer info bar */}
        <div 
          className="mt-4 flex items-center justify-between text-xs"
          style={{ color: 'rgba(255,255,255,0.4)' }}
        >
          <span className="tracking-wide">Press ESC to close</span>
          <span className="tracking-wide">
            Built with Gemini 2.0 Flash & Fal.ai
          </span>
        </div>
      </div>
    </div>
  )
}
