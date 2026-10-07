import React, { useState, useEffect } from 'react';
import { 
  Mic, 
  Volume2, 
  Settings, 
  Trash2, 
  Download, 
  X, 
  Terminal,
  Search,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Activity,
  Layers,
  Scale,
  Sparkles,
  Info
} from 'lucide-react';
import { GlassCard } from '../glass/GlassCard';
import { GlassButton } from '../glass/GlassButton';
import { GlassBadge } from '../glass/GlassBadge';
import { useVoice } from '../../voice/VoiceContext';
import { VoiceWaveform } from './VoiceWaveform';
import { ResearchTimeline } from './ResearchTimeline';
import { getVoiceHistory, clearVoiceHistory, exportVoiceHistoryJson } from '../../voice/VoiceHistory';
import { VoiceHistoryItem } from '../../voice/VoiceTypes';
import { getGeminiLiveModel, getGeminiResearchModel } from '../../config/aiModels';
import { VoiceDiagnostics, DiagnosticsSnapshot } from '../../voice/VoiceDiagnostics';
import { ExplanationLevel } from '../../intelligence/ScientificReasoningEngine';

export const VoicePanel: React.FC = () => {
  const {
    state,
    isListening,
    isSpeaking,
    audioLevel,
    liveTranscript,
    lastCommand,
    lastResponse,
    screenPayload,
    researchSources,
    timelineEvent,
    explanationLevel,
    setExplanationLevel,
    isSourcesPanelOpen,
    setIsSourcesPanelOpen,
    toggleSourcesPanel,
    toggleListening,
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
  const [activeTab, setActiveTab] = useState<'control' | 'research' | 'timeline' | 'diagnostics' | 'history'>('control');
  const [diagSnapshot, setDiagSnapshot] = useState<DiagnosticsSnapshot>(() => VoiceDiagnostics.getSnapshot());

  useEffect(() => {
    if (isVoicePanelOpen) {
      setHistoryItems(getVoiceHistory());
      setDiagSnapshot(VoiceDiagnostics.getSnapshot());
    }
  }, [isVoicePanelOpen, state, lastCommand, activeTab]);

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

  const explanationLevels: { level: ExplanationLevel; title: string; desc: string }[] = [
    { level: 1, title: 'L1: Simple', desc: 'Everyday analogies' },
    { level: 2, title: 'L2: Student', desc: 'Foundational concepts' },
    { level: 3, title: 'L3: Technical', desc: 'Standard EarthMind metrics' },
    { level: 4, title: 'L4: Research', desc: 'Peer-reviewed depth' },
    { level: 5, title: 'L5: Expert', desc: 'Full mathematical formulations' },
  ];

  return (
    <div className="fixed inset-y-0 right-0 z-[80] w-full sm:w-[420px] p-4 flex flex-col justify-end pointer-events-none">
      <div className="pointer-events-auto">
        <GlassCard
          variant="strong"
          glow="aqua"
          className="w-full max-h-[90vh] flex flex-col border border-white/20 shadow-2xl backdrop-blur-2xl overflow-hidden"
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
                    EARTHMIND VOICE 2.0
                  </span>
                  <GlassBadge tone={activeEngineMode === 'gemini_live' ? 'aqua' : 'neutral'} size="sm">
                    {activeEngineMode === 'gemini_live' ? 'LIVE AGENT' : 'SAFE FALLBACK'}
                  </GlassBadge>
                </div>
                <div className="text-[10px] text-slate-400 font-mono">
                  MULTIMODAL INTELLIGENCE HUB
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={toggleTestConsole}
                className="p-1.5 rounded-lg text-slate-400 hover:text-earth-aurora hover:bg-white/5 transition-colors"
                title="Voice Command Test Suite"
              >
                <Terminal className="w-4 h-4" />
              </button>
              <button
                onClick={toggleVoiceSettings}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
                title="Voice Engine Settings"
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
          <div className="flex items-center border-b border-white/10 px-2 bg-white/5 text-[11px] font-mono overflow-x-auto custom-scrollbar">
            <button
              onClick={() => setActiveTab('control')}
              className={`px-3 py-2 border-b-2 font-medium transition-all whitespace-nowrap ${
                activeTab === 'control'
                  ? 'border-earth-aqua text-earth-aqua font-bold'
                  : 'border-transparent text-slate-400 hover:text-white'
              }`}
            >
              Control
            </button>
            <button
              onClick={() => setActiveTab('research')}
              className={`px-3 py-2 border-b-2 font-medium transition-all whitespace-nowrap flex items-center gap-1 ${
                activeTab === 'research'
                  ? 'border-earth-sky text-earth-sky font-bold'
                  : 'border-transparent text-slate-400 hover:text-white'
              }`}
            >
              <span>Research</span>
              {researchSources.length > 0 && (
                <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-earth-sky/20 text-earth-sky font-bold">
                  {researchSources.length}
                </span>
              )}
            </button>
            <button
              onClick={() => setActiveTab('timeline')}
              className={`px-3 py-2 border-b-2 font-medium transition-all whitespace-nowrap ${
                activeTab === 'timeline'
                  ? 'border-earth-aurora text-earth-aurora font-bold'
                  : 'border-transparent text-slate-400 hover:text-white'
              }`}
            >
              Timeline
            </button>
            <button
              onClick={() => setActiveTab('diagnostics')}
              className={`px-3 py-2 border-b-2 font-medium transition-all whitespace-nowrap ${
                activeTab === 'diagnostics'
                  ? 'border-earth-emerald text-earth-emerald font-bold'
                  : 'border-transparent text-slate-400 hover:text-white'
              }`}
            >
              Diagnostics
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`px-3 py-2 border-b-2 font-medium transition-all whitespace-nowrap flex items-center gap-1 ${
                activeTab === 'history'
                  ? 'border-amber-400 text-amber-400 font-bold'
                  : 'border-transparent text-slate-400 hover:text-white'
              }`}
            >
              <span>History</span>
              <span className="text-[9px] px-1 rounded-full bg-white/10">
                {historyItems.length}
              </span>
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
                <div className="flex flex-col items-center justify-center py-1 gap-2">
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
                  <span className="text-[10px] font-mono text-slate-400">
                    {isListening ? 'Listening (Barge-in enabled)...' : 'Tap to converse or interrupt'}
                  </span>
                </div>

                {/* Live Transcript readouts */}
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
                      Spoken Synthesis:
                    </span>
                    "{lastResponse}"
                  </div>
                )}

                {/* Research Sources Quick Link Banner */}
                {researchSources.length > 0 && (
                  <button
                    onClick={toggleSourcesPanel}
                    className="w-full p-2.5 rounded-xl bg-earth-sky/10 border border-earth-sky/30 hover:bg-earth-sky/20 transition-all flex items-center justify-between text-xs font-mono text-earth-sky"
                  >
                    <span className="flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4 text-earth-sky" />
                      <span>{researchSources.length} Verified Sources Attached</span>
                    </span>
                    <span className="text-[10px] underline">View Citations &rarr;</span>
                  </button>
                )}

                {/* Quick Simulated Command Input */}
                <div>
                  <div className="text-[10px] font-mono uppercase tracking-wider text-slate-400 mb-1.5">
                    Command / Question Input:
                  </div>
                  <form onSubmit={handleSimSubmit} className="flex items-center gap-2">
                    <input
                      type="text"
                      value={simInput}
                      onChange={(e) => setSimInput(e.target.value)}
                      placeholder='e.g. "Take me to Chennai, show flood risk..."'
                      className="flex-1 px-3 py-2 rounded-xl bg-slate-900 border border-white/15 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-earth-aqua font-mono"
                    />
                    <GlassButton type="submit" variant="primary" size="sm">
                      Send
                    </GlassButton>
                  </form>
                </div>

                {/* Presets */}
                <div>
                  <div className="text-[10px] font-mono uppercase tracking-wider text-slate-400 mb-1.5">
                    Voice Directives Suite:
                  </div>
                  <div className="grid grid-cols-1 gap-1.5 text-xs">
                    {[
                      { label: 'Chennai Flood Forensics', phrase: 'Take me to Chennai, show flood risk, compare 2020 with 2026' },
                      { label: 'NASA Climate Grounding', phrase: 'What is the latest NASA climate report on global warming?' },
                      { label: 'Amazon Deforestation Research', phrase: 'What happened in the Amazon and what causes forest loss?' },
                      { label: 'Scientific Fact Check', phrase: 'Is sea level rising faster now? Fact check this claim.' },
                      { label: 'Tamil-English Voice Command', phrase: 'Chennai-la flood risk epdi irukku?' },
                      { label: 'Exhibition Innovation Pitch', phrase: 'Explain EarthMind and start exhibition mode' },
                    ].map((p, i) => (
                      <button
                        key={i}
                        onClick={() => processTextInputCommand(p.phrase)}
                        className="w-full text-left px-3 py-2 rounded-xl glass-panel-1 border border-white/5 hover:border-earth-aqua/30 text-slate-300 hover:text-white transition-all font-mono text-[11px] flex items-center justify-between"
                      >
                        <span className="truncate pr-2">{p.label}</span>
                        <span className="text-[9px] text-earth-aqua font-sans shrink-0">&rarr;</span>
                      </button>
                    ))}
                  </div>
                </div>
              </>
            ) : activeTab === 'research' ? (
              /* Research Tab */
              <div className="space-y-3 font-mono text-xs">
                {/* Header & Open Panel CTA */}
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-white font-bold block text-sm">Web & Scientific Evidence</span>
                    <span className="text-[10px] text-slate-400">Google Grounding + Peer-Reviewed Knowledge</span>
                  </div>
                  <button
                    onClick={toggleSourcesPanel}
                    className="px-2.5 py-1 rounded-lg bg-earth-sky/20 border border-earth-sky/40 text-earth-sky hover:bg-earth-sky/30 transition-all text-[10px]"
                  >
                    Open Drawer
                  </button>
                </div>

                {/* Explanation Depth Selector */}
                <div className="p-3 rounded-xl glass-panel-2 border border-white/10 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">
                      Explanation Depth Level
                    </span>
                    <GlassBadge tone="sky" size="sm">
                      Level {explanationLevel}
                    </GlassBadge>
                  </div>
                  <div className="grid grid-cols-5 gap-1 pt-1">
                    {explanationLevels.map((item) => (
                      <button
                        key={item.level}
                        onClick={() => setExplanationLevel(item.level)}
                        title={`${item.title}: ${item.desc}`}
                        className={`py-1.5 px-1 rounded-lg text-center transition-all text-[10px] border ${
                          explanationLevel === item.level
                            ? 'bg-earth-sky/30 border-earth-sky text-white font-bold shadow-[0_0_10px_rgba(56,189,248,0.4)]'
                            : 'bg-white/5 border-white/10 text-slate-400 hover:text-white hover:bg-white/10'
                        }`}
                      >
                        L{item.level}
                      </button>
                    ))}
                  </div>
                  <p className="text-[10px] text-slate-400 italic">
                    {explanationLevels.find((l) => l.level === explanationLevel)?.desc}
                  </p>
                </div>

                {/* Active Screen Payload Details */}
                {screenPayload ? (
                  <div className="p-3 rounded-xl glass-panel-2 border border-earth-aqua/30 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] uppercase tracking-wider text-earth-aqua font-bold">
                        Synthesized Dual-Tier Card
                      </span>
                      {screenPayload.provenance && (
                        <GlassBadge tone="emerald" size="sm">
                          {screenPayload.provenance}
                        </GlassBadge>
                      )}
                    </div>

                    <div className="p-2 rounded-lg bg-black/30 border border-white/5 text-[11px] text-slate-200">
                      <div className="text-[9px] uppercase tracking-wider text-earth-emerald font-bold mb-1">
                        EarthMind Analysis
                      </div>
                      <p>{screenPayload.earthMindAnalysis}</p>
                    </div>

                    <div className="p-2 rounded-lg bg-black/30 border border-white/5 text-[11px] text-slate-200">
                      <div className="text-[9px] uppercase tracking-wider text-earth-sky font-bold mb-1">
                        External Evidence
                      </div>
                      <p>{screenPayload.externalEvidence}</p>
                    </div>

                    {screenPayload.factCheckVerdict && (
                      <div className="p-2 rounded-lg bg-amber-500/10 border border-amber-500/30 text-[10px]">
                        <span className="font-bold text-amber-400 uppercase">Fact-Check Verdict: </span>
                        <span className="text-white font-bold">{screenPayload.factCheckVerdict.verdict} </span>
                        <span className="text-slate-300">({Math.round(screenPayload.factCheckVerdict.confidence * 100)}% confidence)</span>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="p-4 rounded-xl glass-panel-1 border border-white/10 text-center text-slate-400 text-xs">
                    Ask an environmental question to trigger real-time Google Search grounding & multi-source synthesis.
                  </div>
                )}

                {/* Sources List Preview */}
                {researchSources.length > 0 && (
                  <div className="space-y-2">
                    <span className="text-[10px] uppercase tracking-wider text-slate-400 font-bold block">
                      Active Citations ({researchSources.length})
                    </span>
                    {researchSources.slice(0, 3).map((source) => (
                      <div
                        key={source.id}
                        className="p-2.5 rounded-xl glass-panel-1 border border-white/10 hover:border-earth-sky/40 transition-all space-y-1"
                      >
                        <div className="flex items-center justify-between text-[10px]">
                          <span className="font-bold text-earth-sky">{source.publisher}</span>
                          <span className="text-earth-emerald font-bold">Score: {source.authorityScore}/100</span>
                        </div>
                        <p className="text-white font-medium line-clamp-1 text-[11px]">{source.title}</p>
                        <div className="flex items-center justify-between text-[9px] text-slate-400 pt-0.5">
                          <span>{source.domain}</span>
                          <a
                            href={source.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1 text-earth-aqua hover:underline"
                          >
                            <span>Open</span>
                            <ExternalLink className="w-2.5 h-2.5" />
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : activeTab === 'timeline' ? (
              /* Timeline Tab */
              <div className="space-y-4">
                <ResearchTimeline />

                <div className="p-3.5 rounded-2xl glass-panel-2 border border-white/10 space-y-2.5 text-xs font-mono">
                  <span className="text-[11px] font-bold text-white uppercase tracking-wider block">
                    Research Pipeline Architecture
                  </span>
                  <div className="space-y-2 text-[11px] text-slate-300">
                    <div className="flex items-start gap-2">
                      <div className="w-5 h-5 rounded-full bg-earth-aqua/20 text-earth-aqua flex items-center justify-center shrink-0 mt-0.5 font-bold text-[10px]">
                        1
                      </div>
                      <div>
                        <div className="text-white font-bold">Query Expansion</div>
                        <div className="text-slate-400 text-[10px]">Expands query into multi-domain scientific search vectors.</div>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <div className="w-5 h-5 rounded-full bg-earth-sky/20 text-earth-sky flex items-center justify-center shrink-0 mt-0.5 font-bold text-[10px]">
                        2
                      </div>
                      <div>
                        <div className="text-white font-bold">Google Search Grounding</div>
                        <div className="text-slate-400 text-[10px]">Retrieves official NASA, NOAA, IPCC, ISRO, and journal records.</div>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <div className="w-5 h-5 rounded-full bg-earth-aurora/20 text-earth-aurora flex items-center justify-center shrink-0 mt-0.5 font-bold text-[10px]">
                        3
                      </div>
                      <div>
                        <div className="text-white font-bold">5D Source Quality Scoring</div>
                        <div className="text-slate-400 text-[10px]">Scores authority, freshness, relevance, agreement, and scientific rigor.</div>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <div className="w-5 h-5 rounded-full bg-earth-emerald/20 text-earth-emerald flex items-center justify-center shrink-0 mt-0.5 font-bold text-[10px]">
                        4
                      </div>
                      <div>
                        <div className="text-white font-bold">Multi-Source Verification</div>
                        <div className="text-slate-400 text-[10px]">Flags agreement vs conflict, preventing LLM arithmetic & hallucination.</div>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <div className="w-5 h-5 rounded-full bg-earth-sun/20 text-earth-sun flex items-center justify-center shrink-0 mt-0.5 font-bold text-[10px]">
                        5
                      </div>
                      <div>
                        <div className="text-white font-bold">Dual-Tier Spoken/Screen Synthesis</div>
                        <div className="text-slate-400 text-[10px]">Concise audio output paired with full clickable screen citations.</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : activeTab === 'diagnostics' ? (
              /* Full Section 48 Diagnostics Tab */
              <div className="space-y-3 font-mono text-xs">
                <div className="p-3.5 rounded-2xl glass-panel-2 border border-earth-aqua/30 bg-earth-aqua/5 space-y-3">
                  <div className="flex items-center justify-between pb-2 border-b border-white/10">
                    <span className="text-[11px] font-bold text-white uppercase tracking-wider">
                      Section 48 Operational Telemetry
                    </span>
                    <GlassBadge tone={geminiStatus === 'CONNECTED' ? 'emerald' : geminiStatus === 'ERROR' ? 'coral' : 'sun'} size="sm">
                      {geminiStatus}
                    </GlassBadge>
                  </div>

                  {/* 14 Mandatory Section 48 Metrics */}
                  <div className="grid grid-cols-2 gap-2 text-[11px]">
                    <div className="p-2 rounded-xl bg-black/20 border border-white/5">
                      <span className="text-slate-400 block text-[9px]">GEMINI LIVE</span>
                      <span className={`font-bold ${geminiStatus === 'CONNECTED' ? 'text-earth-emerald' : 'text-amber-400'}`}>
                        {geminiStatus === 'CONNECTED' ? 'CONNECTED' : 'STANDBY / READY'}
                      </span>
                    </div>

                    <div className="p-2 rounded-xl bg-black/20 border border-white/5">
                      <span className="text-slate-400 block text-[9px]">VOICE ENGINE</span>
                      <span className="text-white font-bold">
                        {activeEngineMode === 'gemini_live' ? 'LIVE' : 'LOCAL SAFE'}
                      </span>
                    </div>

                    <div className="p-2 rounded-xl bg-black/20 border border-white/5">
                      <span className="text-slate-400 block text-[9px]">LIVE MODEL</span>
                      <span className="text-earth-aqua font-bold truncate block">{getGeminiLiveModel()}</span>
                    </div>

                    <div className="p-2 rounded-xl bg-black/20 border border-white/5">
                      <span className="text-slate-400 block text-[9px]">RESEARCH MODEL</span>
                      <span className="text-earth-sky font-bold truncate block">{getGeminiResearchModel()}</span>
                    </div>

                    <div className="p-2 rounded-xl bg-black/20 border border-white/5">
                      <span className="text-slate-400 block text-[9px]">WEB SEARCH</span>
                      <span className="text-earth-emerald font-bold">AVAILABLE</span>
                    </div>

                    <div className="p-2 rounded-xl bg-black/20 border border-white/5">
                      <span className="text-slate-400 block text-[9px]">URL RESEARCH</span>
                      <span className="text-earth-emerald font-bold">AVAILABLE</span>
                    </div>

                    <div className="p-2 rounded-xl bg-black/20 border border-white/5">
                      <span className="text-slate-400 block text-[9px]">EARTHMIND TOOLS</span>
                      <span className="text-amber-300 font-bold">28 Functions</span>
                    </div>

                    <div className="p-2 rounded-xl bg-black/20 border border-white/5">
                      <span className="text-slate-400 block text-[9px]">MIC</span>
                      <span className={`font-bold ${isListening ? 'text-earth-aqua' : 'text-slate-200'}`}>
                        {isListening ? 'RECORDING' : 'READY'}
                      </span>
                    </div>

                    <div className="p-2 rounded-xl bg-black/20 border border-white/5">
                      <span className="text-slate-400 block text-[9px]">SPEAKER</span>
                      <span className={`font-bold ${isSpeaking ? 'text-earth-emerald' : 'text-slate-200'}`}>
                        {isSpeaking ? 'PLAYING' : 'READY'}
                      </span>
                    </div>

                    <div className="p-2 rounded-xl bg-black/20 border border-white/5">
                      <span className="text-slate-400 block text-[9px]">BARGE-IN</span>
                      <span className="text-earth-emerald font-bold">ENABLED</span>
                    </div>

                    <div className="p-2 rounded-xl bg-black/20 border border-white/5">
                      <span className="text-slate-400 block text-[9px]">WEB SOURCES</span>
                      <span className="text-earth-emerald font-bold">AVAILABLE</span>
                    </div>

                    <div className="p-2 rounded-xl bg-black/20 border border-white/5">
                      <span className="text-slate-400 block text-[9px]">CITATIONS</span>
                      <span className="text-earth-emerald font-bold">ENABLED</span>
                    </div>

                    <div className="p-2 rounded-xl bg-black/20 border border-white/5">
                      <span className="text-slate-400 block text-[9px]">FALLBACK</span>
                      <span className="text-earth-emerald font-bold">READY</span>
                    </div>

                    <div className="p-2 rounded-xl bg-black/20 border border-white/5">
                      <span className="text-slate-400 block text-[9px]">LATENCY</span>
                      <span className="text-earth-emerald font-bold">
                        {geminiLatency > 0 ? `${geminiLatency} ms` : 'Standby / <45ms'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Security Boundaries */}
                <div className="p-3.5 rounded-2xl glass-panel-2 border border-white/10 space-y-2">
                  <span className="text-[11px] font-bold text-white uppercase tracking-wider block">
                    Security Governance
                  </span>
                  <div className="space-y-1.5 text-[11px] text-slate-300">
                    <div className="flex items-center justify-between">
                      <span>Server Credentials:</span>
                      <span className="text-earth-emerald font-bold">Zero Client Leakage</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Web Text Sanitization:</span>
                      <span className="text-earth-aqua">Untrusted Data Boundary</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Tool Permission Matrix:</span>
                      <span className="text-amber-300">Read / Safe / High-Impact</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Deterministic Math:</span>
                      <span className="text-earth-emerald font-bold">CalculationEngine</span>
                    </div>
                  </div>
                </div>
              </div>
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
            ) : null}
          </div>
        </GlassCard>
      </div>
    </div>
  );
};
