# Fal-culator Security Hardening — Workflow 2 of 2

## Overview
Update documentation and UI copy to accurately describe the BYOK security model. Fix misleading claims about "keys never touching our servers." **This is Part 2 (Docs & Copy). Part 1 covered Code Changes.**

---

## Phase 5: Update SecurityInfoModal Component

### Goal
Correct the security copy to accurately describe how BYOK keys flow through Supabase Edge Functions, rather than claiming they "never touch our infrastructure."

### Files to Modify
- `src/components/SecurityInfoModal.tsx`

### Current State (Lines 57-58)
```typescript
<p className="text-body text-gray-700 leading-relaxed">
  When you bring your own API key (Google Gemini or Fal.ai), it flows directly from your browser to your chosen provider — never touching our infrastructure. Your key is transmitted via a secure HTTPS connection and our backend simply forwards it to the selected API without storing or logging it.
</p>
```

### Tasks

**5.1 Replace main paragraph with accurate description**
Update lines 57-58:
```typescript
<p className="text-body text-gray-700 leading-relaxed">
  When you bring your own API key (Google Gemini or Fal.ai), it is sent from your browser to our Supabase Edge Function over HTTPS, then immediately forwarded to your chosen provider. Your key is transmitted in a secure header and our backend does not store, log, or persist it in any way. The edge function code is open source so you can verify this behavior.
</p>
```

**5.2 Update "End-to-End Encryption" section (Lines 68-71)**
Current:
```typescript
<h3 className="text-small font-medium uppercase-mds text-black">End-to-End Encryption</h3>
<p className="text-small text-gray-700 mt-1">
  Your API key is transmitted via HTTPS in the appropriate header (<code className="bg-gray-100 px-1">x-gemini-key</code> or <code className="bg-gray-100 px-1">x-falai-key</code>), encrypted in transit.
</p>
```

Replace with:
```typescript
<h3 className="text-small font-medium uppercase-mds text-black">Encrypted in Transit</h3>
<p className="text-small text-gray-700 mt-1">
  Your API key travels via HTTPS from your browser → our edge function → your provider. Headers (<code className="bg-gray-100 px-1">x-gemini-key</code> or <code className="bg-gray-100 px-1">x-falai-key</code>) are encrypted in transit at every hop.
</p>
```

**5.3 Update "Zero Storage" section (Lines 80-84)**
Current:
```typescript
<h3 className="text-small font-medium uppercase-mds text-black">Zero Storage</h3>
<p className="text-small text-gray-700 mt-1">
  Your key is never saved to our databases, logs, or any persistent storage. It exists only in your browser's memory during the session.
</p>
```

Replace with:
```typescript
<h3 className="text-small font-medium uppercase-mds text-black">Zero Server Storage</h3>
<p className="text-small text-gray-700 mt-1">
  Your key is never saved to databases or logs. It passes through our edge function in memory only, then is immediately discarded. Locally, keys are stored in your browser's localStorage for convenience—clear them anytime via Advanced Settings.
</p>
```

**5.4 Update summary box (Lines 101-104)**
Current:
```typescript
<p className="text-small text-gray-700">
  <strong className="text-black">Bottom line:</strong> You maintain complete control over your API key usage and billing. We provide only the image parsing service.
</p>
```

Replace with:
```typescript
<p className="text-small text-gray-700">
  <strong className="text-black">Bottom line:</strong> Your key passes through our open-source edge function but is never stored or logged. You maintain full control over your API quota and billing.
</p>
```

### Verification
- Modal displays updated copy
- No misleading "never touches our servers" claims
- Accurate description of key flow

---

## Phase 6: Update README.md Security Section

### Goal
Update README to accurately describe the BYOK architecture for potential contributors and forkers.

### Files to Modify
- `README.md`

### Current State (Lines 23-28)
```markdown
### Security & Privacy
- **Local Storage Only** - API keys stored in browser localStorage
- **Direct to Google** - Keys transmitted directly to Google's servers
- **No Server Storage** - Images processed but never saved
- **Open Source** - Fully transparent codebase you can inspect
```

### Tasks

**6.1 Replace Security & Privacy section**
```markdown
### Security & Privacy
- **BYOK Model** - Bring your own Gemini or Fal.ai API key
- **Encrypted Transit** - Keys sent via HTTPS: browser → edge function → provider
- **Zero Persistence** - Keys pass through memory only; never logged or stored server-side
- **Browser Storage** - Keys cached in localStorage for convenience (clear anytime)
- **Open Source** - Edge function code is public; verify key handling yourself
```

**6.2 Update Architecture section (Lines 101-106)**
Current:
```markdown
### BYOK (Bring Your Own Key) Design
- Users provide their own Gemini or Fal.ai API key
- Keys never touch our servers
- Direct browser → Provider API communication
- Users stay on their own pricing quotas
```

Replace with:
```markdown
### BYOK (Bring Your Own Key) Design
- Users provide their own Gemini or Fal.ai API key
- Keys are sent via HTTPS header to our Supabase Edge Function
- Edge function forwards key to selected provider (Gemini or Fal.ai)
- Keys are never stored, logged, or persisted—memory only
- Users stay on their own pricing quotas
- Edge function code is open source for full transparency
```

**6.3 Add Fork Setup section after Quick Start**
Insert after line 82:
```markdown
### Fork Setup (For Contributors)

If you're forking this project, you'll need to set up your own backend:

1. **Create a Supabase project** at [supabase.com](https://supabase.com)
2. **Deploy the edge function**:
   ```bash
   npx supabase functions deploy image-parser
   ```
3. **Set required secrets**:
   ```bash
   npx supabase secrets set GEMINI_API_KEY=your-gemini-key
   npx supabase secrets set ALLOWED_ORIGIN=https://your-domain.netlify.app
   ```
4. **Update your `.env`** with your Supabase URL and anon key
5. **Deploy frontend** to Netlify with environment variables set

> **Note**: The app will not function without these environment variables configured. There are no hardcoded fallbacks.
```

### Verification
- README accurately describes key flow
- Fork instructions are clear
- No misleading "direct to provider" claims

---

## Phase 7: Update AdvancedSettings Help Text

### Goal
Add a brief note about localStorage persistence in the Advanced Settings UI.

### Files to Modify
- `src/components/AdvancedSettings.tsx`

### Current State
The component has help text but doesn't mention localStorage persistence.

### Tasks

**7.1 Add localStorage note to help text**
Find the section with provider description and add after it (around line 180-190):
```typescript
<p className="text-xs text-gray-500 mt-2">
  Your key is saved in this browser's localStorage for convenience. 
  Use "Clear Saved Key" to remove it at any time.
</p>
```

**7.2 Ensure Clear Saved Key button is prominent**
Verify the `clearSavedKey` function exists and button is visible when a key is saved.

### Verification
- Help text mentions localStorage
- Clear button is accessible
- User understands persistence model

---

## Phase 8: Update netlify.toml Comments

### Goal
Clarify why secrets scanning is disabled and add security context.

### Files to Modify
- `netlify.toml`

### Current State (Lines 5-8)
```toml
[build.environment]
  # Disable secrets scanning - Supabase URL and anon key are public by design
  # They are protected by Row Level Security policies, not secrecy
  SECRETS_SCAN_ENABLED = "false"
```

### Tasks

**8.1 Expand comments with security context**
```toml
[build.environment]
  # Disable Netlify secrets scanning for Supabase public credentials
  # 
  # VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are PUBLIC by design:
  # - Anon key is meant to be exposed in frontend code
  # - Security comes from Supabase Row Level Security (RLS), not key secrecy
  # - This is standard Supabase architecture, not a security issue
  #
  # Sensitive keys (GEMINI_API_KEY, ALLOWED_ORIGIN) are stored as
  # Supabase Edge Function secrets, NOT in this repo or Netlify env vars.
  SECRETS_SCAN_ENABLED = "false"
```

### Verification
- Comments explain the security model clearly
- Future contributors understand why scanning is disabled

---

## Final Verification Checklist

| Item | Status |
|------|--------|
| SecurityInfoModal copy is accurate | |
| README describes actual key flow | |
| Fork setup instructions added | |
| AdvancedSettings mentions localStorage | |
| netlify.toml comments expanded | |
| No "direct to provider" or "never touches server" claims | |

---

## Summary — Workflow 2 Scope

| Phase | Target | Key Deliverable |
|-------|--------|-----------------|
| 5 | SecurityInfoModal | Accurate BYOK flow description |
| 6 | README.md | Updated security section + fork guide |
| 7 | AdvancedSettings | localStorage persistence note |
| 8 | netlify.toml | Expanded security comments |

---

## Post-Implementation Notes

### For Production Deployment
After both workflows are complete and merged:

1. **Set Supabase secret for CORS**:
   ```bash
   npx supabase secrets set ALLOWED_ORIGIN=https://falculatorapp.netlify.app
   ```

2. **Redeploy edge function**:
   ```bash
   npx supabase functions deploy image-parser
   ```

3. **Verify Netlify env vars are set** (they should already be)

### For Forkers
Direct them to:
- `.env.example` for required variables
- README "Fork Setup" section for backend setup
- Edge function code for security verification

---

**🔒 Security Hardening Complete!**

The codebase is now ready for open-source distribution with:
- No hardcoded production credentials
- Accurate security documentation
- Configurable CORS for forkers
- Clear setup instructions
