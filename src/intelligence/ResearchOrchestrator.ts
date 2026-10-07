/**
 * EARTHMIND - Research Orchestrator & Timeline Coordinator
 * Coordinates research progression across:
 * SEARCHING -> SOURCE_DISCOVERY -> SOURCE_VALIDATION -> EVIDENCE_ANALYSIS -> ANSWER
 * Emits live milestone events for UI synchronization.
 */

import { WebResearchAgent, WebResearchMode, WebResearchExecutionResult } from './WebResearchAgent';

export type ResearchTimelineStage = 
  | 'IDLE' 
  | 'UNDERSTANDING'
  | 'SEARCHING' 
  | 'VALIDATING'
  | 'ANALYZING'
  | 'COMPOSING'
  | 'SPEAKING'
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

  public static notify(stage: ResearchTimelineStage, label: string, extra?: Partial<ResearchTimelineEvent>): void {
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
   * Orchestrates full 7-stage research workflow.
   */
  public static async orchestrate(
    query: string,
    mode: WebResearchMode = 'QUICK_SEARCH',
    targetUrl?: string
  ): Promise<WebResearchExecutionResult> {
    try {
      // 1. UNDERSTANDING
      this.notify('UNDERSTANDING', `Understanding scientific query: "${query.slice(0, 35)}..."`);
      await new Promise((r) => setTimeout(r, 60));

      // 2. SEARCHING
      this.notify('SEARCHING', `Querying Google Search Grounding across authoritative sources`);
      await new Promise((r) => setTimeout(r, 80));

      // 3. VALIDATING
      this.notify('VALIDATING', 'Validating agency credentials & freshness (NASA, NOAA, IPCC, ISRO, Nature)');
      
      const result = await WebResearchAgent.executeResearch(query, mode, targetUrl);

      // 4. ANALYZING
      this.notify('ANALYZING', `Cross-analyzing ${result.sources.length} sources (Consensus: ${result.synthesis.status})`, {
        sourcesFound: result.sources.length,
      });
      await new Promise((r) => setTimeout(r, 60));

      // 5. COMPOSING
      this.notify('COMPOSING', 'Composing dual-tier spoken response & structured evidence cards', {
        sourcesFound: result.sources.length,
      });
      await new Promise((r) => setTimeout(r, 40));

      // 6. SPEAKING
      this.notify('SPEAKING', 'Delivering concise conversational brief', {
        sourcesFound: result.sources.length,
      });

      return result;
    } catch (err: any) {
      this.notify('ERROR', `Research failed: ${err.message || 'Network error'}`);
      throw err;
    }
  }
}
