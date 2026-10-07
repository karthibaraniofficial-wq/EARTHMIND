/**
 * EARTHMIND - Brand Identity & Design System Tokens
 * Master source of truth for planetary intelligence visual identity.
 */

export const BRAND_TOKENS = {
  name: 'EARTHMIND',
  namePrefix: 'EARTH',
  nameSuffix: 'MIND',
  tagline: 'PLANETARY ENVIRONMENTAL INTELLIGENCE',
  subTagline: 'See the planet. Understand its changes. Simulate its future.',
  edition: 'SCIENCE EXPO 2026 EDITION',
  version: 'v4.0 OS',

  // Core Color Matrix
  colors: {
    // Primary Identity
    deepNavy: '#071A2B',
    spaceDark: '#030D16',
    surfaceGlass: 'rgba(9, 28, 48, 0.72)',
    
    // Atmospheric & Neural
    atmosphericCyan: '#18C8C8',
    cyanGlow: 'rgba(24, 200, 200, 0.4)',
    
    // Living Biosphere
    intelligenceEmerald: '#27C98A',
    emeraldGlow: 'rgba(39, 201, 138, 0.4)',
    
    // Neural Aurora
    neuralAurora: '#9B7CFF',
    auroraGlow: 'rgba(155, 124, 255, 0.4)',
    
    // Hydrosphere Sky
    hydrosphereSky: '#4FA8FF',
    
    // Pure Accents
    pureWhite: '#FFFFFF',
    textMuted: '#94A3B8',
    textDim: '#64748B',
  },

  // Dimensions
  sizes: {
    xs: 16,
    sm: 24,
    md: 32,
    lg: 48,
    xl: 64,
    '2xl': 96,
  },

  // Asset URLs
  assets: {
    symbolSvg: '/brand/earthmind-symbol.svg',
    symbolWhiteSvg: '/brand/earthmind-symbol-white.svg',
    symbolDarkSvg: '/brand/earthmind-symbol-dark.svg',
    logoSvg: '/brand/earthmind-logo.svg',
    logoWhiteSvg: '/brand/earthmind-logo-white.svg',
    logoDarkSvg: '/brand/earthmind-logo-dark.svg',
    faviconSvg: '/brand/earthmind-symbol.svg',
  },
} as const;

export type BrandColor = keyof typeof BRAND_TOKENS.colors;
export type BrandSize = keyof typeof BRAND_TOKENS.sizes;
