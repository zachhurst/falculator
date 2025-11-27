# Fal-culator v2.1 Upgrade — Workflow 1 of 2

## Overview
Upgrade Fal-culator from simple cost extraction to comprehensive pricing analysis with multi-resolution support and BYOK API key model. **This is Part 1 (Backend + Types). Part 2 covers Frontend UI.**

---

## Phase 1: Backend Schema & Prompt Overhaul

### Goal
Replace simple `{cost_per_image, runs_per_dollar}` schema with comprehensive `FalPricingSchema` supporting multiple pricing units and resolution arrays.

### Files to Modify
- `supabase/functions/image-parser/index.ts`

### Tasks

**1.1 Replace PriceSchema constant (lines 10-23)**
Keep strict PRD schema compliance while adding version tracking internally:

```typescript
const FalPricingSchema = {
  type: SchemaType.OBJECT,
  properties: {
    // Internal use only - not in PRD but helpful for versioning
    schema_version: {
      type: SchemaType.STRING,
      enum: ["v1", "v2"],
      description: "Schema version for backward compatibility",
      nullable: true
    },
    pricing_unit: {
      type: SchemaType.STRING,
      enum: ["PER_MEGAPIXEL","PER_IMAGE","PER_SECOND_VIDEO","PER_VIDEO","PER_SECOND_GPU","FREE","UNKNOWN"]
    },
    base_cost: { type: SchemaType.NUMBER },
    gpu_type: { type: SchemaType.STRING, nullable: true },
    resolutions: {
      type: SchemaType.ARRAY,
      nullable: true,
      items: {
        type: SchemaType.OBJECT,
        properties: {
          name: { type: SchemaType.STRING },
          width: { type: SchemaType.INTEGER },
          height: { type: SchemaType.INTEGER }
        },
        required: ["name","width","height"]
      }
    }
  },
  required: ["pricing_unit","base_cost"]
};
```

**1.2 Replace VLM prompt (lines 66-76)**
Use PRD Section 3.2 prompt verbatim.

**1.3 Add schema detection and dual-mode processing**
(Logic remains the same: try v2 first, fallback to v1)

**1.4 Update validation logic (lines 94-102)**
Add strict data sanity checks per PRD:

```typescript
if (schemaVersion === "v2") {
  // Validate Enum
  if (!["PER_MEGAPIXEL","PER_IMAGE","PER_SECOND_VIDEO","PER_VIDEO","PER_SECOND_GPU","FREE","UNKNOWN"].includes(priceData.pricing_unit)) {
    throw new Error("Invalid pricing_unit in v2 schema");
  }
  
  // Enforce rules from PRD
  if (priceData.pricing_unit === "FREE") {
    priceData.base_cost = 0;
  }
  
  if (priceData.pricing_unit !== "PER_SECOND_GPU") {
    priceData.gpu_type = null;
  }

  if (typeof priceData.base_cost !== "number") {
    throw new Error("Invalid base_cost in v2 schema");
  }
} else {
  // V1 validation
  if (typeof priceData.cost_per_image !== "number" || typeof priceData.runs_per_dollar !== "number") {
    throw new Error("Invalid v1 schema fields");
  }
}
```

### Verification
- Deploy edge function
- Test with screenshot containing resolution dropdown

---

## Phase 2: BYOK Backend Support

### Goal
Allow users to provide their own Gemini API key via request header, with fallback to server key.

### Files to Modify
- `supabase/functions/image-parser/index.ts`

### Tasks

**2.1 Update CORS headers**
Add `x-gemini-key` to allowed headers:
```typescript
"Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-gemini-key"
```

**2.2 Add BYOK key extraction (after line 39)**
```typescript
const userApiKey = req.headers.get("x-gemini-key");
const apiKey = userApiKey || Deno.env.get("GEMINI_API_KEY");
```

**2.3 Add rate limiting (required)**
For default key usage, implement IP-based rate limit:
- Track requests per IP in memory (Map)
- Limit: 10 requests/IP/hour
- Return 429 if exceeded
- **CRITICAL**: Skip rate limit if user provides own key (check `x-gemini-key` header)

### Verification
- Test without header → uses server key
- Test with `x-gemini-key` header → uses user key
- Test rate limit by exceeding threshold

---

## Phase 3: Frontend Types & API Layer

### Goal
Update TypeScript interfaces and API function to support new schema and BYOK.

### Files to Modify
- `src/lib/api.ts`

### Tasks

**3.1 Add backward compatibility types**
Keep existing v1 interface for transition:
```typescript
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
```

**3.2 Update ApiResponse interface**
```typescript
export interface ApiResponse {
  success: boolean;
  data?: AnyPriceData; // Support both v1 and v2 during transition
  error?: string;
}
```

**3.2 Update parseImage function signature**
```typescript
export async function parseImage(
  imageBase64: string,
  userApiKey?: string
): Promise<ApiResponse>
```

**3.3 Add conditional header**
```typescript
const headers: Record<string, string> = {
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
};
if (userApiKey) {
  headers['x-gemini-key'] = userApiKey;
}
```

**3.4 Add rate limit error handling**
```typescript
if (response.status === 429) {
  throw new Error('Rate limit exceeded. Please add your own Gemini API key in Advanced Settings.');
}
```

### Verification
- TypeScript compiles without errors
- API calls work with and without user key

---

## Phase 4: Utility Functions

### Goal
Add cost calculation helpers for resolution-based pricing.

### Files to Modify
- `src/lib/utils.ts`

### Tasks

**4.1 Add megapixel calculator**
```typescript
export function calculateMegapixels(width: number, height: number): number {
  return (width * height) / 1_000_000;
}
```

**4.2 Add cost calculator**
```typescript
export function calculateCostPerImage(
  baseCost: number,
  pricingUnit: string,
  width?: number,
  height?: number
): number {
  if (pricingUnit === "PER_MEGAPIXEL" && width && height) {
    return baseCost * calculateMegapixels(width, height);
  }
  if (pricingUnit === "PER_IMAGE" || pricingUnit === "FREE") {
    return baseCost;
  }
  return baseCost; // Fallback
}
```

**4.3 Add runs-per-dollar calculator**
```typescript
export function calculateRunsPerDollar(costPerImage: number): number {
  if (costPerImage <= 0) return Infinity;
  return Math.floor(1 / costPerImage);
}
```

---

## Checkpoint
After completing Phases 1-4:
- Edge function accepts new schema
- BYOK header support works
- Frontend types match backend
- Utility functions ready for UI

**→ Continue to Workflow 2 for UI components and landing page updates.**

---

## Summary — Workflow 1 Scope

| Phase | Target | Key Deliverable |
|-------|--------|-----------------|
| 1 | Backend Schema | `FalPricingSchema` with resolutions array |
| 2 | BYOK Backend | `x-gemini-key` header support + rate limit |
| 3 | Frontend Types | Updated `PriceData` interface + API |
| 4 | Utilities | `calculateCostPerImage`, `calculateRunsPerDollar` |
