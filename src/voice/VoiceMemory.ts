/**
 * EARTHMIND - Voice Session Memory & Conversational Context
 * Tracks session state across multi-turn interactions:
 * topic, location, timeline year, scenario parameters, explanation level, and recent research sources.
 */

import { WebSource } from '../web/WebSourceParser';
import { ExplanationLevel } from '../intelligence/ScientificReasoningEngine';

export interface ConversationalSessionMemory {
  currentTopic?: string;
  currentLocationId?: string;
  currentLocationName?: string;
  currentYear?: number;
  currentLayer?: string;
  currentScenarioName?: string;
  explanationLevel: ExplanationLevel;
  recentToolActions: { tool: string; timestamp: number; resultSummary: string }[];
  recentSources: WebSource[];
  activeAnalysisSummary?: string;
  lastUserQuery?: string;
  lastSpokenResponse?: string;
}

export class VoiceMemory {
  private static memory: ConversationalSessionMemory = {
    explanationLevel: 3,
    recentToolActions: [],
    recentSources: [],
  };

  public static get(): ConversationalSessionMemory {
    return this.memory;
  }

  public static update(patch: Partial<ConversationalSessionMemory>): void {
    this.memory = {
      ...this.memory,
      ...patch,
    };
  }

  public static recordToolAction(tool: string, resultSummary: string): void {
    this.memory.recentToolActions = [
      { tool, timestamp: Date.now(), resultSummary },
      ...this.memory.recentToolActions.slice(0, 9),
    ];
  }

  public static setExplanationLevel(level: ExplanationLevel): void {
    this.memory.explanationLevel = Math.max(1, Math.min(5, level)) as ExplanationLevel;
  }

  public static setRecentSources(sources: WebSource[]): void {
    this.memory.recentSources = sources.slice(0, 8);
  }

  /**
   * Resolves elliptical follow-up questions using session memory.
   * e.g. "What about 2035?" when previously discussing Chennai flood risk.
   */
  public static resolveFollowUp(query: string): { resolvedIntent: string; resolvedLocation?: string; resolvedYear?: number } {
    const q = query.toLowerCase();

    // Check year reference
    const yearMatch = q.match(/\b(20\d\d)\b/);
    if (yearMatch) {
      const year = parseInt(yearMatch[1], 10);
      this.memory.currentYear = year;
      return {
        resolvedIntent: `Assess ${this.memory.currentLayer || 'environmental risk'} in ${this.memory.currentLocationName || 'selected region'} for year ${year}`,
        resolvedLocation: this.memory.currentLocationId,
        resolvedYear: year,
      };
    }

    // Check "run it" or "why did it change"
    if (q === 'run it' || q === 'run simulation') {
      return {
        resolvedIntent: `Execute coupled biophysical simulation for ${this.memory.currentLocationName || 'active hotspot'}`,
        resolvedLocation: this.memory.currentLocationId,
      };
    }

    if (q.startsWith('why') || q.includes('why did it increase') || q.includes('why did it change')) {
      return {
        resolvedIntent: `Explain biophysical drivers for change in ${this.memory.currentTopic || 'simulation metrics'}`,
        resolvedLocation: this.memory.currentLocationId,
      };
    }

    return {
      resolvedIntent: query,
      resolvedLocation: this.memory.currentLocationId,
      resolvedYear: this.memory.currentYear,
    };
  }

  public static reset(): void {
    this.memory = {
      explanationLevel: 3,
      recentToolActions: [],
      recentSources: [],
    };
  }
}
