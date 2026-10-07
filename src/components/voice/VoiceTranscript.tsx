/**
 * EARTHMIND - Multimodal Voice Transcript & Dual-Tier Screen Card
 * Synchronizes real-time spoken audio with structured visual intelligence cards,
 * verified scientific citations, and separate EARTHMIND ANALYSIS vs EXTERNAL EVIDENCE.
 */

import React from 'react';
import { Sparkles, Check, Volume2, Mic, BookOpen, ExternalLink, ShieldCheck, ChevronRight, X } from '../icons';
import { useVoice } from '../../voice/VoiceContext';
import { GlassBadge } from '../glass/GlassBadge';

export const VoiceTranscript: React.FC = () => {
  const {
    state,
    isListening,
    isSpeaking,
    liveTranscript,
    lastCommand,
    lastResponse,
    settings,
    screenPayload,
    toggleSourcesPanel,
    researchSources,
  } = useVoice();

  if (!settings.captionsEnabled) return null;

  const showLiveBanner = isListening && liveTranscript;
  const showSpeakingBanner = isSpeaking && lastResponse;
  const showRecentSuccess = !isListening && !isSpeaking && lastCommand && lastResponse;

  const [dismissed, setDismissed] = React.useState(false);

  // Auto-dismiss recent success after 6 seconds
  React.useEffect(() => {
    if (showRecentSuccess) {
      setDismissed(false);
      const timer = setTimeout(() => setDismissed(true), 6000);
      return () => clearTimeout(timer);
    }
  }, [showRecentSuccess, lastResponse]);

  // Reset dismissed state on new speech/command
  React.useEffect(() => {
    if (isListening || isSpeaking) {
      setDismissed(false);
    }
  }, [isListening, isSpeaking]);

  if (dismissed) return null;
  if (!showLiveBanner && !showSpeakingBanner && !showRecentSuccess && !screenPayload) {
    return null;
  }

  return (
    <div className="fixed top-[calc(var(--topbar-height,56px)+12px)] left-1/2 transform -translate-x-1/2 z-[45] max-w-lg w-[92%] sm:w-[480px] pointer-events-auto animate-in fade-in slide-in-from-top-2 duration-200">
      <div className="glass-panel-3 p-3.5 rounded-2xl border border-earth-aqua/30 shadow-2xl backdrop-blur-2xl bg-[#071A2B]/95 text-slate-100 space-y-2.5">
        {/* Top Status Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-2">
          <div className="flex items-center gap-2">
            {isListening ? (
              <div className="p-1 rounded-lg bg-earth-aqua/20 border border-earth-aqua/40">
                <Mic className="w-3.5 h-3.5 text-earth-aqua animate-pulse" />
              </div>
            ) : isSpeaking ? (
              <div className="p-1 rounded-lg bg-earth-emerald/20 border border-earth-emerald/40">
                <Volume2 className="w-3.5 h-3.5 text-earth-emerald animate-pulse" />
              </div>
            ) : (
              <div className="p-1 rounded-lg bg-earth-aurora/20 border border-earth-aurora/40">
                <Sparkles className="w-3.5 h-3.5 text-earth-aurora" />
              </div>
            )}
            <span className="text-[11px] font-mono uppercase tracking-wider text-earth-aqua font-bold">
              {isListening
                ? 'Listening to operator...'
                : isSpeaking
                ? 'EarthMind Multimodal Voice'
                : 'Intelligence Output'}
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            {researchSources.length > 0 && (
              <button
                onClick={toggleSourcesPanel}
                className="text-[10px] font-mono text-earth-aqua hover:underline flex items-center gap-1 px-2 py-0.5 rounded bg-earth-aqua/10 border border-earth-aqua/20 hover:bg-earth-aqua/20 transition-all"
              >
                <BookOpen className="w-3 h-3" />
                {researchSources.length} Sources
                <ChevronRight className="w-3 h-3" />
              </button>
            )}

            <button
              onClick={() => setDismissed(true)}
              className="p-1 rounded text-slate-400 hover:text-white hover:bg-white/10"
              title="Dismiss Transcript Toast"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Live User Speech */}
        {showLiveBanner && (
          <div className="text-sm font-medium text-white italic">
            "{liveTranscript}"
          </div>
        )}

        {/* EarthMind Spoken Output */}
        {(showSpeakingBanner || showRecentSuccess) && !showLiveBanner && (
          <div className="space-y-1">
            <p className="text-xs sm:text-sm font-medium text-slate-100 leading-snug">
              "{lastResponse}"
            </p>
          </div>
        )}

        {/* Rich Structured Dual-Tier Payload (If available) */}
        {screenPayload && (
          <div className="pt-2 border-t border-white/10 space-y-2.5">
            {/* 1. EARTHMIND ANALYSIS */}
            <div className="p-2.5 rounded-xl bg-black/40 border border-white/5 space-y-1.5">
              <div className="flex items-center justify-between text-[10px] font-mono text-earth-emerald">
                <span className="font-bold tracking-wider">{screenPayload.earthmindAnalysis.heading}</span>
                {screenPayload.uncertainty && (
                  <span className="text-slate-400">
                    Confidence: {Math.round(screenPayload.uncertainty.confidence * 100)}%
                  </span>
                )}
              </div>
              <p className="text-[11px] text-slate-300 leading-relaxed">
                {screenPayload.earthmindAnalysis.summary}
              </p>

              {screenPayload.earthmindAnalysis.metrics && screenPayload.earthmindAnalysis.metrics.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5 pt-1 font-mono text-[10px]">
                  {screenPayload.earthmindAnalysis.metrics.slice(0, 3).map((m, i) => (
                    <div key={i} className="p-1 rounded bg-white/5 border border-white/5">
                      <span className="text-slate-400 block text-[9px] truncate">{m.label}</span>
                      <span className="text-white font-bold">{m.value}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* 2. EXTERNAL EVIDENCE (Strictly Separated) */}
            {screenPayload.externalEvidence && (
              <div className="p-2.5 rounded-xl bg-earth-aqua/5 border border-earth-aqua/20 space-y-1.5">
                <div className="flex items-center justify-between text-[10px] font-mono text-earth-aqua">
                  <span className="font-bold tracking-wider">{screenPayload.externalEvidence.heading}</span>
                  <GlassBadge tone="emerald" size="sm">
                    {screenPayload.externalEvidence.consensusStatus}
                  </GlassBadge>
                </div>
                <p className="text-[11px] text-slate-200 leading-relaxed">
                  {screenPayload.externalEvidence.summary}
                </p>

                {/* Clickable Source Chips */}
                {screenPayload.externalEvidence.sources && screenPayload.externalEvidence.sources.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {screenPayload.externalEvidence.sources.slice(0, 3).map((src: any) => (
                      <a
                        key={src.id}
                        href={src.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-white/10 hover:bg-earth-aqua/20 text-earth-aqua border border-earth-aqua/30 flex items-center gap-1 transition-colors"
                      >
                        <ShieldCheck className="w-2.5 h-2.5 text-earth-emerald" />
                        <span>{src.publisher.split('(')[0].trim()}</span>
                        <ExternalLink className="w-2.5 h-2.5 ml-0.5" />
                      </a>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
