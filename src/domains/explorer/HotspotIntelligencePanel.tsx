import React from 'react';
import { 
  X, 
  Sparkles, 
  Clock, 
  Sliders, 
  ArrowRight, 
  CheckCircle2, 
  AlertTriangle, 
  Flame, 
  Droplets, 
  Wind, 
  Trees 
} from 'lucide-react';
import { GlassCard } from '../../components/glass/GlassCard';
import { GlassButton } from '../../components/glass/GlassButton';
import { GlassBadge } from '../../components/glass/GlassBadge';
import { EnvironmentalHotspot } from '../../types';

interface HotspotIntelligencePanelProps {
  hotspot: EnvironmentalHotspot | null;
  onClose: () => void;
  onNavigateToSimulator: (hotspot: EnvironmentalHotspot) => void;
  onNavigateToMemory: (hotspot: EnvironmentalHotspot) => void;
  onNavigateToForensics: (hotspot: EnvironmentalHotspot) => void;
}

export const HotspotIntelligencePanel: React.FC<HotspotIntelligencePanelProps> = ({
  hotspot,
  onClose,
  onNavigateToSimulator,
  onNavigateToMemory,
  onNavigateToForensics,
}) => {
  if (!hotspot) return null;

  const m = hotspot.currentMetrics;

  const getHealthTone = (score: number) => {
    if (score >= 75) return { color: 'text-earth-emerald', bg: 'bg-earth-emerald', tone: 'emerald' as const };
    if (score >= 55) return { color: 'text-earth-sun', bg: 'bg-earth-sun', tone: 'sun' as const };
    return { color: 'text-earth-coral', bg: 'bg-earth-coral', tone: 'coral' as const };
  };

  const health = getHealthTone(m.environmentalHealth);

  return (
    <div className="w-full lg:w-[420px] flex-shrink-0 animate-in slide-in-from-right duration-300">
      <GlassCard variant="strong" glow="aqua" className="h-full flex flex-col border border-white/20 shadow-2xl p-5 overflow-y-auto custom-scrollbar max-h-[85vh]">
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-white/10">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-earth-aqua animate-ping" />
              <span className="text-[10px] font-mono uppercase tracking-wider text-earth-aqua">
                {hotspot.region} • {hotspot.country}
              </span>
            </div>
            <h2 className="text-xl font-extrabold text-white mt-1 tracking-tight">{hotspot.name}</h2>
            <div className="text-xs text-slate-400 mt-0.5">{hotspot.primaryRisk}</div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Primary Health Score Hero Widget */}
        <div className="mt-4 p-4 rounded-2xl glass-panel-2 border border-white/10 flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Environmental Health Index
            </div>
            <div className="flex items-baseline gap-2 mt-1">
              <span className={`text-4xl font-extrabold font-mono ${health.color}`}>
                {m.environmentalHealth}
              </span>
              <span className="text-sm font-medium text-slate-400 font-mono">/ 100</span>
            </div>
            <div className="mt-1">
              <GlassBadge tone={health.tone} size="sm">
                {m.environmentalHealth >= 75 ? 'Resilient State' : m.environmentalHealth >= 55 ? 'Moderate Vulnerability' : 'Critical Depletion'}
              </GlassBadge>
            </div>
          </div>

          {/* Radial progress representation */}
          <div className="relative w-16 h-16 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
              <path
                className="text-white/10"
                strokeWidth="3.5"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path
                className={health.color}
                strokeDasharray={`${m.environmentalHealth}, 100`}
                strokeWidth="3.5"
                strokeLinecap="round"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
            <span className="absolute text-xs font-mono font-bold text-white">
              {m.environmentalHealth}%
            </span>
          </div>
        </div>

        {/* 4 Multi-stressor Indicator Grid */}
        <div className="mt-4 grid grid-cols-2 gap-2.5">
          <div className="p-3 rounded-xl glass-panel-1 border border-white/5">
            <div className="flex items-center gap-1.5 text-xs text-slate-400">
              <Flame className="w-3.5 h-3.5 text-earth-coral" />
              <span>Heat Risk</span>
            </div>
            <div className="text-xl font-bold font-mono text-white mt-1">{m.heatRisk}<span className="text-xs text-slate-400 font-normal">/100</span></div>
            <div className="text-[10px] text-earth-coral font-medium mt-0.5">+{m.surfaceTempAnomaly}°C thermal Mass</div>
          </div>

          <div className="p-3 rounded-xl glass-panel-1 border border-white/5">
            <div className="flex items-center gap-1.5 text-xs text-slate-400">
              <Droplets className="w-3.5 h-3.5 text-earth-sky" />
              <span>Flood Risk</span>
            </div>
            <div className="text-xl font-bold font-mono text-white mt-1">{m.floodRisk}<span className="text-xs text-slate-400 font-normal">/100</span></div>
            <div className="text-[10px] text-earth-sky font-medium mt-0.5">Hydraulic Runoff Vulnerability</div>
          </div>

          <div className="p-3 rounded-xl glass-panel-1 border border-white/5">
            <div className="flex items-center gap-1.5 text-xs text-slate-400">
              <Wind className="w-3.5 h-3.5 text-earth-aurora" />
              <span>Air Quality</span>
            </div>
            <div className="text-xl font-bold font-mono text-white mt-1">{m.pollutionAqi} <span className="text-xs text-slate-400 font-normal">AQI</span></div>
            <div className="text-[10px] text-earth-aurora font-medium mt-0.5">{m.pollutionAqi > 200 ? 'Severe Aerosol Entrapment' : 'Moderate Aerosol'}</div>
          </div>

          <div className="p-3 rounded-xl glass-panel-1 border border-white/5">
            <div className="flex items-center gap-1.5 text-xs text-slate-400">
              <Trees className="w-3.5 h-3.5 text-earth-leaf" />
              <span>Green Cover</span>
            </div>
            <div className="text-xl font-bold font-mono text-white mt-1">{m.greenCoverPct}<span className="text-xs text-slate-400 font-normal">%</span></div>
            <div className="text-[10px] text-earth-leaf font-medium mt-0.5">Urban Sprawl: +{m.urbanExpansionPct}%</div>
          </div>
        </div>

        {/* AI Forensic Observation Box */}
        <div className="mt-4 p-3.5 rounded-xl bg-earth-aurora/10 border border-earth-aurora/25 backdrop-blur-md">
          <div className="flex items-center gap-2 text-xs font-semibold text-earth-aurora">
            <Sparkles className="w-4 h-4" />
            <span>AI Neural Forensic Assessment</span>
          </div>
          <p className="text-xs text-slate-200 mt-2 leading-relaxed font-sans">
            "{hotspot.forensics.aiInvestigationSummary}"
          </p>
          <div className="text-[10px] font-mono text-slate-400 mt-2 flex items-center justify-between">
            <span>Model Confidence: 94.2%</span>
            <span className="text-earth-aqua">Period: {hotspot.forensics.period}</span>
          </div>
        </div>

        {/* Key Forensic Factors */}
        <div className="mt-4">
          <div className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
            Model-Associated Factors
          </div>
          <div className="space-y-1.5">
            {hotspot.forensics.factors.slice(0, 3).map((factor, idx) => (
              <div key={idx} className="p-2.5 rounded-lg glass-panel-1 border border-white/5 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-white">{factor.factor}</span>
                  <span className="font-mono text-[10px] text-earth-aqua">
                    {Math.round(factor.confidence * 100)}% Conf
                  </span>
                </div>
                <div className="text-[11px] text-slate-300 mt-1 leading-snug">
                  {factor.explanation}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons to cross-launch into other views */}
        <div className="mt-5 pt-4 border-t border-white/10 space-y-2">
          <GlassButton
            variant="primary"
            size="md"
            className="w-full justify-between"
            onClick={() => onNavigateToSimulator(hotspot)}
            rightIcon={<ArrowRight className="w-4 h-4" />}
          >
            <span>Simulate Futures on this Hotspot</span>
          </GlassButton>

          <div className="grid grid-cols-2 gap-2">
            <GlassButton
              variant="ghost"
              size="sm"
              onClick={() => onNavigateToMemory(hotspot)}
              leftIcon={<Clock className="w-3.5 h-3.5 text-earth-aqua" />}
            >
              Earth Memory
            </GlassButton>

            <GlassButton
              variant="ghost"
              size="sm"
              onClick={() => onNavigateToForensics(hotspot)}
              leftIcon={<Sparkles className="w-3.5 h-3.5 text-earth-aurora" />}
            >
              Full Forensics
            </GlassButton>
          </div>
        </div>
      </GlassCard>
    </div>
  );
};
