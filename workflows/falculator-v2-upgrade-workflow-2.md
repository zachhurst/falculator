# Fal-culator v2.1 Upgrade — Workflow 2 of 2

## Overview
Complete the v2.1 upgrade with new UI components for resolution-based pricing tables, BYOK settings, and updated landing page. **This is Part 2 (Frontend UI). Part 1 covered Backend + Types.**

---

## Phase 5: Enhanced Results Display Component

### Goal
Replace simple cost display with comprehensive pricing table showing all resolutions and their calculated costs.

### Files to Modify
- `src/components/ResultsDisplay.tsx`

### Tasks

**5.1 Update component props**
```typescript
interface ResultsDisplayProps {
  data: PriceData // Updated from v1 schema
}
```

**5.2 Add resolution table rendering**
For `PER_MEGAPIXEL` pricing with resolutions array:
```typescript
{data.pricing_unit === "PER_MEGAPIXEL" && data.resolutions && (
  <div className="mt-6">
    <h3 className="text-lg font-semibold mb-4">Cost by Resolution</h3>
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b">
            <th className="text-left p-2">Resolution</th>
            <th className="text-right p-2">Megapixels</th>
            <th className="text-right p-2">Cost per Image</th>
            <th className="text-right p-2">Runs per $10</th>
          </tr>
        </thead>
        <tbody>
          {data.resolutions.map((res, idx) => {
            const cost = calculateCostPerImage(
              data.base_cost, 
              data.pricing_unit, 
              res.width, 
              res.height
            );
            const runsPer10 = Math.floor(10 / cost);
            const megapixels = calculateMegapixels(res.width, res.height);
            
            return (
              <tr key={idx} className="border-b">
                <td className="p-2">
                  <div className="font-medium">{res.name}</div>
                  <div className="text-sm text-muted">{res.width}×{res.height}</div>
                </td>
                <td className="text-right p-2">{megapixels.toFixed(2)}</td>
                <td className="text-right p-2 font-medium">
                  ${cost < 0.01 ? cost.toFixed(4) : cost.toFixed(2)}
                </td>
                <td className="text-right p-2">{runsPer10}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  </div>
)}
```

**5.3 Handle other pricing units**
```typescript
{data.pricing_unit === "PER_IMAGE" && (
  <div className="text-center py-4">
    <p className="text-lg">Flat rate: ${data.base_cost.toFixed(2)} per image</p>
  </div>
)}

{data.pricing_unit === "FREE" && (
  <div className="text-center py-4">
    <p className="text-lg text-green-600 font-semibold">This model is FREE to use</p>
  </div>
)}

{data.pricing_unit === "PER_SECOND_GPU" && (
  <div className="text-center py-4">
    <p className="text-lg">${data.base_cost.toFixed(4)} per second on {data.gpu_type}</p>
  </div>
)}
```

### Verification
- Table renders correctly with resolution data
- Costs calculate properly for each resolution
- Other pricing units display appropriate messages

---

## Phase 6: Advanced Settings Component

### Goal
Create collapsible settings panel for BYOK API key input.

### Files to Create
- `src/components/AdvancedSettings.tsx`

### Tasks

**6.1 Create component structure**
```typescript
import { useState } from 'react';
import { Settings, Eye, EyeOff, Key } from 'lucide-react';

interface AdvancedSettingsProps {
  onApiKeyChange: (key: string) => void;
  disabled?: boolean;
}

export function AdvancedSettings({ onApiKeyChange, disabled }: AdvancedSettingsProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [apiKey, setApiKey] = useState('');
  const [showKey, setShowKey] = useState(false);

  const handleKeyChange = (value: string) => {
    setApiKey(value);
    onApiKeyChange(value);
  };

  return (
    <div className="w-full max-w-lg mx-auto mt-4">
      <button
        onClick={() => setIsOpen(!isOpen)}
        disabled={disabled}
        className="flex items-center gap-2 text-sm text-muted hover:text-foreground transition-colors"
      >
        <Settings className="w-4 h-4" />
        Advanced Settings
      </button>
      
      {isOpen && (
        <div className="mt-4 p-4 bg-card rounded-lg border">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Key className="w-4 h-4" />
              <label className="text-sm font-medium">Gemini API Key (Optional)</label>
            </div>
            <p className="text-xs text-muted">
              Provide your own key to bypass rate limits and use your own quota
            </p>
            <div className="relative">
              <input
                type={showKey ? "text" : "password"}
                value={apiKey}
                onChange={(e) => handleKeyChange(e.target.value)}
                placeholder="AIza..."
                className="w-full p-2 pr-10 border rounded-md text-sm"
                disabled={disabled}
              />
              <button
                type="button"
                onClick={() => setShowKey(!showKey)}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-muted hover:text-foreground"
              >
                {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
```

### Verification
- Component expands/collapses correctly
- API key input shows/hides properly
- Callback fires on key change

---

## Phase 7: Updated App Component

### Goal
Integrate AdvancedSettings and pass API key to parseImage calls.

### Files to Modify
- `src/App.tsx`

### Tasks

**7.1 Add API key state**
```typescript
const [userApiKey, setUserApiKey] = useState('');
```

**7.2 Update handleImageSelect**
```typescript
const response = await parseImage(base64, userApiKey || undefined);
```

**7.3 Add AdvancedSettings component**
```typescript
<AdvancedSettings 
  onApiKeyChange={setUserApiKey}
  disabled={state === 'loading'}
/>
```

**7.4 Update header copy**
```typescript
<p className="text-lg text-muted-foreground max-w-md mx-auto">
  Upload a screenshot of fal.ai pricing to see costs for all resolutions
</p>
```

### Verification
- API key flows through to backend correctly
- UI state management works properly
- Component renders in correct position

---

## Phase 8: Landing Page Updates

### Goal
Update hero section and value props to match v2.1 PRD messaging.

### Files to Modify
- `src/App.tsx` (header section)

### Tasks

**8.1 Update hero headline and sub-headline**
Use exact PRD Section 4 copy:
```typescript
<h1 className="text-4xl font-bold text-foreground">Fal-culator</h1>
<h2 className="text-2xl font-semibold mt-4 mb-2">Stop Guessing. Start Creating.</h2>
<p className="text-lg text-muted-foreground max-w-md mx-auto">
  Instantly calculate the *exact* cost for any fal.ai model. See a full breakdown for every resolution, so you can choose the perfect balance of price and performance.
</p>
```

**8.2 Add value proposition section**
Use exact PRD copy for titles and descriptions:
```typescript
{/* Value Props */}
<div className="mt-16 grid md:grid-cols-3 gap-8">
  <div className="text-center">
    <div className="inline-flex p-3 rounded-lg bg-primary/10 mb-4">
      <Calculator className="w-6 h-6 text-primary" />
    </div>
    <h3 className="font-semibold mb-2">From "Per Megapixel" to Per Image</h3>
    <p className="text-sm text-muted">
      Tired of doing the math? We do it for you. Fal-culator converts confusing "per megapixel" or "per second" pricing into a simple, flat cost per generation.
    </p>
  </div>
  
  <div className="text-center">
    <div className="inline-flex p-3 rounded-lg bg-primary/10 mb-4">
      <Table className="w-6 h-6 text-primary" />
    </div>
    <h3 className="font-semibold mb-2">See All Your Options at Once</h3>
    <p className="text-sm text-muted">
      Don't click through every resolution one-by-one. A single screenshot with the "Image Size" dropdown open gives you a full cost analysis table.
    </p>
  </div>
  
  <div className="text-center">
    <div className="inline-flex p-3 rounded-lg bg-primary/10 mb-4">
      <Cpu className="w-6 h-6 text-primary" />
    </div>
    <h3 className="font-semibold mb-2">Built for the Entire Fal Platform</h3>
    <p className="text-sm text-muted">
      Fal-culator is engineered to be robust. It intelligently detects the pricing model for images, video, and even raw GPU time.
    </p>
  </div>
</div>
```

**8.3 Update ImageUploader CTA text**
Modify ImageUploader component to show exactly:
```typescript
"Upload Screenshot & See Costs"
```

**8.4 Add 'How It Works' Section**
```typescript
<section className="mt-20 text-left max-w-2xl mx-auto">
  <h2 className="text-2xl font-bold mb-8 text-center">How It Works</h2>
  <ol className="space-y-6 list-decimal list-inside">
    <li className="text-lg text-muted-foreground">
      <span className="font-semibold text-foreground">Capture:</span> On any fal.ai model page, take a screenshot. For the best results, make sure it includes the pricing text and the open "Image Size" dropdown.
    </li>
    <li className="text-lg text-muted-foreground">
      <span className="font-semibold text-foreground">Upload:</span> Drag and drop your screenshot onto this page.
    </li>
    <li className="text-lg text-muted-foreground">
      <span className="font-semibold text-foreground">Analyze:</span> Our AI-powered engine reads the image, understands the pricing structure, and calculates the costs for all available options. Instantly.
    </li>
  </ol>
</section>
```

### Verification
- All messaging matches PRD Section 4
- Icons display correctly (add Table, Cpu imports)
- Responsive layout works on mobile

---

## Phase 9: Testing & Polish

### Goal
Ensure complete functionality across all pricing models.

### Tasks

**9.1 Test scenarios**
- PER_MEGAPIXEL with resolution dropdown
- PER_IMAGE flat pricing
- FREE model pricing
- PER_SECOND_GPU with GPU type
- Rate limiting with/without BYOK

**9.2 Error handling improvements**
- Better error messages for invalid schemas
- Graceful fallback for missing resolution data
- Loading states for API key validation

**9.3 Performance optimizations**
- Debounce API key input
- Cache resolution calculations
- Optimize table rendering for large resolution lists

---

## Final Verification Checklist

| Feature | Status |
|---------|--------|
| ✅ Backend schema supports all pricing units | |
| ✅ BYOK API key flow works | |
| ✅ Resolution table calculates costs correctly | |
| ✅ Advanced settings panel functional | |
| ✅ Landing page messaging updated | |
| ✅ Error handling robust | |
| ✅ Mobile responsive design | |

---

## Summary — Workflow 2 Scope

| Phase | Target | Key Deliverable |
|-------|--------|-----------------|
| 5 | Results Display | Resolution-based pricing table |
| 6 | Advanced Settings | BYOK API key input component |
| 7 | App Integration | Connect settings to API calls |
| 8 | Landing Page | Updated hero and value props |
| 9 | Testing & Polish | Complete functionality verification |

---

**🎉 Fal-culator v2.1 Complete!** 

The application now supports:
- Multi-resolution cost analysis
- BYOK API key model
- Enhanced UI with pricing tables
- Updated landing page messaging
- Rate limiting for sustainability
