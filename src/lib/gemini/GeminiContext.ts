/**
 * EARTHMIND - Context Engine
 * Constructs compact, structured application state for Gemini Live grounding.
 */

import { AppActionContext } from '../../voice/VoiceActionExecutor';
import { BASELINE_PARAMETERS, computeSimulationMetrics } from '../../domains/simulation/SimulationEngine';

export interface EarthMindContextLocation {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  region?: string;
  primaryRisk?: string;
}

export interface EarthMindContextSimulation {
  variables: Record<string, number>;
  baseline: Record<string, number>;
  result: import('../../types').SimulationResultMetrics;
  delta: Record<string, number>;
}

export interface EarthMindContext {
  currentModule: string;
  currentPage: string;
  selectedLocation: EarthMindContextLocation;
  selectedYear: number;
  activeLayers: string[];
  activeScenario: string;
  simulation: EarthMindContextSimulation;
  chart?: {
    title: string;
    type: string;
    summary: string;
  };
  map: {
    layer: string;
    selectedRegion: string;
    selectedValue: string;
  };
  report: {
    currentSection: string;
  };
  exhibition: {
    active: boolean;
    currentSlide: number;
  };
}

/**
 * Builds real-time structured application context from the live EarthMind state.
 */
export function buildEarthMindContext(ctx: AppActionContext): EarthMindContext {
  const spot = ctx.selectedHotspot;
  const currentMetrics = computeSimulationMetrics(ctx.simParams);
  const baselineMetrics = computeSimulationMetrics(BASELINE_PARAMETERS);

  // Calculate delta
  const deltaMetrics: Record<string, number> = {};
  for (const key of Object.keys(currentMetrics) as (keyof typeof currentMetrics)[]) {
    deltaMetrics[key] = Math.round((currentMetrics[key] - baselineMetrics[key]) * 10) / 10;
  }

  return {
    currentModule: ctx.currentView,
    currentPage: ctx.currentView,
    selectedLocation: {
      id: spot.id,
      name: spot.name,
      latitude: spot.coordinates.lat,
      longitude: spot.coordinates.lng,
      region: spot.region,
      primaryRisk: spot.primaryRisk,
    },
    selectedYear: ctx.selectedYear ?? 2026,
    activeLayers: [ctx.activeLayer],
    activeScenario: 'Current Active Simulation',
    simulation: {
      variables: { ...ctx.simParams },
      baseline: { ...BASELINE_PARAMETERS },
      result: currentMetrics,
      delta: deltaMetrics,
    },
    chart: {
      title: 'Biophysical Response Trajectory',
      type: 'Multi-Variable Delta Line',
      summary: `Health Score: ${currentMetrics.environmentalHealth} (Delta: ${deltaMetrics.environmentalHealth > 0 ? '+' : ''}${deltaMetrics.environmentalHealth})`,
    },
    map: {
      layer: ctx.activeLayer,
      selectedRegion: spot.name,
      selectedValue: `Active layer: ${ctx.activeLayer} over ${spot.name}`,
    },
    report: {
      currentSection: ctx.currentView === 'report' ? 'Synthesis Overview' : 'Operational Monitoring',
    },
    exhibition: {
      active: ctx.isExhibitionMode,
      currentSlide: 1,
    },
  };
}

/**
 * Serializes the context into a concise summary string for Gemini Live grounding.
 */
export function serializeEarthMindContext(context: EarthMindContext): string {
  return JSON.stringify({
    view: context.currentModule,
    location: `${context.selectedLocation.name} (${context.selectedLocation.latitude.toFixed(2)}, ${context.selectedLocation.longitude.toFixed(2)})`,
    year: context.selectedYear,
    layer: context.activeLayers.join(', '),
    simulation: {
      treeCoverDelta: `${context.simulation.variables.treeCoverDelta}%`,
      rainfallDelta: `${context.simulation.variables.rainfallDelta}%`,
      tempRise: `+${context.simulation.variables.temperatureAnomaly || 0}°C`,
      healthScore: context.simulation.result.environmentalHealth,
      heatRisk: context.simulation.result.heatRisk,
      waterStress: context.simulation.result.waterStress,
    },
    exhibitionActive: context.exhibition.active,
  });
}
