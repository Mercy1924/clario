/**
 * Clarios Design Tokens
 * ADHD-first design system: calm, directive, non-overwhelming
 *
 * Font: Maven Pro (https://fonts.google.com/specimen/Maven+Pro)
 * Install: expo install expo-font && load Maven Pro from Google Fonts
 */

// ============================================================================
// COLORS
// ============================================================================

export const BRAND = {
  primary: '#58329A',      // Deep purple - primary actions, headers
  primaryLight: '#D1B5FE', // Soft lavender - highlights, accents
  primaryDark: '#3D1F6E',  // Darker purple - hover states

  // Extended brand palette
  primaryMuted: 'rgba(88, 50, 154, 0.1)',  // 10% opacity for backgrounds
  primarySubtle: 'rgba(88, 50, 154, 0.2)', // 20% opacity
};

export const NEUTRAL = {
  // Base neutral (your specified color)
  base: '#0C0A0F',         // Near-black for text

  // Generated scale (9 steps for flexibility)
  50: '#F8F7FA',           // Lightest - backgrounds
  100: '#E8E6ED',          // Subtle borders
  200: '#D1CED9',          // Disabled states
  300: '#B3AEC4',          // Placeholder text
  400: '#8F89A3',          // Secondary text
  500: '#6B6480',          // Tertiary text
  600: '#4D4661',          // Icon secondary
  700: '#332D42',          // Card backgrounds (dark mode)
  800: '#1F1A29',          // Surface (dark mode)
  900: '#0C0A0F',          // Base - primary text
};

export const SEMANTIC = {
  // Functional colors with ADHD-friendly muted tones
  success: {
    base: '#2D7A4F',       // Calm green - completion states
    light: '#4CAF6B',
    muted: 'rgba(45, 122, 79, 0.1)',
  },
  warning: {
    base: '#B58942',       // Muted amber - cautions (not alarming)
    light: '#D4A85B',
    muted: 'rgba(181, 137, 66, 0.1)',
  },
  error: {
    base: '#9B3D4E',       // Soft red - errors (not bright/alarming)
    light: '#C45968',
    muted: 'rgba(155, 61, 78, 0.1)',
  },
  info: {
    base: '#4A6FA5',       // Calm blue - information
    light: '#6B8FC4',
    muted: 'rgba(74, 111, 165, 0.1)',
  },
};

// ============================================================================
// TYPOGRAPHY
// ============================================================================

export const FONT = {
  family: 'Maven Pro',

  // Weights
  regular: 400,
  medium: 500,
  semiBold: 600,
  bold: 700,
};

export const FONT_SIZE = {
  // Based on accessibility standards (16px base)
  xs: 12,    // Captions, metadata
  sm: 14,    // Secondary text, labels
  md: 16,    // Body text (default)
  lg: 18,    // Emphasized body
  xl: 20,    // Small headers
  '2xl': 24, // Section headers
  '3xl': 30, // Page titles
  '4xl': 36, // Large display (use sparingly)
};

export const LINE_HEIGHT = {
  // Tight for headers, loose for body
  tight: 1.2,    // Headers
  base: 1.5,     // Body text
  relaxed: 1.75, // Long-form content
};

export const LETTER_SPACING = {
  tight: -0.5,   // Headers
  base: 0,       // Body
  wide: 0.5,     // Labels, buttons
};

// ============================================================================
// SPACING
// ============================================================================

export const SPACING = {
  // 4px base grid (mobile-friendly)
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  '2xl': 24,
  '3xl': 32,
  '4xl': 40,
  '5xl': 48,
  '6xl': 64,
};

// ============================================================================
// BORDER RADIUS
// ============================================================================

export const RADIUS = {
  none: 0,
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  '2xl': 20,
  full: 9999, // Pill/circle
};

// ============================================================================
// SHADOWS (subtle, not distracting)
// ============================================================================

export const SHADOW = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
  },
  // Inner shadow for pressed states
  inner: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
};

// ============================================================================
// ANIMATION (calm, not jarring)
// ============================================================================

export const ANIMATION = {
  // Duration in milliseconds
  duration: {
    fast: 150,
    base: 250,
    slow: 400,
  },

  // Easing
  easing: {
    ease: 'ease',
    easeIn: 'ease-in',
    easeOut: 'ease-out',
    easeInOut: 'ease-in-out',
    // ADHD-friendly: smooth start/end
    spring: { damping: 15, stiffness: 150 },
  },
};

// ============================================================================
// LAYOUT
// ============================================================================

export const LAYOUT = {
  // Touch targets (accessibility minimum: 44x44)
  touchTarget: 48,

  // Screen padding
  screenPadding: {
    sm: SPACING.lg,
    md: SPACING.xl,
    lg: SPACING['2xl'],
  },

  // Card padding
  cardPadding: SPACING.lg,

  // Max content width (for readability)
  maxContentWidth: 600,
};

// ============================================================================
// THEME CONFIGURATION
// ============================================================================

export const THEME = {
  light: {
    background: NEUTRAL[50],
    surface: '#FFFFFF',
    surfaceElevated: '#FFFFFF',

    text: {
      primary: NEUTRAL[900],
      secondary: NEUTRAL[500],
      tertiary: NEUTRAL[400],
      inverse: '#FFFFFF',
    },

    border: {
      default: NEUTRAL[200],
      strong: NEUTRAL[300],
    },

    // Interactive states
    button: {
      primary: {
        background: BRAND.primary,
        text: '#FFFFFF',
        pressed: BRAND.primaryDark,
      },
      secondary: {
        background: 'transparent',
        text: BRAND.primary,
        border: BRAND.primary,
        pressed: BRAND.primaryMuted,
      },
      ghost: {
        background: 'transparent',
        text: NEUTRAL[600],
        pressed: NEUTRAL[100],
      },
    },

    input: {
      background: '#FFFFFF',
      border: NEUTRAL[200],
      borderFocused: BRAND.primary,
      placeholder: NEUTRAL[300],
    },

    card: {
      background: '#FFFFFF',
      border: NEUTRAL[100],
    },
  },

  dark: {
    background: NEUTRAL[900],
    surface: NEUTRAL[800],
    surfaceElevated: NEUTRAL[700],

    text: {
      primary: NEUTRAL[50],
      secondary: NEUTRAL[200],
      tertiary: NEUTRAL[300],
      inverse: NEUTRAL[900],
    },

    border: {
      default: NEUTRAL[700],
      strong: NEUTRAL[600],
    },

    // Interactive states
    button: {
      primary: {
        background: BRAND.primaryLight,
        text: NEUTRAL[900],
        pressed: '#FFFFFF',
      },
      secondary: {
        background: 'transparent',
        text: BRAND.primaryLight,
        border: BRAND.primaryLight,
        pressed: 'rgba(209, 181, 254, 0.1)',
      },
      ghost: {
        background: 'transparent',
        text: NEUTRAL[300],
        pressed: NEUTRAL[800],
      },
    },

    input: {
      background: NEUTRAL[800],
      border: NEUTRAL[700],
      borderFocused: BRAND.primaryLight,
      placeholder: NEUTRAL[500],
    },

    card: {
      background: NEUTRAL[800],
      border: NEUTRAL[700],
    },
  },
};

// Export all tokens as a single object for convenience
export const tokens = {
  BRAND,
  NEUTRAL,
  SEMANTIC,
  FONT,
  FONT_SIZE,
  LINE_HEIGHT,
  LETTER_SPACING,
  SPACING,
  RADIUS,
  SHADOW,
  ANIMATION,
  LAYOUT,
  THEME,
};
