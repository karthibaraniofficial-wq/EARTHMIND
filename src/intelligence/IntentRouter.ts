/**
 * EARTHMIND - Master Intent Router
 * Classifies inputs across 14 operational and scientific intelligence categories:
 * LOCAL_EARTHMIND | WEB_CURRENT | WEB_RESEARCH | URL_ANALYSIS | SCIENCE | CALCULATION | 
 * SIMULATION | NAVIGATION | CONTROL | REPORT | FACT_CHECK | GENERAL_KNOWLEDGE | EXHIBITION | CLARIFICATION
 *
 * Supports English, Tamil, Hindi, and Tamil-English code-switching.
 */

export type RoutedIntentCategory =
  | 'LOCAL_EARTHMIND'
  | 'WEB_CURRENT'
  | 'WEB_RESEARCH'
  | 'URL_ANALYSIS'
  | 'SCIENCE'
  | 'CALCULATION'
  | 'SIMULATION'
  | 'NAVIGATION'
  | 'CONTROL'
  | 'REPORT'
  | 'FACT_CHECK'
  | 'GENERAL_KNOWLEDGE'
  | 'EXHIBITION'
  | 'CLARIFICATION';

export interface IntentRoutingAnalysis {
  category: RoutedIntentCategory;
  confidence: number;
  detectedLanguage: 'en' | 'ta' | 'hi' | 'mixed_ta_en';
  extractedEntities: {
    location?: string;
    year?: number;
    variable?: string;
    value?: number;
    layer?: string;
    url?: string;
    calculationExpression?: string;
    claim?: string;
  };
  suggestedAction: string;
}

export class IntentRouter {
  public static route(input: string): IntentRoutingAnalysis {
    const raw = input.trim();
    const q = raw.toLowerCase();

    // 1. Language detection
    const hasTamilScript = /[\u0B80-\u0BFF]/.test(raw);
    const hasHindiScript = /[\u0900-\u097F]/.test(raw);
    const hasThanglishMarkers = 
      q.includes('pannu') || 
      q.includes('epdi') || 
      q.includes('-la') || 
      q.includes('katungga') || 
      q.includes('sollu') || 
      q.includes('-ku') || 
      q.includes('athiga');

    let lang: 'en' | 'ta' | 'hi' | 'mixed_ta_en' = 'en';
    if (hasTamilScript) lang = 'ta';
    else if (hasHindiScript) lang = 'hi';
    else if (hasThanglishMarkers) lang = 'mixed_ta_en';

    // 2. URL Analysis
    const urlMatch = raw.match(/https?:\/\/[^\s]+/i);
    if (urlMatch || q.includes('read this website') || q.includes('explain this article') || q.includes('summarize this url') || q.includes('nasa page') || q.includes('what does this pdf say')) {
      return {
        category: 'URL_ANALYSIS',
        confidence: 0.95,
        detectedLanguage: lang,
        extractedEntities: {
          url: urlMatch ? urlMatch[0] : undefined,
        },
        suggestedAction: 'Execute URL research & document extraction',
      };
    }

    // 3. Calculation Engine
    if (
      q.startsWith('calculate') ||
      q.includes('percentage increase') ||
      q.includes('convert square kilometers') ||
      q.includes('what is the average') ||
      q.includes('compare these values') ||
      q.includes('calculate carbon reduction') ||
      /^(what is|calculate)\s+[\d\.\+\-\*\/\s\(\)]+\??$/.test(q)
    ) {
      return {
        category: 'CALCULATION',
        confidence: 0.94,
        detectedLanguage: lang,
        extractedEntities: {
          calculationExpression: raw,
        },
        suggestedAction: 'Execute deterministic numerical computation',
      };
    }

    // 4. Fact Check Mode
    if (
      q.includes('is this true') ||
      q.includes('is this claim true') ||
      q.includes('is that true') ||
      q.includes('fact check') ||
      q.includes('is it true') ||
      q.includes('verify this claim') ||
      q.includes('is sea level rising faster now') ||
      q.includes('unmaiya')
    ) {
      return {
        category: 'FACT_CHECK',
        confidence: 0.93,
        detectedLanguage: lang,
        extractedEntities: {
          claim: raw.replace(/^(is it true that|is this true|fact check:?|fact check this claim:?|is this claim true that)\s*/i, ''),
        },
        suggestedAction: 'Verify claim against authoritative evidence',
      };
    }

    // 5. Exhibition Mode
    if (
      q.includes('start exhibition') ||
      q.includes('start science expo') ||
      q.includes('explain earthmind') ||
      q.includes('what is your innovation') ||
      q.includes('what is the problem') ||
      q.includes('why ai') ||
      q.includes('what data do you use') ||
      q.includes('what is your novelty') ||
      q.includes('what are the limitations') ||
      q.includes('expo mode')
    ) {
      return {
        category: 'EXHIBITION',
        confidence: 0.96,
        detectedLanguage: lang,
        extractedEntities: {},
        suggestedAction: 'Trigger guided Science Expo presentation',
      };
    }

    // 6. Report Generation
    if (
      (q.includes('generate') && q.includes('report')) ||
      (q.includes('create') && q.includes('report')) ||
      q.includes('research report') ||
      q.includes('export findings')
    ) {
      return {
        category: 'REPORT',
        confidence: 0.95,
        detectedLanguage: lang,
        extractedEntities: {},
        suggestedAction: 'Synthesize research report',
      };
    }

    // 7. Simulation Control & What-If
    if (
      q.includes('increase rainfall') ||
      q.includes('reduce traffic') ||
      q.includes('increase tree cover') ||
      q.includes('what if rainfall increases') ||
      q.includes('what if forest cover decreases') ||
      q.includes('what if urbanization doubles') ||
      q.includes('what if temperature increases') ||
      q.includes('run the simulation') ||
      q.includes('run simulation') ||
      q.includes('run it') ||
      q.includes('reset simulation') ||
      q.includes('reset everything') ||
      q.includes('save this scenario') ||
      q.includes('athiga') ||
      (q.includes('tree cover') && (q.includes('percent') || q.includes('சதவீதம்')))
    ) {
      // Extract numeric values if present
      const numMatch = q.match(/(\d+)\s*(?:percent|%|degrees|°c|சதவீதம்)/);
      const val = numMatch ? parseInt(numMatch[1], 10) : undefined;
      let variable = 'treeCoverDelta';
      if (q.includes('rain')) variable = 'rainfallDelta';
      else if (q.includes('urban')) variable = 'urbanizationDelta';
      else if (q.includes('traffic')) variable = 'trafficDelta';
      else if (q.includes('waste')) variable = 'wasteDelta';

      return {
        category: 'SIMULATION',
        confidence: 0.94,
        detectedLanguage: lang,
        extractedEntities: {
          variable,
          value: val,
        },
        suggestedAction: 'Modify simulation parameters or run coupled model',
      };
    }

    // 8. Navigation & Location
    if (
      q.includes('go to ') ||
      q.includes('open ') ||
      q.includes('take me to ') ||
      q.includes('zoom into ') ||
      q.includes('zoom here') ||
      q.includes('-ku po') ||
      q.includes('chel')
    ) {
      let loc: string | undefined;
      if (q.includes('chennai') || q.includes('tamil nadu')) loc = 'chennai';
      else if (q.includes('amazon')) loc = 'amazon';
      else if (q.includes('chad')) loc = 'chad';
      else if (q.includes('delhi') || q.includes('indo-gangetic')) loc = 'indo-gangetic-plain';

      const yearMatch = q.match(/\b(20\d\d)\b/);

      return {
        category: 'NAVIGATION',
        confidence: 0.92,
        detectedLanguage: lang,
        extractedEntities: {
          location: loc,
          year: yearMatch ? parseInt(yearMatch[1], 10) : undefined,
        },
        suggestedAction: 'Route view or pan globe camera',
      };
    }

    // 8b. Application Control (Layer toggles & screen controls)
    if (
      q.includes('turn on ') ||
      q.includes('turn off ') ||
      q.includes('hide ') ||
      q.includes('show layer') ||
      q.includes('toggle layer')
    ) {
      let layer: string | undefined;
      if (q.includes('flood')) layer = 'flood';
      else if (q.includes('temp')) layer = 'temperature';
      else if (q.includes('veg')) layer = 'green_cover';

      return {
        category: 'CONTROL',
        confidence: 0.94,
        detectedLanguage: lang,
        extractedEntities: { layer },
        suggestedAction: 'Toggle application visual layer or control',
      };
    }

    // 9. Local EarthMind Screen Understanding
    if (
      !q.includes('affect') &&
      !q.startsWith('why') &&
      (
        q.includes('what am i looking at') ||
        q.includes('explain this screen') ||
        q.includes('explain this chart') ||
        q.includes('explain the graph') ||
        q.includes('what does this red region mean') ||
        q.includes('what is the highest value') ||
        q.includes('show flood risk') ||
        q.includes('flood risk show pannu') ||
        q.includes('flood risk here') ||
        q.includes('risk here') ||
        (q.includes('flood risk') && (q.includes('chennai') || q.includes('here') || q.includes('epdi irukku'))) ||
        q.includes('compare 2018 and 2026') ||
        q.includes('compare 2020 and 2026')
      )
    ) {
      let layer: string | undefined;
      if (q.includes('flood')) layer = 'flood';
      else if (q.includes('temp')) layer = 'temperature';
      else if (q.includes('veg')) layer = 'green_cover';

      return {
        category: 'LOCAL_EARTHMIND',
        confidence: 0.93,
        detectedLanguage: lang,
        extractedEntities: {
          layer,
        },
        suggestedAction: 'Explain current screen or focus EarthMind visual layer',
      };
    }

    // 10. Live Web Current Information
    if (
      q.includes('today') ||
      q.includes('this week') ||
      q.includes('this year') ||
      q.includes('latest news') ||
      q.includes('latest nasa') ||
      q.includes('latest isro mission') ||
      q.includes('nobel prize') ||
      q.includes('what is happening with climate change today')
    ) {
      return {
        category: 'WEB_CURRENT',
        confidence: 0.92,
        detectedLanguage: lang,
        extractedEntities: {},
        suggestedAction: 'Query real-time Google search grounding for time-sensitive news',
      };
    }

    // 11. Scientific Explanation (Why? Causal questions)
    if (
      q.startsWith('why') ||
      q.includes('how does deforestation affect flooding') ||
      q.includes('epdi flood risk-a affect pannuthu') ||
      q.includes('explain scientifically') ||
      q.includes('teach me') ||
      q.includes('explain deeply')
    ) {
      return {
        category: 'SCIENCE',
        confidence: 0.91,
        detectedLanguage: lang,
        extractedEntities: {},
        suggestedAction: 'Deploy ScientificReasoningEngine for causal biophysical mechanisms',
      };
    }

    // 12. General Web Research
    if (q.includes('search') || q.includes('research this') || q.includes('find sources')) {
      return {
        category: 'WEB_RESEARCH',
        confidence: 0.90,
        detectedLanguage: lang,
        extractedEntities: {},
        suggestedAction: 'Trigger autonomous multi-source web research',
      };
    }

    // Default fallback
    return {
      category: 'GENERAL_KNOWLEDGE',
      confidence: 0.70,
      detectedLanguage: lang,
      extractedEntities: {},
      suggestedAction: 'General multimodal conversational reasoning',
    };
  }

  public static routeIntent(input: string): IntentRoutingAnalysis {
    return this.route(input);
  }
}

