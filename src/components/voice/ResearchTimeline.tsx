/**
 * EARTHMIND - Research Timeline Component
 * Visually displays the 5 safe milestones during autonomous live web research:
 * SEARCHING -> SOURCE DISCOVERY -> SOURCE VALIDATION -> EVIDENCE ANALYSIS -> ANSWER
 */

import React from 'react';
import { Search, Compass, ShieldCheck, Cpu, CheckCircle2, Loader2 } from '../icons';
import { useVoice } from '../../voice/VoiceContext';
import { ResearchTimelineStage } from '../../intelligence/ResearchOrchestrator';

export const ResearchTimeline: React.FC = () => {
  const { timelineEvent } = useVoice();

  if (!timelineEvent || timelineEvent.stage === 'IDLE') return null;

  const stages: { key: ResearchTimelineStage; label: string; icon: any }[] = [
    { key: 'UNDERSTANDING', label: 'Understand', icon: Compass },
    { key: 'SEARCHING', label: 'Search', icon: Search },
    { key: 'VALIDATING', label: 'Validate', icon: ShieldCheck },
    { key: 'ANALYZING', label: 'Analyze', icon: Cpu },
    { key: 'COMPOSING', label: 'Compose', icon: CheckCircle2 },
    { key: 'SPEAKING', label: 'Speak', icon: Loader2 },
  ];

  // Map any legacy or sub-stage keys to primary timeline positions
  const stageMap: Record<string, number> = {
    UNDERSTANDING: 0,
    SEARCHING: 1,
    SOURCE_DISCOVERY: 1,
    VALIDATING: 2,
    SOURCE_VALIDATION: 2,
    ANALYZING: 3,
    EVIDENCE_ANALYSIS: 3,
    COMPOSING: 4,
    ANSWER: 4,
    SPEAKING: 5,
  };

  const currentIdx = stageMap[timelineEvent.stage] ?? -1;

  return (
    <div className="p-3 rounded-xl bg-[#071A2B]/90 border border-earth-aqua/30 backdrop-blur-md shadow-lg space-y-2">
      <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
        <span className="text-earth-aqua font-bold uppercase tracking-wider flex items-center gap-1.5">
          <Loader2 className="w-3 h-3 animate-spin text-earth-aqua" />
          Live Research Pipeline
        </span>
        <span>{timelineEvent.sourcesFound !== undefined ? `${timelineEvent.sourcesFound} sources` : 'In Progress'}</span>
      </div>

      {/* Steps visualization */}
      <div className="grid grid-cols-5 gap-1 pt-1">
        {stages.map((stage, idx) => {
          const isDone = currentIdx > idx;
          const isActive = currentIdx === idx;
          const Icon = stage.icon;

          return (
            <div key={stage.key} className="flex flex-col items-center text-center">
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center transition-all ${
                  isDone
                    ? 'bg-earth-emerald text-white'
                    : isActive
                    ? 'bg-earth-aqua text-black animate-pulse font-bold'
                    : 'bg-white/5 text-slate-500'
                }`}
              >
                <Icon className="w-3 h-3" />
              </div>
              <span
                className={`text-[8px] font-mono mt-1 leading-tight line-clamp-1 ${
                  isActive ? 'text-earth-aqua font-bold' : isDone ? 'text-slate-300' : 'text-slate-500'
                }`}
              >
                {stage.label}
              </span>
            </div>
          );
        })}
      </div>

      <div className="text-[10px] font-mono text-slate-300 truncate pt-1 border-t border-white/5">
        {timelineEvent.label}
      </div>
    </div>
  );
};
