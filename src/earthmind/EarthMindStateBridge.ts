/**
 * EARTHMIND - Single Source of Truth State Bridge
 * Connects Voice, Mouse, Keyboard, Command Palette, AI Assistant, Web Research,
 * and Simulation Controls to the identical authoritative application state.
 */

import { AppActionContext } from '../voice/VoiceActionExecutor';
import { EnvironmentalHotspot, LayerType, SavedScenario, SimulationParameters } from '../types';

export class EarthMindStateBridge {
  private static context: AppActionContext | null = null;
  private static subscribers: Set<() => void> = new Set();

  public static bindContext(ctx: AppActionContext): void {
    this.context = ctx;
    this.notifySubscribers();
  }

  public static getContext(): AppActionContext | null {
    return this.context;
  }

  public static subscribe(fn: () => void): () => void {
    this.subscribers.add(fn);
    return () => this.subscribers.delete(fn);
  }

  private static notifySubscribers(): void {
    this.subscribers.forEach((fn) => {
      try {
        fn();
      } catch {
        // safe execution
      }
    });
  }

  // --- Authoritative State Mutators ---

  public static navigateTo(view: string): boolean {
    if (!this.context) return false;
    this.context.onNavigate(view);
    return true;
  }

  public static selectHotspot(hotspotIdOrName: string): EnvironmentalHotspot | null {
    if (!this.context) return null;
    const clean = hotspotIdOrName.toLowerCase().replace(/[\s_\-]+/g, '');
    
    const spot = this.context.hotspots.find(
      (h) => h.id.replace(/[\s_\-]+/g, '').includes(clean) || 
             h.name.toLowerCase().replace(/[\s_\-]+/g, '').includes(clean)
    );

    if (spot) {
      this.context.onSelectHotspot(spot);
      return spot;
    }
    return null;
  }

  public static setLayer(layer: LayerType): boolean {
    if (!this.context) return false;
    this.context.onChangeLayer(layer);
    return true;
  }

  public static setYear(year: number): boolean {
    if (!this.context || !this.context.onSelectYear) return false;
    this.context.onSelectYear(year);
    return true;
  }

  public static updateSimulationParameters(patch: Partial<SimulationParameters>): SimulationParameters | null {
    if (!this.context) return null;
    const updated = {
      ...this.context.simParams,
      ...patch,
    };
    this.context.onUpdateSimParams(updated);
    return updated;
  }

  public static saveScenario(name: string, tag: SavedScenario['tag'] = 'Custom'): SavedScenario | null {
    if (!this.context) return null;
    const newScen: SavedScenario = {
      id: `scen-${Date.now()}`,
      name,
      description: `Saved counterfactual scenario created via EarthMind multimodal interface.`,
      tag,
      params: { ...this.context.simParams },
      metrics: {
        heatRisk: 70,
        floodRisk: 65,
        pollution: 60,
        waterStress: 55,
        environmentalHealth: 72,
      },
      createdAt: new Date().toISOString().split('T')[0],
      author: 'EARTHMIND Operator',
    };
    this.context.onSaveScenario(newScen);
    return newScen;
  }

  public static toggleExhibitionMode(active?: boolean): boolean {
    if (!this.context) return false;
    const val = active !== undefined ? active : !this.context.isExhibitionMode;
    this.context.onToggleExhibition(val);
    return val;
  }
}
