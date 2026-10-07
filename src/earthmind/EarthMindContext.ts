/**
 * EARTHMIND - Real-Time Screen & Domain Context Model
 * Provides complete operational grounding of what the operator is viewing on screen.
 */

import { AppActionContext } from '../voice/VoiceActionExecutor';
import { EnvironmentalHotspot, LayerType, SavedScenario, SimulationParameters } from '../types';
import { computeSimulationMetrics, BASELINE_METRICS } from '../domains/simulation/SimulationEngine';

export interface EarthMindScreenContext {
  currentPage: string;
  currentModule: string;
  selectedLocation: {
    id: string;
    name: string;
    region: string;
    country: string;
    coordinates: { lat: number; lng: number };
    primaryRisk: string;
    environmentalHealth: number;
  };
  latitude: number;
  longitude: number;
  selectedYear: number;
  activeLayers: {
    primary: LayerType;
    visibleOverlays: string[];
  };
  visibleCharts: {
    title: string;
    currentMetric: string;
    highestRecordedYear?: number;
    highestRecordedValue?: number;
    trendDirection: 'increasing' | 'decreasing' | 'stable';
  };
  activeCharts: {
    title: string;
    currentMetric: string;
    highestRecordedYear?: number;
    highestRecordedValue?: number;
    trendDirection: 'increasing' | 'decreasing' | 'stable';
  };
  visibleMap: {
    focusedHotspot: string;
    zoomLevel: number;
    activeRasterType: string;
  };
  activeMap: {
    focusedHotspot: string;
    zoomLevel: number;
    activeRasterType: string;
  };
  selectedScenario: {
    id: string;
    name: string;
    tag?: string;
  };
  simulationState: SimulationParameters;
  simulationResults: {
    heatRisk: number;
    floodRisk: number;
    pollution: number;
    waterStress: number;
    environmentalHealth: number;
    deltaFromBaseline: Record<string, number>;
  };
  selectedObject: string;
  currentReport: {
    isAvailable: boolean;
    status: string;
  };
  currentAlerts: {
    hasActiveAlert: boolean;
    count: number;
    message?: string;
    severity?: 'low' | 'medium' | 'high' | 'critical';
  };
  currentAlert: {
    hasActiveAlert: boolean;
    message?: string;
    severity?: 'low' | 'medium' | 'high' | 'critical';
  };
  exhibitionMode: boolean;
  visibleMetrics: Record<string, number | string>;
  visibleLegend: {
    layer: string;
    min: string;
    max: string;
    unit: string;
  };
  visibleAnnotations: string[];
}

export function buildScreenContext(ctx: AppActionContext): EarthMindScreenContext {
  const spot = ctx.selectedHotspot;
  const sim = ctx.simParams;
  const metrics = computeSimulationMetrics(sim);

  const deltas = {
    heatRisk: Math.round((metrics.heatRisk - BASELINE_METRICS.heatRisk) * 10) / 10,
    floodRisk: Math.round((metrics.floodRisk - BASELINE_METRICS.floodRisk) * 10) / 10,
    pollution: Math.round((metrics.pollution - BASELINE_METRICS.pollution) * 10) / 10,
    waterStress: Math.round((metrics.waterStress - BASELINE_METRICS.waterStress) * 10) / 10,
    environmentalHealth: Math.round((metrics.environmentalHealth - BASELINE_METRICS.environmentalHealth) * 10) / 10,
  };

  // Find max historical flood risk or temperature
  let maxYear = 2026;
  let maxVal = 0;
  if (spot && spot.history && spot.history.length > 0) {
    spot.history.forEach((h) => {
      if (h.floodRiskScore > maxVal) {
        maxVal = h.floodRiskScore;
        maxYear = h.year;
      }
    });
  }

  const chartInfo = {
    title: `${spot ? spot.name : 'Regional'} Historical Multi-Decadal Time Series`,
    currentMetric: ctx.activeLayer || 'health',
    highestRecordedYear: maxYear,
    highestRecordedValue: maxVal,
    trendDirection: 'increasing' as const,
  };

  const mapInfo = {
    focusedHotspot: spot ? spot.name : 'Amazon Rainforest',
    zoomLevel: 4.5,
    activeRasterType: ctx.activeLayer || 'health',
  };

  const alertInfo = {
    hasActiveAlert: metrics.floodRisk > 75 || metrics.heatRisk > 80,
    count: (metrics.floodRisk > 75 ? 1 : 0) + (metrics.heatRisk > 80 ? 1 : 0),
    message: metrics.floodRisk > 75 ? 'Critical Flood Exposure Alert' : undefined,
    severity: (metrics.floodRisk > 85 ? 'critical' : metrics.floodRisk > 75 ? 'high' : 'low') as 'low' | 'medium' | 'high' | 'critical',
  };

  return {
    currentPage: ctx.currentView || 'overview',
    currentModule: getModuleDescription(ctx.currentView || 'overview'),
    selectedLocation: {
      id: spot ? spot.id : 'amazon',
      name: spot ? spot.name : 'Amazon Rainforest',
      region: spot ? spot.region : 'South America',
      country: spot ? spot.country : 'Brazil',
      coordinates: spot ? spot.coordinates : { lat: -3.4653, lng: -62.2159 },
      primaryRisk: spot ? spot.primaryRisk : 'Deforestation',
      environmentalHealth: spot ? spot.currentMetrics.environmentalHealth : 71,
    },
    latitude: spot ? spot.coordinates.lat : -3.4653,
    longitude: spot ? spot.coordinates.lng : -62.2159,
    selectedYear: ctx.selectedYear || 2026,
    activeLayers: {
      primary: ctx.activeLayer || 'health',
      visibleOverlays: [ctx.activeLayer || 'health'],
    },
    visibleCharts: chartInfo,
    activeCharts: chartInfo,
    visibleMap: mapInfo,
    activeMap: mapInfo,
    selectedScenario: {
      id: ctx.scenarios && ctx.scenarios[0] ? ctx.scenarios[0].id : 'baseline',
      name: ctx.scenarios && ctx.scenarios[0] ? ctx.scenarios[0].name : 'Business as Usual',
      tag: ctx.scenarios && ctx.scenarios[0] ? ctx.scenarios[0].tag : 'Baseline',
    },
    simulationState: sim,
    simulationResults: {
      ...metrics,
      deltaFromBaseline: deltas,
    },
    selectedObject: spot ? spot.name : 'Earth Globe',
    currentReport: {
      isAvailable: true,
      status: 'Ready for Synthesis',
    },
    currentAlerts: alertInfo,
    currentAlert: {
      hasActiveAlert: alertInfo.hasActiveAlert,
      message: alertInfo.message,
      severity: alertInfo.severity,
    },
    exhibitionMode: ctx.isExhibitionMode || false,
    visibleMetrics: {
      EnvironmentalHealth: metrics.environmentalHealth,
      HeatRiskIndex: metrics.heatRisk,
      FloodExposure: metrics.floodRisk,
      PollutionAqi: metrics.pollution,
      WaterStress: metrics.waterStress,
    },
    visibleLegend: {
      layer: ctx.activeLayer || 'health',
      min: '0 (Optimal / Low Risk)',
      max: '100 (Severe Impact / Critical)',
      unit: 'Index [0-100]',
    },
    visibleAnnotations: [
      `Satellite sensor raster active: ${ctx.activeLayer || 'health'}`,
      `Timeline calibrated to epoch: ${ctx.selectedYear || 2026}`,
    ],
  };
}

export function explainScreen(screen: EarthMindScreenContext): { spoken: string; summary: string } {
  const loc = screen.selectedLocation;
  const layerLabel = screen.activeLayers.primary.replace('_', ' ');
  const spoken = `You are viewing the ${screen.currentModule}, focused on ${loc.name} in ${loc.country}. The active satellite layer is ${layerLabel} for year ${screen.selectedYear}, with a regional Environmental Health score of ${loc.environmentalHealth}.`;
  const summary = `Location: ${loc.name} (${loc.region}, ${loc.country}) | Module: ${screen.currentModule} | Active Layer: ${layerLabel} | Year: ${screen.selectedYear} | Primary Risk: ${loc.primaryRisk} | Environmental Health: ${loc.environmentalHealth}/100`;
  return { spoken, summary };
}

function getModuleDescription(view: string): string {
  const map: Record<string, string> = {
    overview: 'Planetary Command Overview & Biome Telemetry',
    explorer: '3D Earth Remote Sensing Explorer',
    memory: 'Earth Memory Multi-Decadal Historical Timeline',
    simulator: 'Biophysical Coupled What-If Counterfactual Simulator',
    forensics: 'Satellite Environmental Forensics Investigation Lab',
    compare: 'Scenario Comparison & Future Branching Lab',
    reports: 'Environmental Intelligence Report Synthesis & Export',
    water: 'Global Hydrological & Aquifer Intelligence Hub',
    climate: 'Climate, Carbon Flux & Thermal Forcing Center',
    autopilot: 'EarthMind Autonomous Environmental Sentinel Autopilot',
    council: 'Multilateral Environmental AI Council',
  };
  return map[view] || `${view.toUpperCase()} Domain`;
}
