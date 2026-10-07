/**
 * EARTHMIND - Web Research Agent
 * Multi-mode autonomous web intelligence:
 * QUICK SEARCH | DEEP SEARCH | SCIENTIFIC RESEARCH | SOURCE COMPARISON | FACT CHECK | URL ANALYSIS | NEWS RESEARCH | ENVIRONMENTAL RESEARCH | TECHNICAL RESEARCH
 */

import { GoogleSearchProvider } from '../web/GoogleSearchProvider';
import { URLResearchProvider, URLResearchResult } from '../web/URLResearchProvider';
import { WebSource } from '../web/WebSourceParser';
import { EvidenceEngine, EvidenceSynthesis } from './EvidenceEngine';
import { FactCheckEngine, FactCheckReport } from './FactCheckEngine';
import { RateLimiter } from '../security/RateLimiter';

export type WebResearchMode =
  | 'QUICK_SEARCH'
  | 'DEEP_SEARCH'
  | 'SCIENTIFIC_RESEARCH'
  | 'SOURCE_COMPARISON'
  | 'FACT_CHECK'
  | 'URL_ANALYSIS'
  | 'NEWS_RESEARCH'
  | 'ENVIRONMENTAL_RESEARCH'
  | 'TECHNICAL_RESEARCH';

export interface WebResearchExecutionResult {
  mode: WebResearchMode;
  query: string;
  sources: WebSource[];
  synthesis: EvidenceSynthesis;
  factCheck?: FactCheckReport;
  urlAnalysis?: URLResearchResult;
  spokenSummary: string;
  detailedFindings: string[];
  latencyMs: number;
}

export class WebResearchAgent {
  /**
   * Executes autonomous web research based on determined research mode.
   */
  public static async executeResearch(
    query: string,
    mode: WebResearchMode = 'QUICK_SEARCH',
    targetUrl?: string
  ): Promise<WebResearchExecutionResult> {
    const start = Date.now();

    // Check rate limit
    RateLimiter.check('web-research', 20, 60000);

    // 1. URL Analysis Mode
    if (mode === 'URL_ANALYSIS' || (targetUrl && targetUrl.startsWith('http'))) {
      const urlRes = await URLResearchProvider.analyzeUrl(targetUrl || query);
      const sources = urlRes.source ? [urlRes.source] : [];
      const synthesis = EvidenceEngine.verify(sources, query);

      return {
        mode: 'URL_ANALYSIS',
        query,
        sources,
        synthesis,
        urlAnalysis: urlRes,
        spokenSummary: urlRes.success 
          ? `I've analyzed the document from ${urlRes.source?.publisher || 'the source'}. It outlines ${urlRes.keyFindings[0] || 'key environmental findings'}.`
          : (urlRes.errorMessage || 'Unable to retrieve target URL.'),
        detailedFindings: urlRes.keyFindings,
        latencyMs: Date.now() - start,
      };
    }

    // 2. Fact Check Mode
    if (mode === 'FACT_CHECK') {
      const factCheck = await FactCheckEngine.evaluateClaim(query);
      const synthesis = EvidenceEngine.verify(factCheck.sources, query);

      return {
        mode: 'FACT_CHECK',
        query,
        sources: factCheck.sources,
        synthesis,
        factCheck,
        spokenSummary: factCheck.spokenVerdict,
        detailedFindings: [factCheck.evidenceSummary, ...factCheck.limitations],
        latencyMs: Date.now() - start,
      };
    }

    // 3. Search Grounding (Quick, Deep, Scientific, Environmental, etc.)
    const searchRes = await GoogleSearchProvider.search({
      query,
      mode: mode === 'DEEP_SEARCH' ? 'DEEP' : mode === 'SCIENTIFIC_RESEARCH' ? 'SCIENTIFIC' : 'QUICK',
    });

    const synthesis = EvidenceEngine.verify(searchRes.sources, query);

    let spoken = synthesis.spokenSummary;
    if (searchRes.sources.length > 0) {
      const topSrc = searchRes.sources[0];
      spoken = `According to ${topSrc.publisher.split('(')[0].trim()}'s latest findings, ${searchRes.sources[0].snippet.slice(0, 140)}... I've placed the verified sources on the screen.`;
    }

    return {
      mode,
      query,
      sources: searchRes.sources,
      synthesis,
      spokenSummary: spoken,
      detailedFindings: searchRes.sources.map((s) => `${s.publisher}: ${s.snippet}`),
      latencyMs: Date.now() - start,
    };
  }
}
