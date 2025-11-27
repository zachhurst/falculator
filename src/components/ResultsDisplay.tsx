import { DollarSign, Hash, Calculator, Table, Monitor, Cpu, Copy, Check, RotateCcw } from 'lucide-react'
import type { AnyPriceData, PriceData, LegacyPriceData } from '@/lib/api'
import { isPriceDataV2 } from '@/lib/api'
import { calculateCostPerImage, calculateMegapixels } from '@/lib/utils'
import { useState } from 'react'

interface ResultsDisplayProps {
  data: AnyPriceData
  onClear?: () => void
}

export function ResultsDisplay({ data, onClear }: ResultsDisplayProps) {
  const isV2 = isPriceDataV2(data);
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const formatForExcel = (data: AnyPriceData): string => {
    // V1 Legacy Format
    if (!isPriceDataV2(data)) {
      const legacyData = data as LegacyPriceData;
      const formattedCost = legacyData.cost_per_image < 0.01 
        ? legacyData.cost_per_image.toFixed(4)
        : legacyData.cost_per_image.toFixed(2);
      
      return `Metric\tValue\nCost per Image\t${formattedCost}\nRuns per Dollar\t${legacyData.runs_per_dollar}\nRuns for $10\t${legacyData.runs_per_dollar * 10}`;
    }

    // V2 Enhanced Format
    const v2Data = data as PriceData;
    const { pricing_unit, base_cost, gpu_type, resolutions } = v2Data;

    let result = `Pricing Model\t${pricing_unit.replace(/_/g, ' ')}\n`;
    result += `Base Cost\t${pricing_unit === 'FREE' ? 'FREE' : base_cost < 0.01 ? base_cost.toFixed(4) : base_cost.toFixed(2)}\n`;
    
    if (gpu_type) {
      result += `GPU Type\t${gpu_type}\n`;
    }

    // Add resolution table for PER_MEGAPIXEL
    if (pricing_unit === 'PER_MEGAPIXEL' && resolutions && resolutions.length > 0) {
      result += `\nResolution\tMegapixels\tCost per Image\tRuns per $10\n`;
      
      resolutions.forEach((res) => {
        const cost = calculateCostPerImage(base_cost, pricing_unit, res.width, res.height);
        const runsPer10 = Math.floor(10 / cost);
        const megapixels = calculateMegapixels(res.width, res.height);
        const formattedCost = cost < 0.01 ? cost.toFixed(4) : cost.toFixed(2);
        
        result += `${res.name} (${res.width}×${res.height})\t${megapixels.toFixed(2)}\t${formattedCost}\t${runsPer10}\n`;
      });
    }

    // Add specific formatting for other pricing units
    if (pricing_unit === 'PER_IMAGE') {
      result += `\nCost Structure\tFlat rate per image\nCost per Image\t${base_cost.toFixed(2)}`;
    } else if (pricing_unit === 'FREE') {
      result += `\nCost Structure\tNo charges\nUsage\tUnlimited`;
    } else if (pricing_unit === 'PER_SECOND_GPU') {
      result += `\nCost Structure\tPer second of GPU time\nRate per Second\t${base_cost.toFixed(4)}`;
      if (gpu_type) {
        result += `\nGPU Type\t${gpu_type}`;
      }
      // Add resolution table for PER_SECOND_GPU if available
      if (resolutions && resolutions.length > 0) {
        result += `\n\nResolution\tPixels (MP)\tCost/Second\n`;
        resolutions.forEach((res) => {
          const megapixels = (res.width * res.height) / 1000000;
          result += `${res.name} (${res.width}×${res.height})\t${megapixels.toFixed(2)}\t${base_cost.toFixed(4)}\n`;
        });
      }
    } else if (['PER_SECOND_VIDEO', 'PER_VIDEO', 'UNKNOWN'].includes(pricing_unit)) {
      result += `\nCost Structure\tPer ${pricing_unit.replace(/_/g, ' ').toLowerCase()}\nBase Rate\t${base_cost.toFixed(4)}`;
      // Add resolution table for video pricing if valid resolutions available
      const validResolutions = resolutions?.filter((res) => res.width > 0 && res.height > 0) || [];
      if (validResolutions.length > 0) {
        result += `\n\nResolution\tDimensions\tAspect Ratio\n`;
        validResolutions.forEach((res) => {
          // Calculate aspect ratio for video models
          const gcd = (a: number, b: number): number => b === 0 ? a : gcd(b, a % b);
          const divisor = gcd(res.width, res.height);
          const aspectWidth = res.width / divisor;
          const aspectHeight = res.height / divisor;
          const aspectRatio = `${aspectWidth}:${aspectHeight}`;
          result += `${res.name}\t${res.width}×${res.height}\t${aspectRatio}\n`;
        });
      }
    }

    return result.trim();
  };
  
  // V1 Legacy Display
  if (!isV2) {
    const legacyData = data as LegacyPriceData;
    const formattedCost = legacyData.cost_per_image < 0.01 
      ? `$${legacyData.cost_per_image.toFixed(4)}`
      : `$${legacyData.cost_per_image.toFixed(2)}`;

    return (
      <div className="w-full max-w-lg mx-auto mt-lg">
        <div className="bg-white border border-gray-300 overflow-hidden">
          <div className="p-4 bg-gray-50 border-b border-gray-300">
            <div className="flex items-center gap-2">
              <Calculator className="w-5 h-5 text-accent" />
              <h2 className="text-h4 uppercase-mds letter-spacing-tight text-black">Pricing Breakdown</h2>
              <span className="ml-auto text-small text-gray-700 bg-yellow-50 px-2 py-1">Legacy Format</span>
            </div>
          </div>
          
          <div className="p-md space-y-lg">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-green-50">
                <DollarSign className="w-6 h-6 text-green-700" />
              </div>
              <div>
                <p className="text-small uppercase-mds text-gray-700">Cost per Image</p>
                <p className="text-2xl font-medium text-black">{formattedCost}</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="p-3 bg-blue-50">
                <Hash className="w-6 h-6 text-blue-700" />
              </div>
              <div>
                <p className="text-small uppercase-mds text-gray-700">Runs per Dollar</p>
                <p className="text-2xl font-medium text-black">{legacyData.runs_per_dollar} runs</p>
              </div>
            </div>

            <div className="pt-md border-t border-gray-300">
              <p className="text-small text-gray-700 text-center">
                For <span className="font-medium text-black">$10.00</span>, you can run this model{' '}
                <span className="font-medium text-black">{legacyData.runs_per_dollar * 10}</span> times
              </p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // V2 Enhanced Display
  const v2Data = data as PriceData;
  const { pricing_unit, base_cost, gpu_type, resolutions } = v2Data;

  return (
    <div className="w-full max-w-4xl mx-auto mt-lg">
      <div className="bg-white border border-gray-300 overflow-hidden">
        <div className="p-6 bg-gray-50 border-b border-gray-300">
          <div className="flex items-center gap-2">
            <Calculator className="w-5 h-5 text-accent" />
            <h2 className="text-h4 uppercase-mds letter-spacing-tight text-black">Pricing Analysis</h2>
            <div className="ml-auto flex items-center gap-2">
              <span className="text-small text-green-700 px-2 py-1 bg-green-50">Copy for Spreadsheet</span>
              <button
                onClick={() => copyToClipboard(formatForExcel(data))}
                className="flex items-center gap-2 px-3 py-1.5 text-small bg-black text-white hover:bg-gray-800 transition-colors"
                title="Copy for Excel"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    Copy
                  </>
                )}
              </button>
              {onClear && (
                <button
                  onClick={onClear}
                  className="flex items-center gap-2 px-3 py-1.5 text-small bg-gray-200 text-gray-700 hover:bg-gray-300 transition-colors"
                  title="Clear results and start over"
                >
                  <RotateCcw className="w-4 h-4" />
                  Clear
                </button>
              )}
            </div>
          </div>
        </div>
        
        <div className="p-6 space-y-6">
          {/* Pricing Unit Display */}
          <div className="flex items-start gap-4">
            <div className="p-3 bg-purple-50">
              {pricing_unit === 'PER_MEGAPIXEL' && <Monitor className="w-6 h-6 text-purple-700" />}
              {pricing_unit === 'PER_IMAGE' && <DollarSign className="w-6 h-6 text-purple-700" />}
              {pricing_unit === 'PER_SECOND_GPU' && <Cpu className="w-6 h-6 text-purple-700" />}
              {pricing_unit === 'FREE' && <DollarSign className="w-6 h-6 text-green-700" />}
              {(['PER_SECOND_VIDEO', 'PER_VIDEO', 'UNKNOWN'].includes(pricing_unit)) && <Calculator className="w-6 h-6 text-purple-700" />}
            </div>
            <div className="flex-1">
              <p className="text-small uppercase-mds text-gray-700">Pricing Model</p>
              <p className="text-lg font-medium text-black">{pricing_unit.replace(/_/g, ' ')}</p>
              {gpu_type && (
                <p className="text-small text-gray-700">GPU Type: {gpu_type}</p>
              )}
            </div>
            <div className="text-right">
              <p className="text-small uppercase-mds text-gray-700">Base Cost</p>
              <p className="text-2xl font-medium text-black">
                {pricing_unit === 'FREE' ? 'FREE' : 
                 base_cost < 0.01 ? `$${base_cost.toFixed(4)}` : 
                 `$${base_cost.toFixed(2)}`}
              </p>
            </div>
          </div>

          {/* Resolution Table for PER_MEGAPIXEL */}
          {pricing_unit === 'PER_MEGAPIXEL' && resolutions && resolutions.length > 0 && (
            <div className="mt-6">
              <div className="flex items-center gap-2 mb-4">
                <Table className="w-5 h-5 text-accent" />
                <h3 className="text-h4 uppercase-mds letter-spacing-tight">Cost by Resolution</h3>
              </div>
              <div className="overflow-x-auto -mx-2 px-2">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b bg-gray-50">
                      <th className="text-left p-sm text-small uppercase-mds font-medium text-gray-700">Resolution</th>
                      <th className="text-right p-sm text-small uppercase-mds font-medium text-gray-700">Megapixels</th>
                      <th className="text-right p-sm text-small uppercase-mds font-medium text-gray-700">Cost per Image</th>
                      <th className="text-right p-sm text-small uppercase-mds font-medium text-gray-700">Runs per $10</th>
                    </tr>
                  </thead>
                  <tbody>
                    {resolutions.map((res, idx) => {
                      const cost = calculateCostPerImage(
                        base_cost, 
                        pricing_unit, 
                        res.width, 
                        res.height
                      );
                      const runsPer10 = Math.floor(10 / cost);
                      const megapixels = calculateMegapixels(res.width, res.height);
                      
                      return (
                        <tr key={idx} className="border-b hover:bg-gray-50">
                          <td className="p-sm">
                            <div className="font-medium text-black">{res.name}</div>
                            <div className="text-small text-gray-700">{res.width}×{res.height}</div>
                          </td>
                          <td className="text-right p-sm text-gray-700">{megapixels.toFixed(2)}</td>
                          <td className="text-right p-sm font-medium text-black">
                            ${cost < 0.01 ? cost.toFixed(4) : cost.toFixed(2)}
                          </td>
                          <td className="text-right p-sm text-gray-700">{runsPer10}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Simple displays for other pricing units */}
          {pricing_unit === 'PER_IMAGE' && (
            <div className="text-center py-md bg-gray-50">
              <p className="text-lg text-black">Flat rate: ${base_cost.toFixed(2)} per image</p>
            </div>
          )}

          {pricing_unit === 'FREE' && (
            <div className="text-center py-md bg-green-50">
              <p className="text-lg text-green-700 font-medium">This model is FREE to use</p>
            </div>
          )}

          {pricing_unit === 'PER_SECOND_GPU' && (
            <>
              <div className="text-center py-md bg-gray-50">
                <p className="text-lg text-black">${base_cost.toFixed(4)} per second on {gpu_type || 'GPU'}</p>
              </div>
              
              {/* Resolution Table for PER_SECOND_GPU when resolutions available */}
              {resolutions && resolutions.length > 0 && (
                <div className="mt-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Table className="w-5 h-5 text-accent" />
                    <h3 className="text-h4 uppercase-mds letter-spacing-tight">Cost by Resolution</h3>
                  </div>
                  <div className="overflow-x-auto -mx-2 px-2">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="border-b bg-gray-50">
                          <th className="text-left p-sm text-small uppercase-mds font-medium text-gray-700">Resolution</th>
                          <th className="text-right p-sm text-small uppercase-mds font-medium text-gray-700">Pixels</th>
                          <th className="text-right p-sm text-small uppercase-mds font-medium text-gray-700">Cost/Second</th>
                        </tr>
                      </thead>
                      <tbody>
                        {resolutions.map((res, idx) => {
                          const totalPixels = res.width * res.height;
                          const megapixels = totalPixels / 1000000;
                          
                          return (
                            <tr key={idx} className="border-b hover:bg-gray-50">
                              <td className="p-sm">
                                <div className="font-medium text-black">{res.name}</div>
                                <div className="text-small text-gray-700">{res.width}×{res.height}</div>
                              </td>
                              <td className="text-right p-sm text-gray-700">{megapixels.toFixed(2)} MP</td>
                              <td className="text-right p-sm font-medium text-black">
                                ${base_cost.toFixed(4)}/s
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                  <p className="text-small text-gray-700 mt-4 text-center">
                    Note: Per-second GPU pricing is typically consistent across resolutions. Higher resolutions may require more processing time.
                  </p>
                </div>
              )}
            </>
          )}

          {(['PER_SECOND_VIDEO', 'PER_VIDEO', 'UNKNOWN'].includes(pricing_unit)) && (() => {
            // Filter out invalid resolutions (0×0 or missing dimensions)
            const validResolutions = resolutions?.filter(
              (res) => res.width > 0 && res.height > 0
            ) || [];
            
            return (
              <>
                <div className="text-center py-md bg-gray-50">
                  <p className="text-lg text-black">Base cost: ${base_cost.toFixed(4)} per {pricing_unit.replace(/_/g, ' ').toLowerCase()}</p>
                </div>
                
                {/* Resolution Table for video pricing when valid resolutions available */}
                {validResolutions.length > 0 && (
                  <div className="mt-6">
                    <div className="flex items-center gap-2 mb-4">
                      <Table className="w-5 h-5 text-accent" />
                      <h3 className="text-h4 uppercase-mds letter-spacing-tight">Available Resolutions</h3>
                    </div>
                    <div className="overflow-x-auto -mx-2 px-2">
                      <table className="w-full border-collapse">
                        <thead>
                          <tr className="border-b bg-gray-50">
                            <th className="text-left p-sm text-small uppercase-mds font-medium text-gray-700">Resolution</th>
                            <th className="text-right p-sm text-small uppercase-mds font-medium text-gray-700">Dimensions</th>
                            <th className="text-right p-sm text-small uppercase-mds font-medium text-gray-700">Aspect Ratio</th>
                          </tr>
                        </thead>
                        <tbody>
                          {validResolutions.map((res, idx) => {
                            // Calculate aspect ratio for video models
                            const gcd = (a: number, b: number): number => b === 0 ? a : gcd(b, a % b);
                            const divisor = gcd(res.width, res.height);
                            const aspectWidth = res.width / divisor;
                            const aspectHeight = res.height / divisor;
                            const aspectRatio = `${aspectWidth}:${aspectHeight}`;
                            
                            return (
                              <tr key={idx} className="border-b hover:bg-gray-50">
                                <td className="p-sm font-medium text-black">{res.name}</td>
                                <td className="text-right p-sm text-gray-700">{res.width}×{res.height}</td>
                                <td className="text-right p-sm text-gray-700">{aspectRatio}</td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </>
            );
          })()}
        </div>
      </div>
    </div>
  )
}
