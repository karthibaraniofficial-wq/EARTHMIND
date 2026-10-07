import { LayerType, SimulationParameters } from '../types';

export type VoiceState =
  | 'IDLE'
  | 'REQUESTING_PERMISSION'
  | 'LISTENING'
  | 'PROCESSING'
  | 'UNDERSTANDING'
  | 'EXECUTING'
  | 'SPEAKING'
  | 'PAUSED'
  | 'INTERRUPTED'
  | 'ERROR'
  | 'DISABLED';

export type VoiceMode = 'click_to_talk' | 'push_to_talk' | 'continuous';

export type RecognitionLanguage = 'en-US' | 'en-IN' | 'ta-IN' | 'hi-IN';

export type MicrophonePermissionState = 'prompt' | 'granted' | 'denied' | 'blocked' | 'unavailable';

export interface VoiceCapabilities {
  speechRecognition: boolean;
  speechSynthesis: boolean;
  webAudio: boolean;
  streaming: boolean;
  interruption: boolean;
  wakeWordAvailable: boolean;
}

export type VoiceIntentType =
  | 'NAVIGATE'
  | 'SELECT_LOCATION'
  | 'SELECT_YEAR'
  | 'SELECT_LAYER'
  | 'HIDE_LAYERS'
  | 'SET_SIMULATION_VARIABLE'
  | 'RUN_SIMULATION'
  | 'RESET_SIMULATION'
  | 'SAVE_SCENARIO'
  | 'COMPARE_SCENARIOS'
  | 'OPEN_REPORT'
  | 'GENERATE_REPORT'
  | 'EXPORT_REPORT'
  | 'START_DEMO'
  | 'STOP_DEMO'
  | 'OPEN_EXHIBITION'
  | 'CLOSE_EXHIBITION'
  | 'EXHIBITION_NEXT'
  | 'EXHIBITION_PREV'
  | 'EXHIBITION_EXPLAIN'
  | 'OPEN_SETTINGS'
  | 'ASK_AI'
  | 'ROTATE_EARTH'
  | 'STOP_ROTATE_EARTH'
  | 'RESET_EARTH'
  | 'ZOOM_EARTH'
  | 'TOGGLE_CLOUDS'
  | 'TOGGLE_ATMOSPHERE'
  | 'TOGGLE_NIGHT_LIGHTS'
  | 'TOGGLE_GRID'
  | 'SET_VOLUME'
  | 'SET_SPEECH_SPEED'
  | 'SET_EXPLANATION_LEVEL'
  | 'STOP_SPEAKING'
  | 'HELLO'
  | 'CHANGE_LANGUAGE'
  | 'EXPLAIN_SCREEN'
  | 'EXPLAIN_CHART'
  | 'RESEARCH_WEB'
  | 'RESEARCH_URL'
  | 'FACT_CHECK'
  | 'CALCULATE'
  | 'EXHIBITION_INFO'
  | 'COMPARE_SOURCES'
  | 'COMPOUND'
  | 'UNKNOWN';

export interface ParsedVoiceCommand {
  rawText: string;
  normalizedText: string;
  intent: VoiceIntentType;
  confidence: number; // 0.0 - 1.0
  params: {
    targetView?: string;
    target?: string;
    locationId?: string;
    locationName?: string;
    location?: string;
    year?: number;
    yearA?: number;
    yearB?: number;
    layer?: LayerType;
    variable?: keyof SimulationParameters | string;
    variableKey?: keyof SimulationParameters;
    variableName?: string;
    value?: number;
    delta?: number;
    unit?: string;
    scenarioName?: string;
    zoomDirection?: 'in' | 'out';
    enable?: boolean;
    speechRate?: number;
    volume?: number;
    level?: number;
    levelName?: string;
    topic?: string;
    subType?: string;
    language?: RecognitionLanguage;
    question?: string;
    url?: string;
    claim?: string;
    calculationExpr?: string;
    query?: string;
    requiresConfirmation?: boolean;
    confirmationPrompt?: string;
    actions?: ParsedVoiceCommand[];
  };
  explanation: string;
  subCommands?: ParsedVoiceCommand[];
}

export interface VoiceHistoryItem {
  id: string;
  timestamp: string;
  userTranscript: string;
  recognizedIntent: VoiceIntentType;
  confidence: number;
  earthMindResponse: string;
  executionResult: 'SUCCESS' | 'FAILED' | 'CONFIRMATION_REQUIRED' | 'CANCELLED';
  executionDetails?: string;
}

export interface VoiceSettingsConfig {
  enabled: boolean;
  mode: VoiceMode;
  language: RecognitionLanguage;
  wakeWordEnabled: boolean;
  wakePhrase: string;
  continuousListening: boolean;
  pushToTalkKey: string;
  autoSpeakResponse: boolean;
  voiceName: string;
  speechRate: number; // 0.5 - 2.0
  volume: number; // 0 - 1.0
  pitch: number; // 0.5 - 1.5
  captionsEnabled: boolean;
  localOnlyMode: boolean;
  storeAudio: boolean;
  storeHistory: boolean;
  requireConfirmationForDestructive: boolean;
  confidenceThreshold: number; // default 0.6
  selectedAudioDeviceId: string;
  primaryEngine?: 'gemini_live' | 'local_fallback';
  geminiVoice?: 'Aoede' | 'Charon' | 'Fenrir' | 'Kore' | 'Puck';
  bargeInEnabled?: boolean;
}

export interface VoiceProvider {
  id: string;
  name: string;
  capabilities: VoiceCapabilities;
  startListening: (options: { language: string; continuous: boolean; onInterim?: (text: string) => void }) => Promise<void>;
  stopListening: () => Promise<void>;
  speak: (text: string, options?: { rate?: number; pitch?: number; volume?: number; voiceName?: string; onEnd?: () => void }) => Promise<void>;
  stopSpeaking: () => void;
  pauseSpeaking: () => void;
  resumeSpeaking: () => void;
}
