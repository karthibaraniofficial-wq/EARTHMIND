import React, { useState } from 'react';
import { Mic, MicOff, Volume2, Sparkles, AlertCircle, Settings, X, ChevronUp, ChevronDown } from '../components/icons';
import { useVoice } from '../voice/VoiceContext';

export const VoiceDock: React.FC = () => {
  const {
    state,
    isListening,
    isSpeaking,
    audioLevel,
    liveTranscript,
    lastCommand,
    lastResponse,
    toggleListening,
    stopSpeaking,
    toggleVoicePanel,
  } = useVoice();

  const [isExpanded, setIsExpanded] = useState(false);
  const commandText = typeof lastCommand === 'string' ? lastCommand : lastCommand?.rawText || '';

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isSpeaking) {
      stopSpeaking();
    } else {
      toggleListening();
    }
  };

  const getStatusText = () => {
    switch (state) {
      case 'LISTENING':
        return 'Listening...';
      case 'PROCESSING':
        return 'Thinking...';
      case 'UNDERSTANDING':
        return 'Querying science data...';
      case 'EXECUTING':
        return 'Executing command...';
      case 'SPEAKING':
        return 'Speaking...';
      case 'REQUESTING_PERMISSION':
        return 'Connecting mic...';
      case 'ERROR':
        return 'Offline';
      default:
        return 'Voice';
    }
  };

  return (
    <div
      data-region="voice-dock"
      className="fixed bottom-[calc(var(--statusbar-height,36px)+12px)] right-4 z-[50] select-none pointer-events-auto flex flex-col items-end gap-2"
    >
      {/* Expanded Voice Console Drawer (Intentional, reserved surface) */}
      {isExpanded && (
        <div className="w-80 sm:w-96 rounded-2xl bg-[#071A2B]/95 border border-earth-aqua/40 shadow-2xl backdrop-blur-2xl p-4 text-slate-100 space-y-3 animate-in fade-in slide-in-from-bottom-4 duration-200">
          <div className="flex items-center justify-between border-b border-white/10 pb-2">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-earth-aqua animate-pulse" />
              <span className="text-xs font-mono font-bold text-white uppercase tracking-wider">
                EARTHMIND VOICE DOCK
              </span>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={toggleVoicePanel}
                className="p-1 rounded text-slate-400 hover:text-earth-aqua hover:bg-white/10"
                title="Full Voice Settings Panel"
              >
                <Settings className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setIsExpanded(false)}
                className="p-1 rounded text-slate-400 hover:text-white hover:bg-white/10"
                title="Collapse Voice Dock"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Transcript / Spoken Status */}
          <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 min-h-[64px] flex flex-col justify-center text-xs">
            {isListening && liveTranscript ? (
              <div className="text-earth-sky font-mono italic">
                "{liveTranscript}"
              </div>
            ) : isSpeaking && lastResponse ? (
              <div className="text-earth-emerald font-medium leading-relaxed">
                "{lastResponse}"
              </div>
            ) : commandText && lastResponse ? (
              <div className="space-y-1">
                <div className="text-[10px] font-mono text-slate-400">LAST: "{commandText}"</div>
                <div className="text-slate-200 line-clamp-2">"{lastResponse}"</div>
              </div>
            ) : (
              <div className="text-slate-400 font-mono text-[11px] text-center">
                Click microphone or say "Hello EarthMind" to speak
              </div>
            )}
          </div>

          {/* Primary Action Row */}
          <div className="flex items-center justify-between gap-2 pt-1">
            <button
              onClick={handleClick}
              className={`flex-1 py-2 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all ${
                isListening
                  ? 'bg-earth-coral text-white animate-pulse'
                  : isSpeaking
                  ? 'bg-earth-emerald text-[#071A2B]'
                  : 'bg-earth-aqua text-[#071A2B] hover:brightness-110 shadow-lg shadow-earth-aqua/20'
              }`}
            >
              {isListening ? (
                <>
                  <MicOff className="w-4 h-4" />
                  <span>Stop Listening</span>
                </>
              ) : isSpeaking ? (
                <>
                  <Volume2 className="w-4 h-4" />
                  <span>Interrupt (Barge-in)</span>
                </>
              ) : (
                <>
                  <Mic className="w-4 h-4" />
                  <span>Hold to Speak</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Docked Compact Control Pill (Default State) */}
      <div className="flex items-center gap-1.5 p-1 rounded-full glass-panel-2 border border-white/15 backdrop-blur-xl shadow-xl">
        <button
          onClick={handleClick}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-mono font-medium transition-all ${
            isListening
              ? 'bg-earth-aqua text-[#071A2B] font-bold shadow-md shadow-earth-aqua/30'
              : isSpeaking
              ? 'bg-earth-emerald text-[#071A2B] font-bold shadow-md shadow-earth-emerald/30'
              : 'text-slate-300 hover:text-white hover:bg-white/10'
          }`}
          title="Toggle EarthMind Spoken Voice"
        >
          {isListening ? (
            <Mic className="w-3.5 h-3.5 animate-pulse text-[#071A2B]" />
          ) : isSpeaking ? (
            <Volume2 className="w-3.5 h-3.5 animate-pulse text-[#071A2B]" />
          ) : (
            <Mic className="w-3.5 h-3.5 text-earth-aqua" />
          )}
          <span>{getStatusText()}</span>
        </button>

        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          title={isExpanded ? 'Collapse Dock' : 'Expand Voice Console'}
        >
          {isExpanded ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronUp className="w-3.5 h-3.5" />}
        </button>
      </div>
    </div>
  );
};
