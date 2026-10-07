/**
 * EARTHMIND - Source Quality Engine
 * Computes authoritative multidimensional scores for all retrieved sources:
 * authority_score, freshness_score, relevance_score, cross_source_score, scientific_reliability.
 */

import { WebSource } from '../web/WebSourceParser';

export interface SourceQualityScores {
  authorityScore: number;       // 0-100 (NASA=98, IPCC=97, Unknown Blog=32)
  freshnessScore: number;       // 0-100 (Recency decay)
  relevanceScore: number;       // 0-100 (Semantic topic alignment)
  crossSourceScore: number;     // 0-100 (Corroboration by other independent sources)
  scientificReliability: number;// 0-100 (Peer-reviewed/official measurement status)
  overallQuality: number;       // Weighted composite
}

export class SourceQualityEngine {
  /**
   * Authority benchmarks for top scientific institutions and agencies.
   */
  private static DOMAIN_AUTHORITY_MAP: Record<string, number> = {
    'nasa.gov': 98,
    'climate.nasa.gov': 99,
    'noaa.gov': 97,
    'ipcc.ch': 98,
    'esa.int': 95,
    'isro.gov.in': 96,
    'copernicus.eu': 96,
    'wmo.int': 95,
    'usgs.gov': 94,
    'nature.com': 96,
    'science.org': 96,
    'sciencedirect.com': 92,
    'pnas.org': 94,
    'un.org': 90,
    'unep.org': 92,
    'worldbank.org': 88,
    'iitm.ac.in': 92,
    'reuters.com': 82,
    'bbc.com': 80,
    'thehindu.com': 78,
  };

  /**
   * Evaluates and updates quality scores for a given source.
   */
  public static evaluate(
    source: WebSource,
    queryKeywords: string[] = [],
    corroboratingSources: WebSource[] = []
  ): SourceQualityScores {
    // 1. Authority Score
    let authority = 45; // baseline for generic web
    const domainLower = source.domain.toLowerCase();

    for (const [knownDomain, score] of Object.entries(this.DOMAIN_AUTHORITY_MAP)) {
      if (domainLower.includes(knownDomain)) {
        authority = score;
        break;
      }
    }

    if (domainLower.endsWith('.gov') || domainLower.endsWith('.mil')) {
      authority = Math.max(authority, 90);
    } else if (domainLower.endsWith('.edu') || domainLower.endsWith('.ac.in')) {
      authority = Math.max(authority, 86);
    } else if (domainLower.endsWith('.org')) {
      authority = Math.max(authority, 65);
    }

    // 2. Freshness Score based on publicationDate
    const freshness = this.computeFreshness(source.publicationDate);

    // 3. Relevance Score based on query keyword matching
    const relevance = this.computeRelevance(source, queryKeywords);

    // 4. Cross-Source Score (how many other sources share key claims or domain peers)
    const crossSource = this.computeCrossSourceCorroboration(source, corroboratingSources);

    // 5. Scientific Reliability
    const isAgency = source.isOfficialAgency || domainLower.includes('nasa.gov') || domainLower.includes('noaa.gov') || domainLower.includes('ipcc.ch') || domainLower.includes('isro.gov.in') || domainLower.endsWith('.gov');
    const isPeer = source.isPeerReviewed || domainLower.includes('nature.com') || domainLower.includes('science.org') || domainLower.includes('pnas.org');

    let reliability = authority * 0.75 + (isPeer ? 25 : isAgency ? 25 : 10);
    reliability = Math.min(100, Math.max(20, Math.round(reliability)));

    // Composite overall quality
    const overall = Math.round(
      authority * 0.35 +
      freshness * 0.15 +
      relevance * 0.25 +
      crossSource * 0.10 +
      reliability * 0.15
    );

    const scores: SourceQualityScores = {
      authorityScore: Math.round(authority),
      freshnessScore: Math.round(freshness),
      relevanceScore: Math.round(relevance),
      crossSourceScore: Math.round(crossSource),
      scientificReliability: reliability,
      overallQuality: overall,
    };

    // Mutate source with updated scores
    source.authorityScore = scores.authorityScore;
    source.freshnessScore = scores.freshnessScore;
    source.relevanceScore = scores.relevanceScore;
    source.crossSourceScore = scores.crossSourceScore;
    source.scientificReliability = scores.scientificReliability;

    return scores;
  }

  private static computeFreshness(dateStr?: string): number {
    if (!dateStr) return 70;
    try {
      const pubYear = new Date(dateStr).getFullYear();
      const currentYear = new Date().getFullYear();
      const deltaYears = Math.max(0, currentYear - pubYear);
      if (deltaYears === 0) return 96;
      if (deltaYears === 1) return 90;
      if (deltaYears <= 3) return 82;
      if (deltaYears <= 5) return 72;
      return Math.max(40, 70 - deltaYears * 4);
    } catch {
      return 75;
    }
  }

  private static computeRelevance(source: WebSource, keywords: string[]): number {
    if (!keywords || keywords.length === 0) return 88;
    const text = `${source.title} ${source.snippet} ${source.domain}`.toLowerCase();
    let matches = 0;
    for (const kw of keywords) {
      if (text.includes(kw.toLowerCase())) {
        matches++;
      }
    }
    const ratio = matches / Math.max(1, keywords.length);
    return Math.min(100, Math.round(60 + ratio * 40));
  }

  private static computeCrossSourceCorroboration(source: WebSource, allSources: WebSource[]): number {
    if (!allSources || allSources.length <= 1) return 75;
    const others = allSources.filter((s) => s.id !== source.id);
    if (others.length === 0) return 75;

    // Check if other sources are from official or peer-reviewed origins
    const credibleCount = others.filter((s) => s.authorityScore >= 80).length;
    return Math.min(100, Math.round(65 + (credibleCount / others.length) * 35));
  }
}
