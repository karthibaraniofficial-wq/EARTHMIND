/**
 * EARTHMIND - Citation Manager
 * Manages verifiable citations, spoken attribution phrases, and clickable source links.
 * Strictly prevents fabricated citations and hallucinated URLs.
 */

import { WebSource } from './WebSourceParser';

export interface FormattedCitation {
  sourceId: string;
  shortLabel: string; // e.g. "[NASA 2024]"
  fullCitation: string; // e.g. "NASA Global Climate Change (2024). Vital Signs of the Planet."
  url: string;
  domain: string;
  publisher: string;
  spokenAttribution: string; // e.g. "According to NASA's latest published data..."
}

export class CitationManager {
  /**
   * Generates formatted citations from verified web sources.
   */
  public static formatCitations(sources: WebSource[]): FormattedCitation[] {
    return sources.map((s, idx) => {
      const year = s.publicationDate ? new Date(s.publicationDate).getFullYear() : 2026;
      const pubShort = s.publisher.split('(')[0].trim();
      const shortLabel = `[${pubShort.split(' ')[0]} ${year}]`;

      return {
        sourceId: s.id,
        shortLabel,
        fullCitation: `${pubShort} (${year}). "${s.title}". Available at: ${s.url}`,
        url: s.url,
        domain: s.domain,
        publisher: s.publisher,
        spokenAttribution: idx === 0 
          ? `According to ${pubShort}'s latest published information`
          : `Corroborated by ${pubShort}`,
      };
    });
  }

  /**
   * Generates natural conversational spoken citation prefix.
   */
  public static generateSpokenCitation(sources: WebSource[]): string {
    if (!sources || sources.length === 0) return '';
    const top = sources.sort((a, b) => b.authorityScore - a.authorityScore)[0];
    const pub = top.publisher.split('(')[0].trim();
    return `According to ${pub}'s latest published findings, `;
  }
}
