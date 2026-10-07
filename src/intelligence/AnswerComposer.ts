/**
 * EARTHMIND - Answer Composer & Dual-Tier Response Synthesizer
 * Formulates concise voice responses (1-3 sentences) paired with rich, structured visual cards.
 * Strictly separates EARTHMIND ANALYSIS from EXTERNAL EVIDENCE.
 */

import { WebSource } from '../web/WebSourceParser';
import { FormattedCitation, CitationManager } from '../web/CitationManager';
import { UncertaintyProfile, ScientificProvenance } from './UncertaintyEngine';

export interface ScreenPayload {
  title: string;
  earthMindAnalysis: string;
  earthmindAnalysis: {
    heading: string;
    metrics: { label: string; value: string | number; delta?: string }[];
    summary: string;
    modeledDrivers?: string[];
  };
  externalEvidence?: any;
  uncertainty?: UncertaintyProfile;
  visualHighlightTarget?: {
    type: 'hotspot' | 'chart_bar' | 'layer' | 'timeline_year';
    targetId: string;
  };
  provenance?: ScientificProvenance | string;
  factCheckVerdict?: any;
}

export interface DualTierResponse {
  spokenVoiceText: string;
  spokenAudioText: string;
  screenPayload: ScreenPayload;
}

export class AnswerComposer {
  /**
   * Composes a synchronized spoken and visual response.
   */
  public static compose(options: {
    spokenVoiceText?: string;
    spokenAudioText?: string;
    spokenAnswer?: string;
    screenTitle?: string;
    earthmindSummary?: string;
    earthMindAnalysis?: string;
    earthmindAnalysis?: any;
    earthmindMetrics?: { label: string; value: string | number; delta?: string }[];
    modeledDrivers?: string[];
    webSources?: WebSource[];
    sources?: WebSource[];
    webSummary?: string;
    externalEvidence?: any;
    consensusStatus?: 'AGREEMENT' | 'CONFLICT' | 'UNCERTAINTY';
    uncertainty?: UncertaintyProfile;
    visualHighlightTarget?: { type: 'hotspot' | 'chart_bar' | 'layer' | 'timeline_year'; targetId: string };
    provenance?: ScientificProvenance | string;
    factCheckVerdict?: any;
  }): DualTierResponse {
    const spoken = (options.spokenVoiceText || options.spokenAudioText || options.spokenAnswer || '').trim();

    const emSummary = typeof options.earthmindAnalysis === 'string'
      ? options.earthmindAnalysis
      : typeof options.earthMindAnalysis === 'string'
      ? options.earthMindAnalysis
      : options.earthmindSummary || 'Modeled biophysical parameters and historical sensor data.';

    const extSummary = typeof options.externalEvidence === 'string'
      ? options.externalEvidence
      : options.webSummary || 'Corroborating external scientific datasets.';

    const sources = options.webSources || options.sources || [];
    const citations = sources.length > 0 ? CitationManager.formatCitations(sources) : [];

    const extEvObj: any = sources.length > 0 || extSummary ? {
      heading: 'EXTERNAL EVIDENCE',
      sources,
      citations,
      consensusStatus: options.consensusStatus || 'AGREEMENT',
      summary: extSummary,
      toString() { return extSummary; },
      get length() { return extSummary.length; },
    } : undefined;

    return {
      spokenVoiceText: spoken,
      spokenAudioText: spoken,
      screenPayload: {
        title: options.screenTitle || 'Scientific Intelligence Synthesis',
        earthMindAnalysis: emSummary,
        earthmindAnalysis: {
          heading: 'EARTHMIND ANALYSIS',
          metrics: options.earthmindMetrics || [],
          summary: emSummary,
          modeledDrivers: options.modeledDrivers,
        },
        externalEvidence: extEvObj,
        uncertainty: options.uncertainty,
        visualHighlightTarget: options.visualHighlightTarget,
        provenance: options.provenance || 'MODELED',
        factCheckVerdict: options.factCheckVerdict,
      },
    };
  }
}
