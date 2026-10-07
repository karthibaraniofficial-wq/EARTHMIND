import React from 'react';

export type ScientificProvenance = 
  | 'OBSERVED' 
  | 'MODELED' 
  | 'SIMULATED' 
  | 'ESTIMATED' 
  | 'PROJECTED' 
  | 'DEMO';

export interface ScientificBadgeProps {
  provenance: ScientificProvenance;
  confidence?: number; // 0-100 or 0.0-1.0
  sensor?: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

const PROVENANCE_CONFIG: Record<ScientificProvenance, {
  label: string;
  badgeStyle: string;
  dotStyle: string;
  description: string;
}> = {
  OBSERVED: {
    label: 'OBSERVED',
    badgeStyle: 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300',
    dotStyle: 'bg-emerald-400',
    description: 'Empirical remote-sensing telemetry from calibrated orbital or ground sensors.',
  },
  MODELED: {
    label: 'MODELED',
    badgeStyle: 'bg-cyan-500/15 border-cyan-500/40 text-cyan-300',
    dotStyle: 'bg-cyan-400',
    description: 'Assimilation reanalysis model (ECMWF, ERA5, or CMIP6 ensemble).',
  },
  SIMULATED: {
    label: 'SIMULATED',
    badgeStyle: 'bg-amber-500/15 border-amber-500/40 text-amber-300',
    dotStyle: 'bg-amber-400',
    description: 'Synthetic biophysical counterfactual scenario output from EarthMind Coupled Engine.',
  },
  ESTIMATED: {
    label: 'ESTIMATED',
    badgeStyle: 'bg-purple-500/15 border-purple-500/40 text-purple-300',
    dotStyle: 'bg-purple-400',
    description: 'Geostatistical spatial interpolation with sensor gap-filling.',
  },
  PROJECTED: {
    label: 'PROJECTED',
    badgeStyle: 'bg-blue-500/15 border-blue-500/40 text-blue-300',
    dotStyle: 'bg-blue-400',
    description: 'Forward multi-decadal pathway trajectory under climate forcing pathways.',
  },
  DEMO: {
    label: 'DEMO / BENCHMARK',
    badgeStyle: 'bg-slate-500/20 border-slate-400/30 text-slate-300',
    dotStyle: 'bg-slate-400',
    description: 'Synthetic exhibition verification scenario.',
  },
};

export const ScientificBadge: React.FC<ScientificBadgeProps> = ({
  provenance,
  confidence,
  sensor,
  className = '',
  size = 'md',
}) => {
  const cfg = PROVENANCE_CONFIG[provenance] || PROVENANCE_CONFIG.OBSERVED;
  const confValue = confidence !== undefined
    ? confidence > 1 ? Math.round(confidence) : Math.round(confidence * 100)
    : null;

  const sizeClasses = {
    sm: 'text-[9px] px-2 py-0.5 gap-1',
    md: 'text-[10px] px-2.5 py-1 gap-1.5',
    lg: 'text-xs px-3 py-1.5 gap-2',
  }[size];

  return (
    <div
      className={`inline-flex items-center rounded-full border font-mono tracking-wider font-bold select-none backdrop-blur-md transition-all ${cfg.badgeStyle} ${sizeClasses} ${className}`}
      title={`${cfg.label}: ${cfg.description}${confValue ? ` (Confidence: ${confValue}%)` : ''}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dotStyle} animate-pulse`} />
      <span>{cfg.label}</span>
      {sensor && (
        <span className="opacity-75 font-normal border-l border-white/20 pl-1.5">
          {sensor}
        </span>
      )}
      {confValue !== null && (
        <span className="opacity-80 font-normal">
          {confValue}% conf
        </span>
      )}
    </div>
  );
};
