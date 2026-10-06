import { VoiceSettingsConfig } from './VoiceTypes';

export const DEFAULT_VOICE_SETTINGS: VoiceSettingsConfig = {
  enabled: true,
  mode: 'click_to_talk',
  language: 'en-US',
  wakeWordEnabled: false,
  wakePhrase: 'hey earthmind',
  continuousListening: false,
  pushToTalkKey: 'Space',
  autoSpeakResponse: true,
  voiceName: '',
  speechRate: 1.0,
  volume: 0.85,
  pitch: 1.0,
  captionsEnabled: true,
  localOnlyMode: true,
  storeAudio: false,
  storeHistory: true,
  requireConfirmationForDestructive: true,
  confidenceThreshold: 0.6,
  selectedAudioDeviceId: 'default',
  primaryEngine: 'gemini_live',
  geminiVoice: 'Aoede',
  bargeInEnabled: true,
};

const STORAGE_KEY = 'earthmind_voice_settings_v1';

export function loadVoiceSettings(): VoiceSettingsConfig {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return { ...DEFAULT_VOICE_SETTINGS, ...parsed };
    }
  } catch (e) {
    console.warn('[EARTHMIND VOICE] Failed to load voice settings, using defaults', e);
  }
  return DEFAULT_VOICE_SETTINGS;
}

export function saveVoiceSettings(settings: VoiceSettingsConfig): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  } catch (e) {
    console.warn('[EARTHMIND VOICE] Failed to persist voice settings', e);
  }
}
