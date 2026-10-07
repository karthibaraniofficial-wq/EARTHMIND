/**
 * EARTHMIND - Planetary Event Bus (OS 4.0)
 * Decouples subsystems and synchronizes UI, 3D Earth, Voice, AI, and Simulation.
 */

export type EarthMindEventType =
  | 'LOCATION_CHANGED'
  | 'YEAR_CHANGED'
  | 'LAYER_CHANGED'
  | 'SIMULATION_STARTED'
  | 'SIMULATION_COMPLETED'
  | 'SCENARIO_CHANGED'
  | 'RESEARCH_STARTED'
  | 'RESEARCH_COMPLETED'
  | 'VOICE_STARTED'
  | 'VOICE_STOPPED'
  | 'ALERT_CREATED'
  | 'REPORT_GENERATED'
  | 'DENSITY_MODE_CHANGED'
  | 'FORENSICS_UPDATED';

export interface EarthMindEvent<T = any> {
  type: EarthMindEventType;
  payload: T;
  timestamp: string;
  source: 'UI' | 'VOICE' | 'AI' | 'SIMULATION' | 'RESEARCH' | 'SYSTEM';
  correlationId?: string;
}

export type EarthMindEventListener<T = any> = (event: EarthMindEvent<T>) => void;

class EventBus {
  private listeners: Map<EarthMindEventType, Set<EarthMindEventListener>> = new Map();
  private history: EarthMindEvent[] = [];
  private readonly maxHistory = 100;

  /**
   * Subscribe to a specific EarthMind event type.
   * Returns an unsubscribe function.
   */
  public on<T = any>(type: EarthMindEventType, listener: EarthMindEventListener<T>): () => void {
    if (!this.listeners.has(type)) {
      this.listeners.set(type, new Set());
    }
    const set = this.listeners.get(type)!;
    set.add(listener as EarthMindEventListener);

    return () => {
      set.delete(listener as EarthMindEventListener);
    };
  }

  /**
   * Emit an event across the entire planetary OS.
   */
  public emit<T = any>(
    type: EarthMindEventType,
    payload: T,
    source: EarthMindEvent['source'] = 'SYSTEM',
    correlationId?: string
  ): void {
    const event: EarthMindEvent<T> = {
      type,
      payload,
      timestamp: new Date().toISOString(),
      source,
      correlationId: correlationId || `evt-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    };

    // Store in circular history buffer for audit / replay
    this.history.unshift(event);
    if (this.history.length > this.maxHistory) {
      this.history.pop();
    }

    const set = this.listeners.get(type);
    if (set) {
      set.forEach((listener) => {
        try {
          listener(event);
        } catch (err) {
          console.error(`[EarthMindEventBus] Error in listener for ${type}:`, err);
        }
      });
    }
  }

  /**
   * Inspect recent event log for observability and forensics.
   */
  public getRecentEvents(): readonly EarthMindEvent[] {
    return this.history;
  }

  public clearHistory(): void {
    this.history = [];
  }
}

export const EarthMindEventBus = new EventBus();
