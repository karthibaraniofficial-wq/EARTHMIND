/**
 * EARTHMIND - Web Source Parser & Metadata Extraction
 * Parses search results and web content into structured scientific sources.
 */

import { InputValidator } from '../security/InputValidator';

export interface WebSource {
  id: string;
  title: string;
  url: string;
  domain: string;
  publisher: string;
  snippet: string;
  publicationDate: string;
  accessDate: string;
  authorityScore: number;
  freshnessScore: number;
  relevanceScore: number;
  crossSourceScore: number;
  scientificReliability: number;
  isPeerReviewed: boolean;
  isOfficialAgency: boolean;
  rawConfidence?: number;
}

export class WebSourceParser {
  /**
   * Extracts domain name from a URL.
   */
  public static extractDomain(url: string): string {
    try {
      const parsed = new URL(url);
      return parsed.hostname.replace(/^www\./, '');
    } catch {
      return 'web.source';
    }
  }

  /**
   * Detects known scientific publisher or governmental agency name.
   */
  public static detectPublisher(domain: string, title?: string): { name: string; isAgency: boolean; isPeerReviewed: boolean } {
    const d = domain.toLowerCase();
    
    if (d.includes('nasa.gov')) return { name: 'NASA (National Aeronautics and Space Administration)', isAgency: true, isPeerReviewed: true };
    if (d.includes('noaa.gov')) return { name: 'NOAA (National Oceanic and Atmospheric Administration)', isAgency: true, isPeerReviewed: true };
    if (d.includes('esa.int')) return { name: 'ESA (European Space Agency)', isAgency: true, isPeerReviewed: true };
    if (d.includes('isro.gov.in')) return { name: 'ISRO (Indian Space Research Organisation)', isAgency: true, isPeerReviewed: true };
    if (d.includes('ipcc.ch')) return { name: 'IPCC (Intergovernmental Panel on Climate Change)', isAgency: true, isPeerReviewed: true };
    if (d.includes('un.org') || d.includes('unep.org')) return { name: 'United Nations / UNEP', isAgency: true, isPeerReviewed: false };
    if (d.includes('usgs.gov')) return { name: 'USGS (United States Geological Survey)', isAgency: true, isPeerReviewed: true };
    if (d.includes('nature.com')) return { name: 'Nature Publishing Group', isAgency: false, isPeerReviewed: true };
    if (d.includes('science.org')) return { name: 'Science / AAAS', isAgency: false, isPeerReviewed: true };
    if (d.includes('wmo.int')) return { name: 'WMO (World Meteorological Organization)', isAgency: true, isPeerReviewed: true };
    if (d.includes('copernicus.eu')) return { name: 'Copernicus Climate Change Service (EU)', isAgency: true, isPeerReviewed: true };
    if (d.includes('iitm.res.in') || d.includes('iitm.ac.in')) return { name: 'IIT Madras / IITM Environmental Research', isAgency: true, isPeerReviewed: true };
    if (d.includes('reuters.com')) return { name: 'Reuters News Agency', isAgency: false, isPeerReviewed: false };
    if (d.includes('bbc.com')) return { name: 'BBC Global News', isAgency: false, isPeerReviewed: false };

    // Fallback: format domain nicely
    const cleanName = d.split('.')[0];
    const capitalized = cleanName.charAt(0).toUpperCase() + cleanName.slice(1);
    return { name: capitalized, isAgency: false, isPeerReviewed: false };
  }

  /**
   * Normalizes raw search grounding item into a WebSource object.
   */
  public static parseItem(raw: {
    title: string;
    url: string;
    snippet?: string;
    publicationDate?: string;
    query?: string;
  }): WebSource {
    const domain = this.extractDomain(raw.url);
    const pubInfo = this.detectPublisher(domain, raw.title);
    const cleanSnippet = InputValidator.sanitizeWebText(raw.snippet || raw.title, 500);

    return {
      id: `src-${Math.random().toString(36).substring(2, 9)}`,
      title: raw.title || 'Scientific Publication',
      url: raw.url,
      domain,
      publisher: pubInfo.name,
      snippet: cleanSnippet,
      publicationDate: raw.publicationDate || new Date().toISOString().split('T')[0],
      accessDate: new Date().toISOString().split('T')[0],
      authorityScore: pubInfo.isAgency ? 95 : pubInfo.isPeerReviewed ? 92 : 65,
      freshnessScore: 85,
      relevanceScore: 90,
      crossSourceScore: 80,
      scientificReliability: pubInfo.isPeerReviewed ? 96 : pubInfo.isAgency ? 94 : 70,
      isPeerReviewed: pubInfo.isPeerReviewed,
      isOfficialAgency: pubInfo.isAgency,
    };
  }
}
