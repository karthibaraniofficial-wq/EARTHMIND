import React from 'react';
import { Mic, Volume2, Sparkles } from 'lucide-react';
import { useVoice } from '../../voice/VoiceContext';

export const VoiceStatusIndicator: React.FC = () => {
  const { state, isListening, isSpeaking, toggleListening } = useVoice();

  if (state === 'IDLE') return null;

  return (
    <div
      onClick={toggleListening}
      className="flex items-center gap-1.5 px-2.5 py-1 rounded-full glass-panel-2 border border-earth-aqua/30 text-xs font-mono cursor-pointer hover:border-earth-aqua/60 transition-all select-none animate-in fade-in"
      title="Click to toggle voice listening"
    >
      {isListening ? (
        <>
          <span className="w-2 h-2 rounded-full bg-earth-aqua animate-ping" />
          <span className="text-earth-aqua font-bold text-[11px]">LISTENING</span>
        </>
      ) : isSpeaking ? (
        <>
          <span className="w-2 h-2 rounded-full bg-earth-emerald animate-pulse" />
          <span className="text-earth-emerald font-bold text-[11px]">SPEAKING</span>
        </>
      ) : state === 'PROCESSING' || state === 'UNDERSTANDING' ? (
        <>
          <Sparkles className="w-3 h-3 text-earth-aurora animate-spin" />
          <span className="text-earth-aurora font-bold text-[11px]">THINKING</span>
        </>
      ) : (
        <span className="text-slate-400 text-[11px]">{state}</span>
      )}
    </div>
  );
};
