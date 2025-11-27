import { useState, useEffect } from 'react'
import { Image, ChevronLeft, ChevronRight, Monitor, Video } from 'lucide-react'

interface ExamplesModalProps {
  isOpen: boolean
  onClose: () => void
}

interface Example {
  id: string
  title: string
  icon: typeof Monitor
  inputImage: string
  pricingModel: string
  baseCost: string
  description: string
  results: {
    headers: string[]
    rows: string[][]
  }
}

const EXAMPLES: Example[] = [
  {
    id: 'megapixel',
    title: 'Per Megapixel Pricing',
    icon: Monitor,
    inputImage: 'https://micxjfgioqawfvwsxqfe.supabase.co/storage/v1/object/public/images/per%20megapixel%20resolution%20dropdown%20test.png',
    pricingModel: 'PER MEGAPIXEL',
    baseCost: '$0.0050',
    description: 'Image generation models charge per megapixel. Costs scale with output resolution.',
    results: {
      headers: ['Resolution', 'Megapixels', 'Cost/Image', 'Runs/$10'],
      rows: [
        ['Default (0×0)', '0.00', '$0.0050', '2000'],
        ['Square HD (1024×1024)', '1.05', '$0.0052', '1907'],
        ['Portrait 3:4 (768×1024)', '0.79', '$0.0039', '2543'],
        ['Portrait 9:16 (576×1024)', '0.59', '$0.0029', '3390'],
        ['Landscape 4:3 (1024×768)', '0.79', '$0.0039', '2543'],
        ['Landscape 16:9 (1024×576)', '0.59', '$0.0029', '3390'],
      ]
    }
  },
  {
    id: 'video',
    title: 'Per Second Video Pricing',
    icon: Video,
    inputImage: 'https://micxjfgioqawfvwsxqfe.supabase.co/storage/v1/object/public/images/per%20second%20video%20resolution%20dropdown%20test.png',
    pricingModel: 'PER SECOND VIDEO',
    baseCost: '$0.04',
    description: 'Video generation models charge per second of output video.',
    results: {
      headers: ['Resolution', 'Dimensions', 'Aspect Ratio'],
      rows: [
        ['Default', '854×480', '427:240'],
        ['1080p', '1920×1080', '16:9'],
        ['1440p', '2560×1440', '16:9'],
        ['2160p', '3840×2160', '16:9'],
      ]
    }
  }
]

export function ExamplesModal({ isOpen, onClose }: ExamplesModalProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const example = EXAMPLES[currentIndex]

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

  const nextExample = () => {
    setCurrentIndex((prev) => (prev + 1) % EXAMPLES.length)
  }

  const prevExample = () => {
    setCurrentIndex((prev) => (prev - 1 + EXAMPLES.length) % EXAMPLES.length)
  }

  if (!isOpen) return null

  const Icon = example.icon

  return (
    <div className="fixed inset-0 z-50 bg-black/80 flex flex-col">
      <div className="bg-white flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-300">
          <div className="flex items-center gap-2">
            <Image className="w-5 h-5 text-accent" />
            <h2 className="text-h4 uppercase-mds letter-spacing-tight">Example Results</h2>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-small text-gray-700">
              {currentIndex + 1} of {EXAMPLES.length}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Example Title */}
          <div className="flex items-center gap-3 p-4 border-b border-gray-300">
            <div className="p-2 bg-gray-100">
              <Icon className="w-5 h-5 text-accent" />
            </div>
            <div>
              <h3 className="text-h4 uppercase-mds letter-spacing-tight">{example.title}</h3>
              <p className="text-small text-gray-700">{example.description}</p>
            </div>
          </div>

          {/* Main Content - Scrollable */}
          <div className="flex-1 overflow-y-auto">
            {/* Input Screenshot at top */}
            <div className="p-4 border-b border-gray-300">
              <h4 className="text-small uppercase-mds font-medium text-gray-700 mb-2">Input Screenshot</h4>
              <div className="bg-gray-50 p-4 flex justify-center">
                <img 
                  src={example.inputImage} 
                  alt={`${example.title} input`}
                  className="max-w-full h-auto max-h-96 object-contain"
                />
              </div>
            </div>

            {/* Results Section */}
            <div className="p-4">
              <h4 className="text-small uppercase-mds font-medium text-gray-700 mb-4">Parsed Results</h4>
              
              {/* Pricing Model Header */}
              <div className="flex items-center justify-between p-4 bg-gray-50 border border-gray-300 mb-4">
                <div>
                  <p className="text-small text-gray-700">Pricing Model</p>
                  <p className="text-h4 uppercase-mds letter-spacing-tight">{example.pricingModel}</p>
                </div>
                <div className="text-right">
                  <p className="text-small text-gray-700">Base Cost</p>
                  <p className="text-h4 text-accent">{example.baseCost}</p>
                </div>
              </div>

              {/* Results Table */}
              <div className="border border-gray-300 overflow-hidden max-w-2xl">
                <table className="w-full text-small">
                  <thead className="bg-gray-100">
                    <tr>
                      {example.results.headers.map((header, i) => (
                        <th 
                          key={i} 
                          className="px-3 py-3 text-left text-small uppercase-mds font-medium text-gray-700 border-b border-gray-300"
                        >
                          {header}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {example.results.rows.map((row, rowIndex) => (
                      <tr key={rowIndex} className={rowIndex % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                        {row.map((cell, cellIndex) => (
                          <td 
                            key={cellIndex} 
                            className="px-3 py-2 text-small border-b border-gray-200"
                          >
                            {cell}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          </div>

        {/* Navigation */}
        <div className="flex items-center justify-between p-4 border-t border-gray-300 bg-white">
          <button
            onClick={prevExample}
            className="flex items-center gap-1 px-3 py-2 text-small uppercase-mds text-gray-700 hover:text-black transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            Previous
          </button>
          
          {/* Dots */}
          <div className="flex items-center gap-2">
            {EXAMPLES.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-2 h-2 transition-colors ${
                  index === currentIndex ? 'bg-accent' : 'bg-gray-300 hover:bg-gray-400'
                }`}
              />
            ))}
          </div>

          <button
            onClick={nextExample}
            className="flex items-center gap-1 px-3 py-2 text-small uppercase-mds text-gray-700 hover:text-black transition-colors"
          >
            Next
            <ChevronRight className="w-4 h-4" />
          </button>
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
