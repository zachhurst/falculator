import { useEffect } from 'react'
import { HelpCircle, DollarSign, Shield, Zap, Settings, CheckCircle } from 'lucide-react'

interface FAQModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function FAQModal({ isOpen, onClose }: FAQModalProps) {
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

  if (!isOpen) return null;

  const faqItems = [
    {
      icon: DollarSign,
      question: "How much does it cost to use Fal-culator?",
      answer: "Fal-culator is completely free to use. You only pay for the AI API calls you make:\n\n• Google Gemini 2.0 Flash: $0.10 per 1M input tokens, $0.40 per 1M output tokens (with a generous free tier)\n• Fal.ai (via OpenRouter Vision): Approximately $0.40 per 1M tokens (token-based billing, includes provider markup)\n\nTypical screenshot analysis costs between $0.0005 and $0.002 per request (less than a penny). Pricing is subject to change—please verify current rates with providers.\n\nYou can use your own API keys (BYOK) to leverage your existing credits and quotas, or use our shared service with rate limits for occasional use."
    },
    {
      icon: Settings,
      question: "What's the difference between Google Gemini and Fal.ai providers?",
      answer: "Both providers use powerful vision language models but have different advantages:\n\n• Google Gemini 2.0 Flash: Direct API access via Google AI Studio, extremely cost-effective with a generous free tier, great for developers already using Google's ecosystem\n• Fal.ai (via OpenRouter Vision): Uses Gemini 2.5 Flash through OpenRouter, ideal for fal.ai users who already have credits, unified billing with your fal.ai account\n\nBoth provide excellent accuracy for pricing extraction. Choose based on your existing API keys, billing preferences, or whether you're already a fal.ai user analyzing their models."
    },
    {
      icon: Shield,
      question: "Do you store my API keys or images?",
      answer: "No, we never store your data:\n\n• API keys are stored only in your browser's localStorage and never leave your device except when making direct API calls to Google or Fal.ai\n• Images are processed in real-time but never saved to our servers\n• Your keys are transmitted directly to the respective providers (Google AI or Fal.ai) over encrypted connections\n• We have no backend database, no analytics, no tracking, and no data collection of any kind\n\nYour privacy and security are our top priorities. The application runs entirely client-side, and all data remains under your control."
    },
    {
      icon: Zap,
      question: "What pricing models are supported?",
      answer: "Fal-culator supports all fal.ai pricing models:\n\n• PER_MEGAPIXEL - Resolution-based image generation (e.g., FLUX models)\n• PER_IMAGE - Flat rate per image generation\n• PER_SECOND_GPU - GPU time-based billing\n• PER_SECOND_VIDEO - Video duration-based pricing\n• PER_VIDEO - Per video clip pricing\n• FREE - Free tier models with usage limits\n\nThe tool automatically detects the pricing model type from your screenshot and calculates costs accordingly. For resolution-based models, it can even show cost breakdowns across all available resolution options if you capture them in your screenshot."
    },
    {
      icon: HelpCircle,
      question: "Why do I need my own API key?",
      answer: "Using your own API key (BYOK - Bring Your Own Key) has several benefits:\n\n• Unlimited usage without rate limits imposed by our shared service\n• You stay on your own pricing quotas and billing (especially valuable if you have free tier access)\n• Faster processing with dedicated API access\n• No dependency on our shared service availability or limits\n• For fal.ai users: unified billing with your existing fal.ai credits\n\nHowever, you can also use our shared service with generous rate limits for occasional use without setting up your own API key. Perfect for quick calculations or trying out the tool."
    },
    {
      icon: CheckCircle,
      question: "How accurate is the pricing extraction?",
      answer: "Fal-culator achieves high accuracy on clear fal.ai pricing screenshots:\n\n• Automatically detects pricing model types (per-megapixel, per-image, per-second, etc.)\n• Extracts exact costs, currency, and units from the screenshot\n• Handles complex resolution-based pricing with multiple options\n• Provides per-image cost calculations and bulk pricing estimates\n• Uses advanced vision language models (Gemini 2.0/2.5 Flash) with structured output for reliable extraction\n\nFor best results, capture clear screenshots that show the complete pricing information. For resolution-based models, include the resolution dropdown options in your screenshot to see cost breakdowns across all available sizes."
    }
  ];

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div className="bg-white max-w-2xl w-full max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center p-4 border-b border-gray-300 shrink-0">
          <div className="flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-accent" />
            <h2 className="text-h4 uppercase-mds letter-spacing-tight">Frequently Asked Questions</h2>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {faqItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <section key={index} className="space-y-2">
                <div className="flex items-center gap-2">
                  <Icon className="w-4 h-4 text-accent" />
                  <h3 className="text-body font-medium">{item.question}</h3>
                </div>
                <div className="text-small text-gray-700 leading-relaxed whitespace-pre-line pl-6">
                  {item.answer}
                </div>
              </section>
            );
          })}

          <div className="pt-4 border-t border-gray-300">
            <p className="text-body font-medium mb-2">Still have questions?</p>
            <p className="text-small text-gray-700 mb-4">
              Can't find the answer you're looking for? Check the GitHub repository for more information or to report issues.
            </p>
            <a
              href="https://github.com/zachhurst/falculator"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 text-small font-medium border transition-colors"
              style={{ backgroundColor: '#000000', color: '#FFFFFF', borderColor: '#000000' }}
              onMouseOver={(e) => {
                e.currentTarget.style.backgroundColor = '#333333';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.backgroundColor = '#000000';
              }}
            >
              <HelpCircle className="w-4 h-4" />
              Visit GitHub Repository
            </a>
          </div>
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
  );
}
