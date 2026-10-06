import { EnvironmentalHotspot, LayerType, SavedScenario, SimulationParameters } from '../types';
import { ParsedVoiceCommand } from './VoiceTypes';
import { BASELINE_PARAMETERS } from '../domains/simulation/SimulationEngine';

export interface AppActionContext {
  currentView: string;
  onNavigate: (view: string) => void;
  hotspots: EnvironmentalHotspot[];
  selectedHotspot: EnvironmentalHotspot;
  onSelectHotspot: (spot: EnvironmentalHotspot) => void;
  activeLayer: LayerType;
  onChangeLayer: (layer: LayerType) => void;
  simParams: SimulationParameters;
  onUpdateSimParams: (params: SimulationParameters) => void;
  scenarios: SavedScenario[];
  onSaveScenario: (scenario: SavedScenario) => void;
  isExhibitionMode: boolean;
  onToggleExhibition: (open: boolean) => void;
  isDemoActive: boolean;
  onToggleDemo: (active: boolean) => void;
  isAiOpen: boolean;
  onToggleAi: (open: boolean) => void;
  selectedYear?: number;
  onSelectYear?: (year: number) => void;
  updateTwinConfig?: (patch: Record<string, any>) => void;
}

export function executeVoiceAction(command: ParsedVoiceCommand, ctx: AppActionContext): { success: boolean; message: string } {
  // Handle compound subcommands recursively
  if (command.subCommands && command.subCommands.length > 0) {
    const results = command.subCommands.map((sub) => executeVoiceAction(sub, ctx));
    const allSuccess = results.every((r) => r.success);
    return {
      success: allSuccess,
      message: results.map((r) => r.message).join(' • '),
    };
  }

  switch (command.intent) {
    case 'NAVIGATE': {
      if (command.params.targetView) {
        ctx.onNavigate(command.params.targetView);
        return { success: true, message: `Navigated to ${command.params.targetView}` };
      }
      return { success: false, message: 'Missing target view' };
    }

    case 'SELECT_LOCATION': {
      const spot = ctx.hotspots.find(
        (h) => h.id === command.params.locationId || h.name.toLowerCase() === command.params.locationName?.toLowerCase()
      );
      if (spot) {
        ctx.onSelectHotspot(spot);
        // Switch to explorer view so user sees 3D camera pan
        if (ctx.currentView !== 'explorer' && ctx.currentView !== 'memory') {
          ctx.onNavigate('explorer');
        }
        return { success: true, message: `Targeted hotspot: ${spot.name}` };
      }
      return { success: false, message: `Hotspot not found: ${command.params.locationId}` };
    }

    case 'SELECT_LAYER': {
      if (command.params.layer) {
        ctx.onChangeLayer(command.params.layer);
        if (ctx.currentView !== 'explorer' && ctx.currentView !== 'layers' && ctx.currentView !== 'memory') {
          ctx.onNavigate('explorer');
        }
        return { success: true, message: `Layer changed to ${command.params.layer}` };
      }
      return { success: false, message: 'Missing layer parameter' };
    }

    case 'HIDE_LAYERS': {
      // Set to basic health overlay as default clean layer
      ctx.onChangeLayer('health');
      return { success: true, message: 'Reset overlay to default health baseline' };
    }

    case 'SELECT_YEAR': {
      if (command.params.year && ctx.onSelectYear) {
        ctx.onSelectYear(command.params.year);
        if (ctx.currentView !== 'memory') {
          ctx.onNavigate('memory');
        }
        return { success: true, message: `Year updated to ${command.params.year}` };
      }
      if (ctx.currentView !== 'memory') {
        ctx.onNavigate('memory');
      }
      return { success: true, message: 'Opened Earth Memory timeline' };
    }

    case 'SET_SIMULATION_VARIABLE': {
      const varKey = (command.params.variableKey || (command.params.variable && `${command.params.variable}Delta`) || command.params.variable) as keyof SimulationParameters;
      const delta = command.params.delta ?? 0;
      if (varKey) {
        const nextParams = {
          ...ctx.simParams,
          [varKey]: delta,
        };
        ctx.onUpdateSimParams(nextParams);
        if (ctx.currentView !== 'simulator') {
          ctx.onNavigate('simulator');
        }
        return { success: true, message: `Updated ${varKey} to ${delta}%` };
      }
      return { success: false, message: 'Missing simulation variable' };
    }

    case 'RUN_SIMULATION': {
      if (ctx.currentView !== 'simulator') {
        ctx.onNavigate('simulator');
      }
      return { success: true, message: 'Simulation executed with active parameters' };
    }

    case 'RESET_SIMULATION': {
      ctx.onUpdateSimParams(BASELINE_PARAMETERS);
      if (ctx.currentView !== 'simulator') {
        ctx.onNavigate('simulator');
      }
      return { success: true, message: 'Simulation parameters reset to baseline (0%)' };
    }

    case 'SAVE_SCENARIO': {
      const name = command.params.scenarioName || 'Custom Policy';
      const newScenario: SavedScenario = {
        id: `voice-scenario-${Date.now()}`,
        name,
        description: `Voice-synthesized policy variant for ${ctx.selectedHotspot.name}`,
        tag: 'Custom',
        params: { ...ctx.simParams },
        metrics: {
          heatRisk: Math.max(10, Math.min(95, ctx.selectedHotspot.currentMetrics.heatRisk - Math.round(ctx.simParams.treeCoverDelta * 0.4))),
          floodRisk: Math.max(10, Math.min(95, ctx.selectedHotspot.currentMetrics.floodRisk - Math.round(ctx.simParams.waterDelta * 0.3))),
          pollution: Math.round(ctx.selectedHotspot.currentMetrics.pollutionAqi / 3.6),
          waterStress: ctx.selectedHotspot.currentMetrics.waterStress,
          environmentalHealth: Math.min(98, Math.max(20, ctx.selectedHotspot.currentMetrics.environmentalHealth + Math.round(ctx.simParams.treeCoverDelta * 0.5))),
        },
        createdAt: new Date().toISOString().split('T')[0],
        author: 'Voice Intelligence Session',
      };
      ctx.onSaveScenario(newScenario);
      return { success: true, message: `Saved scenario "${name}"` };
    }

    case 'COMPARE_SCENARIOS': {
      ctx.onNavigate('scenarios');
      return { success: true, message: 'Navigated to scenario comparison matrix' };
    }

    case 'OPEN_EXHIBITION': {
      ctx.onToggleExhibition(true);
      return { success: true, message: 'Opened Science Expo presentation overlay' };
    }

    case 'CLOSE_EXHIBITION': {
      ctx.onToggleExhibition(false);
      return { success: true, message: 'Closed Science Expo exhibition view' };
    }

    case 'START_DEMO': {
      ctx.onToggleDemo(true);
      if (ctx.currentView !== 'explorer') {
        ctx.onNavigate('explorer');
      }
      return { success: true, message: 'Started guided demo sequence' };
    }

    case 'STOP_DEMO': {
      ctx.onToggleDemo(false);
      return { success: true, message: 'Stopped guided demo sequence' };
    }

    case 'ROTATE_EARTH': {
      if (ctx.updateTwinConfig) {
        ctx.updateTwinConfig({ earthAutoRotate: true });
      }
      return { success: true, message: 'Earth auto-rotation started' };
    }

    case 'STOP_ROTATE_EARTH': {
      if (ctx.updateTwinConfig) {
        ctx.updateTwinConfig({ earthAutoRotate: false });
      }
      return { success: true, message: 'Earth rotation paused' };
    }

    case 'TOGGLE_ATMOSPHERE': {
      if (ctx.updateTwinConfig) {
        ctx.updateTwinConfig({ showAtmosphere: command.params.enable ?? true });
      }
      return { success: true, message: `Atmosphere set to ${command.params.enable ?? true}` };
    }

    case 'TOGGLE_CLOUDS': {
      if (ctx.updateTwinConfig) {
        ctx.updateTwinConfig({ showClouds: command.params.enable ?? true });
      }
      return { success: true, message: `Clouds set to ${command.params.enable ?? true}` };
    }

    case 'TOGGLE_NIGHT_LIGHTS': {
      if (ctx.updateTwinConfig) {
        ctx.updateTwinConfig({ showNightLights: command.params.enable ?? true });
      }
      return { success: true, message: `Night lights set to ${command.params.enable ?? true}` };
    }

    case 'GENERATE_REPORT': {
      ctx.onNavigate('reports');
      return { success: true, message: 'Opened reports generator' };
    }

    case 'EXPORT_REPORT': {
      ctx.onNavigate('reports');
      return { success: true, message: 'Triggered report export' };
    }

    case 'OPEN_SETTINGS': {
      ctx.onNavigate('settings');
      return { success: true, message: 'Opened Twin OS settings console' };
    }

    case 'ASK_AI': {
      ctx.onToggleAi(true);
      return { success: true, message: 'Opened EarthMind AI assistant' };
    }

    default:
      return { success: true, message: 'Command processed' };
  }
}
