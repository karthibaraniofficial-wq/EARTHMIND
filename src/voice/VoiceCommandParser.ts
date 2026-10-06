import { LayerType, SimulationParameters } from '../types';
import { ParsedVoiceCommand, VoiceIntentType, RecognitionLanguage } from './VoiceTypes';

// Known Hotspot Aliases mapping to actual hotspot IDs
export const LOCATION_ALIASES: Record<string, { id: string; name: string }> = {
  'amazon': { id: 'amazon-rainforest', name: 'Amazon Rainforest' },
  'amazon rainforest': { id: 'amazon-rainforest', name: 'Amazon Rainforest' },
  'brazil': { id: 'amazon-rainforest', name: 'Amazon Rainforest' },
  'tokyo': { id: 'tokyo-metropolis', name: 'Tokyo Metropolis' },
  'tokyo city': { id: 'tokyo-metropolis', name: 'Tokyo Metropolis' },
  'japan': { id: 'tokyo-metropolis', name: 'Tokyo Metropolis' },
  'indo-gangetic': { id: 'indo-gangetic-plain', name: 'Indo-Gangetic Basin' },
  'indo gangetic': { id: 'indo-gangetic-plain', name: 'Indo-Gangetic Basin' },
  'indo-gangetic basin': { id: 'indo-gangetic-plain', name: 'Indo-Gangetic Basin' },
  'delhi': { id: 'indo-gangetic-plain', name: 'Indo-Gangetic Basin' },
  'ganga': { id: 'indo-gangetic-plain', name: 'Indo-Gangetic Basin' },
  'india': { id: 'indo-gangetic-plain', name: 'Indo-Gangetic Basin' },
  'lake chad': { id: 'lake-chad-basin', name: 'Lake Chad Basin' },
  'chad': { id: 'lake-chad-basin', name: 'Lake Chad Basin' },
  'chad basin': { id: 'lake-chad-basin', name: 'Lake Chad Basin' },
  'sahel': { id: 'lake-chad-basin', name: 'Lake Chad Basin' },
  'rotterdam': { id: 'rotterdam-delta', name: 'Rhine-Meuse Delta' },
  'rhine': { id: 'rotterdam-delta', name: 'Rhine-Meuse Delta' },
  'netherlands': { id: 'rotterdam-delta', name: 'Rhine-Meuse Delta' },
  'california': { id: 'california-central-valley', name: 'California Central Valley' },
  'central valley': { id: 'california-central-valley', name: 'California Central Valley' },
  'california central valley': { id: 'california-central-valley', name: 'California Central Valley' },
};

// Layer Aliases mapping to LayerType
export const LAYER_ALIASES: Record<string, LayerType> = {
  'health': 'health',
  'environmental health': 'health',
  'overall health': 'health',
  'resilience': 'health',
  'temperature': 'temperature',
  'temp': 'temperature',
  'surface temp': 'temperature',
  'surface temperature': 'temperature',
  'heat': 'temperature',
  'thermal': 'temperature',
  'air': 'air_quality',
  'air quality': 'air_quality',
  'aqi': 'air_quality',
  'pollution': 'air_quality',
  'pm25': 'air_quality',
  'green': 'green_cover',
  'green cover': 'green_cover',
  'tree': 'green_cover',
  'tree cover': 'green_cover',
  'canopy': 'green_cover',
  'vegetation': 'green_cover',
  'forest': 'green_cover',
  'water': 'water',
  'water stress': 'water',
  'aquifer': 'water',
  'hydrology': 'water',
  'urban': 'urbanization',
  'urbanization': 'urbanization',
  'urban sprawl': 'urbanization',
  'concrete': 'urbanization',
  'pavement': 'urbanization',
  'sprawl': 'urbanization',
  'flood': 'flood',
  'flood risk': 'flood',
  'flooding': 'flood',
  'runoff': 'flood',
  'drought': 'drought',
  'drought risk': 'drought',
  'wildfire': 'wildfire',
  'wildfire risk': 'wildfire',
  'fire': 'wildfire',
  'rainfall': 'rainfall',
  'rain': 'rainfall',
  'precipitation': 'rainfall',
  'waste': 'waste',
};

// Simulation Levers mapping
export const SIM_VARIABLE_ALIASES: Record<string, { key: keyof SimulationParameters; label: string }> = {
  'tree': { key: 'treeCoverDelta', label: 'Tree Canopy Cover' },
  'trees': { key: 'treeCoverDelta', label: 'Tree Canopy Cover' },
  'tree cover': { key: 'treeCoverDelta', label: 'Tree Canopy Cover' },
  'green cover': { key: 'treeCoverDelta', label: 'Tree Canopy Cover' },
  'canopy': { key: 'treeCoverDelta', label: 'Tree Canopy Cover' },
  'rain': { key: 'rainfallDelta', label: 'Precipitation Intensity' },
  'rainfall': { key: 'rainfallDelta', label: 'Precipitation Intensity' },
  'precipitation': { key: 'rainfallDelta', label: 'Precipitation Intensity' },
  'urban': { key: 'urbanizationDelta', label: 'Urban Sprawl' },
  'urbanization': { key: 'urbanizationDelta', label: 'Urban Sprawl' },
  'sprawl': { key: 'urbanizationDelta', label: 'Urban Sprawl' },
  'pavement': { key: 'urbanizationDelta', label: 'Urban Sprawl' },
  'waste': { key: 'wasteDelta', label: 'Municipal Waste' },
  'garbage': { key: 'wasteDelta', label: 'Municipal Waste' },
  'water': { key: 'waterDelta', label: 'Water Retention Capacity' },
  'water retention': { key: 'waterDelta', label: 'Water Retention Capacity' },
  'traffic': { key: 'trafficDelta', label: 'Combustion Traffic' },
  'vehicles': { key: 'trafficDelta', label: 'Combustion Traffic' },
  'cars': { key: 'trafficDelta', label: 'Combustion Traffic' },
  'energy': { key: 'energyEfficiencyDelta', label: 'Clean Energy & Efficiency' },
  'clean energy': { key: 'energyEfficiencyDelta', label: 'Clean Energy & Efficiency' },
  'efficiency': { key: 'energyEfficiencyDelta', label: 'Clean Energy & Efficiency' },
};

// Word-to-number mapping for spoken English
const WORD_NUMBERS: Record<string, number> = {
  'zero': 0, 'one': 1, 'two': 2, 'three': 3, 'four': 4,
  'five': 5, 'six': 6, 'seven': 7, 'eight': 8, 'nine': 9,
  'ten': 10, 'eleven': 11, 'twelve': 12, 'thirteen': 13,
  'fourteen': 14, 'fifteen': 15, 'sixteen': 16, 'seventeen': 17,
  'eighteen': 18, 'nineteen': 19, 'twenty': 20, 'thirty': 30,
  'forty': 40, 'fifty': 50, 'sixty': 60, 'seventy': 70,
  'eighty': 80, 'ninety': 90, 'hundred': 100,
};

// Extract number from phrases like "20 percent", "twenty percent", "+25", "minus 10"
export function extractNumberAndPercentage(text: string): { value: number | null; isPercentage: boolean; isDelta: boolean } {
  const clean = text.toLowerCase();
  
  // Direct digit regex: e.g. "+20%", "-10 percent", "25", "+ 30"
  const digitMatch = clean.match(/([+-]?\s*\d+)\s*(%|percent|percentage)?/);
  if (digitMatch) {
    const rawNum = parseInt(digitMatch[1].replace(/\s+/g, ''), 10);
    const isPct = !!digitMatch[2] || clean.includes('%') || clean.includes('percent');
    const isDelta = clean.includes('increase') || clean.includes('decrease') || clean.includes('reduce') || clean.includes('raise') || clean.includes('more') || clean.includes('less') || digitMatch[1].startsWith('+') || digitMatch[1].startsWith('-');
    return { value: rawNum, isPercentage: isPct, isDelta };
  }

  // Word number matching (e.g. "twenty five", "thirty")
  const words = clean.split(/\s+/);
  let total = 0;
  let found = false;
  for (const w of words) {
    if (WORD_NUMBERS[w] !== undefined) {
      total += WORD_NUMBERS[w];
      found = true;
    }
  }

  if (found) {
    const isNegative = clean.includes('minus') || clean.includes('negative') || clean.includes('reduce') || clean.includes('decrease') || clean.includes('lower') || clean.includes('less');
    const finalVal = isNegative ? -Math.abs(total) : total;
    const isPct = clean.includes('percent') || clean.includes('percentage') || clean.includes('%');
    const isDelta = clean.includes('increase') || clean.includes('decrease') || clean.includes('reduce') || clean.includes('by') || clean.includes('raise');
    return { value: finalVal, isPercentage: isPct, isDelta };
  }

  return { value: null, isPercentage: false, isDelta: false };
}

// Extract year (2010 to 2030 or 2100)
export function extractYear(text: string): number | null {
  const match = text.match(/\b(20[1-3][0-9]|2100)\b/);
  if (match) {
    return parseInt(match[1], 10);
  }
  if (text.includes('twenty ten')) return 2010;
  if (text.includes('twenty twelve')) return 2012;
  if (text.includes('twenty fourteen')) return 2014;
  if (text.includes('twenty fifteen')) return 2015;
  if (text.includes('twenty sixteen')) return 2016;
  if (text.includes('twenty eighteen')) return 2018;
  if (text.includes('twenty twenty')) return 2020;
  if (text.includes('twenty twenty-six') || text.includes('twenty twenty six')) return 2026;
  return null;
}

// Normalize Tamil & Thanglish phrases to English intent tokens
export function normalizeLanguage(raw: string, _lang?: RecognitionLanguage): string {
  let text = raw.trim().toLowerCase();

  // Strip Tamil accusative marker (-ஐ / -ai) on English stems: e.g. "tree cover-ஐ" -> "tree cover"
  text = text.replace(/(\w+)\s*[-–]?ஐ\b/gi, '$1');

  // Tamil script normalizations
  text = text.replace(/மழை/g, 'rain');
  text = text.replace(/மரம்|மரங்கள்/g, 'tree');
  text = text.replace(/வெப்பம்/g, 'temperature');
  text = text.replace(/வெள்ளம்/g, 'flood');
  text = text.replace(/நகரம்/g, 'urban');
  text = text.replace(/சதவீதம்/g, 'percent');
  text = text.replace(/அதிகப்படுத்து|கூட்டு/g, 'increase');
  text = text.replace(/குறை|குறைக்கவும்/g, 'reduce');
  text = text.replace(/திற|காட்டு/g, 'open');

  // Normalize punctuation and whitespace (preserving numbers and letters)
  text = text.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, ' ').replace(/\s{2,}/g, ' ');

  // Thanglish verb-final reordering to English imperative
  // e.g. "flood risk show pannu" -> "show flood risk"
  // "what if open pannu" -> "open what if"
  // "simulation run pannu" -> "run simulation"
  text = text.replace(/(.+?)\s+show\s+pannu\b/gi, 'show $1');
  text = text.replace(/(.+?)\s+open\s+pannu\b/gi, 'open $1');
  text = text.replace(/(.+?)\s+run\s+pannu\b/gi, 'run $1');
  text = text.replace(/(.+?)\s+(?:increase|கூட்டு)\s+pannu\b/gi, 'increase $1');
  text = text.replace(/(.+?)\s+(?:reduce|decrease|குறை)\s+pannu\b/gi, 'reduce $1');

  // "2018-ku po" -> "go to 2018"
  text = text.replace(/\b(\w+)\s*(-ku|ku|kku)\s*(po|vaa)\b/gi, 'go to $1');
  text = text.replace(/\bshow\s+pannu\b/gi, 'show');
  text = text.replace(/\bopen\s+pannu\b/gi, 'open');
  text = text.replace(/\brun\s+pannu\b/gi, 'run');
  text = text.replace(/\bincrease\s+pannu\b/gi, 'increase');
  text = text.replace(/\breduce\s+pannu\b/gi, 'reduce');
  text = text.replace(/\bdecrease\s+pannu\b/gi, 'decrease');
  text = text.replace(/\bpannu\b/gi, '');
  text = text.replace(/\bkatungga|kaatu\b/gi, 'show');

  return text.trim();
}

/**
 * Voice Command Parser
 * Parses single or compound natural language voice inputs into structured intents
 */
export function parseVoiceCommand(rawInput: string, lang: RecognitionLanguage = 'en-US'): ParsedVoiceCommand {
  const normalized = normalizeLanguage(rawInput, lang);

  // 1. Check for compound multi-command connected by "and then", "and", "then"
  if (normalized.includes(' and then ') || normalized.includes(' then ') || (normalized.includes(' and ') && normalized.split(' and ').length === 2 && !normalized.includes('compare '))) {
    const parts = normalized.includes(' and then ')
      ? normalized.split(' and then ')
      : normalized.includes(' then ')
      ? normalized.split(' then ')
      : normalized.split(' and ');

    if (parts.length > 1 && parts[0].trim().length > 3 && parts[1].trim().length > 3) {
      const sub1 = parseSingleVoiceCommand(parts[0].trim(), rawInput);
      const sub2 = parseSingleVoiceCommand(parts[1].trim(), rawInput);
      if (sub1.intent !== 'UNKNOWN' && sub2.intent !== 'UNKNOWN') {
        return {
          rawText: rawInput,
          normalizedText: normalized,
          intent: 'COMPOUND',
          confidence: Math.min(sub1.confidence, sub2.confidence),
          params: { ...sub1.params },
          explanation: `Compound command: "${sub1.explanation}" and "${sub2.explanation}"`,
          subCommands: [sub1, sub2],
        };
      }
    }
  }

  return parseSingleVoiceCommand(normalized, rawInput);
}

function parseSingleVoiceCommand(text: string, rawOriginal: string): ParsedVoiceCommand {
  const lower = text.toLowerCase().trim();

  // 1. Speech Control Commands (STOP_SPEAKING, VOLUME, SPEED)
  if (
    lower === 'stop' ||
    lower === 'stop speaking' ||
    lower === 'shut up' ||
    lower === 'be quiet' ||
    lower === 'silence' ||
    lower === 'cancel speech' ||
    lower === 'mute'
  ) {
    return {
      rawText: rawOriginal,
      normalizedText: text,
      intent: 'STOP_SPEAKING',
      confidence: 0.98,
      params: {},
      explanation: 'Stop active speech synthesis immediately',
    };
  }

  if (lower.includes('speed up') || lower.includes('faster speech') || lower.includes('talk faster')) {
    return {
      rawText: rawOriginal,
      normalizedText: text,
      intent: 'SET_SPEECH_SPEED',
      confidence: 0.95,
      params: { speechRate: 1.5 },
      explanation: 'Increase speech rate to 1.5x',
    };
  }

  if (lower.includes('slow down') || lower.includes('slower speech') || lower.includes('talk slower')) {
    return {
      rawText: rawOriginal,
      normalizedText: text,
      intent: 'SET_SPEECH_SPEED',
      confidence: 0.95,
      params: { speechRate: 0.75 },
      explanation: 'Decrease speech rate to 0.75x',
    };
  }

  // 2. Exhibition & Demo Presentation Commands
  if (
    lower.includes('start science expo') ||
    lower.includes('start earthmind demo') ||
    lower.includes('start demo') ||
    lower.includes('start exhibition') ||
    lower.includes('start expo')
  ) {
    return {
      rawText: rawOriginal,
      normalizedText: text,
      intent: 'START_DEMO',
      confidence: 0.95,
      params: {},
      explanation: 'Initiate Environmental Intelligence Demonstration',
    };
  }

  if (
    lower.includes('open exhibition') ||
    lower.includes('open science expo') ||
    lower.includes('exhibition mode') ||
    lower.includes('judge mode')
  ) {
    return {
      rawText: rawOriginal,
      normalizedText: text,
      intent: 'OPEN_EXHIBITION',
      confidence: 0.95,
      params: {},
      explanation: 'Launch Science Expo Exhibition Mode for Judges',
    };
  }

  if (lower.includes('close exhibition') || lower.includes('exit exhibition') || lower.includes('exit expo')) {
    return {
      rawText: rawOriginal,
      normalizedText: text,
      intent: 'CLOSE_EXHIBITION',
      confidence: 0.95,
      params: {},
      explanation: 'Exit Exhibition presentation view',
    };
  }

  if (lower === 'next' || lower === 'next slide' || lower === 'go to next' || lower === 'advance') {
    return {
      rawText: rawOriginal,
      normalizedText: text,
      intent: 'EXHIBITION_NEXT',
      confidence: 0.92,
      params: {},
      explanation: 'Advance to next exhibition section',
    };
  }

  if (lower === 'previous' || lower === 'prev' || lower === 'go back' || lower === 'previous slide') {
    return {
      rawText: rawOriginal,
      normalizedText: text,
      intent: 'EXHIBITION_PREV',
      confidence: 0.92,
      params: {},
      explanation: 'Go to previous section',
    };
  }

  if (lower.includes('explain this') || lower.includes('explain methodology') || lower.includes('show methodology')) {
    return {
      rawText: rawOriginal,
      normalizedText: text,
      intent: 'EXHIBITION_EXPLAIN',
      confidence: 0.92,
      params: {},
      explanation: 'Explain current scientific methodology',
    };
  }

  if (lower.includes('start demo') || lower.includes('start guided demo') || lower.includes('run demo') || lower.includes('start earthmind demo')) {
    return {
      rawText: rawOriginal,
      normalizedText: text,
      intent: 'START_DEMO',
      confidence: 0.96,
      params: {},
      explanation: 'Initiate automated Guided Demonstration flow',
    };
  }

  if (lower.includes('stop demo') || lower.includes('exit demo') || lower.includes('cancel demo')) {
    return {
      rawText: rawOriginal,
      normalizedText: text,
      intent: 'STOP_DEMO',
      confidence: 0.96,
      params: {},
      explanation: 'Stop guided demo execution',
    };
  }

  // 3. Navigation Commands
  const navTargets: Record<string, string> = {
    'overview': 'overview',
    'dashboard': 'overview',
    'home': 'overview',
    'main': 'overview',
    'explorer': 'explorer',
    'earth explorer': 'explorer',
    'globe': 'explorer',
    '3d earth': 'explorer',
    'memory': 'memory',
    'earth memory': 'memory',
    'timeline': 'memory',
    'history': 'memory',
    'simulator': 'simulator',
    'what if': 'simulator',
    'what-if': 'simulator',
    'simulation': 'simulator',
    'scenarios': 'scenarios',
    'scenario comparison': 'scenarios',
    'compare scenarios': 'scenarios',
    'forecast': 'forecast',
    'future projections': 'forecast',
    'projections': 'forecast',
    'water': 'water',
    'water intelligence': 'water',
    'climate': 'climate',
    'climate carbon': 'climate',
    'carbon': 'climate',
    'biodiversity': 'biodiversity',
    'canopy': 'biodiversity',
    'wildlife': 'biodiversity',
    'cities': 'cities',
    'city intelligence': 'cities',
    'urban intelligence': 'cities',
    'research': 'research',
    'scientific lab': 'research',
    'lab': 'research',
    'decisions': 'decisions',
    'decision center': 'decisions',
    'trade offs': 'decisions',
    'reports': 'reports',
    'report generator': 'reports',
    'executive reports': 'reports',
    'settings': 'settings',
    'config': 'settings',
    'twin os settings': 'settings',
    'forensics': 'forensics',
    'investigation': 'forensics',
    'autopilot': 'autopilot',
    'earthmind autopilot': 'autopilot',
    'council': 'council',
    'environmental council': 'council',
    'multi-agent council': 'council',
    'future fork': 'future_fork',
    'fork': 'future_fork',
    'compound disaster': 'compound_disaster',
    'compound event': 'compound_disaster',
    'disaster simulator': 'compound_disaster',
    'city twin': 'city_twin',
    '3d city': 'city_twin',
    '3d city twin': 'city_twin',
    'causal graph': 'causal_graph',
    'causality': 'causal_graph',
    'cause and effect': 'causal_graph',
    'satellite scanner': 'satellite_scanner',
    'satellite swipe': 'satellite_scanner',
    'swipe compare': 'satellite_scanner',
    'change scanner': 'satellite_scanner',
    'reproducibility': 'reproducibility',
    'scientific reproducibility': 'reproducibility',
    'reproduce experiment': 'reproducibility',
    'sentinel': 'sentinel',
    'earthmind sentinel': 'sentinel',
    'planet monitor': 'sentinel',
    'anomaly radar': 'sentinel',
    'planet pulse': 'sentinel',
    'battle mode': 'battle_mode',
    'environmental battle': 'battle_mode',
    'battle': 'battle_mode',
    'missions': 'missions',
    'mission mode': 'missions',
    'earthmind missions': 'missions',
  };

  for (const [key, view] of Object.entries(navTargets)) {
    if (
      lower === `open ${key}` ||
      lower === `go to ${key}` ||
      lower === `show ${key}` ||
      lower === `take me to ${key}` ||
      lower === `switch to ${key}` ||
      lower === `navigate to ${key}` ||
      lower === key
    ) {
      return {
        rawText: rawOriginal,
        normalizedText: text,
        intent: 'NAVIGATE',
        confidence: 0.96,
        params: { targetView: view, target: view },
        explanation: `Navigate to ${view.toUpperCase()} view`,
      };
    }
  }

  // 4. Hotspot / Geographic Location Commands
  for (const [alias, spotInfo] of Object.entries(LOCATION_ALIASES)) {
    if (
      lower.includes(`go to ${alias}`) ||
      lower.includes(`open ${alias}`) ||
      lower.includes(`show ${alias}`) ||
      lower.includes(`target ${alias}`) ||
      lower.includes(`fly to ${alias}`) ||
      lower === alias
    ) {
      return {
        rawText: rawOriginal,
        normalizedText: text,
        intent: 'SELECT_LOCATION',
        confidence: 0.94,
        params: { locationId: spotInfo.id, locationName: spotInfo.name, location: alias },
        explanation: `Center Earth view on ${spotInfo.name} (${spotInfo.id})`,
      };
    }
  }

  // 5. Environmental Layers Commands
  if (lower.includes('hide all layers') || lower.includes('turn off all layers') || lower.includes('hide layers')) {
    return {
      rawText: rawOriginal,
      normalizedText: text,
      intent: 'HIDE_LAYERS',
      confidence: 0.95,
      params: {},
      explanation: 'Hide active multispectral overlays',
    };
  }

  for (const [alias, layerType] of Object.entries(LAYER_ALIASES)) {
    if (
      lower.includes(`show ${alias}`) ||
      lower.includes(`${alias} show`) ||
      lower.includes(`open ${alias}`) ||
      lower.includes(`${alias} open`) ||
      lower.includes(`enable ${alias}`) ||
      lower.includes(`turn on ${alias}`) ||
      lower.includes(`${alias} layer`) ||
      lower.includes(`view ${alias}`) ||
      lower.includes(`see ${alias}`) ||
      lower === alias
    ) {
      return {
        rawText: rawOriginal,
        normalizedText: text,
        intent: 'SELECT_LAYER',
        confidence: 0.94,
        params: { layer: layerType },
        explanation: `Activate ${layerType.toUpperCase()} environmental overlay`,
      };
    }
  }

  // 6. Earth Memory & Temporal Year Commands
  const year = extractYear(lower);
  if (year !== null && (lower.includes('year') || lower.includes('go to') || lower.includes('show') || lower.includes('travel to') || lower.includes('epoch') || lower.includes('since'))) {
    return {
      rawText: rawOriginal,
      normalizedText: text,
      intent: 'SELECT_YEAR',
      confidence: 0.95,
      params: { year, targetView: 'memory' },
      explanation: `Set Earth Memory temporal slice to ${year}`,
    };
  }

  if (lower.includes('play timeline') || lower.includes('play the timeline') || lower.includes('play timelapse') || lower.includes('start replay')) {
    return {
      rawText: rawOriginal,
      normalizedText: text,
      intent: 'SELECT_YEAR',
      confidence: 0.92,
      params: { enable: true, targetView: 'memory' },
      explanation: 'Start temporal timelapse playback',
    };
  }

  if (lower.includes('pause timeline') || lower.includes('stop timeline') || lower.includes('pause timelapse')) {
    return {
      rawText: rawOriginal,
      normalizedText: text,
      intent: 'SELECT_YEAR',
      confidence: 0.92,
      params: { enable: false, targetView: 'memory' },
      explanation: 'Pause temporal playback',
    };
  }

  // 7. What-If Simulation Variable Controls
  // E.g. "Increase tree cover by 20 percent", "Set rainfall to 40 percent", "Reduce traffic by 15 percent"
  for (const [varAlias, varInfo] of Object.entries(SIM_VARIABLE_ALIASES)) {
    if (lower.includes(varAlias)) {
      const numInfo = extractNumberAndPercentage(lower);
      if (numInfo.value !== null) {
        let deltaVal = numInfo.value;
        const isDecrease = lower.includes('reduce') || lower.includes('decrease') || lower.includes('lower') || lower.includes('cut') || lower.includes('less');
        if (isDecrease && deltaVal > 0) {
          deltaVal = -deltaVal;
        }

        const varNormalizedName = (varInfo.key as string).replace('Delta', '');
        return {
          rawText: rawOriginal,
          normalizedText: text,
          intent: 'SET_SIMULATION_VARIABLE',
          confidence: 0.94,
          params: {
            variable: varNormalizedName,
            variableKey: varInfo.key,
            variableName: varInfo.label,
            delta: deltaVal,
            value: Math.abs(deltaVal),
            unit: '%',
            targetView: 'simulator',
          },
          explanation: `Adjust ${varInfo.label} by ${deltaVal > 0 ? `+${deltaVal}` : deltaVal}% in What-If simulator`,
        };
      }
    }
  }

  // Simulation execution / reset
  if (lower.includes('run the simulation') || lower.includes('run simulation') || lower.includes('simulate') || lower.includes('execute simulation')) {
    return {
      rawText: rawOriginal,
      normalizedText: text,
      intent: 'RUN_SIMULATION',
      confidence: 0.96,
      params: { targetView: 'simulator' },
      explanation: 'Execute What-If coupled simulation engine',
    };
  }

  if (lower.includes('reset simulation') || lower.includes('reset the simulation') || lower.includes('reset sliders')) {
    return {
      rawText: rawOriginal,
      normalizedText: text,
      intent: 'RESET_SIMULATION',
      confidence: 0.95,
      params: { targetView: 'simulator' },
      explanation: 'Reset simulation parameters to baseline (0%)',
    };
  }

  // Save Scenario
  if (lower.includes('save this scenario') || lower.includes('save scenario') || lower.includes('save policy')) {
    let name = 'Custom Policy';
    const nameMatch = lower.match(/(?:call it|name it|named)\s+([a-zA-Z0-9\s]+)/);
    if (nameMatch) {
      name = nameMatch[1].trim();
    }
    return {
      rawText: rawOriginal,
      normalizedText: text,
      intent: 'SAVE_SCENARIO',
      confidence: 0.91,
      params: { scenarioName: name, targetView: 'simulator' },
      explanation: `Save current simulation as "${name}"`,
    };
  }

  // Compare Scenarios
  if (
    lower.includes('compare with baseline') ||
    lower.includes('compare scenarios') ||
    lower.includes('scenario comparison') ||
    lower.includes('compare green city') ||
    lower.includes('compare presets')
  ) {
    return {
      rawText: rawOriginal,
      normalizedText: text,
      intent: 'COMPARE_SCENARIOS',
      confidence: 0.94,
      params: { targetView: 'scenarios' },
      explanation: 'Open Scenario Comparison Matrix',
    };
  }

  // 8. 3D Earth Controls (Rotation, Atmosphere, Clouds, Night Lights, Zoom)
  if (lower.includes('rotate earth') || lower.includes('start rotation') || lower.includes('spin earth')) {
    return {
      rawText: rawOriginal,
      normalizedText: text,
      intent: 'ROTATE_EARTH',
      confidence: 0.94,
      params: { enable: true },
      explanation: 'Resume 3D Earth auto-rotation',
    };
  }

  if (lower.includes('stop earth rotation') || lower.includes('pause rotation') || lower.includes('stop rotation') || lower.includes('pause earth')) {
    return {
      rawText: rawOriginal,
      normalizedText: text,
      intent: 'STOP_ROTATE_EARTH',
      confidence: 0.94,
      params: { enable: false },
      explanation: 'Pause 3D Earth rotation',
    };
  }

  if (lower.includes('reset earth') || lower.includes('reset camera') || lower.includes('reset view')) {
    return {
      rawText: rawOriginal,
      normalizedText: text,
      intent: 'RESET_EARTH',
      confidence: 0.93,
      params: {},
      explanation: 'Reset Earth camera position and orientation',
    };
  }

  if (lower.includes('zoom in')) {
    return {
      rawText: rawOriginal,
      normalizedText: text,
      intent: 'ZOOM_EARTH',
      confidence: 0.92,
      params: { zoomDirection: 'in' },
      explanation: 'Zoom in on 3D Earth',
    };
  }

  if (lower.includes('zoom out')) {
    return {
      rawText: rawOriginal,
      normalizedText: text,
      intent: 'ZOOM_EARTH',
      confidence: 0.92,
      params: { zoomDirection: 'out' },
      explanation: 'Zoom out on 3D Earth',
    };
  }

  if (lower.includes('show atmosphere') || lower.includes('turn on atmosphere')) {
    return {
      rawText: rawOriginal,
      normalizedText: text,
      intent: 'TOGGLE_ATMOSPHERE',
      confidence: 0.92,
      params: { enable: true },
      explanation: 'Enable atmospheric rim scattering',
    };
  }

  if (lower.includes('hide atmosphere') || lower.includes('turn off atmosphere')) {
    return {
      rawText: rawOriginal,
      normalizedText: text,
      intent: 'TOGGLE_ATMOSPHERE',
      confidence: 0.92,
      params: { enable: false },
      explanation: 'Disable atmospheric scattering',
    };
  }

  if (lower.includes('show clouds') || lower.includes('turn on clouds')) {
    return {
      rawText: rawOriginal,
      normalizedText: text,
      intent: 'TOGGLE_CLOUDS',
      confidence: 0.92,
      params: { enable: true },
      explanation: 'Enable cloud drift layer',
    };
  }

  if (lower.includes('hide clouds') || lower.includes('turn off clouds')) {
    return {
      rawText: rawOriginal,
      normalizedText: text,
      intent: 'TOGGLE_CLOUDS',
      confidence: 0.92,
      params: { enable: false },
      explanation: 'Disable clouds layer',
    };
  }

  if (lower.includes('show night lights') || lower.includes('turn on night lights') || lower.includes('show city lights')) {
    return {
      rawText: rawOriginal,
      normalizedText: text,
      intent: 'TOGGLE_NIGHT_LIGHTS',
      confidence: 0.92,
      params: { enable: true },
      explanation: 'Enable nocturnal city lights illumination',
    };
  }

  if (lower.includes('hide night lights') || lower.includes('turn off night lights')) {
    return {
      rawText: rawOriginal,
      normalizedText: text,
      intent: 'TOGGLE_NIGHT_LIGHTS',
      confidence: 0.92,
      params: { enable: false },
      explanation: 'Disable night lights layer',
    };
  }

  // 9. Reports Commands
  if (lower.includes('generate report') || lower.includes('generate a report') || lower.includes('create report')) {
    return {
      rawText: rawOriginal,
      normalizedText: text,
      intent: 'GENERATE_REPORT',
      confidence: 0.95,
      params: { targetView: 'reports' },
      explanation: 'Initiate Environmental Intelligence Report dossier generation',
    };
  }

  if (lower.includes('export report') || lower.includes('download report') || lower.includes('export pdf')) {
    return {
      rawText: rawOriginal,
      normalizedText: text,
      intent: 'EXPORT_REPORT',
      confidence: 0.92,
      params: {
        targetView: 'reports',
        requiresConfirmation: true,
        confirmationPrompt: 'Export executive PDF report to file?',
      },
      explanation: 'Export environmental dossier to PDF',
    };
  }

  // 10. Destructive Commands requiring confirmation
  if (lower.includes('reset everything') || lower.includes('clear all') || lower.includes('reset platform')) {
    return {
      rawText: rawOriginal,
      normalizedText: text,
      intent: 'RESET_SIMULATION',
      confidence: 0.88,
      params: {
        requiresConfirmation: true,
        confirmationPrompt: 'Are you sure you want to reset all simulation and twin parameters to default?',
      },
      explanation: 'Reset platform state to baseline defaults',
    };
  }

  // 11. Conversational questions fallback to AI Assistant
  if (
    lower.startsWith('what ') ||
    lower.startsWith('why ') ||
    lower.startsWith('how ') ||
    lower.startsWith('explain ') ||
    lower.startsWith('tell me ') ||
    lower.includes('changed here') ||
    lower.includes('what happened')
  ) {
    return {
      rawText: rawOriginal,
      normalizedText: text,
      intent: 'ASK_AI',
      confidence: 0.88,
      params: { question: rawOriginal },
      explanation: `Forward scientific inquiry to EARTHMIND AI: "${rawOriginal}"`,
    };
  }

  // Fallback Unknown
  return {
    rawText: rawOriginal,
    normalizedText: text,
    intent: 'UNKNOWN',
    confidence: 0.25,
    params: { question: rawOriginal },
    explanation: `Could not determine exact command for "${rawOriginal}"`,
  };
}
