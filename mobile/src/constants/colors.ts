// PAPYR Color Theme - Vintage Aesthetic
export const COLORS = {
  // Primary Colors (from web version)
  cream: '#F5F1E8',
  darkBrown: '#3D2B1F',
  brown: '#8B7355',
  lightBrown: '#C8B59D',

  // UI Colors
  white: '#FFFFFF',
  black: '#000000',

  // Status Colors
  success: '#4CAF50',
  error: '#F44336',
  warning: '#FF9800',
  info: '#2196F3',

  // Text Colors
  textPrimary: '#3D2B1F',
  textSecondary: '#8B7355',
  textLight: '#C8B59D',

  // Background Colors
  backgroundPrimary: '#F5F1E8',
  backgroundSecondary: '#FFFFFF',
  backgroundDark: '#3D2B1F',

  // Border Colors
  border: '#C8B59D',
  borderLight: '#E5DCC9',

  // Special
  overlay: 'rgba(61, 43, 31, 0.5)',
  shadowColor: '#3D2B1F',
} as const;

export type ColorKey = keyof typeof COLORS;
