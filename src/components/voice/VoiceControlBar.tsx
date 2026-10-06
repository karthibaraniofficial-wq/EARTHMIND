import React from 'react';
import { Mic, MicOff, Volume2, Sparkles, Settings, Terminal } from 'lucide-react';
import { useVoice } from '../../voice/VoiceContext';

interface VoiceControlBarProps {
  className?: string;
}

export const VoiceControlBar: React.FC<VoiceControlBarProps> = ({ className = '' }) => {
  const {
    state,
    isListening,
    isSpeaking,
    toggleListening,
    stopSpeaking,
    toggleVoicePanel,
    toggleTestConsole,
    liveTranscript,
  } = useVoice();

  return (
    <div
      className={`glass-panel-1 px-3 py-1.5 rounded-2xl border border-white/10 flex items-center justify-between gap-3 backdrop-blur-md ${className}`}
    >
      <div className="flex items-center gap-2 min-w-0">
        <button
          onClick={isSpeaking ? stopSpeaking : toggleListening}
          className={`p-2 rounded-xl transition-all duration-200 ${
            isListening
              ? 'bg-earth-aqua text-[#071A2B] shadow-[0_0_15px_rgba(24,200,200,0.5)]'
              : isSpeaking
              ? 'bg-earth-emerald text-[#071A2B] animate-pulse'
              : 'bg-white/10 text-slate-300 hover:text-white hover:bg-white/15'
          }`}
          title={isListening ? 'Stop listening' : 'Talk to EarthMind'}
        >
          {isListening ? (
            <Mic className="w-4 h-4 animate-pulse" />
          ) : isSpeaking ? (
            <Volume2 className="w-4 h-4" />
          ) : (
            <Mic className="w-4 h-4" />
          )}
        </button>

        <div className="min-w-0">
          <div className="text-[10px] font-mono text-slate-400 uppercase tracking-tight flex items-center gap-1.5">
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                isListening
                  ? 'bg-earth-aqua animate-ping'
                  : isSpeaking
                  ? 'bg-earth-emerald animate-pulse'
                  : 'bg-slate-500'
              }`}
            />
            <span>{isListening ? 'Listening' : isSpeaking ? 'Speaking' : 'Voice Control'}</span>
          </div>
          <div className="text-xs font-mono text-white truncate max-w-[180px] sm:max-w-xs">
            {liveTranscript ? `"${liveTranscript}"` : 'Press to speak or use Space'}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-1 flex-shrink-0">
        <button
          onClick={toggleTestConsole}
          className="p-1.5 rounded-lg text-slate-400 hover:text-earth-aurora transition-colors"
          title="Voice Test Console"
        >
          <Terminal className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={toggleVoicePanel}
          className="p-1.5 rounded-lg text-slate-400 hover:text-white transition-colors"
          title="Voice Settings & Control Center"
        >
          <Settings className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
