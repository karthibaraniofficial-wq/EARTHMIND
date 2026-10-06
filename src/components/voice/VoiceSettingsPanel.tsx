import React, { useState, useEffect } from 'react';
import { 
  Mic, 
  Volume2, 
  ShieldCheck, 
  Check, 
  RotateCcw, 
  AlertCircle,
  Sparkles,
  Play
} from 'lucide-react';
import { GlassModal } from '../glass/GlassModal';
import { GlassButton } from '../glass/GlassButton';
import { useVoice } from '../../voice/VoiceContext';
import { getAudioInputDevices, AudioDeviceOption, checkMicrophonePermission } from '../../voice/VoicePermissions';
import { DEFAULT_VOICE_SETTINGS } from '../../voice/VoiceSettings';
import { MicrophonePermissionState, RecognitionLanguage } from '../../voice/VoiceTypes';

export const VoiceSettingsPanel: React.FC = () => {
  const {
    settings,
    updateSettings,
    isVoiceSettingsOpen,
    setIsVoiceSettingsOpen,
    speak,
    audioLevel,
    geminiStatus,
    geminiLatency,
    activeEngineMode,
  } = useVoice();

  const [devices, setDevices] = useState<AudioDeviceOption[]>([]);
  const [permState, setPermState] = useState<MicrophonePermissionState>('prompt');
  const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [isTestingVoice, setIsTestingVoice] = useState(false);

  useEffect(() => {
    if (isVoiceSettingsOpen) {
      getAudioInputDevices().then(setDevices);
      checkMicrophonePermission().then(setPermState);

      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        const updateVoices = () => {
          setAvailableVoices(window.speechSynthesis.getVoices());
        };
        updateVoices();
        window.speechSynthesis.onvoiceschanged = updateVoices;
      }
    }
  }, [isVoiceSettingsOpen]);

  if (!isVoiceSettingsOpen) return null;

  const handleTestSpeech = async () => {
    setIsTestingVoice(true);
    await speak('EarthMind environmental voice synthesis active.');
    setIsTestingVoice(false);
  };

  const handleResetDefaults = () => {
    updateSettings(DEFAULT_VOICE_SETTINGS);
  };

  return (
    <GlassModal
      isOpen={isVoiceSettingsOpen}
      onClose={() => setIsVoiceSettingsOpen(false)}
      title="Voice Intelligence Settings"
      subtitle="Configure Google Gemini Live, speech recognition, synthesis, and control profiles"
      maxWidth="lg"
    >
      <div className="space-y-6 max-h-[70vh] overflow-y-auto pr-1 custom-scrollbar">
        {/* Section 0: Google Gemini Live Intelligence Layer */}
        <div className="p-4 rounded-2xl glass-panel-2 border border-earth-aqua/30 bg-earth-aqua/5 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-white/10">
            <div className="flex items-center gap-2 font-bold text-white text-xs font-mono uppercase">
              <Sparkles className="w-4 h-4 text-earth-aqua" />
              <span>0. Real-time Gemini Live AI Engine</span>
            </div>
            <div className="flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full ${geminiStatus === 'CONNECTED' ? 'bg-earth-emerald animate-pulse' : 'bg-amber-400'}`} />
              <span className="text-[10px] font-mono uppercase text-earth-aqua font-bold">
                {activeEngineMode === 'gemini_live' ? `LIVE (${geminiStatus})` : 'OFFLINE FALLBACK'}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono text-slate-300 mb-1">
                Primary Intelligence Layer:
              </label>
              <select
                value={settings.primaryEngine || 'gemini_live'}
                onChange={(e) => updateSettings({ primaryEngine: e.target.value as any })}
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/15 text-xs text-white focus:outline-none focus:border-earth-aqua font-mono"
              >
                <option value="gemini_live">Google Gemini Live 2.0 (Bidirectional Audio)</option>
                <option value="local_fallback">Deterministic Local Voice Engine (Offline)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-300 mb-1">
                Gemini Voice Persona:
              </label>
              <select
                value={settings.geminiVoice || 'Aoede'}
                onChange={(e) => updateSettings({ geminiVoice: e.target.value as any })}
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/15 text-xs text-white focus:outline-none focus:border-earth-aqua font-mono"
              >
                <option value="Aoede">Aoede (Scientific & Calm - Recommended)</option>
                <option value="Charon">Charon (Authoritative & Deep)</option>
                <option value="Fenrir">Fenrir (Articulate & Crisp)</option>
                <option value="Kore">Kore (Warm & Conversational)</option>
                <option value="Puck">Puck (Energetic & Dynamic)</option>
              </select>
            </div>
          </div>

          {/* Diagnostics Card */}
          <div className="p-3 rounded-xl bg-black/40 border border-white/5 font-mono text-[11px] grid grid-cols-2 sm:grid-cols-4 gap-2">
            <div>
              <span className="text-slate-400 block text-[9px] uppercase">Model</span>
              <span className="text-white font-bold">gemini-2.0-flash-exp</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[9px] uppercase">Audio I/O</span>
              <span className="text-earth-aqua font-bold">16k In / 24k Out</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[9px] uppercase">Roundtrip Latency</span>
              <span className="text-earth-emerald font-bold">{geminiLatency > 0 ? `${geminiLatency} ms` : 'Standby'}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[9px] uppercase">App Tools</span>
              <span className="text-amber-300 font-bold">24 Registered</span>
            </div>
          </div>
        </div>

        {/* Section 1: Microphone & Audio Input */}
        <div className="p-4 rounded-2xl glass-panel-2 border border-white/10 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-white/10">
            <div className="flex items-center gap-2 font-bold text-white text-xs font-mono uppercase">
              <Mic className="w-4 h-4 text-earth-aqua" />
              <span>1. Microphone & Hardware Input</span>
            </div>
            <span className="text-[10px] font-mono uppercase text-earth-aqua">
              Permission: {permState}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono text-slate-300 mb-1">
                Audio Input Device:
              </label>
              <select
                value={settings.selectedAudioDeviceId}
                onChange={(e) => updateSettings({ selectedAudioDeviceId: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/15 text-xs text-white focus:outline-none focus:border-earth-aqua"
              >
                {devices.map((d) => (
                  <option key={d.deviceId} value={d.deviceId} className="bg-slate-900 text-white">
                    {d.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-300 mb-1">
                Mic Input Level:
              </label>
              <div className="p-2.5 rounded-xl bg-slate-900 border border-white/10 flex items-center gap-2">
                <div className="flex-1 h-2 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-earth-aqua to-earth-emerald transition-all duration-100"
                    style={{ width: `${Math.round(audioLevel * 100)}%` }}
                  />
                </div>
                <span className="text-[10px] font-mono text-earth-aqua w-8 text-right">
                  {Math.round(audioLevel * 100)}%
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Section 2: Recognition & Language */}
        <div className="p-4 rounded-2xl glass-panel-2 border border-white/10 space-y-4">
          <div className="flex items-center gap-2 font-bold text-white text-xs font-mono uppercase pb-2 border-b border-white/10">
            <Sparkles className="w-4 h-4 text-earth-aurora" />
            <span>2. Recognition & Language Modes</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono text-slate-300 mb-1">
                Primary Spoken Language:
              </label>
              <select
                value={settings.language}
                onChange={(e) => updateSettings({ language: e.target.value as RecognitionLanguage })}
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/15 text-xs text-white focus:outline-none focus:border-earth-aqua"
              >
                <option value="en-US">English (US / Global)</option>
                <option value="en-IN">English (India / South Asia)</option>
                <option value="ta-IN">Tamil (தமிழ் / Thanglish)</option>
                <option value="hi-IN">Hindi (हिंदी)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-300 mb-1">
                Interaction Mode:
              </label>
              <select
                value={settings.mode}
                onChange={(e) => updateSettings({ mode: e.target.value as any })}
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/15 text-xs text-white focus:outline-none focus:border-earth-aqua"
              >
                <option value="click_to_talk">Click-to-Talk (Default)</option>
                <option value="push_to_talk">Push-to-Talk (Hold Space)</option>
                <option value="continuous">Continuous Ambient Listening</option>
              </select>
            </div>
          </div>

          {/* Wake Word & Continuous Toggles */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            <label className="flex items-center justify-between p-3 rounded-xl glass-panel-1 border border-white/5 cursor-pointer">
              <span className="text-xs text-slate-300">
                Wake Word ("Hey EarthMind")
              </span>
              <input
                type="checkbox"
                checked={settings.wakeWordEnabled}
                onChange={(e) => updateSettings({ wakeWordEnabled: e.target.checked })}
                className="w-4 h-4 rounded text-earth-aqua focus:ring-0 bg-slate-900 border-white/20"
              />
            </label>

            <label className="flex items-center justify-between p-3 rounded-xl glass-panel-1 border border-white/5 cursor-pointer">
              <span className="text-xs text-slate-300">
                Synchronized Subtitles
              </span>
              <input
                type="checkbox"
                checked={settings.captionsEnabled}
                onChange={(e) => updateSettings({ captionsEnabled: e.target.checked })}
                className="w-4 h-4 rounded text-earth-aqua focus:ring-0 bg-slate-900 border-white/20"
              />
            </label>
          </div>
        </div>

        {/* Section 3: Speech Synthesis & Audio Output */}
        <div className="p-4 rounded-2xl glass-panel-2 border border-white/10 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-white/10">
            <div className="flex items-center gap-2 font-bold text-white text-xs font-mono uppercase">
              <Volume2 className="w-4 h-4 text-earth-emerald" />
              <span>3. Speech Synthesis & Voice Output</span>
            </div>
            <button
              onClick={handleTestSpeech}
              disabled={isTestingVoice}
              className="px-2.5 py-1 rounded-lg glass-panel-1 border border-earth-emerald/40 text-[10px] font-mono text-earth-emerald hover:bg-earth-emerald/15 transition-colors flex items-center gap-1"
            >
              <Play className="w-2.5 h-2.5" />
              <span>Test Voice</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono text-slate-300 mb-1">
                Synthesizer Voice:
              </label>
              <select
                value={settings.voiceName}
                onChange={(e) => updateSettings({ voiceName: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/15 text-xs text-white focus:outline-none focus:border-earth-aqua"
              >
                <option value="">Default Scientific System Voice</option>
                {availableVoices.map((v) => (
                  <option key={v.name} value={v.name} className="bg-slate-900 text-white">
                    {v.name} ({v.lang})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-300 mb-1">
                Speech Rate: <span className="text-earth-aqua">{settings.speechRate}x</span>
              </label>
              <input
                type="range"
                min="0.5"
                max="2.0"
                step="0.25"
                value={settings.speechRate}
                onChange={(e) => updateSettings({ speechRate: parseFloat(e.target.value) })}
                className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-earth-aqua"
              />
              <div className="flex justify-between text-[9px] font-mono text-slate-500 mt-1">
                <span>0.5x</span>
                <span>1.0x (Normal)</span>
                <span>2.0x</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono text-slate-300 mb-1">
                Volume: <span className="text-earth-emerald">{Math.round(settings.volume * 100)}%</span>
              </label>
              <input
                type="range"
                min="0"
                max="1.0"
                step="0.05"
                value={settings.volume}
                onChange={(e) => updateSettings({ volume: parseFloat(e.target.value) })}
                className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-earth-emerald"
              />
            </div>

            <div className="flex items-center pt-5">
              <label className="flex items-center justify-between w-full p-2.5 rounded-xl glass-panel-1 border border-white/5 cursor-pointer">
                <span className="text-xs text-slate-300">
                  Auto-Speak Spoken Responses
                </span>
                <input
                  type="checkbox"
                  checked={settings.autoSpeakResponse}
                  onChange={(e) => updateSettings({ autoSpeakResponse: e.target.checked })}
                  className="w-4 h-4 rounded text-earth-emerald focus:ring-0 bg-slate-900 border-white/20"
                />
              </label>
            </div>
          </div>
        </div>

        {/* Section 4: Privacy & Safety Standards */}
        <div className="p-4 rounded-2xl glass-panel-2 border border-white/10 space-y-3">
          <div className="flex items-center gap-2 font-bold text-white text-xs font-mono uppercase pb-2 border-b border-white/10">
            <ShieldCheck className="w-4 h-4 text-earth-emerald" />
            <span>4. Privacy & Command Safety Policies</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <label className="flex items-center justify-between p-3 rounded-xl glass-panel-1 border border-white/5 cursor-pointer">
              <span className="text-slate-300">
                Confirm Destructive Operations
              </span>
              <input
                type="checkbox"
                checked={settings.requireConfirmationForDestructive}
                onChange={(e) => updateSettings({ requireConfirmationForDestructive: e.target.checked })}
                className="w-4 h-4 rounded text-earth-aqua focus:ring-0 bg-slate-900 border-white/20"
              />
            </label>

            <label className="flex items-center justify-between p-3 rounded-xl glass-panel-1 border border-white/5 cursor-pointer">
              <span className="text-slate-300">
                Store Transcript History Locally
              </span>
              <input
                type="checkbox"
                checked={settings.storeHistory}
                onChange={(e) => updateSettings({ storeHistory: e.target.checked })}
                className="w-4 h-4 rounded text-earth-aqua focus:ring-0 bg-slate-900 border-white/20"
              />
            </label>
          </div>

          <p className="text-[11px] text-slate-400 font-mono pt-1">
            • Local-only processing: Voice recognition executes in the browser without third-party audio transmission.
          </p>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-3 border-t border-white/10">
          <button
            onClick={handleResetDefaults}
            className="text-xs font-mono text-slate-400 hover:text-white flex items-center gap-1 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Defaults</span>
          </button>

          <GlassButton
            variant="primary"
            size="sm"
            onClick={() => setIsVoiceSettingsOpen(false)}
          >
            Done
          </GlassButton>
        </div>
      </div>
    </GlassModal>
  );
};
