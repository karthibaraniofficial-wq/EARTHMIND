import React from 'react';
import { Sparkles, BookOpen, ExternalLink, ShieldCheck, TrendingUp, TrendingDown } from '../components/icons';
import { ScientificBadge, ScientificProvenance } from './ScientificBadge';

// --- Level 1 / 2: Primary Card ---
export interface PrimaryCardProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  badge?: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
}

export const PrimaryCard: React.FC<PrimaryCardProps> = ({
  children,
  title,
  subtitle,
  badge,
  action,
  className = '',
}) => {
  return (
    <div className={`p-5 rounded-2xl glass-panel-2 border border-white/15 bg-[#071A2B]/80 shadow-2xl backdrop-blur-xl text-slate-100 ${className}`}>
      {(title || badge || action) && (
        <div className="flex items-center justify-between pb-3.5 border-b border-white/10 mb-4 gap-2">
          <div>
            {title && <h3 className="text-base font-bold text-white tracking-wide">{title}</h3>}
            {subtitle && <p className="text-xs text-slate-400 mt-0.5">{subtitle}</p>}
          </div>
          <div className="flex items-center gap-2">
            {badge}
            {action}
          </div>
        </div>
      )}
      {children}
    </div>
  );
};

// --- Level 3: Secondary Card ---
export interface SecondaryCardProps {
  children: React.ReactNode;
  title?: string;
  className?: string;
}

export const SecondaryCard: React.FC<SecondaryCardProps> = ({
  children,
  title,
  className = '',
}) => {
  return (
    <div className={`p-4 rounded-xl glass-panel-1 border border-white/10 bg-white/5 text-slate-200 ${className}`}>
      {title && (
        <div className="text-xs font-bold text-slate-300 pb-2 mb-2 border-b border-white/5">
          {title}
        </div>
      )}
      {children}
    </div>
  );
};

// --- Level 3: Metric Card ---
export interface MetricCardProps {
  label: string;
  value: string | number;
  unit?: string;
  baseline?: string | number;
  delta?: number;
  provenance?: ScientificProvenance;
  trend?: 'improving' | 'degrading' | 'neutral';
  icon?: React.ReactNode;
  className?: string;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  label,
  value,
  unit,
  baseline,
  delta,
  provenance,
  trend,
  icon,
  className = '',
}) => {
  const isPositive = delta !== undefined && delta > 0;
  const isNegative = delta !== undefined && delta < 0;

  return (
    <div className={`p-4 rounded-xl bg-white/5 border border-white/10 backdrop-blur-md space-y-2 ${className}`}>
      <div className="flex items-center justify-between text-xs text-slate-400">
        <div className="flex items-center gap-1.5 truncate">
          {icon && <span className="text-earth-aqua">{icon}</span>}
          <span className="font-medium text-slate-300 truncate">{label}</span>
        </div>
        {provenance && <ScientificBadge provenance={provenance} size="sm" />}
      </div>

      <div className="flex items-baseline justify-between">
        <div className="flex items-baseline gap-1">
          <span className="text-3xl font-extrabold font-mono text-white">{value}</span>
          {unit && <span className="text-xs font-mono text-slate-400">{unit}</span>}
        </div>

        {delta !== undefined && (
          <div className="flex items-center gap-1 text-xs font-mono font-bold">
            {isPositive ? (
              <TrendingUp className="w-3.5 h-3.5 text-earth-emerald" />
            ) : isNegative ? (
              <TrendingDown className="w-3.5 h-3.5 text-earth-coral" />
            ) : null}
            <span
              className={
                trend === 'improving'
                  ? 'text-earth-emerald'
                  : trend === 'degrading'
                  ? 'text-earth-coral'
                  : 'text-slate-400'
              }
            >
              {isPositive ? `+${delta}` : delta}
            </span>
          </div>
        )}
      </div>

      {baseline !== undefined && (
        <div className="text-[10px] font-mono text-slate-500">
          Baseline reference: <span className="text-slate-400">{baseline}</span>
        </div>
      )}
    </div>
  );
};

// --- Level 3: Insight Card ---
export interface InsightCardProps {
  title?: string;
  reasoning: string;
  confidence?: number;
  recommendation?: string;
  className?: string;
}

export const InsightCard: React.FC<InsightCardProps> = ({
  title = 'AI Coupled Physical Reasoning',
  reasoning,
  confidence = 88,
  recommendation,
  className = '',
}) => {
  return (
    <div className={`p-4 rounded-xl bg-earth-aurora/10 border border-earth-aurora/30 text-slate-200 space-y-2 ${className}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5 font-bold text-xs text-earth-aurora">
          <Sparkles className="w-4 h-4 text-earth-aurora" />
          <span>{title}</span>
        </div>
        <span className="text-[10px] font-mono text-earth-aurora/80 bg-earth-aurora/15 px-2 py-0.5 rounded-full border border-earth-aurora/20">
          {confidence}% confidence
        </span>
      </div>

      <p className="text-xs text-slate-200 leading-relaxed font-sans">
        "{reasoning}"
      </p>

      {recommendation && (
        <div className="pt-2 border-t border-earth-aurora/20 text-xs text-earth-aqua flex items-start gap-1.5">
          <span className="font-bold uppercase tracking-wider text-[10px]">Action:</span>
          <span>{recommendation}</span>
        </div>
      )}
    </div>
  );
};

// --- Level 4: Source Card (4-Tier Evidence) ---
export interface SourceCardProps {
  agency: string;
  dataset: string;
  tier?: 1 | 2 | 3 | 4;
  year?: number;
  url?: string;
  disagreement?: boolean;
  className?: string;
}

export const SourceCard: React.FC<SourceCardProps> = ({
  agency,
  dataset,
  tier = 1,
  year = 2026,
  url,
  disagreement = false,
  className = '',
}) => {
  const tierLabels = {
    1: 'Tier 1 • Space Agency / Intergovernmental',
    2: 'Tier 2 • Academic / Peer-Reviewed',
    3: 'Tier 3 • Verified Scientific Journalism',
    4: 'Tier 4 • Supplementary Sensor Feed',
  };

  return (
    <div className={`p-2.5 rounded-lg bg-white/5 border border-white/5 text-[11px] font-mono flex items-center justify-between gap-2 ${className}`}>
      <div className="space-y-0.5 truncate">
        <div className="flex items-center gap-1.5">
          <ShieldCheck className="w-3 h-3 text-earth-emerald flex-shrink-0" />
          <span className="font-bold text-white truncate">{agency}</span>
          <span className="text-[9px] px-1.5 py-0.2 rounded bg-white/10 text-slate-300">
            {year}
          </span>
        </div>
        <div className="text-slate-400 text-[10px] truncate">{dataset}</div>
        <div className="text-[9px] text-slate-500">{tierLabels[tier]}</div>
      </div>

      <div className="flex items-center gap-1 flex-shrink-0">
        {disagreement && (
          <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-earth-coral/20 border border-earth-coral/30 text-earth-coral">
            Conflict
          </span>
        )}
        {url && (
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="p-1 rounded text-slate-400 hover:text-earth-aqua hover:bg-white/10 transition-colors"
            title="Inspect Source Record"
          >
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        )}
      </div>
    </div>
  );
};
