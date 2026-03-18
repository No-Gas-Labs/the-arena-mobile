export const COLORS = {
  // Primary
  primary: '#00d9ff',
  primaryDark: '#00a8cc',
  primaryLight: '#66e5ff',
  
  // Secondary
  secondary: '#ff006e',
  secondaryDark: '#cc0058',
  secondaryLight: '#ff4d94',
  
  // Success/Error
  success: '#00ff88',
  error: '#ff3333',
  warning: '#ffbb44',
  
  // Background
  background: '#050812',
  backgroundSecondary: '#0a0e27',
  backgroundTertiary: '#1a1f3a',
  
  // Text
  textPrimary: '#ffffff',
  textSecondary: '#e0e0e0',
  textMuted: '#a0a0a0',
  textDisabled: '#666666',
  
  // Borders
  border: '#0f2030',
  borderLight: '#1a3050',
  
  // Model colors
  gemini: '#4285F4',
  chatgpt: '#10A37F',
  claude: '#9B59B6',
  grok: '#000000',
} as const;

export const FONTS = {
  regular: 'System',
  medium: 'System',
  bold: 'System',
  mono: 'JetBrains Mono',
} as const;

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
} as const;

export const BORDER_RADIUS = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  full: 9999,
} as const;

export const SHADOWS = {
  small: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  medium: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 4,
  },
  large: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  glow: {
    shadowColor: '#00d9ff',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 12,
    elevation: 12,
  },
} as const;

export const GRADIENTS = {
  primary: ['#050812', '#0a0e27', '#050812'],
  secondary: ['#050812', '#1a0a27', '#050812'],
  success: ['#050812', '#0a271a', '#050812'],
} as const;