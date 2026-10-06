import React, { useState, useEffect } from 'react';
import { 
  Mic, 
  MicOff, 
  Volume2, 
  Sparkles, 
  Settings, 
  RotateCcw, 
  Trash2, 
  Download, 
  Play, 
  X, 
  Flame, 
  Droplets, 
  Sliders, 
  History,
  Terminal
} from 'lucide-react';
import { GlassCard } from '../glass/GlassCard';
import { GlassButton } from '../glass/GlassButton';
import { GlassBadge } from '../glass/GlassBadge';
import { useVoice } from '../../voice/VoiceContext';
import { VoiceWaveform } from './VoiceWaveform';
import { getVoiceHistory, clearVoiceHistory, exportVoiceHistoryJson } from '../../voice/VoiceHistory';
import { VoiceHistoryItem } from '../../voice/VoiceTypes';

export const VoicePanel: React.FC = () => {
  const {
    state,
    isListening,
    isSpeaking,
    audioLevel,
    liveTranscript,
    lastCommand,
    lastResponse,
    settings,
    updateSettings,
    startListening,
    stopListening,
    toggleListening,
    speak,
    stopSpeaking,
    processTextInputCommand,
    isVoicePanelOpen,
    setIsVoicePanelOpen,
    toggleVoiceSettings,
    toggleTestConsole,
    geminiStatus,
    geminiLatency,
    activeEngineMode,
  } = useVoice();

  const [simInput, setSimInput] = useState('');
  const [historyItems, setHistoryItems] = useState<VoiceHistoryItem[]>([]);
  const [activeTab, setActiveTab] = useState<'control' | 'history' | 'diagnostics'>('control');

  useEffect(() => {
    if (isVoicePanelOpen) {
      setHistoryItems(getVoiceHistory());
    }
  }, [isVoicePanelOpen, state, lastCommand]);

  if (!isVoicePanelOpen) return null;

  const handleSimSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!simInput.trim()) return;
    processTextInputCommand(simInput.trim());
    setSimInput('');
  };

  const handleClearHistory = () => {
    clearVoiceHistory();
    setHistoryItems([]);
  };

  const handleExportHistory = () => {
    const json = exportVoiceHistoryJson();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `earthmind_voice_history_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const renderMeterBars = () => {
    const pct = Math.round(audioLevel * 100);
    const totalBars = 12;
    const activeBars = Math.round((pct / 100) * totalBars);
    let str = '';
    for (let i = 0; i < totalBars; i++) {
      str += i < activeBars ? '█' : '░';
    }
    return `${str} ${pct}%`;
  };

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full sm:w-96 p-4 flex flex-col justify-end pointer-events-none">
      <div className="pointer-events-auto">
        <GlassCard
          variant="strong"
          glow="aqua"
          className="w-full max-h-[85vh] flex flex-col border border-white/20 shadow-2xl backdrop-blur-2xl overflow-hidden"
        >
          {/* Header */}
          <div className="p-4 border-b border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-earth-aqua/20 border border-earth-aqua/40 flex items-center justify-center">
                <Mic className="w-4 h-4 text-earth-aqua" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold font-mono tracking-wider text-white">
                    EARTHMIND VOICE
                  </span>
                  <GlassBadge tone={activeEngineMode === 'gemini_live' ? 'aqua' : 'neutral'} size="sm">
                    {activeEngineMode === 'gemini_live' ? 'GEMINI LIVE' : 'LOCAL SAFE'}
                  </GlassBadge>
                </div>
                <div className="text-[10px] text-slate-400 font-mono">
                  INTELLIGENCE CONTROL CENTER
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={toggleTestConsole}
                className="p-1.5 rounded-lg text-slate-400 hover:text-earth-aurora hover:bg-white/5 transition-colors"
                title="Developer Voice Test Console"
              >
                <Terminal className="w-4 h-4" />
              </button>
              <button
                onClick={toggleVoiceSettings}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
                title="Voice Settings"
              >
                <Settings className="w-4 h-4" />
              </button>
              <button
                onClick={() => setIsVoicePanelOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Subheader Tabs */}
          <div className="flex items-center border-b border-white/10 px-3 bg-white/5 text-xs font-mono">
            <button
              onClick={() => setActiveTab('control')}
              className={`px-3 py-2 border-b-2 font-medium transition-all ${
                activeTab === 'control'
                  ? 'border-earth-aqua text-earth-aqua font-bold'
                  : 'border-transparent text-slate-400 hover:text-white'
              }`}
            >
              Live Control
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`px-3 py-2 border-b-2 font-medium transition-all flex items-center gap-1.5 ${
                activeTab === 'history'
                  ? 'border-earth-aurora text-earth-aurora font-bold'
                  : 'border-transparent text-slate-400 hover:text-white'
              }`}
            >
              <span>History</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-white/10">
                {historyItems.length}
              </span>
            </button>
            <button
              onClick={() => setActiveTab('diagnostics')}
              className={`px-3 py-2 border-b-2 font-medium transition-all ${
                activeTab === 'diagnostics'
                  ? 'border-earth-emerald text-earth-emerald font-bold'
                  : 'border-transparent text-slate-400 hover:text-white'
              }`}
            >
              Diagnostics
            </button>
          </div>

          {/* Body Content */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
            {activeTab === 'control' ? (
              <>
                {/* Status & Audio Waveform Banner */}
                <div className="p-4 rounded-2xl glass-panel-2 border border-white/10 text-center space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400">
                      SYSTEM STATUS
                    </span>
                    <GlassBadge
                      tone={
                        isListening
                          ? 'aqua'
                          : isSpeaking
                          ? 'emerald'
                          : state === 'PROCESSING' || state === 'UNDERSTANDING'
                          ? 'aurora'
                          : state === 'ERROR'
                          ? 'coral'
                          : 'neutral'
                      }
                      size="sm"
                      pulse={isListening || isSpeaking}
                    >
                      {state}
                    </GlassBadge>
                  </div>

                  {/* Waveform Canvas */}
                  <div className="flex justify-center py-2">
                    <VoiceWaveform state={state} audioLevel={audioLevel} width={280} height={46} />
                  </div>

                  {/* Live Mic Level Readout */}
                  <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 pt-1 border-t border-white/10">
                    <span>MIC INPUT:</span>
                    <span className="text-earth-aqua font-bold">{renderMeterBars()}</span>
                  </div>
                </div>

                {/* Main Microphone Button */}
                <div className="flex items-center justify-center py-1">
                  <button
                    onClick={toggleListening}
                    className={`w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300 transform active:scale-90 ${
                      isListening
                        ? 'bg-gradient-to-r from-earth-aqua to-earth-sky shadow-[0_0_30px_rgba(24,200,200,0.5)] text-[#071A2B]'
                        : 'glass-panel-2 border border-white/20 text-white hover:border-earth-aqua/50 hover:shadow-[0_0_20px_rgba(24,200,200,0.3)]'
                    }`}
                  >
                    {isListening ? (
                      <Mic className="w-8 h-8 animate-pulse" />
                    ) : (
                      <Mic className="w-7 h-7 text-earth-aqua" />
                    )}
                  </button>
                </div>

                {/* Transcript readouts */}
                {liveTranscript && (
                  <div className="p-3 rounded-xl bg-earth-aqua/10 border border-earth-aqua/30 text-xs text-white">
                    <span className="text-[10px] font-mono text-earth-aqua uppercase block mb-0.5">
                      Live Speech Transcript:
                    </span>
                    "{liveTranscript}"
                  </div>
                )}

                {lastResponse && !liveTranscript && (
                  <div className="p-3 rounded-xl bg-earth-emerald/10 border border-earth-emerald/30 text-xs text-white">
                    <span className="text-[10px] font-mono text-earth-emerald uppercase block mb-0.5">
                      EarthMind Response:
                    </span>
                    "{lastResponse}"
                  </div>
                )}

                {/* Quick Simulated Command Input */}
                <div>
                  <div className="text-[10px] font-mono uppercase tracking-wider text-slate-400 mb-1.5">
                    Type Command or Question:
                  </div>
                  <form onSubmit={handleSimSubmit} className="flex items-center gap-2">
                    <input
                      type="text"
                      value={simInput}
                      onChange={(e) => setSimInput(e.target.value)}
                      placeholder='e.g. "Increase tree cover by 20%"'
                      className="flex-1 px-3 py-2 rounded-xl bg-slate-900 border border-white/15 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-earth-aqua font-mono"
                    />
                    <GlassButton type="submit" variant="primary" size="sm">
                      Send
                    </GlassButton>
                  </form>
                </div>

                {/* Quick Preset Prompts */}
                <div>
                  <div className="text-[10px] font-mono uppercase tracking-wider text-slate-400 mb-1.5">
                    Sample Voice Directives:
                  </div>
                  <div className="grid grid-cols-1 gap-1.5 text-xs">
                    {[
                      { label: 'Open What-If Simulator', phrase: 'Open What If' },
                      { label: '+20% Tree Canopy Cover', phrase: 'Increase tree cover by 20 percent' },
                      { label: 'Activate Flood Risk Layer', phrase: 'Show flood risk' },
                      { label: 'Rotate 3D Earth', phrase: 'Rotate Earth' },
                      { label: 'Target Amazon Basin', phrase: 'Go to Amazon' },
                      { label: 'Travel to Epoch 2018', phrase: 'Go to 2018' },
                      { label: 'Launch Science Expo', phrase: 'Start Science Expo' },
                    ].map((p, i) => (
                      <button
                        key={i}
                        onClick={() => processTextInputCommand(p.phrase)}
                        className="w-full text-left px-3 py-2 rounded-xl glass-panel-1 border border-white/5 hover:border-earth-aqua/30 text-slate-300 hover:text-white transition-all font-mono text-[11px] flex items-center justify-between"
                      >
                        <span>{p.label}</span>
                        <span className="text-[9px] text-earth-aqua font-sans">"{p.phrase}"</span>
                      </button>
                    ))}
                  </div>
                </div>
              </>
            ) : activeTab === 'history' ? (
              /* History Tab */
              <div className="space-y-3">
                <div className="flex items-center justify-between pb-1">
                  <span className="text-xs font-mono text-slate-400">
                    Logged Voice Interactions ({historyItems.length})
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleExportHistory}
                      className="p-1 text-slate-400 hover:text-white transition-colors"
                      title="Export History (JSON)"
                    >
                      <Download className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={handleClearHistory}
                      className="p-1 text-slate-400 hover:text-earth-coral transition-colors"
                      title="Clear History"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {historyItems.length === 0 ? (
                  <div className="p-6 text-center text-xs font-mono text-slate-500">
                    No voice interactions logged yet.
                  </div>
                ) : (
                  <div className="space-y-2">
                    {historyItems.map((item) => (
                      <div
                        key={item.id}
                        className="p-3 rounded-xl glass-panel-1 border border-white/10 space-y-1 text-xs font-mono"
                      >
                        <div className="flex items-center justify-between text-[10px] text-slate-400">
                          <span>{item.timestamp}</span>
                          <span
                            className={`font-bold ${
                              item.executionResult === 'SUCCESS'
                                ? 'text-earth-emerald'
                                : 'text-earth-coral'
                            }`}
                          >
                            {item.executionResult}
                          </span>
                        </div>
                        <div className="text-white font-medium">
                          You: "{item.userTranscript}"
                        </div>
                        <div className="text-slate-300 text-[11px]">
                          EarthMind: "{item.earthMindResponse}"
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : activeTab === 'diagnostics' ? (
              <div className="space-y-3 font-mono text-xs">
                <div className="p-3.5 rounded-2xl glass-panel-2 border border-earth-aqua/30 bg-earth-aqua/5 space-y-2.5">
                  <div className="flex items-center justify-between pb-2 border-b border-white/10">
                    <span className="text-[11px] font-bold text-white uppercase tracking-wider">
                      Gemini Live Session
                    </span>
                    <GlassBadge tone={geminiStatus === 'CONNECTED' ? 'emerald' : geminiStatus === 'ERROR' ? 'coral' : 'sun'} size="sm">
                      {geminiStatus}
                    </GlassBadge>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-[11px]">
                    <div>
                      <span className="text-slate-400 block text-[9px]">ENGINE MODE</span>
                      <span className="text-white font-bold">{activeEngineMode === 'gemini_live' ? 'GEMINI 2.0 LIVE' : 'DETERMINISTIC FALLBACK'}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[9px]">MODEL</span>
                      <span className="text-earth-aqua font-bold">gemini-2.0-flash-exp</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[9px]">AUDIO IN</span>
                      <span className="text-slate-200">16kHz PCM (mono)</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[9px]">AUDIO OUT</span>
                      <span className="text-slate-200">24kHz PCM (native)</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[9px]">ROUNDTRIP LATENCY</span>
                      <span className="text-earth-emerald font-bold">{geminiLatency > 0 ? `${geminiLatency} ms` : 'Standby / Low'}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[9px]">REGISTERED TOOLS</span>
                      <span className="text-amber-300 font-bold">24 Functions</span>
                    </div>
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl glass-panel-2 border border-white/10 space-y-2">
                  <span className="text-[11px] font-bold text-white uppercase tracking-wider block">
                    Security & Environment
                  </span>
                  <div className="space-y-1.5 text-[11px] text-slate-300">
                    <div className="flex items-center justify-between">
                      <span>Server Credentials:</span>
                      <span className="text-earth-emerald font-bold">Isolated (Server-Side)</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>WebSocket Gateway:</span>
                      <span className="text-earth-aqua">/api/gemini/live</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Barge-in / Interruption:</span>
                      <span className="text-white">Enabled</span>
                    </div>
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        </GlassCard>
      </div>
    </div>
  );
};
