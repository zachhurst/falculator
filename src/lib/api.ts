// v1 Legacy interface (for backward compatibility)
export interface LegacyPriceData {
  cost_per_image: number;
  runs_per_dollar: number;
}

// v2 New interface
export type PricingUnit = 
  | "PER_MEGAPIXEL" | "PER_IMAGE" | "PER_SECOND_VIDEO"
  | "PER_VIDEO" | "PER_SECOND_GPU" | "FREE" | "UNKNOWN";

export interface Resolution {
  name: string;
  width: number;
  height: number;
}

export interface PriceData {
  pricing_unit: PricingUnit;
  base_cost: number;
  gpu_type?: string | null;
  resolutions?: Resolution[] | null;
  schema_version?: "v1" | "v2"; // Add version tracking
}

// Union type for handling both schemas
export type AnyPriceData = LegacyPriceData | PriceData;

// Type guard to distinguish v1 vs v2 responses
export function isPriceDataV2(data: AnyPriceData): data is PriceData {
  return 'pricing_unit' in data && 'base_cost' in data;
}

export interface ApiResponse {
  success: boolean
  data?: AnyPriceData; // Support both v1 and v2 during transition
  error?: string
}

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || 'https://micxjfgioqawfvwsxqfe.supabase.co'
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1pY3hqZmdpb3Fhd2Z2d3N4cWZlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQyMDY0MTgsImV4cCI6MjA3OTc4MjQxOH0.2orXFIYVBkXA2lblGCAZD0LIkk9qrxqFtrAEe4OAr7k'

export async function parseImage(
  imageBase64: string,
  userApiKey?: string
): Promise<ApiResponse> {
  try {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
    };
    if (userApiKey) {
      headers['x-gemini-key'] = userApiKey;
    }

    const response = await fetch(`${SUPABASE_URL}/functions/v1/image-parser`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ image: imageBase64 }),
    })

    if (response.status === 429) {
      throw new Error('Rate limit exceeded. Please add your own Gemini API key in Advanced Settings.');
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.error || `Request failed with status ${response.status}`)
    }

    const data = await response.json()
    return { success: true, data }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'An unexpected error occurred',
    }
  }
}

export function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      const result = reader.result as string
      // Remove data URL prefix (e.g., "data:image/png;base64,")
      const base64 = result.split(',')[1]
      resolve(base64)
    }
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}
