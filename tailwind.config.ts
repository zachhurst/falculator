import type { Config } from 'tailwindcss';
import { tokens } from './src/styles/tokens';

const config: Config = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      // Colors - map MDS tokens to Tailwind
      colors: {
        // Core palette
        black: tokens.colors.black,
        white: tokens.colors.white,
        charcoal: tokens.colors.charcoal,
        'dark-gray': tokens.colors.darkGray,
        
        // Accent colors (using burnt orange as primary)
        accent: {
          DEFAULT: tokens.colors.accent.burntOrange,
          'burnt-orange': tokens.colors.accent.burntOrange,
          'deep-navy': tokens.colors.accent.deepNavy,
          'forest-green': tokens.colors.accent.forestGreen,
        },
        
        // Gray scale - map semantic names
        gray: {
          50: tokens.colors.gray[50],
          100: tokens.colors.gray[100],
          200: tokens.colors.gray[200],
          300: tokens.colors.gray[300],
          400: tokens.colors.gray[400],
          500: tokens.colors.gray[500],
          700: tokens.colors.gray[700],
          800: tokens.colors.gray[800],
          900: tokens.colors.gray[900],
        },
        
        // Semantic colors for UI states
        foreground: tokens.colors.black,
        background: tokens.colors.white,
        muted: tokens.colors.gray[700],
        'muted-foreground': tokens.colors.gray[500],
        border: tokens.colors.gray[500],
        input: tokens.colors.white,
        card: tokens.colors.white,
        'card-foreground': tokens.colors.black,
        primary: tokens.colors.accent.burntOrange,
        'primary-foreground': tokens.colors.white,
        secondary: tokens.colors.black,
        'secondary-foreground': tokens.colors.white,
      },
      
      // Typography - MDS geometric type system
      fontFamily: {
        primary: [tokens.typography.fontFamily.primary],
        sans: [tokens.typography.fontFamily.fallback],
      },
      
      fontSize: {
        'h1': [tokens.typography.fontSize.h1, { 
          fontWeight: tokens.typography.fontWeight.medium,
          letterSpacing: tokens.typography.letterSpacing.wide,
          lineHeight: tokens.typography.lineHeight.tight,
          textTransform: tokens.typography.textTransform.uppercase,
        }],
        'h2': [tokens.typography.fontSize.h2, { 
          fontWeight: tokens.typography.fontWeight.medium,
          letterSpacing: tokens.typography.letterSpacing.wide,
          lineHeight: tokens.typography.lineHeight.tight,
        }],
        'h3': [tokens.typography.fontSize.h3, { 
          fontWeight: tokens.typography.fontWeight.normal,
          letterSpacing: tokens.typography.letterSpacing.wide,
          lineHeight: tokens.typography.lineHeight.tight,
          textTransform: tokens.typography.textTransform.uppercase,
        }],
        'h4': [tokens.typography.fontSize.h4, { 
          fontWeight: tokens.typography.fontWeight.medium,
          letterSpacing: tokens.typography.letterSpacing.tight,
          lineHeight: tokens.typography.lineHeight.tight,
          textTransform: tokens.typography.textTransform.uppercase,
        }],
        'h5': [tokens.typography.fontSize.h5, { 
          fontWeight: tokens.typography.fontWeight.medium,
          letterSpacing: tokens.typography.letterSpacing.normal,
          lineHeight: tokens.typography.lineHeight.tight,
          textTransform: tokens.typography.textTransform.uppercase,
        }],
        'body': [tokens.typography.fontSize.body, { 
          fontWeight: tokens.typography.fontWeight.normal,
          letterSpacing: tokens.typography.letterSpacing.normal,
          lineHeight: tokens.typography.lineHeight.normal,
        }],
        'small': [tokens.typography.fontSize.small, { 
          fontWeight: tokens.typography.fontWeight.normal,
          letterSpacing: tokens.typography.letterSpacing.normal,
          lineHeight: tokens.typography.lineHeight.normal,
        }],
      },
      
      // Letter spacing utilities
      letterSpacing: {
        'tight': tokens.typography.letterSpacing.tight,
        'wide': tokens.typography.letterSpacing.wide,
        'cta': tokens.typography.letterSpacing.cta,
      },
      
      // Layout - Sharp, geometric, flat
      borderRadius: {
        'none': tokens.layout.borderRadius.none,
        'sharp': tokens.layout.borderRadius.sharp,
      },
      
      boxShadow: {
        'none': tokens.layout.boxShadow.none,
        'subtle': tokens.layout.boxShadow.subtle,
      },
      
      // Spacing - MDS spacing system
      spacing: {
        ...Object.fromEntries(
          Object.entries(tokens.layout.spacing).map(([key, value]) => [key, value])
        ),
      },
      
      // Component styles
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'slide-up': {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
      
      animation: {
        'fade-in': 'fade-in 0.3s ease-out',
        'slide-up': 'slide-up 0.3s ease-out',
      },
    },
  },
  plugins: [],
};

export default config;
