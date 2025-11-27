# Masculine Design System UI Transformation Workflow
**Project:** Fal-culator v2.1 → MDS  
**Version:** 1.0  
**Date:** November 27, 2025

---

## Overview

This workflow transforms the entire Fal-culator UI to the Masculine Design System (MDS) - characterized by sharp corners, flat design, bold typography, and restrained color palette.

**Prerequisites:**
- ✅ MDS foundation implemented (tokens, Tailwind config, global CSS)
- ✅ Development server running (`npm run dev`)
- ✅ Git branch created for MDS changes

---

## Phase 1: App.tsx - Main Layout & Typography

### 1.1 Update Header Section
**File:** `src/App.tsx`

**Replace lines 50-62:**
```tsx
// Current
<div className="inline-flex items-center justify-center gap-3 mb-4">
  <div className="p-3 rounded-xl bg-primary/10">
    <Calculator className="w-8 h-8 text-primary" />
  </div>
  <h1 className="text-4xl font-bold text-foreground">Fal-culator</h1>
</div>
<h2 className="text-2xl font-semibold mt-4 mb-2">Stop Guessing. Start Creating.</h2>

// MDS Version
<div className="inline-flex items-center justify-center gap-3 mb-4">
  <div className="p-3 bg-charcoal/10">
    <Calculator className="w-8 h-8 text-accent" />
  </div>
  <h1 className="text-h1 uppercase-mds letter-spacing-wide">Fal-culator</h1>
</div>
<h2 className="text-h2">Stop Guessing. Start Creating.</h2>
```

### 1.2 Update Description
**Replace line 59:**
```tsx
// Current
<p className="text-lg text-muted-foreground max-w-md mx-auto">

// MDS Version  
<p className="text-body text-gray-700 max-w-md mx-auto">
```

### 1.3 Update Value Propositions
**Replace lines 66-105:**
```tsx
// Current
<div className="grid md:grid-cols-3 gap-8">
  <div className="text-center">
    <div className="inline-flex p-3 rounded-lg bg-primary/10 mb-4">

// MDS Version
<div className="grid md:grid-cols-3 gap-lg">
  <div className="text-center">
    <div className="inline-flex p-3 bg-charcoal/10 mb-4">
```

**Replace heading classes throughout:**
```tsx
// Current
<h3 className="font-semibold mb-2">

// MDS Version
<h3 className="text-h4 uppercase-mds letter-spacing-tight mb-2">
```

**Replace paragraph classes:**
```tsx
// Current
<p className="text-sm text-muted">

// MDS Version
<p className="text-small text-gray-700">
```

### 1.4 Update Main Content Container
**Replace line 143:**
```tsx
// Current
<div className="max-w-4xl mx-auto px-4 py-12">

// MDS Version
<div className="max-w-4xl mx-auto px-4 py-xl">
```

### 1.5 Update Footer
**Replace line 186:**
```tsx
// Current
<footer className="mt-16 text-center text-sm text-muted">

// MDS Version
<footer className="mt-xxl text-center text-small text-gray-700">
```

---

## Phase 2: ImageUploader.tsx - Sharp Upload Interface

### 2.1 Remove Rounded Corners
**File:** `src/components/ImageUploader.tsx`

**Replace upload area styling:**
```tsx
// Current
<div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors">

// MDS Version
<div className="border-2 border-dashed border-gray-500 p-lg text-center hover:border-gray-700 transition-colors">
```

### 2.2 Update Typography
**Replace heading:**
```tsx
// Current
<h3 className="text-lg font-medium text-gray-900 mb-2">

// MDS Version
<h3 className="text-h4 uppercase-mds letter-spacing-tight text-black mb-2">
```

**Replace description:**
```tsx
// Current
<p className="text-sm text-gray-600 mb-4">

// MDS Version
<p className="text-small text-gray-700 mb-4">
```

### 2.3 Update Upload Button
**Replace button classes:**
```tsx
// Current
<button className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary/90 transition-colors">

// MDS Version
<button className="btn-primary-mds uppercase-mds letter-spacing-cta hover:opacity-90 transition-opacity">
```

---

## Phase 3: ResultsDisplay.tsx - Flat Card Design

### 3.1 Remove Card Styling
**File:** `src/components/ResultsDisplay.tsx`

**Replace card container:**
```tsx
// Current
<div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">

// MDS Version
<div className="bg-white border border-gray-300 overflow-hidden">
```

**Replace header section:**
```tsx
// Current
<div className="p-4 bg-primary/5 border-b border-border">

// MDS Version
<div className="p-4 bg-gray-50 border-b border-gray-300">
```

### 3.2 Update Typography
**Replace heading:**
```tsx
// Current
<h2 className="font-semibold text-foreground">Pricing Analysis</h2>

// MDS Version
<h2 className="text-h4 uppercase-mds letter-spacing-tight text-black">Pricing Analysis</h2>
```

**Replace metric labels:**
```tsx
// Current
<p className="text-sm font-medium text-muted-foreground">

// MDS Version
<p className="text-small uppercase-mds text-gray-700">
```

### 3.3 Update Resolution Table
**Replace table styling:**
```tsx
// Current
<table className="w-full border-collapse">
  <thead>
    <tr className="border-b bg-muted/30">

// MDS Version
<table className="w-full border-collapse">
  <thead>
    <tr className="border-b bg-gray-50">
```

**Replace table headers:**
```tsx
// Current
<th className="text-left p-3 font-medium">

// MDS Version
<th className="text-left p-3 text-small uppercase-mds font-medium text-gray-700">
```

---

## Phase 4: AdvancedSettings.tsx - Sharp Settings Panel

### 4.1 Update Container
**File:** `src/components/AdvancedSettings.tsx`

**Replace settings panel:**
```tsx
// Current
<div className="mt-4 p-4 bg-card rounded-lg border">

// MDS Version
<div className="mt-4 p-4 bg-white border border-gray-300">
```

### 4.2 Update Typography
**Replace label:**
```tsx
// Current
<label className="text-sm font-medium">

// MDS Version
<label className="text-small uppercase-mds font-medium text-gray-700">
```

**Replace description:**
```tsx
// Current
<p className="text-xs text-muted">

// MDS Version
<p className="text-small text-gray-700">
```

### 4.3 Update Input Styling
**Replace input classes:**
```tsx
// Current
className="w-full p-2 pr-10 border rounded-md text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"

// MDS Version
className="w-full p-2 pr-10 border border-gray-500 text-sm bg-white focus:outline-none focus:border-accent focus:border-2"
```

---

## Phase 5: LoadingSpinner.tsx - Minimal Loading

### 5.1 Update Container
**File:** `src/components/LoadingSpinner.tsx`

**Replace container:**
```tsx
// Current
<div className="flex flex-col items-center justify-center p-8">

// MDS Version
<div className="flex flex-col items-center justify-center p-lg">
```

**Replace text:**
```tsx
// Current
<p className="mt-4 text-sm text-muted-foreground">

// MDS Version
<p className="mt-4 text-small text-gray-700">
```

---

## Phase 6: ErrorMessage.tsx - Sharp Error Display

### 6.1 Update Container
**File:** `src/components/ErrorMessage.tsx`

**Replace error container:**
```tsx
// Current
<div className="bg-red-50 border border-red-200 rounded-lg p-4">

// MDS Version
<div className="bg-white border border-gray-700 p-4">
```

**Replace error message:**
```tsx
// Current
<p className="text-red-800 font-medium mb-3">

// MDS Version
<p className="text-black font-medium mb-3">
```

**Replace retry button:**
```tsx
// Current
<button className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors">

// MDS Version
<button className="btn-secondary-mds uppercase-mds hover:opacity-90 transition-opacity">
```

---

## Phase 7: Final Spacing & Layout Updates

### 7.1 Update Global Spacing
**Across all components, replace:**
```tsx
// Common replacements
mt-8 → mt-lg
mb-4 → mb-md 
gap-8 → gap-lg
p-6 → p-md
py-12 → py-xl
mt-16 → mt-xxl
```

### 7.2 Update Color Usage
**Across all components, replace:**
```tsx
// Common replacements
text-muted-foreground → text-gray-700
border-border → border-gray-300
bg-card → bg-white
text-primary → text-accent
bg-primary/10 → bg-charcoal/10
```

---

## Phase 8: Verification & Testing

### 8.1 Visual Verification Checklist
**Check each component for:**
- [ ] All corners are sharp (no rounded elements)
- [ ] No box shadows on standard components
- [ ] Typography follows MDS hierarchy
- [ ] CTA text is uppercase with proper letter spacing
- [ ] Color palette matches MDS specification
- [ ] Spacing uses MDS token system

### 8.2 Functional Testing
**Test key functionality:**
- [ ] Image upload works correctly
- [ ] Advanced Settings toggle functions
- [ ] API key input works
- [ ] Results display renders properly
- [ ] Error states display correctly
- [ ] Loading states work

### 8.3 Responsive Testing
**Test on different screen sizes:**
- [ ] Mobile layout maintains sharp aesthetic
- [ ] Typography scales properly  
- [ ] Spacing system works across breakpoints
- [ ] Tables scroll horizontally on mobile

---

## Phase 9: Documentation & Cleanup

### 9.1 Update Component Documentation
**Add MDS usage notes to component files:**
```tsx
/**
 * ComponentName - MDS Compliant
 * 
 * Design System: Masculine Design System v1.0
 * Tokens Used: colors.accent, spacing.lg, typography.h4
 * MDS Rules: Sharp corners, flat design, uppercase CTAs
 */
```

### 9.2 Clean Up Unused Imports
**Remove any unused styling imports:**
- Check for unused Tailwind utilities
- Remove legacy CSS imports
- Clean up component prop types

---

## Rollback Instructions

If issues arise, rollback via git:
```bash
git checkout -- src/components src/App.tsx src/index.css tailwind.config.ts
git checkout HEAD~1 -- .  # Complete rollback if needed
```

---

## Success Criteria

**Visual Transformation:**
- [ ] 100% MDS compliance across all components
- [ ] Sharp, geometric aesthetic achieved
- [ ] Bold typography with proper hierarchy
- [ ] Restrained color palette implemented

**Functional Integrity:**
- [ ] All features work as before
- [ ] No performance regressions
- [ ] Responsive design maintained
- [ ] Accessibility standards met

**Code Quality:**
- [ ] Clean, maintainable component code
- [ ] Proper TypeScript types
- [ ] No lint errors
- [ ] Well-documented changes

---

## Next Steps

After completing this workflow:
1. **Test thoroughly** across different browsers and devices
2. **Gather feedback** on the new MDS aesthetic
3. **Document** any custom MDS patterns for future reference
4. **Consider** creating reusable MDS component library

This workflow ensures a complete transformation to the Masculine Design System while maintaining application functionality and code quality.
