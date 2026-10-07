import { EarthMindTheme, ThemePresetId, PerformanceLevel } from './ThemeTokens';
import { THEME_PRESETS } from './ThemePresets';

/**
 * Validates, clamps and sanitizes theme payloads
 * Guarantees zero code execution and structural integrity
 */

function clamp(value: unknown, min: number, max: number, fallback: number): number {
  if (typeof value !== 'number' || isNaN(value)) return fallback;
  return Math.min(max, Math.max(min, value));
}

function sanitizeColor(val: unknown, fallback: string): string {
  if (typeof val !== 'string') return fallback;
  const clean = val.trim();
  // Allow hex (#fff, #123456, #12345678), rgb(...), rgba(...)
  if (/^#([0-9a-fA-F]{3,8})$/.test(clean)) return clean;
  if (/^rgba?\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*(?:,\s*[\d.]+\s*)?\)$/.test(clean)) return clean;
  return fallback;
}

export function validateTheme(input: unknown): { valid: boolean; theme: EarthMindTheme; errors: string[] } {
  const errors: string[] = [];
  if (!input || typeof input !== 'object') {
    return {
      valid: false,
      theme: THEME_PRESETS.aurora,
      errors: ['Invalid theme payload: not an object'],
    };
  }

  const raw = input as Partial<EarthMindTheme>;
  const base = THEME_PRESETS[raw.id && THEME_PRESETS[raw.id as ThemePresetId] ? (raw.id as ThemePresetId) : 'custom'] || THEME_PRESETS.aurora;

  const validId: ThemePresetId =
    raw.id && THEME_PRESETS[raw.id as ThemePresetId]
      ? (raw.id as ThemePresetId)
      : 'custom';

  const validName = typeof raw.name === 'string' && raw.name.trim().length > 0
    ? raw.name.trim().slice(0, 60)
    : base.name;

  const validDescription = typeof raw.description === 'string'
    ? raw.description.trim().slice(0, 160)
    : base.description;

  const rawColors = (raw.colors || {}) as Record<string, unknown>;
  const colors = {
    bg: sanitizeColor(rawColors.bg, base.colors.bg),
    surface: sanitizeColor(rawColors.surface, base.colors.surface),
    surfaceElevated: sanitizeColor(rawColors.surfaceElevated, base.colors.surfaceElevated),
    glass: sanitizeColor(rawColors.glass, base.colors.glass),
    glassStrong: sanitizeColor(rawColors.glassStrong, base.colors.glassStrong),
    glassSoft: sanitizeColor(rawColors.glassSoft, base.colors.glassSoft),
    border: sanitizeColor(rawColors.border, base.colors.border),
    borderBright: sanitizeColor(rawColors.borderBright, base.colors.borderBright),
    text: sanitizeColor(rawColors.text, base.colors.text),
    textSecondary: sanitizeColor(rawColors.textSecondary, base.colors.textSecondary),
    textMuted: sanitizeColor(rawColors.textMuted, base.colors.textMuted),
    accent: sanitizeColor(rawColors.accent, base.colors.accent),
    accentSoft: sanitizeColor(rawColors.accentSoft, base.colors.accentSoft),
    accentSecondary: sanitizeColor(rawColors.accentSecondary, base.colors.accentSecondary),
    success: sanitizeColor(rawColors.success, base.colors.success),
    warning: sanitizeColor(rawColors.warning, base.colors.warning),
    danger: sanitizeColor(rawColors.danger, base.colors.danger),
    info: sanitizeColor(rawColors.info, base.colors.info),
    shadow: sanitizeColor(rawColors.shadow, base.colors.shadow),
    glow: sanitizeColor(rawColors.glow, base.colors.glow),
  };

  const rawGlass = (raw.glass || {}) as Record<string, unknown>;
  const glass = {
    opacity: clamp(rawGlass.opacity, 0, 100, base.glass.opacity),
    blur: clamp(rawGlass.blur, 0, 100, base.glass.blur),
    saturation: clamp(rawGlass.saturation, 0, 200, base.glass.saturation),
    brightness: clamp(rawGlass.brightness, 0, 150, base.glass.brightness),
    density: clamp(rawGlass.density, 0, 100, base.glass.density),
    reflection: clamp(rawGlass.reflection, 0, 100, base.glass.reflection),
    noise: clamp(rawGlass.noise, 0, 100, base.glass.noise),
    borderVisibility: clamp(rawGlass.borderVisibility, 0, 100, base.glass.borderVisibility),
    borderBrightness: clamp(rawGlass.borderBrightness, 0, 100, base.glass.borderBrightness),
  };

  const rawDepth = (raw.depth || {}) as Record<string, unknown>;
  const depth = {
    shadow: clamp(rawDepth.shadow, 0, 100, base.depth.shadow),
    elevation: clamp(rawDepth.elevation, 0, 100, base.depth.elevation),
    ambientLight: clamp(rawDepth.ambientLight, 0, 100, base.depth.ambientLight),
    surfaceDepth: clamp(rawDepth.surfaceDepth, 0, 100, base.depth.surfaceDepth),
    glow: clamp(rawDepth.glow, 0, 100, base.depth.glow),
  };

  const rawShape = (raw.shape || {}) as Record<string, unknown>;
  const shape = {
    cornerRadius: clamp(rawShape.cornerRadius, 0, 100, base.shape.cornerRadius),
    panelRoundness: clamp(rawShape.panelRoundness, 0, 100, base.shape.panelRoundness),
    buttonRoundness: clamp(rawShape.buttonRoundness, 0, 100, base.shape.buttonRoundness),
    chipRoundness: clamp(rawShape.chipRoundness, 0, 100, base.shape.chipRoundness),
  };

  const rawTypo = (raw.typography || {}) as Record<string, unknown>;
  const typography = {
    fontFamily: (['Plus Jakarta Sans', 'Inter', 'Outfit', 'JetBrains Mono', 'System'].includes(rawTypo.fontFamily as string)
      ? rawTypo.fontFamily
      : base.typography.fontFamily) as EarthMindTheme['typography']['fontFamily'],
    fontSizeScale: clamp(rawTypo.fontSizeScale, 80, 140, base.typography.fontSizeScale),
    fontWeightBase: clamp(rawTypo.fontWeightBase, 300, 600, base.typography.fontWeightBase),
    letterSpacing: clamp(rawTypo.letterSpacing, -2, 4, base.typography.letterSpacing),
    lineHeightScale: clamp(rawTypo.lineHeightScale, 80, 140, base.typography.lineHeightScale),
    headingScale: clamp(rawTypo.headingScale, 80, 140, base.typography.headingScale),
    dataScale: clamp(rawTypo.dataScale, 80, 140, base.typography.dataScale),
  };

  const rawMotion = (raw.motion || {}) as Record<string, unknown>;
  const motion = {
    intensity: clamp(rawMotion.intensity, 0, 100, base.motion.intensity),
    hoverMotion: clamp(rawMotion.hoverMotion, 0, 100, base.motion.hoverMotion),
    entranceMotion: clamp(rawMotion.entranceMotion, 0, 100, base.motion.entranceMotion),
    transitionSpeed: clamp(rawMotion.transitionSpeed, 0, 100, base.motion.transitionSpeed),
    parallax: clamp(rawMotion.parallax, 0, 100, base.motion.parallax),
    glassRefraction: clamp(rawMotion.glassRefraction, 0, 100, base.motion.glassRefraction),
    particleMotion: clamp(rawMotion.particleMotion, 0, 100, base.motion.particleMotion),
  };

  const rawLayout = (raw.layout || {}) as Record<string, unknown>;
  const layout = {
    density: clamp(rawLayout.density, 0, 100, base.layout.density),
    panelSpacing: clamp(rawLayout.panelSpacing, 0, 100, base.layout.panelSpacing),
    contentWidth: clamp(rawLayout.contentWidth, 0, 100, base.layout.contentWidth),
    navigationWidth: clamp(rawLayout.navigationWidth, 0, 100, base.layout.navigationWidth),
    sidebarDensity: clamp(rawLayout.sidebarDensity, 0, 100, base.layout.sidebarDensity),
    informationDensity: clamp(rawLayout.informationDensity, 0, 100, base.layout.informationDensity),
  };

  const rawEarth = (raw.earth || {}) as Record<string, unknown>;
  const earth = {
    glow: clamp(rawEarth.glow, 0, 100, base.earth.glow),
    atmosphere: clamp(rawEarth.atmosphere, 0, 100, base.earth.atmosphere),
    cloudVisibility: clamp(rawEarth.cloudVisibility, 0, 100, base.earth.cloudVisibility),
    nightLights: clamp(rawEarth.nightLights, 0, 100, base.earth.nightLights),
    brightness: clamp(rawEarth.brightness, 0, 100, base.earth.brightness),
    contrast: clamp(rawEarth.contrast, 0, 100, base.earth.contrast),
    saturation: clamp(rawEarth.saturation, 0, 100, base.earth.saturation),
    scale: clamp(rawEarth.scale, 0, 100, base.earth.scale),
    rotationSpeed: clamp(rawEarth.rotationSpeed, 0, 100, base.earth.rotationSpeed),
  };

  const rawMap = (raw.map || {}) as Record<string, unknown>;
  const map = {
    opacity: clamp(rawMap.opacity, 0, 100, base.map.opacity),
    contrast: clamp(rawMap.contrast, 0, 100, base.map.contrast),
    labels: clamp(rawMap.labels, 0, 100, base.map.labels),
    grid: clamp(rawMap.grid, 0, 100, base.map.grid),
    boundaryStrength: clamp(rawMap.boundaryStrength, 0, 100, base.map.boundaryStrength),
    heatmapIntensity: clamp(rawMap.heatmapIntensity, 0, 100, base.map.heatmapIntensity),
  };

  const rawData = (raw.data || {}) as Record<string, unknown>;
  const data = {
    chartGlow: clamp(rawData.chartGlow, 0, 100, base.data.chartGlow),
    chartThickness: clamp(rawData.chartThickness, 0, 100, base.data.chartThickness),
    gridVisibility: clamp(rawData.gridVisibility, 0, 100, base.data.gridVisibility),
    labelDensity: clamp(rawData.labelDensity, 0, 100, base.data.labelDensity),
    dataAnimation: clamp(rawData.dataAnimation, 0, 100, base.data.dataAnimation),
  };

  const rawAccess = (raw.accessibility || {}) as Record<string, unknown>;
  const accessibility = {
    reduceMotion: Boolean(rawAccess.reduceMotion),
    highContrast: Boolean(rawAccess.highContrast),
    largeText: Boolean(rawAccess.largeText),
    focusVisibility: rawAccess.focusVisibility !== undefined ? Boolean(rawAccess.focusVisibility) : true,
    colorBlindMode: (['none', 'protanopia', 'deuteranopia', 'tritanopia'].includes(rawAccess.colorBlindMode as string)
      ? rawAccess.colorBlindMode
      : 'none') as EarthMindTheme['accessibility']['colorBlindMode'],
    screenReaderOptimized: Boolean(rawAccess.screenReaderOptimized),
  };

  const performance: PerformanceLevel = (['low', 'balanced', 'high', 'ultra'].includes(raw.performance as string)
    ? raw.performance
    : base.performance) as PerformanceLevel;

  const validTheme: EarthMindTheme = {
    id: validId,
    name: validName,
    description: validDescription,
    colors,
    glass,
    depth,
    shape,
    typography,
    motion,
    layout,
    earth,
    map,
    data,
    accessibility,
    performance,
  };

  return { valid: errors.length === 0, theme: validTheme, errors };
}
