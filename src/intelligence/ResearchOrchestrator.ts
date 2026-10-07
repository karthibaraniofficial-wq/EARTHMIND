/**
 * EARTHMIND - Research Orchestrator & Timeline Coordinator
 * Coordinates research progression across:
 * SEARCHING -> SOURCE_DISCOVERY -> SOURCE_VALIDATION -> EVIDENCE_ANALYSIS -> ANSWER
 * Emits live milestone events for UI synchronization.
 */

import { WebResearchAgent, WebResearchMode, WebResearchExecutionResult } from './WebResearchAgent';

export type ResearchTimelineStage = 
  | 'IDLE' 
  | 'SEARCHING' 
  | 'SOURCE_DISCOVERY' 
  | 'SOURCE_VALIDATION' 
  | 'EVIDENCE_ANALYSIS' 
  | 'ANSWER' 
  | 'ERROR';

export interface ResearchTimelineEvent {
  stage: ResearchTimelineStage;
  label: string;
  timestamp: number;
  sourcesFound?: number;
  activeDomain?: string;
}

export type TimelineListener = (event: ResearchTimelineEvent) => void;

export class ResearchOrchestrator {
  private static listeners: Set<TimelineListener> = new Set();
  private static currentStage: ResearchTimelineStage = 'IDLE';

  public static onTimelineUpdate(listener: TimelineListener): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private static notify(stage: ResearchTimelineStage, label: string, extra?: Partial<ResearchTimelineEvent>): void {
    this.currentStage = stage;
    const evt: ResearchTimelineEvent = {
      stage,
      label,
      timestamp: Date.now(),
      ...extra,
    };
    this.listeners.forEach((fn) => {
      try {
        fn(evt);
      } catch {
        // safe listener execution
      }
    });
  }

  public static getCurrentStage(): ResearchTimelineStage {
    return this.currentStage;
  }

  /**
   * Orchestrates full 5-stage research workflow.
   */
  public static async orchestrate(
    query: string,
    mode: WebResearchMode = 'QUICK_SEARCH',
    targetUrl?: string
  ): Promise<WebResearchExecutionResult> {
    try {
      // 1. SEARCHING
      this.notify('SEARCHING', `Querying Google Search Grounding for: "${query.slice(0, 35)}..."`);
      await new Promise((r) => setTimeout(r, 80));

      // 2. SOURCE DISCOVERY
      this.notify('SOURCE_DISCOVERY', 'Retrieving authoritative domains (NASA, NOAA, IPCC, ISRO, Nature)');
      await new Promise((r) => setTimeout(r, 60));

      // 3. SOURCE VALIDATION
      this.notify('SOURCE_VALIDATION', 'Computing source quality & freshness metrics (SourceQualityEngine)');
      
      const result = await WebResearchAgent.executeResearch(query, mode, targetUrl);

      // 4. EVIDENCE ANALYSIS
      this.notify('EVIDENCE_ANALYSIS', `Corroborating ${result.sources.length} sources (Consensus: ${result.synthesis.status})`, {
        sourcesFound: result.sources.length,
      });
      await new Promise((r) => setTimeout(r, 60));

      // 5. ANSWER
      this.notify('ANSWER', 'Synthesized dual-tier voice answer & evidence card', {
        sourcesFound: result.sources.length,
      });

      return result;
    } catch (err: any) {
      this.notify('ERROR', `Research failed: ${err.message || 'Network error'}`);
      throw err;
    }
  }
}
