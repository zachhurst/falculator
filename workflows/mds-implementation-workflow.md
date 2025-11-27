# Masculine Design System (MDS) Implementation Workflow
**Project:** Fal-culator v2.1  
**Version:** 1.0  
**Date:** November 27, 2025

---

## Overview

This workflow transforms Fal-culator from its current UI to the Masculine Design System - characterized by confident minimalism, sharp geometry, bold typography, and restrained color palette.

## Architecture

### 1. Token System (`src/styles/tokens.ts`)
- **Raw Tokens:** MDS specification values (colors, typography, spacing)
- **CSS Variables:** Runtime access for dynamic contexts
- **Type Definitions:** TypeScript safety for token paths

### 2. Tailwind Integration (`tailwind.config.ts`)
- **Theme Extension:** Maps MDS tokens to Tailwind utilities
- **Component Classes:** Pre-configured styles for buttons, inputs, cards
- **Semantic Colors:** Mapped to MDS color palette

### 3. Global Foundation (`src/styles/globals.css`)
- **Non-negotiable Rules:** `border-radius: 0px`, `box-shadow: none`
- **Typography Stack:** ITC Avant Garde Pro with Montserrat fallback
- **Base Components:** MDS-compliant button, input, card styles

---

## Phase 1: Foundation ✅ COMPLETED

### Tasks Completed:
- [x] Create token architecture with full MDS specification
- [x] Configure Tailwind to consume MDS tokens
- [x] Implement global CSS with foundational rules
- [x] Replace existing Tailwind config with MDS version
- [x] Update CSS imports in main application

### Files Created/Modified:
- `src/styles/tokens.ts` - Design token system
- `tailwind.config.ts` - MDS Tailwind configuration  
- `src/styles/globals.css` - Global MDS styles
- `src/index.css` - Updated to import MDS globals

---

## Phase 2: Component Migration

### 2.1 Core Components (Priority: High)

#### App.tsx
**Current Issues:**
- Uses rounded corners (`rounded-xl`)
- Standard font family
- Generic spacing

**MDS Updates:**
```tsx
// Before
<div className="rounded-xl bg-primary/10">
<h1 className="text-4xl font-bold">

// After  
<div className="bg-charcoal/10">
<h1 className="text-h1 uppercase-mds letter-spacing-wide">
```

#### ImageUploader.tsx
**Current Issues:**
- Card styling with shadows/borders
- Rounded upload area
- Generic button styles

**MDS Updates:**
- Remove all borders/shadows
- Sharp corners throughout
- Use MDS button classes
- Update spacing to MDS system

#### ResultsDisplay.tsx
**Current Issues:**
- Card with borders/shadows
- Rounded elements
- Generic typography

**MDS Updates:**
- Flat card design
- Sharp corners only
- MDS typography hierarchy
- Updated color usage

#### AdvancedSettings.tsx
**Current Issues:**
- Rounded input
- Generic styling
- Standard spacing

**MDS Updates:**
- Sharp input borders
- MDS color scheme
- Proper spacing tokens

#### LoadingSpinner.tsx & ErrorMessage.tsx
**Current Issues:**
- Generic styling
- Standard colors

**MDS Updates:**
- MDS color palette
- Consistent typography
- Sharp design elements

### 2.2 Typography Updates

**Global Changes:**
- All headings use MDS hierarchy
- CTA text uppercase with letter spacing
- Consistent line heights (120-140%)

**Component-specific:**
- Headers: `text-h1`, `text-h2`, etc.
- Buttons: `uppercase-mds letter-spacing-cta`
- Labels: `text-h5 uppercase-mds`

### 2.3 Color System Migration

**Replace Current Colors:**
- `primary/10` → `charcoal/10`
- `muted-foreground` → `gray-700`
- `border` → `gray-500`
- `card` → `white`

**Accent Color:**
- Use `accent` (burnt orange) for primary interactions
- `accent/10` for hover states
- Maintain high contrast

---

## Phase 3: Layout & Spacing

### 3.1 Container Updates
**Current Structure:**
```tsx
<div className="max-w-4xl mx-auto px-4 py-12">
```

**MDS Structure:**
```tsx
<div className="max-w-4xl mx-auto px-4 py-xl">
```

### 3.2 Component Spacing
**Replace Generic Spacing:**
- `mt-8` → `mt-lg`
- `mb-12` → `mt-xl`  
- `gap-8` → `gap-lg`
- `p-6` → `p-md`

**Section Separation:**
- Use `py-xl` to `py-xxl` for major sections
- Use `py-lg` for component groups

---

## Phase 4: Interactive Elements

### 4.1 Button System
**Implement MDS Button Classes:**
```tsx
// Primary CTA
<button className="btn-primary-mds uppercase-mds letter-spacing-cta">

// Secondary
<button className="btn-secondary-mds uppercase-mds">

// Outlined
<button className="btn-outlined-mds uppercase-mds">
```

### 4.2 Form Elements
**Input Styling:**
```tsx
<input className="input-mds font-primary" />
```

**Focus States:**
- Sharp 1px borders
- MDS accent color for focus
- No shadows or rounded corners

---

## Phase 5: Testing & Validation

### 5.1 Visual Testing Checklist
- [ ] All corners are sharp (0px radius)
- [ ] No box shadows on standard components
- [ ] Typography follows MDS hierarchy
- [ ] Color palette matches MDS specification
- [ ] Spacing uses MDS token system
- [ ] All CTA text is uppercase

### 5.2 Responsive Testing
- [ ] Mobile layout maintains sharp aesthetic
- [ ] Typography scales properly
- [ ] Spacing system works across breakpoints
- [ ] Button system responsive

### 5.3 Accessibility Testing
- [ ] Contrast ratios meet WCAG AA
- [ ] Focus indicators visible
- [ ] Screen reader compatibility
- [ ] Keyboard navigation works

---

## Phase 6: Documentation & Handoff

### 6.1 Component Documentation
- Update component props documentation
- Add MDS usage examples
- Document token usage patterns

### 6.2 Design System Guide
- Create MDS usage guidelines
- Document token system
- Provide component examples

---

## Implementation Strategy

### Incremental Approach
1. **Foundation First:** Global CSS and tokens (✅ Complete)
2. **Core Components:** App, ImageUploader, ResultsDisplay
3. **Supporting Components:** AdvancedSettings, Loading, Error
4. **Typography Pass:** Update all text elements
5. **Color Pass:** Replace color usage throughout
6. **Spacing Pass:** Update layout and spacing
7. **Testing & Polish:** Final validation and fixes

### Risk Mitigation
- **Backup Original Styles:** Keep `tailwind.config.backup.ts`
- **Component-by-Component:** Test each component individually
- **Gradual Rollout:** Can deploy partial updates
- **Rollback Plan:** Original styles preserved

### Success Criteria
- [ ] 100% MDS compliance across all components
- [ ] No functionality regressions
- [ ] Responsive design maintained
- [ ] Accessibility standards met
- [ ] Performance impact minimal

---

## Next Steps

1. **Begin Component Migration:** Start with App.tsx
2. **Test Incrementally:** Validate each component update
3. **Gather Feedback:** Review changes with stakeholders
4. **Final Polish:** Address any issues and optimize

This workflow ensures a systematic, thorough transformation to the Masculine Design System while maintaining application stability and functionality.
