import React from 'react';
import { ArrowUpRight, ArrowDownRight, Minus, TrendingUp, TrendingDown } from 'lucide-react';
import { GlassCard } from './GlassCard';

export interface GlassMetricProps {
  label: string;
  value: number | string;
  unit?: string;
  trend?: string;
  trendDirection?: 'up' | 'down' | 'neutral';
  delta?: number;
  deltaLabel?: string;
  reversePolarity?: boolean; // If true, lower is better (e.g. Risk, Pollution)
  statusTone?: 'emerald' | 'aqua' | 'aurora' | 'sun' | 'coral' | 'neutral';
  subtext?: string;
  context?: string;
  icon?: React.ReactNode;
  className?: string;
  glow?: 'none' | 'aqua' | 'emerald' | 'aurora' | 'sun' | 'coral' | 'accent';
}

export const GlassMetric: React.FC<GlassMetricProps> = ({
  label,
  value,
  unit = '',
  trend,
  trendDirection,
  delta,
  deltaLabel,
  reversePolarity = false,
  statusTone = 'neutral',
  subtext,
  context,
  icon,
  glow = 'none',
  className = '',
}) => {
  // Determine if delta is positive or negative for coloring
  const isPositive = delta !== undefined && delta > 0;
  const isNeutral = (delta === undefined || delta === 0) && !trend;

  let deltaColor = 'text-slate-400';
  let DeltaIcon = Minus;

  if (delta !== undefined && !isNeutral) {
    if (reversePolarity) {
      deltaColor = delta < 0 ? 'text-earth-emerald' : 'text-earth-coral';
      DeltaIcon = delta < 0 ? ArrowDownRight : ArrowUpRight;
    } else {
      deltaColor = delta > 0 ? 'text-earth-emerald' : 'text-earth-coral';
      DeltaIcon = delta > 0 ? ArrowUpRight : ArrowDownRight;
    }
  } else if (trendDirection) {
    if (reversePolarity) {
      deltaColor = trendDirection === 'down' ? 'text-earth-emerald' : 'text-earth-coral';
      DeltaIcon = trendDirection === 'down' ? TrendingDown : TrendingUp;
    } else {
      deltaColor = trendDirection === 'up' ? 'text-earth-emerald' : 'text-earth-coral';
      DeltaIcon = trendDirection === 'up' ? TrendingUp : TrendingDown;
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

  const trendDisplay = trend || (delta !== undefined ? `${delta > 0 ? '↑ +' : delta < 0 ? '↓ ' : ''}${delta}${unit}` : null);
  const contextDisplay = context || deltaLabel || subtext;

  return (
    <GlassCard
      variant="medium"
      glow={glow}
      interactive
      className={`p-4 rounded-2xl flex flex-col justify-between ${borderAccents[statusTone]} ${className}`}
    >
      {/* 1. ICON & 2. LABEL */}
      <div className="flex items-center justify-between gap-2">
        <span className="text-[11px] font-mono font-bold text-slate-400 uppercase tracking-wider truncate">
          {label}
        </span>
        {icon && (
          <div className="text-earth-aqua p-1 rounded-lg bg-white/5 border border-white/10 flex-shrink-0">
            {icon}
          </div>
        )}
      </div>

      {/* 3. PRIMARY VALUE */}
      <div className="my-2.5 flex items-baseline gap-1.5">
        <span className="text-2xl lg:text-3xl font-extrabold tracking-tight text-white font-mono">
          {value}
        </span>
        {unit && <span className="text-xs font-mono font-semibold text-slate-400">{unit}</span>}
      </div>

      {/* 4. TREND & 5. CONTEXT */}
      <div className="pt-2 border-t border-white/5 flex items-center justify-between text-xs font-mono">
        {trendDisplay ? (
          <div className={`flex items-center gap-1 font-semibold ${deltaColor}`}>
            <DeltaIcon className="w-3.5 h-3.5 flex-shrink-0" />
            <span>{trendDisplay}</span>
          </div>
        ) : (
          <span className="text-[10px] text-slate-400">Current reading</span>
        )}

        {contextDisplay && (
          <span className="text-[10px] text-slate-400 font-sans truncate max-w-[55%] text-right" title={contextDisplay}>
            {contextDisplay}
          </span>
        )}
      </div>
    </GlassCard>
  );
};
