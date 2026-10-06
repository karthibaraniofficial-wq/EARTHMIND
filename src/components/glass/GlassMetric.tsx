import React from 'react';
import { ArrowUpRight, ArrowDownRight, Minus } from 'lucide-react';
import { GlassCard } from './GlassCard';

interface GlassMetricProps {
  label: string;
  value: number | string;
  unit?: string;
  delta?: number;
  deltaLabel?: string;
  reversePolarity?: boolean; // If true, lower is better (e.g. Risk, Pollution)
  statusTone?: 'emerald' | 'aqua' | 'aurora' | 'sun' | 'coral' | 'neutral';
  subtext?: string;
  icon?: React.ReactNode;
  className?: string;
}

export const GlassMetric: React.FC<GlassMetricProps> = ({
  label,
  value,
  unit = '',
  delta,
  deltaLabel,
  reversePolarity = false,
  statusTone = 'neutral',
  subtext,
  icon,
  className = '',
}) => {
  // Determine if delta is positive or negative for coloring
  let isPositive = delta !== undefined && delta > 0;
  let isNeutral = delta === undefined || delta === 0;

  // If reverse polarity (e.g. Heat Risk), higher delta is worse (coral), lower is better (emerald)
  let deltaColor = 'text-slate-400';
  let DeltaIcon = Minus;

  if (!isNeutral && delta !== undefined) {
    if (reversePolarity) {
      deltaColor = delta < 0 ? 'text-earth-emerald' : 'text-earth-coral';
      DeltaIcon = delta < 0 ? ArrowDownRight : ArrowUpRight;
    } else {
      deltaColor = delta > 0 ? 'text-earth-emerald' : 'text-earth-coral';
      DeltaIcon = delta > 0 ? ArrowUpRight : ArrowDownRight;
    }
  }

  const borderAccents: Record<string, string> = {
    emerald: 'border-l-4 border-l-earth-emerald',
    aqua: 'border-l-4 border-l-earth-aqua',
    aurora: 'border-l-4 border-l-earth-aurora',
    sun: 'border-l-4 border-l-earth-sun',
    coral: 'border-l-4 border-l-earth-coral',
    neutral: '',
  };

  return (
    <GlassCard variant="medium" className={`p-4 ${borderAccents[statusTone]} ${className}`}>
      <div className="flex items-start justify-between">
        <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">{label}</span>
        {icon && <div className="text-slate-400 p-1 rounded-lg bg-white/5">{icon}</div>}
      </div>

      <div className="mt-2.5 flex items-baseline gap-1.5">
        <span className="text-2xl lg:text-3xl font-bold tracking-tight text-white font-mono">
          {value}
        </span>
        {unit && <span className="text-sm font-medium text-slate-400">{unit}</span>}
      </div>

      {(delta !== undefined || subtext) && (
        <div className="mt-2 flex items-center justify-between text-xs">
          {delta !== undefined ? (
            <div className={`flex items-center gap-1 font-mono font-medium ${deltaColor}`}>
              <DeltaIcon className="w-3.5 h-3.5" />
              <span>
                {delta > 0 ? `+${delta}` : delta}
                {unit}
              </span>
              {deltaLabel && <span className="text-slate-400 text-[11px] font-sans ml-0.5">{deltaLabel}</span>}
            </div>
          ) : (
            <span className="text-slate-400 text-[11px]">{subtext}</span>
          )}
        </div>
      )}
    </GlassCard>
  );
};
