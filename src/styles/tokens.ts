// Masculine Design System (MDS) Tokens
// Version 1.0 - Confident Minimalism & Functional Elegance

export const tokens = {
  // Core Philosophy: Sharp, geometric, bold, restrained
  colors: {
    // Core Palette
    black: '#000000',
    white: '#FFFFFF',
    charcoal: '#221F20',      // Dark UI
    darkGray: '#343434',      // Secondary Text
    
    // Accent Colors (select one - using Burnt Orange as default)
    accent: {
      burntOrange: '#BF572A', // Bold, Energetic, Craft
      deepNavy: '#1F3A60',    // Professional, Trustworthy
      forestGreen: '#2A573F', // Refined, Natural, Understated
    },
    
    // Neutral Gray Scale
    gray: {
      900: '#333',   // Dark text alternatives
      800: '#555',   // Mid-dark gray elements
      700: '#606',   // Secondary UI elements
      500: '#9E9E9E', // Input borders, dividers
      400: '#C1C1C1', // Light borders
      300: '#CCC',    // Very light borders
      200: '#DBDBDB', // Subtle dividers
      100: '#E9E9E9', // Light backgrounds
      50: '#F4F4F4',  // Lightest background tint
    }
  },
  
  typography: {
    fontFamily: {
      primary: '"ITC Avant Garde Pro", "Helvetica Neue", Helvetica, Arial, sans-serif',
      fallback: '"Montserrat", "Helvetica Neue", Helvetica, Arial, sans-serif',
    },
    
    fontSize: {
      h1: '30px',
      h2: '30px', 
      h3: '16px',
      h4: '20px',
      h5: '12px',
      body: '14px',
      small: '12px',
    },
    
    fontWeight: {
      light: 300,
      normal: 400,
      medium: 500,
      bold: 600,
    },
    
    letterSpacing: {
      tight: '0.2px',
      normal: 'normal',
      wide: '1.05px',
      cta: '2.4px', // Primary CTAs
    },
    
    textTransform: {
      none: 'none',
      uppercase: 'uppercase',
    },
    
    lineHeight: {
      tight: '1.2',  // 120% - compact editorial feel
      normal: '1.3', // 130% - standard
      relaxed: '1.4', // 140% - maximum
    }
  },
  
  layout: {
    borderRadius: {
      none: '0px',    // Global rule - sharp corners
      sharp: '1px',   // For inputs to appear sharp
    },
    
    boxShadow: {
      none: 'none',   // Flat design - no shadows
      subtle: 'rgba(0, 0, 0, 0.15) 0px 0px 16px 0px', // Modals/dropdowns only
    },
    
    spacing: {
      // Minimal gaps for dense gallery feel
      xs: '4px',
      sm: '8px',
      md: '16px',
      
      // Generous white space for premium feel
      lg: '24px',
      xl: '48px',
      xxl: '72px',
      massive: '96px',
    }
  },
  
  components: {
    button: {
      primary: {
        background: 'accent.burntOrange',
        color: 'white',
        border: '1px solid accent.burntOrange',
        fontSize: '12px',
        letterSpacing: 'cta',
        textTransform: 'uppercase',
        borderRadius: 'none',
      },
      secondary: {
        background: 'black',
        color: 'white', 
        border: '1px solid black',
        fontSize: '12px',
        letterSpacing: 'normal',
        textTransform: 'uppercase',
        borderRadius: 'none',
      },
      outlined: {
        background: 'white',
        color: 'accent.burntOrange',
        border: '1px solid accent.burntOrange',
        fontSize: '15px',
        letterSpacing: 'normal',
        textTransform: 'uppercase',
        borderRadius: 'none',
      }
    },
    
    input: {
      height: '40px',
      border: '1px solid gray.500',
      borderRadius: 'sharp',
      padding: '12px',
      fontSize: '14px',
      background: 'white',
    },
    
    card: {
      background: 'white',
      border: 'none',
      borderRadius: 'none',
      boxShadow: 'none',
      padding: '0-16px',
    }
  }
} as const;

// CSS Variables for runtime usage
export const cssVars = {
  // Colors
  '--color-black': tokens.colors.black,
  '--color-white': tokens.colors.white,
  '--color-charcoal': tokens.colors.charcoal,
  '--color-dark-gray': tokens.colors.darkGray,
  '--color-accent': tokens.colors.accent.burntOrange,
  '--color-gray-900': tokens.colors.gray[900],
  '--color-gray-800': tokens.colors.gray[800],
  '--color-gray-700': tokens.colors.gray[700],
  '--color-gray-500': tokens.colors.gray[500],
  '--color-gray-400': tokens.colors.gray[400],
  '--color-gray-300': tokens.colors.gray[300],
  '--color-gray-200': tokens.colors.gray[200],
  '--color-gray-100': tokens.colors.gray[100],
  '--color-gray-50': tokens.colors.gray[50],
  
  // Typography
  '--font-primary': tokens.typography.fontFamily.primary,
  '--font-fallback': tokens.typography.fontFamily.fallback,
  
  // Layout
  '--radius-none': tokens.layout.borderRadius.none,
  '--radius-sharp': tokens.layout.borderRadius.sharp,
  '--shadow-none': tokens.layout.boxShadow.none,
  '--shadow-subtle': tokens.layout.boxShadow.subtle,
} as const;

// Type definitions for token paths
export type ColorToken = keyof typeof tokens.colors | keyof typeof tokens.colors.gray | keyof typeof tokens.colors.accent;
export type TypographyToken = keyof typeof tokens.typography;
export type LayoutToken = keyof typeof tokens.layout;
