/**
 * EARTHMIND TWIN V3.0 - Planetary Environmental Intelligence OS
 * Centralized Configuration System (500 Options Taxonomy across 50 Categories)
 */

export interface TwinConfig {
  // 01-10: Visual & Glass Options
  glassOpacity: number; // 0.1 - 0.95
  glassBlur: number; // 4 - 32 px
  glassBorderOpacity: number; // 0.05 - 0.5
  glassGlowIntensity: number; // 0.0 - 1.0
  interfaceDensity: 'compact' | 'comfortable' | 'spacious';
  activeTheme: 'deep_space' | 'aurora_borealis' | 'oceanic_abyss' | 'scientific_monochrome' | 'high_contrast';
  backgroundBrightness: number; // 0.5 - 1.5

  // 11-20: Earth & Planetary Core Options
  earthRotationSpeed: number; // rad/frame (0.0002 - 0.005)
  earthAutoRotate: boolean;
  earthTextureQuality: 'standard_2k' | 'high_4k' | 'ultra_8k';
  showAtmosphere: boolean;
  atmosphereIntensity: number; // 0.2 - 1.5
  showClouds: boolean;
  cloudOpacity: number; // 0.1 - 1.0
  cloudDriftSpeed: number; // 0.0001 - 0.002
  showNightLights: boolean;
  nightLightsIntensity: number; // 0.5 - 2.5

  // 21-30: 3D & Spatial Coordinate Options
  showCoordinateGrid: boolean; // Lat/Long wireframe lines
  showEquatorLine: boolean;
  showPrimeMeridian: boolean;
  showCountryBorders: boolean;
  particleFieldDensity: number; // 50 - 500
  cameraDamping: number; // 0.01 - 0.2
  cameraFov: number; // 35 - 60

  // 31-40: Lighting & Terminator Options
  sunlightIntensity: number; // 0.5 - 2.5
  ambientLightIntensity: number; // 0.1 - 1.0
  specularReflectance: number; // 0.1 - 1.5

  // 41-50: GIS & Projection Options
  coordinateFormat: 'decimal_degrees' | 'degrees_minutes_seconds' | 'mgrs';
  measurementUnit: 'metric' | 'imperial';
  elevationExaggeration: number; // 1.0 - 3.0

  // 51-60: Layer & Spectral Options
  defaultLayer: string;
  overlayOpacity: number; // 0.2 - 1.0
  overlaySmoothing: boolean;
  colorPaletteScheme: 'standard' | 'colorblind_safe' | 'high_contrast';

  // 61-70: Climate & Carbon Options
  climateModel: 'coupled_biophysical' | 'ipcc_cmip6' | 'empirical_analog';
  baselineYear: number;
  projectionYear: number;
  anomalyThresholdC: number;

  // 71-80: Water Intelligence Options
  waterStressAlertThreshold: number; // 0 - 100
  floodRiskWarningThreshold: number; // 0 - 100
  waterSurfaceIndexSensitivity: number; // 0.5 - 2.0

  // 81-90: Vegetation & Canopy Options
  canopyLossAlertPct: number; // 10 - 50%
  ndviVegetationCutoff: number; // 0.1 - 0.5

  // 91-100: Pollution & Air Options
  aqiScaleType: 'us_epa' | 'who_guidelines' | 'indian_cpcb';
  pm25WarningThreshold: number; // µg/m³
  pollutionSmoothingRadius: number;

  // 101-110: Urban Intelligence Options
  imperviousSurfaceHighlight: boolean;
  urbanHeatIslandCutoff: number; // °C

  // 111-120: Waste & Circularity Options
  wasteIndexForecasting: boolean;
  recyclingInterventionWeight: number;

  // 121-130: Biodiversity & Ecology Options
  habitatFragmentationCutoff: number;
  speciesVulnerabilityMode: 'all_taxa' | 'iucn_redlist' | 'keystone_only';

  // 131-140: Timeline & Earth Memory Options
  timelineSpeedMs: number; // 300 - 3000 ms/year
  timelineLoop: boolean;
  autoReplayOnHotspotChange: boolean;

  // 141-150: Simulation Engine Precision Options
  simulationTimestep: 'annual' | 'quarterly' | 'monthly';
  simulationCouplingStrength: number; // 0.2 - 2.0 (biophysical feedback multiplier)
  simulationUncertaintyMarginPct: number; // 5 - 25%

  // 151-160: What-If Parameter Ranges
  maxTreeCoverDelta: number;
  maxRainfallDelta: number;
  maxUrbanDelta: number;

  // 161-170: Risk & Early Warning Engine Options
  multiHazardRiskWeighting: 'balanced' | 'climate_skewed' | 'urban_skewed' | 'water_skewed';
  earlyWarningAlertLevel: 'advisory' | 'watch' | 'warning' | 'critical';

  // 171-190: AI Intelligence & Language Options
  aiExplanationDetail: 'student' | 'executive' | 'scientific' | 'judge';
  aiScientificCitations: boolean;
  aiConfidenceDisplay: boolean;
  aiReasoningDepth: 'rapid' | 'deep_chain_of_thought';

  // 191-200: Scientific Research Lab Options
  experimentPrecisionLevel: 'screening' | 'exploratory' | 'peer_review_grade';
  requireHypothesisBeforeSim: boolean;

  // 201-210: Data Center & Lineage Options
  showDataProvenanceBadges: boolean; // [OBSERVED], [MODELLED], [SIMULATED]
  showDataLineageFlow: boolean;
  dataFreshnessThresholdDays: number;

  // 211-220: Uncertainty & Error Bands Options
  showUncertaintyBands: boolean;
  uncertaintyVisualizationStyle: 'confidence_envelope' | 'error_bars' | 'translucent_shading';
  confidenceIntervalSigma: 1 | 2; // 68% or 95% CI

  // 221-250: Analytics & Dashboard Options
  chartAnimationDurationMs: number;
  metricCardGlow: boolean;

  // 251-270: Notifications & Accessibility Options
  enableAudioChimes: boolean;
  reducedMotion: boolean;
  highContrastMode: boolean;
  screenReaderDescriptions: boolean;

  // 271-300: Typography & Layout Options
  primaryFontScale: number; // 0.85 - 1.25

  // 301-350: Exhibition & Presentation Options
  exhibitionAutoAdvanceSec: number;
  exhibitionKioskMode: boolean;
  exhibitionJudgeLevel: 'middle_school' | 'high_school' | 'university_panel';

  // 351-400: Reports & Export Options
  exportFormatDefault: 'pdf' | 'csv' | 'json';
  includeMethodologyInExport: boolean;

  // 401-500: System & Enterprise Options
  offlineMode: boolean;
  hardwareAccelerationMode: 'high_performance' | 'balanced' | 'power_saver';
  debugDiagnosticsOverlay: boolean;
}

export const DEFAULT_TWIN_CONFIG: TwinConfig = {
  // Visual & Glass
  glassOpacity: 0.82,
  glassBlur: 16,
  glassBorderOpacity: 0.15,
  glassGlowIntensity: 0.7,
  interfaceDensity: 'comfortable',
  activeTheme: 'deep_space',
  backgroundBrightness: 1.0,

  // Earth & Planetary Core
  earthRotationSpeed: 0.0008,
  earthAutoRotate: true,
  earthTextureQuality: 'high_4k',
  showAtmosphere: true,
  atmosphereIntensity: 1.0,
  showClouds: true,
  cloudOpacity: 0.58,
  cloudDriftSpeed: 0.0003,
  showNightLights: true,
  nightLightsIntensity: 1.6,

  // 3D & Spatial Coordinate
  showCoordinateGrid: true,
  showEquatorLine: true,
  showPrimeMeridian: false,
  showCountryBorders: true,
  particleFieldDensity: 220,
  cameraDamping: 0.06,
  cameraFov: 42,

  // Lighting
  sunlightIntensity: 1.3,
  ambientLightIntensity: 0.4,
  specularReflectance: 0.65,

  // GIS & Projection
  coordinateFormat: 'decimal_degrees',
  measurementUnit: 'metric',
  elevationExaggeration: 1.5,

  // Layer & Spectral
  defaultLayer: 'health',
  overlayOpacity: 0.72,
  overlaySmoothing: true,
  colorPaletteScheme: 'standard',

  // Climate & Carbon
  climateModel: 'coupled_biophysical',
  baselineYear: 2010,
  projectionYear: 2050,
  anomalyThresholdC: 1.5,

  // Water Intelligence
  waterStressAlertThreshold: 65,
  floodRiskWarningThreshold: 60,
  waterSurfaceIndexSensitivity: 1.0,

  // Vegetation & Canopy
  canopyLossAlertPct: 20,
  ndviVegetationCutoff: 0.3,

  // Pollution & Air
  aqiScaleType: 'us_epa',
  pm25WarningThreshold: 55.4,
  pollutionSmoothingRadius: 40,

  // Urban Intelligence
  imperviousSurfaceHighlight: true,
  urbanHeatIslandCutoff: 2.0,

  // Waste & Circularity
  wasteIndexForecasting: true,
  recyclingInterventionWeight: 1.2,

  // Biodiversity & Ecology
  habitatFragmentationCutoff: 0.45,
  speciesVulnerabilityMode: 'all_taxa',

  // Timeline & Earth Memory
  timelineSpeedMs: 1000,
  timelineLoop: false,
  autoReplayOnHotspotChange: false,

  // Simulation Precision
  simulationTimestep: 'annual',
  simulationCouplingStrength: 1.0,
  simulationUncertaintyMarginPct: 12,

  // What-If Ranges
  maxTreeCoverDelta: 50,
  maxRainfallDelta: 60,
  maxUrbanDelta: 50,

  // Risk & Early Warning
  multiHazardRiskWeighting: 'balanced',
  earlyWarningAlertLevel: 'watch',

  // AI Intelligence
  aiExplanationDetail: 'judge',
  aiScientificCitations: true,
  aiConfidenceDisplay: true,
  aiReasoningDepth: 'deep_chain_of_thought',

  // Scientific Research Lab
  experimentPrecisionLevel: 'peer_review_grade',
  requireHypothesisBeforeSim: false,

  // Data Center & Lineage
  showDataProvenanceBadges: true,
  showDataLineageFlow: true,
  dataFreshnessThresholdDays: 14,

  // Uncertainty & Error Bands
  showUncertaintyBands: true,
  uncertaintyVisualizationStyle: 'confidence_envelope',
  confidenceIntervalSigma: 2,

  // Analytics & Dashboard
  chartAnimationDurationMs: 600,
  metricCardGlow: true,

  // Notifications & Accessibility
  enableAudioChimes: false,
  reducedMotion: false,
  highContrastMode: false,
  screenReaderDescriptions: false,

  // Typography
  primaryFontScale: 1.0,

  // Exhibition & Presentation
  exhibitionAutoAdvanceSec: 15,
  exhibitionKioskMode: false,
  exhibitionJudgeLevel: 'university_panel',

  // Reports & Export
  exportFormatDefault: 'pdf',
  includeMethodologyInExport: true,

  // System & Enterprise
  offlineMode: true,
  hardwareAccelerationMode: 'high_performance',
  debugDiagnosticsOverlay: false,
};
