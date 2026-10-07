import React from 'react';
import { Sparkles, Mic, Volume2, BookOpen, ChevronRight, ShieldCheck } from '../components/icons';
import { useVoice } from '../voice/VoiceContext';

export interface InsightPanelProps {
  className?: string;
  variant?: 'panel' | 'inline' | 'compact';
}

export const InsightPanel: React.FC<InsightPanelProps> = ({
  className = '',
  variant = 'panel',
}) => {
  const {
    isListening,
    isSpeaking,
    liveTranscript,
    lastCommand,
    lastResponse,
    researchSources,
    toggleSourcesPanel,
    screenPayload,
  } = useVoice();

  const showLive = isListening && liveTranscript;
  const showResponse = (isSpeaking || lastResponse) && !showLive;
  const commandText = typeof lastCommand === 'string' ? lastCommand : lastCommand?.rawText || '';

  if (!showLive && !showResponse && !screenPayload) {
    return (
      <div className={`p-3 rounded-xl border border-white/10 bg-white/5 text-xs text-slate-400 font-mono ${className}`}>
        <div className="flex items-center gap-2 text-slate-300 font-bold mb-1">
          <Sparkles className="w-3.5 h-3.5 text-earth-aqua" />
          <span>INTELLIGENCE STREAM</span>
        </div>
        <p className="text-[11px] text-slate-400">
          Awaiting multimodal voice command or simulation event. Spoken conclusions and citations appear here without covering your workspace.
        </p>
      </div>
    );
  }

  return (
    <div className={`rounded-xl border border-earth-aqua/30 bg-[#071A2B]/90 p-3 space-y-2.5 transition-all ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/10 pb-2">
        <div className="flex items-center gap-1.5">
          {isListening ? (
            <div className="p-1 rounded bg-earth-aqua/20 border border-earth-aqua/40">
              <Mic className="w-3 h-3 text-earth-aqua animate-pulse" />
            </div>
          ) : isSpeaking ? (
            <div className="p-1 rounded bg-earth-emerald/20 border border-earth-emerald/40">
              <Volume2 className="w-3 h-3 text-earth-emerald animate-pulse" />
            </div>
          ) : (
            <div className="p-1 rounded bg-earth-aurora/20 border border-earth-aurora/40">
              <Sparkles className="w-3 h-3 text-earth-aurora" />
            </div>
          )}
          <span className="text-[10px] font-mono uppercase tracking-wider text-earth-aqua font-bold">
            {isListening
              ? 'OPERATOR SPEECH'
              : isSpeaking
              ? 'EARTHMIND VOICE SYNTHESIS'
              : 'INTELLIGENCE OUTPUT'}
          </span>
        </div>

        {researchSources.length > 0 && (
          <button
            onClick={toggleSourcesPanel}
            className="text-[10px] font-mono text-earth-aqua hover:underline flex items-center gap-1 px-1.5 py-0.5 rounded bg-earth-aqua/10 border border-earth-aqua/20"
          >
            <BookOpen className="w-3 h-3" />
            <span>{researchSources.length} Sources</span>
            <ChevronRight className="w-3 h-3" />
          </button>
        )}
      </div>

      {/* Live transcript or Last Response */}
      {showLive && (
        <div className="text-xs font-mono text-earth-sky italic">
          "{liveTranscript}"
        </div>
      )}

      {showResponse && (
        <div className="space-y-1">
          {commandText && (
            <div className="text-[10px] font-mono text-slate-400">
              CMD: <span className="text-slate-300">"{commandText}"</span>
            </div>
          )}
          <p className="text-xs text-slate-100 font-medium leading-relaxed">
            "{lastResponse}"
          </p>
        </div>
      )}

      {/* Structured Screen Payload Highlights if present */}
      {screenPayload && screenPayload.externalEvidence?.sources && (
        <div className="pt-1.5 border-t border-white/10 space-y-1">
          <div className="text-[9px] font-mono uppercase text-slate-400">Grounding Evidence:</div>
          <div className="flex flex-wrap gap-1">
            {screenPayload.externalEvidence.sources.slice(0, 2).map((s: any, idx: number) => (
              <span key={idx} className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-white/5 border border-white/10 text-slate-300 truncate max-w-full">
                {s.agency} ({s.dataset})
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
