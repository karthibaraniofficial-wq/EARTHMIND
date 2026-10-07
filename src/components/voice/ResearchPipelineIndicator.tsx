import React from 'react';
import { Search, ShieldCheck, Cpu, CheckCircle2 } from 'lucide-react';
import { BookOpen } from '../icons';
import { GlassSurface } from '../glass/GlassSurface';

export type ResearchStage = 'searching' | 'sources' | 'validating' | 'analyzing' | 'answer';

export interface ResearchPipelineIndicatorProps {
  currentStage?: ResearchStage;
  className?: string;
}

export const ResearchPipelineIndicator: React.FC<ResearchPipelineIndicatorProps> = ({
  currentStage = 'validating',
  className = '',
}) => {
  const stages: { id: ResearchStage; label: string; icon: React.ReactNode }[] = [
    { id: 'searching', label: 'SEARCHING', icon: <Search className="w-3.5 h-3.5" /> },
    { id: 'sources', label: 'SOURCES', icon: <BookOpen className="w-3.5 h-3.5" /> },
    { id: 'validating', label: 'VALIDATING', icon: <ShieldCheck className="w-3.5 h-3.5" /> },
    { id: 'analyzing', label: 'ANALYZING', icon: <Cpu className="w-3.5 h-3.5" /> },
    { id: 'answer', label: 'ANSWER', icon: <CheckCircle2 className="w-3.5 h-3.5" /> },
  ];

  const stageOrder: Record<ResearchStage, number> = {
    searching: 0,
    sources: 1,
    validating: 2,
    analyzing: 3,
    answer: 4,
  };

  const currentIndex = stageOrder[currentStage];

  return (
    <GlassSurface
      variant="glass-soft"
      className={`p-2.5 rounded-2xl border-white/10 flex items-center justify-between gap-1 max-w-full overflow-x-auto custom-scrollbar select-none ${className}`}
    >
      {stages.map((stage, idx) => {
        const isPassed = idx < currentIndex;
        const isCurrent = idx === currentIndex;
        return (
          <React.Fragment key={stage.id}>
            <div
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-[10px] font-mono font-bold transition-all whitespace-nowrap ${
                isCurrent
                  ? 'bg-earth-aqua text-[#071A2B] shadow-[0_0_15px_rgba(24,200,200,0.4)] animate-pulse'
                  : isPassed
                  ? 'bg-white/10 text-earth-emerald border border-earth-emerald/30'
                  : 'text-slate-400 opacity-60'
              }`}
            >
              {stage.icon}
              <span>{stage.label}</span>
            </div>

            {idx < stages.length - 1 && (
              <span className={`text-[10px] font-mono px-0.5 ${idx < currentIndex ? 'text-earth-emerald' : 'text-slate-600'}`}>
                →
              </span>
            )}
          </React.Fragment>
        );
      })}
    </GlassSurface>
  );
};
