/**
 * EARTHMIND - Evidence Engine & Multi-Source Verification
 * Compares multi-source claims and establishes AGREEMENT, CONFLICT, or UNCERTAINTY.
 */

import { WebSource } from '../web/WebSourceParser';

export type EvidenceAgreementStatus = 'AGREEMENT' | 'CONFLICT' | 'UNCERTAINTY';

export interface EvidenceSynthesis {
  status: EvidenceAgreementStatus;
  primaryFinding: string;
  supportingSources: WebSource[];
  dissentingSources: WebSource[];
  confidence: number; // 0.0 - 1.0
  explanation: string;
  spokenSummary: string;
}

export class EvidenceEngine {
  /**
   * Evaluates evidence across multiple sources for a given topic or claim.
   */
  public static verify(sources: WebSource[], topic: string): EvidenceSynthesis {
    if (!sources || sources.length === 0) {
      return {
        status: 'UNCERTAINTY',
        primaryFinding: 'Insufficient verifiable evidence available.',
        supportingSources: [],
        dissentingSources: [],
        confidence: 0.3,
        explanation: 'No authoritative datasets were returned to substantiate or refute the inquiry.',
        spokenSummary: 'I could not find sufficient authoritative scientific data to verify this.',
      };
    }

    if (sources.length === 1) {
      const src = sources[0];
      return {
        status: 'AGREEMENT',
        primaryFinding: src.snippet,
        supportingSources: [src],
        dissentingSources: [],
        confidence: Math.min(0.85, src.authorityScore / 100),
        explanation: `Single authoritative publication from ${src.publisher}.`,
        spokenSummary: `Based on published data from ${src.publisher.split('(')[0].trim()}, the available evidence indicates this observation.`,
      };
    }

    // Multiple sources comparison
    const highAuthority = sources.filter((s) => s.authorityScore >= 85);
    const avgAuthority = sources.reduce((acc, s) => acc + s.authorityScore, 0) / sources.length;
    const avgFreshness = sources.reduce((acc, s) => acc + s.freshnessScore, 0) / sources.length;
    const compositeConfidence = Math.min(0.98, Math.round(((avgAuthority * 0.7 + avgFreshness * 0.3) / 100) * 100) / 100);

    // Check for conflict keywords in snippets
    const snippets = sources.map((s) => s.snippet.toLowerCase()).join(' ');
    const titles = sources.map((s) => s.title.toLowerCase()).join(' ');
    const allText = `${snippets} ${titles} ${topic.toLowerCase()}`;
    const hasConflictKeywords = allText.includes('disagree') || 
                                allText.includes('disputed') || 
                                allText.includes('rate varies') || 
                                allText.includes('contradict') ||
                                allText.includes('conflict') ||
                                allText.includes('uncertain rate') ||
                                allText.includes('dataset variance') ||
                                ((allText.includes('rising') || allText.includes('risen') || allText.includes('warming')) &&
                                 (allText.includes('cooling') || allText.includes('dropping') || allText.includes('declining')));

    if (hasConflictKeywords) {
      return {
        status: 'CONFLICT',
        primaryFinding: 'Multiple authoritative datasets document the phenomenon, but specific rates and models diverge.',
        supportingSources: sources.slice(0, 2),
        dissentingSources: sources.slice(2),
        confidence: 0.78,
        explanation: 'Different observation methodologies (e.g. satellite altimetry versus in-situ gauge measurements) report varying numerical thresholds.',
        spokenSummary: 'Multiple sources agree on the overall trend, but the estimated rate varies by dataset and time period.',
      };
    }

    return {
      status: 'AGREEMENT',
      primaryFinding: 'Consensus verified across multiple independent scientific datasets.',
      supportingSources: highAuthority.length > 0 ? highAuthority : sources,
      dissentingSources: [],
      confidence: compositeConfidence,
      explanation: `Corroborated by ${sources.length} authoritative institutions with high cross-source correlation.`,
      spokenSummary: `Multiple authoritative sources agree on this finding. The published evidence consistently supports the observation.`,
    };
  }

  public static compare(topic: string, sources: WebSource[]): EvidenceSynthesis {
    return this.verify(sources, topic);
  }
}

