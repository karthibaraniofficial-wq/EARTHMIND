import React from 'react';
import { Sparkles, Check, Volume2, Mic } from 'lucide-react';
import { useVoice } from '../../voice/VoiceContext';

export const VoiceTranscript: React.FC = () => {
  const {
    state,
    isListening,
    isSpeaking,
    liveTranscript,
    lastCommand,
    lastResponse,
    settings,
  } = useVoice();

  if (!settings.captionsEnabled) return null;

  const showLiveBanner = isListening && liveTranscript;
  const showSpeakingBanner = isSpeaking && lastResponse;
  const showRecentSuccess = !isListening && !isSpeaking && lastCommand && lastResponse;

  if (!showLiveBanner && !showSpeakingBanner && !showRecentSuccess) {
    return null;
  }

  return (
    <div className="fixed bottom-24 left-1/2 transform -translate-x-1/2 z-40 max-w-xl w-[92%] sm:w-auto pointer-events-none animate-in fade-in slide-in-from-bottom-2 duration-200">
      <div className="glass-panel-3 px-4 py-2.5 rounded-2xl border border-white/20 shadow-2xl backdrop-blur-2xl flex items-center gap-3">
        {/* State Icon Indicator */}
        <div className="flex-shrink-0">
          {isListening ? (
            <div className="p-1.5 rounded-xl bg-earth-aqua/20 border border-earth-aqua/40">
              <Mic className="w-4 h-4 text-earth-aqua animate-pulse" />
            </div>
          ) : isSpeaking ? (
            <div className="p-1.5 rounded-xl bg-earth-emerald/20 border border-earth-emerald/40">
              <Volume2 className="w-4 h-4 text-earth-emerald animate-pulse" />
            </div>
          ) : (
            <div className="p-1.5 rounded-xl bg-earth-aurora/20 border border-earth-aurora/40">
              <Sparkles className="w-4 h-4 text-earth-aurora" />
            </div>
          )}
        </div>

        {/* Text Content */}
        <div className="flex-1 min-w-0">
          {showLiveBanner && (
            <div>
              <div className="text-[10px] font-mono text-earth-aqua uppercase tracking-wider flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-earth-aqua animate-ping" />
                Listening to speech...
              </div>
              <div className="text-sm font-medium text-white truncate">
                "{liveTranscript}"
              </div>
            </div>
          )}

          {showSpeakingBanner && (
            <div>
              <div className="text-[10px] font-mono text-earth-emerald uppercase tracking-wider flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-earth-emerald animate-pulse" />
                EarthMind responding
              </div>
              <div className="text-sm font-medium text-slate-100 line-clamp-2">
                "{lastResponse}"
              </div>
            </div>
          )}

          {showRecentSuccess && (
            <div>
              <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider flex items-center gap-1">
                <Check className="w-3 h-3 text-earth-emerald" />
                Command executed: {lastCommand.intent}
              </div>
              <div className="text-xs text-slate-200 truncate">
                {lastResponse}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
