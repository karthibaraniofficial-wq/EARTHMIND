import React from 'react';
import { Sparkles, Mic } from 'lucide-react';
import { useVoice } from '../../voice/VoiceContext';

interface VoiceCommandSuggestionsProps {
  currentView: string;
  className?: string;
}

export const VoiceCommandSuggestions: React.FC<VoiceCommandSuggestionsProps> = ({
  currentView,
  className = '',
}) => {
  const { processTextInputCommand } = useVoice();

  const getSuggestions = () => {
    switch (currentView) {
      case 'explorer':
        return [
          { label: 'Show flood risk', phrase: 'Show flood risk' },
          { label: 'Show temperature', phrase: 'Show surface temperature' },
          { label: 'Go to Amazon', phrase: 'Go to Amazon Rainforest' },
          { label: 'Rotate Earth', phrase: 'Rotate Earth' },
        ];
      case 'memory':
        return [
          { label: 'Go to 2018', phrase: 'Go to 2018' },
          { label: 'Play timeline', phrase: 'Play the timeline' },
          { label: 'What changed since 2018?', phrase: 'What changed since 2018?' },
          { label: 'Reset to 2010', phrase: 'Go to 2010' },
        ];
      case 'simulator':
        return [
          { label: '+20% Tree cover', phrase: 'Increase tree cover by 20 percent' },
          { label: '+30% Rainfall', phrase: 'Increase rainfall by 30 percent' },
          { label: '-15% Traffic', phrase: 'Reduce traffic by 15 percent' },
          { label: 'Run simulation', phrase: 'Run the simulation' },
          { label: 'Save scenario', phrase: 'Save this scenario' },
        ];
      case 'scenarios':
        return [
          { label: 'Compare with baseline', phrase: 'Compare with baseline' },
          { label: 'Open What-If', phrase: 'Open What If' },
        ];
      case 'reports':
        return [
          { label: 'Generate report', phrase: 'Generate a report' },
          { label: 'Export dossier', phrase: 'Export the report' },
        ];
      default:
        return [
          { label: 'Open Earth Explorer', phrase: 'Open Earth Explorer' },
          { label: 'Open What-If', phrase: 'Open What If' },
          { label: 'Start Science Expo', phrase: 'Start Science Expo' },
        ];
    }
  };

  const suggestions = getSuggestions();

  return (
    <div className={`flex items-center gap-1.5 overflow-x-auto pb-1 custom-scrollbar ${className}`}>
      <span className="text-[10px] font-mono text-slate-400 flex items-center gap-1 whitespace-nowrap pl-1 pr-1">
        <Sparkles className="w-3 h-3 text-earth-aqua" />
        Voice prompts:
      </span>
      {suggestions.map((s, idx) => (
        <button
          key={idx}
          onClick={() => processTextInputCommand(s.phrase)}
          className="px-2.5 py-1 rounded-xl glass-panel-1 border border-white/10 text-[11px] font-mono text-slate-300 hover:text-white hover:border-earth-aqua/40 hover:bg-earth-aqua/10 whitespace-nowrap transition-all flex items-center gap-1.5 group"
          title={`Simulate voice input: "${s.phrase}"`}
        >
          <Mic className="w-2.5 h-2.5 text-earth-aqua opacity-60 group-hover:opacity-100 transition-opacity" />
          <span>"{s.label}"</span>
        </button>
      ))}
    </div>
  );
};
