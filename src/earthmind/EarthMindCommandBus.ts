/**
 * EARTHMIND - Unified Planetary Command Bus (OS 4.0)
 * Canonical entry point for all operations whether initiated via Voice, Mouse,
 * Keyboard shortcut, Command Palette (Ctrl+K), AI Council, or Autopilot.
 */

import { EarthMindStateBridge } from './EarthMindStateBridge';
import { EarthMindEventBus } from './EarthMindEventBus';
import { LayerType, SimulationParameters, SavedScenario, EnvironmentalHotspot } from '../types';

export type CommandSource = 'VOICE' | 'UI' | 'COMMAND_PALETTE' | 'AI' | 'AUTOPILOT' | 'SHORTCUT';

export interface CommandResult<T = any> {
  success: boolean;
  command: string;
  source: CommandSource;
  data?: T;
  error?: string;
  timestamp: string;
}

export class EarthMindCommandBus {
  /**
   * Navigate to a designated application view.
   */
  public static navigateView(view: string, source: CommandSource = 'UI'): CommandResult {
    const success = EarthMindStateBridge.navigateTo(view);
    if (success) {
      EarthMindEventBus.emit('LOCATION_CHANGED', { view }, source === 'VOICE' ? 'VOICE' : 'UI');
    }
    return {
      success,
      command: 'NAVIGATE_VIEW',
      source,
      data: { view },
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * Focus on an environmental hotspot by ID or name.
   */
  public static selectLocation(locationIdOrName: string, source: CommandSource = 'UI'): CommandResult<EnvironmentalHotspot | null> {
    const spot = EarthMindStateBridge.selectHotspot(locationIdOrName);
    const success = spot !== null;
    if (success) {
      EarthMindEventBus.emit('LOCATION_CHANGED', { hotspot: spot }, source === 'VOICE' ? 'VOICE' : 'UI');
    }
    return {
      success,
      command: 'SELECT_LOCATION',
      source,
      data: spot,
      error: success ? undefined : `Location '${locationIdOrName}' not found in registry.`,
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * Set the active satellite telemetry or environmental layer.
   */
  public static showLayer(layer: LayerType, source: CommandSource = 'UI'): CommandResult {
    const success = EarthMindStateBridge.setLayer(layer);
    if (success) {
      EarthMindEventBus.emit('LAYER_CHANGED', { layer }, source === 'VOICE' ? 'VOICE' : 'UI');
    }
    return {
      success,
      command: 'SHOW_LAYER',
      source,
      data: { layer },
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * Jump to a specific multi-decadal observation year (1990-2050).
   */
  public static setYear(year: number, source: CommandSource = 'UI'): CommandResult {
    const clampedYear = Math.max(1990, Math.min(2050, Math.round(year)));
    const success = EarthMindStateBridge.setYear(clampedYear);
    if (success) {
      EarthMindEventBus.emit('YEAR_CHANGED', { year: clampedYear }, source === 'VOICE' ? 'VOICE' : 'UI');
    }
    return {
      success,
      command: 'SET_YEAR',
      source,
      data: { year: clampedYear },
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * Apply biophysical simulation parameters to the counterfactual engine.
   */
  public static setSimulationParameters(
    patch: Partial<SimulationParameters>,
    source: CommandSource = 'UI'
  ): CommandResult<SimulationParameters | null> {
    const updated = EarthMindStateBridge.updateSimulationParameters(patch);
    const success = updated !== null;
    if (success) {
      EarthMindEventBus.emit('SIMULATION_STARTED', { patch, updated }, source === 'VOICE' ? 'VOICE' : 'SIMULATION');
    }
    return {
      success,
      command: 'SET_SIMULATION_PARAMETERS',
      source,
      data: updated,
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * Run and reconverge coupled planetary simulation.
   */
  public static runSimulation(source: CommandSource = 'UI'): CommandResult {
    const ctx = EarthMindStateBridge.getContext();
    if (!ctx) {
      return {
        success: false,
        command: 'RUN_SIMULATION',
        source,
        error: 'No active context attached to State Bridge.',
        timestamp: new Date().toISOString(),
      };
    }

    EarthMindStateBridge.navigateTo('simulator');
    EarthMindEventBus.emit('SIMULATION_COMPLETED', { params: ctx.simParams }, source === 'VOICE' ? 'VOICE' : 'SIMULATION');

    return {
      success: true,
      command: 'RUN_SIMULATION',
      source,
      data: { params: ctx.simParams },
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * Compare two observation years and navigate to temporal memory.
   */
  public static compareYears(yearA: number, yearB: number, source: CommandSource = 'UI'): CommandResult {
    EarthMindStateBridge.navigateTo('memory');
    EarthMindStateBridge.setYear(yearB);
    EarthMindEventBus.emit('YEAR_CHANGED', { yearA, yearB, mode: 'compare' }, source === 'VOICE' ? 'VOICE' : 'UI');

    return {
      success: true,
      command: 'COMPARE_YEARS',
      source,
      data: { yearA, yearB },
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * Save the active scenario state into the persistent catalog.
   */
  public static saveScenario(name: string, tag: SavedScenario['tag'] = 'Custom', source: CommandSource = 'UI'): CommandResult<SavedScenario | null> {
    const scenario = EarthMindStateBridge.saveScenario(name, tag);
    const success = scenario !== null;
    if (success) {
      EarthMindEventBus.emit('SCENARIO_CHANGED', { scenario }, source === 'VOICE' ? 'VOICE' : 'UI');
    }
    return {
      success,
      command: 'SAVE_SCENARIO',
      source,
      data: scenario,
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * Toggle exhibition presentation mode.
   */
  public static toggleExhibition(active?: boolean, source: CommandSource = 'UI'): CommandResult {
    const success = EarthMindStateBridge.toggleExhibitionMode(active);
    return {
      success: true,
      command: 'TOGGLE_EXHIBITION',
      source,
      data: { active: success },
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * Set user interface information density mode (Focus, Data, Expert).
   */
  public static setDensityMode(mode: 'focus' | 'data' | 'expert', source: CommandSource = 'UI'): CommandResult {
    EarthMindEventBus.emit('DENSITY_MODE_CHANGED', { mode }, source === 'VOICE' ? 'VOICE' : 'UI');
    return {
      success: true,
      command: 'SET_DENSITY_MODE',
      source,
      data: { mode },
      timestamp: new Date().toISOString(),
    };
  }
}
