import React, { useState } from 'react';
import { Info, ChevronDown, ChevronUp } from '../components/icons';

export interface ScoreContributionItem {
  id: string;
  name: string;
  percentage: number; // e.g. 28
  deltaPoints?: number; // e.g. +4.2
  color: string; // e.g. 'bg-emerald-400'
  rationale?: string;
}

export interface ScoreContributionBarProps {
  score: number;
  maxScore?: number;
  label?: string;
  items: ScoreContributionItem[];
  className?: string;
  defaultExpanded?: boolean;
}

export const ScoreContributionBar: React.FC<ScoreContributionBarProps> = ({
  score,
  maxScore = 100,
  label = 'Score Contribution Decomposition',
  items,
  className = '',
  defaultExpanded = false,
}) => {
  const [expanded, setExpanded] = useState(defaultExpanded);

  return (
    <div className={`p-3.5 rounded-xl bg-white/5 border border-white/10 text-slate-200 space-y-2.5 ${className}`}>
      {/* Header with expand toggle */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-300">
          <Info className="w-3.5 h-3.5 text-earth-aqua" />
          <span>{label}</span>
        </div>

        <button
          onClick={() => setExpanded(!expanded)}
          className="flex items-center gap-1 text-[11px] font-mono text-earth-aqua hover:underline transition-all"
        >
          <span>{expanded ? 'Hide Breakdown' : 'Explain Score'}</span>
          {expanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
        </button>
      </div>

      {/* Segmented Visual Contribution Bar */}
      <div className="w-full h-3 bg-slate-900 rounded-full overflow-hidden flex p-0.5 border border-white/10 gap-0.5">
        {items.map((item) => (
          <div
            key={item.id}
            style={{ width: `${item.percentage}%` }}
            className={`h-full rounded-sm ${item.color} transition-all duration-300`}
            title={`${item.name}: ${item.percentage}% of composite score`}
          />
        ))}
      </div>

      {/* Mini legend */}
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[10px] font-mono text-slate-400 pt-0.5">
        {items.slice(0, 4).map((item) => (
          <div key={item.id} className="flex items-center gap-1">
            <span className={`w-2 h-2 rounded-full ${item.color}`} />
            <span className="text-slate-300">{item.name}</span>
            <span className="font-bold text-white">{item.percentage}%</span>
          </div>
        ))}
      </div>

      {/* Detailed Accordion Breakdown */}
      {expanded && (
        <div className="pt-2 border-t border-white/10 space-y-2 animate-in fade-in duration-200">
          <div className="text-[10px] uppercase font-mono text-slate-400">
            Biophysical Driver Attribution Weights:
          </div>
          <div className="space-y-1.5">
            {items.map((item) => (
              <div
                key={item.id}
                className="p-2 rounded-lg bg-white/5 border border-white/5 text-xs flex flex-col gap-1"
              >
                <div className="flex items-center justify-between font-mono">
                  <div className="flex items-center gap-1.5">
                    <span className={`w-2 h-2 rounded-full ${item.color}`} />
                    <span className="font-semibold text-slate-100">{item.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {item.deltaPoints !== undefined && (
                      <span className={`text-[11px] font-bold ${
                        item.deltaPoints > 0 ? 'text-earth-emerald' : item.deltaPoints < 0 ? 'text-earth-coral' : 'text-slate-400'
                      }`}>
                        {item.deltaPoints > 0 ? `+${item.deltaPoints}` : item.deltaPoints} pts
                      </span>
                    )}
                    <span className="text-slate-300 font-bold">{item.percentage}% weight</span>
                  </div>
                </div>
                {item.rationale && (
                  <p className="text-[11px] text-slate-400 font-sans leading-tight">
                    {item.rationale}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
