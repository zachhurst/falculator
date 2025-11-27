import { DollarSign, Hash, Calculator } from 'lucide-react'
import type { PriceData } from '@/lib/api'

interface ResultsDisplayProps {
  data: PriceData
}

export function ResultsDisplay({ data }: ResultsDisplayProps) {
  const formattedCost = data.cost_per_image < 0.01 
    ? `$${data.cost_per_image.toFixed(4)}`
    : `$${data.cost_per_image.toFixed(2)}`

  return (
    <div className="w-full max-w-lg mx-auto mt-8">
      <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
        <div className="p-4 bg-primary/5 border-b border-border">
          <div className="flex items-center gap-2">
            <Calculator className="w-5 h-5 text-primary" />
            <h2 className="font-semibold text-foreground">Pricing Breakdown</h2>
          </div>
        </div>
        
        <div className="p-6 space-y-6">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-lg bg-green-100">
              <DollarSign className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Cost per Image</p>
              <p className="text-2xl font-bold text-foreground">{formattedCost}</p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="p-3 rounded-lg bg-blue-100">
              <Hash className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Runs per Dollar</p>
              <p className="text-2xl font-bold text-foreground">{data.runs_per_dollar} runs</p>
            </div>
          </div>

          <div className="pt-4 border-t border-border">
            <p className="text-sm text-muted-foreground text-center">
              For <span className="font-semibold text-foreground">$10.00</span>, you can run this model{' '}
              <span className="font-semibold text-foreground">{data.runs_per_dollar * 10}</span> times
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
