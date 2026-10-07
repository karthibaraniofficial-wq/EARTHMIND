/**
 * EARTHMIND THEME TOKENS & DESIGN SYSTEM DEFINITIONS
 * Centralized Single Source of Truth for Liquid Glass UI 2.0
 */

export type ThemePresetId =
  | 'pure'
  | 'glass'
  | 'aurora'
  | 'ocean'
  | 'forest'
  | 'arctic'
  | 'mission'
  | 'mono'
  | 'expo'
  | 'custom';

export type DesignMode =
  | 'focus'
  | 'earth'
  | 'data'
  | 'research'
  | 'simulation'
  | 'exhibition'
  | 'control';

export type CustomizationComplexity = 0 | 25 | 50 | 75 | 100;

export type PerformanceLevel = 'low' | 'balanced' | 'high' | 'ultra';

export interface ThemeColors {
  bg: string;
  surface: string;
  surfaceElevated: string;
  glass: string;
  glassStrong: string;
  glassSoft: string;
  border: string;
  borderBright: string;
  text: string;
  textSecondary: string;
  textMuted: string;
  accent: string;
  accentSoft: string;
  accentSecondary: string;
  success: string;
  warning: string;
  danger: string;
  info: string;
  shadow: string;
  glow: string;
}

export interface GlassPhysicsTokens {
  opacity: number;          // 0 - 100 (%)
  blur: number;             // 0 - 100 (maps to 0 - 40px)
  saturation: number;       // 0 - 200 (maps to % backdrop-saturate)
  brightness: number;       // 0 - 150 (maps to % backdrop-brightness)
  density: number;          // 0 - 100
  reflection: number;       // 0 - 100 (specular sheen intensity)
  noise: number;            // 0 - 100 (film grain)
  borderVisibility: number; // 0 - 100 (%)
  borderBrightness: number; // 0 - 100 (%)
}

export interface DepthTokens {
  shadow: number;           // 0 - 100
  elevation: number;        // 0 - 100
  ambientLight: number;     // 0 - 100
  surfaceDepth: number;     // 0 - 100
  glow: number;             // 0 - 100
}

export interface ShapeTokens {
  cornerRadius: number;     // 0 - 100 (maps to 0 - 36px)
  panelRoundness: number;   // 0 - 100 (maps to 0 - 40px)
  buttonRoundness: number;  // 0 - 100 (maps to 0 - 9999px)
  chipRoundness: number;    // 0 - 100 (maps to 0 - 9999px)
}

export interface TypographyTokens {
  fontFamily: 'Plus Jakarta Sans' | 'Inter' | 'Outfit' | 'JetBrains Mono' | 'System';
  fontSizeScale: number;    // 80 - 140 (%)
  fontWeightBase: number;   // 300 - 600
  letterSpacing: number;    // -2 to 4 (px / em)
  lineHeightScale: number;  // 80 - 140 (%)
  headingScale: number;     // 80 - 140 (%)
  dataScale: number;        // 80 - 140 (%)
}

export interface MotionTokens {
  intensity: number;        // 0 - 100 (%)
  hoverMotion: number;      // 0 - 100 (%)
  entranceMotion: number;   // 0 - 100 (%)
  transitionSpeed: number;  // 0 - 100 (maps to 100ms - 800ms)
  parallax: number;         // 0 - 100 (%)
  glassRefraction: number;  // 0 - 100 (%)
  particleMotion: number;   // 0 - 100 (%)
}

export interface LayoutTokens {
  density: number;          // 0 - 100
  panelSpacing: number;     // 0 - 100 (maps to 4px - 32px)
  contentWidth: number;     // 0 - 100 (maps to 1024px - 2200px)
  navigationWidth: number;  // 0 - 100 (maps to 56px - 280px)
  sidebarDensity: number;   // 0 - 100
  informationDensity: number; // 0 - 100
}

export interface EarthVisualTokens {
  glow: number;             // 0 - 100
  atmosphere: number;       // 0 - 100
  cloudVisibility: number;  // 0 - 100
  nightLights: number;      // 0 - 100
  brightness: number;       // 0 - 100
  contrast: number;         // 0 - 100
  saturation: number;       // 0 - 100
  scale: number;            // 0 - 100
  rotationSpeed: number;    // 0 - 100
}

export interface MapVisualTokens {
  opacity: number;          // 0 - 100
  contrast: number;         // 0 - 100
  labels: number;           // 0 - 100
  grid: number;             // 0 - 100
  boundaryStrength: number; // 0 - 100
  heatmapIntensity: number; // 0 - 100
}

export interface DataVisualTokens {
  chartGlow: number;        // 0 - 100
  chartThickness: number;   // 0 - 100
  gridVisibility: number;   // 0 - 100
  labelDensity: number;     // 0 - 100
  dataAnimation: number;    // 0 - 100
}

export interface AccessibilityTokens {
  reduceMotion: boolean;
  highContrast: boolean;
  largeText: boolean;
  focusVisibility: boolean;
  colorBlindMode: 'none' | 'protanopia' | 'deuteranopia' | 'tritanopia';
  screenReaderOptimized: boolean;
}

export interface EarthMindTheme {
  id: ThemePresetId;
  name: string;
  description: string;
  colors: ThemeColors;
  glass: GlassPhysicsTokens;
  depth: DepthTokens;
  shape: ShapeTokens;
  typography: TypographyTokens;
  motion: MotionTokens;
  layout: LayoutTokens;
  earth: EarthVisualTokens;
  map: MapVisualTokens;
  data: DataVisualTokens;
  accessibility: AccessibilityTokens;
  performance: PerformanceLevel;
}

export const DEFAULT_THEME_ID: ThemePresetId = 'aurora';
