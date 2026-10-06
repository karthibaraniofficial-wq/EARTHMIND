import React from 'react';
import { Mic, MicOff, Volume2, Sparkles, AlertCircle, Settings } from 'lucide-react';
import { useVoice } from '../../voice/VoiceContext';

export const VoiceOrb: React.FC = () => {
  const {
    state,
    isListening,
    isSpeaking,
    audioLevel,
    toggleListening,
    stopSpeaking,
    toggleVoicePanel,
  } = useVoice();

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
        return 'Processing...';
      case 'UNDERSTANDING':
        return 'Understanding...';
      case 'EXECUTING':
        return 'Applying command...';
      case 'SPEAKING':
        return 'EarthMind is responding...';
      case 'REQUESTING_PERMISSION':
        return 'Enabling mic...';
      case 'ERROR':
        return 'Microphone unavailable';
      default:
        return 'Tap to speak';
    }
  };

  const getOrbAura = () => {
    switch (state) {
      case 'LISTENING':
        return 'shadow-[0_0_35px_rgba(24,200,200,0.6)] border-earth-aqua';
      case 'PROCESSING':
      case 'UNDERSTANDING':
        return 'shadow-[0_0_35px_rgba(155,124,255,0.6)] border-earth-aurora animate-spin-slow';
      case 'EXECUTING':
        return 'shadow-[0_0_35px_rgba(39,201,138,0.7)] border-earth-emerald';
      case 'SPEAKING':
        return 'shadow-[0_0_35px_rgba(79,168,255,0.6)] border-earth-sky';
      case 'ERROR':
        return 'shadow-[0_0_35px_rgba(255,107,107,0.5)] border-earth-coral';
      default:
        return 'shadow-[0_0_20px_rgba(24,200,200,0.25)] border-white/20 hover:shadow-[0_0_30px_rgba(24,200,200,0.45)]';
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 group select-none">
      {/* Floating Status Pill */}
      <div
        onClick={toggleVoicePanel}
        className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full glass-panel-2 border border-white/15 backdrop-blur-xl shadow-xl cursor-pointer hover:border-earth-aqua/40 transition-all opacity-90 group-hover:opacity-100"
      >
        <span
          className={`w-2 h-2 rounded-full ${
            isListening
              ? 'bg-earth-aqua animate-ping'
              : isSpeaking
              ? 'bg-earth-emerald animate-pulse'
              : state === 'PROCESSING' || state === 'UNDERSTANDING'
              ? 'bg-earth-aurora animate-spin'
              : state === 'ERROR'
              ? 'bg-earth-coral'
              : 'bg-slate-400'
          }`}
        />
        <span className="text-xs font-mono font-medium text-slate-200">
          {getStatusText()}
        </span>
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleVoicePanel();
          }}
          className="p-1 text-slate-400 hover:text-earth-aqua rounded transition-colors"
          title="Voice Control Center"
        >
          <Settings className="w-3 h-3" />
        </button>
      </div>

      {/* Main 3D Floating Liquid Glass Orb */}
      <div className="relative">
        {/* Audio Reactive Glow Ring */}
        {isListening && (
          <div
            className="absolute -inset-2.5 rounded-full border border-earth-aqua/50 animate-ping opacity-75 pointer-events-none"
            style={{ transform: `scale(${1 + audioLevel * 0.4})` }}
          />
        )}

        <button
          onClick={handleClick}
          className={`relative w-14 h-14 rounded-full p-[2px] transition-all duration-300 transform active:scale-95 flex items-center justify-center ${getOrbAura()}`}
          title="Talk to EarthMind (Voice Intelligence Control)"
        >
          {/* Glass Spherical Background */}
          <div className="w-full h-full rounded-full bg-gradient-to-br from-[#0c2a47]/90 via-[#071A2B]/95 to-[#051320] backdrop-blur-2xl flex items-center justify-center relative overflow-hidden border border-white/20">
            {/* Soft Aurora Light Reflection */}
            <div className="absolute top-0 left-1/4 right-1/4 h-3 bg-gradient-to-b from-white/30 to-transparent rounded-full pointer-events-none" />

            {/* Icon depending on state */}
            {state === 'ERROR' ? (
              <AlertCircle className="w-6 h-6 text-earth-coral" />
            ) : isSpeaking ? (
              <Volume2 className="w-6 h-6 text-earth-emerald animate-pulse" />
            ) : state === 'PROCESSING' || state === 'UNDERSTANDING' ? (
              <Sparkles className="w-6 h-6 text-earth-aurora animate-spin" />
            ) : isListening ? (
              <Mic className="w-6 h-6 text-earth-aqua animate-pulse" />
            ) : (
              <Mic className="w-5 h-5 text-slate-300 group-hover:text-earth-aqua transition-colors" />
            )}
          </div>
        </button>
      </div>
    </div>
  );
};
