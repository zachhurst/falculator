# Fal-culator Security Hardening — Workflow 1 of 2

## Overview
Harden the codebase for open-source distribution by removing hardcoded credentials, dev-only scripts, and adding configurable CORS. **This is Part 1 (Code Changes). Part 2 covers Documentation & UI Copy Updates.**

---

## Phase 1: Remove Hardcoded Supabase Credentials

### Goal
Remove fallback Supabase URL and anon key from `src/lib/api.ts` so forkers must configure their own backend. This prevents abuse of the production Supabase project.

### Files to Modify
- `src/lib/api.ts`

### Current State (Lines 47-48)
```typescript
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || 'https://micxjfgioqawfvwsxqfe.supabase.co'
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
```

### Tasks

**1.1 Remove fallback values**
Replace lines 47-48 with strict env requirement:
```typescript
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.error('Missing required environment variables: VITE_SUPABASE_URL and/or VITE_SUPABASE_ANON_KEY')
}
```

**1.2 Update parseImage function error handling**
Add early return if env vars missing (around line 54):
```typescript
export async function parseImage(
  imageBase64: string,
  apiKeyConfig?: ApiKeyConfig
): Promise<ApiResponse> {
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    return {
      success: false,
      error: 'Application not configured. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY environment variables.',
    }
  }
  // ... rest of function
}
```

### Verification
- App fails gracefully without env vars (no crash, clear error)
- App works normally with env vars set
- Production build still functions (env vars set in Netlify)

---

## Phase 2: Remove Dev-Only Script from Production

### Goal
Remove `react-grab` script from `index.html` that ships to production. This third-party script has DOM access and could theoretically read localStorage (where API keys are stored).

### Files to Modify
- `index.html`

### Current State (Lines 7-12)
```html
<!-- React Grab for DOM element tracing (dev only) -->
<script
  src="//unpkg.com/react-grab/dist/index.global.js"
  crossorigin="anonymous"
  data-enabled="true"
></script>
```

### Tasks

**2.1 Remove the script tag entirely**
Delete lines 7-12 from `index.html`.

**2.2 (Optional) Add dev-only loading via Vite plugin**
If dev tooling is needed, add to `vite.config.ts`:
```typescript
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    // Add dev-only script injection if needed
    {
      name: 'inject-dev-scripts',
      transformIndexHtml(html, ctx) {
        if (ctx.server) { // Dev mode only
          return html.replace(
            '</head>',
            `<script src="//unpkg.com/react-grab/dist/index.global.js" data-enabled="true"></script></head>`
          )
        }
        return html
      }
    }
  ],
  // ...
})
```

### Verification
- Production build (`pnpm build`) has no react-grab script in `dist/index.html`
- Dev server (`pnpm dev`) still works (with or without dev script)

---

## Phase 3: Configurable CORS in Edge Function

### Goal
Make CORS origin configurable via environment variable so:
- Production locks down to `falculatorapp.netlify.app`
- Forkers can set their own origin
- Development can use `*` for local testing

### Files to Modify
- `supabase/functions/image-parser/index.ts`

### Current State (Lines 4-8)
```typescript
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-gemini-key, x-falai-key",
};
```

### Tasks

**3.1 Add environment-based CORS origin**
Replace lines 4-8:
```typescript
// CORS configuration - set ALLOWED_ORIGIN env var in production
// Default to * for development/testing
const allowedOrigin = Deno.env.get("ALLOWED_ORIGIN") || "*";

const corsHeaders = {
  "Access-Control-Allow-Origin": allowedOrigin,
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-gemini-key, x-falai-key",
};
```

**3.2 Add origin logging for debugging**
After the CORS headers definition:
```typescript
console.log(`CORS configured for origin: ${allowedOrigin}`);
```

### Post-Deployment Action (Manual)
After merging, set Supabase secret:
```bash
npx supabase secrets set ALLOWED_ORIGIN=https://falculatorapp.netlify.app
```

### Verification
- Without env var: CORS allows all origins (dev behavior)
- With env var set: Only specified origin allowed
- Preflight OPTIONS requests work correctly

---

## Phase 4: Update Environment Example File

### Goal
Update `.env.example` to document all required and optional variables for forkers.

### Files to Modify
- `.env.example`

### Current State
```
VITE_SUPABASE_URL=https://micxjfgioqawfvwsxqfe.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-from-supabase-dashboard
```

### Tasks

**4.1 Expand .env.example with clear instructions**
```
# ============================================
# REQUIRED - Frontend Environment Variables
# ============================================
# Your Supabase project URL (from Supabase dashboard > Settings > API)
VITE_SUPABASE_URL=https://your-project-ref.supabase.co

# Your Supabase anon/public key (from Supabase dashboard > Settings > API)
# This key is safe to expose in frontend code - it's protected by RLS
VITE_SUPABASE_ANON_KEY=your-anon-key-here

# ============================================
# REQUIRED - Supabase Edge Function Secrets
# ============================================
# Set these via: npx supabase secrets set KEY=value

# Google Gemini API key (fallback when users don't provide BYOK)
# Get from: https://aistudio.google.com/app/apikey
# GEMINI_API_KEY=AIza...

# ============================================
# OPTIONAL - Supabase Edge Function Secrets
# ============================================

# Restrict CORS to your production domain (recommended for production)
# Default: * (allows all origins)
# ALLOWED_ORIGIN=https://your-domain.netlify.app
```

### Verification
- File documents all environment variables
- Instructions are clear for new contributors

---

## Checkpoint — Workflow 1 Complete

After completing Phases 1-4:
- [ ] No hardcoded Supabase credentials in frontend code
- [ ] Dev-only scripts removed from production builds
- [ ] CORS is configurable via environment variable
- [ ] `.env.example` documents all required variables

**→ Continue to Workflow 2 for Documentation & UI Copy Updates.**

---

## Summary — Workflow 1 Scope

| Phase | Target | Key Deliverable |
|-------|--------|-----------------|
| 1 | API Layer | Remove hardcoded Supabase fallbacks |
| 2 | HTML | Remove react-grab dev script |
| 3 | Edge Function | Configurable CORS origin |
| 4 | Config | Expanded `.env.example` |

---

## Risk Mitigation

**Production Safety**
- All changes are backward compatible
- Existing Netlify env vars continue to work
- Edge function changes require manual secret update post-deploy

**Testing Checklist**
1. Run `pnpm dev` - app loads normally
2. Run `pnpm build` - no errors
3. Check `dist/index.html` - no react-grab script
4. Test image upload with API key - works
5. Test without env vars - graceful error message
