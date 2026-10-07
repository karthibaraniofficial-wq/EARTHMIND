/**
 * EARTHMIND - Centralized AI Model Governance
 * Multi-layer voice & scientific research intelligence models.
 * Zero hardcoded model strings across application code.
 */

declare const process: any;

export const DEFAULT_GEMINI_LIVE_MODEL = 'gemini-3.8-live';
export const DEFAULT_GEMINI_RESEARCH_MODEL = 'gemini-3.8-flash';

/**
 * Resolves the configured Gemini Live model for bidirectional streaming audio.
 */
export function getGeminiLiveModel(): string {
  try {
    const envVal = (import.meta as any)?.env?.VITE_GEMINI_LIVE_MODEL;
    if (typeof envVal === 'string' && envVal.trim().length > 0) {
      return envVal.trim();
    }
  } catch {
    // SSR or script environment fallback
  }
  if (typeof process !== 'undefined' && process.env?.GEMINI_LIVE_MODEL) {
    return process.env.GEMINI_LIVE_MODEL.trim();
  }
  return DEFAULT_GEMINI_LIVE_MODEL;
}

/**
 * Resolves the configured Gemini Research model for deep research, source comparison, and search grounding.
 */
export function getGeminiResearchModel(): string {
  try {
    const envVal = (import.meta as any)?.env?.VITE_GEMINI_RESEARCH_MODEL;
    if (typeof envVal === 'string' && envVal.trim().length > 0) {
      return envVal.trim();
    }
  } catch {
    // SSR or script environment fallback
  }
  if (typeof process !== 'undefined' && process.env?.GEMINI_RESEARCH_MODEL) {
    return process.env.GEMINI_RESEARCH_MODEL.trim();
  }
  return DEFAULT_GEMINI_RESEARCH_MODEL;
}

export interface ModelCapabilityDescriptor {
  id: string;
  role: 'live_voice' | 'deep_research';
  displayName: string;
  description: string;
  inputModalities: string[];
  outputModalities: string[];
  supportsGrounding: boolean;
  supportsBidiAudio: boolean;
  supportsFunctionCalling: boolean;
  latencyTier: 'ultra_low' | 'balanced';
}

export const MODEL_REGISTRY: Record<string, ModelCapabilityDescriptor> = {
  [DEFAULT_GEMINI_LIVE_MODEL]: {
    id: DEFAULT_GEMINI_LIVE_MODEL,
    role: 'live_voice',
    displayName: 'Gemini 3.8 Live',
    description: 'Ultra-low latency bidirectional audio streaming, native voice synthesis, and real-time tool orchestration.',
    inputModalities: ['AUDIO', 'TEXT'],
    outputModalities: ['AUDIO', 'TEXT'],
    supportsGrounding: false,
    supportsBidiAudio: true,
    supportsFunctionCalling: true,
    latencyTier: 'ultra_low',
  },
  [DEFAULT_GEMINI_RESEARCH_MODEL]: {
    id: DEFAULT_GEMINI_RESEARCH_MODEL,
    role: 'deep_research',
    displayName: 'Gemini 3.8 Flash Research',
    description: 'Live Google Search grounding, multi-source evidence extraction, scientific causal reasoning, and URL intelligence.',
    inputModalities: ['TEXT', 'IMAGE', 'DOCUMENT'],
    outputModalities: ['TEXT', 'JSON'],
    supportsGrounding: true,
    supportsBidiAudio: false,
    supportsFunctionCalling: true,
    latencyTier: 'balanced',
  },
};
