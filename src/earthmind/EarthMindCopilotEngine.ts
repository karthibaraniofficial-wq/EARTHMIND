/**
 * EARTHMIND - Contextual Copilot Engine (OS 4.0)
 * Evaluates active operator context and generates timely, non-intrusive scientific recommendations.
 */

import { EarthMindScreenContext } from './EarthMindContext';

export interface CopilotSuggestion {
  id: string;
  category: 'SIMULATION' | 'TEMPORAL' | 'RESEARCH' | 'LAYER' | 'DECISION';
  headline: string;
  body: string;
  actionLabel: string;
  commandType: string;
  payload?: any;
}

export class EarthMindCopilotEngine {
  /**
   * Generates a context-aware suggestion based on active view and hotspot state.
   */
  public static getContextualSuggestion(ctx: EarthMindScreenContext): CopilotSuggestion | null {
    const spot = ctx.selectedLocation;
    const page = ctx.currentPage;
    const layer = ctx.activeLayers.primary;

    // 1. Explorer view on high flood risk
    if (page === 'explorer' && (layer === 'flood' || spot.primaryRisk.toLowerCase().includes('flood'))) {
      return {
        id: `copilot-flood-${spot.id}`,
        category: 'TEMPORAL',
        headline: 'Corroborate Historical Precipitation Patterns',
        body: `You are viewing high flood vulnerability in ${spot.name}. Would you like to inspect rainfall and land cover trends in Earth Memory?`,
        actionLabel: 'Compare in Earth Memory',
        commandType: 'NAVIGATE_VIEW',
        payload: { view: 'memory', year: 2015 },
      };
    }

    // 2. High deforestation or green cover exploration
    if (layer === 'green_cover' || spot.primaryRisk.toLowerCase().includes('deforest')) {
      return {
        id: `copilot-deforest-${spot.id}`,
        category: 'SIMULATION',
        headline: 'Test Reforestation Impact on Runoff',
        body: `Canopy loss in ${spot.name} correlates with heightened surface runoff. Simulate a +25% tree cover intervention in the lab?`,
        actionLabel: 'Simulate +25% Canopy',
        commandType: 'APPLY_SIMULATION',
        payload: { treeCoverDelta: 25 },
      };
    }

    // 3. Overview dashboard
    if (page === 'overview') {
      return {
        id: 'copilot-overview-sentinel',
        category: 'DECISION',
        headline: 'Sentinel Anomaly Scan Available',
        body: '3 orbital sensor thresholds breached in active planetary hotspots. Would you like to run automated policy optimization?',
        actionLabel: 'Open Autopilot',
        commandType: 'NAVIGATE_VIEW',
        payload: { view: 'autopilot' },
      };
    }

    // 4. Forensics View
    if (page === 'forensics') {
      return {
        id: 'copilot-forensics-research',
        category: 'RESEARCH',
        headline: 'Search Cross-Agency Citations',
        body: 'Investigate peer-reviewed literature from NASA and Copernicus on these biophysical drivers?',
        actionLabel: 'Open Research Lab',
        commandType: 'NAVIGATE_VIEW',
        payload: { view: 'research' },
      };
    }

    // Default gentle recommendation
    return {
      id: `copilot-default-${spot.id}`,
      category: 'LAYER',
      headline: `Explore ${spot.name} Biophysical Layers`,
      body: `Switch to Land Surface Temperature or Air Quality to observe urban microclimate forcing in ${spot.name}.`,
      actionLabel: 'Inspect Layers',
      commandType: 'NAVIGATE_VIEW',
      payload: { view: 'layers' },
    };
  }
}
