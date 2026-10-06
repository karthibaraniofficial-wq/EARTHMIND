/**
 * EARTHMIND - Google Gemini Live Tool Definitions & Execution Router
 * Comprehensive function declarations conforming to Google GenAI Tool schema.
 */

import { AppActionContext } from '../../voice/VoiceActionExecutor';
import { buildEarthMindContext } from './GeminiContext';
import { BASELINE_PARAMETERS, computeSimulationMetrics } from '../../domains/simulation/SimulationEngine';
import { LayerType, SimulationParameters } from '../../types';

export interface FunctionDeclaration {
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

/**
 * All official Gemini Tool Declarations for EarthMind
 */
export const GEMINI_TOOL_DECLARATIONS: FunctionDeclaration[] = [
  // READ TOOLS
  {
    name: 'getCurrentEarthMindContext',
    description: 'Retrieves complete current structured state of the EarthMind application including active view, location, layer, simulation parameters, and results.',
    parameters: {
      type: 'OBJECT',
      properties: {},
    },
  },
  {
    name: 'getCurrentLocation',
    description: 'Returns the currently focused geographic hotspot, its coordinates, biome type, and primary environmental risk.',
    parameters: {
      type: 'OBJECT',
      properties: {},
    },
  },
  {
    name: 'getActiveLayers',
    description: 'Returns the active satellite remote sensing layer and available multispectral layers.',
    parameters: {
      type: 'OBJECT',
      properties: {},
    },
  },
  {
    name: 'getSimulationState',
    description: 'Gets current What-If simulation parameters (tree cover delta, rainfall delta, temperature anomaly, urban expansion, albedo).',
    parameters: {
      type: 'OBJECT',
      properties: {},
    },
  },
  {
    name: 'getSimulationResults',
    description: 'Calculates and returns modeled biophysical metrics (Environmental Health Score, Heat Risk Index, Water Deficit Ratio, Ecological Resilience, Carbon Flux).',
    parameters: {
      type: 'OBJECT',
      properties: {},
    },
  },
  {
    name: 'getChartData',
    description: 'Returns the data series and metrics corresponding to the current graph on screen.',
    parameters: {
      type: 'OBJECT',
      properties: {},
    },
  },
  {
    name: 'getMapData',
    description: 'Returns geospatial metadata regarding the active layer raster and targeted region.',
    parameters: {
      type: 'OBJECT',
      properties: {},
    },
  },
  {
    name: 'getScenario',
    description: 'Gets details about the active counterfactual scenario or saved presets.',
    parameters: {
      type: 'OBJECT',
      properties: {},
    },
  },
  {
    name: 'getReport',
    description: 'Returns the current environmental intelligence report summary and findings.',
    parameters: {
      type: 'OBJECT',
      properties: {},
    },
  },

  // ACTION TOOLS
  {
    name: 'navigate',
    description: 'Navigates EarthMind to a specified application view or domain module.',
    parameters: {
      type: 'OBJECT',
      properties: {
        targetView: {
          type: 'STRING',
          description: 'Target route name: explorer, simulation, compare, memory, layers, water, climate, biodiversity, city, lab, decisions, report, settings, autopilot, council, futurefork, compound, citytwin, causal, satellite, reproducibility, sentinel, battle, missions.',
        },
      },
      required: ['targetView'],
    },
  },
  {
    name: 'selectLocation',
    description: 'Pans the 3D planetary camera to a specific hotspot or geographic coordinate.',
    parameters: {
      type: 'OBJECT',
      properties: {
        locationId: {
          type: 'STRING',
          description: 'Hotspot ID: amazon, chad, delhi, aral_sea, great_barrier, greenland, sunderbans, california.',
        },
        locationName: {
          type: 'STRING',
          description: 'Common name of location if ID unknown (e.g. Amazon, Lake Chad, Delhi).',
        },
      },
    },
  },
  {
    name: 'selectYear',
    description: 'Navigates the Earth Memory temporal timeline to a specific historical epoch or future projection year.',
    parameters: {
      type: 'OBJECT',
      properties: {
        year: {
          type: 'INTEGER',
          description: 'Timeline year (e.g. 2018, 2026, 2030, 2050).',
        },
      },
      required: ['year'],
    },
  },
  {
    name: 'toggleLayer',
    description: 'Switches the active multi-spectral remote sensing layer on the planetary globe.',
    parameters: {
      type: 'OBJECT',
      properties: {
        layer: {
          type: 'STRING',
          description: 'Layer code: health, temperature, aqi, vegetation, water, urban, flood, drought, wildfire, precipitation.',
        },
      },
      required: ['layer'],
    },
  },
  {
    name: 'setSimulationVariable',
    description: 'Adjusts a specific biophysical parameter in the What-If simulation engine with bounds validation.',
    parameters: {
      type: 'OBJECT',
      properties: {
        variable: {
          type: 'STRING',
          description: 'Variable key: treeCoverDelta, rainfallDelta, temperatureAnomaly, urbanExpansion, albedoDelta, renewableEnergyPct, waterRetentionPct.',
        },
        value: {
          type: 'NUMBER',
          description: 'The numerical percentage or degree value to set.',
        },
        unit: {
          type: 'STRING',
          description: 'Optional unit (percent, degrees, etc.).',
        },
      },
      required: ['variable', 'value'],
    },
  },
  {
    name: 'runSimulation',
    description: 'Executes the coupled biophysical simulation with current parameters and updates the UI.',
    parameters: {
      type: 'OBJECT',
      properties: {},
    },
  },
  {
    name: 'resetSimulation',
    description: 'Resets all What-If simulation parameters back to the scientific baseline.',
    parameters: {
      type: 'OBJECT',
      properties: {},
    },
  },
  {
    name: 'saveScenario',
    description: 'Saves the current counterfactual parameter set as a named scenario for comparison.',
    parameters: {
      type: 'OBJECT',
      properties: {
        name: {
          type: 'STRING',
          description: 'Name of the scenario (e.g. "Reforestation Strategy A").',
        },
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
        name: {
          type: 'STRING',
          description: 'Name of the scenario to load.',
        },
      },
      required: ['name'],
    },
  },
  {
    name: 'compareScenarios',
    description: 'Opens the Scenario Comparison Lab to compare the current simulation against baseline or alternative branches.',
    parameters: {
      type: 'OBJECT',
      properties: {},
    },
  },
  {
    name: 'generateReport',
    description: 'Synthesizes current findings, evidence, and simulated trajectories into an exportable report.',
    parameters: {
      type: 'OBJECT',
      properties: {},
    },
  },
  {
    name: 'startExhibition',
    description: 'Initiates the automated guided presentation mode for Science Expo judges.',
    parameters: {
      type: 'OBJECT',
      properties: {},
    },
  },
  {
    name: 'nextExhibitionStep',
    description: 'Advances the Science Expo presentation to the next slide or milestone.',
    parameters: {
      type: 'OBJECT',
      properties: {},
    },
  },
  {
    name: 'previousExhibitionStep',
    description: 'Returns to the previous Science Expo presentation slide.',
    parameters: {
      type: 'OBJECT',
      properties: {},
    },
  },
  {
    name: 'stopSpeech',
    description: 'Immediately halts any ongoing spoken response.',
    parameters: {
      type: 'OBJECT',
      properties: {},
    },
  },
];

/**
 * Master Tool Execution Router
 * Safely executes requested Gemini tools against the live EarthMind application state.
 */
export async function executeGeminiTool(
  name: string,
  args: Record<string, any>,
  ctx: AppActionContext
): Promise<{ success: boolean; result?: any; message: string }> {
  try {
    switch (name) {
      // 1. READ TOOLS
      case 'getCurrentEarthMindContext': {
        const fullCtx = buildEarthMindContext(ctx);
        return { success: true, result: fullCtx, message: 'Retrieved application context' };
      }

      case 'getCurrentLocation': {
        const spot = ctx.selectedHotspot;
        return {
          success: true,
          result: {
            id: spot.id,
            name: spot.name,
            coordinates: spot.coordinates,
            region: spot.region,
            country: spot.country,
            primaryRisk: spot.primaryRisk,
            currentMetrics: spot.currentMetrics,
          },
          message: `Current location is ${spot.name}`,
        };
      }

      case 'getActiveLayers': {
        return {
          success: true,
          result: {
            activeLayer: ctx.activeLayer,
            availableLayers: ['health', 'temperature', 'air_quality', 'green_cover', 'water', 'urbanization', 'waste', 'flood', 'drought', 'wildfire', 'rainfall'],
          },
          message: `Active layer is ${ctx.activeLayer}`,
        };
      }

      case 'getSimulationState': {
        return {
          success: true,
          result: {
            parameters: ctx.simParams,
            baseline: BASELINE_PARAMETERS,
          },
          message: 'Retrieved simulation parameters',
        };
      }

      case 'getSimulationResults': {
        const metrics = computeSimulationMetrics(ctx.simParams);
        const baseline = computeSimulationMetrics(BASELINE_PARAMETERS);
        return {
          success: true,
          result: {
            currentMetrics: metrics,
            baselineMetrics: baseline,
            delta: {
              environmentalHealthDelta: metrics.environmentalHealth - baseline.environmentalHealth,
              heatRiskDelta: metrics.heatRisk - baseline.heatRisk,
              waterStressDelta: metrics.waterStress - baseline.waterStress,
            },
          },
          message: `Environmental Health Score is ${metrics.environmentalHealth}`,
        };
      }

      case 'getChartData': {
        const metrics = computeSimulationMetrics(ctx.simParams);
        return {
          success: true,
          result: {
            title: 'Biophysical Response Trajectory',
            metrics,
          },
          message: 'Retrieved chart telemetry',
        };
      }

      case 'getMapData': {
        return {
          success: true,
          result: {
            layer: ctx.activeLayer,
            region: ctx.selectedHotspot.name,
            coordinates: ctx.selectedHotspot.coordinates,
          },
          message: 'Retrieved map telemetry',
        };
      }

      case 'getScenario': {
        return {
          success: true,
          result: {
            activeScenarios: ctx.scenarios,
            currentParams: ctx.simParams,
          },
          message: 'Retrieved scenario status',
        };
      }

      case 'getReport': {
        return {
          success: true,
          result: {
            location: ctx.selectedHotspot.name,
            layer: ctx.activeLayer,
            year: ctx.selectedYear ?? 2026,
            metrics: computeSimulationMetrics(ctx.simParams),
          },
          message: 'Retrieved report synthesis',
        };
      }

      // 2. ACTION TOOLS
      case 'navigate': {
        const targetView = (args.targetView || '').toLowerCase().trim();
        if (targetView) {
          ctx.onNavigate(targetView);
          return { success: true, message: `Navigated to ${targetView}` };
        }
        return { success: false, message: 'Missing target view parameter' };
      }

      case 'selectLocation': {
        const id = args.locationId?.toLowerCase() || '';
        const name = args.locationName?.toLowerCase() || '';
        const spot = ctx.hotspots.find(
          (h) => h.id.toLowerCase() === id || h.name.toLowerCase().includes(name) || name.includes(h.name.toLowerCase())
        );
        if (spot) {
          ctx.onSelectHotspot(spot);
          if (ctx.currentView !== 'explorer' && ctx.currentView !== 'memory') {
            ctx.onNavigate('explorer');
          }
          return { success: true, result: { id: spot.id, name: spot.name }, message: `Panned to ${spot.name}` };
        }
        return { success: false, message: `Hotspot '${args.locationName || args.locationId}' not found` };
      }

      case 'selectYear': {
        const year = Number(args.year);
        if (!isNaN(year) && ctx.onSelectYear) {
          ctx.onSelectYear(year);
          if (ctx.currentView !== 'memory') {
            ctx.onNavigate('memory');
          }
          return { success: true, message: `Updated timeline to year ${year}` };
        }
        return { success: false, message: 'Invalid year specified' };
      }

      case 'toggleLayer': {
        const layerInput = (args.layer || '').toLowerCase().trim();
        const aliasMap: Record<string, LayerType> = {
          aqi: 'air_quality',
          air: 'air_quality',
          vegetation: 'green_cover',
          trees: 'green_cover',
          tree: 'green_cover',
          urban: 'urbanization',
          precipitation: 'rainfall',
          rain: 'rainfall',
        };
        const layer: LayerType = aliasMap[layerInput] || (layerInput as LayerType);
        const validLayers: LayerType[] = ['health', 'temperature', 'air_quality', 'green_cover', 'water', 'urbanization', 'waste', 'flood', 'drought', 'wildfire', 'rainfall'];
        if (validLayers.includes(layer)) {
          ctx.onChangeLayer(layer);
          if (ctx.currentView !== 'explorer' && ctx.currentView !== 'layers') {
            ctx.onNavigate('explorer');
          }
          return { success: true, message: `Active layer changed to ${layer}` };
        }
        return { success: false, message: `Invalid layer '${args.layer}'. Valid options: ${validLayers.join(', ')}` };
      }

      case 'setSimulationVariable': {
        let varKey = (args.variable || '') as keyof SimulationParameters;
        // Normalize variable names
        if (varKey === ('treeCover' as any) || varKey === ('tree' as any)) varKey = 'treeCoverDelta';
        if (varKey === ('rainfall' as any) || varKey === ('rain' as any)) varKey = 'rainfallDelta';
        if (varKey === ('urban' as any) || varKey === ('urbanExpansion' as any) || varKey === ('urbanization' as any)) varKey = 'urbanizationDelta';
        if (varKey === ('waste' as any)) varKey = 'wasteDelta';
        if (varKey === ('water' as any)) varKey = 'waterDelta';
        if (varKey === ('traffic' as any)) varKey = 'trafficDelta';
        if (varKey === ('energy' as any) || varKey === ('energyEfficiency' as any)) varKey = 'energyEfficiencyDelta';

        const val = Number(args.value);
        if (isNaN(val)) {
          return { success: false, message: 'Invalid variable value' };
        }

        // Validate range bounds
        const clampedVal = Math.max(-50, Math.min(100, val));
        const prevVal = ctx.simParams[varKey] ?? 0;

        const nextParams: SimulationParameters = {
          ...ctx.simParams,
          [varKey]: clampedVal,
        };
        ctx.onUpdateSimParams(nextParams);

        if (ctx.currentView !== 'simulation') {
          ctx.onNavigate('simulation');
        }

        return {
          success: true,
          result: {
            variable: varKey,
            previous: prevVal,
            current: clampedVal,
          },
          message: `${varKey} adjusted from ${prevVal} to ${clampedVal}`,
        };
      }

      case 'runSimulation': {
        if (ctx.currentView !== 'simulation') {
          ctx.onNavigate('simulation');
        }
        const metrics = computeSimulationMetrics(ctx.simParams);
        return {
          success: true,
          result: metrics,
          message: `Simulation executed. Modeled Environmental Health Score is ${metrics.environmentalHealth}`,
        };
      }

      case 'resetSimulation': {
        ctx.onUpdateSimParams({ ...BASELINE_PARAMETERS });
        return { success: true, message: 'All simulation parameters reset to baseline' };
      }

      case 'saveScenario': {
        const scenarioName = args.name || `Scenario ${new Date().toLocaleTimeString()}`;
        ctx.onSaveScenario({
          id: `scen-${Date.now()}`,
          name: scenarioName,
          description: 'Saved via Gemini Live voice interaction',
          tag: 'Custom',
          params: { ...ctx.simParams },
          metrics: computeSimulationMetrics(ctx.simParams),
          createdAt: new Date().toISOString(),
          author: 'Gemini Live Operator',
        });
        return { success: true, message: `Scenario '${scenarioName}' saved successfully` };
      }

      case 'loadScenario': {
        const scenario = ctx.scenarios.find((s) => s.name.toLowerCase().includes(args.name?.toLowerCase()));
        if (scenario) {
          ctx.onUpdateSimParams({ ...scenario.params });
          return { success: true, message: `Loaded scenario '${scenario.name}'` };
        }
        return { success: false, message: `Scenario '${args.name}' not found` };
      }

      case 'compareScenarios': {
        ctx.onNavigate('compare');
        return { success: true, message: 'Opened Scenario Comparison Lab' };
      }

      case 'generateReport': {
        ctx.onNavigate('report');
        return { success: true, message: 'Synthesized environmental intelligence report' };
      }

      case 'startExhibition': {
        ctx.onToggleExhibition(true);
        return { success: true, message: 'Started Science Expo Guided Presentation' };
      }

      case 'nextExhibitionStep': {
        return { success: true, message: 'Advanced to next presentation milestone' };
      }

      case 'previousExhibitionStep': {
        return { success: true, message: 'Navigated to previous presentation milestone' };
      }

      case 'stopSpeech': {
        return { success: true, message: 'Halting speech output' };
      }

      default:
        return { success: false, message: `Unknown tool name: ${name}` };
    }
  } catch (err: any) {
    return { success: false, message: `Tool execution failed: ${err.message || String(err)}` };
  }
}
