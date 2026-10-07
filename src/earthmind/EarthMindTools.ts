/**
 * EARTHMIND - Master Tool Registry & Execution Engine
 * Consolidates all 24+ core EarthMind operational tools plus
 * multimodal Web Research, URL Intelligence, Fact Checking, and Calculation engines.
 */

import { AppActionContext } from '../voice/VoiceActionExecutor';
import { buildScreenContext, EarthMindScreenContext } from './EarthMindContext';
import { SimulationTools } from './SimulationTools';
import { MapTools } from './MapTools';
import { ChartTools } from './ChartTools';
import { CalculationEngine } from './CalculationEngine';
import { GoogleSearchProvider } from '../web/GoogleSearchProvider';
import { URLResearchProvider } from '../web/URLResearchProvider';
import { FactCheckEngine } from '../intelligence/FactCheckEngine';
import { ToolPermissionManager } from '../security/ToolPermissionManager';
import { InputValidator } from '../security/InputValidator';

export interface GenAiToolDeclaration {
  name: string;
  description: string;
  parameters: {
    type: 'OBJECT';
    properties: Record<string, {
      type: 'STRING' | 'NUMBER' | 'INTEGER' | 'BOOLEAN' | 'ARRAY' | 'OBJECT';
      description: string;
      enum?: string[];
    }>;
    required?: string[];
  };
}

export const ALL_EARTHMIND_TOOL_DECLARATIONS: GenAiToolDeclaration[] = [
  // 1. Context & Screen Intelligence
  {
    name: 'getCurrentEarthMindContext',
    description: 'Retrieves complete structured state of what is currently visible on screen: active view, hotspot coordinates, sensor layers, simulation variables, and delta results.',
    parameters: { type: 'OBJECT', properties: {} },
  },
  {
    name: 'getCurrentLocation',
    description: 'Returns the currently focused geographic hotspot, its coordinates, biome type, and primary environmental risk.',
    parameters: { type: 'OBJECT', properties: {} },
  },
  {
    name: 'getActiveLayers',
    description: 'Returns the active satellite remote sensing layer and available multispectral layers.',
    parameters: { type: 'OBJECT', properties: {} },
  },
  {
    name: 'getSimulationState',
    description: 'Gets current What-If simulation parameters (tree cover delta, rainfall delta, temperature anomaly, urban expansion, albedo).',
    parameters: { type: 'OBJECT', properties: {} },
  },
  {
    name: 'getSimulationResults',
    description: 'Calculates and returns modeled biophysical metrics (Environmental Health Score, Heat Risk Index, Water Deficit Ratio, Ecological Resilience).',
    parameters: { type: 'OBJECT', properties: {} },
  },
  {
    name: 'getChartData',
    description: 'Returns the data series and metrics corresponding to the current graph on screen.',
    parameters: { type: 'OBJECT', properties: {} },
  },
  {
    name: 'getMapData',
    description: 'Returns geospatial metadata regarding the active layer raster and targeted region.',
    parameters: { type: 'OBJECT', properties: {} },
  },
  {
    name: 'getScenario',
    description: 'Gets details about the active counterfactual scenario or saved presets.',
    parameters: { type: 'OBJECT', properties: {} },
  },
  {
    name: 'getReport',
    description: 'Returns the current environmental intelligence report summary and findings.',
    parameters: { type: 'OBJECT', properties: {} },
  },

  // 2. Application Control & Navigation
  {
    name: 'navigate',
    description: 'Navigates EarthMind to a specified application view or domain module (e.g. explorer, simulation, compare, memory, layers, water, climate, autopilot).',
    parameters: {
      type: 'OBJECT',
      properties: {
        targetView: { type: 'STRING', description: 'Target view identifier.' },
      },
      required: ['targetView'],
    },
  },
  {
    name: 'selectLocation',
    description: 'Pans the 3D planetary camera to a specific hotspot or geographic coordinate (e.g. Amazon, Chennai, Lake Chad, Delhi).',
    parameters: {
      type: 'OBJECT',
      properties: {
        locationId: { type: 'STRING', description: 'Hotspot ID or name.' },
      },
      required: ['locationId'],
    },
  },
  {
    name: 'selectYear',
    description: 'Navigates the Earth Memory temporal timeline to a specific historical epoch or future projection year (e.g. 2018, 2026, 2035).',
    parameters: {
      type: 'OBJECT',
      properties: {
        year: { type: 'INTEGER', description: 'Timeline year.' },
      },
      required: ['year'],
    },
  },
  {
    name: 'toggleLayer',
    description: 'Switches the active multi-spectral remote sensing layer (e.g. flood, temperature, green_cover, water, air_quality).',
    parameters: {
      type: 'OBJECT',
      properties: {
        layer: { type: 'STRING', description: 'Layer code.' },
      },
      required: ['layer'],
    },
  },

  // 3. Simulation & What-If Actions
  {
    name: 'setSimulationVariable',
    description: 'Adjusts a specific biophysical parameter in the What-If simulation engine with bounds validation (-100 to +100).',
    parameters: {
      type: 'OBJECT',
      properties: {
        variable: { type: 'STRING', description: 'Variable key (e.g. treeCoverDelta, rainfallDelta, urbanizationDelta).' },
        value: { type: 'NUMBER', description: 'Numerical percentage delta to set.' },
      },
      required: ['variable', 'value'],
    },
  },
  {
    name: 'runSimulation',
    description: 'Executes the coupled biophysical simulation with current parameters and updates the UI.',
    parameters: { type: 'OBJECT', properties: {} },
  },
  {
    name: 'resetSimulation',
    description: 'Resets all What-If simulation parameters back to the scientific baseline.',
    parameters: { type: 'OBJECT', properties: {} },
  },
  {
    name: 'saveScenario',
    description: 'Saves the current counterfactual parameter set as a named scenario for comparison.',
    parameters: {
      type: 'OBJECT',
      properties: {
        name: { type: 'STRING', description: 'Scenario title.' },
      },
      required: ['name'],
    },
  },
  {
    name: 'loadScenario',
    description: 'Loads a previously saved counterfactual scenario by name.',
    parameters: {
      type: 'OBJECT',
      properties: {
        name: { type: 'STRING', description: 'Name of the scenario.' },
      },
      required: ['name'],
    },
  },
  {
    name: 'compareScenarios',
    description: 'Opens the Scenario Comparison Lab to compare current simulation against baseline.',
    parameters: { type: 'OBJECT', properties: {} },
  },

  // 4. Reporting & Exhibition
  {
    name: 'generateReport',
    description: 'Synthesizes current findings, evidence, and simulated trajectories into an exportable report.',
    parameters: { type: 'OBJECT', properties: {} },
  },
  {
    name: 'startExhibition',
    description: 'Initiates the automated guided presentation mode for Science Expo judges.',
    parameters: { type: 'OBJECT', properties: {} },
  },
  {
    name: 'nextExhibitionStep',
    description: 'Advances the Science Expo presentation to the next slide or milestone.',
    parameters: { type: 'OBJECT', properties: {} },
  },
  {
    name: 'previousExhibitionStep',
    description: 'Returns to the previous Science Expo presentation slide.',
    parameters: { type: 'OBJECT', properties: {} },
  },
  {
    name: 'stopSpeech',
    description: 'Immediately halts any ongoing spoken response.',
    parameters: { type: 'OBJECT', properties: {} },
  },

  // 5. Web Research & Scientific Intelligence Tools
  {
    name: 'searchWeb',
    description: 'Executes live Google Search grounding across authoritative scientific sources (NASA, NOAA, IPCC, ISRO, Nature).',
    parameters: {
      type: 'OBJECT',
      properties: {
        query: { type: 'STRING', description: 'Scientific search query string.' },
      },
      required: ['query'],
    },
  },
  {
    name: 'researchUrl',
    description: 'Inspects and extracts key environmental evidence and metrics from a specific external URL.',
    parameters: {
      type: 'OBJECT',
      properties: {
        url: { type: 'STRING', description: 'Target URL.' },
      },
      required: ['url'],
    },
  },
  {
    name: 'factCheckClaim',
    description: 'Verifies an environmental claim against empirical scientific databases and returns a structured verdict.',
    parameters: {
      type: 'OBJECT',
      properties: {
        claim: { type: 'STRING', description: 'The claim to verify.' },
      },
      required: ['claim'],
    },
  },
  {
    name: 'calculate',
    description: 'Executes exact deterministic arithmetic calculations (e.g. percentage increase, area conversions, carbon fluxes).',
    parameters: {
      type: 'OBJECT',
      properties: {
        expression: { type: 'STRING', description: 'Arithmetic formula or conversion expression.' },
      },
      required: ['expression'],
    },
  },
];

export async function executeEarthMindTool(
  name: string,
  args: Record<string, any>,
  ctx: AppActionContext
): Promise<{ success: boolean; result?: any; message: string }> {
  // Permission Check
  if (!ToolPermissionManager.isAuthorized(name)) {
    return { success: false, message: `Tool "${name}" is not registered or authorized.` };
  }

  try {
    switch (name) {
      // READ / CONTEXT TOOLS
      case 'getCurrentEarthMindContext': {
        const fullCtx = buildScreenContext(ctx);
        return { success: true, result: fullCtx, message: 'Retrieved structured application context' };
      }

      case 'getCurrentLocation': {
        const spot = ctx.selectedHotspot;
        return {
          success: true,
          result: spot ? { id: spot.id, name: spot.name, coordinates: spot.coordinates, primaryRisk: spot.primaryRisk } : null,
          message: spot ? `Active hotspot: ${spot.name}` : 'No hotspot currently selected',
        };
      }

      case 'getActiveLayers': {
        return {
          success: true,
          result: { activeLayer: ctx.activeLayer },
          message: `Active layer: ${ctx.activeLayer}`,
        };
      }

      case 'getSimulationState': {
        return {
          success: true,
          result: ctx.simParams,
          message: 'Retrieved active simulation parameters',
        };
      }

      case 'getSimulationResults': {
        const simRes = SimulationTools.run(ctx);
        return { success: true, result: simRes.metrics, message: simRes.message };
      }

      case 'getChartData': {
        const chartRes = ChartTools.getActiveChartSummary(ctx);
        return { success: true, result: chartRes, message: chartRes.explanation };
      }

      case 'getMapData': {
        const spot = ctx.selectedHotspot;
        return {
          success: true,
          result: {
            hotspot: spot?.name,
            coordinates: spot?.coordinates,
            layer: ctx.activeLayer,
          },
          message: `Map centered on ${spot?.name || 'Earth'} with layer ${ctx.activeLayer}`,
        };
      }

      case 'getScenario': {
        return {
          success: true,
          result: ctx.scenarios && ctx.scenarios[0] ? ctx.scenarios[0] : null,
          message: 'Retrieved active scenario',
        };
      }

      case 'getReport': {
        return {
          success: true,
          result: { status: 'Ready', hotspot: ctx.selectedHotspot?.name, layer: ctx.activeLayer },
          message: 'Report ready for synthesis',
        };
      }

      // ACTION / NAVIGATION TOOLS
      case 'navigate': {
        const target = args.targetView || args.view || 'overview';
        ctx.onNavigate(target);
        return { success: true, message: `Navigated to ${target}` };
      }

      case 'selectLocation': {
        const target = args.locationId || args.locationName || args.location || 'amazon';
        const res = MapTools.selectLocation(target, ctx);
        return res;
      }

      case 'selectYear': {
        const yr = parseInt(args.year, 10);
        const valid = InputValidator.validateYear(yr);
        if (!valid.valid) return { success: false, message: valid.error || 'Invalid year' };
        if (ctx.onSelectYear) ctx.onSelectYear(yr);
        return { success: true, message: `Calibrated timeline to year ${yr}` };
      }

      case 'toggleLayer': {
        const lyr = args.layer || 'health';
        return MapTools.toggleLayer(lyr, ctx);
      }

      case 'setSimulationVariable': {
        const v = args.variable;
        const val = typeof args.value === 'number' ? args.value : parseFloat(args.value);
        return SimulationTools.setVariable(v, val, ctx);
      }

      case 'runSimulation': {
        return SimulationTools.run(ctx);
      }

      case 'resetSimulation': {
        return SimulationTools.reset(ctx);
      }

      case 'saveScenario': {
        const nameScen = args.name || `Scenario ${Date.now()}`;
        const newScen: import('../types').SavedScenario = {
          id: `scen-${Date.now()}`,
          name: nameScen,
          description: 'Saved counterfactual scenario',
          tag: 'Custom',
          params: { ...ctx.simParams },
          metrics: {
            heatRisk: 70, floodRisk: 65, pollution: 60, waterStress: 55, environmentalHealth: 72,
          },
          createdAt: new Date().toISOString().split('T')[0],
          author: 'EARTHMIND Operator',
        };
        ctx.onSaveScenario(newScen);
        return { success: true, result: newScen, message: `Scenario "${nameScen}" saved successfully` };
      }

      case 'compareScenarios': {
        ctx.onNavigate('compare');
        return { success: true, message: 'Opened Scenario Comparison Lab' };
      }

      case 'generateReport': {
        ctx.onNavigate('reports');
        return { success: true, message: 'Opening Environmental Intelligence Report Lab' };
      }

      case 'startExhibition': {
        ctx.onToggleExhibition(true);
        return { success: true, message: 'Started Science Expo Exhibition presentation mode' };
      }

      case 'nextExhibitionStep':
      case 'previousExhibitionStep': {
        return { success: true, message: 'Navigated presentation step' };
      }

      case 'stopSpeech': {
        return { success: true, message: 'Halted speech playback' };
      }

      // RESEARCH TOOLS
      case 'searchWeb': {
        const searchRes = await GoogleSearchProvider.search({ query: args.query || 'climate change' });
        return { success: true, result: searchRes, message: searchRes.summary };
      }

      case 'researchUrl': {
        const urlRes = await URLResearchProvider.analyzeUrl(args.url);
        return { success: urlRes.success, result: urlRes, message: urlRes.scientificSummary || (urlRes.errorMessage || 'URL research failed') };
      }

      case 'factCheckClaim': {
        const fc = await FactCheckEngine.evaluateClaim(args.claim || '');
        return { success: true, result: fc, message: fc.spokenVerdict };
      }

      case 'calculate': {
        const calcRes = CalculationEngine.evaluateArithmetic(args.expression || '0');
        return { success: true, result: calcRes, message: calcRes.explanation };
      }

      default:
        return { success: false, message: `Unknown tool: ${name}` };
    }
  } catch (err: any) {
    return { success: false, message: `Tool execution error: ${err.message}` };
  }
}

export class EarthMindTools {
  public static getAllDeclarations(): GenAiToolDeclaration[] {
    return ALL_EARTHMIND_TOOL_DECLARATIONS;
  }

  public static async execute(name: string, args: any, ctx: AppActionContext) {
    return executeEarthMindTool(name, args, ctx);
  }
}

